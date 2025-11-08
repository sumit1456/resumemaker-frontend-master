import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useSelector, useDispatch } from "react-redux";
import { logInUser } from "../../redux/store.js";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

const API_BASE_URL = "https://resumemaker-1.onrender.com";

function LoginInner({ setUserId }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setMessage(error.response ? `Login failed: ${error.response.data}` : `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Login Hook
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const response = await axios.post(`${API_BASE_URL}/google-login`, {
          token: tokenResponse.credential || tokenResponse.access_token,
        });
        dispatch(logInUser());
        setUserId(response.data.id);
        setMessage("Google login successful!");
        navigate("/");
      } catch (error) {
        console.error(error);
        setMessage("Google login failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setMessage("Google login failed"),
  });

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Resume Maker</h1>
        <p className="login-tagline">AI for Career Success</p>
        <p className="login-subtagline">
          Create professional, ATS-friendly resumes in minutes with our intelligent resume builder.
        </p>
        <ul className="feature-list">
          <li>AI-powered content suggestions</li>
          <li>Professional templates</li>
          <li>ATS optimization</li>
          <li>Export in multiple formats</li>
        </ul>
      </div>

      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <div className="headline">
            <h2>Welcome Back</h2>
          </div>

          <p className="form-subtitle">Login to continue building your career</p>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in…" : "Log In"}
          </button>

          <p className="separator">or</p>

          {/* ✅ Custom Google Button */}
          <div className="google-login-btn" onClick={() => googleLogin()}>
            <span>Continue with Google</span>
          </div>

          {message && (
            <p className={message.includes("successful") ? "success" : "error"}>{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default function Login(props) {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <LoginInner {...props} />
    </GoogleOAuthProvider>
  );
}
