const Student = require('../models/student');
const Attendance = require('../models/attendance'); 
const AttendanceNotes = require('../models/attendanceNote');
const Blog = require('../models/blog');
const { Op } = require('sequelize');
const sequelize = require('../config/db');

exports.getAllAttendance = async (req, res) => {
    try {
        // Get month and year from query parameters, default to current month and year if not provided
        const month = parseInt(req.query.month) || new Date().getMonth() + 1; // Default to current month
        const year = parseInt(req.query.year) || new Date().getFullYear(); // Default to current year

        // Construct the where clause to filter by month and year
        let whereClause = {};
        if (month && month >= 1 && month <= 12 && year) {
            whereClause = sequelize.and(
                sequelize.where(sequelize.fn('MONTH', sequelize.col('AttendanceDate')), month),
                sequelize.where(sequelize.fn('YEAR', sequelize.col('AttendanceDate')), year)
            );
        }

        // Fetch paginated attendance records filtered by month and year
        const { count, rows: allAttendance } = await Attendance.findAndCountAll({
            attributes: [
                'AttendanceDate',
                [sequelize.fn('COUNT', sequelize.col('Attendance.AttendanceID')), 'attendanceCount'],
                [sequelize.col('Student.GroupName'), 'GroupName'],  // Reference the GroupName from the Student model
                [sequelize.fn('SUM', sequelize.literal(`CASE WHEN Attendance.AttendanceStatus = 1 THEN 1 ELSE 0 END`)), 'presentCount']

            ],
            include: [{
                model: Student,  // Join with the Student table
                attributes: []   // Exclude extra attributes from Student
            }],
            where: whereClause,  // Filter by month and year
            group: ['Attendance.AttendanceDate', 'Student.GroupName'],  // Group by AttendanceDate and GroupName
            order: [['AttendanceDate', 'DESC']],  // Order by AttendanceDate in descending order
            offset: 0  // No need for pagination offset for months
        });

        const totalPages = 12;  // Fixed number of pages for months (1-12)

        // Render the attendance page with pagination information
        res.render('attendance/attendances', {
            allAttendance,
            currentPage: month,  // Use month as the current page
            totalPages,  // Total number of months (12)
            month,  // Pass the month to the view (for displaying selected month)
            year  // Pass the year to the view (for displaying selected year)
        });
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ message: 'Failed to retrieve attendance data.' });
    }
};







// Controller to fetch all attendances on a specific date
exports.getAttendanceByDate = async (req, res) => {
    const attendanceDate = req.params.date;  // Get the date from the URL
    console.log('Attendance Date:', attendanceDate);
    const blog = await Blog.findOne({
        where: {
            BlogDate: attendanceDate
        }
    });
    console.log('the blog is: ');
    console.log(blog);    
    console.log('the blog is: ');
    console.log(blog.dataValues.Content);
    
    try {
        const attendanceDetails = await Attendance.findAll({
            where: {
                AttendanceDate: attendanceDate  // Find all records with this date
            },
            include: {
                model: Student, // Assuming you want to include related student data
                attributes: ['StudentID', 'FullName']  // Adjust attributes as needed
            }
        });
        const attendanceNotes = await AttendanceNotes.findAll({
            include: {
                model: Attendance,
                where: {
                    AttendanceDate: attendanceDate,
                }
            }
        });
        console.log("attendance notes are: ");
        console.log(attendanceNotes);
        const NewAttendanceDate = new Date(attendanceDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
});

        res.render('attendance/attendanceDetails', {NewAttendanceDate, attendanceDate, attendanceDetails, blog, attendanceNotes });  // Render the EJS file
    } catch (error) {
        console.error('Error fetching attendance details:', error);
        res.status(500).json({ message: 'Failed to retrieve attendance details.' });
    }
};

exports.todayAttendance = async(req, res) => {
    try {
        // Retrieve filter criteria from the query parameters
        const { group, status } = req.query;

        // Fetch all groups for the dropdown
        const allGroups = await Student.findAll({
            attributes: ['GroupName'],
            group: ['GroupName'] // Ensure we get distinct groups
        });
        const groups = allGroups.map(group => group.GroupName);

        // Build the query with conditions for filtering students
        const whereConditions = {};
        if (group && group !== '') {
            whereConditions.GroupName = group;
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
        res.render('attendance', { students, groups, currentGroup: group || '', currentStatus: status || '' });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'An error occurred while fetching students.' });
    }
};

exports.submitAttendance = async(req, res) => {
    try {
        let { attendance } = req.body; // Get attendance data from the form
        const currentDate = new Date(); // Get current date
        const UserDate = req.body.UserDate; // Get the date from the form
        const selectedDate = UserDate ? UserDate : currentDate; // Use the selected date or current date
        let groupName = req.body.groupName; // Get the group name
        let notes = req.body.note; // Get the notes
        const attendanceBlog = req.body.attendanceBlog; // Get the attendance blog
        console.log("the notes are: ");
        console.log(notes);
        
        console.log("the attendance is: ");
        console.log(attendance);
        attendance = attendance.map(item => Array.isArray(item) ? 'present' : item);
        console.log("the attendance now is: ");
        console.log(attendance);
        console.log("the group name is: " + groupName);
        console.log("the attendance blog is: ");
        console.log(attendanceBlog);
        


        // Find all students in the system
        const allStudents = await Student.findAll({
            where: {
                GroupName: groupName,
                status: 'active'
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
                AttendanceDate: selectedDate,
                AttendanceStatus: isPresent === 'present' ? 'present' : 'absent'
            });
            console.log("attendance created");
            const lastAttendance = await Attendance.findOne({
                where: {
                    StudentID: studentID,
                    AttendanceDate: selectedDate
                }
            });
            console.log("the attendance id is: " );
            console.log(lastAttendance.dataValues.AttendanceID);
            console.log("the notes are: ");
            console.log(notes);
            console.log("the count is: ");
            console.log(count);
            console.log("the note in that count is: ");
            console.log(notes[count]);
            if (notes[count].length > 0) {
                await AttendanceNotes.create({
                AttendanceID: lastAttendance.dataValues.AttendanceID,
                Note: notes[count] || 'No notes provided'
            });
            }

            count++;
        }
        // to be completed
        await Blog.create({
            Content: attendanceBlog,
            BlogDate: selectedDate
        });
        // Redirect to a success or confirmation page after attendance is submitted
        res.redirect('/attendance');
    } catch (error) {
        console.error('Error submitting attendance:', error);
        res.status(500).send('Error submitting attendance');
    }
};