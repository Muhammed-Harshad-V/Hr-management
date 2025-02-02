const express = require('express');
const http = require('express-http-proxy');
const path = require('path');
const app = express();
const cors = require('cors');
require('dotenv').config();

const TIMEOUT = 120000; 

// Allow credentials and specify allowed origin
app.use(cors({
    origin: 'https://h-yq1e.onrender.com', // Your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers)
}));



app.use('/employeeService', http('employee-service-production-edd9.up.railway.app', {
  timeout: TIMEOUT,
  proxyReqOptDecorator: (proxyReq, req) => {
    // Add the CORS headers to the proxied request
    proxyReq.setHeader('Access-Control-Allow-Origin', 'https://h-yq1e.onrender.com');
    proxyReq.setHeader('Access-Control-Allow-Credentials', 'true');
    return proxyReq;
}
}));
app.use('/attendanceService', http('attendance-service-production.up.railway.app', {
  timeout: TIMEOUT,
  proxyReqOptDecorator: (proxyReq, req) => {
    // Add the CORS headers to the proxied request
    proxyReq.setHeader('Access-Control-Allow-Origin', 'https://h-yq1e.onrender.com');
    proxyReq.setHeader('Access-Control-Allow-Credentials', 'true');
    return proxyReq;
}
}));
app.use('/payrollService', http('payroll-production-a39e.up.railway.app', {
  timeout: TIMEOUT,
  proxyReqOptDecorator: (proxyReq, req) => {
    // Add the CORS headers to the proxied request
    proxyReq.setHeader('Access-Control-Allow-Origin', 'https://h-yq1e.onrender.com');
    proxyReq.setHeader('Access-Control-Allow-Credentials', 'true');
    return proxyReq;
}
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
