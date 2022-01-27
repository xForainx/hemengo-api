const { constants } = require('buffer')
const express = require('express')
const fs = require('fs')

// Use Express router
let router = express.Router()

// Logger middleware
router.use((req, res, next) => {
    const event = new Date()
    console.log("Attempted to access assets : ", event.toString())
    next()
})

// Routing of Upload (assets) ressources

router.get('/qrcode/:name', (req, res) => {
    const file = req.params.name
    const filepath = `${process.env.APP_ROOT}/public/upload/qrcodes/${file}`

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