import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "../../features/auth/Login.jsx";
import Signup from "../../features/auth/Signup.jsx";
import ResumeDashboard from "../Dashboard/Dashboard.jsx";
import "./css-files/HomePage.css";

export default function HomePage({
  isLogged,
  setIsLogged,
  userId,
  setUserId,
}) {
  return (
    <div className="home-container">
      {/* Animated background elements */}
      <div className="bg-decoration">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      {/* Welcome banner */}
      {isLogged && userId && (
        <div className="welcome-banner">
          <div className="welcome-content">
            <div className="welcome-icon">👋</div>
            <div className="welcome-text">
              <span>Welcome back!</span>
              <div className="user-id">ID: <strong>{userId}</strong></div>
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<MainLanding isLogged={isLogged} userId={userId} />}
        />
        <Route
          path="login"
          element={
            <Login setIsLogged={setIsLogged} setUserId={setUserId} />
          }
        />
        <Route path="signup" element={<Signup />} />
        <Route
          path="dashboard"
          element={<ResumeDashboard userId={userId} />}
        />
      </Routes>
    </div>
  );
}

function MainLanding({ isLogged, userId }) {
  return (
    <div className="main-landing">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span>✨ AI-Powered Resume Builder</span>
          </div>
          
          <h1 className="hero-title">
            Build Your Perfect{" "}
            <span className="highlight">Resume</span>
          </h1>
          
          <p className="hero-subtitle">
            Create professional, ATS-friendly resumes in minutes with our 
            intelligent builder. Stand out from the crowd and land your dream job.
          </p>

          {isLogged && userId ? (
            <div className="user-actions">
              <div className="user-status">
                <div className="status-indicator"></div>
                <span>Logged in as ID: <strong>{userId}</strong></span>
              </div>
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
                <span className="btn-arrow">→</span>
              </Link>
            </div>
          ) : (
            <div className="auth-actions">
              <Link to="/login" className="btn btn-primary">
                Get Started
                <span className="btn-arrow">→</span>
              </Link>
              <Link to="/signup" className="btn btn-secondary">
                Create Account
              </Link>
            </div>
          )}
        </div>

        <div className="hero-visual">
          <div className="resume-preview">
            <div className="resume-header"></div>
            <div className="resume-lines">
              <div className="line line-1"></div>
              <div className="line line-2"></div>
              <div className="line line-3"></div>
              <div className="line line-4"></div>
              <div className="line line-5"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Lightning Fast</h3>
          <p>Create resumes in minutes, not hours</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>ATS Optimized</h3>
          <p>Pass applicant tracking systems</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎨</div>
          <h3>Beautiful Templates</h3>
          <p>Professional designs that impress</p>
        </div>
      </div>
    </div>
  );
}