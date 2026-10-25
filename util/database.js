const { MongoClient } = require('mongodb');

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(process.env.MONGODB_URI)
        .then((client) => {
            console.log('Connected!');
            _db = client.db();
            callback(client);
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
};

// return access to that connected db (if it exists)
const getDb = () => {
    if (_db) {
        return _db;
    }

    throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
