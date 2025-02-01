import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom"; // Use NavLink for routing
import ThemeToggle from "../themeToggle/ThemeToggle";
import APIClientPrivate from "@/api/axios"; // Assume this is your API client for making requests
import { io } from "socket.io-client";
import { S_api } from "@/api/axios"; // Assuming S_api holds your API base URL

const NavbarComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [notification, setNotification] = useState(null); // Track notification state
  const navigate = useNavigate();

  // Define the routes for the sidebar dynamically
  const links = [
    { name: "Dashboard", to: "/dashboard" },
    { name: "Employees", to: "/dashboard/employees" },
    { name: "Attendance", to: "/dashboard/attendance" },
    { name: "Payroll", to: "/dashboard/payroll" },
    { name: "Leave Requests", to: "/dashboard/leaveRequests" },
  ];

  // WebSocket setup
  const socket = io(`${S_api}`, {
    transports: ['websocket']
  });

  // Listen for 'notification' events
  useEffect(() => {
    socket.on('notification', (message: string) => {
      // Show notification with message
      setNotification(message);

      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });

    // Cleanup socket connection when the component unmounts
    return () => {
      socket.off('notification');
    };
  }, [socket]);

  // Check window size on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false); // Close sidebar if window width is less than 1024px
      } else {
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

  // Handle logout
  const handleLogout = async () => {
    try {
      // Send logout API request to backend (if necessary)
      await APIClientPrivate.get("employeeService/logout");

      // Remove token from localStorage and update login status
      localStorage.removeItem("login");
      navigate("/dashboard/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const autoclose = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="h-screen flex flex-col text-black dark:text-white">
      {/* Top Navbar */}
      <header className="text-black dark:text-white px-4 py-3 flex justify-between items-center bg-white dark:bg-black z-20">
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <div className="flex flex-row items-center space-x-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="px-3 py-2 bg-gray-100 rounded-md focus:outline-none dark:bg-less-black"
          >
            ☰
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* Sliding Notification */}
      {notification && (
        <div className="fixed top-[70px] right-[30px] p-[10px] bg-white dark:bg-black text-black dark:text-white rounded-lg shadow-lg transform transition-all duration-500 ease-in-out slide-in">
          <p className="xl:text-[16px] lg:text-[14px] sm:text-[12px]">{notification}</p>
        </div>
      )}

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
              {links.map((link, index) => (
                <NavLink
                  key={index}
                  to={link.to}
                  className="dark:hover:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                  onClick={autoclose}
                  end
                  style={({ isActive }) => {
                    const isDarkMode = document.documentElement.classList.contains('dark');
                    return {
                      backgroundColor: isActive
                        ? isDarkMode
                          ? 'rgba(255, 255, 255, 0.2)'
                          : 'rgba(0, 0, 0, 1)'
                        : '',
                      color: isActive
                        ? 'white'
                        : isDarkMode
                          ? 'white'  // Lighter color for text in dark mode when not active
                          : 'black', // Black text for light mode when not active
                    };
                  }}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Bottom section with login/logout button */}
            <div className="mt-auto">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full"
                >
                  Logout
                </button>

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
