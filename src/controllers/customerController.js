const Logger = require('../config/logger');
const CustomerLogic = require('../logic/customerLogic');
const Customer = require('../models/customerModel');
const StatusCode = require('../models/httpStatusCodes');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const Employee = require('../models/employeeModel');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');


const createCustomer = async (req, res) => {
    let resultCode = StatusCode.INTERNAL_SERVER_ERROR;
    let responseMesage = "Customer not created";

    try{
        const newCustomer = req.body;

        resultCode = await CustomerLogic.createCustomer(newCustomer);
        responseMesage = "Customer created succesfully";
    } catch(error){
        Logger.error(`Error in createCustomer Controller: ${error}`);
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: responseMesage
    });
}


const customerNotRegistered = async (req, res) => {
    let resultCode = StatusCode.INTERNAL_SERVER_ERROR;
    let isRegistered;
    let response = "Error in customerNotRegistered Controller";

    try{
        const customerPhone = req.params.numTelefono;

        isRegistered = await CustomerLogic.isCustomerRegister(customerPhone);

        if(isRegistered === false){
            response = "The customer is not registered";
            resultCode = StatusCode.OK;
        } else {
            response = "The customer is already registered";
            resultCode = StatusCode.CREATED;
        }
    } catch(error){
        Logger.error(`Error in customerNotRegistered Controller: ${error}`);
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    })
}


const editCustomerProfile = async (req, res) => {
    let resultCode = StatusCode.INTERNAL_SERVER_ERROR;
    let response = "Customer Profile not modified :(";

    try{
        let customerPhoneNumber = req.params.customerPhoneNumber;
        let customerProfileModified = req.body;

        resultCode = await CustomerLogic.modifyCustomer(customerPhoneNumber, customerProfileModified);
        if(resultCode == 200){
            response = "Customer profile modified succesfully :)"
        }
    } catch(error){
        Logger.error(`There was an error in editCustomerProfile controller: ${error}`);
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    })
}


const getProductsCatalog = async (req, res) => {
    let resultCode = StatusCode.INTERNAL_SERVER_ERROR;
    let responseMessage = "Products not obtained";
    let response = [];

    try{
        const productsObtained = await CustomerLogic.getAllProducts();
        
        if(productsObtained != null){
            response = productsObtained;
            responseMessage = "Products obtained succesfully"
            resultCode = StatusCode.OK
        }
    } catch(error){
        Logger.error(`There was an error in getProductsCatalog controller: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: responseMessage,
        response
    })
}


const getProductsByBranch = async (req, res) => {
    let resultCode = StatusCode.INTERNAL_SERVER_ERROR;
    let responseMessage = "Products not obtained";
    let response = [];

    try{
        const inventory = req.body
        const productsObtained = await CustomerLogic.getProductsByInventory(inventory)
        
        if(productsObtained != null){
            response = productsObtained;
            responseMessage = "Products obtained succesfully"
            resultCode = StatusCode.OK
        }
    } catch(error){
        Logger.error(`There was an error in getProductsByBranch controller: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: responseMessage,
        response
    })
}


const addNewAddress = async (req, res) => {
    let statusCode = StatusCode.NOT_FOUND;
    let responseMessage = `User doesn't exist`;
    let newAddress = req.body;
    let customerPhoneNumber = req.params.customerPhoneNumber;

    try{
        let customerExists = await CustomerLogic.isCustomerRegister(customerPhoneNumber);
        if(customerExists){
            let addressIsAdded = await CustomerLogic.addNewAddress(newAddress, customerPhoneNumber);
            if(addressIsAdded === StatusCode.OK){
                statusCode = StatusCode.OK;
                responseMessage = "Address added!";
            }            
        }
    }catch(error){
        Logger.error(`There was an error in addNewDirection in controllers: ${error}`);
    }

    return res.status(statusCode).json({
        code:statusCode,
        msg: responseMessage
    });
}


