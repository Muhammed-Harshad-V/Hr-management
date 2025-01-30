import { useState, useEffect, ChangeEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import APIClientPrivate from "@/api/axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Required for auto-table plugin for jsPDF

declare module 'jspdf' {
  interface jsPDF {
    autoTable: any; // Explicitly declare autoTable as any or the appropriate type
    lastAutoTable: any; // Same for lastAutoTable
  }
}

interface Deduction {
  type: string;
  amount: number;
}

interface Payroll {
  _id: string;
  employee_name: string;
  month: number;
  year: number;
  gross_salary: number;
  net_salary: number;
  status: string;
  deductions: Deduction[]; // Add deductions property
}

const PayrollForm = () => {
  const navigate = useNavigate();
  const [payrollData, setPayrollData] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [filterMonth, setFilterMonth] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");
  const [filterEmployee, setFilterEmployee] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const params: { [key: string]: string } = {};
      if (filterMonth) params.month = filterMonth;
      if (filterYear) params.year = filterYear;
      if (filterEmployee) params.employee_name = filterEmployee;

      const response = await APIClientPrivate.get("payrollService/payroll", { params });
      setPayrollData(response.data || []);
      setError("");
    } catch (err) {
      setError("Failed to load payroll. Please try again later.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const currentPayroll = payrollData.slice(indexOfFirstRecord, indexOfLastRecord);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchPayroll();
    }
  };

  const formatSalary = (salary: number) => {
    return Math.floor(salary);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "processed":
        return "text-blue-500";
      case "paid":
        return "text-green-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  // Export to Excel with Deductions
  const exportToExcel = () => {
    const excelData = payrollData.map((payroll) => {
      // Flatten data to include deductions
      const deductions = payroll.deductions.map((deduction) => `${deduction.type}: $${deduction.amount}`).join(", ");
      return {
        EmployeeName: payroll.employee_name,
        Month: payroll.month,
        Year: payroll.year,
        GrossSalary: formatSalary(payroll.gross_salary),
        NetSalary: formatSalary(payroll.net_salary),
        Status: payroll.status,
        Deductions: deductions, // Add deductions in a new column
      };
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll Data");
    XLSX.writeFile(wb, "Payroll_Data.xlsx");
  };

// Export a single payroll record to PDF with Deductions (in a table format)
const exportSingleToPDF = (payroll: Payroll) => {
  const doc = new jsPDF();

  // Adding title
  doc.setFontSize(18);
  doc.text(`Payroll for ${payroll.employee_name}`, 10, 10);
  
  // Table Header
  doc.setFontSize(12);
  doc.autoTable({
    startY: 20,
    head: [["Attribute", "Details"]],
    body: [
      ["Employee Name", payroll.employee_name],
      ["Month", payroll.month],
      ["Year", payroll.year],
      ["Gross Salary", `$${formatSalary(payroll.gross_salary)}`],
      ["Net Salary", `$${formatSalary(payroll.net_salary)}`],
      ["Status", payroll.status],
    ],
    theme: "striped", // Adding striped rows for better readability
  });

  // Adding a new line before Deductions section
  doc.text("Deductions:", 10, doc.lastAutoTable.finalY + 10);

  // Deductions Table
  const deductionData = payroll.deductions.map(ded => [ded.type, `$${ded.amount}`]);
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 15,
    head: [["Deduction Type", "Amount"]],
    body: deductionData,
    theme: "striped", // Adding striped rows for better readability
  });

  // Saving the PDF
  doc.save(`${payroll.employee_name}_Payroll.pdf`);
};


  // Export all payroll data to PDF with Deductions
  const exportAllToPDF = () => {
    const doc = new jsPDF();
    const tableData = payrollData.map((payroll) => [
      payroll.employee_name,
      payroll.month,
      payroll.year,
      formatSalary(payroll.gross_salary),
      formatSalary(payroll.net_salary),
      payroll.status,
      payroll.deductions.map(ded => `${ded.type}: $${ded.amount}`).join(", "), // Include deductions
    ]);

    doc.autoTable({
      head: [
        [
          "Employee Name",
          "Month",
          "Year",
          "Gross Salary",
          "Net Salary",
          "Status",
          "Deductions", // Add a new column for Deductions
        ],
      ],
      body: tableData,
    });

    doc.save("All_Payroll_Data.pdf");
  };

  return (
    <div className="p-4">
      <div className="flex flex-col justify-between items-center mb-6 lg:flex-row">
        <h1 className="text-2xl font-bold mb-4">Payroll Records</h1>
        <div className="mt-4 text-center">
          <NavLink
            to="/dashboard/payroll/generate"
            className="bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-md py-2 px-4 transition-colors duration-300"
          >
            Generate Payroll
          </NavLink>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col justify-between items-center mb-4 lg:flex-row">
        <input
          type="text"
          placeholder="Filter by Employee Name"
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md mr-2 mb-2 max-w-[200px]"
          value={filterEmployee}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterEmployee(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="number"
          placeholder="Month"
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md mr-2 mb-2 max-w-[200px]"
          value={filterMonth}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterMonth(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="number"
          placeholder="Year"
          className="p-2 border border-gray-300 dark:border-none dark:bg-gray-800 rounded-md mb-2 max-w-[200px]"
          value={filterYear}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterYear(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {loading ? (
        <p className="text-center text-blue-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="relative overflow-x-auto rounded-md">
          <Table className="w-full border rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Gross Salary</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPayroll.length > 0 ? (
                currentPayroll.map((payroll) => (
                  <TableRow key={payroll._id}>
                    <TableCell>{payroll.employee_name}</TableCell>
                    <TableCell>{payroll.month}</TableCell>
                    <TableCell>{payroll.year}</TableCell>
                    <TableCell>{formatSalary(payroll.gross_salary)}</TableCell>
                    <TableCell>{formatSalary(payroll.net_salary)}</TableCell>
                    <TableCell className={getStatusColor(payroll.status)}>
                      {payroll.status}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => navigate(`/dashboard/payroll/edit/${payroll._id}`)}
                        className="text-blue-500 hover:text-blue-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => exportSingleToPDF(payroll)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Export PDF
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No payroll records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-sm dark:bg-gray-800 bg-white rounded-l-md hover:bg-gray-400"
            >
              Previous
            </button>
            <span className="px-4">{currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= payrollData.length}
              className="p-2 text-sm dark:bg-gray-800 rounded-r-md hover:bg-gray-400"
            >
              Next
            </button>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              onClick={exportToExcel}
              className="bg-blue-500 text-white text-[13px] py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Excel
            </button>
            <button
              onClick={exportAllToPDF}
              className="bg-blue-500 text-white text-[13px] py-2 px-4 rounded-md hover:bg-blue-600"
            >
              PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollForm;
