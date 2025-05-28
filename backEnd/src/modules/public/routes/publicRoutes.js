const router = require("express").Router();
const logError = require("../../../core/middlewares/errors/logError");

// validator
const {validateFilters} = require('../validators/publicValidators');

// controller 
const {getAllBarbers} = require("../controller/publicController");


// validator runner

const {runValidation } = require("../../../core/middlewares/validation/validateRequest");
try{
router.get('/barbers', validateFilters, runValidation, getAllBarbers);
}
catch(error){
logError(error);
}

module.exports = router