const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const http = require('http');
const {initSocket} = require('./socket.io')


// Import your routes and models
const attendance = require('./Routes/attendanceRoutes');
const Attendance = require('./model/attendance');
const DailyAttendance = require('./model/DailyAttendance');
const {initializeRabbitMQ} = require('./utils/rabbitmq')

const app = express();
const server = http.createServer(app);  // Create HTTP server

  // Initialize Socket.IO with the Express server
  initSocket(server);

const port = process.env.PORT || 3002;


app.use(cookieParser());
app.use(bodyParser.json());
app.use('/', attendance);  // Your routes for handling attendance

// MongoDB connection
const dbURI = process.env.MURL;
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Exit if MongoDB connection fails
  });




// Start the server (Express + Socket.IO)
server.listen(port, () => {
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
