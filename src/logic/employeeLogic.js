const Employee = require('../models/employeeModel')
const StatusCode = require('../models/httpStatusCodes')
const Logger = require('../config/logger')

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

module.exports = {
    addOrderToDeliveryMan
}