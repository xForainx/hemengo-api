// Import necessary modules
const express = require('express');
const bcrypt = require('bcrypt');
const models = require('../models/index');

// Use Express router
let router = express.Router();

// Logger middleware
router.use((req, res, next) => {
    const event = new Date();
    console.log("Attempted to access user ressource : ", event.toString());
    next();
});

// Routing of User ressource

// Fetch all users
router.get('', (req, res) => {
    models.User.findAll().then(users => {
        res.json({ users });
    }).catch(err => {
        res.status(500).json({
            message: "Database Error", error: err
        });
    });
});


// Fetch one user
router.get('/:id', (req, res) => {
    let userId = parseInt(req.params.id);

    if (!userId) {
        return res.status(400).json({
            message: "Missing Parameter"
        });
    }

    models.User.findOne({
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


// Create one user : PUT method because a POST/create already exists in 
// the auth routes (register endpoint)
router.put('', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Missing data"
        });
    }

    models.User.findOne({
        where: { email: email },
        raw: true
    }).then(user => {
        // Check if user already exists
        if (user !== null) {
            return res.status(409).json({
                message: `User ${email} already exists`
            });
        }

        // Password hashing
        bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND)).then(hash => {
            req.body.password = hash;
            // User creation
            models.User.create(req.body).then(user => {
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


// Update one user
router.patch('/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    if (!userId) {
        return res.status(400).json({
            message: "Missing parameter"
        });
    }

    models.User.findOne({
        where: { id: userId },
        raw: true
    }).then(user => {
        if (user === null) {
            return res.status(404).json({
                message: "User does not exists"
            });
        }

        models.User.update(req.body, {
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


// Restore one user
router.post('/untrash/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    if (!userId) {
        return res.status(400).json({
            message: "Missing parameter"
        });
    }

    models.User.restore({
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


// Soft delete one user
router.delete('/trash/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    if (!userId) {
        return res.status(400).json({
            message: "Missing parameter"
        });
    }

    models.User.destroy({
        where: { id: userId }
    }).then(() => {
        res.status(204).json({
            message: "User softly deleted"
        });
    }).catch(err => {
        res.status(500).json({
            message: "Database error",
            error: err
        });
    });
});


// Force delete one user
router.delete('/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    if (!userId) {
        return res.status(400).json({
            message: "Missing parameter"
        });
    }

    // Forcing delete of user
    models.User.destroy({
        where: { id: userId },
        force: true
    }).then(() => {
        res.status(204).json({
            message: "User forcely deleted"
        });
    }).catch(err => {
        res.status(500).json({
            message: "Database error",
            error: err
        });
    });
});

module.exports = router;