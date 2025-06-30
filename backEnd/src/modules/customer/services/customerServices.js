const { ObjectId } = require("mongodb");
const Customer = require("../models/customerModel");
const Booking = require("../../booking/models/bookingModel.js");
const bcrypt = require("bcryptjs");
const path = require('path');
const jwt = require('jsonwebtoken');

const {generateOtp, sendMail} = require('../../../core/utils/email/emailService.js');
const generateOTPEmailHtml = require('../../../core/utils/email/templates/generateOTPEMailHtml.js');
const {generateToken} = require("../../../core/utils/jwt/generateToken.js");
const {deleteFile} = require("../../../core/utils/fileUploader.js");

//send OTP on email for email verification
const sendOtpOnEmailForCustomer = async (email) =>{
  //checking existence of customer
  const existingCustomer = await Customer.findOne({email});
  if(existingCustomer?.isVerified) return {success:false, message: "This Email is Already Linked"};
  
  //generating otp
  const otp  = generateOtp();
  const expireIn = new Date(Date.now() + 5*60*1000);
  let data;
  if(!existingCustomer){
  //inserting new document
  data = await Customer.create({email:email, otp: otp, otp_expiry:expireIn, location_coordinates:{type:"Point", coordinates:[0,0]}, profile_completion:1.1});
  }else{
  data = await Customer.findOneAndUpdate({email:email},{$set:{otp: otp, otp_expiry:expireIn, location_coordinates:{type:"Point", coordinates:[0,0]}, profile_completion:1.1}},{$new:true});
  }
  const {_id} = data;
  if(!_id) return {success: false, message: "Please Try Again Later"};
  const html = generateOTPEmailHtml(otp);
  sendMail(email, "OTP for customer registration", html);
 return {success: true, message:"OTP Sent On Your Email" };
}

// verify OTP For Email Verification
const verifyOtpForCustomer = async(email, otp)=>{
const data = await Customer.findOne({email});
if(!data) return {success:false, message:"Some Error Occured"};
const now = Date.now();
if(data.otp_expiry< now) return {success: false, message:"OTP expired Please Resend OTP"};
if(data.otp ==  otp){
  const {_id} = data;
  const token = generateToken(_id);
  const ack = await Customer.findOneAndUpdate({email},{$set:{otp:null, otp_expiry:null, isVerified:true}, profile_completion:2});
  console.log(ack)
  if(ack) return {success: true, message:"OTP verified", data:{token} };
}else{
  return {success:false, message:"Invalid OTP"};
}

}

// save Name Gender and Phone Number 
const saveNameGenderPhone = async(name, gender, phone, _id)=>{
const data = await Customer.findByIdAndUpdate({_id},{
  $set:{
    name:name, gender:gender, phone:phone, profile_completion:3
  }
});
if(!data) return {success:false, message:"Please Try Again Later Some Error Occured"};
return {success:true, message:"Saved"};
}

// save Date of Birth Password and location
const saveDobPsdLctn = async(dob, password,location_coordinates ,_id)=>{
  const hashedPassword = await bcrypt.hash(password, 8);
  coordinates = location_coordinates.coordinates;
  const data = await Customer.findByIdAndUpdate({_id},{
    $set:{
      dob:dob,
      password:hashedPassword,
      location_coordinates:{
        type:"Point",
        coordinates:[coordinates[0],coordinates[1]]
      },
      profile_completion:4
    }
  });
  if(!data) return {success:false, message:"Please Try Again Later Some Error Occured"};
  return {success:true, message:"Completed"};
}

// login via credential
const login = async(email, password)=>{
  const result = await Customer.findOne({email}).select('_id password profile_completion');
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
  const result = await Customer.findOneAndUpdate({email:email},{$set:{otp:otp, otp_expiry:expireIn}});
  
  if(!result) return {success: false, message: "Account does not exist Please Create New Account"};
  const html = generateOTPEmailHtml(otp);
  sendMail(email,"OTP for Business Registration",html);
  return {success: true, message: `OTP sent on ${email}`};
}

