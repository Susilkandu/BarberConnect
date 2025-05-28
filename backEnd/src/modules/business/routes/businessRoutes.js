const express = require("express");
const router = express.Router();
const {
  validateRegisterBasicInfo,
  validateBusinessDetails,
  validateBusinessServices,
  validateProfileDetails,
  validatePaymentDetails,
  validateVerifyEmailOTP,
  validateResetPasswordDetails,
  validateLoginDetails,
  validateEmail
} = require('../validators/businessValidator.js');

const requireBusinessLogin = require('../../../core/middlewares/auth/requireBusinessLogin.js');

const { 
  registerBasicInfo,
  VerifyEmailViaOTP,
  addBusinessDetails,
  addBusinessServices,
  addProfileDetails,
  addPaymentDetails,
  getRegistrationStep,
  loginViaCredential,
  sendOtpToResetPsd,
  verifyOtpAndUpdatePass,
  getProfile,
  changeProfilePhoto
 } = require('../controllers/businessController.js');
const { runValidation } = require('../../../core/middlewares/validation/validateRequest.js');

// utils
const {uploadPhoto} = require('../../../core/utils/fileUploader.js');



router.post('/register', validateRegisterBasicInfo, runValidation, registerBasicInfo);
router.post('/verifyEmailViaOtp', requireBusinessLogin, validateVerifyEmailOTP, runValidation, VerifyEmailViaOTP);
router.put('/addDetails', requireBusinessLogin, validateBusinessDetails, runValidation, addBusinessDetails);
router.put('/addServices',requireBusinessLogin, validateBusinessServices, runValidation, addBusinessServices);
router.put('/addProfile', requireBusinessLogin, validateProfileDetails, runValidation, addProfileDetails);
router.put('/addPaymentDetails', requireBusinessLogin, validatePaymentDetails, runValidation, addPaymentDetails);
router.get('/getRegistrationStep',requireBusinessLogin, getRegistrationStep);
router.post('/login',validateLoginDetails, runValidation, loginViaCredential);
router.post('/sendOtpToResetPsd',validateEmail, runValidation, sendOtpToResetPsd);
router.post('/verifyOtpAndUpdatePass',validateResetPasswordDetails, runValidation, verifyOtpAndUpdatePass);
router.get('/myProfile', requireBusinessLogin,getProfile);
router.put('/changeProfilePhoto',requireBusinessLogin, uploadPhoto.single('profilePhoto'),changeProfilePhoto);


module.exports = router;