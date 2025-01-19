import { useState, useEffect } from "react";
import APIClientPrivate from "@/api/axios";

import { Table, TableBody,  TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function EmployeesComponent() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  

  // Fetch employees from the backend
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await APIClientPrivate.get("/employeeService/employees"); // Replace with your API endpoint
      setEmployees(response.data || []); // Assuming `response.data` contains the list of employees
      setError("");
    } catch (err) {
      setError("Failed to load employees. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Directory</h1>

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length > 0 ? (
                employees.map((employee) => (
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No employees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7} className="text-right font-semibold">
                  Total Employees: {employees.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </div>
  );
}

export default EmployeesComponent;
