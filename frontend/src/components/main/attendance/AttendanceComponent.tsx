import { useState, useEffect } from "react";
import APIClientPrivate from "@/api/axios";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// TypeScript type for attendance record
interface Attendance {
  _id: string;
  employee_name: string;
  date: string;
  check_in_time: string;
  check_out_time: string | null;
  worked_hours: number;
}

function AttendanceComponent() {
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);  // Use Attendance type
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [filterStartDate, setFilterStartDate] = useState<string>(""); // Start date of the range
  const [filterEndDate, setFilterEndDate] = useState<string>(""); // End date of the range
  const [filterEmployee, setFilterEmployee] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10); // Adjust the number of records per page
  
  // Fetch attendance data based on filters (date range or specific employee)
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params: { [key: string]: string } = {};  // Define params type
      if (filterStartDate && filterEndDate) {
        params.start_date = filterStartDate;
        params.end_date = filterEndDate;
      }
      if (filterEmployee) params.employee_name = filterEmployee;

      const response = await APIClientPrivate.get("/attendanceService/attendance", { params });
      setAttendanceData(response.data || []);
      setError("");
    } catch (err: any) {
      setError("Failed to load attendance. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [filterStartDate, filterEndDate, filterEmployee]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Get current attendance to be displayed on the page
  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const currentAttendance = attendanceData.slice(indexOfFirstRecord, indexOfLastRecord);

  // Trigger search only when Enter key is pressed in the employee name input
  const handleEmployeeSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchAttendance(); // Trigger the search when Enter is pressed
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Attendance Records</h1>

      {/* Filter Bar */}
      <div className="flex flex-col justify-between items-center mb-4 lg:flex-row">
        <input
          type="date"
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md mr-2 mb-2 max-w-[200px]"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md mr-2 mb-2 max-w-[200px]"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Name"
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md max-w-[200px]"
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
