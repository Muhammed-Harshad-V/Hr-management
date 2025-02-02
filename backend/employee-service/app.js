const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const employeeRouter = require('./routes/employeesRotes')
const leaveRequest = require('./routes/LeaveRoutes')
const LogRoutes = require('./routes/logRoutes')
const cookieParser = require('cookie-parser');
const {startUserService} = require('./utils/rabbitmq')
require('dotenv').config();
const cors = require('cors');


const app = express()
const port = process.env.PORT || 3001;
startUserService()

app.use(cors({
    origin: ['https://h-yq1e.onrender.com/', 'https://gateway-production-bca1.up.railway.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization',], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers)
}));

app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://h-yq1e.onrender.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});



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

