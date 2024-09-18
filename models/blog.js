const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Blog = sequelize.define('Blog', {
    BlogID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        UNSIGNED: true
    },
    Content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    BlogDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    timestamps: false
});
console.log("====================================");
console.log("here is blog model and exported");

module.exports = Blog;