const errorMiddleware = (err, req, res, next) =>{

    err.statusCode = err.statusCode || 500;
    err.ackbool = err.ackbool || 0;
    err.message = err.message || "Internal Server Error Occured";

    if (err.code === 11000){
        const field = Object.keys(err.keyValue)[0];
        err.message = `Duplicate key error: ${field} already exists`;
        err.statusCode = 409;
    }

    res.status(err.statusCode).json({
        ackbool: err.ackbool,
        message:err.message
    });

    // Log server errors
    if(err.statusCode===500){
        console.log(err);
    }
}
module.exports = errorMiddleware;