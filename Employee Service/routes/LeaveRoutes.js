const express = require('express');
const LeaveRequest = require('../model/leave');
const Employee = require('../model/employee');
const router = express.Router();
const auth = require('../middleware/auth')


// Submit a leave request (employee) - Now using userId from URL
router.post('/leaveRequests/:userId', async (req, res) => {
    try {
        // Get the employeeId from URL parameter
        const { userId } = req.params;
        const { leaveType, startDate, endDate, reason } = req.body;

        // Validate if the employee exists
        const employee = await Employee.findById(userId);  // Using userId from URL
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Create a new leave request
        const leaveRequest = new LeaveRequest({
            employeeId: userId,  // Store the employeeId in the leave request
            leaveType,
            startDate, 
            endDate,
            reason,
        });

        // Save the leave request to the database
        const savedRequest = await leaveRequest.save();
        res.status(201).json(savedRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Approve or Reject a leave request (admin)
router.put('/leaveRequests/:id', auth, async (req, res) => {
    try {
        const leaveRequest = await LeaveRequest.findById(req.params.id);
        if (!leaveRequest) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        // Only allow status change if it's still pending
        if (leaveRequest.status !== 'pending') {
            return res.status(400).json({ message: 'Leave request is already processed' });
        }

        const { status } = req.body;

        // Ensure status is either "approved" or "rejected"
        if (status !== 'approved' && status !== 'rejected') {
            return res.status(400).json({ message: 'Invalid status. Must be approved or rejected' });
        }

        // Update the status of the leave request
        leaveRequest.status = status;
        const updatedRequest = await leaveRequest.save();
        
        res.status(200).json(updatedRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;