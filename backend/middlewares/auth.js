const token = require('../utils/token');

module.exports = (req, res, next) => {
    try {
        token.tokenDec(req);
        next();
    }
    catch (error) {
        res.status(401).json({error});
    }
}