const express = require('express');
const http = require('express-http-proxy');
const path = require('path');
const app = express();
const cors = require('cors');
require('dotenv').config();

const TIMEOUT = 120000; 

// Allow credentials and specify allowed origin
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers)
}));



app.use('/employeeService', http('http://employee-service:3001', {
  timeout: TIMEOUT
}));
app.use('/attendanceService', http('http://attendance-service:3002', {
  timeout: TIMEOUT
}));
app.use('/payrollService', http('http://payroll-service:3003', {
  timeout: TIMEOUT
}));

// app.use('/employeeService', http('http://localhost:3001', {
//   timeout: TIMEOUT
// }));
// app.use('/attendanceService', http('http://localhost:3002', {
//   timeout: TIMEOUT
// }));
// app.use('/payrollService', http('http://localhost:3003', {
//   timeout: TIMEOUT
// }));



app.listen(3000, () => {
    console.log('Gateway service is running on port 3000');
});
