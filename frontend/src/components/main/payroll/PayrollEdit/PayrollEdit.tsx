import { useState, useEffect } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import APIClientPrivate from "@/api/axios";
import { useNavigate, useParams } from "react-router-dom";

// Define TypeScript interface for payroll data
interface PayrollData {
  employee_name: string;
  month: string;
  year: string;
  gross_salary: number;
  net_salary: number;
  status: string;
}

const PayrollEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the payroll ID from the URL
  const [payrollData, setPayrollData] = useState<PayrollData | null>(null);

  // Fetch payroll data by ID
  const fetchPayrollData = async () => {
    try {
      const response = await APIClientPrivate.get(`/payrollService/payroll/${id}`);
      setPayrollData(response.data);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      alert('Error fetching payroll data.');
    }
  };

  useEffect(() => {
    if (id) {
      fetchPayrollData();
    }
  }, [id]);

  // Validation schema using Yup (only validating the status)
  const validationSchema = Yup.object({
    status: Yup.string().required('Status is required'),
  });

  // Handle form submission
  const handleSubmit = async (values: PayrollData) => {
    try {
      await APIClientPrivate.put(`/payrollService/payroll/${id}`, values);
      navigate('/dashboard/payroll'); // Redirect to the payroll list after successful update
    } catch (error) {
      console.error('Error updating payroll:', error);
      alert('Error updating payroll. Please try again.');
    }
  };

  // Check if payroll data is available
  if (!payrollData) {
    return <p>Loading...</p>; // Display loading until payroll data is fetched
  }

  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      <h2 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">Update Payroll</h2>
      <Formik
        initialValues={{
          employee_name: payrollData.employee_name || '',
          month: payrollData.month || '',
          year: payrollData.year || '',
          gross_salary: payrollData.gross_salary || 0,
          net_salary: payrollData.net_salary || 0,
          status: payrollData.status || '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ touched, errors }) => (
          <Form className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            {/* Employee Name field - Read-only */}
            <div className="form-field mb-6">
              <label htmlFor="employee_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Employee Name</label>
              <Field
                type="text"
                id="employee_name"
                name="employee_name"
                value={payrollData.employee_name || ''}
                className="w-full p-4 mt-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-white dark:border-gray-600 cursor-not-allowed"
                readOnly
              />
            </div>

            {/* Month field - Read-only */}
            <div className="form-field mb-6">
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Month</label>
              <Field
                type="number"
                id="month"
                name="month"
                value={payrollData.month || ''}
                className="w-full p-4 mt-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-white dark:border-gray-600 cursor-not-allowed"
                readOnly
              />
            </div>

            {/* Year field - Read-only */}
            <div className="form-field mb-6">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
              <Field
                type="number"
                id="year"
                name="year"
                value={payrollData.year || ''}
                className="w-full p-4 mt-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-white dark:border-gray-600 cursor-not-allowed"
                readOnly
              />
            </div>

            {/* Gross Salary field - Read-only */}
            <div className="form-field mb-6">
              <label htmlFor="gross_salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gross Salary</label>
              <Field
                type="number"
                id="gross_salary"
                name="gross_salary"
                value={payrollData.gross_salary || ''}
                className="w-full p-4 mt-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-white dark:border-gray-600 cursor-not-allowed"
                readOnly
              />
            </div>

            {/* Net Salary field - Read-only */}
            <div className="form-field mb-6">
              <label htmlFor="net_salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Net Salary</label>
              <Field
                type="number"
                id="net_salary"
                name="net_salary"
                value={payrollData.net_salary || ''}
                className="w-full p-4 mt-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-white dark:border-gray-600 cursor-not-allowed"
                readOnly
              />
            </div>

            {/* Status field - Dropdown */}
            <div className="form-field mb-6">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <Field
                as="select"
                id="status"
                name="status"
                className="w-full p-4 mt-2 border border-gray-300 rounded-md bg-white text-gray-600 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="pending">Pending</option>
                <option value="processed">Processed</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </Field>
              {touched.status && errors.status && <div className="text-red-500 text-sm mt-2">{errors.status}</div>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400"
            >
              Update Payroll
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PayrollEdit;
