// Import necessary modules
const { DataTypes } = require('sequelize')
const db = require('../db.config')

/**
 * City model definition.
 */
const City = db.define('City', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    postalCode: {
        type: DataTypes.STRING(6),
        allowNull: false
    },
    inseeCode: {
        type: DataTypes.STRING(6),
        allowNull: false
    }
},
    {
        paranoid: true,
        indexes: [{ unique: true, fields: ["name"] }]
    }
)

module.exports = City