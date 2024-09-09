const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Attendance = require('./attendance');

const Blog = sequelize.define('Blog', {
    BlogID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        UNSIGNED: true
    },
    Title: {
        type: DataTypes.STRING(25),
        allowNull: false,

    },
    Content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    AttendanceID: {
        type: DataTypes.INTEGER,
        references: {
            model: Attendance,
            key: 'AttendanceID'
        }
    }
}, {
    timestamps: false
});

module.exports = Blog;