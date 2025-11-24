import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ only useNavigate (not Navigate)
import "./Signup.css";

const API_BASE_URL = "https://resumemaker-1.onrender.com";
const API_BASE_URL2 = 'http://localhost:8080';

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate(); // ✅ initialize the hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setMessage("All fields are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, {
        username,
        email,
        password
      });

      console.log("printing the response from the backend in signup");
    
      const data = response.data;
      setSuccess(data.success);
      if (!success) {
          window.showMessage(res.data.message, 'error');
          throw new Error(res.data.message);
      }
      


      window.showMessage('Check your email for verification', 'success');
    } catch (error) {
      if (error.response) {
        setMessage(`Server error: ${error.response.data.message || error.response.status}`);
      } else {
        setMessage(`Request failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Left Side - Signup Form */}
      <div className="signup-form">
        <form onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          <p className="form-subtitle">Join us and start building your professional resume</p>

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing up…" : "Sign Up"}
          </button>

          {message && (
            <p className={success ? "success" : "error"}>
              {message}
            </p>
          )}
        </form>
      </div>

      {/* Right Side - Branding */}
      <div className="signup-header">
        <h1>Resume Maker</h1>
        <p className="signup-tagline">Start Your Journey</p>
        <p className="signup-subtagline">
          Join thousands of professionals who have transformed their careers with our AI-powered
          resume builder. Create stunning resumes that get noticed.
        </p>
        <ul className="benefit-list">
          <li>Free to start, upgrade anytime</li>
          <li>Multiple professional templates</li>
          <li>Real-time preview and editing</li>
          <li>Download in PDF, DOCX formats</li>
        </ul>
      </div>
    </div>
  );
}
