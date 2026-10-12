const Sequelize = require('sequelize');

// the constructor function needs some options
const sequelize = new Sequelize('node-complete', 'root', 'NewPass123!', {
    dialect: 'mysql', 
    host: 'localhost'
});

module.exports = sequelize;
