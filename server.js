// Import necessary modules
const express = require('express');
const cors = require('cors');
const checkTokenMiddleware = require('./jwt/check');

// Import database connection
let db = require('./db.config');

// Import routing modules
const routerUser = require('./routes/user');
const routerAuth = require('./routes/auth');
const routerProducer = require('./routes/producer');
const routerVendingMachine = require('./routes/vendingMachine');
const routerOrder = require('./routes/order');

// Init of the API
const app = express();

// Use of core middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing
app.get('/', (req, res) => {
    res.send("Welcome to the Hemengo Distrib API");
});

app.use('/auth', routerAuth);
app.use('/user', checkTokenMiddleware, routerUser);
app.use('/producer', checkTokenMiddleware, routerProducer);
app.use('/vendingmachine', checkTokenMiddleware, routerVendingMachine);
app.use('/order', checkTokenMiddleware, routerOrder);

app.get('*', (req, res) => {
    res.status(501).send("Route not implemented");
});

// Start server with database test
db.authenticate().then(() => {
    console.log("Database connection ok");
}).then(() => {
    app.listen(process.env.SERVER_PORT, () => {
        console.log(`Server is running on port ${process.env.SERVER_PORT}`);
    });
}).catch(err => {
    console.log('Database error', err);
});
