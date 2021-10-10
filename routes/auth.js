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
	console.log("Authentication attempt at : ", event.toString());
	next();
})

// Routing of Auth ressource
router.post('/login', (req, res) => {

	const { email, password } = req.body;

	// Response validation
	if (!email || !password) {
		return res.status(400).json({
			message: "Incorrect email or password"
		});
	}

	User.findOne({
		where: { email: email }
	}).then(user => {
		// Check if user exists
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

			// Génération du token
			const token = jwt.sign({
				id: user.id,
				username: user.username,
				email: user.email
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
})

module.exports = router;