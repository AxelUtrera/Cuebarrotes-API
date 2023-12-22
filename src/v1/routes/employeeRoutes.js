const { Router } = require('express');
const { asignToDeliveryMan } = require('../../controllers/employeeController');

const router = Router();

router.patch('/asignOrder', asignToDeliveryMan)

module.exports = router;