import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

export default function NavBar({ isLogged, setIsLogged }) {
  const handleLogout = () => {
    setIsLogged(false);
    // Add any token/session clearing logic here if needed
  };

  return (
    <nav className="nav-bar">
      <div className="left">
        <img src="./images/logo-s.png" alt="Resume Maker Logo" />
        <h1>Resume Maker</h1>
      </div>

      <div className="list">
        <p><Link to="/">Home</Link></p>
        <p><Link to="/templates">Templates</Link></p>
        <p><Link to="/about">About</Link></p>
        <p><Link to="/contact">Contact</Link></p>
      </div>

      <div className="box-icons">
        <a 
          href="https://www.linkedin.com/" 
          target="_blank" 
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <i className="fa-brands fa-linkedin-in"></i>
        </a>
        <a 
          href="https://github.com/" 
          target="_blank" 
          rel="noreferrer"
          aria-label="GitHub"
        >
          <i className="fa-brands fa-github"></i>
        </a>
        <a 
          href="mailto:someone@example.com"
          aria-label="Email"
        >
          <i className="fa-solid fa-envelope"></i>
        </a>
      </div>

      <div className="auth-buttons">
        {isLogged ? (
          <>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login">
              Login
            </Link>
            <Link to="/signup" className="btn-signup">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}