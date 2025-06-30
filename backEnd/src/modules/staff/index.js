const staffController = require('./controller/staffController');
const staffRoutes = require('./routes/staffRoutes');
const staffServices = require('./services/staffServices');
const staffValidator = require('./validator/staffValidator');
const Staff = require('./models/staffModel');

module.exports = {
    staffController,
    staffRoutes,
    staffServices,
    Staff
}