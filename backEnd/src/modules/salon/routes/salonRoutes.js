const express = require("express");
const router = express.Router();
const {
  validateRegisterBasicInfo,
  validateSalonDetails,
  validateProfileDetails,
  validateBankDetails,
  validateVerifyEmailOTP,
  validateResetPasswordDetails,
  validateLoginDetails,
  validateEmail,
  validateServiceInput,
  validateServiceIdForDeletion,
  validateWorkingDetails,
  validateChargeRange
} = require('../validators/salonValidators.js');

const requireSalonLogin = require('../../../core/middlewares/auth/requireSalonLogin.js');

const { 
  registerBasicInfo,
  verifyEmailViaOTP,
  addSalonDetails,
  addProfileDetails,
  addPriceRange,
  addBankDetails,
  changeWorkingDetails,
  getRegistrationStep,
  loginViaCredential,
  sendOtpToResetPsd,
  verifyOtpAndUpdatePass,
  getProfile,
  changeProfilePhoto,
  changeBannerPhoto,
  getAllMasterServices,
  addSalonServices,
  getAllSalonServices,
  removeSalonServices,
  getBookings
 } = require('../controllers/salonController.js');
const { runValidation } = require('../../../core/middlewares/validation/validateRequest.js');
const checkEmptyBody = require('../../../core/middlewares/validation/checkEmptyBody.js');
// utils
const {uploadPhoto} = require('../../../core/utils/fileUploader.js');



router.post('/register', validateRegisterBasicInfo, runValidation, registerBasicInfo);
router.post('/verifyEmailViaOtp', requireSalonLogin, validateVerifyEmailOTP, runValidation, verifyEmailViaOTP);
router.put('/addDetails', requireSalonLogin, validateSalonDetails, runValidation, addSalonDetails);
router.put('/addPriceRange',requireSalonLogin, validateChargeRange, runValidation, addPriceRange);
router.put('/addProfile', requireSalonLogin, validateProfileDetails, runValidation, addProfileDetails);
router.put('/addBankDetails', requireSalonLogin, validateBankDetails, runValidation, addBankDetails);
router.patch('/updateWorkingDetails', requireSalonLogin, checkEmptyBody, validateWorkingDetails, runValidation, changeWorkingDetails);

router.get('/getRegistrationStep',requireSalonLogin, getRegistrationStep);
router.post('/login',validateLoginDetails, runValidation, loginViaCredential);
router.post('/sendOtpToResetPsd',validateEmail, runValidation, sendOtpToResetPsd);
router.post('/verifyOtpAndUpdatePass',validateResetPasswordDetails, runValidation, verifyOtpAndUpdatePass);
router.get('/myProfile', requireSalonLogin, getProfile);
router.put('/changeProfilePhoto',requireSalonLogin, uploadPhoto.single('profilePhoto'),changeProfilePhoto);
router.put('/changeBannerPhoto', requireSalonLogin, uploadPhoto.single('bannerPhoto'),changeBannerPhoto);
router.get('/getAllMasterServices', requireSalonLogin, getAllMasterServices);
router.patch('/addSalonServices', requireSalonLogin, validateServiceInput, addSalonServices);
router.get('/getAllSalonServices',requireSalonLogin, getAllSalonServices);
router.delete('/removeSalonServices/:service_id',requireSalonLogin, validateServiceIdForDeletion, removeSalonServices);
router.get('/getBookings/:selectedDate',requireSalonLogin, getBookings)


module.exports = router;