import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./page/navbar/navbar";
import Home from "./page/home/home";
import Login from "./page/login/Login";

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
        ]
    },
 
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App