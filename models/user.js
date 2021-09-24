// Import necessary modules
const { dataTypes } = require('sequelize');
const db = require('../db.config');

// User model definition
const User = db.define('user', {

	id: {
		type: dataTypes.INTEGER(11),
		primaryKey: true,
		autoIncrement: true
	},
	username: {
		type: dataTypes.STRING(45),
		allowNull: false,
		unique: true
	},
	firstname: {
		type: dataTypes.STRING(255),
		defaultValue: '',
		allowNull: true
	},
	lastname: {
		type: dataTypes.STRING(255),
		defaultValue: '',
		allowNull: true
	},
	email: {
		type: dataTypes.STRING(255),
		allowNull: false,
		// Some data validation
		validate: {
			isEmail: true
		}
	},
	password: {
		type: dataTypes.STRING(255),
		allowNull: false,
		// Some constraint
		is: /^[0-9a-f]{64}$/i
	},
	address: {
		type: dataTypes.STRING(255),
		defaultValue: '',
		allowNull: true
	},
	verified: {
		type: dataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
},
	{
		// Soft delete
		paranoid: true
	}
);

// Model synchronization
// User.sync()
// User.sync({ force: true })
// User.sync({ alter: true })

module.exports = User;