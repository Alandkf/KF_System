const Student = require('../models/student');
const StudentNumber = require('../models/studentNumbers');
const StudentNote = require('../models/studentNote');
const StudentWeightlog = require('../models/weightLog');
const StudentDoc = require('../models/studentDoc');
const Attendance = require('../models/attendance'); // Import Attendance model
const AttendanceNote = require('../models/attendanceNote'); // Import AttendanceNote model
const Payment = require('../models/payment'); // Import Payment model
const { Op } = require('sequelize');

// Create a new student form
exports.createStudent = async(req, res) => {
    try {
        const students = await Student.findAll();
        const groups = [...new Set(students.map(student => student.GroupName))];
        console.log("here the values that goes with the groups");
        console.log("-->" + groups);
        res.render('students/create', { groups });
    } catch (error) {
        console.error('Error rendering create student form:', error);
        res.status(500).json({ error: 'An error occurred while rendering the create student form.' });
    }
};

exports.changeStatus = async (req, res) => {
    try {
        console.log("called from the backend");
        
        const studentID = req.params.studentID;
        const { status } = req.body;
        // Update student status
        await Student.update({ Status: status }, { where: { StudentID: studentID } });
        res.send('success');
    } catch (error) {
        console.error('Error updating student status:', error);
        res.status(500).json({ error: 'An error occurred while updating student status.' });
    }
}



// Store created student and related entities
exports.storeStudent = async (req, res) => {
    try {
        const { FullName, YearOfBirth, Gender, Occupation, EducationLevel, DateOfEnrollment, Status, existingGroup, newGroup, Address } = req.body;

        // Use the existing group if selected, otherwise use the new group
        const group = existingGroup ? existingGroup : newGroup;

        // Create the student with the new address field
        const newStudent = await Student.create({
            FullName,
            YearOfBirth,
            Gender,
            Occupation,
            EducationLevel,
            DateOfEnrollment,
            Status,
            GroupName: group, // Save the group
            Address // Save the address
        });

        console.log("the current student is: " + newStudent);
        console.log("the current student id is: " + newStudent.StudentID);

        // Redirect or send response after successful creation
        res.redirect(`/students/${newStudent.StudentID}`);
    } catch (error) {
        console.error("Error storing student:", error);
        res.status(500).json({ error: 'An error occurred while storing the student.' });
    }
};


exports.storeNumber = async(req, res) => {
    try {
        const studentId = req.params.studentID;
        const { numberType, Number } = req.body;

        // Validate input
        if (!studentId || !numberType || !Number) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Create the number
        await StudentNumber.create({
            StudentID: studentId,
            numberType: numberType,
            Number: Number
        });

        console.log("the current student id is: " + studentId);
        res.redirect(`/students/${ studentId }`);
    } catch (error) {
        console.error("Error saving number:", error);
        res.status(500).json({ message: "An error occurred while saving the number" });
    }
};

exports.storeNote = async(req, res) => {
    try {
        const studentId = req.params.studentID;
        const { Note } = req.body;
        const { NoteDate } = req.body;
        console.log("the student id is: " + studentId);
        console.log("the note is: " + Note);
        console.log("the note date is: " + NoteDate);

        await StudentNote.create({
            StudentID: studentId,
            Note: Note,
            NoteDate: NoteDate || new Date().toISOString().split('T')[0]
        });

        res.redirect(`/students/${ studentId }`);
    } catch (error) {
        console.error("Error saving note:", error);
        res.status(500).json({ message: "An error occurred while saving the note" });
    }
};

exports.storeWeightlog = async(req, res) => {
    try {
        const studentId = req.params.studentID;
        const { Weight, WeightDate } = req.body;

        console.log("the student id is: " + studentId);
        console.log("the weight is: " + Weight);
        console.log("the date is: " + WeightDate);

        await StudentWeightlog.create({
            StudentID: studentId,
            Weight: Weight,
            WeightDate: WeightDate || new Date().toISOString().split('T')[0]
        });

        res.redirect(`/students/${ studentId }`);
    } catch (error) {
        console.error("Error saving weight log:", error);
        res.status(500).json({ message: "An error occurred while saving the weight log" });
    }
};

exports.storeDoc = async(req, res) => {
    try {
        const studentId = req.params.studentID;
        console.log(req.body);
        const { DocName, DocPath } = req.body;
        
        console.log("the student id is: " + studentId);
        console.log("the DocName is: " + DocName);
        console.log("the document path is: " + DocPath);

        await StudentDoc.create({
            StudentID: studentId,
            DocName: DocName,
            DocPath: DocPath
        });

        res.redirect( `/students/${studentId}`);
    } catch (error) {
        console.error("Error saving document:", error);
        res.status(500).json({ message: "An error occurred while saving the document" });
    }
};


exports.showStudent = async (req, res) => {
    try {
        const studentID = req.params.studentID;
        
        // Get the requested month and year from query params (default to current month and year)
        const month = parseInt(req.query.month) || new Date().getMonth() + 1; // Months are 0-indexed in JS
        const year = parseInt(req.query.year) || new Date().getFullYear();

        // Calculate start and end dates for the month
        const startDate = new Date(year, month - 1, 1); // Start of the month
        const endDate = new Date(year, month, 0); // End of the month

        // Find student and related data
        const student = await Student.findByPk(studentID, {
            include: [
                { model: StudentDoc, as: 'StudentDocs' },
                { model: StudentNote, as: 'StudentNotes' },
                { model: StudentNumber, as: 'StudentNumbers' },
                { model: StudentWeightlog, as: 'WeightLogs' },
            ]
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        // Fetch attendance records for the student, filtered by the selected month and year
        const attendanceRecords = await Attendance.findAll({
            where: {
                StudentID: studentID,
                AttendanceDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [['AttendanceDate', 'DESC']]
        });

        // Fetch corresponding attendance notes
        const attendanceNoteRecords = await AttendanceNote.findAll({
            where: { AttendanceID: attendanceRecords.map(record => record.AttendanceID) }
        });

        // Payment records (you already have pagination logic for payments)
        const { count: totalPayments, rows: paymentRecords } = await Payment.findAndCountAll({
            where: { StudentID: studentID },
            order: [['PaymentDate', 'DESC']],
            limit: 12,
            offset: (parseInt(req.query.page || 1) - 1) * 12
        });

        const totalPages = Math.ceil(totalPayments / 12);

        res.render('students/show', {
            student,
            attendanceRecords,
            attendanceNoteRecords,
            paymentRecords,
            currentPage: month,
            totalPages,
            year
        });
    } catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).json({ error: 'An error occurred while fetching student details.' });
    }
};
