const Logger = require('../config/logger');
const CustomerLogic = require('../logic/customerLogic');
const httpStatusCodes = require('../models/httpStatusCodes');

const getAllUsers = async (req, res) => {
    res.json({
        msg:"Hola mundo"
    });
}


const createCustomer = async (req, res) => {
    let resultCode = httpStatusCodes.INTERNAL_SERVER_ERROR;
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
    let resultCode = 500;
    let isRegistered;
    let response = "Error in customerNotRegistered Controller";

    try{
        const customerPhone = req.body.numTelefono;

        isRegistered = await CustomerLogic.isCustomerRegister(customerPhone);

        if(isRegistered == false){
            response = "The customer is not registered";
            resultCode = 200;
        } else {
            response = "The customer is already registered";
            resultCode = 200;
        }
    } catch(error){
        Logger.error(`Error in customerNotRegistered Controller: ${error}`);
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: response
    })
}

module.exports = {
    getAllUsers,
    createCustomer,
    customerNotRegistered
}