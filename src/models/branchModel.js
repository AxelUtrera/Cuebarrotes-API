const mongoose = require('mongoose');
const branch = require('mongoose');


const productsSchema = new mongoose.Schema(
    {
        _id: false,
        codigoBarras:{
            type: String
        },
        existencias:{
            type: Number
        }
    }
)


const branchSchema = new mongoose.Schema(
    {
        nombreComercial:{
            type: String,
            required: true
        },
        direccion:{
            type: String,
            required: true
        },
        horarioServicio:{
            type: String,
            required: true
        },
        ubicacion:{
            latitud:{
                type: String,
                required: true
            },
            longitud:{
                type: String,
                required: true
            }
        },
        inventario:{
            productos:[
                productsSchema
            ]
        }
    }
)


module.exports = branch.model('branch', branchSchema);