const Logger = require("../config/logger");
const Customer = require("../models/customerModel");


const createCustomer = async (newCustomer) => {
    let statusCode = 500;

    return new Promise((resolve, reject) => {
        const customerToCreate = new Customer(newCustomer);
        customerToCreate.save()
        .then(() => {
            statusCode = 200;
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
            reject(500);
            Logger.error(`Error finding a registered customer: ${error}`);
        })
    })
}


module.exports = {
    createCustomer,
    isCustomerRegister
}