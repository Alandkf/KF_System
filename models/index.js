const sequelize = require('../config/db');

// Import models
const Student = require('./student');
const StudentNote = require('./studentNote');
const StudentNumber = require('./studentNumbers');
const Payment = require('./payment');
const Attendance = require('./attendance');
const AttendanceNotes = require('./attendanceNote');
const WeightLog = require('./weightLog');
const StudentDoc = require('./studentDoc');
const Blog = require('./blog');

// Associations
Student.hasMany(StudentNote, { foreignKey: 'StudentID' });
StudentNote.belongsTo(Student, { foreignKey: 'StudentID' });

Student.hasMany(StudentNumber, { foreignKey: 'StudentID' });
StudentNumber.belongsTo(Student, { foreignKey: 'StudentID' });

Student.hasMany(Payment, { foreignKey: 'StudentID' });
Payment.belongsTo(Student, { foreignKey: 'StudentID' });

Student.hasMany(Attendance, { foreignKey: 'StudentID' });
Attendance.belongsTo(Student, { foreignKey: 'StudentID' });

Attendance.hasMany(AttendanceNotes, { foreignKey: 'AttendanceID' });
AttendanceNotes.belongsTo(Attendance, { foreignKey: 'AttendanceID' });

Attendance.hasMany(Blog, { foreignKey: 'AttendanceID' });
Blog.belongsTo(Attendance, { foreignKey: 'AttendanceID' });

Student.hasMany(WeightLog, { foreignKey: 'StudentID' });
WeightLog.belongsTo(Student, { foreignKey: 'StudentID' });

Student.hasMany(StudentDoc, { foreignKey: 'StudentID' });
StudentDoc.belongsTo(Student, { foreignKey: 'StudentID' });

// Export models and sequelize connection
module.exports = {
    sequelize,
    Student,
    StudentNote,
    StudentNumber,
    Payment,
    Attendance,
    AttendanceNotes,
    WeightLog,
    StudentDoc,
    Blog
};