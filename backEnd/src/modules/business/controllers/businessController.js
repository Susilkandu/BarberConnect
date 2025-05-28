const ENV = require('../../../config/env.js');
const catchAsyncError = require('../../../core/middlewares/errors/catchAsyncError.js');
const {
  createBusinessAccount,
  verifyEmailOtp,
  updateBusinessDetails,
  updateBusinessServices,
  updateBusinessProfile,
  updateBusinessPayments,
  login,
  sendOtpToEmailForResetPsd,
  updatePassword,
  fetchProfile,
  uploadNewProfilePhoto
} = require('../services/businessServices.js');

//  Step 1: Register Basic Info
const registerBasicInfo = catchAsyncError(async(req, res, next) => {
  const token =  await createBusinessAccount(req.body);
  if(token===false) return res.status(400).json({success:false, message: "Email Id is already registered." });
  res.cookie('businessToken', token, {
    httpOnly: false,
    // secure: ENV.MODE == 'production',
    sameSite: "Lax",
    path: '/',
    maxAge: 31*24*60*60*1000,
  })
  return res.status(201).json({
    success: true,
    message: "OTP sent to email"
  });
});
//  Step 1.1 Verify Email Via OTP
const VerifyEmailViaOTP = catchAsyncError(async(req,res,next)=>{
  const {eOtp} = req.body;
  const ack = await verifyEmailOtp(req.business._id,eOtp);
  if(ack!=true){
    return res.status(422).json({
      success:false,
      message:"Invalid or expired OTP"
    });
  }
  return res.status(200).json({
    success: true,
    message: "Step 1 Completed"
  })
})

//  Step 2: Add Business Details
const addBusinessDetails = catchAsyncError(async (req, res, next) => {
  const id = req.business._id;
  const ack = await updateBusinessDetails(id, req.body);
  if(!ack) return res.status(400).json({ success:false, message:"Please try again"});
  return res.status(200).json({ success: true, message: "Step 2 Completed"});
});

//  Step 3: Add Services and Pricing
const addBusinessServices = catchAsyncError(async (req, res, next) => {
  const _id = req.business._id;
  const ack = await updateBusinessServices(_id, req.body);
  if(!ack) return res.status(400).json({ success:false, message:"Please try again"});
  return res.status(200).json({ success: true, message: "Step 3 Completed"});
});

//  Step 4: Add Profile and Social Links
const addProfileDetails = catchAsyncError(async (req, res, next) => {
  const _id = req.business._id;
  const ack = await updateBusinessProfile(_id, req.body);
  if(!ack) return res.status(400).json({success: false, message: "please try again"});
  return res.status(200).json({ success: true, message: "Step 4 Completed"});
});

//  Step 5: Add Payment Details
const addPaymentDetails = catchAsyncError(async (req, res, next) => {
  const _id = req.business._id;
  const ack = await updateBusinessPayments(_id, req.body);
  if(!ack) return res.status(400).json({success: false, message: "please try again"});
  return res.status(200).json({ success: true, message: "Step 5 Completed Bank Added" });
});
// For Get resgistration step
const getRegistrationStep = catchAsyncError( async (req, res, next) =>{
  const step = req.business.profile_completion;
  return res.status(200).json({success: true, message: `you are on ${step} step`, data: { step }});
})

//  Step 6: Login Business
const loginViaCredential = catchAsyncError(async (req, res, next) => {
  const data = await login(req.body);
  if(!data.success) return res. status(401).json(data);
  const token = data.data.token;
  res.cookie('businessToken', token, { 
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
  const ack = await updatePassword(email, eOtp, password);
  if(!ack || !ack.success){
    return res.status(400).json(ack);
  }
  return res.status(200).json(ack);
})

//  Step 8: Get Profile
const getProfile = catchAsyncError(async (req, res, next) => {
  const _id = req.business._id;
  let profile = await fetchProfile(_id);
  if(!profile) return res.json(404).json({success: false, message: "Profile details not exist"});
  return res.status(200).json({success:true, message:"Fetched",data:{...profile}});
});

// for upload or change Profile photo
const changeProfilePhoto = catchAsyncError(async (req, res, next) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({success:false,message: "Please upload a profile photo"});
  }
  const newProfileLink = await uploadNewProfilePhoto(req.file.filename,req.business._id);
  if(!newProfileLink){
    return res.status(400).json({success:false,message:"Failed to upload profile photo"});
  }
  return res.status(201).json({success:true, message:"Updated profile photo", data:{newProfileLink:newProfileLink}});
});

module.exports = {
registerBasicInfo,
VerifyEmailViaOTP,
addBusinessDetails,
addBusinessServices,
addProfileDetails,
addPaymentDetails,
getRegistrationStep,
loginViaCredential,
verifyOtpAndUpdatePass,
sendOtpToResetPsd,
getProfile,
changeProfilePhoto
}