// protects a route: sends the visitor to the login form if they are not logged in
module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
};
