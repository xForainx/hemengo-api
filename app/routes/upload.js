const { constants } = require('buffer')
const express = require('express')
const fs = require('fs')

// Usage Express Router
let router = express.Router()

// Middleware de logs
router.use((req, res, next) => {
    const event = new Date()
    console.log("Attempted to access assets : ", event.toString())
    next()
})

/**
 * @api {get} /upload/qrcode/:name Récupération fichier QR Code distributeur
 * @apiDescription Récupère un fichier QR Code. Nom du fichier = UUID d'un distributeur.
 * @apiName GetQrcode
 * @apiGroup Upload
 * @apiParam {String} name UUID (identifiant unique) d'un distributeur
 * @apiSuccess {Object} file Le fichier QR Code
 * @apiError {String} message Description concise du problème
 * @apiError {String} error Si statut HTTP >= 500. Valeur du paramètre error de la méthode catch
 * @apiErrorExample Exemples de réponses d'erreur:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "qrcode does not exists or cannot be read",
 *       "error": err
 *     }
 */
router.get('/qrcode/:name', (req, res) => {
    const file = req.params.name
    const filepath = `${process.env.APP_ROOT}/public/upload/qrcodes/${file}.png`

    fs.access(filepath, constants.R_OK, err => {
        if (err) {
            console.log(err)
            res.status(500).send("qrcode does not exists or cannot be read")
        } else {
            res.status(200).sendFile(filepath)
        }
    })
})

module.exports = router