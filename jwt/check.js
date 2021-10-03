// Import necessary modules
const jwt = require('jsonwebtoken');

// Token extraction
const extractBearer = authorization => {

	if (typeof authorization !== 'string') {
		return false;
	}

	// Token isolation
	const matches = authorization.match(/(bearer)\s+(\S+)/i);

	return matches && matches[2];
}

// Token existence verification
const checkTokenMiddleware = (req, res, next) => {

	const token = req.headers.authorization && extractBearer(req.headers.authorization);

	if (!token) {
		return res.status(401).json({
			message: "Unauthorized"
		});
	}

	// Token validity check
	jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
		if (err) {
			return res.status(401).json({
				message: "Unauthorized - Incorrect token"
			});
		}
		next();
	});
}

module.exports = checkTokenMiddleware;