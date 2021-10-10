// Import necessary modules
const { DataTypes } = require('sequelize');
const db = require('../db.config');

// User model definition
const ProductCategory = db.define('ProductCategory', {
	id: {
		type: DataTypes.INTEGER(11),
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: DataTypes.STRING(255),
		allowNull: false,
		unique: true
	}
});

module.exports = ProductCategory;