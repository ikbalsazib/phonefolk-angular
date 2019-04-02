const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        const error = new Error('Sorry! Not Authorized.');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'this_is_my_secret_key');
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken) {
        const error = new Error('Auth Error!');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}