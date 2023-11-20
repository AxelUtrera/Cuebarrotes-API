const Logger = require('../config/logger');
const CustomerLogic = require('../logic/customerLogic');
const StatusCode = require('../models/httpStatusCodes');

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
        const customerPhone = req.body.numTelefono;

        isRegistered = await CustomerLogic.isCustomerRegister(customerPhone);

        if(isRegistered == false){
            response = "The customer is not registered";
            resultCode = StatusCode.OK;
        } else {
            response = "The customer is already registered";
            resultCode = StatusCode.OK;
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
        Logger.error(`There was an error con editCustomerProfile coontroller: ${error}`);
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

module.exports = {
    getAllUsers,
    createCustomer,
    customerNotRegistered,
    editCustomerProfile,
    getProductsCatalog,
    addNewAddress,
    getOrdersHistoryOfCustomer
}