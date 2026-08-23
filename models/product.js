// constructor function
// module.exports = function Product() {

// }

const products = [];

module.exports = class Product {
    constructor(t) {
        this.title = t;
    }

    save() {
        // it will refer to the object created based on the class
        products.push(this);
    }

    // makes sure we can call this directly on the class itself and not on an instatiated object
    static fetchAll() {
        return products;
    }
}
