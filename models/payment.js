const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./student');

const Payment = sequelize.define('Payment', {
    PaymentID: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
        UNSIGNED: true
    },
    StudentID: { 
        type: DataTypes.INTEGER, 
        references: { 
            model: Student, 
            key: 'StudentID' 
        } 
    },
    PaymentDate: { 
        type: DataTypes.DATEONLY
    },
    AmountPaid: { 
        type: DataTypes.FLOAT,
        UNSIGNED: true,
        allowNull: false
    },
month: { 
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: {
        min: 1,
        max: 12
    }
},
year: { 
    type: DataTypes.SMALLINT,
    allowNull: false
},
}, {
    timestamps: false
});
console.log("====================================");
console.log("here is payment model and exported");

module.exports = Payment;
