const Student = require('../models/student');
const StudentNumber = require('../models/studentNumbers');
const StudentNote = require('../models/studentNote');
const StudentWeightlog = require('../models/weightLog');
const StudentDoc = require('../models/studentDoc');
const Attendance = require('../models/attendance'); // Import Attendance model
const { Op } = require('sequelize');

// Get all students
exports.getAllStudents = async(req, res) => {
    try {
        // Retrieve filter criteria from the query parameters
        const { group, status } = req.query;

        // Fetch all groups for the dropdown
        const allGroups = await Student.findAll({
            attributes: ['Group'],
            group: ['Group'] // Ensure we get distinct groups
        });
        const groups = allGroups.map(group => group.Group);

        // Build the query with conditions for filtering students
        const whereConditions = {};
        if (group && group !== '') {
            whereConditions.Group = group;
        }
        if (status && status !== '') {
            whereConditions.Status = status;
        }

        // Fetch filtered students from the database
        const students = await Student.findAll({
            where: whereConditions
        });

        // Calculate age based on the year of birth
        const currentYear = new Date().getFullYear();
        students.forEach(student => {
            student.Age = currentYear - student.YearOfBirth;
        });

        // Render the view with the filtered students and groups
        res.render('students', { students, groups, currentGroup: group || '', currentStatus: status || '' });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'An error occurred while fetching students.' });
    }
};





// Create a new student form
exports.createStudent = async(req, res) => {
    try {
        const students = await Student.findAll();
        const groups = [...new Set(students.map(student => student.Group))];
        console.log("here the values that goes with the groups");
        console.log("-->" + groups);
        res.render('students/create', { groups });
    } catch (error) {
        console.error('Error rendering create student form:', error);
        res.status(500).json({ error: 'An error occurred while rendering the create student form.' });
    }
};

// Create related entities (Number, Note, Weightlog, Doc)
exports.createNumber = async(req, res) => {
    try {
        const student = await Student.findByPk(req.params.studentID);
        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }
        res.render('students/createNumber', { student });
    } catch (error) {
        console.error("Error rendering createNumber form:", error);
        res.status(500).json({ error: 'An error occurred while rendering the createNumber form.' });
    }
};

exports.createNote = async(req, res) => {
    try {
        const student = await Student.findByPk(req.params.studentID);
        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }
        res.render('students/createNote', { student });
    } catch (error) {
        console.error("Error rendering createNote form:", error);
        res.status(500).json({ error: 'An error occurred while rendering the createNote form.' });
    }
};

exports.createWeightlog = async(req, res) => {
    try {
        const student = await Student.findByPk(req.params.studentID);
        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }
        res.render('students/createWeightlog', { student });
    } catch (error) {
        console.error("Error rendering createWeightlog form:", error);
        res.status(500).json({ error: 'An error occurred while rendering the createWeightlog form.' });
    }
};

exports.createDoc = async(req, res) => {
    try {
        const student = await Student.findByPk(req.params.studentID);
        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }
        res.render('students/createDoc', { student });
    } catch (error) {
        console.error("Error rendering createDoc form:", error);
        res.status(500).json({ error: 'An error occurred while rendering the createDoc form.' });
    }
};

// Store created student and related entities
exports.storeStudent = async(req, res) => {
    try {
        const { FullName, YearOfBirth, Gender, Occupation, EducationLevel, DateOfEnrollment, Status, existingGroup, newGroup } = req.body;

        // Use the existing group if selected, otherwise use the new group
        const group = existingGroup ? existingGroup : newGroup;

        // Create the student
        const newStudent = await Student.create({
            FullName,
            YearOfBirth,
            Gender,
            Occupation,
            EducationLevel,
            DateOfEnrollment,
            Status,
            Group: group // Save the group
        });

        console.log("the current student is: " + newStudent);
        console.log("the current student id is: " + newStudent.StudentID);
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
        res.redirect(` / students / $ { studentId }
                    `);
    } catch (error) {
        console.error("Error saving number:", error);
        res.status(500).json({ message: "An error occurred while saving the number" });
    }
};

exports.storeNote = async(req, res) => {
    try {
        const studentId = req.params.studentID;
        const { Note } = req.body;

        console.log("the student id is: " + studentId);
        console.log("the note is: " + Note);

        await StudentNote.create({
            StudentID: studentId,
            Note: Note
        });

        res.redirect(`/students/${studentId}`);
    } catch (error) {
        console.error("Error saving note:", error);
        res.status(500).json({ message: "An error occurred while saving the note" });
    }
};

exports.storeWeightlog = async(req, res) => {
    try {
        const studentId = req.params.studentID;
        const { Weight, Height, Date } = req.body;

        console.log("the student id is: " + studentId);
        console.log("the weight is: " + Weight);
        console.log("the height is: " + Height);
        console.log("the date is: " + Date);

        await StudentWeightlog.create({
            StudentID: studentId,
            Weight: Weight,
            Height: Height,
            Date: Date
        });

        res.redirect(`/students/${studentId}`);
    } catch (error) {
        console.error("Error saving weight log:", error);
        res.status(500).json({ message: "An error occurred while saving the weight log" });
    }
};

