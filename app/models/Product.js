// Import necessary modules
const { DataTypes } = require('sequelize')
const db = require('../db.config')

/**
 * Product model definition.
 * It implements a FK productCategoryId that points to productcategories.id.
 */
const Product = db.define('Product', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false

    },
    ref: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    daysBeforeExpire: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
},
    {
        paranoid: true,
        indexes: [{ unique: true, fields: ["name", "ref"] }]
    }
)

module.exports = Product