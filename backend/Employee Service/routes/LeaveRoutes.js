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

        // Create a new SSE connection to notify the frontend
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); // Ensure headers are sent before sending the data

        // Send the SSE event with a simple text message
        res.write(`event: leaveRequest\n`);
        res.write(`data: New leave request submitted\n\n`);

        // Respond with the saved leave request
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

        // Create an SSE connection to notify the frontend
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); // Ensure headers are sent before sending the data

        // Send the SSE event with an appropriate message
        res.write(`event: leaveRequestStatusUpdated\n`);
        res.write(`data: Leave request ${status}: ${leaveRequest.employeeId} - ${leaveRequest.leaveType}\n\n`);

        // Respond with the updated leave request
        res.status(200).json(updatedRequest);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

  // specific leave request 
router.get('/leaveRequests/all/:employeeId', auth, async (req, res) => {
    try {
        const { employeeId } = req.params;  // Get the employeeId from the URL
        const { startDate, endDate } = req.query;  // Get startDate and endDate from query parameters

        // Prepare the filter object
        const filter = { employeeId };  // Filter by employeeId

        // If both startDate and endDate are provided, apply the date range filter
        if (startDate && endDate) {
            filter.startDate = { $gte: new Date(startDate) };  // start date greater than or equal to
            filter.endDate = { $lte: new Date(endDate) };  // end date less than or equal to
        }

        // Fetch the leave requests for this employee (with or without date range)
        const leaveRequests = await LeaveRequest.find(filter);

        if (!leaveRequests || leaveRequests.length === 0) {
            return res.status(404).json({ message: 'No leave requests found for this employee.' });
        }

        // Categorize the leave requests by status
        const categorizedRequests = {
            approved: [],
            rejected: [],
            pending: []
        };

        leaveRequests.forEach(request => {
            if (request.status === 'approved') {
                categorizedRequests.approved.push(request);
            } else if (request.status === 'rejected') {
                categorizedRequests.rejected.push(request);
            } else if (request.status === 'pending') {
                categorizedRequests.pending.push(request);
            }
        });

        // Send the categorized leave requests
        res.status(200).json(categorizedRequests);
    } catch (err) {
        console.error("Error fetching leave requests:", err);
        res.status(500).json({ message: err.message });
    }
});

  // all leave request
router.get('/leaveRequests/status/overview', async (req, res) => {
    try {
        const { startDate, endDate } = req.query; // Get start and end dates from query parameters

        // Prepare the date range filter if provided
        const filter = {};

        if (startDate && endDate) {
            filter.startDate = { $gte: new Date(startDate) }; // start date greater than or equal to
            filter.endDate = { $lte: new Date(endDate) }; // end date less than or equal to
        }

        // Fetch leave requests based on date range
        const leaveRequests = await LeaveRequest.find(filter);

        if (!leaveRequests || leaveRequests.length === 0) {
            return res.status(404).json({ message: 'No leave requests found in the specified date range' });
        }

        // Initialize counters for approved, rejected, and pending
        let approvedCount = 0;
        let rejectedCount = 0;
        let pendingCount = 0;

        // Loop through the leave requests and count each status
        leaveRequests.forEach(request => {
            if (request.status === 'approved') {
                approvedCount++;
            } else if (request.status === 'rejected') {
                rejectedCount++;
            } else if (request.status === 'pending') {
                pendingCount++;
            }
        });

        // Send the total counts back in the response
        res.status(200).json({
            totalApproved: approvedCount,
            totalRejected: rejectedCount,
            totalPending: pendingCount,
        });
    } catch (err) {
        console.error("Error fetching leave requests overview:", err);
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;