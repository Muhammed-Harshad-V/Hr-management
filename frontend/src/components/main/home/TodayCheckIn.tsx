import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom"; // Import NavLink from react-router-dom
import APIClientPrivate from "@/api/axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function TodayCheckIn() {
  const [checkInData, setCheckInData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch today's check-ins data from the server
  const fetchCheckInData = async () => {
    try {
      setLoading(true);
      const response = await APIClientPrivate.get("/attendanceService/attendance/daily"); // Endpoint for today's check-ins
      setCheckInData(response.data.employees || []); // Update the state with check-ins data
      setError("");
    } catch (err) {
      setError("Failed to load today's check-ins. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Setup SSE listener
  const setupSSE = () => {
    const eventSource = new EventSource('http://localhost:3000/attendanceService/attendance/events', {
        withCredentials: true,  // This ensures credentials (like cookies) are sent with the request
      });
      

        // Listen for the 'newCheckIn' event
        eventSource.onmessage = () => {
          fetchCheckInData(); // Refetch counts on new check-in
        };

    // Cleanup SSE connection on component unmount
    return () => {
        eventSource.close();
    };
};


  // Fetch check-ins on component mount
  useEffect(() => {
    fetchCheckInData();
    const cleanupSSE = setupSSE();
    return cleanupSSE; // Cleanup function
  }, []);


  return (
    <div className="p-4 bg-white dark:bg-gray-800 max-w-[300px] min-w-[300px] rounded-md shadow-md max-h-[400px] overflow-x-auto mb-6">
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
          to="/attendance" // Adjust the path to your actual attendance page
          className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300"
        >
          See More
        </NavLink>
      </div>
    </div>
  );
}

export default TodayCheckIn;

