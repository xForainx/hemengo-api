// Import necessary modules
const express = require('express');

// Import necessary models
const VendingMachine = require('../models/VendingMachine');

// Use Express router
let router = express.Router();

// Logger middleware
router.use((req, res, next) => {
    const event = new Date();
    console.log("Attempted to access vending machine ressource : ", event.toString());
    next();
});

// Routing of User ressource
// Fetch all machines
router.get('', (req, res) => {
    VendingMachine.findAll().then(machines => {
        res.json({ machines });
    }).catch(err => {
        res.status(500).json({
            message: "Database Error",
            error: err
        });
    });
});

// Create one machine
router.post('', (req, res) => {
    const { ref, latitude, longitude, maxLines, maxRows } = req.body;

    VendingMachine.create({
        ref: ref,
        latitude: latitude,
        longitude: longitude,
        maxLines: maxLines,
        maxRows: maxRows
    }).then(machine => {
        console.log("Machine created", machine);
    }).catch(err => {
        res.status(500).json({
            message: "Database Error",
            error: err
        });
    });
});

module.exports = router;