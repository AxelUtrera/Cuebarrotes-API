const { Router } = require('express');
const { createProduct, addProductToBranch, createEmployee, getBranches, createBranch } = require('../../controllers/administratorController');
const router = Router();
const { verifyToken } = require('../../token/tokenValidation');

router.post('/createEmployee', createEmployee);
router.post('/createProduct', createProduct);
router.patch('/addProductToBranch', addProductToBranch);
router.get('/getBranchesInfo', getBranches);
router.post('/createBranch', verifyToken(['Administrador']), createBranch);

module.exports = router;