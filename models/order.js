const Sequelize = require('sequelize');

const sequelize = require('../util/database');

//in-between table between user and multiple products
const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
})

module.exports = Order;
