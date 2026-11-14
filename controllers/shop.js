const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    // it gives us the products when using mongoose
    Product.find()
        .then((products) => {
            console.log(products);
            res.render('shop/product-list', {
                isAuthenticated: req.session.isLoggedIn,
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
                hasProducts: products.length > 0,
                activeShop: true,
                productCSS: true,
            });
        })
        .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    // we can even pass a string instead of number
    Product.findById(prodId)
        .then((product) => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('shop/product-detail', {
                isAuthenticated: req.session.isLoggedIn,
                pageTitle: product.title,
                product: product,
                path: '/products',
            });
        })
        .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render('shop/index', {
                isAuthenticated: req.session.isLoggedIn,
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
    req.session.user
        .populate('cart.items.productId')
        .then((user) => {
            const products = user.cart.items.filter((i) => i.productId);
            res.render('shop/cart', {
                isAuthenticated: req.session.isLoggedIn,
                path: '/cart',
                pageTitle: 'Your cart',
                products: products,
            });
        })
        .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then((product) => {
            return req.session.user.addToCart(product);
        })
        .then((result) => {
            console.log(result);
            return res.redirect('/cart');
        })
        .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.session.user
        .removeFromCart(prodId)
        .then((result) => {
            res.redirect('/cart');
        })
        .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
    req.session.user
        .populate('cart.items.productId')
        .then((user) => {
            console.log(user.cart.items);
            const products = user.cart.items
                .filter((i) => i.productId)
                .map((i) => ({
                    quantity: i.quantity,
                    product: { ...i.productId._doc },
                }));
            const order = new Order({
                user: {
                    name: req.session.user.name,
                    userId: req.session.user._id,
                },
                products: products,
            });
            return order.save();
        })
        .then(() => req.session.user.clearCart())
        .then(() => res.redirect('/orders'))
        .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.session.user._id })
        .then((orders) => {
            res.render('shop/orders', {
                isAuthenticated: req.session.isLoggedIn,
                path: '/orders',
                pageTitle: 'Your orders',
                orders: orders,
            });
        })
        .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        isAuthenticated: req.session.isLoggedIn,
        path: '/checkout',
        pageTitle: 'Checkout',
    });
};
