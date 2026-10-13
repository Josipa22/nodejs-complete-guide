const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    // takes a function it should execute once it's done
    Product.findAll()
        .then((products) => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/',
                hasProducts: products.length > 0,
                activeShop: true,
                productCSS: true,
            });
        })
        .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then((product) => {
            res.render('shop/product-detail', {
                pageTitle: product.title,
                product: product,
                path: '/products',
            });
        })
        .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                hasProducts: products.length > 0,
                activeShop: true,
                productCSS: true,
            });
        })
        .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then((cart) => {
            return cart.getProducts();
        })
        .then((products) => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your cart',
                products: products,
            });
        })
        .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });
    console.log(prodId);
    res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your orders',
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
    });
};
