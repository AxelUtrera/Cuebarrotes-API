const Logger = require('../config/logger');

const getAllUsers = async (req, res) => {
    res.json({
        msg:"Hola mundo"
    });
}

module.exports = {
    getAllUsers
}