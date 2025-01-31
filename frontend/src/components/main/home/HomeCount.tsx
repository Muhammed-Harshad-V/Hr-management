import  { useState, useEffect } from 'react';
import APIClientPrivate from '@/api/axios';
import { io } from 'socket.io-client';
import { S_api } from '@/api/axios';

function HomeCount() {
    const [employeeCount, setEmployeeCount] = useState(0);
    const [checkInCount, setCheckInCount] = useState(0);
    const socket = io(`${S_api}`, {
        transports: ['websocket']
      });
      

    // Fetch data from the server
    const CheckInCountCall = async () => {
        try {
            const checkInResponse = await APIClientPrivate.get('/attendanceService/attendance/checkInCount');
            setCheckInCount(checkInResponse.data.checkInCount || 0);
        } catch (error) {
            console.error('Error fetching counts:', error);
        }
    };

    const EmployeeCountCall = async () => {
        try {
        const employeeResponse = await APIClientPrivate.get('/employeeService/employees/count');
        setEmployeeCount(employeeResponse.data.totalEmployees || 0);
    } catch (error) {
        console.error('Error fetching counts:', error);
    }

    };

    useEffect(() => {
        // Listen for 'notification' events from the server
        socket.on('notification', () => {
            CheckInCountCall();
            console.log('working file');
        });
    
        // Clean up the socket connection when the component unmounts
        return () => {
          socket.off('notification');
        };
      }, [socket]);




    // Fetch counts on mount and setup SSE
    useEffect(() => {
        CheckInCountCall();
        EmployeeCountCall();
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
