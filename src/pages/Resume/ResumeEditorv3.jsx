import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import "./css-files/ResumeEditor.css";
import ErrorBoundary from "../../ErrorBoundry.jsx";
import ResumeAnalyzer from "./ResumeAnalyzer.jsx";
import { AlignRight } from "lucide-react";
import LoadingAnimation from "../../components/PopUp/LoadingAnimation.jsx";
import api from "../../api/axios.js";

// Import Template Configurations
// Template Imports
// Template Imports
import CoustomTemplate from './CoustomTemplate.jsx';


import { useDispatch, useSelector } from 'react-redux';
import { setCurrentResume, setEnhancedResume, setCurrentTemplate, setSavedStyleConfig } from "../../redux/store.js";
import { setCurrentResumeId } from "../../redux/store.js";
import FatbricPDF from "../../FabricDemo.jsx";
import { Font, BlobProvider } from "@react-pdf/renderer";

// WebGL Engine Imports
import { PixiRendererEngine as PixiRenderer, GeometrySnapshot, HybridRenderer, WebGLStage } from "../../components/engine/WebEngine.jsx";
import {
    FlexibleCertificationsSection, FlexibleContactSection,
    FlexibleEducationSection, FlexibleExperienceSection,
    FlexibleHeaderSection, FlexibleProjectsSection,
    FlexibleSkillsSection, FlexibleSummarySection,
    FlexibleCustomSection
} from "../UI-Edits/BaseTemplates.jsx";
import * as PIXI from 'pixi.js';
import { jsPDF } from "jspdf";
import {
    ATS_TEMPLATE_CONFIG,
    ATS_COMPACT_CONFIG,
    MODERN_TEMPLATE_CONFIG,
    TWO_COLUMN_TEMPLATE_CONFIG,
    TEMPLATE5_CONFIG,
    NEW_ATS_CONFIG,
    BALANCED_HYBRID_CONFIG
} from "../UI-Edits/TemplateConfigs.js";
import { defaultResumeData, defaultDatasets } from "../UI-Edits/Utils.js";

// ==================== TEMPLATE MAPPINGS ====================
const TEMPLATES = {
    ats: ATS_TEMPLATE_CONFIG,
    atsCompact: ATS_COMPACT_CONFIG,
    balancedHybrid: BALANCED_HYBRID_CONFIG,
    modern: MODERN_TEMPLATE_CONFIG,
    twoColumn: TWO_COLUMN_TEMPLATE_CONFIG,
    template5: TEMPLATE5_CONFIG,
    newAts: NEW_ATS_CONFIG
};

Font.register({
    family: "Arial, sans-serif",
    src: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2"
});








const API_BASE_URL2 = 'http://localhost:8080';
const API_BASE_URL = 'https://resumemaker-1.onrender.com';

// Map template IDs to their configurations


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




