const utils = require('../utils/utils');

module.exports = (req, res, next) => {
    try {
        utils.tokenDecoder(req);
        next();
    }
    catch (error) {
        res.status(401).json({error});
    }
}