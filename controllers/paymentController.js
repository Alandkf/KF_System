const Student = require('../models/student');
const Payment = require('../models/payment');
const { Op } = require('sequelize');
const sequelize = require('../config/db');
const e = require('express');

let Message = '';
exports.getAllPayments = async (req, res) => {
    const { month, year, category, Message } = req.query; // Get message from query parameters
    console.log("month: " + month);
    console.log("year: " + year);
    console.log("category: " + category);    
    console.log("Message: " + Message); // Log the message
    
    try {
        const queryOptions = {
            attributes: ['FullName', 'StudentID', 'GroupName'],
            include: [{
                model: Payment,
                attributes: ['PaymentDate', 'AmountPaid', 'month', 'year'],
                required: false // Include students even if they have no payments
            }],
            order: [[Payment, 'PaymentDate', 'DESC']]
        };

        // Add filtering if month and year are provided
        if (month) queryOptions.include[0].where = { ...(queryOptions.include[0].where || {}), month };
        if (year) queryOptions.include[0].where = { ...(queryOptions.include[0].where || {}), year };
        if (category) queryOptions.where = { ...(queryOptions.where || {}), GroupName: category }; // Filter by category

        const allStudents = await Student.findAll(queryOptions);

        // Fetch distinct groups for the category filter
        const distinctGroups = await Student.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('GroupName')), 'GroupName']],
            order: [['GroupName', 'ASC']],
            raw: true
        });

        // Pass the Message to the template
        res.render('payment/payments', { allStudents, selectedMonth: month, selectedYear: year, selectedCategory: category, distinctGroups, Message });
    } catch (error) {
        console.error('Error fetching payment data:', error);
        res.status(500).json({ Message: 'Failed to retrieve payment data.' });
    }
};


exports.savePayment = async (req, res) => {
    const { StudentID, PaymentDate, AmountPaid, month, year, CreateOrUpdate } = req.body;
    console.log(req.body);
    console.log("====================================");

    let Message = ''; // Initialize message variable

    // Prepare redirect URL with query parameters
    const redirectUrl = `/payments?month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}&category=${encodeURIComponent(req.body.category)}`;

    try {
        if (CreateOrUpdate === "create") {
            console.log("lets Create");
            await Payment.create({ StudentID, PaymentDate, AmountPaid, month, year });
            Message = 'Payment created successfully!';
        } else {
            console.log("lets Update");
            console.log({ PaymentDate, AmountPaid });
            const [updated] = await Payment.update({ PaymentDate, AmountPaid }, { where: { StudentID, month, year } });
            if (updated) {
                const afterUpdate = await Payment.findOne({ where: { StudentID, month, year } });
                console.log("now this is updated to: ");
                console.log(afterUpdate);
                Message = 'Payment updated successfully!';
            } else {
                Message = 'Payment not found for update.';
                res.redirect(`${redirectUrl}&Message=${encodeURIComponent(Message)}`);
                return;
            }
        }
        res.redirect(`${redirectUrl}&Message=${encodeURIComponent(Message)}`);
    } catch (error) {
        console.error('Error handling payment:', error);
        Message = 'Failed to process payment.';
        res.redirect(`${redirectUrl}&Message=${encodeURIComponent(Message)}`);
    }
}

