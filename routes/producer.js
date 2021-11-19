const express = require('express')
const models = require('../models/index')

// Use Express router
let router = express.Router()

// Logger middleware
router.use((req, res, next) => {
    const event = new Date()
    console.log("Attempted to access producer ressource : ", event.toString())
    next()
})

// Routing of Producer ressource

// Fetch all producers
router.get('', (req, res) => {
    models.Producer.findAll().then(producers => {
        res.json({ producers })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Fetch one producer by its id
router.get('/:id', (req, res) => {
    let producerId = req.params.id

    if (!producerId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Producer.findOne({
        where: { id: producerId },
        raw: true
    }).then(producer => {
        if (producer === null) {
            return res.status(404).json({
                message: "producer does not exist"
            })
        }
        // Found producer
        return res.json({ producer })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Create one producer
router.post('', (req, res) => {
    const {
        cityId,
        name,
        presentation,
        street,
        verified
    } = req.body

    models.Producer.create({
        cityId,
        name,
        presentation,
        street,
        verified
    }).then(producer => {
        res.status(200).json({
            message: "producer created"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Update one producer
router.patch('/:id', (req, res) => {
    let producerId = parseInt(req.params.id)

    if (!producerId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Producer.findOne({
        where: { id: producerId },
        raw: true
    }).then(producer => {
        if (producer === null) {
            return res.status(404).json({
                message: "producer does not exists"
            })
        }

        models.Producer.update(req.body, {
            where: { id: producerId }
        }).then(producer => {
            res.json({
                message: "producer updated"
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


// Restore one producer
router.post('/untrash/:id', (req, res) => {
    let producerId = parseInt(req.params.id)

    if (!producerId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Producer.restore({
        where: { id: producerId }
    }).then(() => {
        res.status(204).json({
            message: "producer restored"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Soft delete one producer
router.delete('/trash/:id', (req, res) => {
    let producerId = parseInt(req.params.id)

    if (!producerId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Producer.destroy({
        where: { id: producerId }
    }).then(() => {
        res.status(204).json({
            message: "producer softly deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Delete one producer
router.delete('/:id', (req, res) => {
    let producerId = parseInt(req.params.id)

    if (!producerId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    // Forcing delete of producer
    models.Producer.destroy({
        where: { id: producerId },
        force: true
    }).then(() => {
        res.status(204).json({
            message: "producer forcely deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

module.exports = router