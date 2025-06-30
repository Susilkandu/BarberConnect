const salonController = require('./controllers/salonController');
const salonRoutes = require('./routes/salonRoutes');
const salonServices = require('./services/salonServices');
const salonValidator = require('./validators/salonValidators');
const Salon = require('./models/salonModel');

module.exports = {
    salonController,
    salonRoutes,
    salonServices,
    salonValidator,
    Salon
}
