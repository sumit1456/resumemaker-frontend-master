import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      {/* Animated background elements */}
      <div className="bg-decoration">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="hero-badge">
            <span>✨ About Us</span>
          </div>
          <h1 className="about-title">
            Resume Maker <span className="highlight">Pro</span>
          </h1>
          <p className="about-subtitle">
            Empowering job seekers with intelligent tools to create professional,
            ATS-optimized resumes that stand out in today's competitive market.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-detailed">
        <div className="section-header">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-description">
            Everything you need to create the perfect resume
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-detail-card">
            <div className="feature-number">01</div>
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast Builder</h3>
            <p>
              Create professional resumes in minutes with our intuitive drag-and-drop
              interface. No design skills required - just fill in your information and
              let our system handle the formatting.
            </p>
            <ul className="feature-list">
              <li>Real-time preview</li>
              <li>Auto-save functionality</li>
              <li>Instant PDF export</li>
            </ul>
          </div>

          <div className="feature-detail-card">
            <div className="feature-number">02</div>
            <div className="feature-icon">🎯</div>
            <h3>ATS Optimization</h3>
            <p>
              Beat applicant tracking systems with our intelligent keyword analyzer.
              We ensure your resume passes through ATS filters and reaches human
              recruiters every time.
            </p>
            <ul className="feature-list">
              <li>Keyword optimization</li>
              <li>Format compatibility check</li>
              <li>Industry-specific templates</li>
            </ul>
          </div>

          <div className="feature-detail-card">
            <div className="feature-number">03</div>
            <div className="feature-icon">🎨</div>
            <h3>Beautiful Templates</h3>
            <p>
              Choose from dozens of professionally designed templates crafted by
              recruitment experts. Each template is optimized for readability and
              visual impact.
            </p>
            <ul className="feature-list">
              <li>Multiple design styles</li>
              <li>Customizable colors</li>
              <li>Mobile-responsive layouts</li>
            </ul>
          </div>

          <div className="feature-detail-card">
            <div className="feature-number">04</div>
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Suggestions</h3>
            <p>
              Get intelligent recommendations for improving your resume content.
              Our AI analyzes your experience and suggests better ways to showcase
              your achievements.
            </p>
            <ul className="feature-list">
              <li>Content suggestions</li>
              <li>Grammar checking</li>
              <li>Impact enhancement</li>
            </ul>
          </div>

          <div className="feature-detail-card">
            <div className="feature-number">05</div>
            <div className="feature-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>
              Track your resume's performance with detailed analytics. See how many
              times it's been viewed, downloaded, and which sections get the most
              attention.
            </p>
            <ul className="feature-list">
              <li>View tracking</li>
              <li>Engagement metrics</li>
              <li>Optimization scores</li>
            </ul>
          </div>

          <div className="feature-detail-card">
            <div className="feature-number">06</div>
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>
              Your data is encrypted and stored securely. We never share your
              information with third parties. You maintain complete control over
              your resume data.
            </p>
            <ul className="feature-list">
              <li>End-to-end encryption</li>
              <li>GDPR compliant</li>
              <li>Data export options</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="developer-section">
        <div className="section-header">
          <h2 className="section-title">Meet the Developer</h2>
          <p className="section-description">
            The mind behind this project
          </p>
        </div>

        <div className="developer-card">
          <div className="developer-avatar">
            <div className="avatar-circle">
              <span className="avatar-text">SH</span>
            </div>
            <div className="status-badge">
              <div className="status-dot"></div>
              <span>Open to opportunities</span>
            </div>
          </div>

          <div className="developer-content">
            <h3 className="developer-name">Sumit Hatekar</h3>
            <p className="developer-title">Full Stack Developer</p>

            <div className="developer-bio">
              <p>
                I am passionate about designing and creating web applications using modern technologies. I love solving real-world problems, building innovative solutions, and continuously improving my skills.
              </p>
              <p>
                My expertise includes React.js, Spring Boot, Java, PostgreSQL, Oracle SQL, Hibernate/JPA, HTML, CSS, JavaScript, and cloud basics. I enjoy applying my knowledge to bring ideas to life and develop functional, user-friendly applications.
              </p>
            </div>

            <div className="tech-stack">
              <h4>Tech Stack</h4>
              <div className="tech-tags">
                <span className="tech-tag">React.js</span>
                <span className="tech-tag">Spring Boot</span>
                <span className="tech-tag">Java</span>
                <span className="tech-tag">PostgreSQL</span>
                <span className="tech-tag">Oracle SQL</span>
                <span className="tech-tag">HTML/CSS/JS</span>
                <span className="tech-tag">Hibernate/JPA</span>
                <span className="tech-tag">Cloud Basics</span>
              </div>
            </div>

            <div className="developer-stats">
              <div className="stat-item">
                <div className="stat-number">0</div>
                <div className="stat-label">Experience</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">5+</div>
                <div className="stat-label">Projects Built</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Dedication & Learning</div>
              </div>
            </div>

            <div className="developer-links">
              <a href="#" className="dev-link">
                <span className="link-icon">💼</span>
                <span>Portfolio</span>
              </a>
              <a href="#" className="dev-link">
                <span className="link-icon">🐙</span>
                <span>GitHub</span>
              </a>
              <a href="#" className="dev-link">
                <span className="link-icon">💬</span>
                <span>LinkedIn</span>
              </a>
              <a href="#" className="dev-link">
                <span className="link-icon">✉️</span>
                <span>Contact</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-content">
          <h2 className="mission-title">My Mission</h2>
          <p className="mission-text">
            To solve real-world problems, create innovative solutions, and design web applications that improve lives. I focus on building functional, user-friendly, and modern software while continuously learning and exploring new technologies.
          </p>
          <div className="mission-stats">
            <div className="mission-stat">
              <span className="mission-stat-number">10+</span>
              <span className="mission-stat-label">Projects in Progress</span>
            </div>
            <div className="mission-stat">
              <span className="mission-stat-number">1000+</span>
              <span className="mission-stat-label">Hours of Coding & Learning</span>
            </div>
            <div className="mission-stat">
              <span className="mission-stat-number">100%</span>
              <span className="mission-stat-label">Commitment</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to Build Innovative Projects?</h2>
        <p className="cta-text">
          Let's collaborate and create web applications that solve real problems
        </p>
        <a href="/signup" className="cta-button">
          Get Started
          <span className="btn-arrow">→</span>
        </a>
      </section>
    </div>
  );
}
