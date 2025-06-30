const errorMiddleware = (err, req, res, next) => {
    if (!err) {
        // Create a default error object if none is passed
        err = new Error("Unknown error");
        err.statusCode = 500;
        err.ackbool = 0;
    }

    err.statusCode = err.statusCode || 500;
    err.ackbool = err.ackbool || 0;
    err.message = err.message || "Internal Server Error Occured";

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        err.message = `Duplicate key error: ${field} already exists`;
        err.statusCode = 409;
    }

    res.status(err.statusCode).json({
        ackbool: err.ackbool,
        message: err.message,
    });

    if (err.statusCode === 500) {
        console.log(err);
    }
};
