// Import necessary modules
const { DataTypes } = require('sequelize');
const db = require('../db.config');

/**
 * Producer model definition.
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
        unique: true
    },
    presentation: {
        type: DataTypes.STRING(255),
        defaultValue: ''
    },
    address: {
        type: DataTypes.STRING(255),
        defaultValue: ''
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},
    { paranoid: true }
);

module.exports = Producer;