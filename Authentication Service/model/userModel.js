const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure unique email for each user
        trim: true // Optional: Trim any leading/trailing spaces
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Only 'user' or 'admin' are valid roles
        default: 'user' // Default role is 'user'
    }
});

module.exports = mongoose.model('User', userSchema);
