import { useState, useEffect } from "react";
import APIClientPrivate from "@/api/axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

function PayrollForm() {
  const navigate = useNavigate();
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch payroll data based on filters
  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterMonth) params.month = filterMonth;
      if (filterYear) params.year = filterYear;
      if (filterEmployee) params.employee_name = filterEmployee;

      const response = await APIClientPrivate.get("payrollService/payroll", { params });
      setPayrollData(response.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load payroll. Please try again later.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // UseEffect hook to fetch payroll on initial load
  useEffect(() => {
    fetchPayroll();
  }, []); // Initial fetch without any filters

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Get current payroll to be displayed on the page
  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const currentPayroll = payrollData.slice(indexOfFirstRecord, indexOfLastRecord);

  // Trigger search on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchPayroll(); // Trigger the fetch when Enter is pressed
    }
  };

  // Function to format salary to integer (removes decimal part)
  const formatSalary = (salary) => {
    return Math.floor(salary); // Removes the decimal part
  };

  // Function to get the color class for the status
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500"; // Yellow for pending
      case "processed":
        return "text-blue-500"; // Blue for processed
      case "paid":
        return "text-green-500"; // Green for paid
      case "failed":
        return "text-red-500"; // Red for failed
      default:
        return "text-gray-500"; // Default gray if status is unknown
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Payroll Records</h1>

      {/* Filter Bar */}
      <div className="mb-4 items-center">
        <input
          type="text"
          placeholder="Filter by Employee Name"
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md mr-2 mb-2"
          value={filterEmployee}
          onChange={(e) => setFilterEmployee(e.target.value)}
          onKeyDown={handleKeyDown}  // Trigger search on Enter key press
        />
        <input
          type="number"
          placeholder="Month"
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md mr-2 mb-2"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          onKeyDown={handleKeyDown}  // Trigger search on Enter key press
        />
        <input
          type="number"
          placeholder="Year"
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md mb-2"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          onKeyDown={handleKeyDown}  // Trigger search on Enter key press
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
                <TableHead>Employee Name</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Gross Salary</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPayroll.length > 0 ? (
                currentPayroll.map((payroll) => (
                  <TableRow key={payroll._id}>
                    <TableCell>{payroll.employee_name}</TableCell>
                    <TableCell>{payroll.month}</TableCell>
                    <TableCell>{payroll.year}</TableCell>
                    <TableCell>{formatSalary(payroll.gross_salary)}</TableCell>
                    <TableCell>{formatSalary(payroll.net_salary)}</TableCell>
                    <TableCell className={getStatusColor(payroll.status)}>
                      {payroll.status}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => navigate(`/payroll/edit/${payroll._id}`)}
                        className="text-blue-500 hover:text-blue-600 mr-2"
                      >
                        Edit
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No payroll records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
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
              disabled={currentPage * itemsPerPage >= payrollData.length}
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

export default PayrollForm;
