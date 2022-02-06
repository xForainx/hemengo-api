const express = require('express')
const models = require('../models/index')

// Use Express router
let router = express.Router()

// Logger middleware
router.use((req, res, next) => {
    const event = new Date()
    console.log("Attempted to access matrix element ressource : ", event.toString())
    next()
})

// Routes de la ressource MatrixElement

// Récupère toutes les refs de matrice
router.get('', (req, res) => {
    models.MatrixElement.findAll().then(matrixElements => {
        res.json({ matrixElements })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

// Crée une ref de matrice
router.post('', (req, res) => {
    const { ref } = req.body

    models.MatrixElement.create({
        ref: ref.toLowerCase()
    }).then(matrixElement => {
        res.status(200).json({
            message: "matrix element created"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

// Met à jour une ref de matrice
router.patch('/:ref', (req, res) => {
    let ref = parseInt(req.params.id)

    if (!ref) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.MatrixElement.findOne({
        where: { ref: ref },
        raw: true
    }).then(matrixElement => {
        if (matrixElement === null) {
            return res.status(404).json({
                message: "matrix element does not exists"
            })
        }

        models.MatrixElement.update(req.body, {
            where: { ref: ref }
        }).then(matrixElement => {
            res.json({
                message: "matrix element updated"
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

module.exports = router