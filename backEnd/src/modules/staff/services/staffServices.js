const Staff = require('../models/staffModel');
const mongoose = require("mongoose");

// Services Section
const addNewStaff = async (salon_id, name, gender, dob, phone, email, role, status)=>{
    const existingStaff = await Staff.findOne({
  $or: [{ email }, { phone }]
});
    if(existingStaff){
        return { success: false, message: "Email Id or Contact no. is Already Registered"};
    }
    //  if staff does not exist, create new
    const newStaff = await Staff.create({
        salon: salon_id, name, gender, dob, phone, email, role, status
    });
    if(!newStaff) return {success: false, message: "Some Error Occured Please Try Again Later"};
    return {success: true, message: `${name} Account has been created`};   
}
// updateStaffData

const updateStaffData = async(staff_id, salon_id, toUpdate) =>{
    staff_id = new mongoose.Types.ObjectId(staff_id);
    const newStaffData = await Staff.findOneAndUpdate({salon:salon_id, _id: staff_id}, {$set:toUpdate}, {$new: true});

    console.log(newStaffData)
    if(!newStaffData) return {success: false, message: "Some Error Occured Please Try Again Later"};
    return {success: true, message: `updated Successfully done`};
}
// fetching Staff List

const fetchStaffList = async(salon_id)=>{
    const staffList = await Staff.find({salon: salon_id}).select("-updatedAt");
    if(!staffList) return  {success: false, message:"Some Error Occured Please Try Again Later"};
    return {success: true, message:"Fetched", data: staffList};
}

// delete Staff 

const deleteStaffAccount = async(salon_id, staff_id)=>{
    staff_id = new mongoose.Types.ObjectId(staff_id);
    const data  = await Staff.findOneAndDelete({_id: staff_id, salon: salon_id});
    console.log(data);
    if(!data) return {success: false, message: "Some Error Occured Please Try Again Later"};
    return {success: true, message: "Deleted Successfully"};
}

// Exporting Section

module.exports = {
    addNewStaff, 
    updateStaffData,
    fetchStaffList,
    deleteStaffAccount
}
