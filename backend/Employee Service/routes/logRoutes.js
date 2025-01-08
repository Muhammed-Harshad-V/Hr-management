const express = require('express');
const Employee = require('../model/employee'); // Adjust the path as necessary
const router = express.Router();
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const employee = await Employee.findOne({ email }).select('+password');
        console.log('Provided password:', password);   // Provided by the user
        console.log('Stored password hash:', employee.password); // Stored in the database

        if (!employee) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, employee.password);

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

        // Set the token in a cookie
        res.cookie('token', token);

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