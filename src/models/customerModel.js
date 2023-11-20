const mongoose = require('mongoose');
const customer = require('mongoose');


const addressSchema = new mongoose.Schema(
    {
        calle:{
            type: String,
            required: true
        },
        numInterior:{
            type: Number
        },
        numExterior:{
            type: Number,
            required: true
        },
        ciudad:{
            type: String,
            required: true
        },
        estado:{
            type: String,
            required: true
        },
        cp:{
            type: String,
            required: true
        },
        colonia:{
            type: String,
            required: true
        },
        referencias:{
            type: String
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
        _id:false
    }
)


const paymentMethodSchema = new mongoose.Schema(
    {
        tipo:{
            type: String,
            required: true
        },
        numTarjeta:{
            type: String,
            required: true
        },
        fechaVencimiento:{
            type: String,
            required: true
        },
        cvv:{
            type: Number,
            required: true
        },
        titular:{
            type: String,
            required: true
        }
    }
)


const productSchema = new mongoose.Schema(
    {
        codigoBarras:{
            type: String,
            required: true
        },
        cantidad:{
            type: Number,
            required: true
        }
    }
)


const orderHistory = new mongoose.Schema(
    {
        numPedido:{
            type: String,
            required: true
        }
    }
)

const customerSchema = new mongoose.Schema(
    {
        id: mongoose.Schema.Types.ObjectId,
        nombre:{
            type: String,
            required: true
        },
        apellidoPaterno:{
            type: String,
            required: true
        },
        apellidoMaterno:{
            type: String,
            required: true
        },
        fechaNacimiento:{
            type: Date,
            required: true
        },
        numTelefono:{
            type: String,
            required: true
        },
        contrasenia:{
            type: String,
            required: true
        },
        direcciones:[
            addressSchema
        ],
        metodosPago:[
            paymentMethodSchema
        ],
        carritoCompras:{
            productos:[
                productSchema
            ]
        },
        historialPedidos:[
            orderHistory
        ]
    }
)


module.exports = customer.model('customer', customerSchema);