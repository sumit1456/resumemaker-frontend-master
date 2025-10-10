import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

export default function NavBar({ isLogged, setIsLogged }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    setIsLogged(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <nav className="nav-bar">
        <div className="left">
          <img src="./images/logo-s.png" alt="Resume Maker Logo" />
          <h1>Resume Maker</h1>
        </div>

        {/* Hamburger for mobile */}
        <div className="hamburger" onClick={toggleSidebar}>
          <i className="fa-solid fa-bars"></i>
        </div>

        {/* Desktop links */}
        <div className="list">
          <p><Link to="/">Home</Link></p>
          <p><Link to="/templates">Templates</Link></p>
          <p><Link to="/about">About</Link></p>
          <p><Link to="/user-templates">User Templates</Link></p>
        </div>

        <div className="box-icons">
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <i className="fa-brands fa-linkedin-in"></i>
          </a>
          <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub">
            <i className="fa-brands fa-github"></i>
          </a>
          <a href="mailto:someone@example.com" aria-label="Email">
            <i className="fa-solid fa-envelope"></i>
          </a>
        </div>

        <div className="auth-buttons">
          {isLogged ? (
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/signup" className="btn-signup">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Sidebar for mobile */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <p><Link to="/" onClick={toggleSidebar}>Home</Link></p>
        <p><Link to="/templates" onClick={toggleSidebar}>Templates</Link></p>
        <p><Link to="/about" onClick={toggleSidebar}>About</Link></p>
        <p><Link to="/user-templates" onClick={toggleSidebar}>User Templates</Link></p>
      </div>

      {/* Overlay when sidebar is open */}
      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
}
