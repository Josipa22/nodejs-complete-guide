const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
    '/login',
    body('email', 'Please enter a valid email.')
        .isEmail()
        .normalizeEmail()
        .custom(async (value, { req }) => {
            // hand the found user (or null) to the controller so it doesn't query again;
            // the controller decides what a missing user means
            req.loginUser = await User.findOne({ email: value });
        }),
    body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters.',
    )
        .trim()
        .isLength({ min: 5 })
        .isAlphanumeric(),
    authController.postLogin,
);

router.post(
    '/signup',
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail()
        .custom(async (value, { req }) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error('Email exists already, please pick a different one.');
            }
        }),
    body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters.',
    )
        .trim()
        .isLength({ min: 5 })
        .isAlphanumeric(),
    body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match!');
            }
            return true;
        }),
    authController.postSignup,
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
