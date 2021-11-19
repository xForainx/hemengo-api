// Import necessary modules
const express = require('express')
const bcrypt = require('bcrypt')
const models = require('../models/index')

// Use Express router
let router = express.Router()

// Logger middleware
router.use((req, res, next) => {
    const event = new Date()
    console.log("Attempted to access user ressource : ", event.toString())
    next()
})

// Routing of User ressource

// Fetch all users
router.get('', (req, res) => {
    models.User.findAll().then(users => {
        res.json({ users })
    }).catch(err => {
        res.status(500).json({
            message: "database Error",
            error: err
        })
    })
})


// Fetch one user by its id
router.get('/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    if (!userId) {
        return res.status(400).json({
            message: "missing Parameter"
        })
    }

    models.User.findOne({
        where: { id: userId },
        raw: true
    }).then(user => {
        if (user === null) {
            return res.status(404).json({
                message: "user does not exist"
            })
        }
        // Found user
        return res.json({ data: user })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Create one user : PUT method because a POST/create already exists in 
// the auth routes (register endpoint)
router.put('', (req, res) => {
    const {
        email,
        password,
        username,
        firstname,
        lastname,
        address,
        verified
    } = req.body

    if (!email || !password) {
        return res.status(400).json({
            message: "missing data"
        })
    }

    models.User.findOne({
        where: { email: email },
        raw: true
    }).then(user => {
        // Check if user already exists
        if (user !== null) {
            return res.status(409).json({
                message: `user ${email} already exists`
            })
        }

        // Password hashing
        bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND)).then(hash => {
            // User creation, careful to store the hash in place of password
            models.User.create({
                password: hash,
                email,
                username,
                firstname,
                lastname,
                address,
                verified
            }).then(user => {
                res.json({
                    message: "user created",
                    data: user
                })
            }).catch(err => {
                res.status(500).json({
                    message: "database error",
                    error: err
                })
            })
        }).catch(err => {
            res.status(500).json({
                message: "hash process error",
                error: err
            })
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Update one user
router.patch('/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    if (!userId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.User.findOne({
        where: { id: userId },
        raw: true
    }).then(user => {
        if (user === null) {
            return res.status(404).json({
                message: "user does not exists"
            })
        }

        models.User.update(req.body, {
            where: { id: userId }
        }).then(user => {
            res.json({
                message: "user updated"
            })
        }).catch(err => {
            res.status(500).json({
                message: "database error",
                error: err
            })
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Restore one user
router.post('/untrash/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    if (!userId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.User.restore({
        where: { id: userId }
    }).then(() => {
        res.status(204).json({
            message: "user restored"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Soft delete one user
router.delete('/trash/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    if (!userId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.User.destroy({
        where: { id: userId }
    }).then(() => {
        res.status(204).json({
            message: "user softly deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Force delete one user
router.delete('/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    if (!userId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    // Forcing delete of user
    models.User.destroy({
        where: { id: userId },
        force: true
    }).then(() => {
        res.status(204).json({
            message: "user forcely deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

module.exports = router