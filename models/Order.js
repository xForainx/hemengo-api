// Import necessary modules
const { DataTypes } = require('sequelize');
const db = require('../db.config');

const User = require('./User');
const Status = require('./Status');
const VendingMachine = require('./VendingMachine');

// User model definition
const Order = db.define('Order', {
	id: {
		type: DataTypes.INTEGER(11),
		primaryKey: true,
		autoIncrement: true
	},
	price: {
		type: DataTypes.FLOAT(11),
		allowNull: false
	},
	pickupDate: {
		type: DataTypes.DATE,
		allowNull: false
	}
},
	{ paranoid: true }
);

// Associations : One-To-Many relations (1<-->N)
User.hasMany(Order);
Order.belongsTo(User);

Status.hasMany(Order);
Order.belongsTo(Status);

VendingMachine.hasMany(Order);
Order.belongsTo(VendingMachine);

module.exports = Order;