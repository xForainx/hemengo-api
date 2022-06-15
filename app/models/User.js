const { DataTypes } = require('sequelize')
const db = require('../db.config')

/**
 * User model definition.
 */
const User = db.define('user', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        is: /^\w{8,}$/i
    },
    username: {
        type: DataTypes.STRING(64),
        allowNull: true,
        defaultValue: ""
    },
    firstname: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: ""
    },
    lastname: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: ""
    },
    address: {
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
    {
        paranoid: true,
        indexes: [{ unique: true, fields: ["email"] }]
    }
)

module.exports = User