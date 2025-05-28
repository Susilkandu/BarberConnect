const customerController = require('./controller/customerController');
const customerRoutes = require('./routes/customerRoutes');
const customerService = require('./services/customerServices');
const customerValidator = require('./validators/customerValidator');
const customer = require('./models/customerModel');

module.exports ={
    customerController,
    customerRoutes,
    customerService,
    customerValidator,
    customer
}
