import { useState } from "react";
import { APIClient } from "@/api/axios";
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      // Make the API call to login
      const response = await APIClient.post("/employeeService/login", {
        email,
        password,
      });

      // If login is successful, store login status in localStorage
      localStorage.setItem("login", "true");


      console.log("Login successful:", response.data);
      navigate("/dashboard");

      // Redirect or perform other actions after successful login
      // Example: window.location.href = '/dashboard';
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password.");
    }
  };;

  return (
    <div className="h-[90vh] flex items-center justify-center bg-gray-100 dark:bg-less-black text-black dark:text-white">
      <div className="bg-white dark:bg-black shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="md:text-2xl font-bold mb-6 text-center text-xl">Login</h2>
        <form onSubmit={handleLogin} className="">
          <div>
            <label htmlFor="email" className="block md:text-sm text-xs mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border md:text-sm mb-4 text-xs rounded-md bg-gray-50 dark:bg-less-black dark:border-gray-700 dark:focus:ring-gray-600"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block md:text-sm text-xs mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border md:text-sm text-xs mb-4 rounded-md bg-gray-50 dark:bg-less-black dark:border-gray-700 dark:focus:ring-gray-600"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-500 md:text-sm text-xs">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md mb-4 mt-4"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
