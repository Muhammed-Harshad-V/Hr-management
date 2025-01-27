import { Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import APIClientPrivate from '@/api/axios';
import { useNavigate } from 'react-router-dom';

// Define types for form values
interface FormValues {
  name: string;
  email: string;
  position: string;
  department: string;
  salary: string;
  password: string;
  hireDate: string; // If hireDate is required as string for API
}

const AddEmployee = () => {
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    position: Yup.string().required('Position is required'),
    department: Yup.string().required('Department is required'),
    salary: Yup.number().required('Salary is required').min(0, 'Salary must be a positive number'),
    password: Yup.string().required('Password is required'),
    hireDate: Yup.date(), // If needed, can add specific validation for hire date
  });

  // Handle form submission
  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    try {
      // Send the form data to the backend API
      const response = await APIClientPrivate.post('/employeeService/employees', values);
      console.log('Employee created successfully:', response.data);

      // Optionally, you can reset the form or show a success message here
      actions.setSubmitting(false); // Stop submitting
      navigate('/employees'); // Navigate to employees page after successful submission
    } catch (error) {
      console.error('Error creating employee:', error);
      actions.setSubmitting(false); // Stop submitting in case of error
      alert('Error creating employee. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      <h2 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">Add Employee</h2>
      <Formik
        initialValues={{
          name: '',
          email: '',
          position: '',
          department: '',
          salary: '',
          password: '',
          hireDate: '', // Hire date field initialized as empty string
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

            {/* Email field */}
            <div className="form-field mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <Field
                type="email"
                id="email"
                name="email"
                className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400"
              />
              {touched.email && errors.email && <div className="text-red-500 text-sm mt-2">{errors.email}</div>}
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

            {/* Password field */}
            <div className="form-field mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <Field
                type="password"
                id="password"
                name="password"
                className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400"
              />
              {touched.password && errors.password && <div className="text-red-500 text-sm mt-2">{errors.password}</div>}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400"
              disabled={isSubmitting} // Disable button while submitting
            >
              {isSubmitting ? 'Submitting...' : 'Add Employee'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddEmployee;
