// Import necessary modules
const { DataTypes } = require('sequelize')
const db = require('../db.config')

/**
 * Producer model definition.
 * It implements a FK cityId that points to cities.id (which gives us the city name, 
 * postal code and insee code).
 */
const Producer = db.define('Producer', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        indexes: [{ unique: true, fields: ["name"] }]
    },
    presentation: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: ""
    },
    street: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: ""
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},
    { paranoid: true }
)

module.exports = Producer