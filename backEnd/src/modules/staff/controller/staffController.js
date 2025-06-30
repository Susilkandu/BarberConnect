// importing section
const catchAsyncError = require('../../../core/middlewares/errors/catchAsyncError');

    //services
const {
addNewStaff, updateStaffData, fetchStaffList, deleteStaffAccount
} = require('../services/staffServices');


// Controller Section

const addStaff = catchAsyncError(async(req, res, next) =>{
    const salon_id = req.salon._id;
    const {name, gender, dob, phone, email, role, status} = req.body;
    const data = await addNewStaff(salon_id, name, gender, dob, phone, email, role, status);
    if(!data.success) return res.status(400).json(data);
    return res.status(200).json(data);
});

// update Staff's Data
const updateStaff = catchAsyncError(async(req, res, next) =>{
    const salon_id = req.salon._id;
    const {staff_id, filter} = req.body;
     const toUpdate = {};
    if(filter.name) toUpdate.name = filter.name;
    if(filter.gender) toUpdate.gender = filter.gender;
    if(filter.dob) toUpdate.dob = filter.dob;
    if(filter.phone) toUpdate.phone = filter.phone;
    if(filter.email)  toUpdate.email = filter.email;
    if(filter.role) toUpdate.role = filter.role;
    if(filter.status) toUpdate.status = filter.status;
    const data = await updateStaffData(staff_id, salon_id, toUpdate);
     if(!data.success) return res.status(400).json(data);
    return res.status(200).json(data);
})
// Get Staff List
const getStaffList = catchAsyncError(async(req, res, next)=>{
    const salon_id = req.salon._id;
    const data = await fetchStaffList(salon_id);
    if(!data.success) return res.status(400).json(data);
    return res.status(200).json(data);
});
// Delete Staff Account

const deleteStaff = catchAsyncError(async(req, res, next)=>{
    const salon_id = req.salon._id;
    const {staff_id} = req.params;
    const data = await deleteStaffAccount(salon_id, staff_id);
    if(!data.success) return res.status(400).json(data);
    return res.status(200).json(data);
})
// Exporting Section

module.exports = {
    addStaff,
    updateStaff,
    getStaffList,
    deleteStaff
}