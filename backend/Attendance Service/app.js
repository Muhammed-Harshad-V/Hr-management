const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const attendance = require('./Routes/attendanceRoutes')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const faker = require('@faker-js/faker');
const Attendance = require('./model/attendance'); // Adjust the path as necessary
const DailyAttendance = require('./model/DailyAttendance')
const app = express();
const port = process.env.PORT || 3002;

// Middleware
// Allow credentials and specify allowed origin
app.use(cors({
    origin: 'https://hr-management-gateway.onrender.com', // Your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers)
  }));

app.use(cookieParser()); 
app.use(bodyParser.json());
app.use('/', attendance)


// MongoDB connection
const dbURI = process.env.MURL;
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Connect to MongoDB shell or use a MongoDB client like MongoDB Compass




// // Function to generate attendance data for the month of January 2025 for 5 employees
// const generateAttendanceData = async () => {
//     const employees = [
//       { id: new mongoose.Types.ObjectId(), name: "Alice Johnson" },
//       { id: new mongoose.Types.ObjectId(), name: "Bob Smith" },
//       { id: new mongoose.Types.ObjectId(), name: "Charlie Brown" },
//       { id: new mongoose.Types.ObjectId(), name: "David Wilson" },
//       { id: new mongoose.Types.ObjectId(), name: "Emma Davis" },
//     ];
  
//     const startDate = new Date("2025-01-01");
//     const endDate = new Date("2025-01-31");
  
//     for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
//       // Generate attendance for each employee for the given date
//       for (let employee of employees) {
//         const checkInTime = new Date(date);
//         checkInTime.setHours(8 + Math.floor(Math.random() * 2)); // Random check-in time between 8:00 AM and 9:00 AM
//         checkInTime.setMinutes(Math.floor(Math.random() * 60));
  
//         const checkOutTime = new Date(date);
//         checkOutTime.setHours(16 + Math.floor(Math.random() * 3)); // Random check-out time between 4:00 PM and 6:00 PM
//         checkOutTime.setMinutes(Math.floor(Math.random() * 60));
  
//         // Create an attendance document
//         const attendanceRecord = new Attendance({
//           employee_id: employee.id,
//           employee_name: employee.name,
//           date: new Date(date),
//           check_in_time: checkInTime,
//           check_out_time: checkOutTime,
//           worked_hours: 0, // The worked_hours will be calculated automatically by the pre-save hook
//         });
  
//         // Save the attendance record
//         await attendanceRecord.save();
//         console.log(`Attendance saved for ${employee.name} on ${date.toLocaleDateString()}`);
//       }
//     }
//     console.log("Attendance data generation complete.");
//   };
  
//   // Call the function to generate and insert data
//   generateAttendanceData().catch(err => {
//     console.error("Error generating data:", err);
//   });

// Create some dummy data for today's check-ins
const createDummyData = async () => {
    const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
  
    const  dummyEmployees = [
      {
        employeeId: new mongoose.Types.ObjectId(), // Generate a dummy ObjectId
        name: "John Doe",
        checkInTime: new Date().toISOString(),
      },
      {
        employeeId: new  mongoose.Types.ObjectId(),
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