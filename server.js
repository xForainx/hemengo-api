// Import necessary modules
const express = require('express');
const cors = require('cors');
const checkTokenMiddleware = require('./jwt/check');

// Import database connection
let db = require('./db.config');

// Import routing modules
const routerUser = require('./routes/users');
const routerAuth = require('./routes/auth');

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

app.get('*', (req, res) => {
	res.status(501).send("Route not implemented");
});

app.use('/auth', routerAuth);
app.use('/users', checkTokenMiddleware, routerUser);

// Start server with database test
db.authenticate().then(() => {
	console.log("Database connection ok");
}).then(() => {
	app.listen(process.env.SERVER_PORT, () => {
		console.log(`Server is running on port ${process.env.SERVER_PORT}`);
	});
}).catch(err => {
	console.log('Database Error', err);
});