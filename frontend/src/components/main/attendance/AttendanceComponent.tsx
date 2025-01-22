import { useState, useEffect } from "react";
import APIClientPrivate from "@/api/axios";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

function AttendanceComponent() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStartDate, setFilterStartDate] = useState(""); // Start date of the range
  const [filterEndDate, setFilterEndDate] = useState(""); // End date of the range
  const [filterEmployee, setFilterEmployee] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust the number of records per page
  
  // Fetch attendance data based on filters (date range or specific employee)
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStartDate && filterEndDate) {
        params.start_date = filterStartDate;
        params.end_date = filterEndDate;
      }
      if (filterEmployee) params.employee_name = filterEmployee;

      const response = await APIClientPrivate.get("/attendanceService/attendance", { params });
      setAttendanceData(response.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load attendance. Please try again later.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [filterStartDate, filterEndDate]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Get current attendance to be displayed on the page
  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const currentAttendance = attendanceData.slice(indexOfFirstRecord, indexOfLastRecord);

  // Trigger search only when Enter key is pressed in the employee name input
  const handleEmployeeSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchAttendance(); // Trigger the search when Enter is pressed
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Attendance Records</h1>

      {/* Filter Bar */}
      <div className="mb-4 items-center">
        <input
          type="date"
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md mr-2 mb-2"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md mr-2 mb-2"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Name"
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md"
          value={filterEmployee}
          onChange={(e) => setFilterEmployee(e.target.value)}
          onKeyDown={handleEmployeeSearchKeyDown}  // Trigger search on Enter key press
        />
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
                <TableHead>Date</TableHead>
                <TableHead>Check-In Time</TableHead>
                <TableHead>Check-Out Time</TableHead>
                <TableHead>Worked Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAttendance.length > 0 ? (
                currentAttendance.map((attendance) => (
                  <TableRow key={attendance._id}>
                    <TableCell>{attendance.employee_name}</TableCell>
                    <TableCell>{new Date(attendance.date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(attendance.check_in_time).toLocaleTimeString()}</TableCell>
                    <TableCell>{attendance.check_out_time ? new Date(attendance.check_out_time).toLocaleTimeString() : "N/A"}</TableCell>
                    <TableCell>{attendance.worked_hours.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="w-full flex justify-between">
                    <div>Total Records: {attendanceData.length}</div>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-sm dark:bg-gray-800 bg-white rounded-l-md hover:bg-gray-400"
            >
              Previous
            </button>
            <span className="px-4">{currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= attendanceData.length}
              className="p-2 text-sm dark:bg-gray-800 rounded-r-md hover:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceComponent;
