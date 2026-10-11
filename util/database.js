const mysql = require('mysql2');

// we want a pool of connections to the database so we can reuse them instead of creating a new one every time
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'NewPass123!'
})

// allows us to use promises
module.exports = pool.promise();
