const ENV = require('../../../config/env.js');
const catchAsyncError = require('../../../core/middlewares/errors/catchAsyncError.js');
const {
  createSalonAccount,
  verifyEmailOtp,
  updateSalonDetails,
  updatePriceRange,
  updateSalonProfile,
  updateSalonBankDetails,
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
  updateWorkingDetails,
  fetchBookings
} = require('../services/salonServices.js');

//  Step 1: Register Basic Info
const registerBasicInfo = catchAsyncError(async(req, res, next) => {
  const data =  await createSalonAccount(req.body);
  if(!data.success) return res.status(400).json(data);
  res.cookie('salonToken', data?.token, {
    httpOnly: false,
    // secure: ENV.MODE == 'production',
    sameSite: "Lax",
    path: '/',
    maxAge: 31*24*60*60*1000,
  })
  data.token = undefined;
  return res.status(201).json(data);
});
//  Step 1.1 Verify Email Via OTP
const verifyEmailViaOTP = catchAsyncError(async(req,res,next)=>{
  const {eOtp} = req.body;
  const data = await verifyEmailOtp(req.salon._id,eOtp);
  if(!data?.success) return res.status(422).json(data);
  return res.status(200).json(data);
})

//  Step 2: Add Business Details
const addSalonDetails = catchAsyncError(async (req, res, next) => {
  const id = req.salon._id;
  const data = await updateSalonDetails(id, req.body);
  if(!data?.success) return res.status(400).json(data);
  return res.status(200).json(data);
});

//  Step 4: Add Profile and Social Links
const addProfileDetails = catchAsyncError(async (req, res, next) => {
  const _id = req.salon._id;
  const data = await updateSalonProfile(_id, req.body);

  if(!data.success) return res.status(400).json(data);
  return res.status(200).json(data);
});

//  Step 5: Add Bank Details
const addBankDetails = catchAsyncError(async (req, res, next) => {
  const _id = req.salon._id;
  const data = await updateSalonBankDetails(_id, req.body);
  
  if(!data.success) return res.status(400).json(data);
  return res.status(200).json(data);
});

const changeWorkingDetails = catchAsyncError(async (req, res, next) =>{
  const id = req.salon._id;
  const {opening_hour, closing_hour, working_days} = req.body;
  const filter = {};
  if (opening_hour) filter.opening_hour = opening_hour;
  if (closing_hour) filter.closing_hour = closing_hour;
  if (working_days) filter.working_days = working_days;
  const data = await updateWorkingDetails(id,filter);
  if(!data.success) return res.status(400).json(data);
  return res.status(200).json(data);
})
// For Get resgistration step
const getRegistrationStep = catchAsyncError( async (req, res, next) =>{
  const step = req.salon.profile_completion;
  return res.status(200).json({success: true, message: `you are on ${step} step`, data: { step }});
})

//  Step 6: Login Business
const loginViaCredential = catchAsyncError(async (req, res, next) => {
  const data = await login(req.body);
  if(!data.success) return res. status(401).json(data);
  const token = data.data.token;
  res.cookie('salonToken', token, { 
    httpOnly: false,
    // secure: ENV.MODE == 'production',
    sameSite: "Lax",
    path: '/',
    maxAge: 31*24*60*60*1000,
  });
  data.data.token = undefined;
  return res.status(200).json(data);
})
// Send Otp on mail for reset password
const sendOtpToResetPsd = catchAsyncError(async (req, res, next) =>{
  const {email} = req.body;
  const data = await sendOtpToEmailForResetPsd(email);
  
  if(!data.success){
    return res.status(400).json(data);
  }
  return res.status(201).json(data);
})

// verify otp and update password
const verifyOtpAndUpdatePass = catchAsyncError( async (req, res) => {
  const {email, eOtp, password} = req.body;
  const data = await updatePassword(email, eOtp, password);
  if(!data?.success){
    return res.status(400).json(data);
  }
  return res.status(200).json(DataTransfer);
})

//  Step 8: Get Profile
const getProfile = catchAsyncError(async (req, res, next) => {
  const _id = req.salon._id;
  let data = await fetchProfile(_id);
  if(!data) return res.json(404).json(data);
  return res.status(200).json(data);
});

// for upload or change Profile photo
const changeProfilePhoto = catchAsyncError(async (req, res, next) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({success:false,message: "Please upload a profile photo"});
  }
  const data = await uploadNewProfilePhoto(req.file.filename,req.salon._id);
  if(!data){
    return res.status(400).json(data);
  }
  return res.status(201).json(data);
});

// for change Banner Photo
const changeBannerPhoto = catchAsyncError(async (req, res, next)=>{
  // Check if a file was uploaded
    if (!req.file) {
    return res.status(400).json({success:false,message: "Please upload a profile photo"});
  }
  const data = await uploadNewBannerPhoto(req.file.filename,req.salon._id);
  if(!data){
    return res.status(400).json(data);
  }
  return res.status(201).json(data);
})

//for get All Master Services list
const getAllMasterServices = catchAsyncError(async (req, res, next) =>{
  const data = await fetchAllMasterServices();
  if(!data.success) return res.json(data);
  return res.json(data);
});
const addPriceRange = catchAsyncError(async (req, res, next)=>{
  const salon_id = req.salon._id;
  const {average_price_range} = req.body;
  const min = average_price_range.min;
  const max = average_price_range.max;
  const data = await updatePriceRange(salon_id,min, max);
  if(!data.success) return res.status(400).json(data);
  return res.status(200).json(data);
})
//  Step 3: Add Services and Pricing
const addSalonServices = catchAsyncError(async (req, res, next) => {
  const salon_id = req.salon._id;
  const {service_id, price, estimated_duration, gender } = req.body;
  const data = await addNewSalonService({salon_id, service_id, price, estimated_duration, gender});
  if(!data.success) return res.status(400).json(data);
  return res.status(200).json(data);
});
// To Show All Salon Services
const  getAllSalonServices = catchAsyncError(async (req, res, next) => {
  const salon_id = req.salon._id;
  const data = await fetchAllSalonServices(salon_id);
  if(!data.success) return res.status(400).json(data);
  return res.status(200).json(data);
});
const  removeSalonServices = catchAsyncError(async (req, res, next) => {
  const salon_id = req.salon._id;
  const {service_id} = req.params;
  const data = await deleteSalonServices(salon_id, service_id);
  if(!data.success) return res.status(400).json(data);
  return res.status(200).json(data);
});
const getBookings = catchAsyncError(async(req, res, next)=>{
const salon_id = req.salon._id;

let {selectedDate} = req.params;
console.log(selectedDate)
selectedDate = selectedDate || new Date();

const data = await fetchBookings(salon_id,selectedDate);
if(!data.success) return res.status(400).json(data);
return res.status(200).json(data);

})

module.exports = {
registerBasicInfo,
verifyEmailViaOTP,
addSalonDetails,
addProfileDetails,
addPriceRange,
addBankDetails,
changeWorkingDetails,
getRegistrationStep,
loginViaCredential,
verifyOtpAndUpdatePass,
sendOtpToResetPsd,
getProfile,
changeProfilePhoto,
changeBannerPhoto,
getAllMasterServices,
addSalonServices,
getAllSalonServices,
removeSalonServices,
getBookings
}