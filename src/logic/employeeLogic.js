const Employee = require('../models/employeeModel')
const Order = require("../models/orderModel");
const StatusCode = require('../models/httpStatusCodes')
const Logger = require('../config/logger')
const Product = require('../models/productModel')

const addOrderToDeliveryMan = (employeeNumber, orderAsigned) => {
    return new Promise((resolve, reject) => {
        Employee.findOneAndUpdate({ numEmpleado: employeeNumber }, {$push: {pedidosAsignados: orderAsigned}})
        .then(() => {
            resolve(StatusCode.OK)
        })
        .catch((error) => {
            Logger.error(`There was an error adding the order to the delivery man: ${error}`)
            reject(StatusCode.INTERNAL_SERVER_ERROR)
        })
    })
}


const getDeliveryMan = (employeeNumber) => {
    return new Promise((resolve, reject) => {
        const deliveryMan = Employee.findOne({numEmpleado: employeeNumber})
        .then((deliveryMan) => {
            resolve(deliveryMan)
        })
        .catch((error) => {
            Logger.error(`There was an error gettin the deliveryMan: ${error}`)
            reject(StatusCode.INTERNAL_SERVER_ERROR)
        })
    })
}


const getDeliveryManOrders = (employeeNumber) => {
    return new Promise((resolve, reject) => {
        getDeliveryMan(employeeNumber)
            .then((deliveryMan) => {
                Order.find({ numPedido: { $in: deliveryMan.pedidosAsignados } })
                    .then((result) => {
                        if (result.length > 0) {
                            resolve(result);
                        } else {
                            reject(StatusCode.NOT_FOUND);
                        }
                    })
                    .catch((error) => {
                        Logger.error(`There was an error at employeeLogic: ${error}`);
                        reject(StatusCode.INTERNAL_SERVER_ERROR);
                    });
            })
            .catch((error) => {
                Logger.error(`There was an error at employeeLogic: ${error}`);
                reject(StatusCode.INTERNAL_SERVER_ERROR);
            })
    });
};


const getOrdersDetails = (orderNumber) => {
    return new Promise((resolve, reject) => {
        Order.findOne({numPedido: orderNumber})
        .then((orderObtained) => {
            resolve(orderObtained)
        })
        .catch((error) => {
            Logger.error(`There was an error obtining the orderDetails: ${error}`)
            reject(StatusCode.INTERNAL_SERVER_ERROR)
        })
    })
}



const getOrderProducts = (products) => {
    let orderProducts = [];
    const barcodes = products.map(product => product.codigoBarras);
    return new Promise((resolve, reject) => [
        products = Product.find({ codigoBarras: { $in: barcodes } })
            .then((products) => {
                resolve(products)
            })
            .catch((error) => {
                Logger.error(`There was an error obtaining the products: ${error}`)
                reject(StatusCode.INTERNAL_SERVER_ERROR)
            })
    ])
}


const finishOrder = (orderNumber) => {
    return new Promise ((resolve, reject) => {
        Order.findOneAndUpdate({numPedido: orderNumber}, {estado: "Entregado"})
        .then((result) => {
            resolve(StatusCode.OK)
        })
        .catch((error) => {
            Logger.error(`there was an error in finishOrder:${error}`)
            reject(StatusCode.INTERNAL_SERVER_ERROR)
        })
    })
}


const finishOrderWithProblems = (orderNumber, reason) => {
    return new Promise ((resolve, reject) => {
        Order.findOneAndUpdate({numPedido: orderNumber}, {estado: "No entregado", motivo:  reason})
        .then((result) => {
            resolve(StatusCode.OK)
        })
        .catch((error) => {
            Logger.error(`there was an error in finishOrderWithProblems: ${error}`)
            reject(StatusCode.INTERNAL_SERVER_ERROR)
        })
    })
}



const getPendingOrders = () => {
    return new Promise((resolve, reject) => {
        Order.find({estado: "Preparandose"})
        .then((orders) => {
            resolve(orders)
        })
        .catch((error) => {
            Logger.error(`There was an error obtaining the pending orders: ${error}`)
            reject(StatusCode.INTERNAL_SERVER_ERROR)
        })
    })
}


const rejectOrder = (orderNumber) => {
    return new Promise((resolve, reject) => {
        Order.findOneAndUpdate({numPedido : orderNumber}, {estado: "Rechazado"})
        .then(() => {
            resolve(StatusCode.OK)
        })
        .catch((error) => {
            Logger.error(`There was an error rejecting the order: ${error}`)
            reject(StatusCode.INTERNAL_SERVER_ERROR)
        })
    })
}


const getDeliveryMans = () => {
    return new Promise((resolve, reject) => {
        Employee.find({rol: "Repartidor"})
        .then((deliveryMans) => {
            resolve(deliveryMans)
        })
        .catch((error) => {
            Logger.error(`There was an error obtaining delivery mans: ${error}`)
            reject(StatusCode.INTERNAL_SERVER_ERROR)
        })
    })
}


const changeOrderStatus = (orderNumber, status) => {
    return new Promise((resolve, reject) => {
        Order.findOneAndUpdate({numPedido: orderNumber}, {estado: status})
        .then(() => {
            resolve(StatusCode.OK)
        })
        .catch((error) => {
            Logger.error(`There was an error changing the order status: ${error}`)
            reject(StatusCode.INTERNAL_SERVER_ERROR)
        })
    })
}

module.exports = {
    addOrderToDeliveryMan,
    getDeliveryManOrders,
    getOrdersDetails,
    getOrderProducts,
    finishOrder,
    finishOrderWithProblems,
    getPendingOrders,
    rejectOrder,
    getDeliveryMans,
    changeOrderStatus
}