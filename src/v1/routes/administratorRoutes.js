const { Router } = require('express');
const { createProduct, addProductToBranch, createEmployee } = require('../../controllers/administratorController');
const router = Router();

router.post('/createEmployee', createEmployee);
router.post('/createProduct', createProduct);
router.patch('/addProductToBranch/:branchName', addProductToBranch);

module.exports = router;