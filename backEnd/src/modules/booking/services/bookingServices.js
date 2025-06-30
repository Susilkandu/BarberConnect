const {ObjectId} = require("mongodb");
const SalonServices = require ( "../../salon/models/salonServicesModel.js");
const Salon  = require("../../salon/models/salonModel.js");
const Booking = require("../../booking/models/bookingModel.js");
const path = require("path");
const { Schema } = require("mongoose");


const bookSlot = async (
  name,
  customer_id,
  salon_id,
  selected_service_ids = [],
  paymentMode,
  selectedDate
) => {
  try {
    console.log("Booking request:", {
      customer_id,
      salon_id,
      selected_service_ids,
      paymentMode,
      selectedDate,
    });

    // Input validation
    if (!name || !customer_id || !salon_id || !selected_service_ids.length || !selectedDate) {
      return { success: false, message: "Missing required booking data" };
    }

    const bookingDate = new Date(selectedDate);
    if (isNaN(bookingDate.getTime())) {
      return { success: false, message: "Invalid date format" };
    }

    // Prevent past date bookings
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const bookingDayStart = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());

    if (bookingDayStart < todayStart) {
      return { success: false, message: "Cannot book in the past" };
    }

    // Get salon details
    const salon = await Salon.findById(salon_id);
    if (!salon) {
      return { success: false, message: "Salon not found" };
    }

    // Check for unavailable dates
    const isUnavailable = salon.unavailable_dates.some(date =>
      new Date(date.date).toDateString() === bookingDate.toDateString()
    );
    if (isUnavailable) {
      return { success: false, message: "Selected date is not available for booking" };
    }

    const dayOfWeek = bookingDate.getDay();
    const operatingHours = salon.operating_hours.get(dayOfWeek.toString());

    if (!operatingHours || !operatingHours.is_open) {
      return { success: false, message: "Salon is closed on the selected day" };
    }

    const [openingHour, openingMinute] = operatingHours.opening.split(":").map(Number);
    const [closingHour, closingMinute] = operatingHours.closing.split(":").map(Number);

    const openingTime = new Date(bookingDate.getTime());
    openingTime.setHours(openingHour, openingMinute, 0, 0);

    const closingTime = new Date(bookingDate.getTime());
    closingTime.setHours(closingHour, closingMinute, 0, 0);

    // Get service details
    const services = await SalonServices.find({
      salon_id: new ObjectId(salon_id),
      _id: { $in: selected_service_ids.map(id => new ObjectId(id)) },
      isDeleted: { $ne: true },
    }).populate("service_id", "name");

    if (!services.length) {
      return { success: false, message: "No valid services found for this salon" };
    }

    const required_services = services.map(s => ({
      service_id: s.service_id._id,
      name: s.service_id.name,
      price: s.price,
      estimated_duration: s.estimated_duration,
      gender: s.gender,
    }));

    const total_price = services.reduce((sum, s) => sum + s.price, 0);

    let totalDuration = services.reduce((sum, s) => sum + s.estimated_duration, 0);
    if (services.length > 1) {
      totalDuration += (services.length - 1) * salon.slot_configuration.buffer_time;
    }

    const availableSlot = await findAvailableSlot(
      salon_id,
      bookingDate,
      totalDuration,
      openingTime,
      closingTime,
      salon.slot_configuration
    );

    if (!availableSlot) {
      return {
        success: false,
        message: `No available slots. Salon allows max ${salon.slot_configuration.max_parallel_bookings} parallel bookings.`,
      };
    }

    const booking = new Booking({
      customer_id,
      name,
      salon_id,
      required_services,
      total_price,
      paymentMode,
      bookingDate: new Date(),
      starting_time_slot: availableSlot.startTime,
      ending_time_slot: availableSlot.endTime,
      status: paymentMode === "online" ? "confirmed" : "pending",
    });

    await booking.save();

    return {
      success: true,
      message: "Booking successful",
      data: {
        bookingId: booking._id,
        name,
        salon_name: salon.salon_name,
        required_services,
        paymentMode,
        status: booking.status,
        date: bookingDate.toISOString().split("T")[0],
        starting_time: availableSlot.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ending_time: availableSlot.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),

      },
    };
  } catch (error) {
    console.error("Booking error:", { message: error.message, stack: error.stack });
    return { success: false, message: "Booking failed", error: error.message };
  }
};
// Helper function to find available slot
async function findAvailableSlot(
  salon_id,
  bookingDate,
  durationMinutes,
  openingTime,
  closingTime,
  slotConfig
) {
  const salon = await Salon.findById(salon_id).select("slot_configuration");
  const maxParallel = salon.slot_configuration.max_parallel_bookings;
  const buffer = slotConfig.buffer_time;

  const dayStart = new Date(bookingDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(bookingDate);
  dayEnd.setHours(23, 59, 59, 999);

  const existingBookings = await Booking.find({
    salon_id,
    starting_time_slot: { $gte: dayStart, $lt: dayEnd },
    status: { $in: ["confirmed", "pending"] },
  });

  const now = new Date();
  const isToday = bookingDate.toDateString() === now.toDateString();

  let minStartTime = new Date(openingTime);
  if (isToday) {
    const bufferNow = new Date(now);
    bufferNow.setMinutes(bufferNow.getMinutes() + buffer);
    minStartTime = bufferNow > openingTime ? bufferNow : openingTime;
  }

  const step = 5; // minute interval to check for available slot
  let current = new Date(minStartTime);

  while (current.getTime() + (durationMinutes + buffer) * 60000 <= closingTime.getTime()) {
    const startTime = new Date(current);
    const endTime = new Date(current.getTime() + durationMinutes * 60000);
    const extendedEndTime = new Date(endTime.getTime() + buffer * 60000); // buffer added after

    // Count overlapping bookings
    const overlapping = existingBookings.filter(b => {
      return (
        b.starting_time_slot < extendedEndTime &&
        b.ending_time_slot > startTime
      );
    });

    if (overlapping.length < maxParallel) {
      return {
        startTime,
        endTime: extendedEndTime,
      };
    }

    // Move to next slot
    current.setMinutes(current.getMinutes() + step);
  }

  return null;
}


module.exports={
    bookSlot
}