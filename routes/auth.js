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
        .custom(async (value, { req }) => {
            const user = await User.findOne({ email: value });
            if (!user) {
                throw new Error('Invalid email or password.');
            }
            // hand the found user to the controller so it doesn't query again
            req.loginUser = user;
        }),
    body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters.',
    )
        .isLength({ min: 5 })
        .isAlphanumeric(),
    authController.postLogin,
);

router.post(
    '/signup',
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
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
        .isLength({ min: 5 })
        .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
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
