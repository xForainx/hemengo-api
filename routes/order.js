// Import necessary modules
const express = require('express');
const bcrypt = require('bcrypt');

// Import necessary models
const Order = require('../models/Order');

// Use Express router
let router = express.Router();

// Logger middleware
router.use((req, res, next) => {
    const event = new Date();
    console.log("Attempted to access order ressource : ", event.toString());
    next();
});

// Routing of User ressource
router.get('', (req, res) => {

    Order.findAll().then(orders => {

        res.json({ orders });

    }).catch(err => {

        res.status(500).json({
            message: "Database Error",
            error: err
        });

    });
});

module.exports = router;