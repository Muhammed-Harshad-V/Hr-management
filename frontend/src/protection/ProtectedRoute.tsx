import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';


interface ProtectedRouteProps {
  children: React.ReactNode; // Explicitly define the type for children
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("login"); 

  let isAdmin = false;  // Set default as false (not admin)
  if (token === 'true') {
     isAdmin = true;
  }

  // If the user is an admin, render the protected children, else redirect them to the login page
  return isAdmin ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
