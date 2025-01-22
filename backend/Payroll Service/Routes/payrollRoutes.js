const express = require('express');
const axios = require('axios'); // Used to call Attendance Service
const moment = require('moment');
const Payroll = require('../model/payroll'); // Your Payroll model
const router = express.Router();
const auth = require('../middleware/auth')


// Generate Payroll for all employees based on attendance data from Attendance Service
router.post('/payroll/generate', auth, async (req, res) => {
  const { month, year, hourlyRate, deductions = [], bonus = 0 } = req.body;

  try {
    // Calculate the start and end of the month based on the provided month and year
    const startOfMonth = moment().month(month - 1).year(year).startOf('month').toDate();
    const endOfMonth = moment().month(month - 1).year(year).endOf('month').toDate();

    // Fetch attendance records for the given month from Attendance Service
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication token missing.' });
    }

    // Fetch all attendance records for the given month from Attendance Service
    const attendanceResponse = await axios.get('http://localhost:3000/attendanceService/attendance/month', {
      params: { startOfMonth, endOfMonth },
      headers: {
        Authorization: `Bearer ${token}`,  // Send the token as Bearer token in Authorization header
      }
    });

    if (!attendanceResponse.data || attendanceResponse.data.length === 0) {
      return res.status(404).json({ error: 'No attendance records found for the given period.' });
    }

    const attendanceRecords = attendanceResponse.data;

    // Group attendance records by employee_id
    const groupedAttendance = attendanceRecords.reduce((acc, record) => {
      const employeeId = record.employee_id.toString();
      if (!acc[employeeId]) acc[employeeId] = {
        employee_name: record.employee_name, // Directly include employee_name
        totalWorkedHours: 0
      };
      acc[employeeId].totalWorkedHours += record.worked_hours;
      return acc;
    }, {});

    // Generate payroll for each employee, but only create one record per employee per month
    const payrollRecords = [];

    for (const employeeId in groupedAttendance) {
      const { employee_name, totalWorkedHours } = groupedAttendance[employeeId];

      // Check if the payroll already exists for this employee in the given month and year
      const existingPayroll = await Payroll.findOne({
        employee_id: employeeId,
        month: month,
        year: year
      });

      if (existingPayroll) {
        // If payroll exists, skip creating a new one
        console.log(`Payroll already generated for employee ${employee_name} for the month ${month}/${year}`);
        continue;
      }

      // Gross salary = worked hours * hourly rate + bonus
      const grossSalary = (totalWorkedHours * hourlyRate) + bonus;

      // Calculate total deductions
      let totalDeductions = 0;
      deductions.forEach(deduction => {
        totalDeductions += deduction.amount;
      });

      // Net salary = gross salary - total deductions
      const netSalary = grossSalary - totalDeductions;

      // Save the payroll record for this employee
      const payroll = new Payroll({
        employee_id: employeeId,
        employee_name,
        month,
        year,
        gross_salary: grossSalary,
        net_salary: netSalary,
        deductions,
        bonuses: bonus,
        status: 'pending', // default status
      });

      await payroll.save();
      payrollRecords.push(payroll);
    }

    // Return the generated payroll details for all employees
    res.status(201).json({ message: 'Payroll generated successfully.', payrollRecords });

  } catch (error) {
    console.error('Error generating payroll:', error);
    res.status(500).json({ error: 'Error generating payroll' });
  }
});

// Get payroll records with optional filters for employee, month, year
router.get('/payroll', auth, async (req, res) => {
  try {
    const { month, year, employee_name } = req.query;

    let filter = {};

    // Filter by month and year
    if (month && year) {
      filter.month = parseInt(month);
      filter.year = parseInt(year);
    }

    // Filter by employee_name (case-insensitive)
    if (employee_name) {
      filter.employee_name = { $regex: employee_name, $options: 'i' };
    }

    // Fetch payroll records based on filter
    const payrollRecords = await Payroll.find(filter);

    if (payrollRecords.length === 0) {
      return res.status(404).json({ message: 'No payroll records found for the given criteria' });
    }

    res.json(payrollRecords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while fetching payroll records', error: err.message });
  }
});

// Get specific payroll by ID
router.get('/payroll/:id', auth, async (req, res) => {
  const { id } = req.params; // Get payroll ID from URL parameter

  try {
    // Fetch the payroll record by ID
    const payroll = await Payroll.findById(id);

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found.' });
    }

    res.json(payroll);
  } catch (error) {
    console.error('Error fetching payroll by ID:', error);
    res.status(500).json({ message: 'Error fetching payroll record.', error: error.message });
  }
});

// Update specific payroll by ID (only status change)
router.put('/payroll/:id', auth, async (req, res) => {
  const { id } = req.params; // Get payroll ID from URL parameter
  const { status } = req.body; // Get the new status from request body

  // Ensure the status is valid
  if (!['pending', 'processed', 'paid', 'failed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    // Find the payroll record by ID
    const payroll = await Payroll.findById(id);

    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found.' });
    }

    // Update the status
    payroll.status = status;

    // Save the updated payroll record
    await payroll.save();

    res.json({ message: 'Payroll status updated successfully.', payroll });
  } catch (error) {
    console.error('Error updating payroll status:', error);
    res.status(500).json({ message: 'Error updating payroll status.', error: error.message });
  }
});

module.exports = router;
