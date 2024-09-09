const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./student');

const Payment = sequelize.define('Payment', {
    PaymentID: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    StudentID: { 
        type: DataTypes.INTEGER, 
        references: { 
            model: Student, 
            key: 'StudentID' 
        } 
    },
    PaymentDate: { 
        type: DataTypes.DATE 
    },
    AmountPaid: { 
        type: DataTypes.FLOAT 
    },
    month: { 
        type: DataTypes.STRING 
    },
    year: { 
        type: DataTypes.INTEGER 
    }
}, {
    timestamps: false
});

module.exports = Payment;
