const express = require("express");
const router = express.Router();
// Validator
const { validateAddNewInfo, validateUpdateInfo, validateForStaffDeletion } = require("../validator/staffValidator");

// importing requireSalonLogin Middleware 
const requireSalonLogin = require("../../../core/middlewares/auth/requireSalonLogin");
// importing controller 
const {addStaff, updateStaff, getStaffList, deleteStaff} = require('../controller/staffController');
const {runValidation} = require('../../../core/middlewares/validation/validateRequest');
const checkEmptyBody = require('../../../core/middlewares/validation/checkEmptyBody');

// importing utils
const {uploadPhoto} = require('../../../core/utils/fileUploader');

router.post('/addStaff', requireSalonLogin, checkEmptyBody, validateAddNewInfo, runValidation, addStaff);
router.put('/updateStaff',requireSalonLogin, checkEmptyBody, validateUpdateInfo, runValidation, updateStaff);
router.get('/getStaffList',requireSalonLogin, getStaffList);
router.delete('/deleteStaff/:staff_id', requireSalonLogin, validateForStaffDeletion, runValidation, deleteStaff);


module.exports = router;