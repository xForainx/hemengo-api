const express = require('express')
const models = require('../models/index')

// Use Express router
let router = express.Router()

// Logger middleware
router.use((req, res, next) => {
    const event = new Date()
    console.log("Attempted to access order ressource : ", event.toString())
    next()
})

// Routing of Order ressource

// Fetch all orders
router.get('', (req, res) => {
    models.Order.findAll().then(orders => {
        res.json({ orders })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Fetch one order
router.get('/:id', (req, res) => {
    let orderId = req.params.id

    if (!orderId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Order.findOne({
        where: { id: orderId },
        raw: true
    }).then(order => {
        if (order === null) {
            return res.status(404).json({
                message: "order does not exist"
            })
        }
        // Found order
        return res.json({ order })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Create one order
// How can we get the price ? Passing an array of products and calculate ?
// See Product-Order association table...
router.post('', (req, res) => {
    const {
        UserId,
        StatusId,
        VendingMachineId,
        price,
        pickupDate
    } = req.body

    models.Order.create({
        UserId,
        StatusId,
        VendingMachineId,
        price,
        pickupDate
    }).then(order => {
        res.status(200).json({
            message: "order created"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Update one order
router.patch('/:id', (req, res) => {
    let orderId = parseInt(req.params.id)

    if (!orderId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Order.findOne({
        where: { id: orderId },
        raw: true
    }).then(order => {
        if (order === null) {
            return res.status(404).json({
                message: "order does not exists"
            })
        }

        models.Order.update(req.body, {
            where: { id: orderId }
        }).then(order => {
            res.json({
                message: "order updated"
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


// Restore one order
router.post('/untrash/:id', (req, res) => {
    let orderId = parseInt(req.params.id)

    if (!orderId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Order.restore({
        where: { id: orderId }
    }).then(() => {
        res.status(204).json({
            message: "order restored"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Soft delete one order
router.delete('/trash/:id', (req, res) => {
    let orderId = parseInt(req.params.id)

    if (!orderId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Order.destroy({
        where: { id: orderId }
    }).then(() => {
        res.status(204).json({
            message: "order softly deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Delete one order
router.delete('/:id', (req, res) => {
    let orderId = parseInt(req.params.id)

    if (!orderId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    // Forcing delete of order
    models.Order.destroy({
        where: { id: orderId },
        force: true
    }).then(() => {
        res.status(204).json({
            message: "order forcely deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

module.exports = router