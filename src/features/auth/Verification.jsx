import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Test.css";



const API_BASE_URL2 = 'http://localhost:8080';
const API_BASE_URL = "https://resumemaker-1.onrender.com";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Verifying your email...");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      // Extract token and email from URL query parameters
      console.log("Starting the verification");

      const token = searchParams.get("token");
      console.log(token);

      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link. Missing required parameters.");
        return;
      }

      const MAX_RETRIES = 3;
      let attempt = 0;

      while (attempt < MAX_RETRIES) {
        try {
          const response = await axios.get(`${API_BASE_URL}/verify`, {
            params: { token },
            timeout: 30000
          });

          setStatus("success");
          setMessage(response.data.message || "Email verified successfully!");

          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate("/login");
          }, 3000);
          return;

        } catch (error) {
          console.error(`Verification attempt ${attempt + 1} failed:`, error);

          const isRetryable = !error.response || (error.code === 'ECONNABORTED');

          if (isRetryable && attempt < MAX_RETRIES - 1) {
            attempt++;
            const delay = Math.pow(2, attempt - 1) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          setStatus("error");
          if (error.response) {
            setMessage(error.response.data.message || "Verification failed. Please try again.");
          } else if (error.code === 'ECONNABORTED' || error.request) {
            setMessage("Server is not up. Please check your connection.");
          } else {
            setMessage("Network error. Please check your connection.");
          }
          break;
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const handleReturnToSignup = () => {
    navigate("/signup");
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="icon-container">
          {status === "verifying" && (
            <div className="spinner"></div>
          )}
          {status === "success" && (
            <svg className="icon success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
            </svg>
          )}
          {status === "error" && (
            <svg className="icon error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2" strokeLinecap="round" />
              <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>

        <h1 className="verification-title">
          {status === "verifying" && "Verifying Your Email"}
          {status === "success" && "Email Verified!"}
          {status === "error" && "Verification Failed"}
        </h1>

        <p className="verification-message">{message}</p>

        <div className="button-group">
          {status === "success" && (
            <button onClick={handleGoToLogin} className="primary-button">
              Go to Login
            </button>
          )}
          {status === "error" && (
            <>
              <button onClick={handleReturnToSignup} className="primary-button">
                Return to Signup
              </button>
              <button onClick={handleGoToLogin} className="secondary-button">
                Try Login Anyway
              </button>
            </>
          )}
        </div>

        {status === "success" && (
          <p className="redirect-message">
            Redirecting to login in 3 seconds...
          </p>
        )}
      </div>
    </div>
  );

}