const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    console.log(req.session);
    res.render('auth/login', {
        isAuthenticated: req.session.isLoggedIn,
        path: '/login',
        pageTitle: 'Login',
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false,
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then((user) => {
        if (!user) {
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
                res.redirect('/login');
            });
    });
};

exports.postSignup = (req, res, next) => {
    // we want to store new user in the db
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({ email })
        .then((userDoc) => {
            if (userDoc) {
                return res.redirect('/signup');
            }
            // cannot be decrypted!!
            return bcrypt.hash(password, 12).then((hashedPassword) => {
                const user = new User({
                    email,
                    password: hashedPassword,
                    cart: { items: [] },
                });
                return user.save().then((result) => res.redirect('/login'));
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
