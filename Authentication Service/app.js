const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes')

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use('/', userRoutes)


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