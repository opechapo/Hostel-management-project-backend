const express = require('express');
const router = express.Router();
const {register} = require('../controller/adminController');

router.post('/register', register);

module.exports = router;

