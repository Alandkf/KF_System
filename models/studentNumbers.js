const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./student');

const StudentNumber = sequelize.define('StudentNumber', {
    NumberID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        UNSIGNED: true,
        allowNull: false
    },
    StudentID: {
        type: DataTypes.INTEGER,
        references: {
            model: Student,
            key: 'StudentID',
        },
        UNSIGNED: true,
        allowNull: false
    },
    numberType: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    Number: {
        type: DataTypes.STRING(15),
        allowNull: false,
        UNSIGNED: true
    }
}, {
    timestamps: true  // Timestamps added
});

module.exports = StudentNumber;