import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null); // Start as `null` to indicate loading state
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('https://signin-signup-a8q1.onrender.com/verifytoken', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsValid(response.data.isValid); // Adjust to response structure
      } catch (error) {
        localStorage.removeItem('authToken');
        setIsValid(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setIsValid(false); // No token, set invalid
    }
  }, [token]);

  // Render loading indicator until `isValid` is confirmed true or false
  if (isValid === null) return <div>Loading...</div>;

  return isValid ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
