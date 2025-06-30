const { ObjectId } = require("mongodb");
const Salon = require("../models/salonModel.js");
const Booking = require("../../booking/models/bookingModel.js");
const MasterServices = require("../models/masterServicesModel.js");
const SalonServices = require("../models/salonServicesModel.js");

const bcrypt = require("bcryptjs");
const path = require("path");

const {
  generateOtp,
  sendMail,
} = require("../../../core/utils/email/emailService.js");
const generateOTPEmailHtml = require("../../../core/utils/email/templates/generateOTPEMailHtml.js");
const { generateToken } = require("../../../core/utils/jwt/generateToken.js");
const { deleteFile } = require("../../../core/utils/fileUploader.js");

// Step 1: Create basic account
const createSalonAccount = async ({ owner_name, email, phone, password }) => {
  const existingSalon = await Salon.findOne({ email });

  if (existingSalon && existingSalon.is_verified) {
    return { success: false, message: "Email Id is Already Registered" };
  }
  // If salon exists but not verified, update OTP
  if (existingSalon) {
    const otp = generateOtp();
    const expireIn = new Date(Date.now() + 5 * 60 * 1000);
    const updatedSalon = await Salon.findOneAndUpdate(
      { email },
      { $set: { otp, otp_expiry: expireIn } },
      { new: true }
    );
    if (!updatedSalon?._id)
      return { success: false, message: "Please Try Again Later" };
    const html = generateOTPEmailHtml(otp);
    await sendMail(email, "OTP for Business Registration", html);
    const token = generateToken(updatedSalon._id);
    return { success: true, token, message: "OTP sent to email" };
  }

  // If salon does not exist, create new
  const hashedPassword = await bcrypt.hash(password, 8);
  const otp = generateOtp();
  const expireIn = new Date(Date.now() + 5 * 60 * 1000);

  const newSalon = await Salon.create({
    owner_name,
    email,
    phone,
    password: hashedPassword,
    location_coordinates: { type: "Point", coordinates: [0, 0] },
    otp,
    otp_expiry: expireIn,
    profile_completion: 1.1,
  });
  const html = generateOTPEmailHtml(otp);
  await sendMail(email, "OTP for Business Registration", html);
  const token = generateToken(newSalon._id);
  return { success: true, token, message: "OTP sent to email" };
};

// Stemp 1.1 : Verify the otp
const verifyEmailOtp = async (salon_id, eOtp) => {
  const now = new Date();
  const updatedSalon = await Salon.findOneAndUpdate(
    {
      _id: salon_id,
      otp: eOtp,
      otp_expiry: { $gt: now },
    },
    {
      $set: {
        is_verified: true,
        otp: null,
        otp_expiry: null,
        profile_completion: 2,
      },
    }
  ).select("_id");
  if (!updatedSalon)
    return { success: false, message: "Invalid or Expired Otp" };
  return { success: true, message: "OTP Verified" };
};

// Step 2: Add business details
const updateSalonDetails = async (
  id,
  { salon_name, full_address, location_coordinates }
) => {
  const updatedSalon = await Salon.findByIdAndUpdate(id, {
    salon_name,
    full_address,
    location_coordinates,
    updated_at: new Date(),
    profile_completion: 3,
  }).select("_id");

  if (!updatedSalon._id) return { success: false, message: "Please try again" };
  return { success: true, message: "Step 2 Completed" };
};
// for change price range
const updatePriceRange = async(salon_id, min, max)=>{
  console.log(salon_id)
  const data = await Salon.findByIdAndUpdate(salon_id, {$set:{'average_price_range.min':min, 'average_price_range.max':max}});
  console.log(data)
  if(!data) return {success: false, message:"Some Error Occured Please Try Again Later"};
  return {success: true, message:"Updated"};
}
// Step 4: Add media and social links
const updateSalonProfile = async (id, { bio, experience, social_links }) => {
  if (!Array.isArray(social_links)) {
    social_links = [social_links];
  }
  const updatedSalon = await Salon.findByIdAndUpdate(id, {
    $set: {
      bio,
      experience,
      profile_completion: 5,
    },
    ...(social_links?.length > 0 && {
      $push: {
        social_links: {
          $each: social_links,
        },
      },
    }),
  }).select("_id");
  if (!updatedSalon) return { success: false, message: "Please Try Again" };
  return { success: true, message: "Profile Details Added" };
};

// Step 5: Add payment details and finalize profile
const updateSalonBankDetails = async (id, { bank_details }) => {
  const updatedSalon = await Salon.findByIdAndUpdate(id, {
    bank_details,
    onboarding_stage: "profile_complete",
    updated_at: new Date(),
    profile_completion: 6,
  }).select("_id");
  if (!updatedSalon) return { success: false, message: "Please Try Again" };
  return { success: true, message: "Bank Detaill Added" };
};

const updateWorkingDetails = async(id, filter)=>{
  const updatedSalon = await Salon.findByIdAndUpdate(id, {$set : filter}).select("_id");
  if(!updatedSalon?._id) return { success: false, message:"Please Try Again Later Some Error Occured"};
  return { success: true, message: "Saved"};
}

