const path = require('path');
const express = require('express');
const rootDir = require('../util/path');

const router = express.Router();


// with use, this just says the route has to start with /
// with get, the path is exactly /, so it will not match /add-product
router.get('/', (req, res, next) => {
    // the incorrect path
    // res.sendFile('/views/shop.html');
    // dirname is a global variable that holds the absolute path on our OS to this project folder
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
})

module.exports = router;
