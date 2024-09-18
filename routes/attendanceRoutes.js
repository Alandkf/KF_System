const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.use(express.urlencoded({ extended: true }));

router.get('/',attendanceController.getAllAttendance);
router.get('/today', attendanceController.todayAttendance);
router.get('/:date', attendanceController.getAttendanceByDate);
// router.get('/attendance/success', studentController.getAttendanceSuccess);

router.post('/submit', attendanceController.submitAttendance);
module.exports = router;