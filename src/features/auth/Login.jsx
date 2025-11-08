import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css';
import { useSelector, useDispatch } from "react-redux";
import { logInUser } from "../../redux/store.js";
import { GoogleLogin } from '@react-oauth/google';

const API_BASE_URL = 'https://resumemaker-1.onrender.com';
const API_BASE_URL2 = 'http://localhost:8080';

export default function Login({ setUserId }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Regular email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });

      dispatch(logInUser());
      setUserId(response.data.id);
      setMessage("Login successful!");
      navigate("/");
    } catch (error) {
      if (error.response) {
        setMessage(`Login failed: ${error.response.data}`);
      } else {
        setMessage(`Request error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      const response = await axios.post(`${API_BASE_URL}/google-login`, {
        token: credentialResponse.credential
      });

      dispatch(logInUser());
      setUserId(response.data.id);
      setMessage("Google login successful!");
      navigate("/");
    } catch (error) {
      setMessage("Google login failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    setMessage("Google login failed");
  };

  return (
    <div className="login-container">
      {/* Left Side - Branding */}
      <div className="login-header">
        <h1>Resume Maker</h1>
        <p className="login-tagline">AI for Career Success</p>
        <p className="login-subtagline">
          Create professional, ATS-friendly resumes in minutes with our intelligent resume builder. 
          Stand out from the crowd and land your dream job.
        </p>
        <ul className="feature-list">
          <li>AI-powered content suggestions</li>
          <li>Professional templates</li>
          <li>ATS optimization</li>
          <li>Export in multiple formats</li>
        </ul>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>
          <p className="form-subtitle">Login to continue building your career</p>
          
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
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? "Logging in…" : "Log In"}
          </button>

          {/* Separator */}
          <p className="separator">or</p>

          {/* Google Login Button */}
          <div 
            className="google-login-btn" 
            onClick={() => document.getElementById('google-login-btn').click()}
          >
            <span>Continue with Google</span>
          </div>

          {/* Hidden GoogleLogin component */}
          <GoogleLogin
            id="google-login-btn"
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            useOneTap
            style={{ display: '' }}
          />

          {message && (
            <p className={message.includes("successful") ? "success" : "error"}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
