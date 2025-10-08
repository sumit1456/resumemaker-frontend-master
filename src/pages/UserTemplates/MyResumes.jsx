import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './MyResumes.css';

const API_BASE_URL = 'http://localhost:8080';

const MyResumes = ({userId}) => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, [userId]);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/my-resumes/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch resumes');
      }
      
      const data = await response.json();
      console.log(data);
      
      setResumes(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTemplateName = (templateId) => {
    const templates = {
      1: 'Classic Template',
      2: 'Modern Template',
      3: 'ATS-Friendly Template',
      4: 'Executive Elite',
      5: 'Tech Innovator',
      6: 'Academic Scholar',
      7: 'Creative Bold'
    };
    return templates[templateId] || `Template ${templateId}`;
  };

  const getTemplateColor = (templateId) => {
    const colors = {
      1: 'from-blue-500 to-blue-600',
      2: 'from-purple-500 to-purple-600',
      3: 'from-green-500 to-green-600',
      4: 'from-indigo-500 to-indigo-600',
      5: 'from-cyan-500 to-cyan-600',
      6: 'from-amber-500 to-amber-600',
      7: 'from-pink-500 to-pink-600'
    };
    return colors[templateId] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your resumes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Error Loading Resumes</h2>
          <p className="error-message">{error}</p>
          <button onClick={fetchResumes} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-resumes-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <div className="logo-icon"></div>
            <h1 className="logo-text">Resume Maker</h1>
          </Link>
          
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        <div className="page-title-section">
          <h1 className="page-title">My Resumes</h1>
          <p className="page-subtitle">
            Manage and view your professional resumes
          </p>
        </div>

        {resumes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3 className="empty-title">No Resumes Yet</h3>
            <p className="empty-text">Create your first resume to get started!</p>
            <button 
              onClick={() => navigate('/editor')}
              className="create-first-button"
            >
              Create Resume
            </button>
          </div>
        ) : (
          <div className="resumes-grid">
            {resumes.map((resume) => (
              <div key={resume.id} className="resume-card">
                {/* Card Header */}
                <div className={`card-header bg-gradient-to-r ${getTemplateColor(resume.templateId)}`}>
                  <div className="card-header-top">
                    <span className="template-badge">
                      {getTemplateName(resume.templateId)}
                    </span>
                    <span className="resume-emoji">📄</span>
                  </div>
                  <h3 className="resume-title">{resume.title || 'Untitled Resume'}</h3>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  <div className="resume-info">
                    <div className="info-row">
                      <span className="info-label">Template:</span>
                      <span className="info-value">{getTemplateName(resume.templateId)}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Resume ID:</span>
                      <span className="info-value resume-id">#{resume.id}</span>
                    </div>
                    {resume.createdAt && (
                      <div className="info-row">
                        <span className="info-label">Created:</span>
                        <span className="info-value">
                          {new Date(resume.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="card-actions">
                    <button
                      onClick={() => navigate(`/my-resumes/getresume/${resume.id}`)}
                      className="view-button"
                    >
                      View Resume
                    </button>
                    <button 
                      onClick={() => navigate(`/editor/${resume.id}`)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResumes;