const express = require('express');
const Employee = require('../model/employee'); // Adjust the path as necessary
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const employee = await Employee.findOne({ email }).select('+password');


        if (!employee) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the hashed password
        // const isMatch = await bcrypt.compare(password, employee.password);
        const isMatch = await employee.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Sign the JWT token including the employee id, role, name, and email
        const token = jwt.sign(
            { 
                id: employee._id,
                role: employee.position,
                name: employee.name,  // Add name
                email: employee.email  // Add email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Remove the password from the response
        delete employee._doc.password;

        res.cookie('token', token, {
            httpOnly: true, // Prevents JS access to the cookie
            secure: false,  // Set to `true` in production with HTTPS
            sameSite: 'Strict', // Prevents CSRF
          });

        res.send({ token, employee });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Logout Route
router.get('/logout', async (req, res) => {
    try {
        res.clearCookie('token');
        res.send({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;