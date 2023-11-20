const { Router } = require('express');
const { getAllUsers, createCustomer, customerNotRegistered, editCustomerProfile, getProductsCatalog, addNewAddress, getOrdersHistoryOfCustomer} = require('../../controllers/customerController');

const router = Router();

router.get('/', getAllUsers);
router.post('/registerCustomer', createCustomer);
router.get('/customerNotRegistered', customerNotRegistered);
router.patch('/modifyProfile/:customerPhoneNumber', editCustomerProfile);
router.get('/getProductsCatalog', getProductsCatalog);
router.patch('/addNewAddress/:customerPhoneNumber', addNewAddress);
router.get('/getOrders/:customerPhoneNumber', getOrdersHistoryOfCustomer);

module.exports = router;