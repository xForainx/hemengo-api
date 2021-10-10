// Import necessary modules
const express = require('express');
const bcrypt = require('bcrypt');

// Import necessary models
const VendingMachine = require('../models/VendingMachine');

// Use Express router
let router = express.Router();

// Logger middleware
router.use((req, res, next) => {
	const event = new Date();
	console.log("Authentication time : ", event.toString());
	next();
});

// Routing of User ressource
router.get('', (req, res) => {

	VendingMachine.findAll().then(VendingMachines => {

		res.json({ data: VendingMachines });

	}).catch(err => {

		res.status(500).json({
			message: "Database Error", error: err
		});

	});
});

module.exports = router;