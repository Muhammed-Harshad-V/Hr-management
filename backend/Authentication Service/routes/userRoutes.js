const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../model/userModel');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;  // role is part of the request body
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before storing it
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hash, role: role || 'user' });  // Default role is 'user'

        await newUser.save();

        // Sign the JWT token including the user id, role, username, and email
        const token = jwt.sign(
            { 
                id: newUser._id,
                role: newUser.role,
                name: newUser.name,  // Add username
                email: newUser.email  // Add email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set the token in a cookie
        res.cookie('token', token);

        // Remove the password from the response
        delete newUser._doc.password;

        res.send({ token, newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Sign the JWT token including the user id, role, username, and email
        const token = jwt.sign(
            { 
                id: user._id,
                role: user.role,
                name: user.name,  // Add username
                email: user.email  // Add email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Remove the password from the response
        delete user._doc.password;

        // Set the token in a cookie
        res.cookie('token', token);

        res.send({ token, user });
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
