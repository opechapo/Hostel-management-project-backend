const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/authMiddleware');


const {createNewRoom} = require('../controller/roomController');

router.post('/create-room', createNewRoom);

module.exports = router;

