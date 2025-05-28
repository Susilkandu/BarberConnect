const ErrorHandler = require("../../../core/middlewares/errors/errorHandler");
const catchAsyncError = require("../../../core/middlewares/errors/catchAsyncError");

const {fetchAllBarbers} = require("../services/publicServices");

const getAllBarbers = catchAsyncError(async (req, res, next) =>{
    const data = await fetchAllBarbers(req.query);
    if(!data.success) return res.status(400).json(data);
    return res.status(200).json(data);
});

module.exports = {
    getAllBarbers
}
