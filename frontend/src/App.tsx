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
      path: "/",
      element: <Navbar />,  // The Navbar remains accessible
      children: [
        {
          path: "/",
          element:(
            <ProtectedRoute>
            <Home />,
            </ProtectedRoute>
          ) 
            
        },
        {
          path: "/login",
          element: <Login />,  // No protection for the login page
        },
        {
          path: "/employees",
          element: (
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          ),
        },
        {
          path: "/employees/add/employee",
          element: (
            <ProtectedRoute>
              <AddEmployee />
            </ProtectedRoute>
          ),
        },
        {
          path: "/employees/update/:id",
          element: (
            <ProtectedRoute>
              <EditEmployee />
            </ProtectedRoute>
          ),
        },
        {
          path: "/attendance",
          element: (
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          ),
        },
        {
          path: "/payroll/generate",
          element: (
            <ProtectedRoute>
              <GeneratePayroll />
            </ProtectedRoute>
          ),
        },
        {
          path: "/payroll",
          element: (
            <ProtectedRoute>
              <Payroll />
            </ProtectedRoute>
          ),
        },
        {
          path: "/payroll/edit/:id",
          element: (
            <ProtectedRoute>
              <PayrollEdit />
            </ProtectedRoute>
          ),
        },
        {
          path: "/leaveRequests",
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
