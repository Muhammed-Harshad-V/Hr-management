import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink for routing
import APIClientPrivate from "@/api/axios"; // API call
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Table components
import { handleApiError } from "@/api/ApiErrorHandler";

// Define types for the check-in data
interface CheckInData {
  name: string;
  checkInTime: string;
}

function TodayCheckIn() {
  const [checkInData, setCheckInData] = useState<CheckInData[]>([]); // State for check-ins
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string>(""); // Error message state

  const fetchCheckInData = async () => {
    try {
      setLoading(true);
      const response = await APIClientPrivate.get("/attendanceService/attendance/daily");
  
      // Check if the response status is OK (status code 200)
      if (response.status === 200) {
        setCheckInData(response.data.employees || []); // Update the state with check-ins data
        setError(""); // Clear any previous errors
      } else {
        // Handle other statuses (e.g., 400, 404, 500, etc.)
        setError(`Unexpected status code: ${response.status}. Please try again later.`);
      }
    } catch (err: any) {
      handleApiError(err, setError)
    } finally {
      setLoading(false); // Set loading state to false once the API call finishes
    }
  };
  

  // Setup SSE listener to receive real-time updates for new check-ins
  const setupSSE = () => {
    const eventSource = new EventSource('http://localhost:3000/attendanceService/attendance/events', {
      withCredentials: true,  // This ensures credentials (like cookies) are sent with the request
    });

    // Listen for the 'newCheckIn' event to trigger the refetch of check-in data
    eventSource.onmessage = () => {
      fetchCheckInData(); // Refetch check-ins when a new check-in occurs
    };

    // Return a cleanup function that closes the SSE connection when the component unmounts
    return () => {
      eventSource.close();
    };
  };

  // Fetch check-ins on component mount and setup SSE listener
  useEffect(() => {
    fetchCheckInData(); // Fetch initial check-in data
    const cleanupSSE = setupSSE(); // Set up SSE for real-time updates
    return cleanupSSE; // Cleanup function for SSE on unmount
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="p-4 bg-white dark:bg-gray-800 max-w-[300px] min-w-[300px] rounded-md shadow-md max-h-[400px] overflow-x-auto min-h-[200px]">
      <h1 className="text-2xl font-bold mb-4">Today's Check-Ins</h1>

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
                <TableHead>Check-In Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkInData.length > 0 ? (
                checkInData.map((checkIn, index) => (
                  <TableRow key={index}>
                    <TableCell>{checkIn.name}</TableCell>
                    <TableCell>{new Date(checkIn.checkInTime).toLocaleTimeString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No check-ins for today.
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
          to="/dashboard/attendance" // Adjust the path to your actual attendance page
          className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300"
        >
          See More
        </NavLink>
      </div>
    </div>
  );
}

export default TodayCheckIn;
