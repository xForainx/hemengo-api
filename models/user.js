// Import necessary modules
const { DataTypes } = require('sequelize');
const db = require('../db.config');

// User model definition
const User = db.define('User', {
	id: {
		type: DataTypes.INTEGER(11),
		primaryKey: true,
		autoIncrement: true
	},
	email: {
		type: DataTypes.STRING(255),
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true
		}
	},
	password: {
		type: DataTypes.STRING(255),
		allowNull: false,
		is: /^\w{8,}$/i
	},
	username: {
		type: DataTypes.STRING(45),
		defaultValue: ''
	},
	firstname: {
		type: DataTypes.STRING(255),
		defaultValue: ''
	},
	lastname: {
		type: DataTypes.STRING(255),
		defaultValue: ''
	},
	address: {
		type: DataTypes.STRING(255),
		defaultValue: ''
	},
	verified: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	}
},
	{ paranoid: true }
);

module.exports = User;