const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const models = require('../models/index')

// Usage de Express Router
let router = express.Router()

// Middleware de logs
router.use((req, res, next) => {
    const event = new Date()
    console.log("Attempted to authenticate : ", event.toString())
    next()
})

/**
 * @api {post} /login Connexion à l'API
 * @apiName PostLogin
 * @apiGroup Auth
 * @apiBody {String} email Email unique de l'utilisateur
 * @apiBody {String} password Mot de passe de l'utilisateur
 * @apiSuccess {String} accessToken Token JWT avec expiration
 * @apiSuccessExample Success-Response-Example:
 *     HTTP/1.1 200 OK
 *     {
 *       "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOi..."
 *     }
 * @apiError {String} message Description concise du problème
 * @apiError {String} error Si statut HTTP >= 500. Valeur du paramètre error de la méthode catch
 * @apiErrorExample Error-Response-Examples:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "login process failed",
 *       "error": err
 *     }
 * 
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "database error",
 *       "error": err
 *     }
 * 
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "incorrect email or password",
 *     }
 * 
  *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "account does not exists",
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

        // Check du mot de passe (comparaison avec le hash en bdd)
        bcrypt.compare(password, user.password).then(test => {
            if (!test) {
                return res.status(401).json({
                    message: "incorrect password"
                })
            }

            // Generation du token
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


/**
 * @api {post} /register Inscription à l'API
 * @apiName PostRegister
 * @apiGroup Auth
 * @apiBody {String} email Email unique choisi
 * @apiBody {String} password Mot de passe choisi
 * @apiSuccess {String} accessToken Token JWT avec expiration
 * @apiSuccessExample Success-Response-Example:
 *     HTTP/1.1 200 OK
 *     {
 *       "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOi..."
 *     }
 * @apiError {String} message Description concise du problème
 * @apiError {String} error Si statut HTTP >= 500. Valeur du paramètre error de la méthode catch
 * @apiErrorExample Error-Response-Examples:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "registering process failed",
 *       "error": err
 *     }
 * 
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "hashing process failed",
 *       "error": err
 *     }
 * 
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "incorrect email or password",
 *     }
 */
router.post('/register', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            message: "incorrect email or password"
        })
    }

    // Hashage et salage du mot de passe fourni
    bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND)).then(hash => {
        // Création de l'utilisateur
        models.User.create({ email: email, password: hash }).then(user => {
            // Génération du token
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