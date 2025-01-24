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

function App() {
  const router = createBrowserRouter([
    {
        path: "/",
        element: <Navbar/>,
        children: [
          {
            path: "/",
            element: <Home/>,
          },
          {
            path: "/login",
            element: <Login/>
          },
          {
            path: "/employees",
            element: <Employees/>
          },
          {
            path: "/employees/add/employee",
            element: <AddEmployee/>
          },
          {
            path: "/employees/update/:id",
            element: <EditEmployee/>
          },
          {
            path: "/attendance",
            element: <Attendance/>
          },
          {
            path: "/payroll/generate",
            element: <GeneratePayroll/>
          },
          {
            path: "/payroll",
            element: <Payroll/>
          },
          {
            path: "/payroll/edit/:id",
            element: <PayrollEdit/>
          },
          {
            path: "/leaveRequests",
            element: <Leave/>
          },
        ]
    },
 
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App