import { useDispatch } from "react-redux";
import bookingServices from "../../../../services/customer/booking";
import requestHandler from "../../../../utils/requestHandler";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { AiOutlineCalendar } from "react-icons/ai";
import { FaRupeeSign } from "react-icons/fa";
import { MdPending, MdDone, MdCancel } from "react-icons/md";

export default function BookingHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  const fetchBookingHistory = async () => {
    await requestHandler(
      dispatch,
      () => bookingServices.getBookingHistory(),
      0,
      {
        onSuccess: (res) => {
          setBookings(res.data.data);
        },
      }
    );
  };

  const redirectOnBookingDetails = (_id) => {
    navigate("/customer/bookingDetails", { state: { booking_id: _id } });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <MdPending className="text-yellow-500" size={20} />;
      case "completed":
        return <MdDone className="text-green-600" size={20} />;
      case "cancelled":
        return <MdCancel className="text-red-500" size={20} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    (async () => {
      await fetchBookingHistory();
    })();
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-700">Your Booking History</h2>
      {bookings.length <= 0 ? (
        <div className="text-center text-gray-500">No Booking History Available</div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              onClick={() => redirectOnBookingDetails(b._id)}
              className="flex items-center justify-between p-4 rounded-2xl shadow-md bg-gradient-to-r from-blue-50 to-blue-100 hover:scale-105 transform transition duration-300 cursor-pointer"
            >
              {/* Left: Salon Initial in Circle */}
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white font-semibold rounded-full shadow">
                {b?.salon_name[0]}
              </div>

              {/* Middle: Salon Name & Date */}
              <div className="flex-1 mx-4">
                <div className="text-lg font-medium text-gray-800">{b.salon_name}</div>
                <div className="flex items-center text-sm text-gray-600 mt-1 space-x-2">
                  <AiOutlineCalendar size={16} />
                  <span>{new Date(b.bookingDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1 space-x-2">
                  <FaRupeeSign size={12} />
                  <span>{b.total_price}</span>
                </div>
              </div>

              {/* Right: Status & Arrow */}
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-1">
                  {getStatusIcon(b.status)}
                  <span className="capitalize text-sm text-gray-700">{b.status}</span>
                </div>
                <MdOutlineArrowForwardIos size={14} className="text-gray-400 mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