// For Update Password
const updatePassword = async(email, eOtp, password) =>{
    const customer = await Customer.findOne({ email }).select("_id otp_expiry otp ");
    if (!customer) return {success : false, message: "Email not registered"};
    const now = new Date();
    if (customer.otp_expiry < now) return {success : false, message : "OTP expired. Please Resend OTP."};
    if (!customer.otp || customer.otp !== eOtp) return {success : false, message : "Invalid OTP"};
    const hashedPassword = await bcrypt.hash(password, 8);
    const ack = await Customer.findByIdAndUpdate(customer._id,{$set:{password : hashedPassword, otp : null, otp_expiry : null}});
    if(!ack) return {success: false, message : "Some Error Occured Please Try again later"};
    return {success : true, message : "Password Changed successfully"};
}

// For fetch profile information
const fetchProfile = async(customer_id)=>{
  const data = await Customer.find({_id:customer_id}).select('name email phone gender dob profileImage address ');
  if(!data) return {success: false, message: "Your Data Not Found"};
  return {success: true, message: "Fetched Profile", data:data};
}

// For change the profile photo (optional)
const uploadNewProfilePhoto = async(newFileName,customer_id)=>{
  // Update the user's profile in the database
  const updatedCustomer = await Customer.findByIdAndUpdate(customer_id, {
    $set:{
      'profileImage':newFileName,
      updatedAt:Date.now()
    }
  });
  const oldFileName = updatedCustomer.profileImage;
  // deleting the previous profile photo)
  if(oldFileName){
    deleteFile(path.join(__dirname + "../../../../../../files/" + oldFileName));
  }
  if(!updatedCustomer) return {success: false, message: "Failed to upload Please Try again later"};
  return {success:true, message: "Uploaded", data:{newProfileLink:newFileName}}
}

// For update customer Profile Details
const updateCustomerProfile = async(filteredData, customer_id)=>{
  const updatedCustomer = await Customer.findByIdAndUpdate(customer_id,{$set:filteredData});
  if(!updatedCustomer) return {success: false, message: "Please Try Again Later Some Error occured"};
  return {success: true, message: "Profile updated successfully"}
}
// For Fetching Booking History
const fetchBookingHistory = async(customer_id)=>{
const history = await Booking.aggregate([
  { $match: { customer_id: customer_id } },
  {
    $lookup: {
      from: 'salons',
      localField: 'salon_id',
      foreignField: '_id',
      as: 'salon'
    }
  },
  { $unwind: "$salon" },
  {
    $project: {
      _id: 1,
      salon_name: "$salon.salon_name",
      total_price: 1,
      paymentStatus: 1,
      status: 1,
      bookingDate: 1,
      // starting_time_slot: 1
    }
  }
]);

  if(!history) return {success:false, message: "No Booking History"};
  return {success: true, message:"Fetched", data:history};
}

// /For getting Details of booking
const fetchBookingDetails = async (customer_id, booking_id) => {
  try {
    booking_id = new ObjectId(booking_id);

    const details = await Booking.aggregate([
      {
        $match: { _id: booking_id, customer_id: customer_id }
      },
      {
        $lookup: {
          from: 'masterservices', // Make sure this matches your service collection name
          localField: 'required_services.service_id',
          foreignField: '_id',
          as: 'servicesInfo'
        }
      },
      {
        $project: {
          _id: 1, // hide _id
          total_price: 1,
          paymentMode: 1,
          paymentStatus: 1,
          status: 1,
          bookingDate: 1,
          starting_time_slot: 1,
          ending_time_slot: 1,
          services: {
            $map: {
              input: '$required_services',
              as: 'service',
              in: {
                price: '$$service.price',
                estimated_duration: '$$service.estimated_duration',
                gender: '$$service.gender',
                service_info: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$servicesInfo',
                        as: 'info',
                        cond: { $eq: ['$$info._id', '$$service.service_id'] }
                      }
                    },
                    0
                  ]
                }
              }
            }
          }
        }
      }
    ]);
    if (!details || details.length === 0) {
      return { success: false, message: 'Details Not Found' };
    }
    return { success: true, message: 'fetched', data: details[0] };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Server Error', error };
  }
};

module.exports = {
sendOtpOnEmailForCustomer,
verifyOtpForCustomer,
saveNameGenderPhone,
saveDobPsdLctn,
login,
sendOtpToEmailForResetPsd,
updatePassword,
fetchProfile,
uploadNewProfilePhoto,
updateCustomerProfile,
fetchBookingHistory,
fetchBookingDetails

}