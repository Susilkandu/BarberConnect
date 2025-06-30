const router = require("express").Router();
const logError = require("../../../core/middlewares/errors/logError");

// validator
const {validateFilters} = require('../validators/publicValidators');

// controller 
const {getAllSalons, viewSalonProfile} = require("../controller/publicController");


// validator runner

const {runValidation } = require("../../../core/middlewares/validation/validateRequest");
try{
router.get('/salons', validateFilters, runValidation, getAllSalons);
router.get('/viewSalonProfile',viewSalonProfile);
}
catch(error){
logError(error);
}

module.exports = router