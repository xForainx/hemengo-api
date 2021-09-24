// Import necessary modules
const { DataTypes } = require('sequelize');
const db = require('../db.config');

// User model definition
const User = db.define('user', {

	id: {
		type: DataTypes.INTEGER(11),
		primaryKey: true,
		autoIncrement: true
	},
	username: {
		type: DataTypes.STRING(45),
		allowNull: false,
		unique: true
	},
	firstname: {
		type: DataTypes.STRING(255),
		defaultValue: '',
		allowNull: true
	},
	lastname: {
		type: DataTypes.STRING(255),
		defaultValue: '',
		allowNull: true
	},
	email: {
		type: DataTypes.STRING(255),
		allowNull: false,
		// Some data validation
		validate: {
			isEmail: true
		}
	},
	password: {
		type: DataTypes.STRING(255),
		allowNull: false,
		// Some constraint
		is: /^[0-9a-f]{64}$/i
	},
	address: {
		type: DataTypes.STRING(255),
		defaultValue: '',
		allowNull: true
	},
	verified: {
		type: DataTypes.BOOLEAN,
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