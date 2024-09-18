const sequelize = require('../config/db');
console.log("====================================");
console.log("here is model/index.js");

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
const PaymentNote = require('./paymentNote');
console.log("models imported");

// Associations
Student.hasMany(StudentNote, { foreignKey: 'StudentID' });
StudentNote.belongsTo(Student, { foreignKey: 'StudentID' });
console.log("student and studentNote associated");

Student.hasMany(StudentNumber, { foreignKey: 'StudentID' });
StudentNumber.belongsTo(Student, { foreignKey: 'StudentID' });
console.log("student and studentNumber associated");

Student.hasMany(Payment, { foreignKey: 'StudentID' });
Payment.belongsTo(Student, { foreignKey: 'StudentID' });
console.log("student and payment associated");

Payment.hasMany(PaymentNote, { foreignKey: 'PaymentID' });
PaymentNote.belongsTo(Payment, { foreignKey: 'PaymentID' });
console.log("payment and paymentNote associated");

Student.hasMany(Attendance, { foreignKey: 'StudentID' });
Attendance.belongsTo(Student, { foreignKey: 'StudentID' });
console.log("student and attendance associated");

Attendance.hasMany(AttendanceNotes, { foreignKey: 'AttendanceID' });
AttendanceNotes.belongsTo(Attendance, { foreignKey: 'AttendanceID' });
console.log("attendance and attendanceNote associated");

Student.hasMany(WeightLog, { foreignKey: 'StudentID' });
WeightLog.belongsTo(Student, { foreignKey: 'StudentID' });
console.log("student and weightLog associated");

Student.hasMany(StudentDoc, { foreignKey: 'StudentID' });
StudentDoc.belongsTo(Student, { foreignKey: 'StudentID' });
console.log("student and studentDoc associated");


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
    Blog,
    PaymentNote
};
console.log("all exported");
