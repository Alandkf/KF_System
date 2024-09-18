const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Payment = require('./payment');

const PaymentNote = sequelize.define('PaymentNote', {
    PaymentNoteID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        UNSIGNED: true,
        allowNull: false
    },
    PaymentID: {
        type: DataTypes.INTEGER,
        references: {
            model: Payment,
            key: 'PaymentID',
            UNSIGNED: true
        },
        allowNull: false,
        UNSIGNED: true
    },
    PaymentNote: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    timestamps: false  // Timestamps added
});
console.log("====================================");
console.log("here is payment note model and exported");

module.exports = PaymentNote;