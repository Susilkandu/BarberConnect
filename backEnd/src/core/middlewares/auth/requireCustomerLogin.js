const { verifyToken }= require('../../utils/jwt/verifyToken');
const Customer = require("../../../modules/customer/models/customerModel");
const logError = require('../errors/logError');

const requireCustomerLogin  = async (req, res, next) => {
  try {
    const token = req.cookies.customerToken;
    // Check if token exists
    if (!token) {
      return res.status(401).json({ success: false, message: "You are not logged in! Please log in to get access." });
    }
    const {_id}  = verifyToken(token);
    if(!_id)  return res.status(401).json({success: false, message: "Session Expired please log in." });
    // Find the user by ID
    const customer = await Customer.findById(_id).select('_id profile_completion');
    // Check if user exists
    if (!customer) {
      res.clearCookie('customerToken', {
        path: '/',
        sameSite: 'Lax'
      });
      return res.status(401).json({success:false, message: "Session Expired please log in." });
    }

    // Attach user to request object
    req.customer = customer;
    
    // Call next middleware
    next();
  } catch (error) {
    logError(error)
    return res.status(401).json({ success: false, message: "Session Expired. Please log in again." });
  }
};

module.exports = requireCustomerLogin;