exports.storeDoc = async(req, res) => {
    try {
        const studentId = req.params.studentID;
        const { DocName, DocPath } = req.body;

        console.log("the student id is: " + studentId);
        console.log("the DocName is: " + DocName);
        console.log("the document path is: " + DocPath);

        await StudentDoc.create({
            StudentID: studentId,
            DocName: DocName,
            DocPath: DocPath
        });

        res.redirect(`/students/${studentId}`);
    } catch (error) {
        console.error("Error saving document:", error);
        res.status(500).json({ message: "An error occurred while saving the document" });
    }
};

// Get a student by ID
// exports.getStudentById = async(req, res) => {
//     try {
//         const student = await Student.findByPk(req.params.id);

//         if (!student) {
//             return res.status(404).json({ error: 'Student not found.' });
//         }

//         res.status(200).json(student);
//     } catch (error) {
//         console.error('Error fetching student:', error);
//         res.status(500).json({ error: 'An error occurred while fetching the student.' });
//     }
// };

// Update a student by ID
// exports.updateStudent = async(req, res) => {
//     try {
//         const { id } = req.params;
//         const {
//             FullName,
//             YearOfBirth,
//             Gender,
//             Occupation,
//             EducationLevel,
//             DateOfEnrollment,
//             ProfilePicturePath,
//             PersonalDocumentPath,
//             Status,
//             Group
//         } = req.body;

//         const student = await Student.findByPk(id);
//         if (!student) {
//             return res.status(404).json({ error: 'Student not found.' });
//         }

//         await student.update({
//             FullName,
//             YearOfBirth,
//             Gender,
//             Occupation,
//             EducationLevel,
//             DateOfEnrollment,
//             ProfilePicturePath,
//             PersonalDocumentPath,
//             Status,
//             Group
//         });

//         res.status(200).json(student);
//     } catch (error) {
//         console.error('Error updating student:', error);
//         res.status(500).json({ error: 'An error occurred while updating the student.' });
//     }
// };

// Delete a student by ID
// exports.deleteStudent = async(req, res) => {
//     try {
//         const student = await Student.findByPk(req.params.id);
//         if (!student) {
//             return res.status(404).json({ error: 'Student not found.' });
//         }

//         await student.destroy();
//         res.status(204).json();
//     } catch (error) {
//         console.error('Error deleting student:', error);
//         res.status(500).json({ error: 'An error occurred while deleting the student.' });
//     }
// };

// ==================== Attendance Methods ==================== //

// Render the Attendance Page
exports.getAttendancePage = async(req, res) => {
    try {
        const students = await Student.findAll();
        const groups = [...new Set(students.map(student => student.Group))];

        // Calculate age based on the year of birth
        const currentYear = new Date().getFullYear();
        students.forEach(student => {
            student.Age = currentYear - student.YearOfBirth; // Add 'Age' field to each student object
        });

        res.render('studentsAttendance', { students, groups });
    } catch (error) {
        console.error('Error fetching students for attendance:', error);
        res.status(500).json({ error: 'An error occurred while fetching students for attendance.' });
    }
};

// Handle Attendance Submission
exports.submitAttendance = async(req, res) => {
    try {
        let { attendance } = req.body; // Get attendance data from the form
        const currentDate = new Date(); // Get current date
        let groupName = req.body.groupName; // Get the group name
        console.log("the attendance is: ");
        console.log(attendance);
        attendance = attendance.map(item => Array.isArray(item) ? 'present' : item);
        console.log("the attendance now is: ");
        console.log(attendance);
        console.log("the group name is: " + groupName);


        // Find all students in the system
        const allStudents = await Student.findAll({
            where: {
                Group: groupName
            }
        });
        let count = 0;
        // Iterate over all students to record attendance
        for (const student of allStudents) {
            console.log("the count is: " + count);

            const studentID = student.StudentID;
            const isPresent = attendance[count];
            console.log("the student id is: " + studentID);
            console.log("the isPresent is: ");
            console.log(isPresent === "present" ? "present" : "absent");

            // Record attendance as 'present' or 'absent' based on checkbox value
            await Attendance.create({
                StudentID: studentID,
                Date: currentDate,
                AttendanceStatus: isPresent === 'present' ? 'present' : 'absent'
            });
            count++;
        }
        // Redirect to a success or confirmation page after attendance is submitted
        res.send('success');
    } catch (error) {
        console.error('Error submitting attendance:', error);
        res.status(500).send('Error submitting attendance');
    }
};


// Render Attendance Success Page
exports.getAttendanceSuccess = (req, res) => {
    res.send('attendanceSuccess'); // Ensure you have an EJS view named 'attendanceSuccess.ejs'
};

exports.showStudent = async(req, res) => {
    try {
        const studentID = req.params.studentID;

        // Find student and include related data
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

        // Fetch attendance records for the student
        const attendanceRecords = await Attendance.findAll({
            where: { StudentID: studentID },
            order: [
                ['Date', 'DESC']
            ]
        });

        res.render('students/show', { student, attendanceRecords });
    } catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).json({ error: 'An error occurred while fetching student details.' });
    }
};