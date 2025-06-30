const express = require("express");
const router = express.Router();

const requireCustomerLogin = require("../../../core/middlewares/auth/requireCustomerLogin");

const {bookNewSlot}= require("../controllers/bookingController");
const {validateBookingInfo} = require("../validators/bookingValidator");
const checkEmptyBody = require("../../../core/middlewares/validation/checkEmptyBody");
const {runValidation} = require("../../../core/middlewares/validation/validateRequest")

router.post("/bookSlot", requireCustomerLogin, checkEmptyBody, validateBookingInfo, runValidation, bookNewSlot);

module.exports = router;