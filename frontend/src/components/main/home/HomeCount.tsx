import  { useState, useEffect } from 'react';
import APIClientPrivate from '@/api/axios';

function HomeCount() {
    const [employeeCount, setEmployeeCount] = useState(0);
    const [checkInCount, setCheckInCount] = useState(0);

    // Fetch data from the server
    const fetchCounts = async () => {
        try {
            console.log('Fetching employee count...');
            const employeeResponse = await APIClientPrivate.get('/employeeService/employees/count');
            console.log('Employee count response:', employeeResponse);
            const checkInResponse = await APIClientPrivate.get('/attendanceService/attendance/check-in-count'); // Endpoint for today's check-ins
            console.log(employeeResponse)
            console.log(checkInResponse)
            setEmployeeCount(employeeResponse.data.totalEmployees || 0);
            setCheckInCount(checkInResponse.data.checkInCount || 0);
        } catch (error) {
            console.error('Error fetching counts:', error);
        }
    };

    // Setup SSE listener
    const setupSSE = () => {
        const eventSource = new EventSource('http://localhost:3000/attendanceService/attendance/events', {
            withCredentials: true,  // This ensures credentials (like cookies) are sent with the request
          });
          

            // Listen for the 'newCheckIn' event
            eventSource.onmessage = () => {
                fetchCounts(); // Refetch counts on new check-in
            };

        // Cleanup SSE connection on component unmount
        return () => {
            eventSource.close();
        };
    };

    // Fetch counts on mount and setup SSE
    useEffect(() => {
        fetchCounts();
        const cleanupSSE = setupSSE();
        return cleanupSSE; // Cleanup function
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {/* Employee Count Card */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Total Employees</h2>
                <p className="text-4xl font-semibold text-blue-600 dark:text-blue-400">{employeeCount}</p>
            </div>

            {/* Check-In Count Card */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Today's Check-Ins</h2>
                <p className="text-4xl font-semibold text-green-600 dark:text-green-400">{checkInCount}</p>
            </div>
        </div>
    );
}

export default HomeCount;
