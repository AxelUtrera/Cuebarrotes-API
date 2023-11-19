const { Router } = require('express');
const { createProduct, addProductToBranch } = require('../../controllers/administratorController');

const router = Router();

router.post('/createProduct', createProduct);
router.patch('/addProductToBranch/:branchName', addProductToBranch);

module.exports = router;