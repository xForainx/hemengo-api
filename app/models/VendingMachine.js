// Import necessary modules
const { DataTypes } = require('sequelize')
const db = require('../db.config')

/**
 * Vending machine model definition.
 * It implements a FK cityId that points to cities.id (which gives us the city name, 
 * postal code and insee code).
 */
const VendingMachine = db.define('VendingMachine', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    ref: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "thx-1138"
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    street: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: ""
    },
    maxLineCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 6
    },
    maxRowCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5
    }
},
    { paranoid: true }
)

module.exports = VendingMachine