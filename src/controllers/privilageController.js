const jwt = require('jsonwebtoken');

function retrieveJWTData(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

function verifyTokenAndRole(token, requiredRole) {
    try {
        const decoded = retrieveJWTData(token);

        if (decoded.role === requiredRole) {
            return { valid: true, data: decoded };
        } else {
            return { valid: false, error: 'Rol no autorizado' };
        }
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

module.exports = { verifyTokenAndRole };
