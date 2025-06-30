const ErrorHandler = require("../../../core/middlewares/errors/errorHandler");
const catchAsyncError = require("../../../core/middlewares/errors/catchAsyncError");

const {fetchAllSalons, fetchSalonDetails} = require("../services/publicServices");

const getAllSalons = catchAsyncError(async (req, res, next) =>{
    const data = await fetchAllSalons(req.query);
    if(!data.success) return res.status(400).json(data);
    return res.status(200).json(data);
});
const viewSalonProfile = catchAsyncError(async (req, res, next)=>{
    const {salon_id} = req.query;
    const data = await fetchSalonDetails(salon_id);
     if(!data.success) return res.status(400).json(data);
    return res.status(200).json(data);
})

module.exports = {
    getAllSalons,
    viewSalonProfile
}
