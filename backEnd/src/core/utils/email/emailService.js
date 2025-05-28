const logError = require("../../../core/middlewares/errors/logError");
const ENV = require("../../../config/env");
const nodemailer = require("nodemailer");
const generateOtp = () => {
    const otpValue = Math.floor(100000 + Math.random() * 900000);
    return otpValue.toString();
  };
  
  const sendMail = async (email, title, html) => {
    return new Promise(async (resolve, reject) => {
      try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: ENV.EMAIL,
          pass: ENV.EMAILPASSWORD,
        },
        tls: {
          rejectUnauthorized: false, // Bypass certificate validation (use only in development)
        },
      });
      const mailOption = {
        from: ENV.EMAIL,
        to: email,
        subject: title,
        html
      };
      transporter.sendMail(mailOption, function (error, info) {
        if (error) {
          logError(error);
          reject(false);
        } else {
          resolve(true);
        }
      });
    } catch (error) {
      logError(error);
      reject(false);
    }
  });
};
module.exports = {
  generateOtp,
  sendMail
}
