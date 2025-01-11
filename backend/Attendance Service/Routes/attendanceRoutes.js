const express = require('express');
const Attendance = require('../model/attendance'); // Adjust the path as necessary
const router = express.Router();
const auth = require('../middleware/auth')
const DailyAttendance = require('../model/DailyAttendance'); // New schema for daily attendance
const eventEmitter = require('events');

// Check-in route
router.post('/attendance/check-in', async (req, res) => {
    try {
        const { employeeId, name } = req.body;

        if (!employeeId || !name) {
            return res.status(400).send({ error: 'Employee ID and name are required' });
        }

        const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
        const checkInTime = new Date().toLocaleTimeString(); // Current time in HH:MM:SS format

        // Find the document for today's attendance
        let dailyAttendance = await DailyAttendance.findOne({ date });

        if (!dailyAttendance) {
            // Create a new daily attendance document if none exists
            dailyAttendance = new DailyAttendance({ date, employees: [] });
        }

        // Check if the employee has already checked in
        const alreadyCheckedIn = dailyAttendance.employees.some(emp => emp.employeeId.toString() === employeeId);
        if (alreadyCheckedIn) {
            return res.status(400).send({ error: 'Employee has already checked in for today' });
        }

        // Add the employee's check-in details
        dailyAttendance.employees.push({
            employeeId,
            name,
            checkInTime,
        });

        await dailyAttendance.save();

        // Notify the frontend via SSE
        eventEmitter.emit('newCheckIn', { employeeId, name, checkInTime });

        res.status(201).send(dailyAttendance); // Send the updated daily attendance record
    } catch (error) {
        console.error('Error during check-in:', error);
        res.status(500).send({ error: 'Error while checking in', details: error });
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


// SSE Endpoint
router.get('/attendance/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const onNewCheckIn = (data) => {
        res.write(`New Check-in\n\n`); // Send the event data to the frontend
    };

    eventEmitter.on('newCheckIn', onNewCheckIn);

    // Remove listener when the client disconnects
    req.on('close', () => {
        eventEmitter.removeListener('newCheckIn', onNewCheckIn);
    });
});

module.exports = router;
