const { Router } = require('express');
const { asignToDeliveryMan, getDeliveryManOrders, getOrdersDetails, deliverOrder, deliverOrderWithProblems } = require('../../controllers/employeeController');

const router = Router();

router.patch('/asignOrder', asignToDeliveryMan)
router.get('/getDeliveryOrders/:employeeNumber', getDeliveryManOrders )
router.get('/getOrderDetails/:orderNumber', getOrdersDetails)
router.patch('/deliverOrder/:orderNumber', deliverOrder)
router.patch('/deliverOrderWithProblems/:orderNumber', deliverOrderWithProblems)

module.exports = router;