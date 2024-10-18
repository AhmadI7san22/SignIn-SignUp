import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(false);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get('https://signin-signup-a8q1.onrender.com/verifytoken, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsValid(true);
      } catch (error) {
        localStorage.removeItem('authToken'); // Remove invalid token
        setIsValid(false);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  if (!token || !isValid) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
