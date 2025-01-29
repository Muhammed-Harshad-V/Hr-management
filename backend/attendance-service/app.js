const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const attendance = require('./Routes/attendanceRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Attendance = require('./model/attendance'); // Adjust the path as necessary
const DailyAttendance = require('./model/DailyAttendance');
const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // Allow credentials (cookies, authorization headers)
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use('/', attendance);

// MongoDB connection
const dbURI = process.env.MURL 
// || 'mongodb://localhost:27017/attendance-service';
console.log({ dbURI }); // Log the URI to check if it's loaded properly
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);  // Exit if MongoDB connection fails
    });

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Create some dummy data for today's check-ins
const createDummyData = async () => {
    const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

    const dummyEmployees = [
        {
            employeeId: new mongoose.Types.ObjectId(), // Generate a dummy ObjectId
            name: "John Doe",
            checkInTime: new Date().toISOString(),
        },
        {
            employeeId: new mongoose.Types.ObjectId(),
            name: "Jane Smith",
            checkInTime: new Date(new Date().getTime() - 60 * 60 * 1000).toISOString(), // 1 hour ago
        },
        {
            employeeId: new mongoose.Types.ObjectId(),
            name: "Alice Johnson",
            checkInTime: new Date(new Date().getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        },
    ];

    // Create or update the DailyAttendance entry for today
    const dailyAttendance = await DailyAttendance.findOne({ date });

    if (!dailyAttendance) {
        const newDailyAttendance = new DailyAttendance({
            date,
            employees: dummyEmployees,
        });
        await newDailyAttendance.save();
        console.log('Dummy data inserted successfully!');
    } else {
        // If daily attendance already exists, update it
        dailyAttendance.employees = [...dailyAttendance.employees, ...dummyEmployees];
        await dailyAttendance.save();
        console.log('Dummy data updated successfully!');
    }
};

// Run the function to insert the dummy data
createDummyData().catch(err => console.error('Error inserting dummy data:', err));
