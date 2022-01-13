const express = require('express')
const models = require('../models/index')

// Use Express router
let router = express.Router()

// Logger middleware
router.use((req, res, next) => {
    const event = new Date()
    console.log("Attempted to access product category ressource : ", event.toString())
    next()
})

// Routing of product category ressource

// Fetch all product categories
router.get('', (req, res) => {
    models.ProductCategory.findAll().then(productCategories => {
        res.json({ productCategories })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Fetch one product category by its id
router.get('/:id', (req, res) => {
    let productCategoryId = req.params.id

    if (!productCategoryId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.ProductCategory.findOne({
        where: { id: productCategoryId },
        raw: true
    }).then(productCategory => {
        if (productCategory === null) {
            return res.status(404).json({
                message: "product category does not exist"
            })
        }
        // Found productCategory
        return res.json({ productCategory })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Create one product category
router.post('', (req, res) => {
    const {
        name
    } = req.body

    models.ProductCategory.create({
        name
    }).then(productCategory => {
        res.status(200).json({
            message: "product category created"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Update one product category
router.patch('/:id', (req, res) => {
    let productCategoryId = parseInt(req.params.id)

    if (!productCategoryId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.ProductCategory.findOne({
        where: { id: productCategoryId },
        raw: true
    }).then(productCategory => {
        if (productCategory === null) {
            return res.status(404).json({
                message: "product category does not exists"
            })
        }

        models.ProductCategory.update(req.body, {
            where: { id: productCategoryId }
        }).then(productCategory => {
            res.json({
                message: "product category updated"
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


// Restore one product category
router.post('/untrash/:id', (req, res) => {
    let productCategoryId = parseInt(req.params.id)

    if (!productCategoryId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.ProductCategory.restore({
        where: { id: productCategoryId }
    }).then(() => {
        res.status(204).json({
            message: "product category restored"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Soft delete one product category
router.delete('/trash/:id', (req, res) => {
    let productCategoryId = parseInt(req.params.id)

    if (!productCategoryId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.ProductCategory.destroy({
        where: { id: productCategoryId }
    }).then(() => {
        res.status(204).json({
            message: "product category softly deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Delete one product category
router.delete('/:id', (req, res) => {
    let productCategoryId = parseInt(req.params.id)

    if (!productCategoryId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    // Forcing delete of product category
    models.ProductCategory.destroy({
        where: { id: productCategoryId },
        force: true
    }).then(() => {
        res.status(204).json({
            message: "product category forcely deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

module.exports = router