// routes/studentRouter.js

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Middleware to parse URL-encoded bodies (for form submissions)
router.use(express.urlencoded({ extended: true }));

// ==================== Attendance Routes ==================== //

// Render the Attendance Page
router.get('/attendance', studentController.getAttendancePage);

// Handle Attendance Submission
router.post('/attendance/submit', studentController.submitAttendance);

// Render Attendance Success Page
router.get('/attendance/success', studentController.getAttendanceSuccess);

// ==================== Student CRUD Routes ==================== //

// Get all students
router.get('/', studentController.getAllStudents);

// Create a new student
router.get('/create', studentController.createStudent);
router.post('/storeStudent', studentController.storeStudent);

// Create related entities (Number, Note, Weightlog, Doc)
router.get('/:studentID/createNumber', studentController.createNumber);
router.get('/:studentID/createNote', studentController.createNote);
router.get('/:studentID/createWeightlog', studentController.createWeightlog);
router.get('/:studentID/createDoc', studentController.createDoc);

router.post('/:studentID/storeNumber', studentController.storeNumber);
router.post('/:studentID/storeNote', studentController.storeNote);
router.post('/:studentID/storeWeightlog', studentController.storeWeightlog);
router.post('/:studentID/storeDoc', studentController.storeDoc);

// Get, Update, and Delete a student
router.get('/:id', studentController.getStudentById);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;