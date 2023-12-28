const Logger = require('../config/logger');
const CustomerLogic = require('../logic/customerLogic');
const Customer = require('../models/customerModel');
const StatusCode = require('../models/httpStatusCodes');
const Product = require('../models/productModel');
const jwt = require('jsonwebtoken');

const getAllUsers = async (req, res) => {
    res.json({
        msg:"Hola mundo"
    });
}


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

module.exports = {
    getAllUsers,
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
    getCostumerPhoneNumber
}