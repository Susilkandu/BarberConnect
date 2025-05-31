const router = require("express").Router();
const logError = require("../../../core/middlewares/errors/logError");

// validator
const {validateFilters} = require('../validators/publicValidators');

// controller 
const {getAllBarbers, viewBarberProfile} = require("../controller/publicController");


// validator runner

const {runValidation } = require("../../../core/middlewares/validation/validateRequest");
try{
router.get('/barbers', validateFilters, runValidation, getAllBarbers);
router.get('/viewBarberProfile',viewBarberProfile);
}
catch(error){
logError(error);
}

module.exports = router