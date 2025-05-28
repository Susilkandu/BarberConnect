const { body } = require("express-validator");

const validateEmail = [
  body("email").isEmail().withMessage("Please Enter Valid Email"),
];

const validateVerificationDetails = [
  body("email").isEmail().withMessage("Please Enter Valid Email"),
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 digits"),
];

const validateBasicInfo = [
  body("name").notEmpty().withMessage("Name is Required"),
  body("gender")
    .trim()
    .notEmpty()
    .withMessage("Please choose a gender")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be either male, female, or other")
    .toLowerCase(),
  body("phone").isMobilePhone().withMessage("Please Enter Valid Phone Number"),
];

const validateDobPsdAndLctn = [
  body('dob')
  .isISO8601().withMessage('DOB must be a valid date in YYYY-MM-DD format'),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Passwrod Length Must Be At Least 8"),
  body("location_coordinates.coordinates")
    .isArray({ min: 2, max: 2 })
    .withMessage("Coordinates must be [lng,lat]"),
];

const validateLoginDetails = [
  body("email").isEmail().withMessage("Please Enter Valid Email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Passwrod Length Must Be At Least 8"),
]
const validateResetPasswordDetails = [
  body("email").isEmail().withMessage("Please Enter Valid Email"),
  body("eOtp").trim().isLength({min:6, max: 6}).withMessage("Please Enter 6 digit OTP"),
    body("password")
    .isLength({ min: 8 })
    .withMessage("Passwrod Length Must Be At Least 8"),
]

const validateUpdateProfileFields = [
  body("name").optional().isString().withMessage("Name must be a Striing")
  .isLength({min: 2}).withMessage("Name must be at least 2 characters"),
  body("phone").optional().isLength({min: 6}).withMessage("Phone must be Valid"),
  body('gender').optional().isIn(["male", "female", "other"]).withMessage("Gender must be 'male', 'female', or 'other'"),
  body("dob").optional().isISO8601().withMessage("Date of Birth must be a valid date")
  .toDate(),
  body("address").optional().isObject().withMessage("Address must be an object"),
  body("address.street").optional().isString().withMessage("Street must be a string"),
  body("address.city").optional().isString().withMessage("City must be a string"),
  body("address.state").optional().isString().withMessage("State must be a string"),
  body("address.postalCode").optional().isPostalCode("IN").withMessage("Postal Code must be valid for India"),
  body("location_coordinates.coordinates").optional()
    .isArray({ min: 2, max: 2 })
    .withMessage("Coordinates must be [lng,lat]"),
]
module.exports = {
  validateEmail,
  validateVerificationDetails,
  validateBasicInfo,
  validateDobPsdAndLctn,
  validateLoginDetails,
  validateResetPasswordDetails,
  validateUpdateProfileFields
};
