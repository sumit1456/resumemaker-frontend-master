import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import ResumeDocument from "../Resume/Template1";
import ModernResumeDocument from "../Resume/Template2";
import ATSFriendlyResumeDocument from "../Resume/Template3";
import ExecutiveEliteDocument from "../Resume/Template4";
import TechInnovatorDocument from "../Resume/Template5";
import AcademicScholarDocument from "../Resume/Template6";
import NewTemplate from "../Resume/Template8"
import CreativeBold from "../Resume/Template7";
import './ViewTemplate.css';

const API_BASE_URL = 'http://localhost:8080';
const API_BASE_URL2 = 'https://resumemaker-1.onrender.com';

// PDF Viewer Component with higher quality
const PDFViewer = ({ pdfBlob }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [scale, setScale] = useState(1.3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPDF = async () => {
      if (!pdfBlob) return;
      setLoading(true);
      setError(null);
      try {
        if (!window.pdfjsLib) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }
        if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        const arrayBuffer = await pdfBlob.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setError(`Failed to load PDF: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadPDF();
  }, [pdfBlob]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;
      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale: scale * 2 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / 2}px`;
        canvas.style.height = `${viewport.height / 2}px`;

        await page.render({
          canvasContext: context,
          viewport,
          intent: 'display'
        }).promise;
      } catch (error) {
        console.error('Error rendering page:', error);
        setError(`Failed to render page: ${error.message}`);
      }
    };
    renderPage();
  }, [pdfDoc, currentPage, scale]);

  if (loading) return <div className="pdf-loading"><div className="loading-spinner"></div><p>Loading PDF...</p></div>;
  if (error) return <div className="pdf-error">{error}</div>;
  if (!pdfBlob) return <div className="pdf-generating"><div className="loading-spinner"></div><p>Generating preview...</p></div>;

  return (
    <div ref={containerRef} className="pdf-viewer-container">
      <div className="pdf-controls">
        <div className="pdf-navigation">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="pdf-nav-btn"
          >
            Previous
          </button>
          <span className="pdf-page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="pdf-nav-btn"
          >
            Next
          </button>
        </div>
        <div className="pdf-zoom-controls">
          <button
            onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
            className="pdf-zoom-btn"
          >
            Zoom Out
          </button>
          <span className="pdf-zoom-level">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale(s => Math.min(3, s + 0.2))}
            className="pdf-zoom-btn"
          >
            Zoom In
          </button>
        </div>
      </div>
      <div className="pdf-canvas-wrapper">
        <canvas ref={canvasRef} className="pdf-canvas" />
      </div>
    </div>
  );
};

// Enhanced Sidebar Component with more content
const ResumeSidebar = ({ resume }) => {
  const totalSections = [
    resume.experiences?.length > 0,
    resume.skills?.length > 0,
    resume.projects?.length > 0,
    resume.educationList?.length > 0 || resume.education?.length > 0,
    resume.certifications?.length > 0
  ].filter(Boolean).length;

  return (
    <aside className="resume-sidebar no-print">
      <div className="sidebar-section">
        <h3 className="sidebar-title">
          <span className="sidebar-title-icon">📊</span>
          Quick Stats
        </h3>
        <div className="sidebar-stats">
          <div className="stat-card">
            <div className="stat-value">{resume.templateId || 1}</div>
            <div className="stat-label">Template</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {resume.experiences?.length || 0}
            </div>
            <div className="stat-label">Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {resume.skills?.length || 0}
            </div>
            <div className="stat-label">Skills</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {resume.projects?.length || 0}
            </div>
            <div className="stat-label">Projects</div>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">
          <span className="sidebar-title-icon">✨</span>
          Resume Quality
        </h3>
        <div className="sidebar-feature">
          <span className="feature-icon">📄</span>
          <span className="feature-text">
            <strong>{totalSections}</strong> sections included
          </span>
        </div>
        <div className="sidebar-feature">
          <span className="feature-icon">🎯</span>
          <span className="feature-text">
            ATS-optimized format
          </span>
        </div>
        <div className="sidebar-feature">
          <span className="feature-icon">✅</span>
          <span className="feature-text">
            Professional layout
          </span>
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">
          <span className="sidebar-title-icon">💡</span>
          Tips
        </h3>
        <ul className="sidebar-list">
          <li className="sidebar-list-item">
            Update regularly with achievements
          </li>
          <li className="sidebar-list-item">
            Tailor for each application
          </li>
          <li className="sidebar-list-item">
            Use action verbs & metrics
          </li>
          <li className="sidebar-list-item">
            Proofread carefully
          </li>
          <li className="sidebar-list-item">
            Keep it concise and relevant
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-tip">
          <div className="sidebar-tip-title">💼 Pro Tip</div>
          <div className="sidebar-tip-text">
            Always download as PDF to preserve formatting across all devices and ATS systems.
          </div>
        </div>
      </div>
    </aside>
  );
};

const ViewResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);


  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) return;

      setLoading(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/my-resumes/getresume/${resumeId}`,
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
            credentials: 'include',
          }
        );

        if (!response.ok) {
          const err = await response.text();
          throw new Error(
            `Failed to fetch resume (${response.status}): ${err || "No body"}`
          );
        }

        // ✅ Correct check — do NOT use content-length
        const text = await response.text();
        if (!text.trim()) {
          window.showMessage('Error', 'Your resume could not be retrived', 'error');
          navigate("/user-templates")
          return;

        }

        const data = JSON.parse(text);

        if (Array.isArray(data.experiences)) {
          data.experiences = data.experiences.map(exp => ({
            ...exp,
            achievements: Array.isArray(exp.achievements)
              ? exp.achievements
              : exp.achievements
                ? [exp.achievements]
                : []
          }));
        }

        setResume(data);
        setError(null);

      } catch (err) {
        console.error("Resume fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);



  // useEffect(() => {
  //   const fetchResume = async () => {
  //     if (!resumeId) return;

  //     try {
  //       setLoading(true);
  //       console.log(`Fetching resume with ID: ${resumeId}`);


  //       // Determine which API to use based on environment
  //       const isDevelopment = window.location.hostname === 'localhost';
  //       const baseUrl = isDevelopment ? API_BASE_URL2 : API_BASE_URL;

  //       console.log(`using url ${API_BASE_URL} for fetching resumes in view template`);
  //       console.log(` ${resumeId} is the resumeId for the request`);



  //       const response = await fetch(`${API_BASE_URL}/my-resumes/getresume/${resumeId}`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Accept': 'application/json',
  //         },
  //         credentials: 'include', // Include credentials if needed
  //       });

  //       console.log('Response status:', response.status);
  //       console.log('Response headers:', response.headers);

  //       if (!response.ok) {
  //         const errorText = await response.text();
  //         console.error('Error response:', errorText);
  //         throw new Error(`Failed to fetch resume. Status: ${response.status} - ${errorText}`);
  //       }

  //       const data = await response.json();
  //       console.log('Fetched resume data:', data);
  //       setResume(data);
  //     } catch (err) {
  //       console.error('Error fetching resume:', err);
  //       setError(err.message);

  //       // If production API fails, try localhost as fallback
  //       if (!window.location.hostname.includes('localhost')) {
  //         console.log('Attempting localhost fallback...');
  //         try {
  //           const response = await fetch(`${API_BASE_URL}/my-resumes/getresume/${resumeId}`, {
  //             method: 'GET',
  //             headers: {
  //               'Content-Type': 'application/json',
  //               'Accept': 'application/json',
  //             },
  //           });

  //           if (response.ok) {
  //             const data = await response.json();
  //             setResume(data);
  //             setError(null);
  //             console.log('Successfully fetched from localhost fallback');
  //           }
  //         } catch (fallbackErr) {
  //           console.error('Localhost fallback also failed:', fallbackErr);
  //         }
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchResume();
  // }, [resumeId]);

  useEffect(() => {
    const generatePDF = async () => {
      if (!resume) return;

      setGeneratingPDF(true);
      try {
        const TemplateComponent = getTemplateComponent(resume.templateId);
        const templateProps = transformResumeData(resume);
        const doc = React.createElement(TemplateComponent, templateProps);
        const asPdf = pdf(doc);
        const blob = await asPdf.toBlob();
        setPdfBlob(blob);
      } catch (err) {
        console.error('Error generating PDF:', err);
        setError('Failed to generate PDF preview');
      } finally {
        setGeneratingPDF(false);
      }
    };

    generatePDF();
  }, [resume]);

  const getTemplateComponent = (templateId) => {
    const templates = {
      1: ResumeDocument,
      2: ModernResumeDocument,
      3: ATSFriendlyResumeDocument,
      4: ExecutiveEliteDocument,
      5: TechInnovatorDocument,
      6: AcademicScholarDocument,
      7: NewTemplate
    };

    return templates[templateId] || ResumeDocument;
  };

  const transformResumeData = (resumeData) => {
    return {
      resumeDetails: {
        name: resumeData.details?.name || resumeData.personalInfo?.fullName || '',
        title: resumeData.details?.title || '',
        summary: resumeData.details?.summary || resumeData.summary || '',
        contact: {
          email: resumeData.contact?.email || resumeData.personalInfo?.email || '',
          phone: resumeData.contact?.phone || resumeData.personalInfo?.phone || '',
          location: resumeData.contact?.location || resumeData.personalInfo?.location || '',
          linkedin: resumeData.contact?.linkedin || resumeData.personalInfo?.linkedin || '',
          github: resumeData.contact?.github || ''
        }
      },
      skills: Array.isArray(resumeData.skills)
        ? resumeData.skills.map(s => typeof s === 'string' ? s : s.name)
        : [],
      experiences: Array.isArray(resumeData.experiences)
        ? resumeData.experiences.map(exp => ({
          position: exp.position || '',
          company: exp.company || '',
          location: exp.location || '',
          duration: exp.duration || `${exp.startDate || ''} - ${exp.endDate || 'Present'}`,
          achievements: Array.isArray(exp.achievements) ? exp.achievements : [exp.description || '']
        }))
        : [],
      projects: Array.isArray(resumeData.projects)
        ? resumeData.projects.map(proj => ({
          name: proj.name || '',
          duration: proj.duration || '',
          technologies: proj.technologies || '',
          description: Array.isArray(proj.description) ? proj.description : [proj.description || ''],
          link: proj.link || ''
        }))
        : [],
      educationList: Array.isArray(resumeData.educationList) || Array.isArray(resumeData.education)
        ? (resumeData.educationList || resumeData.education).map(edu => ({
          degree: edu.degree || '',
          institution: edu.institution || '',
          location: edu.location || '',
          year: edu.year || edu.graduationDate || '',
          gpa: edu.gpa || ''
        }))
        : [],
      certifications: Array.isArray(resumeData.certifications)
        ? resumeData.certifications.map(c => typeof c === 'string' ? c : c.name)
        : [],
      showSummary: resumeData.showSummary !== false,
      showSkills: resumeData.showSkills !== false,
      showExperience: resumeData.showExperience !== false,
      showProjects: resumeData.showProjects !== false,
      showEducation: resumeData.showEducation !== false,
      showCertifications: resumeData.showCertifications !== false,
      sectionTitles: resumeData.sectionTitles || {},
      customSections: resumeData.customSections || []
    };
  };

  const handleDownload = async () => {
    if (!pdfBlob) {
      alert('PDF is still generating. Please wait...');
      return;
    }

    try {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resume.details?.name || 'Resume'}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download PDF');
    }
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
      <div className="view-resume-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading resume...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-resume-error">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Error Loading Resume</h2>
          <p className="error-message">{error}</p>
          <button onClick={() => navigate(-1)} className="error-back-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="view-resume-error">
        <div className="error-card">
          <div className="error-icon">📄</div>
          <h2 className="error-title">Resume Not Found</h2>
          <p className="error-message">No resume found for this ID.</p>
          <button onClick={() => navigate('/my-resumes')} className="error-back-btn">
            Back to My Resumes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-resume-page">
      <header className="view-header no-print">
        <div className="header-container">
          <div className="header-left">
            <button onClick={() => navigate('/my-resumes')} className="back-button">
              ← Back
            </button>
            <span className="template-info">
              Template {resume.templateId || 1}
            </span>
          </div>
          <div className="header-actions">
            <button
              onClick={handleDownload}
              className="action-btn download-btn"
              disabled={!pdfBlob}
            >
              ⬇️ {pdfBlob ? 'Download' : 'Loading...'}
            </button>
            <button
              onClick={() => navigate(`/dashboard/resume-editor/${resumeId}`)}
              className="action-btn edit-btn"
            >
              ✏️ Edit
            </button>
          </div>
        </div>
      </header>

      <main className="resume-container">
        <ResumeSidebar resume={resume} />

        <div className="pdf-viewer-wrapper">
          {generatingPDF ? (
            <div className="generating-pdf">
              <div className="loading-spinner"></div>
              <p>Generating PDF preview...</p>
            </div>
          ) : (
            <PDFViewer pdfBlob={pdfBlob} />
          )}
        </div>
      </main>

      {showShareModal && (
        <div className="modal-overlay no-print" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Share Resume</h3>
            <input
              type="text"
              value={window.location.href}
              readOnly
              className="share-link-input"
            />
            <div className="modal-actions">
              <button onClick={copyShareLink} className="modal-btn primary">
                Copy Link
              </button>
              <button onClick={() => setShowShareModal(false)} className="modal-btn secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewResume;