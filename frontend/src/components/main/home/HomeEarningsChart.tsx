import React, { useState, useEffect, useRef } from 'react';
import APIClientPrivate from '@/api/axios';
import { Bar } from 'react-chartjs-2'; // Use the Bar chart from react-chartjs-2
import 'chart.js/auto'; // Automatically imports necessary components from Chart.js

interface EmployeeData {
  employee_name: string;
  totalEarnings: number;
}

function HomeEarningsChart() {
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<Chart<'bar'> | null>(null); // Ensure we're using a "bar" chart type

  // Fetch payroll records for all employees
  const fetchEmployeeEarnings = async () => {
    try {
      const response = await APIClientPrivate.get('/payrollService/payroll'); // Correct your endpoint here
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

  // Fetch employee earnings data when component mounts
  useEffect(() => {
    fetchEmployeeEarnings();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy(); // Cleanup chart on unmount
        chartRef.current = null;
      }
    };
  }, []);

  // Prepare data for the row (horizontal) chart
  const chartData = {
    labels: employeeData.map((employee) => employee.employee_name), // Employee names as y-axis labels
    datasets: [
      {
        label: "Total Earnings",
        data: employeeData.map((employee) => employee.totalEarnings), // Earnings data for each employee
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color
        borderColor: 'rgba(75, 192, 192, 1)', // Bar border color
        borderWidth: 1, // Bar border width
      },
    ],
  };

  // Chart options to customize appearance and behavior for a horizontal chart
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows chart to resize with container
    indexAxis: 'y', // Set index axis to 'y' to create a horizontal bar chart (row chart)
    plugins: {
      legend: {
        position: 'bottom', // Position the legend on top
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
        beginAtZero: true, // Start the x-axis from 0
        ticks: {
          callback: (value: number) => `$${value.toFixed(2)}`, // Format x-axis labels as currency
        },
      },
      y: {
        ticks: {
          autoSkip: false, // Automatically skip y-axis labels if there are too many
          font: {
            size: 12, // Adjust font size for better visibility
          },
        },
        grid: {
          display: false, // Hide grid lines for a cleaner look
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 w-full h-[300px]">
      {loading ? (
        <p className="text-center text-blue-500">Loading chart...</p>
      ) : (
        <div style={{ height: '100%' }}>
          <Bar ref={chartRef} data={chartData} options={chartOptions} /> {/* Use the Bar component for row chart */}
        </div>
      )}
    </div>
  );
}

export default HomeEarningsChart;
