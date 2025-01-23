import { Field, Form, Formik, FieldArray, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import APIClientPrivate from '@/api/axios';

// Type for Deductions
interface Deduction {
  type: string;
  amount: number;
}

// Type for Form values
interface FormValues {
  month: number;
  year: number;
  hourlyRate: number;
  deductions: Deduction[];
  bonus: number;
}

const GeneratePayroll = () => {
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    month: Yup.number().required('Month is required').min(1, 'Month must be between 1 and 12').max(12, 'Month must be between 1 and 12'),
    year: Yup.number().required('Year is required').min(2020, 'Year must be 2020 or later'),
    hourlyRate: Yup.number().required('Hourly Rate is required').min(0, 'Hourly rate must be a positive number'),
    deductions: Yup.array().of(
      Yup.object({
        type: Yup.string().required('Deduction type is required'),
        amount: Yup.number().required('Deduction amount is required').min(0, 'Deduction amount must be positive'),
      })
    ),
    bonus: Yup.number().required('Bonus is required').min(0, 'Bonus must be a positive number'),
  });

  // Handle form submission
  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      // Send the form data to the backend API (update the URL accordingly)
      const response = await APIClientPrivate.post('/payrollService/payroll/generate', values);
      console.log('Payroll generated successfully:', response.data);

      // Optionally, you can reset the form or show a success message here
      navigate('/payroll');
    } catch (error) {
      console.error('Error generating payroll:', error);
      alert('Error generating payroll. Please try again.');
    } finally {
      setSubmitting(false); // Stop the submitting spinner when the form is done submitting
    }
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      <h2 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">Generate Payroll</h2>
      <Formik
        initialValues={{
          month: 1,
          year: 2025,
          hourlyRate: 20,
          deductions: [
            { type: 'Tax', amount: 100 },
            { type: 'Health Insurance', amount: 50 },
          ],
          bonus: 200,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit} // Pass the handleSubmit function to Formik
      >
        {({ values, touched, errors, setFieldValue }) => (
          <Form className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            {/* Month field */}
            <div className="form-field mb-6">
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Month</label>
              <Field
                type="number"
                id="month"
                name="month"
                className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400"
              />
              {touched.month && errors.month && <div className="text-red-500 text-sm mt-2">{errors.month}</div>}
            </div>

            {/* Year field */}
            <div className="form-field mb-6">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
              <Field
                type="number"
                id="year"
                name="year"
                className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400"
              />
              {touched.year && errors.year && <div className="text-red-500 text-sm mt-2">{errors.year}</div>}
            </div>

            {/* Hourly Rate field */}
            <div className="form-field mb-6">
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hourly Rate</label>
              <Field
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400"
              />
              {touched.hourlyRate && errors.hourlyRate && <div className="text-red-500 text-sm mt-2">{errors.hourlyRate}</div>}
            </div>

            {/* Bonus field */}
            <div className="form-field mb-6">
              <label htmlFor="bonus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bonus</label>
              <Field
                type="number"
                id="bonus"
                name="bonus"
                className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400"
              />
              {touched.bonus && errors.bonus && <div className="text-red-500 text-sm mt-2">{errors.bonus}</div>}
            </div>

            {/* Deductions field */}
            <div className="form-field mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deductions</label>
              <FieldArray
                name="deductions"
                render={arrayHelpers => (
                  <div>
                    {values.deductions && values.deductions.length > 0 ? (
                      values.deductions.map((deduction, index) => (
                        <div key={index} className="flex space-x-4 mb-4">
                          <div className="w-1/2">
                            <Field
                              name={`deductions[${index}].type`}
                              className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400"
                              placeholder="Deduction Type"
                            />
                            {touched.deductions?.[index]?.type && errors.deductions?.[index]?.type && (
                              <div className="text-red-500 text-sm mt-2">{errors.deductions[index].type}</div>
                            )}
                          </div>
                          <div className="w-1/2">
                            <Field
                              type="number"
                              name={`deductions[${index}].amount`}
                              className="w-full p-4 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400"
                              placeholder="Amount"
                            />
                            {touched.deductions?.[index]?.amount && errors.deductions?.[index]?.amount && (
                              <div className="text-red-500 text-sm mt-2">{errors.deductions[index].amount}</div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}  // remove deduction
                            className="text-red-500 mt-4"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : null}
                    <button
                      type="button"
                      onClick={() => arrayHelpers.push({ type: '', amount: 0 })}  // Add new deduction
                      className="text-indigo-600 mt-4"
                    >
                      Add Deduction
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400"
            >
              Generate Payroll
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default GeneratePayroll;
