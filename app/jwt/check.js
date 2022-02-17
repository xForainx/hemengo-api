// Import necessary modules
const jwt = require('jsonwebtoken');

/**
 * Bearer token extrait du header d'autorisation HTTP.
 * @param {*} authorization 
 * @returns 
 */
const extractBearer = authorization => {

    if (typeof authorization !== 'string') {
        return false;
    }

    // Isolation du Bearer Token
    const matches = authorization.match(/(bearer)\s+(\S+)/i);

    return matches && matches[2];
}

/**
 * Vérifie le Bearer Token de la requête.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
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