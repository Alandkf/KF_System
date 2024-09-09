const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./student');

const WeightLog = sequelize.define('WeightLog', {
    WeightLogID: {
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
        UNSIGNED: true
    },
    Date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    Weight: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        UNSIGNED: true,
    }
}, {
    timestamps: true  // Timestamps added
});

module.exports = WeightLog;