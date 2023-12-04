const { authenticateUser } = require('../logic/loginLogic');
const jwt = require('jsonwebtoken');

async function login(req, res) {
    try {
        const { numTelefono, contrasenia } = req.body;
        const user = await authenticateUser(numTelefono, contrasenia);

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

module.exports = { login };
