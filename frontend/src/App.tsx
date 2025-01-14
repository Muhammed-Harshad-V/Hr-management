import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./page/navbar/navbar";
import Home from "./page/home/home";

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
        ]
    }
 
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App