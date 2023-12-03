const mongoose = require('mongoose');
const product = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        descripcion:{
            type: String,
            required: true
        },
        imagen:{
            type: String,
            default: ''
        },
        precioUnitario:{
            type: Number,
            required: true
        },
        fechaCaducidad:{
            type: Date,
        },
        activo:{
            type: Boolean,
            default: true
        },
        categoria:{
            type: String,
            required: true
        },
        codigoBarras:{
            type: String,
            required: true
        },
        nombre:{
            type: String,
            required: true
        }
    }
)


module.exports = product.model('product', productSchema);