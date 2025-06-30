const ErrorHandler = require("../../../core/middlewares/errors/errorHandler");
const catchAsyncError = require("../../../core/middlewares/errors/catchAsyncError");

const {bookSlot} = require("../services/bookingServices");

const bookNewSlot = catchAsyncError(async(req, res, next) =>{
    const cId = req.customer._id;
    const {name, salon_id ,services, paymentMode, selectedDate} = req.body;
    const data = await bookSlot(name, cId, salon_id, services, paymentMode, selectedDate);
    if(!data.success) return res.status(400).json(data);
    return res.status(200).json(data);
})
module.exports ={
    bookNewSlot
}