import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink from react-router-dom
import APIClientPrivate from "@/api/axios"; // Assuming this is where you handle API requests
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function PendingLeave() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch pending leave requests within the date range
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await APIClientPrivate.get(`/employeeService/leaveRequests/status/overview`);
      console.log(response)
      const pendingRequests = response.data.filter(request => request.status === 'pending'); // Filter pending requests
      setLeaveRequests(pendingRequests);
      setError("");
    } catch (err) {
      setError("No pending leave requests found.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch leave requests when component mounts or date range changes
  useEffect(() => {
      fetchLeaveRequests();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 w-full rounded-md shadow-md max-h-[400px] overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Pending Leave Requests</h1>


      {loading ? (
        <p className="text-center text-blue-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 relative overflow-x-auto rounded-md">
          <Table className="w-full border rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Days</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.length > 0 ? (
                leaveRequests.map((request, index) => (
                  <TableRow key={index}>
                    <TableCell>{request.employeeName}</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>{Math.ceil((new Date(request.endDate) - new Date(request.startDate)) / (1000 * 3600 * 24))}</TableCell> {/* Calculate days */}
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
          to="/leave-requests" // Adjust the path to your actual leave request page
          className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300"
        >
          See All
        </NavLink>
      </div>
    </div>
  );
}

export default PendingLeave;
