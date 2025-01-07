const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const employeeRouter = require('./routes/employeesRotes')
const leaveRequest = require('./routes/LeaveRoutes')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use('/', employeeRouter)
app.use('/', leaveRequest)

// MongoDB connection
const dbURI = process.env.MURL;
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