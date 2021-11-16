// Import necessary modules
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import necessary models
const User = require('../models/user');

// Use Express router
let router = express.Router();

// Logger middleware
router.use((req, res, next) => {
    const event = new Date();
    console.log("Attempted to authenticate : ", event.toString());
    next();
});

// Routing of Auth ressource

// Log in an existing user by its email and password
// This route generate a jwt token if successful
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Incorrect email or password"
        });
    }

    User.findOne({
        where: { email: email }
    }).then(user => {
        if (user === null) {
            return res.status(401).json({
                message: "Account does not exists"
            });
        }

        // Password check
        bcrypt.compare(password, user.password).then(test => {
            if (!test) {
                return res.status(401).json({
                    message: "Incorrect password"
                });
            }

            // Generate token
            const token = jwt.sign({
                id: user.dataValues.id,
                email: user.dataValues.email
            }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_DURING
            });

            return res.json({
                accessToken: token
            });
        }).catch(err => {
            res.status(500).json({
                message: "Login process failed",
                error: err
            });
        });
    }).catch(err => {
        res.status(500).json({
            message: "Database error",
            error: err
        });
    });
});


// Registering (creating) a user with its email and password
// This route generate a jwt token if successful
router.post('/register', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Incorrect email or password"
        });
    }

    // Hashing and salting password
    bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND)).then(hash => {
        // Creating user
        User.create({ email: email, password: hash }).then(user => {
            // Generate token
            const token = jwt.sign({
                id: user.dataValues.id,
                email: user.dataValues.email
            }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_DURING
            });

            return res.json({
                accessToken: token
            });
        }).catch(err => {
            res.status(500).json({
                message: "Registering process failed",
                error: err
            });
        });
    }).catch(err => {
        res.status(500).json({
            message: "Hashing process failed",
            error: err
        });
    });
});

module.exports = router;