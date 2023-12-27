const Logger = require("../config/logger");
const Customer = require("../models/customerModel");
const Product = require("../models/productModel");
const StatusCode = require("../models/httpStatusCodes");
const Order = require("../models/orderModel");


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
        const customerObtained = Customer.findOne({ numTelefono: numberPhone })
            .then((customerObtained) => {
                if (customerObtained === null) {
                    resolve(false);
                } else {
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
        Customer.findOneAndUpdate({ numTelefono: numberPhone }, customerEdited)
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
        products = Product.find({ activo: true })
            .then((products) => {
                resolve(products)
            })
            .catch((error) => {
                Logger.error(`There was an error obtaining the products: ${error}`)
                reject(StatusCode.INTERNAL_SERVER_ERROR)
            })
    })
}

const addNewAddress = (newAddress, numberPhone) => {
    return new Promise((resolve, reject) => {
        //Busca el usuario por su numero de telefono y agrega una nueva direcciona al array de direcciones.
        Customer.findOneAndUpdate(
            { numTelefono: numberPhone },
            { $push: { direcciones: newAddress } },
            { new: true })
            .then((result) => {
                if (result) {
                    resolve(StatusCode.OK);
                } else {
                    reject(StatusCode.NOT_FOUND);
                }
            })
            .catch((error) => {
                Logger.error(`There was an error adding a new address: ${error}`);
                reject(StatusCode.INTERNAL_SERVER_ERROR);
            })
    });
};

const addNewPaymentMethod = (newPaymentMethod, numberPhone) => {
    return new Promise((resolve, reject) => {
        //Busca el usuario por su numero de telefono y agrega una nuevo metodo de pago al array de metodos de pago.
        Customer.findOneAndUpdate(
            { numTelefono: numberPhone },
            { $push: { metodosPago: newPaymentMethod } },
            { new: true })
            .then((result) => {
                if (result) {
                    resolve(StatusCode.OK);
                } else {
                    reject(StatusCode.NOT_FOUND);
                }
            })
            .catch((error) => {
                Logger.error(`There was an error adding a new payment method: ${error}`);
                reject(StatusCode.INTERNAL_SERVER_ERROR);
            })
    });
};

const getCustomerByPhone = (phoneNumber) => {
    return new Promise((resolve, reject) => {
        Customer.findOne({ numTelefono: phoneNumber })
            .then((response) => {
                if (response) {
                    resolve(response);
                } else {
                    reject(StatusCode.NOT_FOUND);
                }
            })
            .catch((error) => {
                Logger.error(`There was an error at customerLogic: ${error}`);
                reject(StatusCode.INTERNAL_SERVER_ERROR);
            });
    });
};

const getOrdersHistoryOfCustomer = (numPhone) => {
    return new Promise((resolve, reject) => {
        getCustomerByPhone(numPhone)
            .then((customer) => {
                Order.find({ numPedido: { $in: customer.historialPedidos } })
                    .then((result) => {
                        if (result.length > 0) {
                            resolve(result);
                        } else {
                            reject(StatusCode.NOT_FOUND);
                        }
                    })
                    .catch((error) => {
                        Logger.error(`There was an error at customerLogic: ${error}`);
                        reject(StatusCode.INTERNAL_SERVER_ERROR);
                    });
            })
            .catch((error) => {
                Logger.error(`There was an error at customerLogic: ${error}`);
                reject(StatusCode.INTERNAL_SERVER_ERROR);
            })
    });
};

const cancelOrder = (numOrder) => {
    return new Promise((resolve, reject) => {
        //Busca el pedido por su numero de pedido y cambia el estado a "Cancelado".
        Order.findOneAndUpdate(
            { numPedido: numOrder },
            { estado: "Cancelado" }
        )
            .then(() => {
                resolve(StatusCode.OK);
            })
            .catch((error) => {
                Logger.error(`There was an error changing the state: ${error}`);
                reject(StatusCode.INTERNAL_SERVER_ERROR);
            })
    });
};


module.exports = {
    createCustomer,
    isCustomerRegister,
    modifyCustomer,
    getAllProducts,
    addNewAddress,
    getCustomerByPhone,
    getOrdersHistoryOfCustomer,
    cancelOrder,
    addNewPaymentMethod,
}