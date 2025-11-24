


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './MyResumes.css';
import { useSelector } from 'react-redux';

const API_BASE_URL2 = 'http://localhost:8080';
const API_BASE_URL = 'https://resumemaker-1.onrender.com';

const MyResumes = ({userId}) => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const id = useSelector((state)=> state.auth.userId);

  useEffect(() => {
    fetchResumes();
  }, [id]);

  const fetchResumes = async () => {
   
    try {
      setLoading(true);
      // const cleanId = String(id).trim();
      const response = await fetch(`${API_BASE_URL}/my-resumes/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch resumes');
      }
      
      const data = await response.json();
      console.log("This is data recieved from backend");
      
      console.log(data);
      
      setResumes(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resumeId) => {
    try {
      setDeleting(resumeId);
      const response = await fetch(`${API_BASE_URL}/my-resumes/delete-resume/${resumeId}`, {
        method: 'DELETE',
      });
      console.log(response.status);
      
      
      if (!response.ok || response.status !== 200) {
        const text = await response.text(); // get backend response
        throw new Error(`Failed to delete resume. Status: ${response.status}, Response: ${text}`);
      }
      
      // Remove the deleted resume from state
      setResumes(resumes.filter(resume => resume.id !== resumeId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting resume:', err);
      alert('Failed to delete resume. Please try again.');
    } finally {
      setDeleting(null);
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
      1: 'white',
      2: 'white',
      3: 'white',
      4: 'white',
      5: 'white',
      6: 'white',
      7: 'white'
    };
    return colors[templateId] || '#6b7280';
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
            Please Login First
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
            <h1 className="logo-text">Manage your Resumes</h1>
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
                {/* Animated Background Gradient */}
                <div 
                  className="card-gradient-bg"
                  style={{ '--template-color': getTemplateColor(resume.templateId) }}
                ></div>
                
                {/* Delete Button */}
                <button
                  className="delete-btn"
                  onClick={() => setDeleteConfirm(resume.id)}
                  disabled={deleting === resume.id}
                  title="Delete Resume"
                > ❎
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                  </svg>
                </button>

                {/* Card Header */}
                <div className="card-header">
                  <div className="card-header-top">
                    <span 
                      className="template-badge"
                      style={{ borderColor: getTemplateColor(resume.templateId), color: getTemplateColor(resume.templateId) }}
                    >
                      {getTemplateName(resume.templateId)}
                    </span>
                  </div>
                  <div className="resume-icon-wrapper">
                    <span className="resume-emoji">📄</span>
                  </div>
                  <h3 className="resume-title">{resume.title || 'Untitled Resume'}</h3>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  <div className="resume-info">
                    <div className="info-row">
                      <span className="info-icon">🎨</span>
                      <span className="info-label">Template:</span>
                      <span className="info-value">{getTemplateName(resume.templateId)}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-icon">#</span>
                      <span className="info-label">ID:</span>
                      <span className="info-value resume-id">{resume.id}</span>
                    </div>
                    {resume.createdAt && (
                      <div className="info-row">
                        <span className="info-icon">📅</span>
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
                      <span className="btn-icon">👁️</span>
                      View
                    </button>
                    <button 
                      onClick={() => navigate(`/dashboard/resume-editor/${resume.id}`)}
                      className="edit-button"
                    >
                      <span className="btn-icon">✏️</span>
                      Edit
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirm === resume.id && (
                  <div className="delete-modal">
                    <div className="delete-modal-content">
                      <h4>Delete Resume?</h4>
                      <p>This action cannot be undone.</p>
                      <div className="delete-modal-actions">
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="cancel-delete-btn"
                          disabled={deleting === resume.id}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(resume.id)}
                          className="confirm-delete-btn"
                          disabled={deleting === resume.id}
                        >
                          {deleting === resume.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResumes;