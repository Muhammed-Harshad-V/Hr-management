const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const http = require('http');
const {initSocket} = require('./socket.io')
const cors = require('cors');


// Import your routes and models
const attendance = require('./Routes/attendanceRoutes');
const Attendance = require('./model/attendance');
const DailyAttendance = require('./model/DailyAttendance');
const {initializeRabbitMQ} = require('./utils/rabbitmq')

const app = express();
const server = http.createServer(app);  // Create HTTP server

  // Initialize Socket.IO with the Express server
  initSocket(server);

const port = process.env.PORT || 3002;

app.use(cors({
    origin: ['https://h-yq1e.onrender.com', 'https://gateway-production-bca1.up.railway.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers)
}));


app.use(cookieParser());
app.use(bodyParser.json());
app.use('/', attendance);  // Your routes for handling attendance

// MongoDB connection
const dbURI = process.env.MURL;
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Exit if MongoDB connection fails
  });




// Start the server (Express + Socket.IO)
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


