// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/user');
const inputValidator = require('../controller/input-validation');

// Get Express Router Function..
const router = express.Router();

router.put('/signup', inputValidator.checkResigterInput, controller.userSignUp); // http://localhost:5000/auth/signup
router.post('/signin', controller.userLogin); // http://localhost:5000/auth/signin

// Export All router..
module.exports = router;