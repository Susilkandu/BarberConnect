const logError = (message) => {
    const fs = require("fs");
    const path = require("path");
    const logFilePath = path.join("../", "server.log");
    const timestamp = new Date().toLocaleString();
    let logMessage;
    if (message.stack) {
      logMessage = `[${timestamp}] ${message.stack} \n`;
    } else {
      logMessage = `[${timestamp}] ${message} \n`;
    }
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error("Error occured While Writing to log file : ", err);
      }
    });
  };
  module.exports = logError;