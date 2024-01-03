const { Router } = require('express');
const { 
    asignToDeliveryMan, 
    getDeliveryManOrders, 
    getOrdersDetails, 
    deliverOrder, 
    deliverOrderWithProblems, 
    getPendingOrders, 
    rejectOrder, 
    getDeliveryMans } = require('../../controllers/employeeController');

const router = Router();

router.patch('/asignOrder', asignToDeliveryMan)
router.get('/getDeliveryOrders/:employeeNumber', getDeliveryManOrders )
router.get('/getOrderDetails/:orderNumber', getOrdersDetails)
router.patch('/deliverOrder/:orderNumber', deliverOrder)
router.patch('/deliverOrderWithProblems/:orderNumber', deliverOrderWithProblems)
router.get('/getPendingOrders', getPendingOrders)
router.patch('/rejectOrder/:orderNumber', rejectOrder)
router.get('/getDeliveryMans', getDeliveryMans)

module.exports = router;