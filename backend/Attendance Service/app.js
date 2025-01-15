const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const attendance = require('./Routes/attendanceRoutes')
const cors = require('cors')
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3002;

// Middleware
// Allow credentials and specify allowed origin
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend's URL
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



// const Attendance = require('./model/attendance');  // Replace with your model file path

// const attendanceData = [
//     {
//       "employee_id": "677f891865dd33581af70929",
//       "date": "2025-01-01T00:00:00.000+00:00",
//       "check_in_time": "2025-01-01T08:00:00.000+00:00",
//       "check_out_time": "2025-01-01T18:00:00.000+00:00",
//       "worked_hours": 10,
//       "createdAt": "2025-01-01T08:00:00.000+00:00",
//       "updatedAt": "2025-01-01T18:00:00.000+00:00",
//       "__v": 0
//     },
//     {
//       "employee_id": "677f891865dd33581af70929",
//       "date": "2025-01-02T00:00:00.000+00:00",
//       "check_in_time": "2025-01-02T08:00:00.000+00:00",
//       "check_out_time": "2025-01-02T18:00:00.000+00:00",
//       "worked_hours": 10,
//       "createdAt": "2025-01-02T08:00:00.000+00:00",
//       "updatedAt": "2025-01-02T18:00:00.000+00:00",
//       "__v": 0
//     },
//     {
//       "employee_id": "677f891865dd33581af70929",
//       "date": "2025-01-03T00:00:00.000+00:00",
//       "check_in_time": "2025-01-03T08:00:00.000+00:00",
//       "check_out_time": "2025-01-03T18:00:00.000+00:00",
//       "worked_hours": 10,
//       "createdAt": "2025-01-03T08:00:00.000+00:00",
//       "updatedAt": "2025-01-03T18:00:00.000+00:00",
//       "__v": 0
//     },
//     {
//       "employee_id": "677f891865dd33581af70929",
//       "date": "2025-01-04T00:00:00.000+00:00",
//       "check_in_time": "2025-01-04T08:00:00.000+00:00",
//       "check_out_time": "2025-01-04T18:00:00.000+00:00",
//       "worked_hours": 10,
//       "createdAt": "2025-01-04T08:00:00.000+00:00",
//       "updatedAt": "2025-01-04T18:00:00.000+00:00",
//       "__v": 0
//     },
//     {
//       "employee_id": "677f891865dd33581af70929",
//       "date": "2025-01-05T00:00:00.000+00:00",
//       "check_in_time": "2025-01-05T08:00:00.000+00:00",
//       "check_out_time": "2025-01-05T18:00:00.000+00:00",
//       "worked_hours": 10,
//       "createdAt": "2025-01-05T08:00:00.000+00:00",
//       "updatedAt": "2025-01-05T18:00:00.000+00:00",
//       "__v": 0
//     },
//     {
//       "employee_id": "677f891865dd33581af70929",
//       "date": "2025-01-06T00:00:00.000+00:00",
//       "check_in_time": "2025-01-06T08:00:00.000+00:00",
//       "check_out_time": "2025-01-06T18:00:00.000+00:00",
//       "worked_hours": 10,
//       "createdAt": "2025-01-06T08:00:00.000+00:00",
//       "updatedAt": "2025-01-06T18:00:00.000+00:00",
//       "__v": 0
//     },
//     {
//       "employee_id": "677f891865dd33581af70929",
//       "date": "2025-01-07T00:00:00.000+00:00",
//       "check_in_time": "2025-01-07T08:00:00.000+00:00",
//       "check_out_time": "2025-01-07T18:00:00.000+00:00",
//       "worked_hours": 10,
//       "createdAt": "2025-01-07T08:00:00.000+00:00",
//       "updatedAt": "2025-01-07T18:00:00.000+00:00",
//       "__v": 0
//     },
//     {
//       "employee_id": "677f891865dd33581af70929",
//       "date": "2025-01-08T00:00:00.000+00:00",
//       "check_in_time": "2025-01-08T08:00:00.000+00:00",
//       "check_out_time": "2025-01-08T18:00:00.000+00:00",
//       "worked_hours": 10,
//       "createdAt": "2025-01-08T08:00:00.000+00:00",
//       "updatedAt": "2025-01-08T18:00:00.000+00:00",
//       "__v": 0
//     },
//     {
//       "employee_id": "677f891865dd33581af70929",
//       "date": "2025-01-09T00:00:00.000+00:00",
//       "check_in_time": "2025-01-09T08:00:00.000+00:00",
//       "check_out_time": "2025-01-09T18:00:00.000+00:00",
//       "worked_hours": 10,
//       "createdAt": "2025-01-09T08:00:00.000+00:00",
//       "updatedAt": "2025-01-09T18:00:00.000+00:00",
//       "__v": 0
//     }
//   ];
  

// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     Attendance.insertMany(attendanceData)
//       .then(result => {
//         console.log('Data inserted successfully:', result);
//         mongoose.disconnect();
//       })
//       .catch(err => {
//         console.error('Error inserting data:', err);
//         mongoose.disconnect();
//       });
//   })
//   .catch(err => {
//     console.error('Database connection error:', err);
//   });
