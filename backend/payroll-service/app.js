const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const payroll = require('./Routes/payrollRoutes')
const cookieParser = require('cookie-parser');
const cors = require('cors')

const app = express();
const port = process.env.PORT || 3003;

app.use(cors({
    origin: 'https://hr-management-gateway.onrender.com', // Your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers)
  }));


// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/', payroll)


// MongoDB connection
const dbURI = process.env.MURL 
// || "mongodb://localhost:27017/payroll-service";
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