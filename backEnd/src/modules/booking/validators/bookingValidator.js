const { body } = require("express-validator");

const validateBookingInfo = [
    body('name').isString().withMessage("Please Enter Customer Name"),
    // Validate that 'services' is an array and contains valid salon service IDs
    body('services')
        .isArray().withMessage("Select valid services")
        .custom(services => {
            const ObjectId = require('mongodb').ObjectId;
            for (let service of services) {
                if (!ObjectId.isValid(service)) {
                    throw new Error("Invalid service ID: " + service);
                }
            }
            return true;
        }),
    body('paymentMode').optional().isString().withMessage("Must be Select payment Mode"),
    body('selectedDate')
        .isDate().withMessage("Select a valid date for the booking")
        .custom(date => {
            const today = new Date();
            const inputDate = new Date(date);
            inputDate.setHours(0,0,0,0);
            today.setHours(0,0,0,0);
            if (inputDate < today) {
                throw new Error("Booking date cannot be in the past");
            }
            return true;
        }),
];

module.exports = {
    validateBookingInfo
}

