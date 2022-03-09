const express = require('express')
const models = require('../models/index')
const util = require('../helpers/util')
const { Op } = require('sequelize')

// Usage Express Router
let router = express.Router()

// Middleware de logs
router.use((req, res, next) => {
    const event = new Date()
    console.log("Attempted to access order ressource : ", event.toString())
    next()
})

router.get('', (req, res) => {
    models.Order.findAll().then(orders => {

        if (orders === null) {
            return res.status(404).json({
                message: "no orders found"
            })
        }

        return res.json({ orders })

    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


// Fetch one order by its id.
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

        return res.json({ order })

    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


/**
 * @api {get} /order/:id/products Récupération produits
 * @apiDescription Retourne tous les produits d'une commande donnée.
 * @apiName GetOrderProducts
 * @apiGroup Order
 * @apiParam {Number} id Order unique id
 * @apiSuccess {Product[]} products Tableau des produits de la commande
 * @apiSuccessExample Exemple de réponse de succès:
 *     HTTP/1.1 200 OK
 *     {
 *       "products": [
 *         { 
 *           "id": 2,
 *           "name": "poire",
 *           "ref": "poire-f05",
 *           "price": 5,
 *           "daysBeforeExpire": 7,
 *           "createdAt": "2022-02-06T00:00:00.000Z",
 *           "updatedAt": "2022-02-06T00:00:00.000Z",
 *           "deletedAt": null,
 *           "ProductCategoryId": 1,
 *           "order_product": {
 *             "createdAt": "2022-02-06T15:11:01.000Z",
 *             "updatedAt": "2022-02-06T15:11:01.000Z",
 *             "OrderId": 2,
 *             "ProductId": 2
 *           }
 *         }  
 *       ]
 *     }
 * @apiError {String} message Description concise du problème
 * @apiError {String} error Si statut HTTP >= 500. Valeur du paramètre error de la méthode catch
 * @apiErrorExample Exemples de réponses d'erreur:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "unable to get order products",
 *       "error": err
 *     }
 * 
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
 *       "message": "order does not exist",
 *     }
 */
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
                message: "unable to get order products",
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


// Fetch all orders of a user by user id. All statuses included.
// Param: id - User id.
router.get('/user/:id', (req, res) => {
    let userId = req.params.id

    if (!userId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Order.findAll({
        where: {
            UserId: userId
        },
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


/**
 * @api {get} /order/user/:id/active Récupération commandes actives utilisateur
 * @apiDescription Récupère toutes les commandes "actives" d'un utilisateur.
 * C'est à dire les commandes qui ont un statut "confirmed" ou "paid" et avec une pickupDate non expirée.
 * @apiName GetOrderUserActive
 * @apiGroup Order
 * @apiParam {Number} id User unique id
 * @apiSuccess {Order[]} orders Tableau des commandes actives
 * @apiSuccessExample Exemple de réponse de succès:
 *     HTTP/1.1 200 OK
 *     {
 *       "orders": [
 *         { 
 *           "id": 3,
 *           "price": 18,
 *           "pickupDate": "2022-04-16T00:00:00.000Z",
 *           "createdAt": "2022-02-06T15:11:56.000Z",
 *           "updatedAt": "2022-02-06T15:11:56.000Z",
 *           "deletedAt": null,
 *           "UserId": 1,
 *           "StatusId": 1,
 *           "VendingMachineId": 4
 *         }  
 *       ]
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
 *       "message": "no orders for this user",
 *     }
 */
router.get('/user/:id/active', (req, res) => {
    let userId = req.params.id

    if (!userId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Order.findAll({
        where: {
            UserId: userId,
            StatusId: {
                [Op.or]: [1, 3]
            }
        },
        raw: true
    }).then(orders => {
        if (orders === null) {
            return res.status(404).json({
                message: "no orders for this user"
            })
        }

        const futureOrders = orders.filter(o => util.isToday(o.pickupDate) || util.isInTheFuture(o.pickupDate))

        return res.json({ orders: futureOrders })

    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


/**
 * @api {get} /order/user/:id/archive Récupération commandes archivées utilisateur
 * @apiDescription Récupère toutes les commandes "archivées" d'un utilisateur.
 * C'est à dire les commandes qui ont un statut "cancelled", "archived" ou "retrieved".
 * @apiName GetOrderUserArchive
 * @apiGroup Order
 * @apiParam {Number} id User unique id
 * @apiSuccess {Order[]} orders Tableau des commandes archivées
 * @apiSuccessExample Exemple de réponse de succès:
 *     HTTP/1.1 200 OK
 *     {
 *       "orders": [
 *         { 
 *           "id": 6,
 *           "price": 32,
 *           "pickupDate": "2022-01-05T00:00:00.000Z",
 *           "createdAt": "2022-01-02T15:11:56.000Z",
 *           "updatedAt": "2022-01-02T15:11:56.000Z",
 *           "deletedAt": null,
 *           "UserId": 1,
 *           "StatusId": 4,
 *           "VendingMachineId": 4
 *         }  
 *       ]
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
 *       "message": "no archive orders for this user",
 *     }
 */
router.get('/user/:id/archive', (req, res) => {
    let userId = req.params.id

    if (!userId) {
        return res.status(400).json({
            message: "missing parameter"
        })
    }

    models.Order.findAll({
        where: {
            UserId: userId,
            StatusId: {
                [Op.or]: [2, 4, 5]
            }
        },
        raw: true
    }).then(orders => {
        if (orders === null) {
            return res.status(404).json({
                message: "no archive orders for this user"
            })
        }

        return res.json({ orders })

    }).catch(err => {
        res.status(500).json({
            message: "database error",
            error: err
        })
    })
})


/**
 * @api {post} /order Création commande
 * @apiDescription Crée une commande. Le prix total est calculé automatiquement
 * en fonction du prix de chaque produit dont les ids sont contenus dans 
 * le champ products du body.
 * @apiName GetOrderUserArchive
 * @apiGroup Order
 * @apiBody {Number} UserId Id unique de l'utilisateur
 * @apiBody {Number} StatusId Id unique du statut de la commande
 * @apiBody {Number} VendingMachineId Id unique du distributeur
 * @apiBody {String} pickupDate Date de récupération de la commande (YYYY-MM-DDTHH:MM:SS.000Z)
 * @apiBody {Number[]} products Tableau d'ids de produits
 * @apiSuccess {Order[]} orders Tableau des commandes archivées
 * @apiSuccessExample Exemple de réponse de succès:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "order created"
 *     }
 * @apiError {String} message Description concise du problème
 * @apiError {String} error Si statut HTTP >= 500. Valeur du paramètre error de la méthode catch
 * @apiErrorExample Exemples de réponses d'erreur:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "unable to create order",
 *       "error": err
 *     }
 */
router.post('', (req, res) => {
    const { UserId, StatusId, VendingMachineId, pickupDate, products } = req.body

    // Calcule la somme des prix de chaque produit de la commande
    models.Product.sum('price', {
        where: { id: products }
    }).then((calculatedPrice) => {
        // On peut créer la commande avec le prix total precedemment calculé
        models.Order.create({
            UserId,
            StatusId,
            VendingMachineId,
            pickupDate,
            price: calculatedPrice
        }).then(order => {
            // Insertion dans la table de jointure order_product grâce au mixin Sequelize
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


// Update one order.
// Param: id - Order id.
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


// Restore one order.
// Param: id - Order id.
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


// Soft delete one order.
// Param: id - Order id.
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


// Hard delete one order.
// Param: id - Order id.
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