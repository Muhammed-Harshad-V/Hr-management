const express = require('express');
const http = require('express-http-proxy');
const app = express();
const cors = require('cors');
require('dotenv').config();

const TIMEOUT = 120000;

// Middleware to log all incoming requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Allow credentials and specify allowed origin
app.use(cors({
    origin: 'https://h-yq1e.onrender.com', // Your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow credentials (cookies, authorization headers)
}));

app.options('*', cors()); // Explicitly handle OPTIONS requests

// Custom proxy decorator function to forward Authorization header
const proxyWithAuth = (targetURL) => {
    return http(targetURL, {
        timeout: TIMEOUT,
        proxyReqOptDecorator: (proxyReqOpts, req) => {
            proxyReqOpts.headers['Access-Control-Allow-Origin'] = 'https://h-yq1e.onrender.com';
            proxyReqOpts.headers['Access-Control-Allow-Credentials'] = 'true';

            // Forward the Authorization header if it exists
            if (req.headers['authorization']) {
                proxyReqOpts.headers['Authorization'] = req.headers['authorization'];
            }

            return proxyReqOpts;
        },
        userResDecorator: (proxyRes, proxyResData, req, res) => {
            try {
                const data = JSON.parse(proxyResData.toString('utf8'));
                return JSON.stringify(data);
            } catch (error) {
                return proxyResData;
            }
        },
        proxyErrorHandler: (err, res, next) => {
            console.error('Proxy Error:', err);
            res.status(500).json({ error: 'Gateway error. Please try again later.' });
        }
    });
};

// Service proxies
app.use('/employeeService', proxyWithAuth('https://employee-service-production-edd9.up.railway.app'));
app.use('/attendanceService', proxyWithAuth('https://attendance-service-production.up.railway.app'));
app.use('/payrollService', proxyWithAuth('https://payroll-production-a39e.up.railway.app'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(3000, () => {
    console.log('🚀 Gateway service is running on port 3000');
});
