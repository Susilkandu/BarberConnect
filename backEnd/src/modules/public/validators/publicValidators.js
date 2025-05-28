const { query, validationResult } = require('express-validator');

const validateFilters = [
  query('business_name')
    .optional()
    .isString()
    .trim()
    .withMessage('Shop name must be String'),
  query('location')
    .optional()
    .isString()
    .trim()
    .withMessage('Location must be a string'),

  query('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a number between -90 and 90'),

  query('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a number between -180 and 180'),

  query('sortBy')
    .optional()
    .isIn(['rating', 'experience', 'latest'])
    .withMessage('sortBy must be one of rating, experience, or average_price'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minPrice must be a positive number'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxPrice must be a positive number'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be an integer greater than 0'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100')
];

module.exports = {
  validateFilters,
};
