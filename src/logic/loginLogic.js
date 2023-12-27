const Customer = require('../models/customerModel');
const Employee = require('../models/employeeModel');

async function authenticateUser(numTelefono, contrasenia) {
    
    const customer = await Customer.findOne({ numTelefono });
    const employee = await Employee.findOne({ numTelefono });

    let user = customer || employee;

    if (!user || user.contrasenia !== contrasenia) {
        throw new Error('Autenticación fallida');
    }

    return user;
}

module.exports = { authenticateUser };
