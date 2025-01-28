const express = require('express');
const http = require('express-http-proxy');
const path = require('path');
const app = express();
const cors = require('cors');
require('dotenv').config();
// Set timeout duration (2 minutes = 120,000 milliseconds)
const TIMEOUT = 120000; // 120,000 ms = 2 minutes

// Allow credentials and specify allowed origin
app.use(cors({
    origin: 'https://hr-management-7ut0.onrender.com', // Your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers)
}));

// Serve static files for the dashboard
// Use the correct relative path or absolute path for your build directory
const buildPath = path.join(__dirname, '../../frontend/dist');
console.log('Serving React app from:', buildPath); // Optional: to confirm the correct path
app.use('/dashboard/*', express.static(buildPath));

// Proxy routes with timeout configuration
// app.use('/employeeService', http('https://hr-management-employee-service.onrender.com', {
//   timeout: TIMEOUT // Set timeout to 2 minutes for this service
// }));
// app.use('/attendanceService', http('https://hr-management-attendance-service.onrender.com', {
//   timeout: TIMEOUT // Set timeout to 2 minutes for this service
// }));
// app.use('/payrollService', http('https://hr-management-payroll-service.onrender.com', {
//   timeout: TIMEOUT // Set timeout to 2 minutes for this service
// }));

app.use('/employeeService', http('http://employee-service:3001', {
  timeout: TIMEOUT
}));
app.use('/attendanceService', http('http://attendance-service:3002', {
  timeout: TIMEOUT
}));
app.use('/payrollService', http('http://payroll-service:3003', {
  timeout: TIMEOUT
}));
// Fallback route to serve the React app's index.html for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(3000, () => {
    console.log('Gateway service is running on port 3000');
});
