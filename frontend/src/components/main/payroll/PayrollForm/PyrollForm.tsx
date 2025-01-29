import { useState, useEffect, ChangeEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Import NavLink for routing
import APIClientPrivate from "@/api/axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Define types for payroll data
interface Payroll {
  _id: string;
  employee_name: string;
  month: number;
  year: number;
  gross_salary: number;
  net_salary: number;
  status: string;
}

const PayrollForm = () => {
  const navigate = useNavigate();
  const [payrollData, setPayrollData] = useState<Payroll[]>([]); // Type state as an array of Payroll objects
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>(""); // Type error state as string
  const [filterMonth, setFilterMonth] = useState<string>(""); // Filter month type as string
  const [filterYear, setFilterYear] = useState<string>(""); // Filter year type as string
  const [filterEmployee, setFilterEmployee] = useState<string>(""); // Filter employee type as string
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page type as number
  const [itemsPerPage] = useState<number>(10); // Items per page type as number

  // Fetch payroll data based on filters
  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const params: { [key: string]: string } = {}; // Declare params as an object with string keys
      if (filterMonth) params.month = filterMonth;
      if (filterYear) params.year = filterYear;
      if (filterEmployee) params.employee_name = filterEmployee;

      const response = await APIClientPrivate.get("payrollService/payroll", { params });
      setPayrollData(response.data || []); // Type response.data correctly
      setError(""); // Clear any previous error
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
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Get current payroll to be displayed on the page
  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const currentPayroll = payrollData.slice(indexOfFirstRecord, indexOfLastRecord);

  // Trigger search on Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchPayroll(); // Trigger the fetch when Enter is pressed
    }
  };

  // Function to format salary to integer (removes decimal part)
  const formatSalary = (salary: number) => {
    return Math.floor(salary); // Removes the decimal part
  };

  // Function to get the color class for the status
  const getStatusColor = (status: string) => {
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
      <div className="flex flex-col justify-between items-center mb-6 lg:flex-row">
        <h1 className="text-2xl font-bold mb-4">Payroll Records</h1>
        <div className="mt-4 text-center">
          <NavLink
            to="/payroll/generate" // Route to generate payroll page
            className="bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-md py-2 px-4 transition-colors duration-300"
          >
            Generate Payroll
          </NavLink>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col justify-between items-center mb-4 lg:flex-row">
        <input
          type="text"
          placeholder="Filter by Employee Name"
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md mr-2 mb-2 max-w-[200px]"
          value={filterEmployee}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterEmployee(e.target.value)}
          onKeyDown={handleKeyDown} // Trigger search on Enter key press
        />
        <input
          type="number"
          placeholder="Month"
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md mr-2 mb-2 max-w-[200px]"
          value={filterMonth}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterMonth(e.target.value)}
          onKeyDown={handleKeyDown} // Trigger search on Enter key press
        />
        <input
          type="number"
          placeholder="Year"
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md mb-2 max-w-[200px]"
          value={filterYear}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterYear(e.target.value)}
          onKeyDown={handleKeyDown} // Trigger search on Enter key press
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
                        onClick={() => navigate(`/dashboard/payroll/edit/${payroll._id}`)}
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

      {/* Generate Payroll NavLink */}
    </div>
  );
};

export default PayrollForm;
