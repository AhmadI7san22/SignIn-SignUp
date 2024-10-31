import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = { email, password };

    try {
      const response = await axios.post('https://signin-signup-a8q1.onrender.com/login', loginData);

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token); // Store token in localStorage
        if (!error) {
          navigate('/home', { state: { fromLogin: true } }); // Navigate to home page
        }
      } else {
        setError("Invalid credentials"); // Show error message if login fails
      }
    } catch (error) {
      console.error("Login error: ", error);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-4 rounded w-100" style={{ maxWidth: '400px' }}>
        <h2><center>Login</center></h2>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input 
              type="text"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              value={email} // Added value attribute
              className="form-control rounded-0"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <div className="input-group">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                name="password"
                value={password} // Added value attribute
                className="form-control rounded-0"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility improvement
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Login
          </button>
        </form>
        <p className="mt-3">Don't have an account?</p>
        <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Login;