const addNewPaymentMethod = async (req, res) => {
    let statusCode = StatusCode.NOT_FOUND;
    let responseMessage = `User doesn't exist`;
    let newPaymentMethod = req.body;
    let customerPhoneNumber = req.params.customerPhoneNumber;

    try{
        let customerExists = await CustomerLogic.isCustomerRegister(customerPhoneNumber);
        if(customerExists){
            let paymentMethodIsAdded = await CustomerLogic.addNewPaymentMethod(newPaymentMethod, customerPhoneNumber);
            if(paymentMethodIsAdded === StatusCode.OK){
                statusCode = StatusCode.OK;
                responseMessage = "Payment Method added!";
            }            
        }
    }catch(error){
        Logger.error(`There was an error in addNewPaymentMethod in controllers: ${error}`);
    }

    return res.status(statusCode).json({
        code:statusCode,
        msg: responseMessage
    });
}


const cancelOrder = async (req, res) => {
    let resultCode = StatusCode.INTERNAL_SERVER_ERROR;
    let response = "Order state not modified :(";

    try{
        let numOrder = req.params.numOrder;

        resultCode = await CustomerLogic.cancelOrder(numOrder);
        if(resultCode == 200){
            response = "Order state modified succesfully :)"
        }
    } catch(error){
        Logger.error(`There was an error in cancelOrder controller: ${error}`);
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    })
}


const getOrdersHistoryOfCustomer = async (req,res) => {
    let statusCode = StatusCode.NOT_FOUND;
    let responseMessage = `User doesn't exist`;
    let response = [];

    try{
        const ordersObtained = await CustomerLogic.getOrdersHistoryOfCustomer(req.params.customerPhoneNumber);
        if(ordersObtained){
            response = ordersObtained;
            statusCode = StatusCode.OK;
            responseMessage = "Here are his orders";
        }
    }catch(error){
        Logger.error(`There was an error in getHistoryOrdersOFCustomer in controllers: ${error}`);
    }

    return res.status(statusCode).json({
        code:statusCode,
        msg: responseMessage,
        response
    });
}


const getProductByBarcode = async (req, res) => {
    try {
      const { codigoBarras } = req.params;
      const product = await Product.findOne({ codigoBarras: codigoBarras });
  
      if (!product) {
        return res.status(404).send('Producto no encontrado.');
      }
  
      res.json(product);
    } catch (error) {
      res.status(500).send('Error en el servidor: ' + error.message);
    }
  };


const getCustomerByPhone = async (req, res) => {
    let statusCode = StatusCode.NOT_FOUND
    let responseMessage = "The customer doesn't exist"
    let response = {}

    try{
        const phoneNumber = req.params.customerPhone;

        const customerObtained = await CustomerLogic.getCustomerByPhone(phoneNumber)
        if(customerObtained !== null){
            statusCode = StatusCode.OK
            responseMessage = "Customer obtained succesfully"
            response = customerObtained
        }
    }catch(error){
        Logger.error(`There was an error in getCustomerByPhone controller: ${error}`)
        statusCode = StatusCode.INTERNAL_SERVER_ERROR
    }

    return res.status(statusCode).json({
        code: statusCode,
        msg: responseMessage,
        response
    })
}


const addProductToCustomerCart = async (req, res) => {
    let statusCode = StatusCode.NOT_FOUND
    let responseMessage = "Product no added :("

    try{
        const phoneNumber = req.params.phoneNumber
        const productInfo = req.body

        statusCode = await CustomerLogic.addProductToCart(phoneNumber, productInfo)
        if(statusCode === 200){
            responseMessage = "Product added succesfully :3"
        }
    } catch(error) {
        Logger.error(`There was an error in addProductToCustomerCart controller: ${error}`)
        statusCode = StatusCode.INTERNAL_SERVER_ERROR
    }

    return res.status(statusCode).json({
        code: statusCode,
        msg: responseMessage
    })
}


const getCostumerPhoneNumber = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.userId; 

        if (!userId) {
            return res.status(400).json({ message: 'ID de usuario no proporcionado en el token' });
        }

        const user = await Customer.findById(userId);
        

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ phone: user.numTelefono });
    } catch (error) {
        res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
    }
}


