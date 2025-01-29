import { Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import APIClientPrivate from '@/api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Define types for form values
interface EmployeeFormValues {
  name: string;
  position: string;
  department: string;
  salary: string; // Assuming salary is passed as string to API
  hireDate: string;
  status: string;
}

// Define the response type for employee data (based on the structure from your API)
interface EmployeeData {
  name: string;
  position: string;
  department: string;
  salary: string;
  hireDate: string;
  status: string;
}

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the employee ID from the URL
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);

  // Fetch employee data by ID
  const fetchEmployeeData = async () => {
    try {
      const response = await APIClientPrivate.get(`/employeeService/employees/${id}`);
      setEmployeeData(response.data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      alert('Error fetching employee data.');
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    position: Yup.string().required('Position is required'),
    department: Yup.string().required('Department is required'),
    salary: Yup.number().required('Salary is required').min(0, 'Salary must be a positive number'),
    hireDate: Yup.date(),
    status: Yup.string().required('Status is required'),
  });

  // Handle form submission
  const handleSubmit = async (values: EmployeeFormValues, actions: FormikHelpers<EmployeeFormValues>) => {
    try {
      // Send the form data to the backend API to update the employee
      await APIClientPrivate.put(`/employeeService/employees/${id}`, values);
      // Navigate back to the employee list
      navigate('/dashboard/employees');
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error updating employee. Please try again.');
      actions.setSubmitting(false); // Stop submitting after error
    }
  };

  if (!employeeData) {
    return <p>Loading...</p>; // Display loading until employee data is fetched
  }

  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      <h2 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">Update Employee</h2>
      <Formik
        initialValues={{
          name: employeeData.name || '',
          position: employeeData.position || '',
          department: employeeData.department || '',
          salary: employeeData.salary || '',
          hireDate: employeeData.hireDate || '',
          status: employeeData.status || '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit} // Pass the handleSubmit function to Formik
      >
        {({ touched, errors, isSubmitting }) => (
          <Form className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            {/* Name field */}
            <div className="form-field mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <Field
                type="text"
                id="name"
                name="name"
                className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400"
              />
              {touched.name && errors.name && <div className="text-red-500 text-sm mt-2">{errors.name}</div>}
            </div>

            {/* Position field */}
            <div className="form-field mb-6">
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
              <Field
                type="text"
                id="position"
                name="position"
                className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400"
              />
              {touched.position && errors.position && <div className="text-red-500 text-sm mt-2">{errors.position}</div>}
            </div>

            {/* Department field */}
            <div className="form-field mb-6">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
              <Field
                type="text"
                id="department"
                name="department"
                className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400"
              />
              {touched.department && errors.department && <div className="text-red-500 text-sm mt-2">{errors.department}</div>}
            </div>

            {/* Salary field */}
            <div className="form-field mb-6">
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Salary</label>
              <Field
                type="number"
                id="salary"
                name="salary"
                className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400"
              />
              {touched.salary && errors.salary && <div className="text-red-500 text-sm mt-2">{errors.salary}</div>}
            </div>

            {/* Hire Date field */}
            <div className="form-field mb-6">
              <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hire Date</label>
              <Field
                type="date"
                id="hireDate"
                name="hireDate"
                className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400"
              />
            </div>

            {/* Status field */}
            <div className="form-field mb-6">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <Field
                type="text"
                id="status"
                name="status"
                className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400"
              />
              {touched.status && errors.status && <div className="text-red-500 text-sm mt-2">{errors.status}</div>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400"
              disabled={isSubmitting} // Disable the button while submitting
            >
              {isSubmitting ? 'Updating...' : 'Update Employee'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditEmployee;
