const {body} = require('express-validator');
const {param} = require('express-validator');

// Validator Elements

const validateAddNewInfo = [
    body('name').notEmpty().withMessage("Please Enter the Name"),
    body('gender').notEmpty().withMessage('Please Select Gender'),
    body('dob').notEmpty().withMessage("Please Enter DOB")
    .isISO8601().withMessage('DOB must be a valid date in YYYY-MM-DD format'),
    body('phone').isMobilePhone().withMessage('Please Enter Valid Phone number'),
    body('email').isEmail().withMessage("Please Enter Valid Email"),
    body('role').notEmpty().withMessage("Please Enter the role"),
    body('status').notEmpty().withMessage('Please select Status')
];

const validateUpdateInfo = [
    body('staff_id').isMongoId().withMessage("Please Select Staff"),
    body('filter.name').optional().notEmpty().withMessage("Please Enter the Name"),
    body('filter.gender').optional().notEmpty().withMessage('Please Select Gender'),
    body('filter.dob').optional().notEmpty().withMessage("Please Enter DOB")
    .isISO8601().withMessage('DOB must be a valid date in YYYY-MM-DD format'),
    body('filter.phone').optional().isMobilePhone().withMessage('Please Enter Valid Phone number'),
    body('filter.email').optional().isEmail().withMessage("Please Enter Valid Email"),
    body('filter.role').optional().notEmpty().withMessage("Please Enter the role"),
    body('filter.status').optional().notEmpty().withMessage('Please select Status') 
];

const validateForStaffDeletion = [
  param('staff_id')
    .notEmpty().withMessage('Staff ID parameter is required.')
    .isMongoId().withMessage('Staff ID must be a valid MongoDB ObjectId.')
];
module.exports = {
    validateAddNewInfo,
    validateUpdateInfo,
    validateForStaffDeletion
}