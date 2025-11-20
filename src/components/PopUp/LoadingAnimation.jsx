import React, { useState } from 'react';

const LoadingAnimation = ({ message = "Loading...", show = true }) => {
  if (!show) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="loading-spinner-wrapper">
          <div className="loading-spinner-outer"></div>
          <div className="loading-spinner-middle"></div>
          <div className="loading-spinner-inner"></div>
          <div className="loading-pulse"></div>
        </div>
        <div className="loading-message">{message}</div>
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
      <div className="loading-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
    </div>
  );
};

// Demo Component
const App = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [customMessage, setCustomMessage] = useState("Analyzing your resume...");
  const [inputMessage, setInputMessage] = useState("");

  const loadingMessages = [
    "Analyzing your resume...",
    "Matching with job description...",
    "Generating insights...",
    "Processing data...",
    "Optimizing content...",
    "Preparing results...",
  ];

  const handleShowLoading = (msg) => {
    setCustomMessage(msg);
    setShowLoading(true);
    setTimeout(() => setShowLoading(false), 3000);
  };

  return (
    <div className="demo-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="demo-content">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          <span>LOADING COMPONENT</span>
        </div>
        
        <h1 className="hero-title">
          CUSTOM LOADING
          <span className="gradient-text">ANIMATION</span>
        </h1>
        
        <p className="hero-subtitle">
          Test the loading animation with custom messages matching your black and white theme
        </p>

        <div className="controls">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter custom message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="message-input"
            />
            <button
              onClick={() => handleShowLoading(inputMessage || "Loading...")}
              className="trigger-btn"
            >
              <span className="btn-text">SHOW LOADING →</span>
            </button>
          </div>

          <div className="preset-section">
            <h3 className="preset-title">QUICK PRESETS</h3>
            <div className="preset-grid">
              {loadingMessages.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => handleShowLoading(msg)}
                  className="preset-btn"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowLoading(!showLoading)}
            className="toggle-btn"
          >
            {showLoading ? "HIDE LOADING" : "SHOW LOADING"}
          </button>
        </div>
      </div>

      <LoadingAnimation message={customMessage} show={showLoading} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #000000;
          color: #ffffff;
          overflow-x: hidden;
        }

        /* Animated Background */
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.12;
          animation: float 20s infinite ease-in-out;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #ffffff, transparent);
          top: -10%;
          left: -10%;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #ffffff, transparent);
          bottom: -10%;
          right: -5%;
          animation-delay: 5s;
        }

        .orb-3 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, #ffffff, transparent);
          top: 50%;
          right: 10%;
          animation-delay: 10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 30px) scale(0.9); }
        }

        /* Loading Overlay */
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.96);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.4s ease-out;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          animation: scaleIn 0.6s ease-out;
          position: relative;
          z-index: 2;
        }

        /* Spinner */
        .loading-spinner-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .loading-spinner-outer,
        .loading-spinner-middle,
        .loading-spinner-inner {
          position: absolute;
          border-radius: 50%;
          border: 3px solid transparent;
        }

        .loading-spinner-outer {
          width: 120px;
          height: 120px;
          border-top-color: #ffffff;
          border-right-color: #ffffff;
          animation: spin 1.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          top: 0;
          left: 0;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .loading-spinner-middle {
          width: 85px;
          height: 85px;
          border-top-color: rgba(255, 255, 255, 0.7);
          border-left-color: rgba(255, 255, 255, 0.7);
          animation: spin 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse;
          top: 17.5px;
          left: 17.5px;
        }

        .loading-spinner-inner {
          width: 50px;
          height: 50px;
          border-top-color: rgba(255, 255, 255, 0.4);
          border-bottom-color: rgba(255, 255, 255, 0.4);
          animation: spin 1.2s linear infinite;
          top: 35px;
          left: 35px;
        }

        .loading-pulse {
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
          top: 0;
          left: 0;
          animation: pulse-ring 2s ease-out infinite;
        }

        /* Message */
        .loading-message {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 1px;
          text-align: center;
          animation: fadeInUp 0.8s ease-out 0.2s both;
          max-width: 500px;
          padding: 0 20px;
          text-transform: uppercase;
          font-family: 'Space Grotesk', sans-serif;
        }

        /* Dots */
        .loading-dots {
          display: flex;
          gap: 10px;
          animation: fadeIn 0.8s ease-out 0.4s both;
        }

        .dot {
          width: 10px;
          height: 10px;
          background: #ffffff;
          border-radius: 50%;
          animation: bounce 1.4s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        /* Particles */
        .loading-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 1;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: particle-float 15s infinite ease-in-out;
        }

        .particle:nth-child(1) { left: 10%; top: 20%; animation-delay: 0s; }
        .particle:nth-child(2) { left: 50%; top: 40%; animation-delay: 3s; }
        .particle:nth-child(3) { left: 80%; top: 60%; animation-delay: 6s; }
        .particle:nth-child(4) { left: 30%; top: 80%; animation-delay: 9s; }

        /* Demo Styles */
        .demo-container {
          min-height: 100vh;
          padding: 80px 40px;
          position: relative;
          z-index: 1;
        }

        .demo-content {
          max-width: 900px;
          margin: 0 auto;
          animation: fadeInUp 1s ease-out;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          margin-bottom: 24px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          animation: fadeIn 0.8s ease-out;
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: #ffffff;
          border-radius: 50%;
          animation: blink 1.5s ease-in-out infinite;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 24px;
          font-family: 'Space Grotesk', sans-serif;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .gradient-text {
          display: block;
          background: linear-gradient(135deg, #ffffff, #666666);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: glow 2s ease-in-out infinite;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #999999;
          margin-bottom: 48px;
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .controls {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .input-group {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          animation: fadeInUp 0.8s ease-out 0.6s both;
        }

        .message-input {
          flex: 1;
          min-width: 300px;
          padding: 16px 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          color: #ffffff;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
        }

        .message-input:focus {
          outline: none;
          border-color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .message-input::placeholder {
          color: #666666;
        }

        .trigger-btn {
          padding: 16px 32px;
          background: #ffffff;
          color: #000000;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: 'Space Grotesk', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .trigger-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.1);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .trigger-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .trigger-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
        }

        .btn-text {
          position: relative;
          z-index: 1;
        }

        .preset-section {
          animation: fadeInUp 0.8s ease-out 0.8s both;
        }

        .preset-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 16px;
          font-family: 'Space Grotesk', sans-serif;
        }

        .preset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 12px;
        }

        .preset-btn {
          padding: 14px 20px;
          font-size: 13px;
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .preset-btn:hover {
          background: #ffffff;
          color: #000000;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
          border-color: #ffffff;
        }

        .toggle-btn {
          align-self: flex-start;
          padding: 14px 28px;
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: 'Space Grotesk', sans-serif;
          animation: fadeInUp 0.8s ease-out 1s both;
        }

        .toggle-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 255, 255, 0.15);
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @keyframes particle-float {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% {
            transform: translate(100px, -800px);
            opacity: 0;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .demo-container {
            padding: 60px 30px;
          }

          .hero-title {
            font-size: 3rem;
          }

          .message-input {
            min-width: 100%;
          }

          .preset-grid {
            grid-template-columns: 1fr;
          }

          .loading-spinner-wrapper {
            width: 100px;
            height: 100px;
          }

          .loading-spinner-outer {
            width: 100px;
            height: 100px;
          }

          .loading-spinner-middle {
            width: 70px;
            height: 70px;
            top: 15px;
            left: 15px;
          }

          .loading-spinner-inner {
            width: 40px;
            height: 40px;
            top: 30px;
            left: 30px;
          }

          .loading-pulse {
            width: 100px;
            height: 100px;
          }

          .loading-message {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default App;