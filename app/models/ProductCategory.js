// Import necessary modules
const { DataTypes } = require('sequelize')
const db = require('../db.config')

/**
 * Product category model definition.
 */
const ProductCategory = db.define('ProductCategory', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        indexes: [{ unique: true, fields: ["name"] }]
    }
},
    { paranoid: true }
)

module.exports = ProductCategory