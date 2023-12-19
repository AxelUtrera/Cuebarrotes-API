const jwt = require('jsonwebtoken');

function verifyToken(roles = []) {
    return (req, res, next) => {
        const header = req.headers['authorization'];

        if (!header) {
            return res.status(403).send("Token es necesario para realizar esta acción.");
        }

        
        const token = header.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = decoded;

            if (!roles.includes(req.user.role)) {
                return res.status(401).send("Acceso denegado: No tienes permisos para realizar esta acción.");
            }

            next();
        } catch (error) {
            return res.status(401).send("Token inválido.");
        }
    };
}


module.exports = { verifyToken };


