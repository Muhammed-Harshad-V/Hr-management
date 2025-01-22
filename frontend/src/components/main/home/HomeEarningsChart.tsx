import React, { useState, useEffect, useRef } from 'react';
import APIClientPrivate from '@/api/axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  Chart
} from 'chart.js';

// Register chart.js components for line chart
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

interface EmployeeData {
  employee_name: string;
  totalEarnings: number;
}

function HomeEarningsChart() {
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<Chart<'line'> | null>(null); // Ensure chartRef is specifically for "line" chart type

  // Fetch payroll records for all employees
  const fetchEmployeeEarnings = async () => {
    try {
      // Fetch payroll data
      const response = await APIClientPrivate.get('/payrollService/payroll'); // Modify with correct endpoint
      const payrollData = response.data || [];

      // Aggregate earnings by employee_id
      const earningsMap: { [key: string]: EmployeeData } = {};

      payrollData.forEach((record: any) => {
        const employeeId = record.employee_id; // Use employee_id as key
        const earnings = (record.net_salary || 0) + (record.bonuses || 0); // Calculate total earnings

        if (earningsMap[employeeId]) {
          earningsMap[employeeId].totalEarnings += earnings; // Accumulate earnings for the same employee
        } else {
          earningsMap[employeeId] = {
            employee_name: record.employee_name,
            totalEarnings: earnings,
          };
        }
      });

      // Convert aggregated earnings into an array for charting
      const employeeEarnings = Object.values(earningsMap);
      setEmployeeData(employeeEarnings);

    } catch (error) {
      console.error('Error fetching employee earnings data:', error);
    } finally {
      setLoading(false);
    }
  };

  // UseEffect hook to fetch data on component mount and cleanup chart instance on unmount
  useEffect(() => {
    fetchEmployeeEarnings();

    // Cleanup chart instance on unmount or before re-rendering the chart
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Destroy the previous chart instance
        chartRef.current = null; // Clear the reference
      }
    };
  }, []);

  // Prepare data for the line chart
  const chartData: ChartData<'line'> = {
    labels: employeeData.map((employee) => employee.employee_name),
    datasets: [
      {
        label: "Total Earnings",
        data: employeeData.map((employee) => employee.totalEarnings), // Total earnings for each employee
        fill: false, // Set fill to false to make it a line chart without fill
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)', // Line color
        borderWidth: 2, // Line width
        tension: 0.3, // Smooth the line
      },
    ],
  };

  // Chart options for styling, updated to fit the expected type
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to resize according to container
    plugins: {
      legend: {
        position: 'top', // Ensure legend position is one of the valid string values
      },
      title: {
        display: true,
        text: 'Employee Total Earnings Over Career',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true, // Automatically skip labels if they are too many
          font: {
            size: 12, // Adjust font size for better visibility on mobile
          },
        },
        grid: {
          display: false,
        },
        display: window.innerWidth >= 1024 ? true : false, // Conditional display based on window width
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value.toFixed(2)}`, // Format y-axis as currency
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 w-full h-[250px]">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Employee Earnings</h2>
      {loading ? (
        <p className="text-center text-blue-500">Loading chart...</p>
      ) : (
        <div style={{ height: '100%' }}>
          <Line ref={chartRef} data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}

export default HomeEarningsChart;
