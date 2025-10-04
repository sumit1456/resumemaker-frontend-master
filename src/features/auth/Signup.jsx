import React, { useState } from "react";
import axios from "axios";
import './Signup.css';

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setMessage("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/signup",
        { username, email, password }
      );
      setMessage(`Signup successful! Welcome ${response.data.username}`);
    } catch (error) {
      if (error.response) {
        setMessage(`Server error: ${error.response.status}`);
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
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? "Signing up…" : "Sign Up"}
          </button>
          
          {message && (
            <p className={message.includes("successful") ? "success" : "error"}>
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
          Join thousands of professionals who have transformed their careers with our AI-powered resume builder. 
          Create stunning resumes that get noticed.
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