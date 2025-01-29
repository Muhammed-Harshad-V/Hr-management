const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const employeeRouter = require('./routes/employeesRotes')
const leaveRequest = require('./routes/LeaveRoutes')
const LogRoutes = require('./routes/logRoutes')
const cors = require('cors')
const cookieParser = require('cookie-parser');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3001;

// Allow credentials and specify allowed origin
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers)
  }));

app.use(cookieParser()); 
app.use(bodyParser.json());
app.use('/', employeeRouter)
app.use('/', leaveRequest)
app.use('/', LogRoutes)


// MongoDB connection
const dbURI = process.env.MURL 
// || "mongodb://localhost:27017/employee-service";
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