export default function ResumeEditor({ resume: propsResume }) {
    const { resumeId } = useParams();
    const resumeRef = useRef();
    const [jobDescription, setJobDescription] = useState('');
    const [jobDescriptionInsights, setJobDescriptionInsights] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
    const [isAIAnalysis, setIsAIAnalysis] = useState(false);
    const id = useSelector((s) => s.auth.userId);
    const userId = id;
    const currentResumeId = useSelector((state) => state.auth.currentResumeId);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const resumePdf = useSelector(state => state.resume.globalCurrentPdf);



    const [localResume, setLocalResume] = useState(null);

    console.log("From the state the user id is" + userId);




    const [isLoadingResume, setIsLoadingResume] = useState(false);
    const [resumeTitle, setResumeTitle] = useState("");
    const [fetchError, setFetchError] = useState("");
    const [activeSection, setActiveSection] = useState("summary");

    const [showSummary, setShowSummary] = useState(true);
    const [showSkills, setShowSkills] = useState(true);
    const [showExperience, setShowExperience] = useState(true);
    const [showProjects, setShowProjects] = useState(true);
    const [showEducation, setShowEducation] = useState(true);
    const [showCertifications, setShowCertifications] = useState(true);
    // Sync currentResumeId from URL param on mount
    useEffect(() => {
        if (resumeId) {
            dispatch(setCurrentResumeId(resumeId));
            console.log(`[Sync] Updated currentResumeId from URL: ${resumeId}`);
        }
    }, [resumeId, dispatch]);

    // ==================== RESPONSIVE CANVAS STATE ====================
    const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobileView = viewportWidth < 768;
    const canvasTargetWidth = isMobileView ? (viewportWidth - 30) : 595;
    const canvasScale = canvasTargetWidth / 595;
    const canvasTargetHeight = 842 * canvasScale;

    // ==================== WebGL ENGINE STATE ====================
    const [sectionSnapshots, setSectionSnapshots] = useState({});
    const [sectionPositions, setSectionPositions] = useState(() => {
        const config = MODERN_TEMPLATE_CONFIG;
        return config.positions || {
            header: { x: 40, y: 50 },
            summary: { x: 40, y: 150 },
            skills: { x: 40, y: 250 },
            experience: { x: 40, y: 350 },
            projects: { x: 40, y: 550 },
            education: { x: 40, y: 750 },
            certifications: { x: 40, y: 850 },
            custom: { x: 40, y: 950 }
        };
    });
    const sectionRefs = useRef({});
    const [styleConfig, setStyleConfig] = useState(() => {
        const config = MODERN_TEMPLATE_CONFIG;
        const defaultStyle = {};
        ["header", "summary", "skills", "experience", "projects", "education", "certifications"].forEach(key => {
            if (config[key]) defaultStyle[key] = config[key];
        });
        return defaultStyle;
    });
    const [lines, setLines] = useState(() => {
        const config = MODERN_TEMPLATE_CONFIG;
        return config.lines || [];
    });
    const [backgroundShapes, setBackgroundShapes] = useState(() => {
        const config = MODERN_TEMPLATE_CONFIG;
        return config.shapes || [];
    });
    const [showPage2, setShowPage2] = useState(false);
    const prevStyleConfigRef = useRef({});
    const [isAutoFlowEnabled, setIsAutoFlowEnabled] = useState(false); // Auto-flow OFF by default
    const [webglResetKey, setWebglResetKey] = useState(0); // 🔄 WebGL restart key
    const [sectionWidths, setSectionWidths] = useState({});
    const [sectionHeights, setSectionHeights] = useState({});
    // ============================================================

    const [customSections, setCustomSections] = useState([]);

    const enhancedResume = useSelector((state) => state.resume.enhancedResume);
    const importedResume = useSelector(state => state.resume.importedResume);
    const currentResume = useSelector(state => state.resume.currentResume);
    const [localResumeId, setLocalResumeId] = useState(resumeId || null);
    const [isTitleEditable, setIsTitleEditable] = useState(false); // Default: Titles are locked


    useEffect(() => {
        if (!importedResume) return;




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

        // CUSTOM SECTIONS
        const newCustomSections = Array.isArray(importedResume?.customSections)
            ? [...importedResume.customSections]
            : (Array.isArray(importedResume?.custom) ? [...importedResume.custom] : []);

        setCustomSections(newCustomSections);
    }, [importedResume]);

    // 🛡️ SYNC CUSTOM SECTIONS TO WEBGL (Auto-Initialize Positions)
    useEffect(() => {
        if (customSections.length === 0) return;

        setSectionPositions(prev => {
            const updated = { ...prev };
            let hasChanges = false;

            // Calculate starting Y for new sections
            const maxY = Object.values(updated).reduce((max, pos) => Math.max(max, pos.y), 0);
            let nextY = maxY + 100;

            customSections.forEach(section => {
                const sectionId = `custom-${section.id}`;
                if (!updated[sectionId]) {
                    updated[sectionId] = { x: 40, y: nextY };
                    nextY += 150; // Buffer for stacking
                    hasChanges = true;
                }
            });

            return hasChanges ? updated : prev;
        });
    }, [customSections]);

    useEffect(() => {

        if (!enhancedResume) return;
        applyEnhancedResume(enhancedResume);


    }, [enhancedResume]);



    const applyEnhancedResume = (enhancedResume) => {
        if (!enhancedResume) return;


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
        if (Array.isArray(enhancedResume?.projects)) {
            setProjects(prev =>
                enhancedResume.projects.map((proj, i) => {
                    const prevProj = prev[i] || {};
                    return {
                        name: proj.name || prevProj.name || "",
                        duration: proj.duration || prevProj.duration || "",
                        technologies: proj.technologies || prevProj.technologies || "",
                        description: Array.isArray(proj.description) && proj.description.length > 0
                            ? [...proj.description]         // clone API array
                            : prevProj.description
                                ? [...prevProj.description]  // clone previous state array
                                : [""],
                        link: proj.link || prevProj.link || ""
                    };
                })
            );
        }

        // ---------------- Education ----------------
        if (Array.isArray(enhancedResume?.educationList)) {
            setEducationList(
                enhancedResume.educationList.map(e => ({
                    degree: e?.degree ?? "",
                    gpa: e?.gpa ?? e?.grade ?? "",
                    institution: e?.institution ?? e?.university ?? "",
                    location: e?.location ?? "",
                    year: e?.year ?? e?.date ?? "",
                }))
            );
        }

        // ---------------- Certifications ----------------
        if (Array.isArray(enhancedResume?.certifications)) {
            setCertifications(
                enhancedResume.certifications.map(c => (typeof c === "string" ? c : c?.name ?? c?.title ?? ""))
            );
        }


    };


















    const [resumeDetails, setResumeDetails] = useState(defaultResumeData.resumeDetails);

    const [skills, setSkills] = useState(defaultResumeData.skills);


    const [experiences, setExperiences] = useState(defaultResumeData.experiences);

    const [projects, setProjects] = useState(defaultResumeData.projects);

    const [educationList, setEducationList] = useState(defaultResumeData.educationList);

    const [certifications, setCertifications] = useState(defaultResumeData.certifications);

    const [sectionTitles, setSectionTitles] = useState(defaultResumeData.sectionTitles);




    // AI-powered detailed analysis



    const [saving, setSaving] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("modern"); // Changed from "1" to "modern" template key
    const [isTemplateLoading, setIsTemplateLoading] = useState(false);
    const [pdfBlob, setPdfBlob] = useState(null);
    const [generatingPreview, setGeneratingPreview] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("Loading...");

    // Auto-scroll toggle state
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

    // ⚡ WebGL Snapshot Capture Effect
    useEffect(() => {
        const sections = [
            'header', 'summary', 'skills', 'experience', 'projects', 'education', 'certifications',
            ...(customSections || []).map(s => `custom-${s.id}`)
        ];

        // Ensure refs exist
        sections.forEach(section => {
            if (!sectionRefs.current[section]) {
                sectionRefs.current[section] = null; // Will be set by ref callback
            }
        });

        const renderSectionData = async (sectionName) => {
            const ref = sectionRefs.current[sectionName];
            if (!ref?.current) {
                // 🛡️ If ref is missing (hidden/empty), explicitly clear the snapshot
                setSectionSnapshots(prev => {
                    if (prev[sectionName]) {
                        const next = { ...prev };
                        delete next[sectionName];
                        return next;
                    }
                    return prev;
                });
                return;
            }

            const element = ref.current;
            const currentStyle = styleConfig[sectionName] || {};
            const prevStyle = prevStyleConfigRef.current[sectionName] || {};

            const hasSnapshot = !!sectionSnapshots[sectionName];
            // FIX: Always capture if effect runs, as it means either Data or Style changed.
            // checking only shouldReCapture(style) ignores text updates.
            const needsCapture = true;

            if (!needsCapture) return;

            try {
                await document.fonts.ready;
                element.offsetHeight; // Trigger reflow

                const scanner = new GeometrySnapshot();
                const snapshot = await scanner.capture(element);
                setSectionSnapshots(prev => ({ ...prev, [sectionName]: snapshot }));
            } catch (error) {
                console.error(`Error rendering ${sectionName}:`, error);
            }
        };

        const renderAllSections = async () => {
            const sections = Object.keys(sectionRefs.current);
            await Promise.all(sections.map(sectionName => renderSectionData(sectionName)));
            prevStyleConfigRef.current = JSON.parse(JSON.stringify(styleConfig));
        };

        const timer = setTimeout(renderAllSections, 100);
        return () => clearTimeout(timer);
    }, [selectedTemplate, styleConfig, resumeDetails, skills, experiences, projects, educationList, certifications, customSections]);


    // 📥 INITIALIZE FROM GLOBAL REDUX: Load data if returning from another page
    useEffect(() => {
        if (currentResume && !localResume && !isLoadingResume) {
            console.log("📥 Initializing Editorv3 from global currentResume");

            setLocalResume(currentResume); // 🟢 Mark as loaded to prevent re-init or fetch overwrite if inappropriate

            if (currentResume.resumeDetails) setResumeDetails(currentResume.resumeDetails);
            if (currentResume.skills) setSkills(currentResume.skills);
            if (currentResume.experiences) setExperiences(currentResume.experiences);
            if (currentResume.projects) setProjects(currentResume.projects);
            if (currentResume.educationList) setEducationList(currentResume.educationList);
            if (currentResume.certifications) setCertifications(currentResume.certifications);
            if (currentResume.customSections) setCustomSections(currentResume.customSections);
            if (currentResume.sectionTitles) setSectionTitles(currentResume.sectionTitles);

            setShowSummary(currentResume.showSummary !== undefined ? currentResume.showSummary : true);
            setShowSkills(currentResume.showSkills !== undefined ? currentResume.showSkills : true);
            setShowExperience(currentResume.showExperience !== undefined ? currentResume.showExperience : true);
            setShowProjects(currentResume.showProjects !== undefined ? currentResume.showProjects : true);
            setShowEducation(currentResume.showEducation !== undefined ? currentResume.showEducation : true);
            setShowCertifications(currentResume.showCertifications !== undefined ? currentResume.showCertifications : true);
        } else if (!resumeId && !localResume && !isLoadingResume) {
            // 🏠 Check for Custom Default in LocalStorage
            const customDefault = localStorage.getItem('user_custom_default_resume');
            if (customDefault) {
                try {
                    console.log("🏠 Loading custom default from localStorage");
                    const data = JSON.parse(customDefault);
                    setLocalResume(data); // Mark initialized
                    if (data.resumeDetails) setResumeDetails(data.resumeDetails);
                    if (data.skills) setSkills(data.skills);
                    if (data.experiences) setExperiences(data.experiences);
                    if (data.projects) setProjects(data.projects);
                    if (data.educationList) setEducationList(data.educationList);
                    if (data.certifications) setCertifications(data.certifications);
                    if (data.customSections) setCustomSections(data.customSections);
                    if (data.sectionTitles) setSectionTitles(data.sectionTitles);
                } catch (e) {
                    console.error("Error loading custom default", e);
                }
            }
        }
    }, [currentResume, localResume, isLoadingResume, resumeId]);

    // 🎯 REACTIVE AUTO-FLOW: Trigger on content change (from b3.jsx line 1272)
    useEffect(() => {
        // 🛡️ Disable auto-flow for multi-column templates based on Config ID/Type
        const isMultiColumn = styleConfig.type === 'multi-column' || styleConfig.id === 'two-column-professional';

        // Debug logging
        console.log('🔍 Auto-flow check:', {
            templateType: styleConfig.type,
            templateId: styleConfig.id,
            isMultiColumn,
            isAutoFlowEnabled,
            snapshotCount: Object.keys(sectionSnapshots).length
        });

        if (isMultiColumn) {
            console.log('🚫 Auto-flow DISABLED: Multi-column template detected');
            return;
        }

        if (isAutoFlowEnabled && Object.keys(sectionSnapshots).length > 0) {
            console.log('✅ Auto-flow TRIGGERED');
            autoFlowSections();
        }
    }, [sectionSnapshots, resumeDetails, isAutoFlowEnabled, styleConfig.type, styleConfig.id]);

    // 🔄 Sync selectedTemplate to Redux global state for b3 advanced editor
    useEffect(() => {
        dispatch(setCurrentTemplate(selectedTemplate));
        console.log('📤 Template synced to Redux:', selectedTemplate);
    }, [selectedTemplate, dispatch]);




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

            const MAX_RETRIES = 3;
            let attempt = 0;
            const timeout = 30000;

            while (attempt < MAX_RETRIES) {
                let controller;

                try {
                    controller = new AbortController();
                    const tid = setTimeout(() => controller.abort(), timeout);

                    const response = await api.get(`/my-resumes/getresume/${resumeId}`, {
                        signal: controller.signal
                    });

                    clearTimeout(tid);

                    if (response.status === 404) {
                        setFetchError("Resume not found. It may have been deleted.");
                        setIsLoadingResume(false);
                        return;
                    }

                    // Axios throws on non-2xx status, effectively handling !response.ok check


                    const data = response.data;
                    console.log("Fetched resume data:====================");
                    console.log(data);
                    console.log("=======================================");





                    setResumeTitle(data.title || "");

                    let config = data.styleConfig || data.details?.styleConfig || {};
                    if (typeof config === 'string') {
                        try {
                            config = JSON.parse(config);
                        } catch (e) {
                            console.error("Error parsing styleConfig", e);
                            config = {};
                        }
                    }

                    // If style config is available, switch to Custom Template automatically
                    console.log("DEBUG: Parsed Config:", config);
                    console.log("DEBUG: Config Keys:", config ? Object.keys(config) : "null");

                    // FIX_START



                    // 1️⃣ Normalize Template ID
                    const tId = data.templateId ? String(data.templateId) : "1";

                    // 2️⃣ Resolve Base Configuration
                    // Try to find if the ID is a direct config key (like 'ats-optimized') or map it
                    // 2️⃣ Define Mappings
                    const CONFIG_ID_TO_KEY = {
                        "ats-optimized": "ats",
                        "modern-ats-two-column": "modern",
                        "two-column-professional": "twoColumn",
                        "ats-edgy": "newAts",
                        "tech-innovator": "template5"
                    };

                    console.log("DEBUG: Loading Template ID:", tId);
                    setSelectedTemplate(tId);

                    // 3️⃣ Load Base Defaults
                    // 3️⃣ Load Base Defaults (Sync with b3.jsx logic)
                    const TEMPLATE_ID_MAP = {
                        1: 'ats',           // Classic Template -> ATS
                        2: 'modern',        // Modern Template
                        3: 'ats',           // ATS-Friendly Template
                        4: 'twoColumn',     // Executive Elite -> Two Column
                        5: 'template5',     // Tech Innovator
                        6: 'newAts',        // Academic Scholar -> New ATS
                        7: 'modern',        // Creative Bold -> Modern
                        10: 'ats',          // Template Coutom ats
                        11: 'modern'        // Template Coutom modern
                    };

                    const TEMPLATES_MAP = {
                        ats: ATS_TEMPLATE_CONFIG,
                        modern: MODERN_TEMPLATE_CONFIG,
                        twoColumn: TWO_COLUMN_TEMPLATE_CONFIG,
                        template5: TEMPLATE5_CONFIG, // Ensure this import exists
                        newAts: NEW_ATS_CONFIG      // Ensure this import exists
                    };

                    // Resolve key from ID (handle numeric vs string)
                    let resolvedKey = 'ats'; // Default
                    if (TEMPLATE_ID_MAP[tId]) {
                        resolvedKey = TEMPLATE_ID_MAP[tId];
                    } else if (TEMPLATES_MAP[tId]) {
                        resolvedKey = tId; // It was already a key like 'ats'
                    } else if (CONFIG_ID_TO_KEY[tId]) {
                        resolvedKey = CONFIG_ID_TO_KEY[tId]; // Handle aliases like 'ats-optimized'
                    }

                    console.log("DEBUG: Resolved Template Key:", resolvedKey);

                    const baseConfig = TEMPLATES_MAP[resolvedKey] || ATS_TEMPLATE_CONFIG;

                    // 4️⃣ Create Initial Style Config from Base
                    const newStyle = JSON.parse(JSON.stringify(baseConfig)); // Deep copy to avoid mutation issues

                    // 5️⃣ OVERLAY Saved Style Config (The "Custom" Part)
                    if (data.styleConfig) {
                        console.log("✨ Applying Saved Style Config Overlay");
                        dispatch(setSavedStyleConfig(data.styleConfig)); // 🔄 Sync to global Redux for b3.jsx
                        // We merge top-level keys. For nested style objects, we might want deeper merge, 
                        // but usually replacing the section config object is safer to ensure consistency.
                        Object.keys(data.styleConfig).forEach(key => {
                            if (data.styleConfig[key]) {
                                newStyle[key] = data.styleConfig[key];
                            }
                        });
                    }

                    setStyleConfig(newStyle);

                    // 6️⃣ Set Positions/Lines/Shapes (Priority: Saved > Base)
                    // If saved config has them, use them. Else use base.
                    setSectionPositions((data.styleConfig && data.styleConfig.positions) || baseConfig.positions || {});
                    setLines((data.styleConfig && data.styleConfig.lines) || baseConfig.lines || []);
                    setBackgroundShapes((data.styleConfig && data.styleConfig.shapes) || baseConfig.shapes || []);


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
                        },
                        styleConfig: newStyle
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
                        // Transform backend format to frontend format
                        // Backend sends: { title: "...", sectionData: { items: [...] } }
                        // Frontend needs: { id: ..., title: "...", items: [...] }
                        // Note: Generate unique client-side IDs since they're not saved to backend
                        const transformedCustomSections = data.customSections.map((section, index) => {
                            // If sectionData is a string (JSON), parse it
                            let sectionData = section.sectionData;
                            if (typeof sectionData === 'string') {
                                try {
                                    sectionData = JSON.parse(sectionData);
                                } catch (e) {
                                    console.error('Error parsing sectionData:', e);
                                    sectionData = { items: [] };
                                }
                            }

                            return {
                                id: Date.now() + index, // Generate unique ID for each section
                                title: section.title || "Untitled Section",
                                items: sectionData?.items || []
                            };
                        });
                        setCustomSections(transformedCustomSections);
                        console.log("Loaded custom sections:", transformedCustomSections);
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
                    setLocalResume(data);

                    setFetchError("");
                    setIsLoadingResume(false);
                    return; // Success!

                } catch (err) {
                    console.error(`Fetch resume attempt ${attempt + 1} failed:`, err);
                    const isRetryable = err.name === 'AbortError' || err.message.includes('Failed to fetch');

                    if (isRetryable && attempt < MAX_RETRIES - 1) {
                        attempt++;
                        const delay = Math.pow(2, attempt - 1) * 1000;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }

                    setFetchError(err.name === 'AbortError' ? "Server is not up" : `Failed to load resume: ${err.message}`);
                    break;
                }
            }
            setIsLoadingResume(false);
        };

        fetchResume();
    }, [resumeId, dispatch]);



    const addCustomSection = useCallback(() => {
        const newId = Date.now();
        setCustomSections(prev => [...prev, {
            id: newId,
            title: "New Section",
            items: [""]
        }]);
    }, []);

    const removeCustomSection = useCallback((id) => {
        const sectionId = `custom-${id}`;
        setSectionPositions(prev => {
            const newPos = { ...prev };
            delete newPos[sectionId];
            return newPos;
        });
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
                const newItems = [...(section.items || [])];
                newItems[itemIndex] = value;
                return { ...section, items: newItems };
            }
            return section;
        }));
    }, []);

    const addCustomSectionItem = useCallback((id) => {
        setCustomSections(prev => prev.map(section =>
            section.id === id ? { ...section, items: [...(section.items || []), ""] } : section
        ));
    }, []);

    const removeCustomSectionItem = useCallback((id, itemIndex) => {
        setCustomSections(prev => prev.map(section => {
            if (section.id === id) {
                const newItems = (section.items || []).filter((_, idx) => idx !== itemIndex);
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
            customSections,
            sectionTitles
        }),
        [resumeDetails, skills, experiences, projects, educationList, certifications,
            showSummary, showSkills, showExperience, showProjects, showEducation, showCertifications, customSections, sectionTitles]
    );

    const debouncedData = useDebounce(combinedData, 1500);




    //pdf generation from react component
    // const generatePreview = useCallback(async () => {
    //     if (isTemplateLoading) return;
    //     setGeneratingPreview(true);
    //     try {
    //         const { pdf } = await import("@react-pdf/renderer");
    //         let doc;
    //         switch (selectedTemplate) {
    //             case "1":
    //                 doc = React.createElement(ResumeDocument, debouncedData);
    //                 break;
    //             case "2":
    //                 doc = React.createElement(ModernResumeDocument, debouncedData);
    //                 break;
    //             case "3":
    //                 doc = React.createElement(ATSFriendlyResumeDocument, debouncedData);
    //                 break;
    //             case "4":
    //                 doc = React.createElement(ExecutiveEliteDocument, debouncedData);
    //                 break;
    //             case "5":
    //                 doc = React.createElement(TechInnovatorDocument, debouncedData);
    //                 break;
    //             case "6":
    //                 doc = React.createElement(AcademicScholarDocument, debouncedData);
    //                 break;
    //             case "7":
    //                 doc = React.createElement(CreativeBold, debouncedData);
    //                 break;
    //             case "8":
    //                 doc = React.createElement(NewTemplate, debouncedData);
    //                 break;
    //             case "custom":
    //                 doc = React.createElement(CoustomTemplate, {
    //                     ...debouncedData,
    //                     styleConfig: resumeDetails.styleConfig || {}
    //                 });
    //                 break;
    //             default:
    //                 doc = React.createElement(ResumeDocument, debouncedData);
    //         }

    //         const asPdf = pdf(doc);
    //         const blob = await asPdf.toBlob();
    //         setPdfBlob(blob);
    //     } catch (err) {
    //         console.error("Error generating preview:", err);
    //         setPdfBlob(null);
    //     } finally {
    //         setGeneratingPreview(false);
    //     }
    // }, [selectedTemplate, debouncedData, sectionTitles, isTemplateLoading]);


    const CurrentTemplateDoc = useMemo(() => {
        if (isTemplateLoading) return null;
        console.log("️ [RENDER] Creating React Document for template:", selectedTemplate);
        switch (selectedTemplate) {
            case "custom":
                return <CoustomTemplate
                    {...debouncedData}
                    styleConfig={resumeDetails.styleConfig || {}}
                />;
            default: return <CoustomTemplate
                {...debouncedData}
                styleConfig={resumeDetails.styleConfig || {}}
            />;
        }
    }, [selectedTemplate, debouncedData, isTemplateLoading, resumeDetails.styleConfig]);


    // Removal of old generatePreview effects


    // handling the enhanced resume

    const handleTemplateChange = useCallback((newTemplate) => {
        setIsTemplateLoading(true);
        setSelectedTemplate(newTemplate);
        dispatch(setCurrentTemplate(newTemplate)); // 🔄 Sync to global Redux

        // Sync WebGL Layout using TEMPLATES object
        const config = TEMPLATES[newTemplate];
        if (config) {
            if (config.positions) setSectionPositions(config.positions);
            if (config.lines) setLines(config.lines);
            if (config.shapes) setBackgroundShapes(config.shapes);
            // Deep clone style config if needed
            const newStyle = {};
            ["header", "summary", "skills", "experience", "projects", "education", "certifications"].forEach(key => {
                if (config[key]) newStyle[key] = JSON.parse(JSON.stringify(config[key]));
            });
            if (Object.keys(newStyle).length > 0) {
                const updatedStyle = { ...styleConfig, ...newStyle };
                setStyleConfig(updatedStyle);
                dispatch(setSavedStyleConfig({
                    ...updatedStyle,
                    positions: config.positions || {},
                    lines: config.lines || [],
                    shapes: config.shapes || []
                }));
            }
        }

        setTimeout(() => setIsTemplateLoading(false), 100);
    }, []);

    const handleDatasetChange = useCallback((datasetKey) => {
        const data = defaultDatasets[datasetKey].data;
        if (!data) return;

        setResumeDetails(data.resumeDetails);
        setSkills(data.skills || []);
        setExperiences(data.experiences || []);
        setProjects(data.projects || []);
        setEducationList(data.educationList || []);
        setCertifications(data.certifications || []);
        setCustomSections(data.customSections || []);
        setSectionTitles(data.sectionTitles || defaultResumeData.sectionTitles);

        // Success feedback
        setSuccessMessage(`Loaded ${defaultDatasets[datasetKey].name} data successfully!`);
    }, [setResumeDetails, setSkills, setExperiences, setProjects, setEducationList, setCertifications, setCustomSections, setSectionTitles]);

    const handleSaveCurrentAsDefault = () => {
        const data = buildResumePayload();
        localStorage.setItem('user_custom_default_resume', JSON.stringify(data));
        setSuccessMessage("Current resume saved as your personal default!");
    };

    const handleResetToFactoryDefault = () => {
        localStorage.removeItem('user_custom_default_resume');

        // Load Sumit's data as factory default
        const data = defaultResumeData;
        setResumeDetails(data.resumeDetails);
        setSkills(data.skills);
        setExperiences(data.experiences);
        setProjects(data.projects);
        setEducationList(data.educationList);
        setCertifications(data.certifications);
        setCustomSections([]);
        setSectionTitles(data.sectionTitles);

        setSuccessMessage("Reset to factory default resume.");
    };

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

    const addSkill = useCallback(() => setSkills(prev => [...(prev || []), ""]), []);
    const removeSkill = useCallback((i) => setSkills(prev => (prev || []).filter((_, idx) => idx !== i)), []);

    const handleExperienceChange = useCallback((i, field, value, sub) => {
        setExperiences(prev => {
            const updated = [...prev];
            const exp = { ...updated[i] };
            if (field === "achievements") {
                const newAchievements = [...(exp.achievements || [])];
                newAchievements[sub] = value;
                exp.achievements = newAchievements;
            } else {
                exp[field] = value;
            }
            updated[i] = exp;
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
            const exp = { ...updated[i] };
            exp.achievements = [...(exp.achievements || []), ""];
            updated[i] = exp;
            return updated;
        });
    }, []);

    const removeAchievement = useCallback((i, j) => {
        setExperiences(prev => {
            const updated = [...prev];
            const exp = { ...updated[i] };
            exp.achievements = (exp.achievements || []).filter((_, idx) => idx !== j);
            updated[i] = exp;
            return updated;
        });
    }, []);

    const handleProjectChange = useCallback((i, field, value, sub) => {
        setProjects(prev => {
            const updated = [...prev];
            const proj = { ...updated[i] };
            if (field === "description") {
                const newDescription = [...(proj.description || [])];
                newDescription[sub] = value;
                proj.description = newDescription;
            } else {
                proj[field] = value;
            }
            updated[i] = proj;
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
            const proj = { ...updated[i] };
            proj.description = [...(proj.description || []), ""];
            updated[i] = proj;
            return updated;
        });
    }, []);

    const removeProjectPoint = useCallback((i, j) => {
        setProjects(prev => {
            const updated = [...prev];
            const proj = { ...updated[i] };
            proj.description = (proj.description || []).filter((_, idx) => idx !== j);
            updated[i] = proj;
            return updated;
        });
    }, []);

    const handleEducationChange = useCallback((i, field, value) => {
        setEducationList(prev => {
            const updated = [...prev];
            updated[i] = { ...updated[i], [field]: value };
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

    const addCertification = useCallback(() => setCertifications(prev => [...(prev || []), ""]), []);
    const removeCertification = useCallback((i) => setCertifications(prev => (prev || []).filter((_, idx) => idx !== i)), []);

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
            console.log("DEBUG: Rendering Template:", selectedTemplate);
            console.log("DEBUG: Resume Details StyleConfig:", resumeDetails.styleConfig);
            switch (selectedTemplate) {
                case "custom":
                    doc = React.createElement(CoustomTemplate, {
                        ...downloadData,
                        styleConfig: resumeDetails.styleConfig || {}
                    });
                    break;
                default:
                    doc = React.createElement(CoustomTemplate, {
                        ...downloadData,
                        styleConfig: resumeDetails.styleConfig || {}
                    });
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



    const uiEditor = () => {
        const payload = buildResumePayload();
        dispatch(setCurrentResume(payload));

        // Pass resumeId if available to enable UPDATE mode in b3.jsx
        // AND pass selectedTemplate to ensure visual consistency
        const targetId = resumeId || currentResumeId || localResumeId;

        // 🛡️ Ensure we pass a valid template identifier that b3.jsx understands
        let targetTemplateId = selectedTemplate || "1";

        // 🆕 Sync current styles and template to Redux so b3 can use it immediately
        dispatch(setCurrentTemplate(targetTemplateId));

        const currentStyleSnapshot = {
            ...styleConfig,
            positions: sectionPositions,
            lines: lines,
            shapes: backgroundShapes
        };
        dispatch(setSavedStyleConfig(currentStyleSnapshot));

        if (targetId) {
            navigate(`/ui-editor/webgl/${targetId}/${targetTemplateId}`);
        } else {
            // Even for new resumes, passing a template ID is helpful if we selected one
            navigate(`/ui-editor/webgl/new/${targetTemplateId}`);
        }
    };





    const buildResumePayload = () => {
        return {
            resumeDetails,
            skills,
            experiences,
            projects,
            educationList,
            certifications,
            sectionTitles,
            showSummary,
            showSkills,
            showExperience,
            showProjects,
            showEducation,
            showCertifications,
            customSections
        };
    };







    const handleSaveAll = async () => {

        if (userId == null) {
            window.showMessage('Please Login First.', 'warning');
            return;
        }
        setSaving(true);
        setSaveError("");
        setSuccessMessage("");
        setLoading(true);

        const MAX_RETRIES = 3;
        let attempt = 0;
        const timeout = 30000;

        while (attempt < MAX_RETRIES) {
            let controller;
            try {
                const transformedSkills = skills.map(skill => ({ name: skill.trim() })).filter(skill => skill.name !== "");
                const transformedCertifications = certifications.map(cert => ({ name: cert.trim() })).filter(cert => cert.name !== "");

                // Transform custom sections to match backend DTO structure
                // Backend expects: { title: "...", sectionData: {...} }
                // Frontend has: { id: ..., title: "...", items: [...] }
                // Note: id is only for client-side React key management, not saved to backend
                const transformedCustomSections = customSections.map(section => ({
                    title: section.title,
                    sectionData: {
                        items: section.items
                    }
                }));

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
                    userId: id,
                    details: {
                        name: resumeDetails.name,
                        title: resumeDetails.title,
                        summary: resumeDetails.summary,

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
                    customSections: transformedCustomSections
                };




                console.log("=========================================================================");

                console.log("Custom Sections (Original):", customSections);
                console.log("Custom Sections (Transformed):", transformedCustomSections);






                const endpoint = currentResumeId
                    ? `/update/${resumeId}`
                    : `/saveall`;

                console.log(`The endpoint was ${endpoint}`);


                const method = resumeId ? "PUT" : "POST";

                console.log(`Making ${method} request to:`, endpoint);

                controller = new AbortController();
                const tid = setTimeout(() => controller.abort(), timeout);

                const res = await api({
                    method: method,
                    url: endpoint,
                    data: payload,
                    signal: controller.signal
                });

                clearTimeout(tid);

                console.log(res);



                const message = localResumeId ? "Resume updated successfully!" : "Resume saved successfully!";
                setSuccessMessage(message);

                // Axios returns parsed data in res.data
                const data = res.data; // { message, resumeId }
                console.log("Response data:", data);

                // If this is the first save, store the resumeId in Redux or state
                if (data.resumeId) {
                    dispatch(setCurrentResumeId(data.resumeId));
                    setLocalResumeId(data.resumeId);
                }

                if (window.showMessage) window.showMessage('Success', message, 'success', 1500);
                break; // Success!

            } catch (err) {
                console.error(`Save attempt ${attempt + 1} failed:`, err);
                const isRetryable = err.code === 'ECONNABORTED' || err.message.includes('Network Error');

                if (isRetryable && attempt < MAX_RETRIES - 1) {
                    attempt++;
                    const delay = Math.pow(2, attempt - 1) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }

                const finalMsg = err.code === 'ECONNABORTED' ? "Server is not up" : (err.response?.data?.message || err.message);
                setSaveError(finalMsg);
                if (window.showMessage) window.showMessage('Error', finalMsg, 'error', 3000);
                break;
            }
        }
        setSaving(false);
        setLoading(false);
    };




    // ==================== MULTI-PAGE LOGIC ====================

    // Separate elements by page (from b3.jsx line 703)
    const getElementsForPage = (pageNum) => {
        const pageStart = (pageNum - 1) * 842;
        const pageEnd = pageNum * 842;

        return {
            sections: Object.entries(sectionPositions || {}).filter(([name, pos]) => {
                if (!pos) return false;

                // 🛡️ Filter Logic: Check Visibility & Data Emptiness (Sync with Hidden Render)
                if (name === 'summary' && !showSummary) return false;
                if (name === 'skills' && !showSkills) return false;
                if (name === 'experience' && !showExperience) return false;
                if (name === 'projects' && !showProjects) return false;
                if (name === 'education' && !showEducation) return false;
                if (name === 'certifications' && !showCertifications) return false;

                let isEmpty = false;
                if (name === 'summary') isEmpty = !resumeDetails.summary || resumeDetails.summary.trim() === '';
                else if (name === 'skills') isEmpty = !skills || (!Array.isArray(skills) || skills.length === 0);
                else if (name === 'experience') isEmpty = !experiences || (!Array.isArray(experiences) || experiences.length === 0);
                else if (name === 'projects') isEmpty = !projects || (!Array.isArray(projects) || projects.length === 0);
                else if (name === 'education') isEmpty = !educationList || (!Array.isArray(educationList) || educationList.length === 0);
                else if (name === 'certifications') isEmpty = !certifications || (!Array.isArray(certifications) || certifications.length === 0);

                if (isEmpty) return false;

                const height = sectionHeights[name] || (sectionSnapshots[name]?.height) || 200;
                // Intersection check: top is in page OR bottom is in page
                return (pos.y < pageEnd && pos.y + height > pageStart);
            }),
            lines: (lines || []).filter(line => {
                const yMin = Math.min(line.y1, line.y2);
                const yMax = Math.max(line.y1, line.y2);
                return (yMax > pageStart && yMin < pageEnd);
            }),
            shapes: (backgroundShapes || []).filter(shape => {
                return (shape.y < pageEnd && shape.y + (shape.height || 100) > pageStart);
            })
        };
    };
    const autoFlowSections = () => {
        const spacing = 15; // Standard vertical spacing
        const headerPos = sectionPositions['header'] || { x: 40, y: 50 };
        const headerX = headerPos.x;

        // Start stack at header's Y
        let currentY = headerPos.y;

        // Sort sections by current Y to maintain user-intended order
        const sortedSections = Object.keys(sectionPositions).sort((a, b) => {
            return (sectionPositions[a]?.y || 0) - (sectionPositions[b]?.y || 0);
        });

        const newPositions = {};

        sortedSections.forEach(name => {
            // Find current position to keep if it's the header (header is the anchor)
            if (name === 'header') {
                newPositions[name] = headerPos;
                const height = sectionSnapshots[name]?.height || 150;
                currentY += height + spacing;
                return;
            }

            const snapshot = sectionSnapshots[name];
            const height = snapshot ? snapshot.height : 100;

            // 🎯 Auto-Align on X with header
            // 🎯 Auto-Manage Y based on previous heights
            newPositions[name] = {
                x: headerX,
                y: currentY
            };

            currentY += height + spacing;
        });

        // Check if total height requires Page 2
        if (currentY > 750 && !showPage2) {
            setShowPage2(true);
        }

        setSectionPositions(newPositions);
        console.log("🚀 Auto-flow complete: aligned items to X:", headerX);
    };

    // Calculate page elements - Optimized with Memo (from b3.jsx line 1290)
    const page1Elements = useMemo(() => getElementsForPage(1), [sectionPositions, lines, backgroundShapes, sectionHeights, sectionSnapshots, resumeDetails, skills, experiences, projects, educationList, certifications, showSummary, showSkills, showExperience, showProjects, showEducation, showCertifications]);
    const page2Elements = useMemo(() => showPage2 ? getElementsForPage(2) : { sections: [], lines: [], shapes: [] }, [showPage2, sectionPositions, lines, backgroundShapes, sectionHeights, sectionSnapshots, resumeDetails, skills, experiences, projects, educationList, certifications, showSummary, showSkills, showExperience, showProjects, showEducation, showCertifications]);

    // Custom Smooth Scroll Helper
    const smoothScrollTo = (container, targetElement, duration = 800) => {
        if (!targetElement || !container) return;

        // Calculate position relative to the scrollable container
        // currentScrollTop is the number of pixels the container is currently scrolled vertically
        const startPosition = container.scrollTop;

        // target.offsetTop is distance from top of offsetParent. 
        // We want to center it or put it at top with some padding.
        // But offsetTop is relative to the nearest positioned ancestor.
        // A safer way for nested scrollable containers:
        const containerRect = container.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();

        // Relative position of target inside the viewport-visible part of container
        const relativeTop = targetRect.top - containerRect.top;

        // Desired final scroll position: current scroll + relative difference - padding
        // We want the element to be about 100px from the top of the container
        const offset = 100;
        const targetScrollTop = startPosition + relativeTop - offset;

        const distance = targetScrollTop - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;

            // Easing function (easeInOutCubic)
            const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

            const run = ease(Math.min(timeElapsed / duration, 1));

            container.scrollTop = startPosition + distance * run;

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    };

    // Handle selection from WebGL canvas
    const handleWebGLSelect = useCallback((type, id) => {
        if (type !== 'section') return;

        // If syncing is disabled, do not react to WebGL clicks
        if (!autoScrollEnabled) return;

        console.log(`[WebGL] Selected section: ${id}`);

        // 1. Expand the section in UI
        switch (id) {
            case 'summary': setShowSummary(true); break;
            case 'skills': setShowSkills(true); break;
            case 'experience': setShowExperience(true); break;
            case 'projects': setShowProjects(true); break;
            case 'education': setShowEducation(true); break;
            case 'certifications': setShowCertifications(true); break;
            // header is always visible
        }

        // 2. Set active section for expansion
        setActiveSection(id);

        // 3. Scroll to the section (with slight delay to allow React render)
        setTimeout(() => {
            // ... (rest of the logic)
            let sectionId = `editor-section-${id}`;
            if (id.startsWith('custom-')) {
                sectionId = `editor-section-${id}`;
            }

            const element = document.getElementById(sectionId);
            const container = resumeRef.current; // The scrollable .ats-resume

            if (element && container) {
                // Restore smooth scroll to the section
                smoothScrollTo(container, element, 800);

                // Focus the first input or textarea
                const input = element.querySelector('input, textarea');
                if (input) {
                    input.focus({ preventScroll: true });
                }

                // Visual highlight effect
                element.style.transition = 'box-shadow 0.5s ease';
                element.style.boxShadow = '0 0 0 2px #3b82f6, 0 8px 20px -2px rgba(59, 130, 246, 0.2)';

                // Add a temporary highlight class for animation
                element.classList.add('section-highlight-pulse');

                setTimeout(() => {
                    element.style.boxShadow = '';
                    element.classList.remove('section-highlight-pulse');
                }, 1500);
            } else {
                console.warn(`[WebGL] DOM element not found: ${sectionId} or container missing`);
            }
        }, 100);
    }, [autoScrollEnabled, setShowSummary, setShowSkills, setShowExperience, setShowProjects, setShowEducation, setShowCertifications]);



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
                    <LoadingAnimation message={message} show={loading} />

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
                        <div className="title-edit-control" style={{ marginBottom: '10px', padding: '8px', background: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                id="toggle-title-edit"
                                checked={isTitleEditable}
                                onChange={(e) => setIsTitleEditable(e.target.checked)}
                                style={{ width: '16px', height: '16px', accentColor: '#e11d48' }}
                            />
                            <label htmlFor="toggle-title-edit" style={{ fontSize: '14px', fontWeight: '500', color: '#374151', cursor: 'pointer', userSelect: 'none' }}>
                                {isTitleEditable ? "🔓 Edit Section Titles" : "🔒 Lock Section Titles"}
                            </label>
                        </div>
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

                                <header className="header" id="editor-section-header">
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
                                    <section
                                        className={`section ${activeSection === 'summary' ? 'active' : ''}`}
                                        id="editor-section-summary"
                                        onClick={() => setActiveSection('summary')}
                                    >
                                        <div className="section-title">
                                            <input className={`sec-inputs ${!isTitleEditable ? 'readonly-input' : ''}`} type="text" readOnly={!isTitleEditable} value={sectionTitles.summary} onChange={(e) => {
                                                setSectionTitles({ ...sectionTitles, summary: e.target.value })
                                            }} />
                                        </div>
                                        <textarea className="summary" value={resumeDetails.summary} onChange={(e) => handleResumeDetailChange("summary", e.target.value)} />
                                    </section>
                                )}

                                {showSkills && (
                                    <section
                                        className={`section ${activeSection === 'skills' ? 'active' : ''}`}
                                        id="editor-section-skills"
                                        onClick={() => setActiveSection('skills')}
                                    >
                                        <div className="section-title">
                                            <input type="text" className={`sec-inputs ${!isTitleEditable ? 'readonly-input' : ''}`} readOnly={!isTitleEditable} value={sectionTitles.skills} onChange={(e) => {
                                                setSectionTitles({ ...sectionTitles, skills: e.target.value })
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
                                    <section
                                        className={`section ${activeSection === 'experience' ? 'active' : ''}`}
                                        id="editor-section-experience"
                                        onClick={() => setActiveSection('experience')}
                                    >
                                        <div className="section-title">
                                            <input type="text" value={sectionTitles.experience} className={`sec-inputs ${!isTitleEditable ? 'readonly-input' : ''} `} readOnly={!isTitleEditable}
                                                onChange={(e) => {
                                                    setSectionTitles({ ...sectionTitles, experience: e.target.value })
                                                }} />
                                        </div>
                                        {Array.isArray(experiences) && experiences.map((exp, i) => (
                                            <div className="experience" key={`exp-${i}`}>
                                                <div className="exp-header">
                                                    <input className={`position `} value={exp?.position || ""} onChange={(e) => handleExperienceChange(i, "position", e.target.value)} placeholder="Position" />
                                                    <input className={`company `} value={exp?.company || ""} onChange={(e) => handleExperienceChange(i, "company", e.target.value)} placeholder="Company" />
                                                    <input className={`duration `} value={exp?.duration || ""} onChange={(e) => handleExperienceChange(i, "duration", e.target.value)} placeholder="Duration" />
                                                    <button type="button" className="remove-small-btn" onClick={(e) => { e.preventDefault(); removeExperience(i); }}>Remove</button>
                                                </div>
                                                <input className={`location `} value={exp?.location || ""} onChange={(e) => handleExperienceChange(i, "location", e.target.value)} placeholder="Location" />
                                                {Array.isArray(exp?.achievements) && exp.achievements.map((ach, j) => (
                                                    <div className="achievement" key={`ach-${i}-${j}`}>
                                                        <span className="bullet">•</span>
                                                        <input className={`achievement-text `} value={ach || ""} onChange={(e) => handleExperienceChange(i, "achievements", e.target.value, j)} placeholder="Achievement description" />
                                                        <button type="button" className="remove-small-btn" onClick={(e) => { e.preventDefault(); removeAchievement(i, j); }}>×</button>
                                                    </div>
                                                ))}
                                                <button type="button" className={`add-small-btn `} onClick={(e) => { e.preventDefault(); addAchievement(i); }}>Add Achievement</button>
                                            </div>
                                        ))}
                                        <button type="button" className={`add-btn `} onClick={addExperience}>Add Experience</button>
                                    </section>
                                )}

                                {showProjects && (
                                    <section
                                        className={`section ${activeSection === 'projects' ? 'active' : ''}`}
                                        id="editor-section-projects"
                                        onClick={() => setActiveSection('projects')}
                                    >
                                        <div className="section-title">
                                            <input className={`sec-inputs ${!isTitleEditable ? 'readonly-input' : ''} `} type="text" readOnly={!isTitleEditable} value={sectionTitles.projects} onChange={(e) => {
                                                setSectionTitles({ ...sectionTitles, projects: e.target.value })
                                            }
                                            } />
                                        </div>
                                        {Array.isArray(projects) && projects.map((proj, i) => (
                                            <div className="project" key={`proj-${i}`}>
                                                <div className="project-header">
                                                    <input className={`project-name `} value={proj?.name || ""} onChange={(e) => handleProjectChange(i, "name", e.target.value)} placeholder="Project Name" />
                                                    <input className={`project-duration `} value={proj?.duration || ""} onChange={(e) => handleProjectChange(i, "duration", e.target.value)} placeholder="Duration" />
                                                    <button type="button" className="remove-small-btn" onClick={(e) => { e.preventDefault(); removeProject(i); }}>Remove</button>
                                                </div>
                                                <input className={`technologies `} value={proj?.technologies || ""} onChange={(e) => handleProjectChange(i, "technologies", e.target.value)} placeholder="Technologies used" />
                                                <input className={`project-link `} value={proj?.link || ""} onChange={(e) => handleProjectChange(i, "link", e.target.value)} placeholder="Project Link (optional)" />
                                                {Array.isArray(proj?.description) && proj.description.map((desc, j) => (
                                                    <div className="description" key={`desc-${i}-${j}`}>
                                                        <span className="bullet">•</span>
                                                        <input className={`description-text `} value={desc || ""} onChange={(e) => handleProjectChange(i, "description", e.target.value, j)} placeholder="Project description point" />
                                                        <button type="button" className="remove-small-btn" onClick={(e) => { e.preventDefault(); removeProjectPoint(i, j); }}>×</button>
                                                    </div>
                                                ))}
                                                <button type="button" className={`add-small-btn `} onClick={(e) => { e.preventDefault(); addProjectPoint(i); }}>Add Description Point</button>
                                            </div>
                                        ))}
                                        <button type="button" className={`add-btn `} onClick={addProject}>Add Project</button>
                                    </section>
                                )}

                                {showEducation && (
                                    <section
                                        className={`section ${activeSection === 'education' ? 'active' : ''}`}
                                        id="editor-section-education"
                                        onClick={() => setActiveSection('education')}
                                    >
                                        <div className="section-title">
                                            <input type="text" className={`sec-inputs ${!isTitleEditable ? 'readonly-input' : ''} `} readOnly={!isTitleEditable} value={sectionTitles.education} onChange={(e) => {
                                                setSectionTitles({ ...sectionTitles, education: e.target.value })
                                            }} />
                                        </div>
                                        {Array.isArray(educationList) && educationList.map((edu, i) => (
                                            <div className="education" key={`edu-${i}`}>
                                                <div className="edu-header">
                                                    <div className="edu-fields-wrapper">
                                                        <div className="edu-fields-row">
                                                            <input className={`degree `} value={edu?.degree || ""} onChange={(e) => handleEducationChange(i, "degree", e.target.value)} placeholder="Degree" />
                                                            <input className={`year `} value={edu?.year || ""} onChange={(e) => handleEducationChange(i, "year", e.target.value)} placeholder="Year" />
                                                        </div>
                                                        <input className={`institution `} value={edu?.institution || ""} onChange={(e) => handleEducationChange(i, "institution", e.target.value)} placeholder="Institution" />
                                                        <input className={`edu-location `} value={edu?.location || ""} onChange={(e) => handleEducationChange(i, "location", e.target.value)} placeholder="Location" />
                                                        <input className={`gpa `} value={edu?.gpa || ""} onChange={(e) => handleEducationChange(i, "gpa", e.target.value)} placeholder="GPA/Score (optional)" />
                                                    </div>
                                                    <button type="button" className="remove-btn" onClick={(e) => { e.preventDefault(); removeEducation(i); }}>Remove</button>
                                                </div>
                                            </div>
                                        ))}
                                        <button type="button" className={`add-btn `} onClick={addEducation}>Add Education</button>
                                    </section>
                                )}

                                {showCertifications && (
                                    <section
                                        className={`section ${activeSection === 'certifications' ? 'active' : ''}`}
                                        id="editor-section-certifications"
                                        onClick={() => setActiveSection('certifications')}
                                    >
                                        <div className="section-title">
                                            <input type="text" className={`sec-inputs ${!isTitleEditable ? 'readonly-input' : ''} `} readOnly={!isTitleEditable} value={sectionTitles.certifications} onChange={(e) => {
                                                setSectionTitles({ ...sectionTitles, certifications: e.target.value })
                                            }} />
                                        </div>
                                        {Array.isArray(certifications) && certifications.map((cert, i) => (
                                            <div className="certification" key={`cert-${i}`}>
                                                <input className={`cert-text `} value={cert || ""} onChange={(e) => handleCertificationChange(i, e.target.value)} placeholder="Certification Name" />
                                                <button type="button" className="remove-small-btn" onClick={(e) => { e.preventDefault(); removeCertification(i); }}>Remove</button>
                                            </div>
                                        ))}
                                        <button type="button" className={`add-btn `} onClick={addCertification}>Add Certification</button>
                                    </section>
                                )}

                                {customSections.map((section) => (
                                    <div
                                        key={section.id}
                                        className={`custom-section-container section ${activeSection === `custom-${section.id}` ? 'active' : ''}`}
                                        id={`editor-section-custom-${section.id}`}
                                        ref={el => sectionRefs.current[`custom-${section.id}`] = el}
                                        onClick={() => setActiveSection(`custom-${section.id}`)}
                                    >
                                        <div className="custom-section-header">
                                            <input type="text" className={`custom-section-title-input `} value={section.title} onChange={(e) => updateCustomSectionTitle(section.id, e.target.value)} placeholder="Section Title" />
                                            <button type="button" className="remove-small-btn" onClick={() => removeCustomSection(section.id)}>Remove Section</button>
                                        </div>
                                        {section.items?.map((item, idx) => (
                                            <div key={idx} className="skill" style={{ marginBottom: '0.5rem' }}>
                                                <span className="bullet">•</span>
                                                <input className={`skill-text `} value={item} onChange={(e) => updateCustomSectionItem(section.id, idx, e.target.value)} placeholder="Item content" />
                                                <button type="button" className="remove-small-btn" onClick={() => removeCustomSectionItem(section.id, idx)}>×</button>
                                            </div>
                                        ))}
                                        <button type="button" className={`add-small-btn `} onClick={() => addCustomSectionItem(section.id)}>Add Item</button>
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
                                <div className="preview-header-title-container">
                                    <h3>Live Preview</h3>
                                    <h3><button onClick={uiEditor} >Advanced Editor</button></h3>
                                </div>

                                <div className="template-selector-controls">
                                    <div className="dataset-selector" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginRight: '10px' }}>
                                        <select
                                            onChange={(e) => handleDatasetChange(e.target.value)}
                                            className="template-select"
                                            style={{ padding: '2px 6px', borderRadius: '4px', background: '#222', color: '#fff', border: '1px solid #444', fontSize: '11px' }}
                                        >
                                            <option value="" disabled selected>Data Samples</option>
                                            {Object.keys(defaultDatasets).map(key => (
                                                <option key={key} value={key}>{defaultDatasets[key].name}</option>
                                            ))}
                                        </select>
                                        <button onClick={handleSaveCurrentAsDefault} style={{ background: 'transparent', border: 'none', color: '#34d399', fontSize: '11px', cursor: 'pointer' }} title="Set as Default">📌</button>
                                        {localStorage.getItem('user_custom_default_resume') && (
                                            <button onClick={handleResetToFactoryDefault} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }} title="Reset">↺</button>
                                        )}
                                    </div>

                                    <label className="template-label">Choose Template:</label>
                                    <select value={selectedTemplate} onChange={(e) => handleTemplateChange(e.target.value)} className="template-select">
                                        {Object.keys(TEMPLATES).map(key => (
                                            <option key={key} value={key}>
                                                {TEMPLATES[key].name || key.charAt(0).toUpperCase() + key.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    {(isTemplateLoading || generatingPreview) && (
                                        <span className="template-loading">
                                            {isTemplateLoading ? "Loading template..." : "Generating preview..."}
                                        </span>
                                    )}

                                    <button
                                        onClick={() => setAutoScrollEnabled(!autoScrollEnabled)}
                                        style={{
                                            padding: '8px 12px',
                                            backgroundColor: autoScrollEnabled ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                            color: autoScrollEnabled ? '#60a5fa' : '#9ca3af',
                                            border: `1px solid ${autoScrollEnabled ? '#3b82f6' : '#4b5563'}`,
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            transition: 'all 0.2s ease'
                                        }}
                                        title={autoScrollEnabled ? "Click to disable auto-scroll" : "Click to enable auto-scroll"}
                                    >
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: autoScrollEnabled ? '#60a5fa' : '#4b5563',
                                            boxShadow: autoScrollEnabled ? '0 0 8px #3b82f6' : 'none'
                                        }} />
                                        {autoScrollEnabled ? "Auto-Scroll ON" : "Auto-Scroll OFF"}
                                    </button>
                                </div>
                            </div>


                            <div className="preview-content">
                                <div className="canvas-scroll-wrapper" style={{ overflow: 'auto', maxHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                    {/* Page 1 */}
                                    <div className="canvas-wrapper" style={{ position: 'relative', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                        <ErrorBoundary>
                                            <WebGLStage
                                                key={`page1-${webglResetKey}`}
                                                width={canvasTargetWidth}
                                                height={canvasTargetHeight}
                                                stageScale={canvasScale}
                                                shapes={page1Elements.shapes}
                                                lines={page1Elements.lines}
                                                sections={page1Elements.sections}
                                                snapshot={sectionSnapshots}
                                                onDragEnd={(type, id, pos) => {
                                                    if (type === 'section') {
                                                        setSectionPositions(prev => ({ ...prev, [id]: pos }));
                                                    }
                                                    // Add other handlers if needed for shapes/lines
                                                }}
                                                onSelect={handleWebGLSelect}
                                                isAnimating={false}
                                            />
                                        </ErrorBoundary>
                                        <div style={{ position: 'absolute', bottom: '-25px', width: '100%', textAlign: 'center', color: '#6b7280', fontSize: '12px', fontWeight: '500' }}>Page 1</div>
                                    </div>

                                    {/* Page 2 */}
                                    <div
                                        className="canvas-wrapper"
                                        style={{
                                            position: 'relative',
                                            display: showPage2 ? 'block' : 'none',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        <ErrorBoundary>
                                            <WebGLStage
                                                key={`page2-${webglResetKey}`}
                                                width={canvasTargetWidth}
                                                height={canvasTargetHeight}
                                                stageScale={canvasScale}
                                                shapes={page2Elements.shapes}
                                                lines={page2Elements.lines}
                                                sections={page2Elements.sections}
                                                snapshot={sectionSnapshots}
                                                yOffset={842}
                                                onDragEnd={(type, id, pos) => {
                                                    // Adjust for Page 2 offset
                                                    const adjustedPos = { ...pos, y: pos.y + 842 };
                                                    if (type === 'section') {
                                                        setSectionPositions(prev => ({ ...prev, [id]: adjustedPos }));
                                                    }
                                                }}
                                                onSelect={handleWebGLSelect}
                                                isAnimating={false}
                                            />
                                        </ErrorBoundary>
                                        <div style={{ position: 'absolute', bottom: '-25px', width: '100%', textAlign: 'center', color: '#6b7280', fontSize: '12px', fontWeight: '500' }}>Page 2</div>
                                    </div>
                                </div>

                                <div className="zoom-controls" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                    {/* Add Zoom controls here if needed, already in B3 logic */}
                                    <button
                                        onClick={() => setShowPage2(!showPage2)}
                                        className={`btn-zoom-reset ${showPage2 ? 'active' : ''}`}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '4px',
                                            border: '1px solid #d1d5db',
                                            background: showPage2 ? '#3b82f6' : 'white',
                                            color: showPage2 ? 'white' : '#374151',
                                            fontSize: '12px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {showPage2 ? 'Show 1 Page' : 'Show 2 Pages'}
                                    </button>

                                    <button
                                        onClick={() => setIsAutoFlowEnabled(!isAutoFlowEnabled)}
                                        className="btn-primary"
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            background: isAutoFlowEnabled ? '#10b981' : '#6b7280',
                                            color: 'white',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        title={isAutoFlowEnabled ? "Auto-flow is ON - sections align automatically" : "Auto-flow is OFF - manual positioning"}
                                    >
                                        {isAutoFlowEnabled ? '✓ Auto-Flow ON' : 'Auto-Flow OFF'}
                                    </button>

                                    <button
                                        onClick={() => setWebglResetKey(prev => prev + 1)}
                                        className="btn-primary"
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            background: '#fee2e2',
                                            color: '#991b1b',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}
                                        title="Restart WebGL engine if preview freezes"
                                    >
                                        🔄 Restart WebGL
                                    </button>
                                </div>
                            </div>


                        </div>




                    </div>






                </div>








                <div className="resume-editor-main">


                </div>

                {/* Hidden rendering area for WebGL Capture */}
                <div className="hidden-render" style={{
                    position: 'absolute',
                    right: '220px',
                    top: '0',
                    visibility: 'hidden',
                    width: '595px',
                    height: '842px',
                    background: 'white',
                    padding: '0',
                    zIndex: 10000000,
                    pointerEvents: 'none',
                    transform: 'scale(1)',
                    transformOrigin: 'top right',
                    overflow: 'hidden',
                    maxWidth: 'none'
                }}>
                    {(() => {
                        const TemplateComponents = {
                            header: FlexibleHeaderSection,
                            summary: FlexibleSummarySection,
                            skills: FlexibleSkillsSection,
                            experience: FlexibleExperienceSection,
                            projects: FlexibleProjectsSection,
                            education: FlexibleEducationSection,
                            certifications: FlexibleCertificationsSection,
                            contact: FlexibleContactSection,
                            custom: FlexibleCustomSection
                        };

                        const propsMap = {
                            header: { resumeDetails, styleConfig },
                            summary: { summary: resumeDetails.summary, styleConfig, sectionTitle: sectionTitles.summary },
                            skills: { skills, styleConfig, sectionTitle: sectionTitles.skills },
                            experience: { experiences, styleConfig, sectionTitle: sectionTitles.experience },
                            projects: { projects, styleConfig, sectionTitle: sectionTitles.projects },
                            education: { educationList, styleConfig, sectionTitle: sectionTitles.education },
                            certifications: { certifications, styleConfig, sectionTitle: sectionTitles.certifications },
                            contact: { resumeDetails, styleConfig },
                            custom: { customSections, styleConfig }
                        };

                        const standardComponents = Object.entries(TemplateComponents)
                            .filter(([key]) => key !== 'custom')
                            .map(([key, Component]) => {

                                // 🛡️ Hide empty sections to prevent title rendering
                                let isEmpty = false;
                                if (key === 'summary') isEmpty = !resumeDetails.summary || resumeDetails.summary.trim() === '';
                                else if (key === 'skills') isEmpty = !skills || skills.length === 0;
                                else if (key === 'experience') isEmpty = !experiences || experiences.length === 0;
                                else if (key === 'projects') isEmpty = !projects || projects.length === 0;
                                else if (key === 'education') isEmpty = !educationList || educationList.length === 0;
                                else if (key === 'certifications') isEmpty = !certifications || certifications.length === 0;

                                if (isEmpty) return null;

                                if (!sectionRefs.current[key]) sectionRefs.current[key] = React.createRef();
                                return (
                                    <div
                                        key={key}
                                        ref={sectionRefs.current[key]}
                                        style={{
                                            width: styleConfig[key]?.container?.width || '100%',
                                            height: styleConfig[key]?.container?.height || 'auto',
                                            minHeight: styleConfig[key]?.container?.height || 'auto',
                                            maxHeight: styleConfig[key]?.container?.height || 'none',
                                            overflow: 'visible',
                                            boxSizing: 'border-box',
                                            position: 'relative',
                                            minWidth: 0,
                                            maxWidth: 'none'
                                        }}>
                                        <Component {...propsMap[key]} />
                                    </div>
                                );
                            });

                        const customComponents = customSections.map(section => {
                            const key = `custom-${section.id}`;
                            // Ensure ref exists
                            if (!sectionRefs.current[key]) sectionRefs.current[key] = React.createRef();

                            // reuse FlexibleCustomSection but pass single section
                            return (
                                <div
                                    key={key}
                                    ref={sectionRefs.current[key]} // Use the dynamic ref
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        overflow: 'visible',
                                        boxSizing: 'border-box',
                                        position: 'relative',
                                        minWidth: 0,
                                        maxWidth: 'none'
                                    }}>
                                    <FlexibleCustomSection
                                        customSections={[section]}
                                        styleConfig={styleConfig}
                                    />
                                </div>
                            );
                        });

                        return [...standardComponents, ...customComponents];
                    })()}
                </div>



            </div>
        </>
    );
}