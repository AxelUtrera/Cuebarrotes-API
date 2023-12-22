const { authenticateUser } = require('../logic/loginLogic');
const jwt = require('jsonwebtoken');

async function login(req, res) {
    try {
        const { numTelefono, contrasenia } = req.body;
        const user = await authenticateUser(numTelefono, contrasenia);

        const userRole = user.rol ? user.rol : "customer";

        
        const token = jwt.sign(
            { userId: user._id, role: userRole },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });

    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

module.exports = { login };
