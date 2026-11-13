exports.getLogin = (req, res, next) => {
    const isLoggedIn = req.get('Cookie').split(';')[0].trim().split('=')[1] === 'true';
    res.render('auth/login', {
        isAuthenticated: isLoggedIn,
        path: '/login',
        pageTitle: 'Login',
    });
};

exports.postLogin = (req, res, next) => {
    // this data is lost after we send a response
    // req.isLoggedIn = true;
    res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10; HttpOnly');
    res.redirect('/');
};
