const jwt = require('jsonwebtoken');
const ENV = require('../../../config/env');
const logError = require('../../middlewares/errors/logError');
const verifyToken = (token) => {
    try{
        const decoded = jwt.verify(token,ENV.JWT_SECRET);
        return decoded;
    }catch(err){
        if (err.name === 'SyntaxError') {
            logError(err);
        }
    }
};

module.exports = {
    verifyToken
}