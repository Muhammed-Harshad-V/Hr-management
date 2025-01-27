const express = require('express');
const http = require('express-http-proxy');
const app = express();
const cors = require('cors')

// Allow credentials and specify allowed origin
app.use(cors({
    origin: 'https://hr-management-7ut0.onrender.com', // Your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers)
  }));
  

app.use('/employeeService' , http('https://hr-management-employee-service.onrender.com'));
app.use('/attendanceService' , http('https://hr-management-attendance-service.onrender.com'));
app.use('/payrollService' , http('https://hr-management-payroll-service.onrender.com'));

app.listen(3000, () => {
    console.log('gateway service is running on 3000')
})