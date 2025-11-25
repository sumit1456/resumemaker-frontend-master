import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import ResumeDocument from './Template1';
import ModernResumeDocument from './Template2';
import ATSFriendlyResumeDocument from './Template3';
import ExecutiveEliteDocument from './Template4';
import TechInnovatorDocument from './Template5';
import AcademicScholarDocument from './Template6';
import CreativeBold from './Template7';
import "./css-files/ResumeEditor.css";
import NewTemplate from './Template8.jsx';
import ErrorBoundary from "../../ErrorBoundry.jsx";
import ResumeAnalyzer from "./ResumeAnalyzer.jsx";
import { AlignRight } from "lucide-react";
import "./css-files/analyze.css"
import LoadingAnimation from "../../components/PopUp/LoadingAnimation.jsx";

import { useDispatch, useSelector } from 'react-redux';
import { setCurrentResume, setEnhancedResume } from "../../redux/store.js";
import { setCurrentResumeId } from "../../redux/store.js";






const API_BASE_URL2 = 'http://localhost:8080';
const API_BASE_URL = 'https://resumemaker-1.onrender.com';

// PDF.js Viewer Component
const PDFViewer = ({ pdfBlob }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [containerWidth, setContainerWidth] = useState(600);

  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth - 40;
        setContainerWidth(width);
      }
    };
    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);

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
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
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
    let renderTask = null;
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;
      
      if (renderTask) {
        renderTask.cancel();
      }
      
      try {
        const page = await pdfDoc.getPage(currentPage);
        const baseViewport = page.getViewport({ scale: 1 });
        const optimalScale = Math.min(containerWidth / baseViewport.width, scale);
        const viewport = page.getViewport({ scale: optimalScale });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const devicePixelRatio = window.devicePixelRatio || 1;
        const scaledViewport = page.getViewport({ scale: optimalScale * devicePixelRatio });
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        context.scale(devicePixelRatio, devicePixelRatio);
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        renderTask = page.render({ canvasContext: context, viewport: viewport });
        await renderTask.promise;
        renderTask = null;
      } catch (error) {
        if (error.name === 'RenderingCancelledException') {
          console.log('Rendering cancelled');
        } else {
          console.error('Error rendering page:', error);
          setError(`Failed to render page: ${error.message}`);
        }
      }
    };
    renderPage();
    
    return () => {
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, currentPage, scale, containerWidth]);

  const goToPrevious = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNext = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
  const zoomIn = () => setScale(prev => Math.min(3, prev + 0.2));
  const zoomOut = () => setScale(prev => Math.max(0.8, prev - 0.2));
  const fitToWidth = () => {
    if (pdfDoc && containerRef.current) {
      pdfDoc.getPage(1).then(page => {
        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = containerRef.current.offsetWidth - 40;
        const optimalScale = containerWidth / viewport.width;
        setScale(Math.min(optimalScale, 2.5));
      });
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 2s linear infinite', margin: '0 auto 1rem' }}></div>
        <p>Loading PDF preview...</p>
      </div>
    );
  }

  if (!pdfBlob) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}><p>Generate your resume to see preview...</p></div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#e74c3c' }}>
        <p>Error loading PDF preview:</p>
        <p style={{ fontSize: '0.875rem' }}>{error}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Refresh Page</button>
      </div>
    );
  }

  return (

    //preview page inside
    // <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
    //   <div style={{ padding: '0.75rem', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f8f9fa', flexWrap: 'wrap' }}>
    //     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    //       <button onClick={goToPrevious} disabled={currentPage <= 1} style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem', backgroundColor: currentPage <= 1 ? '#e9ecef' : '#007bff', color: currentPage <= 1 ? '#6c757d' : 'white', border: 'none', borderRadius: '4px', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}>‹ Prev</button>
    //       <span style={{ fontSize: '0.875rem', fontWeight: '500', minWidth: '4rem', textAlign: 'center' }}>{currentPage} of {totalPages}</span>
    //       <button onClick={goToNext} disabled={currentPage >= totalPages} style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem', backgroundColor: currentPage >= totalPages ? '#e9ecef' : '#007bff', color: currentPage >= totalPages ? '#6c757d' : 'white', border: 'none', borderRadius: '4px', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}>Next ›</button>
    //     </div>
    //     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
    //       <button onClick={zoomOut} style={{ padding: '0.375rem 0.5rem', fontSize: '0.875rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', minWidth: '32px' }}>−</button>
    //       <span style={{ fontSize: '0.875rem', minWidth: '4rem', textAlign: 'center', fontWeight: '500' }}>{Math.round(scale * 100)}%</span>
    //       <button onClick={zoomIn} style={{ padding: '0.375rem 0.5rem', fontSize: '0.875rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', minWidth: '32px' }}>+</button>
    //       <button onClick={fitToWidth} style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '0.5rem' }}>Fit Width</button>
    //     </div>
    //   </div>
    //   <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#525659', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '2rem 1rem' }}>
    //     <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', backgroundColor: 'white', borderRadius: '4px' }} />
    //   </div>
    // </div>

    <div>


      <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#0a0a0a' }}>
  <div style={{ padding: '1rem', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#151515', flexWrap: 'wrap', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', backgroundColor: '#1f1f1f', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
      <button 
        onClick={goToPrevious} 
        disabled={currentPage <= 1} 
        style={{ 
          padding: '0.5rem 1rem', 
          fontSize: '0.875rem', 
          backgroundColor: 'transparent', 
          color: currentPage <= 1 ? '#555' : '#ccc', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
          fontWeight: '500',
          transition: 'all 0.2s ease',
          opacity: currentPage <= 1 ? 0.4 : 1
        }}
        onMouseEnter={(e) => {
          if (currentPage > 1) {
            e.target.style.color = '#ffffff';
            e.target.style.background = '#252525';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent';
          e.target.style.color = '#ccc';
        }}
      >‹ Previous</button>
      <span style={{ fontSize: '0.875rem', fontWeight: '600', padding: '0.5rem 1rem', textAlign: 'center', color: '#ffffff', backgroundColor: '#252525', borderRadius: '4px', minWidth: '5rem' }}>
        Page {currentPage} / {totalPages}
      </span>
      <button 
        onClick={goToNext} 
        disabled={currentPage >= totalPages} 
        style={{ 
          padding: '0.5rem 1rem', 
          fontSize: '0.875rem', 
          backgroundColor: 'transparent', 
          color: currentPage >= totalPages ? '#555' : '#ccc', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
          fontWeight: '500',
          transition: 'all 0.2s ease',
          opacity: currentPage >= totalPages ? 0.4 : 1
        }}
        onMouseEnter={(e) => {
          if (currentPage < totalPages) {
            e.target.style.color = '#ffffff';
            e.target.style.background = '#252525';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent';
          e.target.style.color = '#ccc';
        }}
      >Next ›</button>
    </div>
    
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto', padding: '0.5rem', backgroundColor: '#1f1f1f', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
      <button 
        onClick={zoomOut} 
        style={{ 
          padding: '0.5rem', 
          fontSize: '1rem', 
          backgroundColor: 'transparent', 
          color: '#ccc', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer', 
          minWidth: '36px',
          height: '36px',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#252525';
          e.target.style.color = '#ffffff';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent';
          e.target.style.color = '#ccc';
        }}
      >−</button>
      <span style={{ fontSize: '0.875rem', minWidth: '4rem', textAlign: 'center', fontWeight: '600', color: '#ffffff', padding: '0.5rem 0.75rem', backgroundColor: '#252525', borderRadius: '4px' }}>
        {Math.round(scale * 100)}%
      </span>
      <button 
        onClick={zoomIn} 
        style={{ 
          padding: '0.5rem', 
          fontSize: '1rem', 
          backgroundColor: 'transparent', 
          color: '#ccc', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer', 
          minWidth: '36px',
          height: '36px',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#252525';
          e.target.style.color = '#ffffff';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent';
          e.target.style.color = '#ccc';
        }}
      >+</button>
      <div style={{ width: '1px', height: '24px', backgroundColor: '#2a2a2a', margin: '0 0.25rem' }}></div>
      <button 
        onClick={fitToWidth} 
        style={{ 
          padding: '0.5rem 1rem', 
          fontSize: '0.875rem', 
          backgroundColor: 'transparent', 
          color: '#ccc', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer',
          fontWeight: '500',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#252525';
          e.target.style.color = '#ffffff';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent';
          e.target.style.color = '#ccc';
        }}
      >Fit to Width</button>
    </div>
  </div>
  
  <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#0d0d0d', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '2rem 1rem' }}>
    <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)', backgroundColor: 'white', borderRadius: '2px', border: '1px solid #1a1a1a' }} />
  </div>
</div>

      {/* <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
  <div style={{ padding: '0.75rem', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#1a1a1a', flexWrap: 'wrap' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <button 
        onClick={goToPrevious} 
        disabled={currentPage <= 1} 
        style={{ 
          padding: '0.375rem 0.75rem', 
          fontSize: '0.875rem', 
          backgroundColor: currentPage <= 1 ? '#252525' : '#2a2a2a', 
          color: currentPage <= 1 ? '#666' : '#ffffff', 
          border: `1px solid ${currentPage <= 1 ? '#2a2a2a' : '#3a3a3a'}`, 
          borderRadius: '6px', 
          cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          opacity: currentPage <= 1 ? 0.3 : 1
        }}
        onMouseEnter={(e) => {
          if (currentPage > 1) {
            e.target.style.background = '#333';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#2a2a2a';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
      >‹ Prev</button>
      <span style={{ fontSize: '0.875rem', fontWeight: '600', minWidth: '4rem', textAlign: 'center', color: '#ffffff' }}>{currentPage} of {totalPages}</span>
      <button 
        onClick={goToNext} 
        disabled={currentPage >= totalPages} 
        style={{ 
          padding: '0.375rem 0.75rem', 
          fontSize: '0.875rem', 
          backgroundColor: currentPage >= totalPages ? '#252525' : '#2a2a2a', 
          color: currentPage >= totalPages ? '#666' : '#ffffff', 
          border: `1px solid ${currentPage >= totalPages ? '#2a2a2a' : '#3a3a3a'}`, 
          borderRadius: '6px', 
          cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          opacity: currentPage >= totalPages ? 0.3 : 1
        }}
        onMouseEnter={(e) => {
          if (currentPage < totalPages) {
            e.target.style.background = '#333';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#2a2a2a';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
      >Next ›</button>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
      <button 
        onClick={zoomOut} 
        style={{ 
          padding: '0.375rem 0.5rem', 
          fontSize: '0.875rem', 
          backgroundColor: '#2a2a2a', 
          color: '#ffffff', 
          border: '1px solid #3a3a3a', 
          borderRadius: '6px', 
          cursor: 'pointer', 
          minWidth: '32px',
          fontWeight: '600',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#333';
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#2a2a2a';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
      >−</button>
      <span style={{ fontSize: '0.875rem', minWidth: '4rem', textAlign: 'center', fontWeight: '600', color: '#ffffff' }}>{Math.round(scale * 100)}%</span>
      <button 
        onClick={zoomIn} 
        style={{ 
          padding: '0.375rem 0.5rem', 
          fontSize: '0.875rem', 
          backgroundColor: '#2a2a2a', 
          color: '#ffffff', 
          border: '1px solid #3a3a3a', 
          borderRadius: '6px', 
          cursor: 'pointer', 
          minWidth: '32px',
          fontWeight: '600',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#333';
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#2a2a2a';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
      >+</button>
      <button 
        onClick={fitToWidth} 
        style={{ 
          padding: '0.375rem 0.75rem', 
          fontSize: '0.875rem', 
          backgroundColor: '#2a2a2a', 
          color: '#ffffff', 
          border: '1px solid #3a3a3a', 
          borderRadius: '6px', 
          cursor: 'pointer', 
          marginLeft: '0.5rem',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#333';
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#2a2a2a';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
      >Fit Width</button>
    </div>
  </div>
  <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#0a0a0a', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '2rem 1rem' }}>
    <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)', backgroundColor: 'white', borderRadius: '8px' }} />
  </div>
</div> */}


    </div>
  );
};

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}




export default function ResumeEditor({ resume: propsResume}) {
  const { resumeId } = useParams();
  const resumeRef = useRef();
  const [jobDescription, setJobDescription] = useState('');
  const [jobDescriptionInsights, setJobDescriptionInsights] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [isAIAnalysis, setIsAIAnalysis] = useState(false);
  const id = useSelector((s)=>s.auth.userId);
  const [userId, setUserId] = useState(id);
  const currentResumeId = useSelector((state)=>state.resume.resumeId);
  const dispatch = useDispatch();


  
  const [localResume, setLocalResune] = useState(null);

  console.log("From the state the user id is"+ userId);
  



  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [fetchError, setFetchError] = useState("");

  const [showSummary, setShowSummary] = useState(true);
  const [showSkills, setShowSkills] = useState(true);
  const [showExperience, setShowExperience] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [showEducation, setShowEducation] = useState(true);
  const [showCertifications, setShowCertifications] = useState(true);

  const [customSections, setCustomSections] = useState([]);

  const enhancedResume = useSelector((state)=>state.resume.enhancedResume);
  const importedResume = useSelector(state => state.resume.importedResume);
  const currentResume = useSelector(state => state.resume.currentResume);
  const [localResumeId, setLocalResuneId] = useState(null);

  
  useEffect(() => {
  if (!importedResume) return;

  downloadResponse(importedResume);



  // SKILLS: map to strings or empty array
  setSkills(
    Array.isArray(importedResume?.skills)
      ? importedResume.skills.map(s => (typeof s === "string" ? s : s?.name ?? "")).filter(Boolean)
      : []
  );

  // EXPERIENCES: use import array or empty
  setExperiences(
    Array.isArray(importedResume?.experiences)
      ? importedResume.experiences.map(exp => ({
          position: exp?.title ?? exp?.position ?? "",
          company: exp?.company ?? "",
          location: exp?.location ?? "",
          startDate: exp?.startDate ?? "",
          endDate: exp?.endDate ?? "",
          duration:
            exp?.startDate || exp?.endDate
              ? `${exp?.startDate ?? ""} - ${exp?.endDate ?? ""}`
              : "",
          achievements: Array.isArray(exp?.description) ? [...exp.description] : (Array.isArray(exp?.achievements) ? [...exp.achievements] : [])
        }))
      : []
  );

  // PROJECTS: prefer name, fallback to title; description -> array
  setProjects(
    Array.isArray(importedResume?.projects)
      ? importedResume.projects.map(p => ({
          name: p?.name ?? p?.title ?? "",
          description: Array.isArray(p?.description) ? [...p.description] : (p?.description ? [p.description] : []),
          technologies: p?.technologies ?? "",
          duration: p?.duration ?? "",
          link: p?.link ?? ""
        }))
      : []
  );

  // EDUCATION
  setEducationList(
    Array.isArray(importedResume?.educationList)
      ? importedResume.educationList.map(e => ({
          degree: e?.degree ?? "",
          cgpa: e?.cgpa ?? e?.grade ?? "",
          university: e?.university ?? e?.institution ?? "",
          startDate: e?.startDate ?? e?.from ?? "",
          endDate: e?.endDate ?? e?.to ?? ""
        }))
      : []
  );

  // CERTIFICATIONS: normalize to simple objects (or strings if you prefer)
  setCertifications(
    Array.isArray(importedResume?.certifications)
      ? importedResume.certifications.map(c => (typeof c === "string" ? c : c?.title ?? ""))
      : []
  );

  // RESUME DETAILS (overwrite but keep structure)
  setResumeDetails({
    name: importedResume?.resumeDetails?.name ?? importedResume?.resumeDetails?.fullName ?? importedResume?.name ?? "",
    title: importedResume?.resumeDetails?.title ?? importedResume?.title ?? "",
    summary: importedResume?.resumeDetails?.summary ?? importedResume?.summary ?? "",
    contact: {
      phone: importedResume?.resumeDetails?.contact?.phone ?? importedResume?.contact?.phone ?? "",
      email: importedResume?.resumeDetails?.contact?.email ?? importedResume?.contact?.email ?? "",
      linkedin: importedResume?.resumeDetails?.contact?.linkedin ?? importedResume?.contact?.linkedin ?? "",
      github: importedResume?.resumeDetails?.contact?.github ?? importedResume?.contact?.github ?? "",
      location: importedResume?.resumeDetails?.contact?.location ?? importedResume?.contact?.location ?? ""
    }
  });

}, [importedResume]);



  


//   useEffect(() => {
//   if (!currentResume) return;

//   // Map experiences
//   if (currentResume.experiences) {
//     setExperiences(
//       currentResume.experiences.map(exp => ({
//         position: exp.title || "",
//         company: exp.company || "",
//         location: exp.location || "",
//         duration: exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : "",
//         achievements: exp.description || []
//       }))
//     );
//   }

//   // Map skills (already grouped strings)
//   if (currentResume.skills) {
//     setSkills(currentResume.skills);
//   }

//   // Map certifications
//   if (currentResume.certifications) {
//     setCertifications(
//       currentResume.certifications.map(c => (typeof c === "string" ? c : c.title || ""))
//     );
//   }

//   // Map summary
//   if (currentResume.resumeDetails) {
//     setResumeDetails({
//       ...resumeDetails,
//       name: currentResume.resumeDetails.name || "",
//       title: currentResume.resumeDetails.title || "",
//       contact: currentResume.resumeDetails.contact || {},
//       summary: currentResume.resumeDetails.summary || ""
//     });
//   }

//   // Map projects
//   if (currentResume.projects) {
//     setProjects(currentResume.projects);
//   }

//   // Map education
//   if (currentResume.educationList) {
//     setEducationList(currentResume.educationList);
//   }

// }, [currentResume]);


 
//   useEffect(() => {
//   if (!enhancedResume) return;

//   downloadResponse(enhancedResume);

//   console.log("Printing the enhanced resume");
//   console.log(enhancedResume);

//   setSkills(enhancedResume?.skills ?? []);
//   setExperiences(enhancedResume?.experiences ?? []);
//   setProjects(enhancedResume?.projects ?? []);

//   setResumeDetails(prev => ({
//     ...prev,
//     ...enhancedResume?.resumeDetails,
//     contact: enhancedResume?.resumeDetails?.contact
//       ? enhancedResume.resumeDetails.contact
//       : prev.contact,
//     summary: enhancedResume?.resumeDetails?.summary ?? prev.summary,
//   }));
// }, [enhancedResume]);

useEffect(() => {

  if(!enhancedResume)return;
  applyEnhancedResume(enhancedResume);
 

}, [enhancedResume]);


 
const applyEnhancedResume = (enhancedResume) => {
  if (!enhancedResume) return;

  downloadResponse(enhancedResume);

  // ---------------- Resume Details ----------------
  if (enhancedResume.resumeDetails) {
    setResumeDetails(prev => ({
      ...prev,
      // Only override non-empty values
      ...Object.fromEntries(
        Object.entries(enhancedResume.resumeDetails)
          .filter(([_, value]) => value !== "" && value !== null && value !== undefined)
      ),
      contact: {
        ...prev.contact,
        ...Object.fromEntries(
          Object.entries(enhancedResume.resumeDetails.contact || {})
            .filter(([_, value]) => value !== "" && value !== null && value !== undefined)
        )
      }
    }));
  }

  // ---------------- Skills ----------------
 setSkills(
    Array.isArray(enhancedResume?.skills)
      ? enhancedResume.skills.map(s => (typeof s === "string" ? s : s?.name ?? "")).filter(Boolean)
      : []
  );

  // ---------------- Experiences ----------------
 
  setExperiences(
    Array.isArray(enhancedResume?.experiences)
      ? enhancedResume.experiences.map(exp => ({
          position: exp?.title ?? exp?.position ?? "",
          company: exp?.company ?? "",
          location: exp?.location ?? "",
          startDate: exp?.startDate ?? "",
          endDate: exp?.endDate ?? "",
          duration:
            exp?.startDate || exp?.endDate
              ? `${exp?.startDate ?? ""} - ${exp?.endDate ?? ""}`
              : "",
          achievements: Array.isArray(exp?.description) ? [...exp.description] : (Array.isArray(exp?.achievements) ? [...exp.achievements] : [])
        }))
      : []
  );


  // ---------------- Projects ----------------
  // Example for projects
setProjects(prev =>
  enhancedResume.projects.map((proj, i) => {
    const prevProj = prev[i] || {};
    return {
      name: proj.name || prevProj.name || "",
      duration: proj.duration || prevProj.duration || "",
      technologies: proj.technologies || prevProj.technologies || "",
      description: proj.description && proj.description.length > 0
        ? [...proj.description]         // clone API array
        : prevProj.description
          ? [...prevProj.description]  // clone previous state array
          : [""],
      link: proj.link || prevProj.link || ""
    };
  })
);

  
};








  
  


  
  
    const [resumeDetails, setResumeDetails] = useState({
    name: "SUMIT HATEKAR",
    title: "Full Stack Developer",
    contact: {
      phone: "+91 9876543210",
      email: "sumithatekar@gmail.com",
      linkedin: "linkedin.com/in/sumithatekar",
      github: "github.com/sumithatekar",
      location: "Pune, India",
    },
    summary: "Dedicated Java Developer with expertise in Java, Spring Boot, Hibernate/JPA, and RESTful APIs, specializing in building scalable backend systems. Skilled in database design, SQL optimization, and microservices architecture, with strong understanding of OOP and design patterns. Proficient in developing secure, high-performance enterprise applications and experienced in Agile/Scrum environments. Eager to contribute backend expertise while continuously growing as a Java professional.",
  });
  
  const [skills, setSkills] = useState([
    "Programming Languages - Java, JavaScript (ES6+), SQL",
    "Databases - PostgreSQL, Oracle",
    "Frameworks & Libraries - React.js, Spring Boot, Hibernate, Express.js (basic)",
    "Tools & Platforms - Git, GitHub, Postman, Swagger, Maven, Eclipse/IntelliJ",
    "Cloud & Deployment - AWS (EC2, S3, RDS), Docker (basic)",
    "Soft Skills - Problem Solving, Communication, Agile Teamwork"
  ]);
  
  
  const [experiences, setExperiences] = useState([
    {
      position: "Software Engineer",
      company: "Tech Solutions Ltd.",
      location: "Pune, India",
      duration: "Jan 2022 - Present",
      achievements: [
        "Developed client dashboard using React",
        "Implemented REST APIs in Node.js"
      ],
    },
  ]);
  
  const [projects, setProjects] = useState([
    {
      name: "Resume Maker Pro",
      duration: "September 2023 - ongoing",
      technologies: "React, Java, Spring Boot, Spring Security, Docker",
      description: [
        "Developed the backend using Java Spring Boot with Hibernate/JPA for efficient data storage and retrieval.",
        "Built RESTful APIs to manage resume sections such as personal info, skills, certifications, and experience.",
        "Implemented React.js frontend for real-time editing and live preview of resume templates.",
        "Integrated resume download/export functionality (PDF/Docx) with formatted layouts.",
        "Ensured scalable, modular architecture with clean code and reusable components."
      ],
      link: "https://janedoe.dev",
    },
    {
      name: "Find Issue Web Application",
      duration: "June 2023 - August 2023",
      technologies: "Java, Spring Boot, Thymeleaf, MySQL",
      description: [
        "Built a web application to log, track, and manage software issues.",
        "Implemented Spring Boot backend with RESTful APIs for CRUD operations on issues.",
        "Designed MySQL database schema for efficient issue storage and retrieval.",
        "Created user-friendly UI using Thymeleaf for issue submission and tracking.",
        "Added role-based access control to allow admin and user-specific views."
      ],
      link: "https://github.com/sumithatekar/find-issue-app",
    }
  ]);
  
  const [educationList, setEducationList] = useState([
    {
      degree: "Master of Science in Computer Applications",
      institution: "Savitribai Phule University",
      location: "Pune, India",
      year: "2025",
      gpa: "Currently pursuing",
    },
    {
      degree: "BSc Chemistry",
      institution: "Shivaji University",
      location: "Koregaon Satara, India",
      year: "2021",
      gpa: "7.52",
    },
  ]);
  
  const [certifications, setCertifications] = useState([
    "Java Full Stack Development - QSpiders Wakad 2024",
    "Scrum Master Certified",
  ]);
  
   const [sectionTitles, setSectionTitles] = useState({
      summary: "Summary",
      skills: "Skills",
      experience: "Experience",
      projects: "Projects",
      education: "Education",
      certifications: "Certifications"
    });


  

// AI-powered detailed analysis

    
    
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("1");
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [generatingPreview, setGeneratingPreview] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Loading...");



  
 function downloadResponse(response) {
  const dataStr = JSON.stringify(response, null, 2); // pretty print
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "ai_response.json";
  a.click();

  URL.revokeObjectURL(url);
}



  // State rhat renders the preview real time

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (saveError) {
      const timer = setTimeout(() => setSaveError(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [saveError]);



useEffect(() => {
  const fetchResume = async () => {
    if (!resumeId) return;

    setIsLoadingResume(true);
    setFetchError("");

    try {
      // Always use main API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/my-resumes/getresume/${resumeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.status === 404) {
        setFetchError("Resume not found. It may have been deleted.");
        setIsLoadingResume(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched resume data:", data);

      

      setResumeTitle(data.title || "");
      setSelectedTemplate(data.templateId ? String(data.templateId) : "1");

      setResumeDetails({
        name: data.details?.name || "",
        title: data.details?.title || "",
        summary: data.details?.summary || "",
        contact: {
          phone: data.contact?.phone || "",
          email: data.contact?.email || "",
          linkedin: data.contact?.linkedin || "",
          github: data.contact?.github || "",
          location: data.contact?.location || ""
        }
      });

      if (data.skills) {
        let skillsArray = [];
        if (Array.isArray(data.skills)) {
          skillsArray = data.skills.map(s => (typeof s === 'string' ? s : s?.name || '')).filter(s => s !== '');
        } else if (typeof data.skills === 'string') {
          skillsArray = [data.skills];
        }
        setSkills(skillsArray.length > 0 ? skillsArray : [""]);
      }

      // === FIXED EXPERIENCE MAPPING ===
      if (data.experiences && Array.isArray(data.experiences)) {
        const mappedExperiences = data.experiences.map(exp => ({
          position: exp.position || "",
          company: exp.company || "",
          location: exp.location || "",
          duration: exp.duration || "",
          achievements: Array.isArray(exp.achievements)
            ? exp.achievements
            : exp.achievements
            ? [exp.achievements] // wrap string in array
            : [] // ensure not null
        }));
        setExperiences(mappedExperiences);
      }

      if (data.projects && Array.isArray(data.projects)) {
        const mappedProjects = data.projects.map(proj => ({
          name: proj.name || "",
          duration: proj.duration || "",
          technologies: proj.technologies || "",
          description: Array.isArray(proj.description) && proj.description.length > 0 ? proj.description : [""],
          link: proj.link || ""
        }));
        setProjects(mappedProjects);
      }

      if (data.educationList && Array.isArray(data.educationList)) {
        const mappedEducation = data.educationList.map(edu => ({
          degree: edu.degree || "",
          institution: edu.institution || "",
          location: edu.location || "",
          year: edu.year || "",
          gpa: edu.gpa || ""
        }));
        setEducationList(mappedEducation);
      }

      if (data.certifications) {
        let certsArray = [];
        if (Array.isArray(data.certifications)) {
          certsArray = data.certifications.map(c => (typeof c === 'string' ? c : c?.name || '')).filter(c => c !== '');
        } else if (typeof data.certifications === 'string') {
          certsArray = [data.certifications];
        }
        setCertifications(certsArray.length > 0 ? certsArray : [""]);
      }

      setShowSummary(data.showSummary !== undefined ? data.showSummary : true);
      setShowSkills(data.showSkills !== undefined ? data.showSkills : true);
      setShowExperience(data.showExperience !== undefined ? data.showExperience : true);
      setShowProjects(data.showProjects !== undefined ? data.showProjects : true);
      setShowEducation(data.showEducation !== undefined ? data.showEducation : true);
      setShowCertifications(data.showCertifications !== undefined ? data.showCertifications : true);

      if (data.customSections && Array.isArray(data.customSections)) {
        setCustomSections(data.customSections);
      }

      if (data.sectionTitles) {
        setSectionTitles({
          summary: data.sectionTitles.summary || "Summary",
          skills: data.sectionTitles.skills || "Skills",
          experience: data.sectionTitles.experience || "Experience",
          projects: data.sectionTitles.projects || "Projects",
          education: data.sectionTitles.education || "Education",
          certifications: data.sectionTitles.certifications || "Certifications"
        });
      }
      setLocalResune(data);

      setFetchError("");
    } catch (err) {
      console.error("Error fetching resume:", err);
      setFetchError(`Failed to load resume: ${err.message}`);
    } finally {
      setIsLoadingResume(false);
    }
  };

  fetchResume();
}, [resumeId]);


  
  const addCustomSection = useCallback(() => {
    setCustomSections(prev => [...prev, {
      id: Date.now(),
      title: "New Section",
      items: [""]
    }]);
  }, []);

  const removeCustomSection = useCallback((id) => {
    setCustomSections(prev => prev.filter(section => section.id !== id));
  }, []);

  const updateCustomSectionTitle = useCallback((id, newTitle) => {
    setCustomSections(prev => prev.map(section =>
      section.id === id ? { ...section, title: newTitle } : section
    ));
  }, []);

  const updateCustomSectionItem = useCallback((id, itemIndex, value) => {
    setCustomSections(prev => prev.map(section => {
      if (section.id === id) {
        const newItems = [...section.items];
        newItems[itemIndex] = value;
        return { ...section, items: newItems };
      }
      return section;
    }));
  }, []);

  const addCustomSectionItem = useCallback((id) => {
    setCustomSections(prev => prev.map(section =>
      section.id === id ? { ...section, items: [...section.items, ""] } : section
    ));
  }, []);

  const removeCustomSectionItem = useCallback((id, itemIndex) => {
    setCustomSections(prev => prev.map(section => {
      if (section.id === id) {
        const newItems = section.items.filter((_, idx) => idx !== itemIndex);
        return { ...section, items: newItems };
      }
      return section;
    }));
  }, []);

  const combinedData = useMemo(
    () => ({
      resumeDetails,
      skills,
      experiences,
      projects,
      educationList,
      certifications,
      showSummary,
      showSkills,
      showExperience,
      showProjects,
      showEducation,
      showCertifications,
      customSections
    }),
    [resumeDetails, skills, experiences, projects, educationList, certifications, 
     showSummary, showSkills, showExperience, showProjects, showEducation, showCertifications, customSections]
  );
  
  const debouncedData = useDebounce(combinedData, 1500);


  const generatePreview = useCallback(async () => {
    if (isTemplateLoading) return;
    setGeneratingPreview(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      let doc;
      switch (selectedTemplate) {
        case "1":
          doc = React.createElement(ResumeDocument, { ...debouncedData, sectionTitles });
          break;
        case "2":
          doc = React.createElement(ModernResumeDocument, { ...debouncedData, sectionTitles });
          break;
        case "3":
          doc = React.createElement(ATSFriendlyResumeDocument, { ...debouncedData, sectionTitles });
          break;
        case "4":
          doc = React.createElement(ExecutiveEliteDocument, { ...debouncedData, sectionTitles });
          break;
        case "5":
          doc = React.createElement(TechInnovatorDocument, { ...debouncedData, sectionTitles });
          break;
        case "6":
          doc = React.createElement(AcademicScholarDocument, { ...debouncedData, sectionTitles });
          break;
        case "7":
          doc = React.createElement(NewTemplate, { ...debouncedData, sectionTitles });
          break;
        default:
          doc = React.createElement(CreativeBold, { ...debouncedData, sectionTitles });
      }

      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      setPdfBlob(blob);
    } catch (err) {
      console.error("Error generating preview:", err);
      setPdfBlob(null);
    } finally {
      setGeneratingPreview(false);
    }
  }, [selectedTemplate, debouncedData, sectionTitles, isTemplateLoading]);

  useEffect(() => {
    if (!isLoadingResume) {
      generatePreview();
    }
  }, [generatePreview, isLoadingResume]);


  // handling the enhanced resume

  const handleTemplateChange = useCallback((newTemplate) => {
    setIsTemplateLoading(true);
    setSelectedTemplate(newTemplate);
    setTimeout(() => setIsTemplateLoading(false), 100);
  }, []);

  const handleResumeDetailChange = useCallback((field, value) => {
    if (field in resumeDetails.contact) {
      setResumeDetails((prev) => ({
        ...prev,
        contact: { ...prev.contact, [field]: value },
      }));
    } else {
      setResumeDetails((prev) => ({ ...prev, [field]: value }));
    }
  }, [resumeDetails.contact]);

  const handleSkillChange = useCallback((i, value) => {
    setSkills(prev => {
      const updated = [...prev];
      updated[i] = value;
      return updated;
    });
  }, []);

  const addSkill = useCallback(() => setSkills(prev => [...prev, ""]), []);
  const removeSkill = useCallback((i) => setSkills(prev => prev.filter((_, idx) => idx !== i)), []);

  const handleExperienceChange = useCallback((i, field, value, sub) => {
    setExperiences(prev => {
      const updated = [...prev];
      if (field === "achievements") {
        updated[i].achievements[sub] = value;
      } else {
        updated[i][field] = value;
      }
      return updated;
    });
  }, []);

  const addExperience = useCallback(() => {
    setExperiences(prev => [...prev, {
      position: "",
      company: "",
      location: "",
      duration: "",
      achievements: [""]
    }]);
  }, []);

  const removeExperience = useCallback((i) => setExperiences(prev => prev.filter((_, idx) => idx !== i)), []);
  const addAchievement = useCallback((i) => {
    setExperiences(prev => {
      const updated = [...prev];
      updated[i].achievements.push("");
      return updated;
    });
  }, []);

  const removeAchievement = useCallback((i, j) => {
    setExperiences(prev => {
      const updated = [...prev];
      updated[i].achievements.splice(j, 1);
      return updated;
    });
  }, []);

  const handleProjectChange = useCallback((i, field, value, sub) => {
    setProjects(prev => {
      const updated = [...prev];
      if (field === "description") {
        updated[i].description[sub] = value;
      } else {
        updated[i][field] = value;
      }
      return updated;
    });
  }, []);

  const addProject = useCallback(() => {
    setProjects(prev => [...prev, {
      name: "",
      duration: "",
      technologies: "",
      description: [""],
      link: ""
    }]);
  }, []);

  const removeProject = useCallback((i) => setProjects(prev => prev.filter((_, idx) => idx !== i)), []);
  const addProjectPoint = useCallback((i) => {
    setProjects(prev => {
      const updated = [...prev];
      updated[i].description.push("");
      return updated;
    });
  }, []);

  const removeProjectPoint = useCallback((i, j) => {
    setProjects(prev => {
      const updated = [...prev];
      updated[i].description.splice(j, 1);
      return updated;
    });
  }, []);

  const handleEducationChange = useCallback((i, field, value) => {
    setEducationList(prev => {
      const updated = [...prev];
      updated[i][field] = value;
      return updated;
    });
  }, []);

  const addEducation = useCallback(() => {
    setEducationList(prev => [...prev, {
      degree: "",
      institution: "",
      location: "",
      year: "",
      gpa: ""
    }]);
  }, []);

  const removeEducation = useCallback((i) => setEducationList(prev => prev.filter((_, idx) => idx !== i)), []);

  const handleCertificationChange = useCallback((i, value) => {
    setCertifications(prev => {
      const updated = [...prev];
      updated[i] = value;
      return updated;
    });
  }, []);

  const addCertification = useCallback(() => setCertifications(prev => [...prev, ""]), []);
  const removeCertification = useCallback((i) => setCertifications(prev => prev.filter((_, idx) => idx !== i)), []);

  const downloadPDF = async () => {
    setDownloading(true);
    setSaveError("");
    try {
      const { pdf } = await import("@react-pdf/renderer");
      
      const downloadData = {
        resumeDetails,
        skills,
        experiences,
        projects,
        educationList,
        certifications,
        showSummary,
        showSkills,
        showExperience,
        showProjects,
        showEducation,
        showCertifications,
        customSections,
        sectionTitles
      };

      let doc;
      switch (selectedTemplate) {
        case "1":
          doc = React.createElement(ResumeDocument, downloadData);
          break;
        case "2":
          doc = React.createElement(ModernResumeDocument, downloadData);
          break;
        case "3":
          doc = React.createElement(ATSFriendlyResumeDocument, downloadData);
          break;
        case "4":
          doc = React.createElement(ExecutiveEliteDocument, downloadData);
          break;
        case "5":
          doc = React.createElement(TechInnovatorDocument, downloadData);
          break;
        case "6":
          doc = React.createElement(AcademicScholarDocument, downloadData);
          break;
        case "7":  
          doc = React.createElement(NewTemplate, downloadData);
          break;
        default:
          doc = React.createElement(CreativeBold, downloadData);
      }
      
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resumeDetails.name.replace(/\s+/g, "_") || "Resume"}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setSuccessMessage("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      setSaveError("Error generating PDF");
    } finally {
      setDownloading(false);
    }
  };




 
  
 const handleSaveAll = async () => {

  if(userId==null){
     window.showMessage('Please Login First.', 'warning');
     return;
  }
  setSaving(true);
  setMessage("Saving...");
  setLoading(true);
  setSaveError("");
  setSuccessMessage("");
  try {
    const transformedSkills = skills.map(skill => ({ name: skill.trim() })).filter(skill => skill.name !== "");
    const transformedCertifications = certifications.map(cert => ({ name: cert.trim() })).filter(cert => cert.name !== "");
    
    let title = resumeDetails.title;
    
    
    if (!resumeId && !title) {
      title = prompt("Enter the title for the resume");
      if (!title) {
        setSaving(false);
        return;
      }
    }
    
    
    
    const payload = {
      title,
      templateId: Number(selectedTemplate),
      userId : id ,
      details: {
        name: resumeDetails.name,
        title: resumeDetails.title,
        summary: resumeDetails.summary
      },
      contact: resumeDetails.contact,
      skills: transformedSkills,
      experiences,
      projects,
      educationList,
      certifications: transformedCertifications,
      showSummary,
      showSkills,
      showExperience,
      showProjects,
      showEducation,
      showCertifications,
      customSections,
      sectionTitles
    };


    console.log("=========================================================================");
    
    console.log(payload);

    
    
    
   
    
    const endpoint = currentResumeId 
      ? `${API_BASE_URL}/update/${resumeId}`
      : `${API_BASE_URL}/saveall`;

    console.log(`The endpoint was ${endpoint}`);
      
    
    const method = resumeId ? "PUT" : "POST";
    
    console.log(`Making ${method} request to:`, endpoint);
    
    const res = await fetch(endpoint, {
      method,
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload),
    });
    
    console.log(res);
    
    

    const message = localResumeId ? "Resume updated successfully!" : "Resume saved successfully!";
    setSuccessMessage(message);
    
    // if (!resumeId && data.id) {
    //   setTimeout(() => {
    //     window.location.href = `/dashboard/resume-editor/${data.id}`;
    //   }, 1500);
    // }

             // Check if the response is JSON
   const contentType = res.headers.get("content-type");
   if (!contentType || !contentType.includes("application/json")) {
     const textResponse = await res.text();
     console.error("Non-JSON response received:", textResponse);
     throw new Error(`Server returned non-JSON response. Status: ${res.status}`);
   }
   
   // If response not OK, throw an error
   if (!res.ok) {
     const errorData = await res.json().catch(() => null);
     const errorMessage = errorData?.message || `Save failed with status ${res.status}`;
     throw new Error(errorMessage);
   }
   
   // Parse JSON
   const data = await res.json(); // { message, resumeId }
   console.log("Response data:", data);
   
   // If this is the first save, store the resumeId in Redux or state
   if (!currentResumeId && data.resumeId) {
     dispatch(setCurrentResumeId(data.resumeId));
     setLocalResuneId(data.resumeId);
    }

    window.showMessage('Success', message, 'success', 1500);;

    


    
  } catch (err) {
    console.error("Save error:", err);
    setSaveError(`Failed to save resume: ${err.message}`);
    window.showMessage('Error', 'Unable to save your resume', 'error', 1500);
  } finally {
    setSaving(false);
    setLoading(false);
    setMessage("Loading...");
  }
};


  if (isLoadingResume) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '60px', height: '60px', animation: 'spin 2s linear infinite', margin: '0 auto 1rem' }}></div>
          <p>Loading resume...</p>
        </div>
      </div>
    );
  }

  if (resumeId && fetchError && !resumeDetails.name) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ marginBottom: '1rem', color: '#e74c3c' }}>Failed to Load Resume</h2>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>{fetchError}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={() => window.location.reload()} 
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}
            >
              Retry
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard'} 
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
     
      
      <div className="resume-editor-container">
        <div className="template-selector-header">
           <div className="template-selector-content">

            
             <h2 className="template-selector-title">
              {resumeId ? `Edit Resume: ${resumeTitle || 'Untitled'}` : 'Create New Resume'}
            </h2>

            


           </div>

           
        </div>

        <div className="editor-page-container">
            <LoadingAnimation message={message} show={loading}/>

            <div className="analyze-container">

                    <ResumeAnalyzer
                jobDescription={jobDescription}
                resumeDetails={resumeDetails}
                skills={skills}
                experiences={experiences}
                projects={projects}
                educationList={educationList}
                certifications={certifications}
                customSections={customSections}
                showSummary={true}
                showSkills={true}
                showExperience={true}
                showProjects={true}
                showEducation={true}
                showCertifications={true}
              />

           </div>  


             <div className="sec-manager">
                <h3>Manage Sections</h3>
                <div className="section-toggle-grid">
                  <div className="section-toggle-item">
                    <input type="checkbox" id="toggle-summary" checked={showSummary} onChange={(e) => setShowSummary(e.target.checked)} />
                    <label htmlFor="toggle-summary">Summary</label>
                  </div>
                  <div className="section-toggle-item">
                    <input type="checkbox" id="toggle-skills" checked={showSkills} onChange={(e) => setShowSkills(e.target.checked)} />
                    <label htmlFor="toggle-skills">Skills</label>
                  </div>
                  <div className="section-toggle-item">
                    <input type="checkbox" id="toggle-experience" checked={showExperience} onChange={(e) => setShowExperience(e.target.checked)} />
                    <label htmlFor="toggle-experience">Experience</label>
                  </div>
                  <div className="section-toggle-item">
                    <input type="checkbox" id="toggle-projects" checked={showProjects} onChange={(e) => setShowProjects(e.target.checked)} />
                    <label htmlFor="toggle-projects">Projects</label>
                  </div>
                  <div className="section-toggle-item">
                    <input type="checkbox" id="toggle-education" checked={showEducation} onChange={(e) => setShowEducation(e.target.checked)} />
                    <label htmlFor="toggle-education">Education</label>
                  </div>
                  <div className="section-toggle-item">
                    <input type="checkbox" id="toggle-certifications" checked={showCertifications} onChange={(e) => setShowCertifications(e.target.checked)} />
                    <label htmlFor="toggle-certifications">Certifications</label>
                  </div>
                </div>
                <button type="button" className="add-btn" onClick={addCustomSection}>
                  Add Custom Section
                </button>
              </div>



            

            <div className="editor-preview-wrapper">


              <div className="editor-panel">
               <div className="ats-resume" ref={resumeRef}>
              
                  {successMessage && (
                    <div className="success-message">
                      <span>✓</span>
                      <span>{successMessage}</span>
                    </div>
                  )}
    
                  {saveError && (
                    <div className="error-message">
                      <span>⚠</span>
                      <span>{saveError}</span>
                    </div>
                  )}
              
                  <header className="header">
                    <input className="name" value={resumeDetails.name} onChange={(e) => handleResumeDetailChange("name", e.target.value)} placeholder="Full Name" />
                    <input className="title" value={resumeDetails.title} onChange={(e) => handleResumeDetailChange("title", e.target.value)} placeholder="Professional Title" />
                    <div className="contact">
                      <input value={resumeDetails.contact.phone} onChange={(e) => handleResumeDetailChange("phone", e.target.value)} placeholder="Phone" />
                      <span className="separator">|</span>
                      <input value={resumeDetails.contact.email} onChange={(e) => handleResumeDetailChange("email", e.target.value)} placeholder="Email" />
                      <span className="separator">|</span>
                      <input value={resumeDetails.contact.linkedin} onChange={(e) => handleResumeDetailChange("linkedin", e.target.value)} placeholder="LinkedIn" />
                      <span className="separator">|</span>
                      <input value={resumeDetails.contact.github} onChange={(e) => handleResumeDetailChange("github", e.target.value)} placeholder="GitHub" />
                      <span className="separator">|</span>
                      <input value={resumeDetails.contact.location} onChange={(e) => handleResumeDetailChange("location", e.target.value)} placeholder="Location" />
                    </div>
                  </header>

              
    
                  
    
                  {showSummary && (
                    <section className="section">  
                      <div className="section-title">
                        <input className="sec-inputs" type="text" value={sectionTitles.summary} onChange={(e) => {
                          setSectionTitles({...sectionTitles, summary: e.target.value})
                        }} />
                      </div>
                      <textarea className="summary" value={resumeDetails.summary} onChange={(e) => handleResumeDetailChange("summary", e.target.value)} />
                    </section>
                  )}
    
                  {showSkills && (
                    <section className="section">
                      <div className="section-title">
                        <input type="text" className="sec-inputs" value={sectionTitles.skills} onChange={(e) => {
                          setSectionTitles({...sectionTitles, skills: e.target.value})
                        }} />
                      </div>
                      {Array.isArray(skills) && skills.map((skill, i) => (
                        <div className="skill" key={`skill-${i}`}>
                          <span className="bullet">•</span>
                          <input className="skill-text" value={skill || ""} onChange={(e) => handleSkillChange(i, e.target.value)} placeholder="Skill name" />
                          <button type="button" className="remove-small-btn" onClick={(e) => { e.preventDefault(); removeSkill(i); }}>×</button>
                        </div>
                      ))}
                      <button type="button" className="add-btn" onClick={addSkill}>Add Skill</button>
                    </section>
                  )}
    
                  {showExperience && (
                    <section className="section"> 
                      <div className="section-title">
                        <input type="text" value={sectionTitles.experience} className="sec-inputs"
                        onChange={(e) => {
                         setSectionTitles({...sectionTitles, experience: e.target.value})
                        }} />
                      </div>
                      {Array.isArray(experiences) && experiences.map((exp, i) => (
                        <div className="experience" key={`exp-${i}`}>
                          <div className="exp-header">
                            <input className="position" value={exp?.position || ""} onChange={(e) => handleExperienceChange(i, "position", e.target.value)} placeholder="Position" />
                            <input className="company" value={exp?.company || ""} onChange={(e) => handleExperienceChange(i, "company", e.target.value)} placeholder="Company" />
                            <input className="duration" value={exp?.duration || ""} onChange={(e) => handleExperienceChange(i, "duration", e.target.value)} placeholder="Duration" />
                            <button type="button" className="remove-small-btn" onClick={(e) => { e.preventDefault(); removeExperience(i); }}>Remove</button>
                          </div>
                          <input className="location" value={exp?.location || ""} onChange={(e) => handleExperienceChange(i, "location", e.target.value)} placeholder="Location" />
                          {Array.isArray(exp?.achievements) && exp.achievements.map((ach, j) => (
                            <div className="achievement" key={`ach-${i}-${j}`}>
                              <span className="bullet">•</span>
                              <input className="achievement-text" value={ach || ""} onChange={(e) => handleExperienceChange(i, "achievements", e.target.value, j)} placeholder="Achievement description" />
                              <button type="button" className="remove-small-btn" onClick={(e) => { e.preventDefault(); removeAchievement(i, j); }}>×</button>
                            </div>
                          ))}
                          <button type="button" className="add-small-btn" onClick={(e) => { e.preventDefault(); addAchievement(i); }}>Add Achievement</button>
                        </div>
                      ))}
                      <button type="button" className="add-btn" onClick={addExperience}>Add Experience</button>
                    </section>
                  )}
    
                  {showProjects && (
                    <section className="section">
                      <div className="section-title">
                        <input className="sec-inputs" type="text" value={sectionTitles.projects} onChange={(e) => {
                            setSectionTitles({...sectionTitles, projects: e.target.value})
                          }
                        } />
                      </div>
                      {Array.isArray(projects) && projects.map((proj, i) => (
                        <div className="project" key={`proj-${i}`}>
                          <div className="project-header">
                            <input className="project-name" value={proj?.name || ""} onChange={(e) => handleProjectChange(i, "name", e.target.value)} placeholder="Project Name" />
                            <input className="project-duration" value={proj?.duration || ""} onChange={(e) => handleProjectChange(i, "duration", e.target.value)} placeholder="Duration" />
                            <button type="button" className="remove-small-btn" onClick={(e) => { e.preventDefault(); removeProject(i); }}>Remove</button>
                          </div>
                          <input className="technologies" value={proj?.technologies || ""} onChange={(e) => handleProjectChange(i, "technologies", e.target.value)} placeholder="Technologies used" />
                          <input className="project-link" value={proj?.link || ""} onChange={(e) => handleProjectChange(i, "link", e.target.value)} placeholder="Project Link (optional)" />
                          {Array.isArray(proj?.description) && proj.description.map((desc, j) => (
                            <div className="description" key={`desc-${i}-${j}`}>
                              <span className="bullet">•</span>
                              <input className="description-text" value={desc || ""} onChange={(e) => handleProjectChange(i, "description", e.target.value, j)} placeholder="Project description point" />
                              <button type="button" className="remove-small-btn" onClick={(e) => { e.preventDefault(); removeProjectPoint(i, j); }}>×</button>
                            </div>
                          ))}
                          <button type="button" className="add-small-btn" onClick={(e) => { e.preventDefault(); addProjectPoint(i); }}>Add Description Point</button>
                        </div>
                      ))}
                      <button type="button" className="add-btn" onClick={addProject}>Add Project</button>
                    </section>
                  )}

                           {showEducation && (
                <section className="section">
                  <div className="section-title">
                    <input type="text" className="sec-inputs" value={sectionTitles.education} onChange={(e) => {
                      setSectionTitles({...sectionTitles, education: e.target.value})
                    }} />
                  </div>
                  {Array.isArray(educationList) && educationList.map((edu, i) => (
                    <div className="education" key={`edu-${i}`}>
                      <div className="edu-header">
                        <div className="edu-fields-wrapper">
                          <div className="edu-fields-row">
                            <input className="degree" value={edu?.degree || ""} onChange={(e) => handleEducationChange(i, "degree", e.target.value)} placeholder="Degree" />
                            <input className="year" value={edu?.year || ""} onChange={(e) => handleEducationChange(i, "year", e.target.value)} placeholder="Year" />
                          </div>
                          <input className="institution" value={edu?.institution || ""} onChange={(e) => handleEducationChange(i, "institution", e.target.value)} placeholder="Institution" />
                          <input className="edu-location" value={edu?.location || ""} onChange={(e) => handleEducationChange(i, "location", e.target.value)} placeholder="Location" />
                          <input className="gpa" value={edu?.gpa || ""} onChange={(e) => handleEducationChange(i, "gpa", e.target.value)} placeholder="GPA/Score (optional)" />
                        </div>
                        <button type="button" className="remove-btn" onClick={(e) => { e.preventDefault(); removeEducation(i); }}>Remove</button>
                      </div>
                    </div>
                  ))}
                  <button type="button" className="add-btn" onClick={addEducation}>Add Education</button>
                </section>
                )}

              {showCertifications && (
                <section className="section">
                  <div className="section-title">
                    <input type="text" className="sec-inputs" value={sectionTitles.certifications} onChange={(e) => {
                      setSectionTitles({...sectionTitles, certifications: e.target.value})
                    }} />
                  </div>
                  {Array.isArray(certifications) && certifications.map((cert, i) => (
                    <div className="certification" key={`cert-${i}`}>
                      <input className="cert-text" value={cert || ""} onChange={(e) => handleCertificationChange(i, e.target.value)} placeholder="Certification Name" />
                      <button type="button" className="remove-small-btn" onClick={(e) => { e.preventDefault(); removeCertification(i); }}>Remove</button>
                    </div>
                  ))}
                  <button type="button" className="add-btn" onClick={addCertification}>Add Certification</button>
                </section>
              )}

              {customSections.map((section) => (
                <div key={section.id} className="custom-section-container">
                  <div className="custom-section-header">
                    <input type="text" className="custom-section-title-input" value={section.title} onChange={(e) => updateCustomSectionTitle(section.id, e.target.value)} placeholder="Section Title" />
                    <button type="button" className="remove-small-btn" onClick={() => removeCustomSection(section.id)}>Remove Section</button>
                  </div>
                  {section.items.map((item, idx) => (
                    <div key={idx} className="skill" style={{ marginBottom: '0.5rem' }}>
                      <span className="bullet">•</span>
                      <input className="skill-text" value={item} onChange={(e) => updateCustomSectionItem(section.id, idx, e.target.value)} placeholder="Item content" />
                      <button type="button" className="remove-small-btn" onClick={() => removeCustomSectionItem(section.id, idx)}>×</button>
                    </div>
                  ))}
                  <button type="button" className="add-small-btn" onClick={() => addCustomSectionItem(section.id)}>Add Item</button>
                </div>
              ))}

              <div className="action-buttons">
                <button className="btn-primary" onClick={handleSaveAll} disabled={saving}>
                  {saving ? "Saving..." : localResumeId ? "Update Resume" : "Save Resume"}
                </button>
                <button className="btn-secondary" onClick={downloadPDF} disabled={downloading}>
                  {downloading ? "Generating..." : "Download PDF"}
                </button>
              </div>
            </div>
          </div>







          
          <div className="preview-panel">

            <div className="preview-header">
              <h3>Live Preview</h3>
              <div className="template-selector-controls">
              <label className="template-label">Choose Template:</label>
              <select value={selectedTemplate} onChange={(e) => handleTemplateChange(e.target.value)} className="template-select">
                <option value="1">Classic Template</option>
                <option value="2">Modern Template</option>
                <option value="3">ATS-Friendly Template</option>
                <option value="4">Executive Elite</option>
                <option value="5">Tech Innovator</option>
                <option value="6">Academic Scholar</option>
                <option value="7">New ATS-Friendly Template</option>
                <option value="8">Creative Bold</option>
              </select>
              {(isTemplateLoading || generatingPreview) && (
                <span className="template-loading">
                  {isTemplateLoading ? "Loading template..." : "Generating preview..."}
                </span>
              )}
            </div>
            </div>

            
            <div className="preview-content">
              <ErrorBoundary>
                <PDFViewer pdfBlob={pdfBlob} />
              </ErrorBoundary>
            </div>
          </div>



              
            </div>


              



      </div>

        
       
        

        


        <div className="resume-editor-main">
          
          
          

        </div>


        
      </div>
    </>
  );
}