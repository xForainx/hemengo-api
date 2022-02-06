// Import necessary modules
const { DataTypes } = require('sequelize')
const db = require('../db.config')

/**
 * Matrix element model definition.
 */
const MatrixElement = db.define('MatrixElement', {
    ref: {
        primaryKey: true,
        type: DataTypes.STRING(2),
        allowNull: false
    }
})

module.exports = MatrixElement