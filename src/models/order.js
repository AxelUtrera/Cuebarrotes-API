const mongoose = require("mongoose");


const productOrderSchema = new mongoose.Schema(
    {
        codigoBarras: {
            type: String,
            required: true
        },
        cantidad: {
            type: Number,
            required: true
        }
    }
);

const orderSchema = new mongoose.Schema(
    {
        numPedido:{
            type:String,
            required:true
        },
        fechaPedido: {
            type: Date,
            required: true
        },
        numTelefonoConsumidor: {
            type: String,
            required: true
        },
        direccion: {
            type: String,
            required: true
        },
        metodoPago: {
            type: String,
            required: true
        },
        repartidor: {
            type: String,
            required: true
        },
        productos: [
            productOrderSchema
        ],
        incidente: {
            IdIncidente: {
                type: String,
            },
            descripcion:{
                type:String
            },
            fotografia:{
                type:String
            }
        },
        sucursal:{
            type:String,
            required:true
        }
    }
);

module.exports = mongoose.model('pedidos', orderSchema);