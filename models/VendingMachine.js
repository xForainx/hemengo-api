// Import necessary modules
const { DataTypes } = require('sequelize');
const db = require('../db.config');
const crypto = require('crypto');

// User model definition
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
        type: DataTypes.STRING(255)
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
    maxLines: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    maxRows: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
    { paranoid: true }
);

module.exports = VendingMachine;