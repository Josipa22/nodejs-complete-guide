const express = require('express');
const adminData = require("./admin");

const router = express.Router();

// with use, this just says the route has to start with /
// with get, the path is exactly /, so it will not match /add-product
router.get('/', (req, res, next) => {
    const products = adminData.products;
    // it will use the default templating engine and return it
    res.render('shop', { prods: products, pageTitle: 'Shop', path: '/', hasProducts: products.length > 0, activeShop: true, productCSS: true });
})

module.exports = router;
