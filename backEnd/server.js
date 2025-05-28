const logError = require('./src/core/middlewares/errors/logError');
process.on('uncaughtException',(err)=>{
    console.log('Uncaught Exception :', err.message);
    logError(err.message);
})
process.on('unhandledRejection',(promise)=>{
    console.error(`‼ Unhandled Rejection at:`, promise);
    logError(promise);
})
process.on('validationError',(err)=>{
    console.log('validation Error',err);
    logError(err);
})
const app = require("./src/app");
const connectDB = require("./src/config/db");
const {PORT} = require("./src/config/env");
connectDB();
app.listen(PORT,()=>{
    console.log(`🚀 Boom Server is running on http://localhost:${PORT}`);
})