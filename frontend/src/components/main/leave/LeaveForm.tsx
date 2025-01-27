import { useState, useEffect } from "react";
import APIClientPrivate from "@/api/axios"; // API call
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Table components

// Type definitions for leave requests
interface LeaveRequest {
  _id: string;
  employeeName: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
}

function LeaveForm() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]); // State for leave requests
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const [error, setError] = useState<string>(""); // State for error
  const [statusFilter, setStatusFilter] = useState<string>(""); // State for filter by status

  // Fetch all leave requests with optional status filter
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {}; // Add status filter if needed
      const response = await APIClientPrivate.get("/employeeService/leaveRequests/status/overview", { params });

      if (response.data && Array.isArray(response.data)) {
        setLeaveRequests(response.data);
        setError(""); // Reset error on successful response
      } else {
        setError("Unexpected response format.");
      }
    } catch (err) {
      setError("Failed to load leave requests.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch leave requests when status filter changes
  useEffect(() => {
    fetchLeaveRequests();
  }, [statusFilter]);

  // Function to update status of a leave request
  const handleChangeStatus = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      const response = await APIClientPrivate.put(`/employeeService/leaveRequests/${id}`, { status: newStatus });
      if (response.data) {
        // Update the status locally
        setLeaveRequests(prevRequests =>
          prevRequests.map(request =>
            request._id === id ? { ...request, status: newStatus } : request
          )
        );
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  // Function to determine status color class
  const getStatusColor = (status: "pending" | "approved" | "rejected"): string => {
    switch (status) {
      case "pending":
        return "text-yellow-500"; // Yellow for pending
      case "approved":
        return "text-green-500"; // Green for approved
      case "rejected":
        return "text-red-500"; // Red for rejected
      default:
        return "text-gray-500"; // Default gray for unknown statuses
    }
  };

  return (
    <div className="p-4 w-full max-h-[400px] overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">All Leave Requests</h1>

      {/* Status Filter */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-blue-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="relative overflow-x-auto rounded-md">
          <Table className="w-full border rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.length > 0 ? (
                leaveRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>{request.employeeName}</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>{new Date(request.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(request.endDate).toLocaleDateString()}</TableCell>
                    <TableCell className={getStatusColor(request.status)}>{request.status}</TableCell>
                    <TableCell>
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleChangeStatus(request._id, "approved")}
                            className="text-green-500 hover:text-green-600 mr-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleChangeStatus(request._id, "rejected")}
                            className="text-red-500 hover:text-red-600"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No leave requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default LeaveForm;
