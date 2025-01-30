import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink from react-router-dom
import APIClientPrivate from "@/api/axios"; // Assuming this is where you handle API requests
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { handleApiError } from "@/api/ApiErrorHandler";

// Define TypeScript types for leave request
interface LeaveRequest {
  id: string; // or number depending on your backend structure
  employeeName: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: string;
}

function PendingLeave() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]); // Explicitly typing the state as an array of LeaveRequest
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch pending leave requests from the API
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      
      // Call API to get leave requests; modify the endpoint to match the actual API
      const response = await APIClientPrivate.get(`/employeeService/leaveRequests`, {
        params: {
          status: "pending", // Filter by pending status
        },
      });

      if (response.status === 200) {
        const pendingRequests = response.data.filter(
          (request: LeaveRequest) => request.status === "pending"
        );
        setLeaveRequests(pendingRequests); // Set the pending requests
        setError(""); // Clear error message on successful fetch
      } else {
        // Handle unexpected status code
        setError(`Unexpected status code: ${response.status}. Please try again later.`);
      }
        } catch (err: any) {
          handleApiError(err, setError)
    } finally {
      setLoading(false); // Set loading state to false once the API call finishes
    }
  };

  // Fetch leave requests when component mounts
  useEffect(() => {
    fetchLeaveRequests();
  }, []); // Empty array to run once when component mounts

  return (
    <div className="p-4 bg-white dark:bg-gray-800 w-full rounded-md shadow-md max-h-[400px] overflow-x-auto min-h-[200px]">
      <h1 className="text-2xl font-bold mb-4">Pending Leave Requests</h1>

      <div className="flex flex-col justify-between h-[calc(100%-4rem)]">
        {loading ? (
          <p className="text-center text-blue-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 relative overflow-x-auto rounded-md">
            <Table className="border rounded-md">
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Days</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.length > 0 ? (
                  leaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.employeeName}</TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell>
                        {Math.ceil(
                          (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) /
                            (1000 * 3600 * 24)
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No pending leave requests.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* See More Link (NavLink) */}
        <div className="mt-4 text-center">
          <NavLink
            to="/dashboard/leaveRequests" // Adjust the path to your actual leave request page
            className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300"
          >
            See All
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default PendingLeave;
