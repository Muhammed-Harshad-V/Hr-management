import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./page/navbar/navbar";
import Home from "./page/home/home";
import Login from "./page/login/Login";
import Employees from "./page/Employees/Employees";
import AddEmployee from "./components/main/employees/addEmployee/AddEmployee";
import EditEmployee from "./components/main/employees/editEmployee/EditEmployee";

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
        ]
    },
 
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App