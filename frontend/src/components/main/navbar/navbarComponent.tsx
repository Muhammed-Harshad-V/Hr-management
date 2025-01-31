import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom"; // Use NavLink for routing
import ThemeToggle from "../themeToggle/ThemeToggle";
import APIClientPrivate from "@/api/axios"; // Assume this is your API client for making requests
import { io } from "socket.io-client";
import { S_api } from "@/api/axios"; // Assuming S_api holds your API base URL

const NavbarComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [unreadNotifications, setUnreadNotifications] = useState(false); // Track unread notifications
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
    socket.on('notification', () => {
      // Whenever a notification is received, set unread notifications to true
      setUnreadNotifications(true);
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

  // Handle logout
  const handleLogout = async () => {
    try {
      // Send logout API request to backend (if necessary)
      await APIClientPrivate.get("employeeService/logout");

      // Remove token from localStorage and update login status
      localStorage.removeItem("login");
      setIsLoggedIn(false);
      navigate("/dashboard/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Handle notification click (mark as read)
  const handleNotifications = () => {
    // Reset unread notifications when the user clicks the bell
    setUnreadNotifications(false);
    // Optionally, show a list of notifications in a modal or dropdown
    console.log('Notifications viewed');
  };

  const autoclose = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="h-screen flex flex-col text-black dark:text-white">
      {/* Top Navbar */}
      <header className="text-black dark:text-white px-4 py-3 flex justify-between items-center bg-white dark:bg-black">
        <h1 className="text-lg font-bold">Admin Panel</h1>
        <div className="flex flex-row items-center space-x-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="px-3 py-2 bg-gray-100 rounded-md focus:outline-none dark:bg-less-black"
          >
            ☰
          </button>

          {/* Notification Bell Icon */}
          <button
            onClick={handleNotifications} // Add your notification handler here
            className="relative px-3 py-2 bg-gray-100 rounded-md focus:outline-none dark:bg-less-black"
          >
            {/* Bell Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800 dark:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.012 2.012 0 0020 14V10a6 6 0 00-12 0v4a2.012 2.012 0 00-.595 1.595L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>

            {/* Notification Badge (if any notifications are present) */}
            {unreadNotifications && (
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-black"></span>
            )}
          </button>

          {/* Theme Toggle */}
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
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full"
                >
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/dashboard/login"
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
