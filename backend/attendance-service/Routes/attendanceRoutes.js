const express = require('express');
const Attendance = require('../model/attendance'); // Adjust the path as necessary
const router = express.Router();
const auth = require('../middleware/auth')
const DailyAttendance = require('../model/DailyAttendance'); // New schema for daily attendance
const { default: mongoose } = require('mongoose');
const { getIo } = require('../socket.io');

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

    // Create a new record in the Attendance model, including employee_name
    const newAttendance = new Attendance({
      employee_id: employeeId,
      employee_name: name, // Add employee_name to the attendance record
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

    // Add employee's check-in details to DailyAttendance, including the name
    dailyAttendance.employees.push({
      employeeId,
      name,
      checkInTime: checkInTime.toISOString(),
    });

    await dailyAttendance.save();

       // Emit a notification to all connected clients
       const io = getIo();
       const notificationMessage = `${name} has checked in`;
       io.emit('notification', notificationMessage);  // Send notification to all clients


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

router.get('/attendance', auth, async (req, res) => {
  try {
    const { start_date, end_date, employee_name } = req.query;  // Get query params for start_date, end_date, or employee_name

    let filter = {};

    // If a start_date and end_date are provided, filter by that date range
    if (start_date && end_date) {
      filter.date = { 
        $gte: new Date(start_date),  // Greater than or equal to start_date
        $lt: new Date(end_date)      // Less than end_date
      };
    }
    // If a specific date is provided, filter by that date
    else if (start_date) {
      filter.date = new Date(start_date); // Filter by the specific date
    }

    // If no date or month is provided, default to today's date
    else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);  // Set the time to the beginning of the day
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);  // Set the end of the day (next day)

      filter.date = { $gte: today, $lt: tomorrow };  // Filter for today's attendance
    }

    // If employee_name is provided, filter attendance by employee name
    if (employee_name) {
      filter.employee_name = { $regex: employee_name, $options: 'i' };  // Case-insensitive search
    }

    // Fetch the attendance records based on the applied filter
    const attendanceRecords = await Attendance.find(filter);

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ message: 'No attendance records found' });
    }

    res.json(attendanceRecords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while fetching attendance', error: err.message });
  }
});


// Route to get the number of check-ins for today
router.get('/attendance/checkInCount', auth, async (req, res) => {
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

// Route to fetch attendance records for the given month
router.get('/attendance/month', async (req, res) => {
  try {
    const { startOfMonth, endOfMonth } = req.query;

    if (!startOfMonth || !endOfMonth) {
      return res.status(400).json({ error: 'Both startOfMonth and endOfMonth are required.' });
    }

    // Fetch attendance records for the given month
    const attendanceRecords = await Attendance.find({
      date: { $gte: new Date(startOfMonth), $lte: new Date(endOfMonth) },
    });

    if (!attendanceRecords.length) {
      return res.status(404).json({ error: 'No attendance records found for the given period.' });
    }

    // Send attendance data with employee details
    res.status(200).json(attendanceRecords.map(record => ({
      employee_id: record.employee_id,
      employee_name: record.employee_name,
      worked_hours: record.worked_hours,
    })));

  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ error: 'Error fetching attendance records.' });
  }
});

// Route to fetch today's attendance data
router.get('/attendance/daily', auth, async (req, res) => {
  try {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

      // Find the daily attendance document for today
      const dailyAttendance = await DailyAttendance.findOne({ date: today });

      if (!dailyAttendance) {
          return res.status(404).send({ message: 'No attendance found for today' });
      }

      // Return the list of employees and their check-in times
      res.status(200).json(dailyAttendance);
  } catch (error) {
      console.error('Error fetching daily attendance:', error);
      res.status(500).send({ error: 'Error fetching daily attendance data', details: error });
  }
});


module.exports = router;
