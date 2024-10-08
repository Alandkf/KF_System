const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Attendance = require('./attendance');

const AttendanceNotes = sequelize.define('AttendanceNotes', {
  NoteID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  AttendanceID: {
    type: DataTypes.INTEGER,
    references: {
      model: Attendance,
      key: 'AttendanceID'
    }
  },
  Note: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: false
});
console.log("====================================");
console.log("here is attendance note model and exported");

module.exports = AttendanceNotes;
