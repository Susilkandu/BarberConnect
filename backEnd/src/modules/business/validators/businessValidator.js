const {body} = require('express-validator');

const validateRegisterBasicInfo = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateVerifyEmailOTP =[
  body('eOtp').trim().notEmpty().withMessage("OTP is required")
  .isLength({ min: 6, max: 6}).withMessage('OTP must be exactly 6 digits')
];

const validateBusinessDetails = [
  body('business_name').notEmpty().withMessage('Business name is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('location_coordinates.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be [lng, lat]')
];

const validateBusinessServices = [
  body('services_offered').isArray({ min: 1 }).withMessage('At least one service is required'),
  body('average_price_range.min').isNumeric().withMessage('Min price must be a number'),
  body('average_price_range.max').isNumeric().withMessage('Max price must be a number')
];

const validateProfileDetails = [
  body('bio').trim().isString().withMessage('Bio must be text').isLength({ max: 500 }).withMessage('Bio must be under 500 characters').escape(), 
  body('experience').isNumeric().withMessage("Must be in years"),

  body('social_links').optional({ checkFalsy: true}).isArray().withMessage("It should be one or more"),
  body('social_links.*.platform')
    .optional({ checkFalsy: true })
    .isIn(['instagram','facebook','whatsapp','website'])
    .withMessage('Platform must be one of: instagram, facebook, whatsapp, website'),
  body('social_links.*.link')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Link must be a valid URL')
];

const validatePaymentDetails = [
  body('account_details.account_holder_name')
    .trim()
    .notEmpty()
    .withMessage('Account holder name is required.'),

  body('account_details.account_number')
    .trim()
    .notEmpty()
    .withMessage('Account number is required.')
    .isNumeric()
    .withMessage('Account number must be numeric.')
    .isLength({ min: 9, max: 18 })
    .withMessage('Account number must be between 9 to 18 digits.'),

  body('account_details.ifsc_code')
    .trim()
    .notEmpty()
    .withMessage('IFSC code is required.')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/i)
    .withMessage('Enter a valid IFSC code.')
    .customSanitizer((value) => value.toUpperCase()),

  body('account_details.bank_name')
    .optional({ checkFalsy: true })
    .trim(),

  body('account_details.upi_id')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/)
    .withMessage('Enter a valid UPI ID.')
    .customSanitizer((value) => value.toLowerCase())

];
const validateLoginDetails = [
  body('email').notEmpty().withMessage('Please enter Email')
  .isEmail().withMessage('Please enter valid Email'),
  body('password').notEmpty().withMessage('Please enter the Password')
  .isLength({min:6}).withMessage('Password lenghth must be at least 6')
]
const validateEmail = [
body('email').trim().isEmail().withMessage('Invalid email address')
]
const validateResetPasswordDetails = [
  body('email').trim().isEmail().withMessage('Invalid email address'),
  body('eOtp').notEmpty().withMessage("Please Enter Otp").isLength({min:6, max:6}).withMessage("Please Enter 6 digit OTP"),
  body('password').notEmpty().withMessage("Please Enter Password").isLength({min:8}).withMessage("Password length must be more than 7")
]

module.exports ={
  validateRegisterBasicInfo,
  validateVerifyEmailOTP,
  validateBusinessDetails,
  validateBusinessServices,
  validateProfileDetails,
  validatePaymentDetails,
  validateLoginDetails,
  validateEmail,
  validateResetPasswordDetails,
}