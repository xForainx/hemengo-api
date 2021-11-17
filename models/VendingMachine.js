// Import necessary modules
const { DataTypes } = require('sequelize');
const db = require('../db.config');
const crypto = require('crypto');

/**
 * Vending machine model definition.
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
        unique: true,
        defaultValue: crypto.randomUUID()
    },
    ref: {
        type: DataTypes.STRING(255),
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
    address: {
        type: DataTypes.STRING(255),
        defaultValue: ''
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
);

module.exports = VendingMachine;