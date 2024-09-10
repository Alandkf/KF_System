const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./student');

const Attendance = sequelize.define('Attendance', {
    AttendanceID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    StudentID: {
        type: DataTypes.INTEGER,
        references: { model: Student, key: 'StudentID' }
    },
    Date: {
        type: DataTypes.DATE
    },
    AttendanceStatus: {
        type: DataTypes.ENUM('Present', 'Absent')
    }
}, {
    timestamps: false
});

module.exports = Attendance;