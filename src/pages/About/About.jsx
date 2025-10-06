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
            The mind behind Resume Maker Pro
          </p>
        </div>

        <div className="developer-card">
          <div className="developer-avatar">
            <div className="avatar-circle">
              <span className="avatar-text">DEV</span>
            </div>
            <div className="status-badge">
              <div className="status-dot"></div>
              <span>Available for projects</span>
            </div>
          </div>

          <div className="developer-content">
            <h3 className="developer-name">John Anderson</h3>
            <p className="developer-title">Full Stack Developer & Product Designer</p>

            <div className="developer-bio">
              <p>
                Passionate about creating tools that make a real difference in people's
                careers. With over 5 years of experience in web development and a deep
                understanding of recruitment processes, I built Resume Maker Pro to help
                job seekers present their best selves.
              </p>
              <p>
                This project combines modern web technologies with user-centric design
                principles to deliver an intuitive, powerful resume building experience.
              </p>
            </div>

            <div className="tech-stack">
              <h4>Tech Stack</h4>
              <div className="tech-tags">
                <span className="tech-tag">React</span>
                <span className="tech-tag">Node.js</span>
                <span className="tech-tag">Express</span>
                <span className="tech-tag">MongoDB</span>
                <span className="tech-tag">JWT Auth</span>
                <span className="tech-tag">AWS S3</span>
                <span className="tech-tag">REST API</span>
                <span className="tech-tag">Stripe</span>
              </div>
            </div>

            <div className="developer-stats">
              <div className="stat-item">
                <div className="stat-number">5+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Resumes Created</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">User Satisfaction</div>
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
          <h2 className="mission-title">Our Mission</h2>
          <p className="mission-text">
            To democratize access to professional resume creation tools and help every
            job seeker present their skills and experience in the best possible light.
            We believe that everyone deserves a chance to showcase their talents
            effectively, regardless of their design skills or budget.
          </p>
          <div className="mission-stats">
            <div className="mission-stat">
              <span className="mission-stat-number">10K+</span>
              <span className="mission-stat-label">Active Users</span>
            </div>
            <div className="mission-stat">
              <span className="mission-stat-number">50K+</span>
              <span className="mission-stat-label">Resumes Created</span>
            </div>
            <div className="mission-stat">
              <span className="mission-stat-number">95%</span>
              <span className="mission-stat-label">Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to Build Your Perfect Resume?</h2>
        <p className="cta-text">
          Join thousands of successful job seekers who landed their dream jobs
        </p>
        <a href="/signup" className="cta-button">
          Get Started Free
          <span className="btn-arrow">→</span>
        </a>
      </section>
    </div>
  );
}