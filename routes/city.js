const express = require('express')
const models = require('../models/index')

// Use Express router
let router = express.Router()

// Logger middleware
router.use((req, res, next) => {
    const event = new Date()
    console.log("Attempted to access city ressource : ", event.toString())
    next()
})

// Routing of City ressource

// Fetch all cities
router.get('', (req, res) => {
    models.City.findAll().then(cities => {
        res.json({ cities })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Fetch one city by its id
router.get('/:id', (req, res) => {
    let cityId = req.params.id

    if (!cityId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.City.findOne({
        where: { id: cityId },
        raw: true
    }).then(city => {
        if (city === null) {
            return res.status(404).json({
                message: "city does not exist"
            })
        }
        // Found city
        return res.json({ city })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Create one city
router.post('', (req, res) => {
    const {
        name,
        postalCode,
        inseeCode
    } = req.body

    models.City.create({
        name,
        postalCode,
        inseeCode
    }).then(city => {
        res.status(200).json({
            message: "city created"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Update one city
router.patch('/:id', (req, res) => {
    let cityId = parseInt(req.params.id)

    if (!cityId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.City.findOne({
        where: { id: cityId },
        raw: true
    }).then(city => {
        if (city === null) {
            return res.status(404).json({
                message: "city does not exists"
            })
        }

        models.City.update(req.body, {
            where: { id: cityId }
        }).then(city => {
            res.json({
                message: "city updated"
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


// Restore one city
router.post('/untrash/:id', (req, res) => {
    let cityId = parseInt(req.params.id)

    if (!cityId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.City.restore({
        where: { id: cityId }
    }).then(() => {
        res.status(204).json({
            message: "city restored"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Soft delete one city
router.delete('/trash/:id', (req, res) => {
    let cityId = parseInt(req.params.id)

    if (!cityId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.City.destroy({
        where: { id: cityId }
    }).then(() => {
        res.status(204).json({
            message: "city softly deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Delete one city
router.delete('/:id', (req, res) => {
    let cityId = parseInt(req.params.id)

    if (!cityId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    // Forcing delete of city
    models.City.destroy({
        where: { id: cityId },
        force: true
    }).then(() => {
        res.status(204).json({
            message: "city forcely deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

module.exports = router