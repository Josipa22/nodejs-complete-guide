const { ObjectId } = require('mongodb');

const getDb = require('../util/database').getDb;

class User {
    constructor(username, email, id, cart) {
        this.name = username;
        this.email = email;
        this._id = id ? new ObjectId(id) : undefined;
        this.cart = cart || { items: [] }; // { items: []}
    }

    save() {
        const db = getDb();
        let dbOp;

        if (this._id) {
            // Update the user
            dbOp = db.collection('users').updateOne({ _id: this._id }, { $set: this });
        } else {
            dbOp = db.collection('users').insertOne(this);
        }

        return dbOp.then((result) => console.log(result)).catch((err) => console.log(err));
    }

    addToCart(product) {
        // if it's not -1, the product exists
        const cartProductIndex = this.cart.items.findIndex((cp) => {
            // product._id treated as a string but it is not of type string, we can just use it as such
            return cp.productId.toString() === product._id.toString();
        });

        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
        }

        const updatedCart = {
            items: updatedCartItems,
        };

        const db = getDb();
        return db
            .collection('users')
            .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
    }

    getCart() {
        // return the fully populated cart
        const db = getDb();
        const productIds = this.cart.items.map((i) => {
            return i.productId;
        });

        return db
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then((products) => {
                // make sure to use arrow functions!
                return products.map((p) => {
                    return {
                        ...p,
                        quantity: this.cart.items.find((i) => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity,
                    };
                });
            });
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter((item) => {
            return item.productId.toString() !== productId.toString();
        });

        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: { items: updatedCartItems } } },
            );
    }

    // cart is already registered on this user
    addOrder() {
        const db = getDb();
        return db
            .collection('orders')
            .insertOne(this.cart)
            .then((result) => {
                this.cart = { items: [] };
                return db
                    .collection('users')
                    .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: [] } } });
            });
    }

    static findById(userId) {
        if (!ObjectId.isValid(userId)) {
            return Promise.resolve(null);
        }
        const db = getDb();
        return db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) })
            .then((user) => {
                console.log(user);
                return user;
            })
            .catch((err) => console.log(err));
    }
}

module.exports = User;