// Step 6: Login
const login = async ({ email, password }) => {
  const result = await Salon.findOne({ email }).select(
    "_id password profile_completion"
  );
  if (!result) return { success: false, message: "Invalid Credential" };
  const isMatch = await bcrypt.compare(password, result.password);
  if (!isMatch) return { success: false, message: "Invalid Credential" };
  const token = generateToken(result._id);
  return { success: true, message: "Logged In", data: { token: token } };
};
// For Send OTP On Email For Reset Password
const sendOtpToEmailForResetPsd = async (email) => {
  const otp = generateOtp();
  const expireIn = new Date(Date.now() + 5 * 60 * 1000);
  const result = await Salon.findOneAndUpdate(
    { email: email },
    { $set: { otp: otp, otp_expiry: expireIn } }
  );

  if (!result)
    return {
      success: false,
      message: "Account does not exist Please Create New Account",
    };
  const html = generateOTPEmailHtml(otp);
  sendMail(email, "OTP for Reset Password", html);
  return { success: true, message: `OTP sent on ${email}` };
};
// For Update Password
const updatePassword = async (email, eOtp, password) => {
  const salonData = await Salon.findOne({ email }).select(
    "_id otp_expiry otp "
  );
  if (!salonData) return { success: false, message: "Email not registered" };
  const now = new Date();
  if (salonData.otp_expiry < now)
    return { success: false, message: "OTP expired. Please Resend OTP." };
  if (!salonData.otp || salonData.otp !== eOtp)
    return { success: false, message: "Invalid OTP" };
  const hashedPassword = await bcrypt.hash(password, 8);
  const ack = await Salon.findByIdAndUpdate(salonData._id, {
    $set: { password: hashedPassword, otp: null, otp_expiry: null },
  });
  if (!ack)
    return {
      success: false,
      message: "Some Error Occured Please Try again later",
    };
  return { success: true, message: "Password Changed successfully" };
};

// Step 8: Fetch Profile
const fetchProfile = async (salon_id) => {
  const profile = await Salon.find({ _id: salon_id }).select("-password");
  if (!profile) return { success: false, message: "Profile details not exist" };
  return { success: true, message: "Fetched", data: { ...profile } };
};
// Step 9: For change the profile photo (optional)
const uploadNewProfilePhoto = async (newFileName, salon_id) => {
  // Update the user's profile in the database
  const updatedSalon = await Salon.findByIdAndUpdate(salon_id, {
    $set: {
      profile_image: newFileName,
      updatedAt: Date.now(),
    },
  });
  const oldFileName = updatedSalon.profile_image;
  // deleting the previous profile photo)
  if (oldFileName) {
    deleteFile(path.join(__dirname + "../../../../../../files/" + oldFileName));
  }
  if (!newFileName)
    return { success: false, message: "Failed to upload profile photo" };
  return {
    success: true,
    message: "Updated profile photo",
    data: { newProfileLink: newFileName },
  };
};
// for change Banner
const uploadNewBannerPhoto = async (newFileName, salon_id) => {
  // Update the user's profile in the database
  const updatedSalon = await Salon.findByIdAndUpdate(salon_id, {
    $set: {
      banner: newFileName,
      updatedAt: Date.now(),
    },
  });
  const oldFileName = updatedSalon.banner;
  // deleting the previous profile photo)
  if (oldFileName) {
    deleteFile(path.join(__dirname + "../../../../../../files/" + oldFileName));
  }
  if (!newFileName)
    return { success: false, message: "Failed to upload Banner" };
  return {
    success: true,
    message: "Updated Banner",
    data: { newProfileLink: newFileName },
  };
};

// For fetch All Master Services
const fetchAllMasterServices = async () => {
  const mServices = await MasterServices.find({});
  if (!mServices || mServices.length < 1)
    return {
      success: false,
      message: "Master Services Not Found, Please Contact to Admin",
    };
  return { success: true, message: "Fetched", data: mServices };
};

// For Add services & pricing
const addNewSalonService = async ({
  salon_id,
  service_id,
  price,
  estimated_duration,
  gender,
}) => {
  service_id = new ObjectId(service_id);
  const updatedSalon = await SalonServices.updateOne(
    { salon_id, service_id },
    {
      $set: { price, estimated_duration, gender },
      $unset: { isDeleted: "" },
    },
    { upsert: true }
  );
  if (!updatedSalon) return { success: false, message: "Please Try Again" };
  return { success: true, message: "Services Added" };
};

// For Fetch All Salon Services
const fetchAllSalonServices = async (salon_id) => {
  const mServices = await SalonServices.find({
    salon_id,
    isDeleted: { $ne: true },
  })
    .populate("service_id")
    .select("-salon_id");
  if (!mServices || mServices.length < 1)
    return { success: false, message: "Please Add New Services" };
  return { success: true, message: "Fetched", data: mServices };
};

// For Remove service~
const deleteSalonServices = async (salon_id, service_id) => {
  service_id = new ObjectId(service_id);
  const ack = await SalonServices.updateOne(
    { salon_id, service_id },
    {
      $set: { isDeleted: true },
    }
  );
  if (!ack.modifiedCount) return { success: false, message: "Failed" };
  return { success: true, message: "deleted" };
};
// For fetch Bookings
const fetchBookings = async (salon_id, selectedDate) => {
    const query = { salon_id };
    console.log(selectedDate);
    if (selectedDate) {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.starting_time_slot = { $gte: startOfDay, $lte: endOfDay };
    }
    const bookings = await Booking.find(query);
    if (bookings.length === 0) {
      return { success: false, message: "No bookings found" };
    }
    return { success: true, message: "Bookings fetched", data: bookings };
};


module.exports = {
  createSalonAccount,
  verifyEmailOtp,
  updateSalonDetails,
  updatePriceRange,
  updateSalonProfile,
  updateSalonBankDetails,
  updateWorkingDetails,
  login,
  sendOtpToEmailForResetPsd,
  updatePassword,
  fetchProfile,
  uploadNewProfilePhoto,
  uploadNewBannerPhoto,
  fetchAllMasterServices,
  addNewSalonService,
  fetchAllSalonServices,
  deleteSalonServices,
  fetchBookings,
};
