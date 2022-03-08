const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const models = require('../models/index')

// Use Express router
let router = express.Router()

// Logger middleware
router.use((req, res, next) => {
    const event = new Date()
    console.log("Attempted to authenticate : ", event.toString())
    next()
})

/**
 * @api {post} /login Login to API.
 * @apiName PostLogin
 * @apiGroup Auth
 * @apiParam {String} email User unique email.
 * @apiParam {String} password User password.
 * @apiSuccess {String} accessToken JWT token with expiration date.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOi..."
 *     }
 * @apiError {String} message "login process failed".
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "login process failed",
 *       "error": err
 *     }
 * 
 *     HTTP/1.1 400 Internal Server Error
 *     {
 *       "message": "incorrect email or password",
 *       "error": err
 *     }
 */
router.post('/login', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            message: "incorrect email or password"
        })
    }

    models.User.findOne({
        where: { email: email }
    }).then(user => {
        if (user === null) {
            return res.status(401).json({
                message: "account does not exists"
            })
        }

        // Password check
        bcrypt.compare(password, user.password).then(test => {
            if (!test) {
                return res.status(401).json({
                    message: "incorrect password"
                })
            }

            // Generate token
            const accessToken = jwt.sign({
                id: user.dataValues.id,
                email: user.dataValues.email
            }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_DURING
            })

            return res.json({
                accessToken
            })
        }).catch(err => {
            res.status(500).json({
                message: "login process failed",
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


// Registering (creating) a user with its email and password
// This route generate a jwt token if successful
router.post('/register', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            message: "incorrect email or password"
        })
    }

    // Hashing and salting password
    bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND)).then(hash => {
        // Creating user
        models.User.create({ email: email, password: hash }).then(user => {
            // Generate token
            const accessToken = jwt.sign({
                id: user.dataValues.id,
                email: user.dataValues.email
            }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_DURING
            })

            return res.json({
                accessToken
            })
        }).catch(err => {
            res.status(500).json({
                message: "registering process failed",
                error: err
            })
        })
    }).catch(err => {
        res.status(500).json({
            message: "hashing process failed",
            error: err
        })
    })
})

module.exports = router