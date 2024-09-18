const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.use(express.urlencoded({ extended: true }));

router.get('/', paymentController.getAllPayments);
router.post('/save', paymentController.savePayment);
console.log("payment controller called");

module.exports = router;