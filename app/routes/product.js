const express = require('express')
const models = require('../models/index')

// Use Express router
let router = express.Router()

// Logger middleware
router.use((req, res, next) => {
    const event = new Date()
    console.log("Attempted to access product ressource : ", event.toString())
    next()
})

// Routes de la ressource Product

// Tous les produits
router.get('', (req, res) => {
    models.Product.findAll().then(products => {
        res.json({ products })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

// Un produit par son id
router.get('/:id', (req, res) => {
    let productId = req.params.id

    if (!productId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Product.findOne({
        where: { id: productId },
        raw: true
    }).then(product => {
        if (product === null) {
            return res.status(404).json({
                message: "product does not exist"
            })
        }

        // Found product
        return res.json({ product })

    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

// Crée un produit
router.post('', (req, res) => {
    const {
        ProductCategoryId,
        name,
        ref,
        price,
        daysBeforeExpire
    } = req.body

    models.Product.create({
        ProductCategoryId,
        name,
        ref,
        price,
        daysBeforeExpire
    }).then(product => {
        res.status(200).json({
            message: "product created"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

// Met à jour un produit
router.patch('/:id', (req, res) => {
    let productId = parseInt(req.params.id)

    if (!productId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Product.findOne({
        where: { id: productId },
        raw: true
    }).then(product => {
        if (product === null) {
            return res.status(404).json({
                message: "product does not exists"
            })
        }

        models.Product.update(req.body, {
            where: { id: productId }
        }).then(product => {
            res.json({
                message: "product updated"
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

// Restaure un produit
router.post('/untrash/:id', (req, res) => {
    let productId = parseInt(req.params.id)

    if (!productId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Product.restore({
        where: { id: productId }
    }).then(() => {
        res.status(204).json({
            message: "product restored"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

// Soft delete un produit
router.delete('/trash/:id', (req, res) => {
    let productId = parseInt(req.params.id)

    if (!productId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Product.destroy({
        where: { id: productId }
    }).then(() => {
        res.status(204).json({
            message: "product softly deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

// Hard delete un produit
router.delete('/:id', (req, res) => {
    let productId = parseInt(req.params.id)

    if (!productId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    // Forcing delete of product
    models.Product.destroy({
        where: { id: productId },
        force: true
    }).then(() => {
        res.status(204).json({
            message: "product forcely deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

module.exports = router