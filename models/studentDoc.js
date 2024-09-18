const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./student');

const StudentDoc = sequelize.define('StudentDoc', {
    DocID: {
        type: DataTypes.INTEGER,  // UNSIGNED for saving space
        primaryKey: true,
        autoIncrement: true,
        UNSIGNED: true,
        allowNull: false
    },
    StudentID: {
        type: DataTypes.INTEGER,
        references: {
            model: Student,
            key: 'StudentID'
        },
        allowNull: false,
        UNSIGNED: true        
    },
    DocName: {
        type: DataTypes.STRING(50),
        allowNull: false,        
    },
    DocPath: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    timestamps: false  // Timestamps added
});
console.log("====================================");
console.log("here is student doc model and exported");

module.exports = StudentDoc;