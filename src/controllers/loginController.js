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

const getRole = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        const role = decoded.role;

        return res.json({ role });
    } catch (error) {
        return res.status(400).json({ message: 'Token inválido.' });
    }
}

module.exports = { login, getRole};
