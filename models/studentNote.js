const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./student');

const StudentNote = sequelize.define('StudentNote', {
    NoteID: {
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
            UNSIGNED: true
        },
        allowNull: false,
        UNSIGNED: true
    },
    Note: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    NoteDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false  // Timestamps added
});
console.log("====================================");
console.log("here is student note model and exported");

module.exports = StudentNote;