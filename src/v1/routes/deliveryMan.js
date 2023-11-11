const { Router } = require('express');
const { getAllUsers} = require('../../controllers/customerController');

const router = Router();

router.get('/', getAllUsers);

module.exports = router;