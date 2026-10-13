const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const errorController = require('./controllers/error');
// basically the pool that allows us to use connection in it
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// only registers a middleware
// will only run for incoming requests
app.use((req, res, next) => {
    User.findByPk(1)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE', // if we delete user, any products related to user will also be gone
});
// optional, can replace belongsTo
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// syncs your models to the db by creating the appropriate tables and relations
// npm start runs sequelize, not incoming requests
sequelize
    // .sync({ force: true }) // will also define relations
    .sync()
    .then((result) => {
        return User.findByPk(1);
        // console.log(result);
    })
    .then((user) => {
        if (!user) {
            User.create({ name: 'Max', email: 'test@test.com' });
        }
        // if you return value in then block, it's automatically wrapped in a new promise
        // return Promise.resolve(user);
        return user;
    })
    .then((user) => {
        // console.log(user);
        return user.createCart();
    })
    .then((cart) => {
        app.listen(3000);
    })
    .catch((err) => console.log(err));
