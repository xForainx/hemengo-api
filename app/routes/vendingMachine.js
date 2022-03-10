const express = require('express')
const models = require('../models/index')
const crypto = require('crypto')
const QRCode = require('qrcode')

// Usage Express Router
let router = express.Router()

// Middleware de logs
router.use((req, res, next) => {
    const event = new Date()
    console.log("Attempted to access vending machine ressource : ", event.toString())
    next()
})

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


/**
 * @api {get} /vendingmachine/:id Récupération distributeur
 * @apiDescription Retourne un distributeur par son id.
 * @apiName GetVendingMachine
 * @apiGroup VendingMachine
 * @apiParam {Number} id Id unique du distributeur
 * @apiSuccess {Machine} machine Objet representant un distributeur
 * @apiSuccessExample Exemple de réponse de succès:
 *     HTTP/1.1 200 OK
 *     {
 *       "machine": { 
 *         "id": 3,
 *         "uuid": "85d9376b-9a13-4665-ad59-19d90c107eca",
 *         "ref": "thx-1138",
 *         "latitude": 0,
 *         "longitude": 0,
 *         "street": "",
 *         "maxLineCapacity": 6,
 *         "maxRowCapacity": 5,
 *         "qrCodeFileName": "85d9376b-9a13-4665-ad59-19d90c107eca.png",
 *         "createdAt": "2022-02-06T14:39:10.000Z",
 *         "updatedAt": "2022-02-06T14:39:10.000Z",
 *         "deletedAt": null,
 *         "CityId": 2
 *       }
 *     }
 * @apiError {String} message Description concise du problème
 * @apiError {String} error Si statut HTTP >= 500. Valeur du paramètre error de la méthode catch
 * @apiErrorExample Exemples de réponses d'erreur:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "database error",
 *       "error": err
 *     }
 * 
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "missing parameter",
 *     }
 * 
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "machine does not exist",
 *     }
 */
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
