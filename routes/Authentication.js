const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router({mergeParams:true});
const { isAuth } = require('../utils/isAuth');
const {loginValidation, signUpValidation} = require('../Validation');
const {login, signup, logout, otpVerify, isAuthenticated} = require('../controllers/contollerAuth');


router
    .get('/isAuthenticated', isAuth, wrapAsync(isAuthenticated))
    .post('/login', loginValidation,wrapAsync(login))
    .post('/signup', signUpValidation,wrapAsync(signup))
    .post('/logout', logout)
    .post('/verify-otp',wrapAsync(otpVerify));


module.exports = router;