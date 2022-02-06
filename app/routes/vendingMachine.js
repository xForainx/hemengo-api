const express = require('express')
const models = require('../models/index')
const crypto = require('crypto')
const QRCode = require('qrcode')

// Use Express router
let router = express.Router()

// Logger middleware
router.use((req, res, next) => {
    const event = new Date()
    console.log("Attempted to access vending machine ressource : ", event.toString())
    next()
})

// Routing of Vending Machine ressource

// Récupère toutes les machines
router.get('', (req, res) => {
    models.VendingMachine.findAll().then(machines => {
        res.json({ machines })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Récupère une machine par son id
router.get('/:id', (req, res) => {
    let machineId = req.params.id

    if (!machineId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.VendingMachine.findOne({
        where: { id: machineId },
        raw: true
    }).then(machine => {
        if (machine === null) {
            return res.status(404).json({
                message: "machine does not exist"
            })
        }

        // Found machine
        return res.json({ machine })

    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Récupère une machine par son uuid
router.get('uuid/:uuid', (req, res) => {
    let machineUuid = req.params.uuid

    if (!machineUuid) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.VendingMachine.findOne({
        where: { uuid: machineUuid },
        raw: true
    }).then(machine => {
        if (machine === null) {
            return res.status(404).json({
                message: "machine does not exist"
            })
        }

        // Found machine
        return res.json({ machine })

    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Récupère les lockers d'une machine par son id
router.get('/:id/lockers', (req, res) => {
    let machineId = req.params.id

    if (!machineId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.VendingMachine.findByPk(machineId).then(machine => {
        if (machine === null) {
            return res.status(404).json({
                message: "machine does not exist"
            })
        }

        machine.getLockers().then(lockers => {
            if (lockers === null) {
                return res.status(404).json({
                    message: "no lockers found for this vending machine"
                })
            }

            // Found lockers
            return res.json({ lockers })
        })

    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Create one machine
router.post('', (req, res) => {
    const {
        CityId,
        ref,
        latitude,
        longitude,
        street,
        maxLineCapacity,
        maxRowCapacity
    } = req.body

    const machineUuid = crypto.randomUUID();
    const qrCodeFileName = `${machineUuid}.png`;

    models.VendingMachine.create({
        CityId,
        uuid: machineUuid,
        ref,
        latitude,
        longitude,
        street,
        maxLineCapacity,
        maxRowCapacity,
        qrCodeFileName
    }).then(machine => {

        // Création du QR Code avec l'uuid du distributeur comme data et enregistrement
        // de celui ci dans un fichier .png dans upload/qrcodes
        QRCode.toFile(`public/upload/qrcodes/${qrCodeFileName}`, machineUuid, {
            // Par défaut noir et fond transparent
            color: { light: '#0000' }
        }, function (err) {
            if (err) console.log(err)
            console.log("QRCode successfully created")
        })

        res.status(200).json({
            message: "vending machine created"
        })

    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Update one machine
router.patch('/:id', (req, res) => {
    let machineId = parseInt(req.params.id)

    if (!machineId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.VendingMachine.findOne({
        where: { id: machineId },
        raw: true
    }).then(machine => {
        // Check if machine exists
        if (machine === null) {
            return res.status(404).json({
                message: "machine does not exists"
            })
        }

        models.VendingMachine.update(req.body, {
            where: { id: machineId }
        }).then(machine => {
            res.json({
                message: "machine updated"
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


// Restore one machine
router.post('/untrash/:id', (req, res) => {
    let machineId = parseInt(req.params.id)

    if (!machineId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.VendingMachine.restore({
        where: { id: machineId }
    }).then(() => {
        res.status(204).json({
            message: "machine restored"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Soft delete one machine
router.delete('/trash/:id', (req, res) => {
    let machineId = parseInt(req.params.id)

    if (!machineId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.VendingMachine.destroy({
        where: { id: machineId }
    }).then(() => {
        res.status(204).json({
            message: "machine softly deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Delete one machine
router.delete('/:id', (req, res) => {
    let machineId = parseInt(req.params.id)

    if (!machineId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    // Forcing delete of vending machine
    models.VendingMachine.destroy({
        where: { id: machineId },
        force: true
    }).then(() => {
        res.status(204).json({
            message: "machine forcely deleted"
        })
    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})

module.exports = router
