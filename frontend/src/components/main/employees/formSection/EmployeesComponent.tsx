import { useState, useEffect } from "react";
import APIClientPrivate from "@/api/axios";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link, useNavigate } from "react-router-dom";
import { handleApiError } from "@/api/ApiErrorHandler";

// Define types for Employee data
interface Employee {
  _id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: string;
  status: "active" | "inactive"; // Adjust this based on actual status values
  hireDate: string;
}

function EmployeesComponent() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5); // You can adjust the page size here

  // Fetch employees from the backend
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await APIClientPrivate.get("/employeeService/employees"); // Replace with your API endpoint
      console.log(response.data)
      setEmployees(response.data || []); // Assuming `response.data` contains the list of employees
      setError("");
        } catch (err: any) {
          handleApiError(err, setError)
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchEmployees();
    console.log(employees)
  }, []);

  // Filter employees based on search term
  const filterEmployees = (term: string) => {
    if (term) {
      setFilteredEmployees(
        employees.filter((employee) =>
          employee.name.toLowerCase().includes(term.toLowerCase()) ||
          employee.email.toLowerCase().includes(term.toLowerCase()) ||
          employee.position.toLowerCase().includes(term.toLowerCase()) ||
          employee.department.toLowerCase().includes(term.toLowerCase()) ||
          employee.status.toLowerCase().includes(term.toLowerCase()) ||
          employee.salary.toString().includes(term.toLowerCase())
        )
      );
    } else {
      setFilteredEmployees(employees);
    }
  };

  // Handle search when the Enter key is pressed
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      filterEmployees(searchTerm);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Get current employees to be displayed on the page
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const handleEditEmployee = (id: string) => {
    navigate(`/dashboard/update/${id}`);
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await APIClientPrivate.delete(`/employeeService/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      setError("Failed to Remove Employee. Please try again later.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Directory</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter employees..."
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term as user types
          onKeyDown={handleSearchKeyDown} // Trigger search only when Enter key is pressed
        />
      </div>

      {loading ? (
        <p className="text-center text-blue-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="relative overflow-x-auto rounded-md">
          {/* Invisible scrollbar styling */}
          <style>
            {`
              ::-webkit-scrollbar {
                display: none;
              }
              -ms-overflow-style: none; /* Internet Explorer 10+ */
              scrollbar-width: none; /* Firefox */
            `}
          </style>

          <Table className="w-full border rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead>Actions</TableHead> {/* New Actions Column */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEmployees.length > 0 ? (
                currentEmployees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.salary}</TableCell>
                    <TableCell>
                      <span
                        className={
                          employee.status === "active"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      >
                        {employee.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(employee.hireDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {/* Action buttons */}
                      <button
                        onClick={() => handleEditEmployee(employee._id)}
                        className="text-blue-500 hover:text-blue-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No employees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8} className="font-semibold">
                  <div className="w-full flex justify-between">
                    <Link to={"add/employee"} className="text-blue-500 hover:text-blue-600">
                      Add Employee
                    </Link>
                    <div>Total Employees: {filteredEmployees.length}</div>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          {/* Centered Pagination */}
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
              disabled={currentPage * itemsPerPage >= filteredEmployees.length}
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

export default EmployeesComponent;
