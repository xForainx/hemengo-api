// Import necessary modules
const { DataTypes } = require('sequelize');
const db = require('../db.config');

const User = require('./User');
const Status = require('./Status');
const VendingMachine = require('./VendingMachine');

/**
 * Order model definition.
 * It implements a FK userId that points to users.id.
 * It implements a FK statusId that points to statuses.id.
 * It implements a FK vendingMachineId that points to vendingmachines.id.
 */
const Order = db.define('Order', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    pickupDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
},
    { paranoid: true }
);

Order.belongsTo(User);
Order.belongsTo(Status);
Order.belongsTo(VendingMachine);

module.exports = Order;