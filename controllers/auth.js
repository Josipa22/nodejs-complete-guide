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
    req.session.isLoggedIn = true;
    res.redirect('/');
};