const reportOrder = async (req, res) => {
    const numPedido = req.params.numPedido;
    const { IdIncidente, descripcion, fotografia } = req.body;

    try {
        // Buscar el pedido por el número de pedido
        const order = await Order.findOne({ numPedido: numPedido });

        // Verificar si el pedido existe y si no tiene un incidente reportado previamente
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado.' });
        }

        if (order.incidente && order.incidente.IdIncidente) {
            return res.status(400).json({ message: 'El pedido ya tiene un incidente reportado.' });
        }

        // Actualizar el pedido con los detalles del incidente
        order.incidente = {
            IdIncidente: IdIncidente || new mongoose.Types.ObjectId(), // Generar un nuevo ObjectId si no se proporciona
            descripcion: descripcion,
            fotografia: fotografia
        };

        await order.save(); // Guardar el pedido actualizado

        res.status(200).json({ message: 'Incidente reportado con éxito.', order: order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al reportar el incidente.', error: error });
    }
}


const getPaymentMethods = async (req, res) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) return res.sendStatus(401); 

    const tokenParts = authHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') return res.sendStatus(401); 

    const token = tokenParts[1];
    

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403); 

        try {
            const customerId = user.userId; 
            
            const customer = await Customer.findById(customerId);

            if (!customer) {
                return res.status(404).send('Cliente no encontrado');
            }

            if (customer.metodosPago.length === 0) {
                return res.status(404).send('No hay métodos de pago disponibles para este cliente');
            }

            res.json(customer.metodosPago);
        } catch (error) {
            console.error(error); 
            res.status(500).send('Error en el servidor');
        }
    });
};


const getAddresses = async (req, res) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) return res.sendStatus(401);

    const tokenParts = authHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') return res.sendStatus(401);

    const token = tokenParts[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);

        try {
            const customerId = user.userId;
            
            const customer = await Customer.findById(customerId);

            if (!customer) {
                return res.status(404).send('Cliente no encontrado');
            }

            if (customer.direcciones.length === 0) {
                return res.status(404).send('No hay direcciones disponibles para este cliente');
            }

            res.json(customer.direcciones);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error en el servidor');
        }
    });
};


const getShoppingCartItems = async (req, res) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) return res.sendStatus(401);

    const tokenParts = authHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') return res.sendStatus(401);

    const token = tokenParts[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);

        try {
            const customerId = user.userId;
            
            const customer = await Customer.findById(customerId).populate('carritoCompras.productos.codigoBarras');

            if (!customer) {
                return res.status(404).send('Cliente no encontrado');
            }

            if (customer.carritoCompras.productos.length === 0) {
                return res.status(404).send('No hay productos en el carrito');
            }

            // Creamos un array para almacenar la información completa de los productos
            let cartItemsDetails = [];
            for (let cartItem of customer.carritoCompras.productos) {
                let productDetails = await Product.findOne({ codigoBarras: cartItem.codigoBarras });
                if (productDetails) {
                    cartItemsDetails.push({
                        ...productDetails.toObject(),
                        cantidad: cartItem.cantidad
                    });
                }
            }

            if (cartItemsDetails.length === 0) {
                return res.status(404).send('Error al recuperar productos');
            }

            res.json(cartItemsDetails);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error en el servidor');
        }
    });
};


const updateCartItemQuantity = async (req, res) => {
    const { codigoBarras, nuevaCantidad } = req.body;
    const token = req.headers['authorization'].split(' ')[1]; // Asume que el token viene en el formato 'Bearer [token]'

    if (!codigoBarras || typeof nuevaCantidad !== 'number') {
        return res.status(400).send('Datos incompletos o incorrectos');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const customerId = decoded.userId;
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).send('Cliente no encontrado');
        }

        const productIndex = customer.carritoCompras.productos.findIndex(p => p.codigoBarras === codigoBarras);
        if (productIndex === -1) {
            return res.status(404).send('Producto no encontrado en el carrito');
        }

        customer.carritoCompras.productos[productIndex].cantidad = nuevaCantidad;
        await customer.save();
        res.json({ success: true, message: 'Cantidad actualizada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error en el servidor' });
    }
};


const removeItemFromCart = async (req, res) => {
    const { codigoBarras } = req.body;
    const token = req.headers['authorization'].split(' ')[1]; // Asume que el token viene en el formato 'Bearer [token]'

    if (!codigoBarras) {
        return res.status(400).send('Datos incompletos');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const customerId = decoded.userId;
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).send('Cliente no encontrado');
        }

        const productIndex = customer.carritoCompras.productos.findIndex(p => p.codigoBarras === codigoBarras);
        if (productIndex === -1) {
            return res.status(404).send('Producto no encontrado en el carrito');
        }

        customer.carritoCompras.productos.splice(productIndex, 1);
        await customer.save();
        res.json({ success: true, message: 'Producto eliminado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error en el servidor' });
    }
};


