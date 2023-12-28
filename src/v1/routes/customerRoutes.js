const { Router } = require('express');
const { getAllUsers, createCustomer, customerNotRegistered, editCustomerProfile, getProductsCatalog, getProductsByBranch, addNewAddress, getOrdersHistoryOfCustomer, addNewPaymentMethod, cancelOrder, getCustomerByPhone, addProductToCustomerCart , getProductByBarcode, getCostumerPhoneNumber} = require('../../controllers/customerController');

const router = Router();

router.get('/', getAllUsers);
router.post('/registerCustomer', createCustomer);
router.get('/customerNotRegistered/:numTelefono', customerNotRegistered);
router.patch('/modifyProfile/:customerPhoneNumber', editCustomerProfile);
router.get('/getProductsCatalog', getProductsCatalog);
router.post('/getProductsByBranch', getProductsByBranch);
router.patch('/addNewAddress/:customerPhoneNumber', addNewAddress);
router.patch('/addNewPaymentMethod/:customerPhoneNumber', addNewPaymentMethod);
router.patch('/cancelOrder/:numOrder', cancelOrder);
router.get('/getOrders/:customerPhoneNumber', getOrdersHistoryOfCustomer);
router.get('/getCustomerByPhone/:customerPhone', getCustomerByPhone);

module.exports = router;