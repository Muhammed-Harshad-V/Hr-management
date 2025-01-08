const express = require('express');
const Employee = require('../model/employee'); // Adjust the path as necessary
const router = express.Router();
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs');

// Get all employees
router.get('/employees', auth, async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new employee
router.post('/employees',  async (req, res) => {
    // Destructure request body
    const { name, email, position, department, salary, hireDate, status, password } = req.body;
  
    // Check for missing required fields (including password)
    if (!name || !email || !position || !department || !salary || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      // Check if employee with the same email already exists
      const existingEmployee = await Employee.findOne({ email });
  
      if (existingEmployee) {
        return res.status(400).json({ message: 'Employee with this email already exists' });
      }
  
      // Hash the password using bcrypt
      const salt = await bcrypt.genSalt(10);  // Generate a salt
      const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password
  
      // Create a new Employee document
      const employee = new Employee({
        name,
        email,
        position,
        department,
        salary,
        hireDate: hireDate || Date.now(),  // Default to current date if not provided
        status: status || 'active',  // Default to 'active' if not provided
        password: hashedPassword,  // Store the hashed password
      });
  
      // Save the new employee to the database
      const newEmployee = await employee.save();
  
      // Return the created employee details in the response
      res.status(201).json({
        message: 'Employee created successfully',
        employee: {
          name: newEmployee.name,
          email: newEmployee.email,
          position: newEmployee.position,
          department: newEmployee.department,
          salary: newEmployee.salary,
          hireDate: newEmployee.hireDate,
          status: newEmployee.status,
        },
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating employee', error: err.message });
    }
  });

// Update an employee by ID
router.put('/employees/:id', auth, async (req, res) => {
    try {
        // Find the employee by ID
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Check and update each field if provided in the request body
        if (req.body.name != null) {
            employee.name = req.body.name;
        }
        // if (req.body.email != null) {
        //     // You might want to add some validation here to ensure the email is not already in use
        //     // Don't update email if it's the same (optional, if you're fine with updating the email)
        //     const existingEmail = await Employee.findOne({ email: req.body.email });
        //     if (existingEmail && existingEmail._id.toString() !== req.params.id) {
        //         return res.status(400).json({ message: 'Email already in use by another employee' });
        //     }
        //     employee.email = req.body.email;
        // }
        if (req.body.position != null) {
            employee.position = req.body.position;
        }
        if (req.body.department != null) {
            employee.department = req.body.department;
        }
        if (req.body.salary != null) {
            employee.salary = req.body.salary;
        }
        if (req.body.hireDate != null) {
            // Make sure not to update the hireDate (unless needed)
            employee.hireDate = req.body.hireDate;
        }
        if (req.body.status != null) {
            employee.status = req.body.status;
        }

        // Set the updatedAt timestamp automatically since you're using `timestamps: true` in the schema
        employee.updatedAt = Date.now();

        // Save the updated employee document
        const updatedEmployee = await employee.save();

        // Return the updated employee details
        res.status(200).json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an employee by ID
router.delete('/employees/:id', auth, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await Employee.deleteOne({ _id: req.params.id });
        
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;