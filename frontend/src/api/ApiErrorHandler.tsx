// Utility function to handle API errors
import { AxiosError } from 'axios';

export const handleApiError = (err: AxiosError, setError: React.Dispatch<React.SetStateAction<string>>) => {
    if (err.response) {
      // If there is a response, check the status code to determine the error message
      switch (err.response.status) {
        case 400:
          setError("400 Bad Request. Please check your input.");
          break;
        case 401:     
          setError("401 Unauthorized. Please log in again.");
          break;
        case 404:
          setError("404 Not Found.");
          break;
        case 500:
          setError("500 Server Error. Please try again later.");
          break;
        default: {
          const errorMessage = (err.response.data as { message?: string }).message || "Something went wrong.";
          setError(`Error: ${errorMessage}`);
        }
      }
    } else if (err.request) {
      // If the request was made but no response was received
      setError("No response from the server. Please check your connection.");
    } else {
      // For any other errors
      setError(`Request failed: ${err.message}`);
    }
    console.error(err);
  };
  