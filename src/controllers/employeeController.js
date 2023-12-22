const StatusCode = require('../models/httpStatusCodes')
const employeeLogic = require('../logic/employeeLogic')
const Logger = require('../config/logger')

const asignToDeliveryMan = async (req, res) => {
    let resultCode = StatusCode.INTERNAL_SERVER_ERROR;
    let responseMessage = "Order not added :("

    try{
        const employeeNumber = req.body.numEmpleado;
        const orderNumber = req.body.numPedido;

        const result = await employeeLogic.addOrderToDeliveryMan(employeeNumber, orderNumber)
        if(result === 200){
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


module.exports = {
    asignToDeliveryMan
}