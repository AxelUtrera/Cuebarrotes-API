const { Router } = require('express');
const { getAllUsers, createCustomer, customerNotRegistered} = require('../../controllers/customerController');

const router = Router();

router.get('/', getAllUsers);
router.post('/registerCustomer', createCustomer)
router.get('/customerNotRegistered', customerNotRegistered)

module.exports = router;