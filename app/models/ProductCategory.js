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
        allowNull: false
    }
},
    { 
        paranoid: true,
        indexes: [{ unique: true, fields: ["name"] }] 
    }
)

module.exports = ProductCategory