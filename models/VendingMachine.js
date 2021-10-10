// Import necessary modules
const { DataTypes } = require('sequelize');
const db = require('../db.config');

// User model definition
const VendingMachine = db.define('VendingMachine', {
	id: {
		type: DataTypes.INTEGER(11),
		primaryKey: true,
		autoIncrement: true
	},
	ref: {
		type: DataTypes.STRING(255),
		allowNull: false,
		unique: true
	},
	latitude: {
		type: DataTypes.FLOAT,
		allowNull: false
	},
	longitude: {
		type: DataTypes.FLOAT,
		allowNull: false
	},
	address: {
		type: DataTypes.STRING(255),
		defaultValue: ''
	},
	maxLines: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	maxRows: {
		type: DataTypes.INTEGER,
		allowNull: false
	}
},
	{ paranoid: true }
);

module.exports = VendingMachine;