// routes/studentRouter.js

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Middleware to parse URL-encoded bodies (for form submissions)
router.use(express.urlencoded({ extended: true }));

router.get('/create', studentController.createStudent);
router.post('/storeStudent', studentController.storeStudent);
router.get('/:studentID', studentController.showStudent);

router.put('/:studentID/changeStatus', studentController.changeStatus);

router.post('/:studentID/storeNumber', studentController.storeNumber);
router.post('/:studentID/storeNote', studentController.storeNote);
router.post('/:studentID/storeWeightlog', studentController.storeWeightlog);
router.post('/:studentID/storeDoc', studentController.storeDoc);

// Get, Update, and Delete a student
// router.get('/:id', studentController.getStudentById);
// router.put('/:id', studentController.updateStudent);
// router.delete('/:id', studentController.deleteStudent);

module.exports = router;