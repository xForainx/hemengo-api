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

// Fetch all orders of everyone
router.get('', (req, res) => {
    models.Order.findAll().then(orders => {

        if (orders === null) {
            return res.status(404).json({
                message: "no orders found"
            })
        }

        // Found orders
        return res.json({ orders })

    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Fetch one order by primary key (id)
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


// Fetch the products of an order
router.get('/:id/products', (req, res) => {
    let orderId = req.params.id

    if (!orderId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Order.findByPk(orderId).then(order => {
        if (order === null) {
            return res.status(404).json({
                message: "order does not exist"
            })
        }

        order.getProducts().then(products => {
            if (products === null) {
                return res.status(404).json({
                    message: "no products exist for the order"
                })
            }

            return res.json({ products })

        }).catch(err => {
            res.status(500).json({
                message: "unable to get order product(s)",
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


// Fetch all orders by UserId (all orders of a given user)
router.get('/user/:id', (req, res) => {
    let userId = req.params.id

    if (!userId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Order.findAll({
        where: { UserId: userId },
        raw: true
    }).then(orders => {
        if (orders === null) {
            return res.status(404).json({
                message: "no orders for this user"
            })
        }

        // Found user's orders
        return res.json({ orders })

    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Create one order
router.post('', (req, res) => {
    const { UserId, StatusId, VendingMachineId, pickupDate, products } = req.body

    // Sum the price of every products of the incoming order
    models.Product.sum('price', {
        where: { id: products }
    }).then((calculatedPrice) => {
        // We can create the order with its total price previously calculated
        models.Order.create({
            UserId,
            StatusId,
            VendingMachineId,
            pickupDate,
            price: calculatedPrice
        }).then(order => {
            // Insert into order_product association table with sequelize mixin
            order.addProducts(products).then(() => {
                res.status(200).json({
                    message: "order created"
                })
            })
        }).catch(err => {
            res.status(500).json({
                message: "unable to create order",
                error: err
            })
        })
    }).catch(err => {
        res.status(500).json({
            message: "unable to calculate price of order",
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