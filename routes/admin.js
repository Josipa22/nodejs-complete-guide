const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

// create a router object that we can add routes to
const router = express.Router();

router.get('/add-product', (req, res, next) => {
    // res.send("<form action='/admin/add-product' method='POST'><input type='text' name='title'><button type='submit'>Add Product</button></form>");
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    // do not call next after response!!
})

// you can omit the third argument if you want to handle all requests to that route
// filter to incoming post requests
router.post('/add-product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;
