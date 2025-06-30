const { verifyToken }= require('../../utils/jwt/verifyToken');
const Salon = require("../../../modules/salon/models/salonModel");
const logError = require('../errors/logError');

const requireSalonLogin  = async (req, res, next) => {
  try {
    const token = req.cookies.salonToken;
    // Check if token exists
    if (!token) {
      return res.status(401).json({ success: false, message: "You are not logged in! Please log in to get access." });
    }
    const {_id}  = verifyToken(token);
    if(!_id)  return res.status(401).json({success: false, message: "Session Expired please log in." });
    // Find the user by ID
    const salonData = await Salon.findById(_id).select('_id profile_completion');
    // Check if user exists
    if (!salonData) {
      res.clearCookie('salonToken', {
        path: '/',
        sameSite: 'Lax'
      });
      return res.status(401).json({success:false, message: "Session Expired please log in." });
    }

    // Attach user to request object
    req.salon = salonData;
    
    // Call next middleware
    next();
  } catch (error) {
    logError(error)
    return res.status(401).json({ success: false, message: "Session Expired. Please log in again." });
  }
};

module.exports = requireSalonLogin;