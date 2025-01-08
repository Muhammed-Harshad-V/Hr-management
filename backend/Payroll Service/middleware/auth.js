const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async (req, res, next) => {
    try {
        // Get the token from cookies or the Authorization header
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }


        // Decode the token to get user data
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user information to request object
        req.user = decoded;

        // Check if the user role is 'admin'
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You do not have admin rights' });
        }

        // If user is admin, continue to the next middleware or route handler
        next();
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
}

module.exports = auth;