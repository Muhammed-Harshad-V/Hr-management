const express = require('express');
const axios = require('axios'); // Used to call Attendance Service
const Payroll = require('../model/payroll'); // Your Payroll model
const router = express.Router();
const auth = require('../middleware/auth')

// Generate Payroll for an employee
router.post('/payroll/generate', auth, async (req, res) => {
  const { 
    employeeId, 
    month, 
    year, 
    hourlyRate, 
    deductions = [],  // Deductions passed as an array of objects
    bonus = 0          // Optional bonus, defaulting to 0 if not provided
  } = req.body;

  try {
    // Fetch worked hours from the Attendance Service
    const attendanceRecords = await axios.get(`http://attendance-service/employee/${employeeId}`, {
      params: { month, year }  // Pass the month and year to filter attendance records
    });

    if (!attendanceRecords || attendanceRecords.data.length === 0) {
      return res.status(404).json({ error: 'No attendance records found for this employee.' });
    }

    // Calculate the total worked hours for the employee
    let totalWorkedHours = 0;
    attendanceRecords.data.forEach(record => {
      totalWorkedHours += record.worked_hours;
    });

    // Gross salary = worked hours * hourly rate + bonus
    const grossSalary = (totalWorkedHours * hourlyRate) + bonus;

    // Calculate total deductions
    let totalDeductions = 0;
    deductions.forEach(deduction => {
      totalDeductions += deduction.amount;
    });

    // Net salary = gross salary - total deductions
    const netSalary = grossSalary - totalDeductions;

    // Save the payroll record in the database
    const payroll = new Payroll({
      employee_id: employeeId,
      month,
      year,
      gross_salary: grossSalary,
      net_salary: netSalary,
      deductions,  // Store all deductions as an array of objects
      bonuses: bonus,  // Save the bonus amount
    });

    await payroll.save();

    // Return the generated payroll details
    res.status(201).json(payroll);

  } catch (error) {
    console.error('Error generating payroll:', error);
    res.status(500).json({ error: 'Error generating payroll' });
  }
});

// Get payroll for an employee by employee ID (and optionally filter by month/year)
router.get('/payroll/employee/:employeeId', async (req, res) => {
    const { employeeId } = req.params;
    const { month, year } = req.query;  // Optionally get month and year as query params
  
    try {
      let filter = { employee_id: employeeId };
  
      // Add month and year filters if provided
      if (month) filter.month = month;
      if (year) filter.year = year;
  
      // Fetch the payroll records from the database
      const payrollRecords = await Payroll.find(filter);
  
      if (!payrollRecords || payrollRecords.length === 0) {
        return res.status(404).json({ error: 'No payroll records found for this employee.' });
      }
  
      // Return the payroll records
      res.status(200).json(payrollRecords);
  
    } catch (error) {
      console.error('Error fetching payroll records:', error);
      res.status(500).json({ error: 'Error fetching payroll records' });
    }
  });

module.exports = router;
