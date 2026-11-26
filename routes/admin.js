const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// we just pass a reference to this function
router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.getProducts);

const productValidators = [
    body('title')
        .trim()
        .isString()
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters long.'),
    body('imageUrl').trim().isURL().withMessage('Please enter a valid image URL.'),
    body('price').isFloat().withMessage('Please enter a valid price.'),
    body('description')
        .trim()
        .isLength({ min: 5, max: 400 })
        .withMessage('Description must be between 5 and 400 characters long.'),
];

router.post('/add-product', isAuth, productValidators, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, productValidators, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
