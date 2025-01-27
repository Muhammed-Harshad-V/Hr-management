const express = require('express');
const http = require('express-http-proxy');
const app = express();
const cors = require('cors');

// Set timeout duration (2 minutes = 120,000 milliseconds)
const TIMEOUT = 120000; // 120,000 ms = 2 minutes

// Allow credentials and specify allowed origin
app.use(cors({
    origin: 'https://hr-management-7ut0.onrender.com', // Your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers)
}));

// Proxy routes with timeout configuration
app.use('/employeeService', http('https://hr-management-employee-service.onrender.com', {
  timeout: TIMEOUT // Set timeout to 2 minutes for this service
}));
app.use('/attendanceService', http('https://hr-management-attendance-service.onrender.com', {
  timeout: TIMEOUT // Set timeout to 2 minutes for this service
}));
app.use('/payrollService', http('https://hr-management-payroll-service.onrender.com', {
  timeout: TIMEOUT // Set timeout to 2 minutes for this service
}));

app.listen(3000, () => {
    console.log('Gateway service is running on port 3000');
});
