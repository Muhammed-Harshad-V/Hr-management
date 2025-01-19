import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./page/navbar/navbar";
import Home from "./page/home/home";
import Login from "./page/login/Login";
import Employees from "./page/Employees/Employees";

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
        ]
    },
 
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App