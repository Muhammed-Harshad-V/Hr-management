const express = require('express');
const Attendance = require('../model/attendance'); // Adjust the path as necessary
const router = express.Router();
const auth = require('../middleware/auth')
const DailyAttendance = require('../model/DailyAttendance'); // New schema for daily attendance
const eventEmitter = require('events');


// Check-in Route
router.post('/attendance/check-in', async (req, res) => {
    try {
      const { employeeId, name } = req.body;
  
      if (!employeeId || !name) {
        return res.status(400).send({ error: 'Employee ID and name are required' });
      }
  
      const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
      const checkInTime = new Date(); // Current date-time object
  
      // Check if the employee has already checked in for today in the Attendance model
      const existingAttendance = await Attendance.findOne({ employee_id: employeeId, date });
  
      if (existingAttendance) {
        return res.status(400).send({ error: 'Employee has already checked in for today' });
      }
  
      // Create a new record in the Attendance model
      const newAttendance = new Attendance({
        employee_id: employeeId,
        date,
        check_in_time: checkInTime,
      });
  
      await newAttendance.save();
  
      // Update the DailyAttendance model
      let dailyAttendance = await DailyAttendance.findOne({ date });
  
      if (!dailyAttendance) {
        // Create a new daily attendance document if none exists
        dailyAttendance = new DailyAttendance({ date, employees: [] });
      }
  
      // Check if the employee has already checked in in DailyAttendance
      const alreadyCheckedIn = dailyAttendance.employees.some(
        (emp) => emp.employeeId.toString() === employeeId
      );
  
      if (alreadyCheckedIn) {
        return res.status(400).send({ error: 'Employee has already checked in for today' });
      }
  
      // Add employee's check-in details to DailyAttendance
      dailyAttendance.employees.push({
        employeeId,
        name,
        checkInTime: checkInTime.toISOString(),
      });
  
      await dailyAttendance.save();
  
      // Notify the frontend via SSE
      eventEmitter.emit('newCheckIn', { employeeId, name, checkInTime });
  
      res.status(201).send({ message: 'Check-in successful', attendance: newAttendance });
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
router.get('/attendance/events', auth, (req, res) => {
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

// Route to get the number of check-ins for today
router.get('/attendance/check-in-count', auth, async (req, res) => {
    try {
        const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
        const dailyAttendance = await DailyAttendance.findOne({ date });

        if (!dailyAttendance) {
            return res.status(200).send({ checkInCount: 0 }); // No check-ins for today
        }

        const checkInCount = dailyAttendance.employees.length; // Count of employees checked in
        res.status(200).send({ checkInCount });
    } catch (error) {
        console.error('Error fetching check-in count:', error);
        res.status(500).send({ error: 'Failed to fetch check-in count' });
    }
});

module.exports = router;
