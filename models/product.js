const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// WE CAN STILL DEVIATE FROM THIS!
const productSchema = new Schema({
    // also define types of each value
    title: {
        type: String,
        required: true, // with this we give up some of the flexibility
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
});

// a function we call to connect a schema with a name (you give that model a name)
module.exports = mongoose.model('Product', productSchema);

// const { ObjectId } = require('mongodb');

// const getDb = require('../util/database').getDb;

// class Product {
//     constructor(title, price, description, imageUrl, id, userId) {
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id ? new ObjectId(id) : undefined;
//         this.userId = userId;
//     }

//     save() {
//         const db = getDb();
//         let dbOp;
//         if (this._id) {
//             // Update the product
//             dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this });
//         } else {
//             dbOp = db.collection('products').insertOne(this);
//         }

//         return dbOp.then((result) => console.log(result)).catch((err) => console.log(err));
//     }

//     static fetchAll() {
//         const db = getDb();
//         return db
//             .collection('products')
//             .find()
//             .toArray()
//             .then((products) => {
//                 console.log(products);
//                 return products;
//             })
//             .catch((err) => console.log(err));
//     }

//     static findById(prodId) {
//         if (!ObjectId.isValid(prodId)) {
//             return Promise.resolve(null);
//         }
//         const db = getDb();
//         return db
//             .collection('products')
//             .find({ _id: new ObjectId(prodId) })
//             .next()
//             .then((product) => {
//                 console.log(product);
//                 return product;
//             })
//             .catch((err) => console.log(err));
//     }

//     static deleteById(prodId) {
//         const db = getDb();
//         return db
//             .collection('products')
//             .deleteOne({ _id: new ObjectId(prodId) })
//             .then((result) => {
//                 console.log('Deleted');
//             })
//             .catch((err) => console.log(err));
//     }
// }

// module.exports = Product;
