const ErrorHandler = require("../../../core/middlewares/errors/errorHandler");
const catchAsyncError = require("../../../core/middlewares/errors/catchAsyncError");

const {sendOtpOnEmailForCustomer, resenOtpForCustomer, verifyOtpForCustomer, saveNameGenderPhone, saveDobPsdLctn, login, sendOtpToEmailForResetPsd,
  updatePassword, fetchProfile, uploadNewProfilePhoto, updateCustomerProfile,
  fetchBookingHistory,
  fetchBookingDetails,
} = require("../services/customerServices");

// controller for sending otp on the email for registration
const sendOtpOnEmailForReg = catchAsyncError(async(req, res, next)=>{
  const {email} = req.body;
  const data = await sendOtpOnEmailForCustomer(email);
  if(!data.success) return res.status(400).json(data);
  return res.status(200).json(data);
});

//controller for verifying the otp that is sent on the email for registration and sending a token
const verifyOtpForReg = catchAsyncError(async(req, res, next)=>{
  const {email, otp} = req.body;
  const data = await verifyOtpForCustomer(email, otp);
  if(!data.success) return res.status(400).json(data);
  const token = data?.data?.token;
  // sending the cookies for maintaining the session
  res.cookie('customerToken',token, {
    httpOnly: false,
    // secuer: ENV.MODE == 'production',
    sameSite: "Lax",
    patch:"/",
    maxAge:31*24*60*60*1000,
  });
  return res.status(200).json(data);
})

// controller for getting the registration step
const getRegistrationStep  = catchAsyncError(async(req, res, next)=>{
  const step = req.customer.profile_completion;
  return res.status(200).json({success:true, message: ` you are on ${step} step`, data:{ step}});
})
//controller for saving basic bio and contact details for the registration
const saveBasicInfoFoReg = catchAsyncError(async(req, res, next)=>{
const {name, gender, phone} = req.body;
const {_id} = req.customer._id;
const data = await saveNameGenderPhone(name, gender, phone, _id);
if(!data.success) return res.status(400).json(data);
return res.status(200).json(data);
});

//controller for saving the date of birth, password and live location
const saveDobPsdAndLctnForReg = catchAsyncError(async(req, res, next)=>{
  const {dob, password, location_coordinates} = req.body;
  const {_id} = req.customer._id;
  const data = await saveDobPsdLctn(dob,password,location_coordinates, _id);
  if(!data.success) return res.status(400).json(data);
  return res.status(200).json(data);
});

// controller for login via credential

const loginViaCredential = catchAsyncError(async(req, res, next)=>{
  const {email, password} = req.body;
  const data = await login(email, password);
  if(!data.success) return res. status(401).json(data);
  const token = data.data.token;
  res.cookie('customerToken', token, {
    httpOnly: false,
    // secure: ENV.MODE == 'production',
    sameSite: "Lax",
    path: "/",
    maxAge: 31*24*60*60*1000
  });
  data.data = undefined;
  return res.status(200).json(data);
});

// controller for sending otp on the email for reset password

const sendOtpToResetPsd = catchAsyncError(async (req, res, next) =>{
  const {email} = req.body;
  const data = await sendOtpToEmailForResetPsd(email);
  
  if(!data.success){
    return res.status(400).json(data);
  }
  return res.status(201).json(data);
});

// verify otp and update password
const verifyOtpAndUpdatePass = catchAsyncError( async (req, res) => {
  const {email, eOtp, password} = req.body;
  const data = await updatePassword(email, eOtp, password);
  if(!data.success){
    return res.status(400).json(data);
  }
  return res.status(200).json(data);
});

//  Controller for View Profile Info
const getProfile = catchAsyncError(async (req, res, next) => {
  const _id = req.customer._id;
  const data = await fetchProfile(_id);

  if(!data.success){
    return res.status(400).json(data);
  }
  return res.status(200).json(data);
});

// for upload or change Profile photo
const changeProfilePhoto = catchAsyncError(async (req, res, next) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({success:false,message: "Please upload a profile photo"});
  }
  const data = await uploadNewProfilePhoto(req.file.filename,req.customer._id);
  if(!data.success){
    return res.status(400).json(data);
  }
  return res.status(200).json(data);
});

const updateProfile = catchAsyncError(async (req, res, next) => {
  const allowedFields = [
    "name", "phone", "gender", "dob",
     "address.street", "address.state", "address.city", "address.postalCode",
    "location_coordinates",
  ];

  const filteredData = {};
  const getNestedValue = (obj, path) =>
    path.split('.').reduce((o, key) => (o && o[key] !== undefined) ? o[key] : undefined, obj);

  allowedFields.forEach((field) => {
    const value = getNestedValue(req.body, field);
    if (value !== undefined) {
      filteredData[field] = value;
    }
  });

 const data = await updateCustomerProfile(filteredData, req.customer._id);
  if (!data.success) return res.status(400).json(data);
  return res.status(200).json(data);
});

// for getting Booking History
const getBookingHistory = catchAsyncError(async (req, res, next) =>{
const data = await fetchBookingHistory(req.customer._id);
if(!data.success){
  return res.status(400).json(data);
  }
return res.status(200).json(data);
});

// for getting Booking details
const getBookingDetails = catchAsyncError(async(req, res, next)=>{
  const {bookingId} = req.params;
  const customer_id = req.customer._id;
  const data = await fetchBookingDetails(customer_id, bookingId);
  if(!data.success){
  return res.status(400).json(data);
    }
  return res.status(200).json(data);
})

module.exports = {
sendOtpOnEmailForReg,
getRegistrationStep,
verifyOtpForReg,
saveBasicInfoFoReg,
saveDobPsdAndLctnForReg,
loginViaCredential,
sendOtpToResetPsd,
verifyOtpAndUpdatePass,
getProfile,
changeProfilePhoto,
updateProfile,
getBookingHistory, 
getBookingDetails
}