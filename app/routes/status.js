const express = require('express')
const models = require('../models/index')

// Use Express router
let router = express.Router()

// Logger middleware
router.use((req, res, next) => {
    const event = new Date()
    console.log("Attempted to access status ressource : ", event.toString())
    next()
})

// Routing of Status ressource

// Fetch all statuses
router.get('', (req, res) => {
    models.Status.findAll().then(statuses => {
        res.json({ statuses })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Fetch one status by its id
router.get('/:id', (req, res) => {
    let statusId = req.params.id

    if (!statusId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Status.findOne({
        where: { id: statusId },
        raw: true
    }).then(status => {
        if (status === null) {
            return res.status(404).json({
                message: "status does not exist"
            })
        }
        // Found status
        return res.json({ status })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Create one status
router.post('', (req, res) => {
    const {
        name,
        message
    } = req.body

    models.Status.create({
        name,
        message
    }).then(status => {
        res.status(200).json({
            message: "status created"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Update one status
router.patch('/:id', (req, res) => {
    let statusId = parseInt(req.params.id)

    if (!statusId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Status.findOne({
        where: { id: statusId },
        raw: true
    }).then(status => {
        if (status === null) {
            return res.status(404).json({
                message: "status does not exists"
            })
        }

        models.Status.update(req.body, {
            where: { id: statusId }
        }).then(status => {
            res.json({
                message: "status updated"
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


// Restore one status
router.post('/untrash/:id', (req, res) => {
    let statusId = parseInt(req.params.id)

    if (!statusId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Status.restore({
        where: { id: statusId }
    }).then(() => {
        res.status(204).json({
            message: "status restored"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Soft delete one status
router.delete('/trash/:id', (req, res) => {
    let statusId = parseInt(req.params.id)

    if (!statusId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Status.destroy({
        where: { id: statusId }
    }).then(() => {
        res.status(204).json({
            message: "status softly deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Delete one status
router.delete('/:id', (req, res) => {
    let statusId = parseInt(req.params.id)

    if (!statusId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    // Forcing delete of status
    models.Status.destroy({
        where: { id: statusId },
        force: true
    }).then(() => {
        res.status(204).json({
            message: "status forcely deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

module.exports = router