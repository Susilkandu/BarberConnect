const logError = require("./logError");
class errorHandler extends Error{
constructor(statusCode, message){
    super(message);
    this.statusCode = statusCode;
    console.log(statusCode,message);
    if(this.statusCode === 500){
        logError(message);
    }
}
}
module.exports = errorHandler;