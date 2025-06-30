const {body} = require('express-validator');
const {param} = require('express-validator');
const validateRegisterBasicInfo = [
  body('owner_name.first_name').notEmpty().withMessage('Owner First Name is required'),
  body('owner_name.middle_name').optional({checkFalsy:true}).trim(),
  body('owner_name.last_name').optional({checkFalsy:true}).trim(),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateVerifyEmailOTP =[
  body('eOtp').trim().notEmpty().withMessage("OTP is required")
  .isLength({ min: 6, max: 6}).withMessage('OTP must be exactly 6 digits')
];

const validateSalonDetails = [
  body('salon_name').notEmpty().withMessage('Salon name is required'),
  body('full_address').notEmpty().withMessage('Location is required'),
  body('location_coordinates.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be [lng, lat]')
];

const validateChargeRange = [
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

const validateBankDetails = [
  body('bank_details.account_holder_name')
    .trim()
    .notEmpty()
    .withMessage('Account holder name is required.'),

  body('bank_details.account_number')
    .trim()
    .notEmpty()
    .withMessage('Account number is required.')
    .isNumeric()
    .withMessage('Account number must be numeric.')
    .isLength({ min: 9, max: 18 })
    .withMessage('Account number must be between 9 to 18 digits.'),

  body('bank_details.ifsc_code')
    .trim()
    .notEmpty()
    .withMessage('IFSC code is required.')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/i)
    .withMessage('Enter a valid IFSC code.')
    .customSanitizer((value) => value.toUpperCase()),

  body('bank_details.bank_name')
    .optional({ checkFalsy: true })
    .trim(),

  body('bank_details.upi_id')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/)
    .withMessage('Enter a valid UPI ID.')
    .customSanitizer((value) => value.toLowerCase())

];
const validateWorkingDetails = [
    body('opening_hour')
        .optional()
        .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('Opening hour must be in HH:mm 24-hour format'),

    body('closing_hour')
        .optional()
        .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('Closing hour must be in HH:mm 24-hour format')
        .custom((closing, { req }) => {
            if (req.body.opening_hour) {
                const [openH, openM] = req.body.opening_hour.split(':').map(Number);
                const [closeH, closeM] = closing.split(':').map(Number);

                const openingMinutes = openH * 60 + openM;
                const closingMinutes = closeH * 60 + closeM;

                if (closingMinutes <= openingMinutes) {
                    throw new Error('Closing hour must be after opening hour');
                }
            }
            return true;
        }),
    body('working_days')
        .optional()
        .isArray().withMessage('Working days must be an array')
        .custom((arr) => {
            if (!arr.every(day => Number.isInteger(day) && day >= 0 && day <= 6)) {
                throw new Error('Working days must contain integers between 0 (Sunday) and 6 (Saturday)');
            }
            const uniqueDays = new Set(arr);
            if (uniqueDays.size !== arr.length) {
                throw new Error('Duplicate days are not allowed in working days');
            }
            return true;
        })
];
const validateLoginDetails = [
  body("email").isEmail().withMessage("Please Enter Valid Email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Passwrod Length Must Be At Least 8"),
];

const validateEmail = [
body('email').trim().isEmail().withMessage('Invalid email address')
];
const validateResetPasswordDetails = [
  body('email').trim().isEmail().withMessage('Invalid email address'),
  body('eOtp').notEmpty().withMessage("Please Enter Otp").isLength({min:6, max:6}).withMessage("Please Enter 6 digit OTP"),
  body('password').notEmpty().withMessage("Please Enter Password").isLength({min:8}).withMessage("Password length must be more than 7")
];

const validateServiceInput = [
  body('service_id')
    .notEmpty().withMessage('Service ID is required.')
    .isMongoId().withMessage('Service ID must be a valid MongoDB ObjectId.'),

  body('price')
    .notEmpty().withMessage('Price is required.')
    .isNumeric().withMessage('Price must be a number.')
    .custom((value) => value >= 0).withMessage('Price must be a positive number.'),

  body('estimated_duration')
    .notEmpty().withMessage('Estimated Duration is required.')
    .isNumeric().withMessage('Estimated Duration must be a number.')
    .custom((value) => value > 0).withMessage('Estimated Duration must be greater than 0.'),

  body('gender')
    .notEmpty().withMessage('Gender is required.')
    .isIn(['male', 'female', 'unisex']).withMessage('Gender must be one of: male, female, unisex.')
];

const validateServiceIdForDeletion = [
  param('service_id')
    .notEmpty().withMessage('Service ID parameter is required.')
    .isMongoId().withMessage('Service ID must be a valid MongoDB ObjectId.')
];



module.exports ={
  validateRegisterBasicInfo,
  validateVerifyEmailOTP,
  validateSalonDetails,
  validateChargeRange,
  validateProfileDetails,
  validateBankDetails,
  validateWorkingDetails,
  validateLoginDetails,
  validateEmail,
  validateResetPasswordDetails,
  validateServiceInput,
  validateServiceIdForDeletion
}