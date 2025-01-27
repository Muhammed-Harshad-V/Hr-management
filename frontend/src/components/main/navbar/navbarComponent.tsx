import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom"; // Use NavLink for routing
import ThemeToggle from "../themeToggle/ThemeToggle";
import APIClientPrivate from "@/api/axios"; // Assume this is your API client for making requests

const NavbarComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const navigate = useNavigate();

  // Check window size on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false); // Close sidebar if window width is less than 1024px
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Check login status from localStorage on component mount
    const checkLoginStatus = () => {
      const token = localStorage.getItem("login");
      setIsLoggedIn(!!token);
    };

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Check login status when component mounts
    checkLoginStatus();

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const autoclose = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Send logout API request to backend (if necessary)
      await APIClientPrivate.get("employeeService//logout"); // Replace with your actual logout endpoint

      // Remove token from localStorage and update login status
      localStorage.removeItem("login");
      setIsLoggedIn(false);
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="h-screen flex flex-col text-black dark:text-white">
      {/* Top Navbar */}
      <header className="text-black dark:text-white px-4 py-3 flex justify-between items-center bg-white dark:bg-black">
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
          className={`bg-white dark:bg-black text-black dark:text-white w-64 flex-shrink-0 overflow-hidden h-[calc(100vh-64px)] absolute lg:relative z-50 ${
            isSidebarOpen ? "block" : "hidden"
          }`}
        >
          <nav className="flex flex-col justify-between h-full p-4">
            {/* Top navigation links */}
            <div className="flex flex-col">
              <NavLink
                to="/"
                className="dark:hover:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                onClick={() => autoclose()} // Close sidebar on click
                end
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/employees"
                className="dark:hover:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                onClick={() => autoclose()}
                end
              >
                Employees
              </NavLink>
              <NavLink
                to="/attendance"
                className="dark:hover:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                onClick={() => autoclose()}
                end
              >
                Attendance
              </NavLink>
              <NavLink
                to="/payroll"
                className="dark:hover:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                onClick={() => autoclose()}
                end
              >
                Payroll
              </NavLink>
              <NavLink
                to="/leaveRequests"
                className="dark:hover:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                onClick={() => autoclose()}
                end
              >
                Leave Requests
              </NavLink>
            </div>

            {/* Bottom section with login/logout button */}
            <div className="mt-auto">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full"
                >
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
                >
                  Login
                </NavLink>
              )}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-4 overflow-y-auto dark:bg-less-black dark:text-gray-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default NavbarComponent;
