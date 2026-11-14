const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    console.log(req.session);
    res.render('auth/login', {
        isAuthenticated: req.session.isLoggedIn,
        path: '/login',
        pageTitle: 'Login',
    });
};

exports.postLogin = (req, res, next) => {
    // this data is lost after we send a response
    // req.isLoggedIn = true;
    // res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10; HttpOnly');
    User.findById('6aeb6af6b7e2d46640d726ac')
        .then((user) => {
            req.session.isLoggedIn = true;
            // store a plain copy with ObjectIds as strings: the session store bundles an older
            // bson version and refuses to save the ObjectIds of our mongoose version
            // we share it across requests
            req.session.user = user.toObject({ flattenObjectIds: true });
            // make sure the session is written to MongoDB before we redirect
            req.session.save((err) => {
                if (err) {
                    console.log(err);
                }
                res.redirect('/');
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
