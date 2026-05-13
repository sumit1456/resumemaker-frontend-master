import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import { useSelector, useDispatch } from "react-redux";
import { logInUser } from "../../redux/store.js";
import { GoogleLogin } from '@react-oauth/google';

import LoadingAnimation from "../../components/PopUp/LoadingAnimation.jsx";
import api from "../../api/axios";

export default function Login({ setUserId }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const id = useSelector((state) => state.auth.userId);

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Regular email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }

    setLoading(true);
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        const response = await api.post(`/login`, {
          email,
          password
        });

        console.log("Response:", response.data);
        const { userId, jwt, message } = response.data; // Assuming 'jwt' is the field name, verify this!

        if (jwt) {
          sessionStorage.setItem('token', jwt);
        } else if (response.data.token) {
          sessionStorage.setItem('token', response.data.token);
        }

        if (userId) {
          sessionStorage.setItem('userId', userId);
        }

        window.showMessage("Success", message, "success", 1500);
        setUserId(userId);
        dispatch(logInUser(userId));
        navigate("/");
        return; // Success, exit function


      } catch (error) {
        console.error(`Login attempt ${attempt + 1} failed:`, error);

        const isRetryable = !error.response || (error.code === 'ECONNABORTED');

        if (isRetryable && attempt < MAX_RETRIES - 1) {
          attempt++;
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Final failure handling
        if (!navigator.onLine) {
          window.showMessage("Login Failed", "You are offline. Please check your internet connection.", "error");
        } else if (error.response) {
          window.showMessage("Login Failed", error.response.data?.message || "Invalid credentials", "error", 1500);
        } else if (error.code === 'ECONNABORTED' || error.request) {
          window.showMessage("Login Failed", "Server is not up", "error");
        } else {
          window.showMessage("Error", "Something went wrong.", "error");
        }
        break;
      }
    }
    setLoading(false);
  };

  // Google login
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        const response = await api.post(`/google-login`, {
          token: credentialResponse.credential
        });

        const { userId, jwt, message } = response.data;
        if (jwt) {
          sessionStorage.setItem('token', jwt);
        } else if (response.data.token) {
          sessionStorage.setItem('token', response.data.token);
        }

        if (userId) {
          sessionStorage.setItem('userId', userId);
        }

        dispatch(logInUser(userId));
        window.showMessage("Success", 'Login Successful', "success", 1500);
        navigate("/");
        return;

      } catch (error) {
        console.error(`Google Login attempt ${attempt + 1} failed:`, error);

        const isRetryable = !error.response || (error.code === 'ECONNABORTED');

        if (isRetryable && attempt < MAX_RETRIES - 1) {
          attempt++;
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        let msg = "Network Failure, Please check your connection";
        if (error.response) {
          msg = error.response.data?.message || "Server error";
        } else if (error.code === 'ECONNABORTED' || error.request) {
          msg = "Server is not up. Check your internet connection.";
        }
        window.showMessage('Login Failed', msg, 'error');
        break;
      }
    }
    setLoading(false);
  };

  const handleGoogleLoginError = () => {
    setMessage("Google login failed");
  };

  return (
    <div className="login-container">
      <LoadingAnimation message="Logging in..." show={loading} />
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
          <div className="headline">
            <h2>Welcome Back</h2>

          </div>

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
            <span>Click here to continue to</span>
            <GoogleLogin
              id="google-login-btn"
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              useOneTap
              style={{ display: 'none' }}
            />
          </div>

          {/* Hidden GoogleLogin component */}


        </form>
      </div>
    </div>
  );
}
