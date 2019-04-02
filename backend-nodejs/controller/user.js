// Require Main Modules..
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
// Json Web Token Module..
const jwt = require('jsonwebtoken');

// Require Post Schema from Model..
const User = require('../models/user');

// Create User..
const userSignUp = (req, res, next) => {
    const errors = validationResult(req);
    // Check Input validation Error with Error Handelar..
    if (!errors.isEmpty()) {
        const error = new Error('Input Validation Error!');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    // Main..
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12)
    .then(hashedPass => {
        const user = new User({
            email: email,
            name: name,
            password: hashedPass,
        });
        return user.save();
    })
    .then(result => {
        res.status(200).json({
            message: 'User Created Successfully!',
            userId: result._id
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

// Login User..
const userLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    // // For Find Account for login..
    User.findOne({email: email})
    .then(user => {
        if(!user) {
            const error = new Error('A user with this email could not be found!');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
        if(!isEqual) {
            const error = new Error('You entered a wrong password!');
            error.statusCode = 401;
            throw error;
        }
        // For Json Token Generate..
        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
            'this_is_my_secret_key',
            {expiresIn: '24h'}
        );
        res.status(200).json({
            token: token,
            expiredIn: 86400
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

// Exports All Function..
exports.userSignUp = userSignUp;
exports.userLogin = userLogin;