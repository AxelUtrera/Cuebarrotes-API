const StatusCode = require('../models/httpStatusCodes')
const employeeLogic = require('../logic/employeeLogic')
const administratorLogic = require('../logic/administratorLogic')
const customerLogic = require('../logic/customerLogic')
const Logger = require('../config/logger')

const asignToDeliveryMan = async (req, res) => {
    let resultCode = StatusCode.INTERNAL_SERVER_ERROR;
    let responseMessage = "Order not added :("

    try{
        const employeeNumber = req.body.numEmpleado;
        const orderNumber = req.body.numPedido;

        const result = await employeeLogic.addOrderToDeliveryMan(employeeNumber, orderNumber)
        const resultAux = await employeeLogic.changeOrderStatus(orderNumber, "En proceso")
        if(result === 200 && resultAux === 200){
            resultCode = 200
            responseMessage = "Order added succesfully"
        }
    } catch(error) {
        Logger.error(`There was an error on addOrderToDeliveryMan controller: ${error}`)
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: responseMessage
    })
}


const getDeliveryManOrders = async (req, res) => {
    let resultCode = StatusCode.NOT_FOUND
    let responseMessage = "Delivery man not found"
    let response = []

    try{
        const employeeNumber = req.params.employeeNumber

        response = await employeeLogic.getDeliveryManOrders(employeeNumber)
        if(response !== null){
            resultCode = StatusCode.OK
            responseMessage = "Asigned orders found"
        }
    } catch (error) {
        Logger.error(`There was an error in getDeliveryManOrders controller: ${error}`)
        resultCode = StatusCode.INTERNAL_SERVER_ERROR
        responseMessage = "There was a error :("
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: responseMessage,
        response
    })
}


const getOrdersDetails = async (req, res) => {
    let resultCode = StatusCode.NOT_FOUND
    let responseMessage = "Order not found"
    let order = {}
    let branchLocation = {}
    let products = []
    let productsInfo = []

    try{
        const orderNumber = req.params.orderNumber

        
        order = await employeeLogic.getOrdersDetails(orderNumber)
        branchLocation = await administratorLogic.getBranchByName(order.sucursal)
        products = await employeeLogic.getOrderProducts(order.productos)

        if(order !== null && branchLocation !== null || products !== null) {

            order.productos.forEach(element => {
                const aux = products.find((p) => p.codigoBarras === element.codigoBarras)
                const orderProduct = {
                    nombre: aux.nombre,
                    cantidad: element.cantidad
                }

                productsInfo.push(orderProduct)
            });

            resultCode = StatusCode.OK
            responseMessage = "Orders details founded :)"
        }
        

    }catch(error){
        Logger.error(`There was an error in getOrderDetails controller: ${error}`)
        resultCode = StatusCode.INTERNAL_SERVER_ERROR
        responseMessage = "There was an error in getOrderDetails controller :("
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: responseMessage,
        order,
        branchLocation: branchLocation.ubicacion,
        productsInfo
    })
}


const deliverOrder = async (req, res) => {
    let resultCode = StatusCode.NOT_FOUND
    let responseMessage = "Order not found"

    try{
        const orderNumber = req.params.orderNumber

        resultCode = await employeeLogic.finishOrder(orderNumber)

        if(resultCode === 200){
            responseMessage = "Order delivered"
        }
    } catch(error){
        Logger.error(`There was an error in deliverOrder controller: ${error}`)
        resultCode = StatusCode.INTERNAL_SERVER_ERROR
        responseMessage = "There was an error in deliver order controller"
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: responseMessage
    })
}


const deliverOrderWithProblems = async (req, res) => {
    let resultCode = StatusCode.NOT_FOUND
    let responseMessage = "Order not found"

    try{
        const orderNumber = req.params.orderNumber
        const reason = req.body.reason

        resultCode = await employeeLogic.finishOrderWithProblems(orderNumber, reason)

        if(resultCode === 200){
            responseMessage = "Order delivered"
        }
    } catch(error){
        Logger.error(`There was an error in deliverOrder controller: ${error}`)
        resultCode = StatusCode.INTERNAL_SERVER_ERROR
        responseMessage = "There was an error in deliver order controller"
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: responseMessage
    })
}


const getPendingOrders = async (req, res) => {
    let resultCode = StatusCode.NOT_FOUND;
    let responseMessage = "Pending orders not found :(";
    let response = [];
    let orders = [];

    try {
        orders = await employeeLogic.getPendingOrders();

        if (orders !== null) {
            for (const item of orders) {
                const customer = await customerLogic.getCustomerByPhone(item.numTelefonoConsumidor);
                const orderDetails = await employeeLogic.getOrdersDetails(item.numPedido);
                const products = await employeeLogic.getOrderProducts(item.productos);

                const fullInfo = {
                    customer: customer.nombre + customer.apellidos,
                    orderDetails,
                    products,
                };
                
                response.push(fullInfo);
            }
            resultCode = StatusCode.OK;
            responseMessage = "Orders pending found";
        }
    } catch (error) {
        Logger.error(`There was an error in getPendingOrders controller: ${error}`);
        resultCode = StatusCode.INTERNAL_SERVER_ERROR;
        responseMessage = "There was an error in getPendingOrders controller";
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: responseMessage,
        response,
    });
};


const rejectOrder = async (req, res) => {
    let resultCode = StatusCode.NOT_FOUND
    let responseMessage = "Order not found"

    try{
        const orderNumber = req.params.orderNumber

        resultCode = await employeeLogic.rejectOrder(orderNumber)

        if(resultCode === StatusCode.OK){
            responseMessage = "Order rejected succesfully"
        }
    } catch(error) {
        Logger.error(`There was an error in rejectOrder controller: ${error}`)
        resultCode = StatusCode.INTERNAL_SERVER_ERROR
        responseMessage = "There was an error in rejectOrder controller"
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: responseMessage
    })
}


const getDeliveryMans = async (req, res) => {
    let resultCode = StatusCode.NOT_FOUND
    let responseMessage = "Delivery mans not found"
    let response = []

    try{
        response = await employeeLogic.getDeliveryMans()
        if(response !== null){
            resultCode = StatusCode.OK
            responseMessage = "Delivery mans founded"
        }
    } catch(error){
        Logger.error(`There was an error in getDeliveryMans: ${error}`)
        resultCode = StatusCode.INTERNAL_SERVER_ERROR
        responseMessage = "There was an error in getDeliveryMans"
    }

    return res.status(resultCode).json({
        code: resultCode,
        msg: responseMessage,
        response
    })
}

module.exports = {
    asignToDeliveryMan,
    getDeliveryManOrders,
    getOrdersDetails,
    deliverOrder,
    deliverOrderWithProblems,
    getPendingOrders,
    rejectOrder,
    getDeliveryMans
}