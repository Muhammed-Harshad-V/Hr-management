const express = require('express');
const http = require('express-http-proxy');
const app = express();
const cors = require('cors');
require('dotenv').config();

const TIMEOUT = 120000;

// Allow credentials and specify allowed origin
app.use(cors({
    origin: 'https://h-yq1e.onrender.com', // Your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers)
}));

app.options('*', cors()); // Explicitly handle OPTIONS requests

app.use('/employeeService', http('employee-service-production-edd9.up.railway.app', {
  timeout: TIMEOUT,
  proxyReqOptDecorator: (proxyReqOpts, req) => {
    // Modify the headers directly in proxyReqOpts
    proxyReqOpts.headers['Access-Control-Allow-Origin'] = 'https://h-yq1e.onrender.com';
    proxyReqOpts.headers['Access-Control-Allow-Credentials'] = 'true';
    return proxyReqOpts;
  }
}));

app.use('/attendanceService', http('attendance-service-production.up.railway.app', {
  timeout: TIMEOUT,
  proxyReqOptDecorator: (proxyReqOpts, req) => {
    // Modify the headers directly in proxyReqOpts
    proxyReqOpts.headers['Access-Control-Allow-Origin'] = 'https://h-yq1e.onrender.com';
    proxyReqOpts.headers['Access-Control-Allow-Credentials'] = 'true';
    return proxyReqOpts;
  }
}));

app.use('/payrollService', http('payroll-production-a39e.up.railway.app', {
  timeout: TIMEOUT,
  proxyReqOptDecorator: (proxyReqOpts, req) => {
    // Modify the headers directly in proxyReqOpts
    proxyReqOpts.headers['Access-Control-Allow-Origin'] = 'https://h-yq1e.onrender.com';
    proxyReqOpts.headers['Access-Control-Allow-Credentials'] = 'true';
    return proxyReqOpts;
  }
}));

app.listen(3000, () => {
    console.log('Gateway service is running on port 3000');
});
