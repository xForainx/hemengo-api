// Import necessary modules
const express = require('express');
const bcrypt = require('bcrypt');

// Import necessary models
const Producer = require('../models/Producer');

// Use Express router
let router = express.Router();

// Logger middleware
router.use((req, res, next) => {
	const event = new Date();
	console.log("Attempted to access producer ressource : ", event.toString());
	next();
});

// Routing of User ressource
router.get('', (req, res) => {

	Producer.findAll().then(producers => {

		res.json({ producers });

	}).catch(err => {

		res.status(500).json({
			message: "Database Error", 
			error: err
		});

	});
});

module.exports = router;