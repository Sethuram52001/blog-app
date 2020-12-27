const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: '../config/config' });
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.jwtSecret;

function auth(req, res, next) {
    const token = req.header('x-auth-token');

    // check for token
    if (!token) {
        res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        // verify token
        const decoded = jwt.verify(token, jwtSecret);

        // add user from payload
        req.user = decoded;
        next();
    }
    catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
}

module.exports = auth;