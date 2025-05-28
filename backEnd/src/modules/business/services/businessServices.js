const Business = require("../models/businessModel")
const bcrypt = require("bcryptjs");
const path = require('path');
const jwt = require('jsonwebtoken');


const {generateOtp, sendMail} = require('../../../core/utils/email/emailService.js');
const generateOTPEmailHtml = require('../../../core/utils/email/templates/generateOTPEMailHtml.js');
const {generateToken} = require("../../../core/utils/jwt/generateToken.js");
const {deleteFile} = require("../../../core/utils/fileUploader.js");

// Step 1: Create basic account
const createBusinessAccount = async ({ name, email, phone, password}) => {
  const existingBusiness = await Business.findOne({ email });
  if (existingBusiness) {
    return false;
  }
  
  const hashedPassword = await bcrypt.hash(password, 8);
  const otp = generateOtp();
  const expireIn = new Date(Date.now() + 5*60*1000);
  
  const  business = await Business.create({name,email,phone,password:hashedPassword,location_coordinates:{type:"Point",coordinates:[0,0]},otp:otp,otp_expiry:expireIn, profile_completion:1.1});
  const {_id} = business;
  if (!_id) throw new Error("Failed to create account");

  const html = generateOTPEmailHtml(otp);
  sendMail(email,"OTP for Business Registration",html);
  
  const token = generateToken(_id);
  return token;
};
// Stemp 1.1 : Verify the otp
const verifyEmailOtp = async (business_id,eOtp)=>{
  const now = new Date();
  const business = await Business.findOneAndUpdate({
    _id: business_id,
    otp: eOtp,
    otp_expiry: {$gt: now},
  },
{
  $set:{
    is_verified: true,
    otp: null,
    otp_expiry: null,
    profile_completion:2
  }
}).select('_id');
if(business==null || !business._id) return false;
return true;
};

// Step 2: Add business details
const updateBusinessDetails = async (id, { business_name, location, location_coordinates }) => {
  const business = await Business.findByIdAndUpdate(
    id,
    {
      business_name,
      location,
      location_coordinates,
      updated_at: new Date(),
      profile_completion:3
    }).select('_id');
  if(!business._id) return false;
  return true;
};

// Step 3: Add services & pricing
const updateBusinessServices = async (id, { services_offered, average_price_range, available_days, working_hours }) => {
  if(!Array.isArray(services_offered)){
    services_offered = [services_offered];
  }
  const business = await Business.findByIdAndUpdate(
    id,
    {
      ...(services_offered?.length>0 &&{
        $push:{
          services_offered:{
            $each:services_offered
          },
        }
      }),
      average_price_range,
      available_days,
      working_hours,
      updated_at: new Date(),
      profile_completion:4
    },
  ).select('_id');
  if(!business._id) return false;
  return true;
};

// Step 4: Add media and social links
const updateBusinessProfile = async (id, { bio, experience, social_links }) => {
  if(!Array.isArray(social_links)){
    social_links= [social_links];
  }
  const business = await Business.findByIdAndUpdate(
    id,
    {
      $set:{
        bio,
        experience,
        profile_completion:5
      },
      ...(social_links?.length>0 &&{
        $push:{
          social_links:{
            $each:social_links
          },
        }
      })
    }
  ).select('_id');
  if(!business)return false;
  return true;
};

// Step 5: Add payment details and finalize profile
const updateBusinessPayments = async (id, { account_details }) => {
  const business = await Business.findByIdAndUpdate(
    id,
    {
      account_details,
      onboarding_stage: 'profile_complete',
      updated_at: new Date(),
      profile_completion:6
    }
  ).select('_id');
  console.log(business)
  if(!business) return false;
  return true;
};
// Step 6: Login
const login = async({email,password})=>{
  const result = await Business.findOne({email}).select('_id password profile_completion');
  if(!result) return {success:false, message:"Invalid Credential"};
  const isMatch = await bcrypt.compare(password,result.password);
  if(!isMatch) return {success: false, message: "Invalid Credential"};
  const token = generateToken(result._id);
  return {success: true, message: "Logged In", data:{token: token}};
}
// For Send OTP On Email For Reset Password
const sendOtpToEmailForResetPsd = async(email)=>{
  const otp = generateOtp();
  const expireIn = new Date(Date.now() + 5*60*1000);
  const result = await Business.findOneAndUpdate({email:email},{$set:{otp:otp, otp_expiry:expireIn}});
  
  if(!result) return {success: false, message: "Account does not exist Please Create New Account"};
  const html = generateOTPEmailHtml(otp);
  sendMail(email,"OTP for Reset Password",html);
  return {success: true, message: `OTP sent on ${email}`};
}
// For Update Password
const updatePassword = async(email, eOtp, password) =>{
    const business = await Business.findOne({ email }).select("_id otp_expiry otp ");
    if (!business) return {success : false, message: "Email not registered"};
    const now = new Date();
    if (business.otp_expiry < now) return {success : false, message : "OTP expired. Please Resend OTP."};
    if (!business.otp || business.otp !== eOtp) return {success : false, message : "Invalid OTP"};
    const hashedPassword = await bcrypt.hash(password, 8);
    const ack = await Business.findByIdAndUpdate(business._id,{$set:{password : hashedPassword, otp : null, otp_expiry : null}});
    if(!ack) return {success: false, message : "Some Error Occured Please Try again later"};
    return {success : true, message : "Password Changed successfully"};
}

// Step 8: Fetch Profile
const fetchProfile = async(business_id)=>{
  const profile = await Business.find({_id:business_id}).select('-password');
  return profile;
}
// Step 9: For change the profile photo (optional)
const uploadNewProfilePhoto = async(newFileName,business_id)=>{
  // Update the user's profile in the database
  const updatedBusiness = await Business.findByIdAndUpdate(business_id, {
    $set:{
      'profile_image':newFileName,
      updatedAt:Date.now()
    }
  });
  console.log(newFileName)
  console.log(updatedBusiness.profile_image);
  const oldFileName = updatedBusiness.profile_image;
  // deleting the previous profile photo)
  if(oldFileName){
    deleteFile(path.join(__dirname + "../../../../../../files/" + oldFileName));
  }
  return newFileName;
}


module.exports = {
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
}
