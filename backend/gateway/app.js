const express = require('express');
const http = require('express-http-proxy');
const app = express();
const cors = require('cors')

// Allow credentials and specify allowed origin
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers)
  }));
  

app.use('/employeeService' , http('http://localhost:3001'));
app.use('/attendanceService' , http('http://localhost:3002'));
app.use('/payrollService' , http('http://localhost:3003'));

app.listen(3000, () => {
    console.log('gateway service is running on 3000')
})