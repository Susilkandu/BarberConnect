const router = require("express").Router();
const logError = require("../../../core/middlewares/errors/logError");
const requireCustomerLogin  = require('../../../core/middlewares/auth/requireCustomerLogin');

//empty body checker middleware
const checkEmptyBody = require("../../../core/middlewares/validation/checkEmptyBody");

//validator
const {validateEmail, validateVerificationDetails, validateBasicInfo, validateDobPsdAndLctn, validateLoginDetails,
    validateResetPasswordDetails, validateUpdateProfileFields
} = require("../validators/customerValidator");

//controller
const {sendOtpOnEmailForReg, getRegistrationStep, verifyOtpForReg, saveBasicInfoFoReg, saveDobPsdAndLctnForReg, loginViaCredential, sendOtpToResetPsd,
    verifyOtpAndUpdatePass, getProfile, changeProfilePhoto, updateProfile
} = require("../controller/customerController");

// validator runner
const {runValidation} = require('../../../core/middlewares/validation/validateRequest');
const { uploadPhoto } = require("../../../core/utils/fileUploader");


try {
    router.post('/sendOtpOnEmail', validateEmail, runValidation, sendOtpOnEmailForReg);
    router.get('/getRegistrationStep', requireCustomerLogin ,getRegistrationStep);
    router.post('/verifyOtpForReg', validateVerificationDetails, runValidation, verifyOtpForReg);
    router.patch('/saveBasicInfoForReg',requireCustomerLogin, validateBasicInfo, runValidation, saveBasicInfoFoReg);
    router.patch('/saveDobPsdAndLctForReg',requireCustomerLogin, validateDobPsdAndLctn, runValidation, saveDobPsdAndLctnForReg);
    router.post('/login',validateLoginDetails, runValidation, loginViaCredential);
    router.post('/sendOtpToResetPsd', validateEmail, runValidation, sendOtpToResetPsd);
    router.post('/verifyOtpAndUpdatePass', validateResetPasswordDetails, runValidation, verifyOtpAndUpdatePass);
    router.get('/myProfile', requireCustomerLogin, getProfile);
    router.post('/changeProfilePhoto', requireCustomerLogin, uploadPhoto.single('profilePhoto'), changeProfilePhoto);
    router.patch('/updateProfile',requireCustomerLogin, checkEmptyBody, validateUpdateProfileFields, runValidation, updateProfile);
} catch (error) {
 logError(error);
}
    module.exports  = router;