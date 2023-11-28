const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
    {
        
        nss: {
            type: String,
            required: true
        },
        numTelefono: {
            type: String,
            required: true
        },
        sucursal: {
            type: String,
            required: true
        },
        nombre: {
            type: String,
            required: true
        },
        apellidoPaterno: {
            type: String,
            required: true
        },
        contrasenia: {
            type: String,
            required: true
        },
        numEmpleado: {
            type: String,
            required: true
        },
        rol: {
            type: String,
            required: true
        }
    }
);

module.exports = mongoose.model('Employee', EmployeeSchema);