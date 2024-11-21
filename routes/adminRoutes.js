const express = require('express');
const router = express.Router();
const {register, login, getAdmin, getAdmins, updateAdmin} = require('../controller/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/:adminId', protectAdmin, getAdmin);
router.get('/', protectAdmin, getAdmins);
router.patch('/:adminId', protectAdmin, updateAdmin);

module.exports = router;

