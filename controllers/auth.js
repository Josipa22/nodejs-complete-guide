const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: process.env.SENDGRID_API_KEY,
        },
    }),
);

exports.getLogin = (req, res, next) => {
    // req.flash returns an array, so take the first message or null when there is none
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then((user) => {
        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }
        bcrypt
            .compare(password, user.password)
            .then((doMatch) => {
                // will be true if passwords match, otherwise false
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    // store a plain copy with ObjectIds as strings: the session store bundles an older
                    // bson version and refuses to save the ObjectIds of our mongoose version
                    // we share it across requests
                    req.session.user = user.toObject({ flattenObjectIds: true });
                    // make sure the session is written to MongoDB before we redirect
                    return req.session.save((err) => {
                        if (err) {
                            console.log(err);
                        }
                        res.redirect('/');
                    });
                }
                res.redirect('/login');
            })
            .catch((err) => {
                console.log(err);
                req.flash('error', 'Invalid email or password');
                res.redirect('/login');
            });
    });
};

exports.postSignup = (req, res, next) => {
    // we want to store new user in the db
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
        });
    }

    User.findOne({ email })
        .then((userDoc) => {
            if (userDoc) {
                req.flash('error', 'Email exists already, please pick a different one.');
                return res.redirect('/signup');
            }
            // cannot be decrypted!!
            return bcrypt.hash(password, 12).then((hashedPassword) => {
                const user = new User({
                    email,
                    password: hashedPassword,
                    cart: { items: [] },
                });
                return user
                    .save()
                    .then((result) => {
                        res.redirect('/login');
                        return transporter.sendMail({
                            to: email,
                            from: process.env.MAIL_FROM,
                            subject: 'Signup succeeded',
                            html: '<h1>You successfully signed up!</h1>',
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        })

        .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
    // session cookie will be kept in the browser, but it is worthless and it is not a problem, will be deleted from db and after browser is closed
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset password',
        errorMessage: message,
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return res.redirect('/reset');
        }
        // convert to normal ASCII characters
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    req.flash('error', 'No account with that email found');
                    return res.redirect('/reset');
                }

                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save().then((result) => {
                    res.redirect('/');
                    return transporter.sendMail({
                        to: req.body.email,
                        from: process.env.MAIL_FROM,
                        subject: 'Password reset',
                        html: `
                            <h1>You requested password reset</h1>
                            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                        `,
                    });
                });
            })
            .catch((err) => console.log(err));
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    // greater than: $gt
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then((user) => {
            if (!user) {
                req.flash('error', 'Password reset link is invalid or has expired');
                return res.redirect('/reset');
            }
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token,
            });
        })
        .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() },
        _id: userId,
    })
        .then((user) => {
            resetUser = user;
            if (!user) {
                req.flash('error', 'Password reset link is invalid or has expired');
                return res.redirect('/reset');
            }
            return bcrypt.hash(newPassword, 12);
        })
        .then((hashedPassword) => {
            if (!resetUser) {
                return;
            }
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then((result) => {
            if (!resetUser) {
                return;
            }
            res.redirect('/login');
        })
        .catch((err) => console.log(err));
};
