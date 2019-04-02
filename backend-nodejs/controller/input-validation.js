const { body } = require('express-validator/check');
// Require Post Schema from Model For Email Exsistance Check..
const User = require('../models/user');

// For Posts..
exports.checkPostInput = [body('title').trim().isLength({ min: 5 }), body('content').trim().isLength({ min: 5 }), body('slugName').trim()];

// For User..
exports.checkResigterInput = [
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email!')
    .custom((value, {req}) => {
        return User.findOne({email: value})
        .then(userEmailExists => {
            if (userEmailExists) {
                return Promise.reject('Email has been already resigtered!');
            }
        });
    }),
    body('password').trim().isLength({min: 3}),
    body('name').trim().not().isEmpty()
];