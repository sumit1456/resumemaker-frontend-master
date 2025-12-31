import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import './Templateshowcase.css';
import modernImg from './images/modern.png';
import classicImg from './images/classic.png'
import acad from './images/academicscholar.png'
import executive from './images/executive.png'
import ats from './images/ats.png'
import tech from './images/tech.png'
import creative from './images/creative.png'
import newmodern from './images/newmodern.png'
import atsOptimized from "./images/ats-1st.png"



const TemplatesShowcase = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      name: "Modern Professional",
      description: "Clean and contemporary design with a focus on readability and professional appeal",
      features: ["Two-column layout", "Accent color headers", "Skills progress bars", "Professional typography"],
      image: newmodern,
      category: "Professional"
    },
    {
      id: 2,
      name: "Creative Bold",
      description: "Eye-catching design with strong visual hierarchy and creative elements",
      features: ["Bold section dividers", "Visual skill ratings", "Color-coded sections", "Modern aesthetic"],
      image: creative,
      category: "Creative"
    },
    {
      id: 3,
      name: "Minimal Classic",
      description: "Timeless black and white design emphasizing content and clarity",
      features: ["Clean typography", "Traditional layout", "Maximum readability", "ATS-friendly"],
      image: classicImg,
      category: "Classic"
    },
    {
      id: 4,
      name: "ATS Optimized",
      description: "Sophisticated design for senior-level professionals and executives",
      features: ["Premium styling", "Leadership focus", "Strategic layout", "High-impact design"],
      image: atsOptimized,
      category: "Executive"
    },
    {
      id: 5,
      name: "Tech Innovator",
      description: "Modern tech-focused design with clean lines and contemporary styling",
      features: ["Tech-forward design", "Skill showcasing", "Project highlights", "GitHub integration"],
      image: tech,
      category: "Technical"
    },
    {
      id: 6,
      name: "Academic Scholar",
      description: "Professional academic design emphasizing education and research",
      features: ["Publication focus", "Research highlights", "Academic formatting", "Clean structure"],
      image: acad,
      category: "Academic"
    }
  ];

  const categories = ["All", "Professional", "Creative", "Classic", "Executive", "Technical", "Academic"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTemplates = activeCategory === "All"
    ? templates
    : templates.filter(t => t.category === activeCategory);

  return (
    <div className="templates-showcase">
      {/* Animated Grid Background */}
      <div className="grid-background" />

      {/* Floating Shapes */}
      <div className="bg-decoration">
        <div className="floating-shape shape-1" />
        <div className="floating-shape shape-2" />
        <div className="floating-shape shape-3" />
        <div className="floating-shape shape-4" />
      </div>

      <div className="templates-container">
        {/* Hero Section */}
        <div className="templates-hero">
          <div className="hero-badge">
            <Sparkles className="badge-icon" />
            Resume Templates
          </div>

          <h1 className="templates-title">
            Choose Your
            <span className="title-outline">Perfect Template</span>
          </h1>

          <p className="templates-subtitle">
            Professional resume templates designed to make you stand out.
            Choose from our carefully crafted collection.
          </p>
        </div>

        {/* Category Filter */}
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="templates-grid">
          {filteredTemplates.map((template, index) => (
            <div
              key={template.id}
              className="template-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Shine Effect */}
              <div className="card-shine" />

              {/* Top Bar */}
              <div className="card-top-bar" />

              {/* Template Number */}
              <div className="template-number">
                {template.id.toString().padStart(2, '0')}
              </div>

              {/* Template Image */}
              <div className="template-image-container">
                <img
                  src={template.image}
                  alt={template.name}
                  className="template-image"
                  onError={(e) => {
                    e.target.parentElement.innerHTML = '<div class="image-placeholder">Template Preview</div>';
                  }}
                />
              </div>

              {/* Content */}
              <div className="template-content">
                <div>
                  <div className="template-category">
                    {template.category}
                  </div>
                  <h3 className="template-name">
                    {template.name}
                  </h3>
                  <p className="template-description">
                    {template.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="template-features">
                  {template.features.map((feature, idx) => (
                    <li key={idx} className="feature-item">
                      <span className="feature-arrow">→</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Select Button */}
                <div className="template-actions">
                  <button
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`select-btn ${selectedTemplate === template.id ? 'selected' : ''}`}
                  >
                    {selectedTemplate === template.id ? (
                      <>
                        <Check className="btn-icon" />
                        Selected
                      </>
                    ) : (
                      'Select Template'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="templates-cta">
          <h2 className="cta-title">Ready to Create?</h2>
          <p className="cta-text">
            Select a template and start building your professional resume
          </p>
          <button className="cta-button">
            Get Started
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatesShowcase;