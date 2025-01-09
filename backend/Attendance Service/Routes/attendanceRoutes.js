const express = require('express');
const Attendance = require('../model/attendance'); // Adjust the path as necessary
const router = express.Router();
const auth = require('../middleware/auth')

// Check-in route
router.post('/attendance/check-in', async (req, res) => {
    try {
        const { employeeId } = req.body;
        const date = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        const checkInTime = new Date();

        // Check if attendance for this employee already exists for today
        const existingAttendance = await Attendance.findOne({ employee_id: employeeId, date });

        if (existingAttendance && existingAttendance.check_in_time) {
            return res.status(400).send({ error: 'Employee has already checked in for today' });
        }

        // Create a new attendance record
        const attendance = new Attendance({
            employee_id: employeeId,
            date,
            check_in_time: checkInTime,
        });
        await attendance.save();

        res.status(201).send(attendance); // Send back the attendance record
    } catch (error) {
        res.status(400).send({ error: 'Error while checking in', details: error });
    }
});

// Check-out route (update check-out time)
router.post('/attendance/check-out', async (req, res) => {
    try {
        const { employeeId } = req.body;
        const date = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        const checkOutTime = new Date();

        // Find the attendance record for this employee on this date where check-out time is null
        const attendance = await Attendance.findOne({ employee_id: employeeId, date, check_out_time: null });

        if (!attendance) {
            return res.status(404).send({ error: 'Attendance record not found or already checked-out' });
        }

        // Update the check-out time and calculate worked hours
        attendance.check_out_time = checkOutTime;
        await attendance.save();

        res.send(attendance); // Send back the updated attendance record
    } catch (error) {
        res.status(400).send({ error: 'Error while checking out', details: error });
    }
});

// Get attendance by employee ID
router.get('/employee/:employeeId', auth, async (req, res) => {
    try {
        const { employeeId } = req.params;
        const attendanceRecords = await Attendance.find({ employee_id: employeeId });

        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).send({ error: 'No attendance records found' });
        }

        res.send(attendanceRecords); // Send all attendance records for the employee
    } catch (error) {
        res.status(400).send({ error: 'Error fetching attendance records', details: error });
    }
});

module.exports = router;
