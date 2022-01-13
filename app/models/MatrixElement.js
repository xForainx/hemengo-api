// Import necessary modules
const { DataTypes } = require('sequelize')
const db = require('../db.config')

/**
 * Matrix element model definition.
 * On 17/11/2021 this is what our most common vending machine's grid/matrix looks like:
 * A1 B1 C1 D1 E1
 * A2 B2 C2 D2 E2
 * A3 B3 C3 D3 E3
 * A4 B4 C4 D4 E4
 * A5 B5 C5 D5 E5
 * A6 B6 C6 D6 E6
 */
const MatrixElement = db.define('MatrixElement', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    ref: {
        type: DataTypes.STRING(5),
        allowNull: false
    }
},
    { 
        paranoid: true,
        indexes: [{ unique: true, fields: ["ref"] }]
    }
)

module.exports = MatrixElement