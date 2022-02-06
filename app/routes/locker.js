const express = require('express')
const models = require('../models/index')

// Use Express router
let router = express.Router()

// Logger middleware
router.use((req, res, next) => {
    const event = new Date()
    console.log("Attempted to access locker ressource : ", event.toString())
    next()
})

// Routes de la ressource Locker

// Récupère tous les casiers
router.get('', (req, res) => {
    models.Locker.findAll().then(lockers => {
        res.json({ lockers })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

// Récupère un casier par son id
router.get('/:id', (req, res) => {
    let lockerId = req.params.id

    if (!lockerId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Locker.findOne({
        where: { id: lockerId },
        raw: true
    }).then(locker => {
        if (locker === null) {
            return res.status(404).json({
                message: "locker does not exist"
            })
        }
        
        // Found locker
        return res.json({ locker })

    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

// Crée un casier
router.post('', (req, res) => {
    const {
        ProductId,
        MatrixElementRef,
        isFull,
        lastRefill,
        nextPlannedRefill
    } = req.body

    models.Locker.create({
        ProductId,
        MatrixElementRef,
        isFull,
        lastRefill,
        nextPlannedRefill
    }).then(locker => {
        res.status(200).json({
            message: "locker created"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

// Met à jour un casier par son id
router.patch('/:id', (req, res) => {
    let lockerId = parseInt(req.params.id)

    if (!lockerId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Locker.findOne({
        where: { id: lockerId },
        raw: true
    }).then(locker => {
        // Check if locker exists
        if (locker === null) {
            return res.status(404).json({
                message: "locker does not exists"
            })
        }

        models.Locker.update(req.body, {
            where: { id: lockerId }
        }).then(locker => {
            res.json({
                message: "locker updated"
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

// Restaure un casier
router.post('/untrash/:id', (req, res) => {
    let lockerId = parseInt(req.params.id)

    if (!lockerId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Locker.restore({
        where: { id: lockerId }
    }).then(() => {
        res.status(204).json({
            message: "locker restored"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

// Soft delete un casier
router.delete('/trash/:id', (req, res) => {
    let lockerId = parseInt(req.params.id)

    if (!lockerId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Locker.destroy({
        where: { id: lockerId }
    }).then(() => {
        res.status(204).json({
            message: "locker softly deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

// Hard delete un casier
router.delete('/:id', (req, res) => {
    let lockerId = parseInt(req.params.id)

    if (!lockerId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    // Forcing delete of locker
    models.Locker.destroy({
        where: { id: lockerId },
        force: true
    }).then(() => {
        res.status(204).json({
            message: "locker forcely deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

module.exports = router