import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css';
import { useSelector, useDispatch } from "react-redux";
import { logInUser } from "../../redux/store.js";
import { GoogleLogin } from '@react-oauth/google';

import LoadingAnimation from "../../components/PopUp/LoadingAnimation.jsx";

const API_BASE_URL = 'https://resumemaker-1.onrender.com';
const API_BASE_URL2 = 'http://localhost:8080';

export default function Login({ setUserId }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const id = useSelector((state)=> state.auth.userId);

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

  try {
       const response = await axios.post(`${API_BASE_URL}/login`, {
         email,
         password
       });
   
       console.log("User ID from response:", response.data.userId);
   
       // SUCCESS MESSAGE
       window.showMessage("Success", response.data.message, "success", 1500);
   
       // SAVE USER ID
       setUserId(response.data.userId);
       dispatch(logInUser(response.data.userId));
   
       // REDIRECT
       navigate("/");
   
  }    catch (error) {
   
       // OFFLINE
       if (!navigator.onLine) {
         window.showMessage(
           "Login Failed",
           "You are offline. Please check your internet connection.",
           "error"
         );
       }
   
       // SERVER RETURNED ERROR (403)
       else if (error.response) {
         window.showMessage(
           "Login Failed",
           error.response.data?.message || "Invalid credentials",
           "error",1500
         );
       }
   
       // NO RESPONSE FROM SERVER (backend unreachable)
       else if (error.request) {
         window.showMessage(
           "Login Failed",
           "Cannot reach server. Please try again.",
           "error"
         );
       }
   
       // ANY OTHER ERROR
       else {
         window.showMessage(
           "Error",
           "Something went wrong.",
           "error"
         );
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


     console.log(`${response.data} this is the responce `);
     
      

      dispatch(logInUser(response.data));
      window.showMessage("Success", response.data.message, "success", 1500);
      navigate("/");
    } catch(error) {
     let msg;
   
     if (error.response) {
       msg = error.response.data?.message || "Server error";
     }
     else if (error.request) {
       msg = "Cannot connect to server. Check your internet connection.";
     }
     else {
       msg = "Network Failure, Please check your connection";
     }
   
     window.showMessage('Login Failed', msg, 'error');
   }
 finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    setMessage("Google login failed");
  };

  return (
    <div className="login-container">
      <LoadingAnimation message="Logging in..." show={loading}/>
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
