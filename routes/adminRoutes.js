const express = require('express');
const router = express.Router();
const {register, login, getAdmin, getAdmins, updateAdmin, deleteAdmin,adminLogout} = require('../controller/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/:adminId', protectAdmin, getAdmin);
router.get('/', protectAdmin, getAdmins);
router.patch('/:adminId', protectAdmin, updateAdmin);
router.delete('/:adminId', protectAdmin, deleteAdmin);
router.post('/logout', adminLogout);

module.exports = router;

