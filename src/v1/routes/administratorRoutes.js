const { Router } = require('express');
const { createProduct, addProductToBranch, createEmployee, getBranches } = require('../../controllers/administratorController');
const router = Router();

router.post('/createEmployee', createEmployee);
router.post('/createProduct', createProduct);
router.patch('/addProductToBranch', addProductToBranch);
router.get('/getBranchesInfo', getBranches);

module.exports = router;