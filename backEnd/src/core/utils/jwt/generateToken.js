const jwt = require('jsonwebtoken');
const ENV = require('../../../config/env');

const generateToken = (businessId) => {
    return jwt.sign(
      { _id: businessId },
      ENV.JWT_SECRET,
      { expiresIn: "31d" } // Typical OTP token expiration
    );
  };

module.exports = {
    generateToken
};