// Import necessary modules
const { DataTypes } = require('sequelize')
const db = require('../db.config')

/**
 * Vending machine's Locker model definition.
 * It implements a FK productId that points to products.id.
 * It implements a FK matrixElementId that points to matrixelements.id.
 * A Locker is a compartment with one sort of product in it.
 * A Locker is empty if it is not full and vice versa.
 * A Locker is "located" within the Vending machine "grid" thanks to a matrix 
 * element id, you can retrieve the Locker location with this matrix id. 
 * For example, a Locker with matrix element id 1 (meaning ref "A1" - i.e. 
 * MatrixElement Model) means it is located on the 1st line and 1st row of the 
 * vending machine, which is the top left corner.
 */
const Locker = db.define('Locker', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    isFull: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    lastRefill: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    nextPlannedRefill: {
        type: DataTypes.DATE,
        allowNull: true,
    }
},
    { paranoid: true }
)

module.exports = Locker