const generateUniqueOrderId = async () => {
    let isUnique = false;
    let uniqueId;
    while (!isUnique) {
        uniqueId = Math.floor(Math.random() * 1000000).toString();

        const orderExists = await Order.findOne({ numPedido: uniqueId });
        if (!orderExists) {
            isUnique = true;
        }
    }
    return uniqueId;
};


const registerOrder = async (req, res) => {
    const { direccion, metodoPago, sucursal } = req.body;

    const token = req.headers['authorization']?.split(' ')[1];

    if (!token || !direccion || !metodoPago || !sucursal) {
        return res.status(400).send('Datos incompletos');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const customerId = decoded.userId;
        const customer = await Customer.findById(customerId).populate('carritoCompras.productos.codigoBarras');

        if (!customer) {
            return res.status(404).send('Cliente no encontrado');
        }

        const customerDireccion = customer.direcciones.find(d => d.calle === direccion);
        if (!customerDireccion) {
            return res.status(404).send('Dirección no encontrada');
        }

         let total = 0;

         const productsToAdd = [];
 
         for (let item of customer.carritoCompras.productos) {
            const productDetails = await Product.findOne({ codigoBarras: item.codigoBarras });
            if (!productDetails) {
                continue;
            }
            total += productDetails.precioUnitario * item.cantidad;
            productsToAdd.push({
                codigoBarras: item.codigoBarras,
                cantidad: item.cantidad
            });
        }

        const numPedido = await generateUniqueOrderId();

        const newOrder = new Order({
            numPedido: numPedido,
            fechaPedido: new Date(),
            numTelefonoConsumidor: customer.numTelefono,
            direccion: direccion,
            metodoPago: metodoPago,
            repartidor: '',
            productos: await Promise.all(productsToAdd),
            incidente: {
                IdIncidente: '',
                descripcion: '',
                fotografia: ''
            },
            total: total,
            sucursal: sucursal,
            estado: 'Procesandose',
            ubicacion: {
                lat: customerDireccion.ubicacion.lat,
                lng: customerDireccion.ubicacion.lng 
            }
        });

        await newOrder.save();

        customer.historialPedidos.push({
            numPedido: newOrder.numPedido,
            fechaPedido: newOrder.fechaPedido
        });

        customer.carritoCompras.productos = [];
        await customer.save();

        res.json({ success: true, message: 'Pedido registrado con éxito', order: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error en el servidor' });
    }
};

const addPaymentMethod = async (req, res) => {
    const { tipo, numTarjeta, fechaVencimiento, cvv, titular } = req.body;
    const token = req.headers['authorization'].split(' ')[1];

    if (!tipo || !numTarjeta || !fechaVencimiento || !cvv || !titular) {
        return res.status(400).send('Datos incompletos o incorrectos para el método de pago');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const customerId = decoded.userId;
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).send('Cliente no encontrado');
        }

        const cardExists = customer.metodosPago.some(method => method.numTarjeta === numTarjeta);
        if (cardExists) {
            return res.status(400).send('Tarjeta previamente registrada');
        }

        const newPaymentMethod = { tipo, numTarjeta, fechaVencimiento, cvv, titular };
        customer.metodosPago.push(newPaymentMethod);
        await customer.save();
        
        res.json({ success: true, message: 'Método de pago agregado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error en el servidor' });
    }
};



module.exports = {
    createCustomer,
    customerNotRegistered,
    editCustomerProfile,
    getProductsCatalog,
    addNewAddress,
    getOrdersHistoryOfCustomer,
    addNewPaymentMethod,
    cancelOrder,
    getCustomerByPhone,
    getProductsByBranch,
    addProductToCustomerCart,
    getProductByBarcode,
    getCostumerPhoneNumber,
    reportOrder,
    getPaymentMethods,
    getAddresses,
    getShoppingCartItems,
    updateCartItemQuantity,
    removeItemFromCart,
    registerOrder,
    addPaymentMethod
}