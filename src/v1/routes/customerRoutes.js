const { Router } = require('express');
const { getAllUsers, createCustomer, customerNotRegistered, editCustomerProfile, getProductsCatalog} = require('../../controllers/customerController');

const router = Router();

router.get('/', getAllUsers);
router.post('/registerCustomer', createCustomer);
router.get('/customerNotRegistered', customerNotRegistered);
router.patch('/modifyProfile/:customerPhoneNumber', editCustomerProfile);
router.get('/getProductsCatalog', getProductsCatalog);

module.exports = router;