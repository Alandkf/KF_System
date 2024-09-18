const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// const { all } = require('../app');

const Student = sequelize.define('Student', {
    StudentID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        UNSIGNED: true,
        allowNull: false
    },
    FullName: {
        type: DataTypes.STRING(50), // Reduced length to 30
        allowNull: false
    },
    YearOfBirth: {
        type: DataTypes.SMALLINT, // SMALLINT UNSIGNED to save space
        allowNull: false,
        UNSIGNED: true
    },
    Gender: {
        type: DataTypes.ENUM('male', 'female'), // Consistent case for values
        allowNull: false
    },
    Address: {
        type: DataTypes.STRING(100), // Reduced length to 50
        allowNull: false
    },
    Occupation: {
        type: DataTypes.STRING(50), 
        allowNull: true
    },
    EducationLevel: {   
        type: DataTypes.STRING(50), 
        allowNull: true
    },
    DateOfEnrollment: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    Status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
        allowNull: false
    },
    GroupName: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    timestamps: false, // Added for tracking
});
console.log("====================================");
console.log("here is student model and exported");
module.exports = Student;