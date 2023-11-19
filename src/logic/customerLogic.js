const Logger = require("../config/logger");
const Customer = require("../models/customerModel");
const Product = require("../models/productModel");
const StatusCode = require("../models/httpStatusCodes");


const createCustomer = async (newCustomer) => {
    let statusCode = StatusCode.INTERNAL_SERVER_ERROR;

    return new Promise((resolve, reject) => {
        const customerToCreate = new Customer(newCustomer);
        customerToCreate.save()
        .then(() => {
            statusCode = StatusCode.OK;
            resolve(statusCode);
        })
        .catch((error) => {
            reject(statusCode);
            Logger.error(`Error creating a customer: ${error}`);
        });
    });
}


const isCustomerRegister = async (numberPhone) => {
    return new Promise((resolve, reject) => {
        const customerObtained = Customer.findOne({numTelefono: numberPhone})
        .then((customerObtained) => {
            if(customerObtained == null){
                resolve(false);
            }else{
                resolve(true);
            }
        })
        .catch((error) => {
            reject(StatusCode.INTERNAL_SERVER_ERROR);
            Logger.error(`Error finding a registered customer: ${error}`);
        })
    })
}


const modifyCustomer = (numberPhone, customerEdited) => {
    return new Promise((resolve, reject) => {
        Customer.findOneAndUpdate({numTelefono: numberPhone }, customerEdited)
        .then(() => {
            resolve(StatusCode.OK);
        })
        .catch((error) => {
            Logger.error(`There was an error updating a customer: ${error}`);
            reject(StatusCode.INTERNAL_SERVER_ERROR);
        })
    });
}


const getAllProducts = () => {
    let products = []

    return new Promise((resolve, reject) => {
        products = Product.find({activo: true})
        .then((products) => {
            resolve(products)
        })
        .catch((error) => {
            Logger.error(`There was an error obtaining the products: ${error}`)
            reject(StatusCode.INTERNAL_SERVER_ERROR)
        })
    })
}


module.exports = {
    createCustomer,
    isCustomerRegister,
    modifyCustomer,
    getAllProducts
}