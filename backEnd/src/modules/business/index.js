const businessController = require('./controllers/businessController');
const businessRoutes = require('./routes/businessRoutes');
const businessService = require('./services/businessServices');
const businessValidator = require('./validators/businessValidator');
const business = require('./models/businessModel');

module.exports ={
    businessController,
    businessRoutes,
    businessService,
    businessValidator,
    business
}
