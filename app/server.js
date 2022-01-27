// Import necessary modules
const express = require('express')
const cors = require('cors')
const checkTokenMiddleware = require('./jwt/check')

// Import database connection
let db = require('./db.config')

// Import routing modules
const router = require('./routes/index')

// Init of the API
const app = express()

// Use of core middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//***********************************Routing************************************
app.get('/', (req, res) => {
    res.send("Welcome to the Hemengo Distrib API")
})

app.use('/auth', router.auth)
app.use('/city', checkTokenMiddleware, router.city)
app.use('/user', checkTokenMiddleware, router.user)
app.use('/order', checkTokenMiddleware, router.order)
app.use('/locker', checkTokenMiddleware, router.locker)
app.use('/status', checkTokenMiddleware, router.status)
app.use('/product', checkTokenMiddleware, router.product)
app.use('/producer', checkTokenMiddleware, router.producer)
app.use('/matrixelement', checkTokenMiddleware, router.matrixElement)
app.use('/vendingmachine', checkTokenMiddleware, router.vendingMachine)
app.use('/productcategory', checkTokenMiddleware, router.productCategory)
app.use('/upload', checkTokenMiddleware, router.upload)

app.get('*', (req, res) => {
    res.status(501).send("Route not implemented")
})
//******************************************************************************

// Start server with database test
db.authenticate().then(() => {
    console.log("Database connection ok")
}).then(() => {
    app.listen(process.env.SERVER_PORT, () => {
        console.log(`Server is running on port ${process.env.SERVER_PORT}`)
    })
}).catch(err => {
    console.log('Database error', err)
})
