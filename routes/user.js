// Import necessary modules
const express = require('express');
const bcrypt = require('bcrypt');

// Import necessary models
const User = require('../models/User');

// Use Express router
let router = express.Router();

// Logger middleware
router.use((req, res, next) => {
	const event = new Date();
	console.log("Attempted to access user ressource : ", event.toString());
	next();
});

// Routing of User ressource
router.get('', (req, res) => {

	User.findAll().then(users => {

		res.json({ users });

	}).catch(err => {

		res.status(500).json({
			message: "Database Error", error: err
		});

	});
});

router.get('/:id', (req, res) => {

	let userId = parseInt(req.params.id);

	// Check if id field is here and coherent
	if (!userId) {
		return res.status(400).json({
			message: "Missing Parameter"
		});
	}

	// Get user
	User.findOne({
		where: { id: userId },
		raw: true
	}).then(user => {

		if (user === null) {
			return res.status(404).json({
				message: "User does not exist"
			});
		}

		// Found user
		return res.json({ data: user });

	}).catch(err => {
		res.status(500).json({
			message: "Database error",
			error: err
		});
	});
});

router.put('', (req, res) => {

	const { username, email, password } = req.body;

	// Response validation
	if (!username || !email || !password) {
		return res.status(400).json({
			message: "Missing data"
		});
	}

	User.findOne({
		where: { email: email },
		raw: true
	}).then(user => {

		// Check if user already exists
		if (user !== null) {
			return res.status(409).json({
				message: `User ${username} already exists`
			});
		}

		// Password hashing
		bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND)).then(hash => {

			req.body.password = hash;

			// User creation
			User.create(req.body).then(user => {
				res.json({
					message: "User created",
					data: user
				});

			}).catch(err => {
				res.status(500).json({
					message: "Database error",
					error: err
				});
			});

		}).catch(err => {
			res.status(500).json({
				message: "Hash process error",
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

router.patch('/:id', (req, res) => {

	let userId = parseInt(req.params.id)

	// Check if id field is here and coherent
	if (!userId) {
		return res.status(400).json({
			message: "Missing parameter"
		});
	}

	// User search
	User.findOne({
		where: { id: userId },
		raw: true
	}).then(user => {
		// Check if user exists
		if (user === null) {
			return res.status(404).json({
				message: "User does not exists"
			});
		}

		// User update
		User.update(req.body, {
			where: { id: userId }
		}).then(user => {
			res.json({
				message: "User updated"
			});

		}).catch(err => {
			res.status(500).json({
				message: "Database error",
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

router.post('/untrash/:id', (req, res) => {

	let userId = parseInt(req.params.id)

	// Check if id field is here and coherent
	if (!userId) {
		return res.status(400).json({
			message: "Missing parameter"
		});
	}

	User.restore({
		where: { id: userId }
	}).then(() => {
		res.status(204).json({
			message: "User restored"
		});
	}).catch(err => {
		res.status(500).json({
			message: "Database error",
			error: err
		});
	});
});

router.delete('/trash/:id', (req, res) => {

	let userId = parseInt(req.params.id)

	// Check if id field is here and coherent
	if (!userId) {
		return res.status(400).json({
			message: "Missing parameter"
		});
	}

	// User delete
	User.destroy({
		where: { id: userId }
	}).then(() => {
		res.status(204).json({
			message: "User deleted"
		});
	}).catch(err => {
		res.status(500).json({
			message: "Database error",
			error: err
		});
	});
});

router.delete('/:id', (req, res) => {

	let userId = parseInt(req.params.id)

	// Check if id field is here and coherent
	if (!userId) {
		return res.status(400).json({
			message: "Missing parameter"
		});
	}

	// Force user delete
	User.destroy({
		where: { id: userId },
		force: true
	}).then(() => {
		res.status(204).json({
			message: "User force deleted"
		});

	}).catch(err => {
		res.status(500).json({
			message: "Database error",
			error: err
		});
	});
});

module.exports = router;