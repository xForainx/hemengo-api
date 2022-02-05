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

// Routing of MatrixElement ressource

// Fetch all matrix elements
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


// Fetch one matrixElement by its id
router.get('/:id', (req, res) => {
    let matrixElementId = req.params.id

    if (!matrixElementId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.MatrixElement.findOne({
        where: { id: matrixElementId },
        raw: true
    }).then(matrixElement => {
        if (matrixElement === null) {
            return res.status(404).json({
                message: "matrix element does not exist"
            })
        }
        // Found matrix element
        return res.json({ matrixElement })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Récupère plusieurs refs de matrice par leurs ids.
// Exemple d'URL : "/matrixelement/some/q?ids=1,2,3"
router.get('/some/:q', (req, res) => {
    const ids = req.query.ids.split(",");

    if (!ids) {
        return res.status(400).json({
            message: "missing or malformed parameter"
        })
    }

    models.MatrixElement.findAll({
        attributes: ['ref'],
        where: { id: ids },
        raw: true
    }).then(refs => {

        if (refs === null) {
            return res.status(404).json({
                message: "no refs found for these matrix elements"
            })
        }

        // Found refs
        return res.json({ refs: refs.map(r => r.ref) })

    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Fetch one matrixElement by its ref ("A1", "B5"...)
router.get('/ref/:ref', (req, res) => {
    let matrixElementRef = req.params.ref

    if (!matrixElementRef) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.MatrixElement.findOne({
        where: { ref: matrixElementRef },
        raw: true
    }).then(matrixElement => {
        if (matrixElement === null) {
            return res.status(404).json({
                message: "matrix element does not exist"
            })
        }
        // Found matrix element
        return res.json({ matrixElement })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Create one matrix element
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


// Update one matrix element
router.patch('/:id', (req, res) => {
    let matrixElementId = parseInt(req.params.id)

    if (!matrixElementId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.MatrixElement.findOne({
        where: { id: matrixElementId },
        raw: true
    }).then(matrixElement => {
        if (matrixElement === null) {
            return res.status(404).json({
                message: "matrix element does not exists"
            })
        }

        models.MatrixElement.update(req.body, {
            where: { id: matrixElementId }
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


// Restore one matrixElement
router.post('/untrash/:id', (req, res) => {
    let matrixElementId = parseInt(req.params.id)

    if (!matrixElementId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.MatrixElement.restore({
        where: { id: matrixElementId }
    }).then(() => {
        res.status(204).json({
            message: "matrix element restored"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Soft delete one matrixElement
router.delete('/trash/:id', (req, res) => {
    let matrixElementId = parseInt(req.params.id)

    if (!matrixElementId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.MatrixElement.destroy({
        where: { id: matrixElementId }
    }).then(() => {
        res.status(204).json({
            message: "matrix element softly deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Delete one matrixElement
router.delete('/:id', (req, res) => {
    let matrixElementId = parseInt(req.params.id)

    if (!matrixElementId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    // Forcing delete of matrixElement
    models.MatrixElement.destroy({
        where: { id: matrixElementId },
        force: true
    }).then(() => {
        res.status(204).json({
            message: "matrix element forcely deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

module.exports = router