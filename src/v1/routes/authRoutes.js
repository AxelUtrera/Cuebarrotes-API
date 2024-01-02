const express = require('express');
const router = express.Router();
const { login, getRole } = require('../../controllers/loginController');

router.post('/login', login);
router.get('/role', getRole);


module.exports = router;
