import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import ThemeToggle from "../themeToggle/ThemeToggle";

const NavbaeComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1024);

  // Check window size on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false); // Close sidebar if window width is less than 1024px
      }
      else {
        setIsSidebarOpen(true); 
      }
    };

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
   

  const autoclose = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
  }

  return (
    <div className="h-screen flex flex-col text-black dark:text-white">
      {/* Top Navbar */}
      <header className=" text-black dark:text-white px-4 py-3 flex justify-between items-center bg-white dark:bg-black">
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <div className="flex flex-row">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="px-3 py-2 bg-gray-100 rounded-md focus:outline-none mr-3 dark:bg-less-black"
          >
            ☰
          </button>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`bg-white dark:bg-black text-black dark:text-white w-64 flex-shrink-0 overflow-hidden z-50 ${
            isSidebarOpen ? "block" : "hidden"
          }`}
        >
          <nav className="flex flex-col space-y-2 p-4">
            <Link
              to="/"
              className="dark:hover:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
              onClick={() => autoclose()} // Close sidebar on click
            >
              Dashboard
            </Link>
            <Link
              to="/employees"
              className="dark:hover:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
              onClick={() => autoclose()}
            >
              Employees
            </Link>
            <Link
              to="/attendance"
              className="dark:hover:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
              onClick={() => autoclose()}
            >
              Attendance
            </Link>
            <Link
              to="/payroll"
              className="dark:hover:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
              onClick={() => autoclose()}
            >
              Payroll
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-4 overflow-y-auto dark:bg-less-black dark:text-gray-300">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default NavbaeComponent;
