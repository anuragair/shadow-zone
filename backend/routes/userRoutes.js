const express = require('express');
const router = express.Router();
const { signup, signin, verifyOTP, verifySigninOTP } = require('../controllers/userController');

// Signup process
router.post('/signup', signup);
router.post('/verify-signup', verifyOTP);

// Signin process
router.post('/signin', signin);
router.post('/verify-signin', verifySigninOTP);

module.exports = router; 