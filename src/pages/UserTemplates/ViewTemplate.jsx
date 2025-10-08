import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewTemplate.css';

const API_BASE_URL = 'http://localhost:8080';

const ViewResume = () => {
  const { resumeId } = useParams(); // Get resume ID from URL
  const navigate = useNavigate();
  const resumeRef = useRef(null);

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) return;

      try {
        setLoading(true);
        console.log(`sending request from front end for ${resumeId}`);
  
        
        const response = await fetch(`${API_BASE_URL}/my-resumes/getresume/${resumeId}`);
        if (!response.ok) throw new Error(`Failed to fetch resume. Status: ${response.status}`);
        const data = await response.json();
        setResume(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching resume:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  const handleDownload = () => {
    alert('Download functionality will be implemented with PDF generation');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading resume...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Error Loading Resume</h2>
          <p className="error-message">{error}</p>
          <button onClick={() => navigate(-1)} className="retry-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="error-container">
        <p>No resume found for this ID.</p>
      </div>
    );
  }

  return (
    <div className="view-resume-page">
      {/* Header - Hidden on print */}
      <header className="view-header no-print">
        <div className="header-container">
          <div className="header-left">
            <button
              onClick={() => navigate('/my-resumes')}
              className="back-button"
            >
              ← Back to My Resumes
            </button>
          </div>
          <div className="header-actions">
            <button onClick={handlePrint} className="action-btn print-btn">🖨️ Print</button>
            <button onClick={handleShare} className="action-btn share-btn">📤 Share</button>
            <button onClick={handleDownload} className="action-btn download-btn">⬇️ Download PDF</button>
            <button onClick={() => navigate(`/editor/${resumeId}`)} className="action-btn edit-btn">✏️ Edit</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="resume-container">
        <div className="resume-paper" ref={resumeRef}>
          <div className="resume-content">
            {/* Header Section */}
            <div className="resume-header">
              <h1 className="resume-name">{resume.personalInfo?.fullName || 'Your Name'}</h1>
              <div className="contact-info">
                {resume.personalInfo?.email && <span>{resume.personalInfo.email}</span>}
                {resume.personalInfo?.phone && <span> • {resume.personalInfo.phone}</span>}
                {resume.personalInfo?.location && <span> • {resume.personalInfo.location}</span>}
              </div>
              {resume.personalInfo?.linkedin && <div className="linkedin-link">{resume.personalInfo.linkedin}</div>}
            </div>

            {/* Summary */}
            {resume.summary && (
              <div className="resume-section">
                <h2 className="section-title">Professional Summary</h2>
                <p>{resume.summary}</p>
              </div>
            )}

            {/* Experience */}
            {resume.experience?.length > 0 && (
              <div className="resume-section">
                <h2 className="section-title">Work Experience</h2>
                {resume.experience.map((exp, idx) => (
                  <div key={idx} className="experience-item">
                    <h3>{exp.position} - {exp.company}</h3>
                    <span>{exp.startDate} - {exp.endDate || 'Present'}</span>
                    {exp.location && <p>{exp.location}</p>}
                    {exp.description && <p>{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {resume.education?.length > 0 && (
              <div className="resume-section">
                <h2 className="section-title">Education</h2>
                {resume.education.map((edu, idx) => (
                  <div key={idx} className="education-item">
                    <h3>{edu.degree} - {edu.institution}</h3>
                    {edu.graduationDate && <span>{edu.graduationDate}</span>}
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {resume.skills?.length > 0 && (
              <div className="resume-section">
                <h2 className="section-title">Skills</h2>
                <div className="skills-container">
                  {resume.skills.map((skill, idx) => <span key={idx} className="skill-tag">{skill}</span>)}
                </div>
              </div>
            )}

            {/* Certifications */}
            {resume.certifications?.length > 0 && (
              <div className="resume-section">
                <h2 className="section-title">Certifications</h2>
                {resume.certifications.map((cert, idx) => (
                  <div key={idx} className="certification-item">
                    <span>{cert.name}</span>
                    {cert.date && <span> - {cert.date}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay no-print" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Share Resume</h3>
            <input type="text" value={window.location.href} readOnly />
            <button onClick={copyShareLink}>Copy Link</button>
            <button onClick={() => setShowShareModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewResume;
