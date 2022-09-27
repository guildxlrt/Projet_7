const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN);

        const userId = decodedToken.userId;
        const isAdmin = decodedToken.isAdmin;
        
        req.auth = {
            userId : userId,
            isAdmin : isAdmin
        };
        next();
    }
    catch (error) {
        res.status(401).json({error});
    }
}