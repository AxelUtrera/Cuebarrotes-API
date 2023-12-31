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
            required: false
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
        total:{
            type:Number,
            required:true
        },
        sucursal:{
            type:String,
            required:true
        },
        estado:{
            type:String,
            required:true,
            default:"Creado"
        },
        motivo: {
            type: String
        },
        ubicacion: {
            lat: { type: String, required: true },
            lng: { type: String, required: true }
        }
    }
);

module.exports = mongoose.model('orders', orderSchema);