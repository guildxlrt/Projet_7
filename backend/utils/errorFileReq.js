const utils = require('../utils/utils');

module.exports = (error, status, req, res) => {
    debugger;
    if(req.file) utils.fileDel(req.file.filename)
    console.log(error)
    res.status(status).json(error)
}