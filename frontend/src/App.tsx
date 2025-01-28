import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./page/navbar/navbar";
import Home from "./page/home/home";
import Login from "./page/login/Login";
import Employees from "./page/Employees/Employees";
import AddEmployee from "./components/main/employees/addEmployee/AddEmployee";
import EditEmployee from "./components/main/employees/editEmployee/EditEmployee";
import Attendance from "./page/attendance/Attendance";
import GeneratePayroll from "./components/main/payroll/PayrollGenerate/PayrollGenerate";
import Payroll from "./page/payroll/payroll";
import PayrollEdit from "./components/main/payroll/PayrollEdit/PayrollEdit";
import Leave from "./page/Leave/Leave";
import ProtectedRoute from "./protection/ProtectedRoute";  // Import the ProtectedRoute

function App() {
  const router = createBrowserRouter([
    {
      path: "/dashboard",
      element: <Navbar />,  // The Navbar remains accessible
      children: [
        {
          path: "/dashboard",  // Path for the Dashboard Home page
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/login",  // Path for the login page
          element: <Login />,
        },
        {
          path: "/dashboard/employees",  // Path for the Employees page
          element: (
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/employees/add/employee",  // Path for adding an employee
          element: (
            <ProtectedRoute>
              <AddEmployee />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/employees/update/:id",  // Path for editing an employee
          element: (
            <ProtectedRoute>
              <EditEmployee />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/attendance",  // Path for the Attendance page
          element: (
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/payroll/generate",  // Path for generating payroll
          element: (
            <ProtectedRoute>
              <GeneratePayroll />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/payroll",  // Path for the Payroll page
          element: (
            <ProtectedRoute>
              <Payroll />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/payroll/edit/:id",  // Path for editing payroll
          element: (
            <ProtectedRoute>
              <PayrollEdit />
            </ProtectedRoute>
          ),
        },
        {
          path: "/dashboard/leaveRequests",  // Path for leave requests
          element: (
            <ProtectedRoute>
              <Leave />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
