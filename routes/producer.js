// Import necessary modules
const express = require('express');
const bcrypt = require('bcrypt');

// Import necessary models
const Producer = require('../models/Producer');

// Use Express router
let router = express.Router();

// Logger middleware
router.use((req, res, next) => {
    const event = new Date();
    console.log("Attempted to access producer ressource : ", event.toString());
    next();
});

// Routing of Producer ressource

// Fetch all producers
router.get('', (req, res) => {
    Producer.findAll().then(producers => {
        res.json({ producers });
    }).catch(err => {
        res.status(500).json({
            message: "Database error",
            error: err
        });
    });
});


// Fetch one producer
router.get('/:id', (req, res) => {
    let producerId = req.params.id;

    if (!producerId) {
        return res.status(400).json({
            message: "Missing parameter"
        });
    }

    Producer.findOne({
        where: { id: producerId },
        raw: true
    }).then(producer => {
        if (producer === null) {
            return res.status(404).json({
                message: "Producer does not exist"
            });
        }
        // Found producer
        return res.json({ producer });
    }).catch(err => {
        res.status(500).json({
            message: "Database error",
            error: err
        });
    });
});


// Create one producer
router.post('', (req, res) => {
    const { name, presentation, address } = req.body;
    Producer.create({
        name: name,
        presentation: presentation,
        address: address
    }).then(producer => {
        res.status(200).json({
            message: "Producer created"
        });
    }).catch(err => {
        res.status(500).json({
            message: "Database error",
            error: err
        });
    });
});


// Update one producer
router.patch('/:id', (req, res) => {
    let producerId = parseInt(req.params.id);

    if (!producerId) {
        return res.status(400).json({
            message: "Missing parameter"
        });
    }

    Producer.findOne({
        where: { id: producerId },
        raw: true
    }).then(producer => {
        // Check if producer exists
        if (producer === null) {
            return res.status(404).json({
                message: "Producer does not exists"
            });
        }

        Producer.update(req.body, {
            where: { id: producerId }
        }).then(producer => {
            res.json({
                message: "Producer updated"
            });
        }).catch(err => {
            res.status(500).json({
                message: "Database error",
                error: err
            });
        });
    }).catch(err => {
        res.status(500).json({
            message: "Database error",
            error: err
        });
    });
});


// Restore one producer
router.post('/untrash/:id', (req, res) => {
    let producerId = parseInt(req.params.id);

    if (!producerId) {
        return res.status(400).json({
            message: "Missing parameter"
        });
    }

    Producer.restore({
        where: { id: producerId }
    }).then(() => {
        res.status(204).json({
            message: "Producer restored"
        });
    }).catch(err => {
        res.status(500).json({
            message: "Database error",
            error: err
        });
    });
});


// Soft delete one producer
router.delete('/trash/:id', (req, res) => {
    let producerId = parseInt(req.params.id)

    if (!producerId) {
        return res.status(400).json({
            message: "Missing parameter"
        });
    }

    Producer.destroy({
        where: { id: producerId }
    }).then(() => {
        res.status(204).json({
            message: "Producer softly deleted"
        });
    }).catch(err => {
        res.status(500).json({
            message: "Database error",
            error: err
        });
    });
});


// Delete one producer
router.delete('/:id', (req, res) => {
    let producerId = parseInt(req.params.id)

    if (!producerId) {
        return res.status(400).json({
            message: "Missing parameter"
        });
    }

    // Forcing delete of producer
    Producer.destroy({
        where: { id: producerId },
        force: true
    }).then(() => {
        res.status(204).json({
            message: "Producer forcely deleted"
        });
    }).catch(err => {
        res.status(500).json({
            message: "Database error",
            error: err
        });
    });
});

module.exports = router;