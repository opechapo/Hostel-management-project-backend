const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/authMiddleware');


const {createNewRoom,getAllRooms,getRoom,deleteRoom,updateRoom} = require('../controller/roomController');

router.post('/create-room', createNewRoom);
router.get('/',protectAdmin, getAllRooms);
router.get('/:roomId', protectAdmin,getRoom );
router.patch('/update-room/:roomId', protectAdmin,updateRoom );
router.delete('/:roomId', protectAdmin, deleteRoom);


module.exports = router;

