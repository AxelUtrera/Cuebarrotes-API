const { Router } = require('express');
const { getAllUsers, createCustomer, customerNotRegistered, editCustomerProfile, getProductsCatalog, addNewAddress, getOrdersHistoryOfCustomer, addNewPaymentMethod, cancelOrder} = require('../../controllers/customerController');

const router = Router();

router.get('/', getAllUsers);
router.post('/registerCustomer', createCustomer);
router.get('/customerNotRegistered', customerNotRegistered);
router.patch('/modifyProfile/:customerPhoneNumber', editCustomerProfile);
router.get('/getProductsCatalog', getProductsCatalog);;
router.patch('/addNewAddress/:customerPhoneNumber', addNewAddress);
router.patch('/addNewPaymentMethod/:customerPhoneNumber', addNewPaymentMethod);
router.patch('/cancelOrder/:numOrder', cancelOrder);
router.get('/getOrders/:customerPhoneNumber', getOrdersHistoryOfCustomer);

module.exports = router;