import { useState, useEffect } from "react";
import APIClientPrivate from "@/api/axios";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

function AttendanceComponent() {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust the number of records per page
  
  // Fetch attendance data based on filters (e.g., specific date or employee)
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterDate) params.date = filterDate;
      if (filterEmployee) params.employee_id = filterEmployee;

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
  }, [filterDate, filterEmployee]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Get current attendance to be displayed on the page
  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const currentAttendance = attendanceData.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Attendance Records</h1>

      {/* Filter Bar */}
      <div className="mb-4">
        <input
          type="date"
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md mr-2"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Employee ID"
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md"
          value={filterEmployee}
          onChange={(e) => setFilterEmployee(e.target.value)}
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
                    <TableCell>{attendance.employee_id?.name}</TableCell>
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
