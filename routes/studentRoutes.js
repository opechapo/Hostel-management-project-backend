const express = require('express');
const { protectAdmin } = require('../middleware/authMiddleware');
const {registerStudent, getAllStudents, getStudent,updateStudentProfile,changeStudentRoom,updateCheckInStatus,deleteStudent } = require('../controller/StudentController')

const router = express.Router();

router.post('/register-student', protectAdmin, registerStudent);
router.get('/', protectAdmin, getAllStudents);
router.get('/:studentId', protectAdmin, getStudent);
router.patch('/:studentId', protectAdmin, updateStudentProfile);
router.put('/change-room', protectAdmin, changeStudentRoom);
router.post('/check-in-status', protectAdmin, updateCheckInStatus);
router.delete('/delete/:studentId', protectAdmin, deleteStudent);


module.exports = router;

