
import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentResume, setCurrentResumeId, setSavedStyleConfig, setCurrentTemplate } from "../../redux/store.js";
import { mergeResumeData } from "./Utils";
import {
  ATS_TEMPLATE_CONFIG,
  ATS_COMPACT_CONFIG,
  BALANCED_HYBRID_CONFIG,
  MODERN_TEMPLATE_CONFIG,
  TWO_COLUMN_TEMPLATE_CONFIG,
  TEMPLATE5_CONFIG,
  NEW_ATS_CONFIG,
  HEADER_LAYOUTS,
  CONTACT_LAYOUTS,
  SKILLS_LAYOUTS
} from "./TemplateConfigs";
import { defaultResumeData } from "./Utils";
import "./b3.css";
import {
  FlexibleCertificationsSection, FlexibleContactSection,
  FlexibleEducationSection, FlexibleExperienceSection,
  FlexibleHeaderSection, FlexibleProjectsSection,
  FlexibleSkillsSection, FlexibleSummarySection,
  FlexibleCustomSection
} from "./BaseTemplates.jsx";
import { GeometrySnapshot, WebGLStage } from "../../components/engine/WebEngine.jsx";
import { PhysicsPushingManager } from "./physicsPushing.js"; // 🚀 Added
import { createPhysicsAnimation } from "./physicsAnimation.js"; // 🚀 Added
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import * as PIXI from 'pixi.js';
import api from "../../api/axios";

// ==================== TEMPLATE MAPPINGS ====================
// ==================== TEMPLATE MAPPINGS ====================
const TEMPLATES = {
  custom: { name: 'Custom (Saved)', ...ATS_TEMPLATE_CONFIG }, // 🆕 Custom Option
  balancedHybrid: BALANCED_HYBRID_CONFIG,
  modern: MODERN_TEMPLATE_CONFIG,
  twoColumn: TWO_COLUMN_TEMPLATE_CONFIG,
  template5: TEMPLATE5_CONFIG,
  newAts: NEW_ATS_CONFIG,
  atsCompact: ATS_COMPACT_CONFIG
};

// 🔄 Map numeric templateIds from backend to template config keys
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

// 🛡️ Normalize template identifier (handle both numeric IDs and string keys)
// 🛡️ Normalize template identifier (handle both numeric IDs and string keys)
const normalizeTemplateKey = (templateIdentifier) => {
  if (templateIdentifier === 'custom') return 'custom'; // 🆕 Pass-through

  // If it's already a valid string key, return it
  if (typeof templateIdentifier === 'string' && TEMPLATES[templateIdentifier]) {
    return templateIdentifier;
  }

  // 🆕 Extended ID Mapping (from ResumeEditorv3 friendly names)
  const EXTENDED_MAP = {
    "ats-optimized": "ats",
    "ats-compact": "atsCompact",
    "balanced-hybrid": "balancedHybrid",
    "modern-ats-two-column": "modern",
    "two-column-professional": "twoColumn",
    "ats-edgy": "newAts",
    "tech-innovator": "template5"
  };
  if (EXTENDED_MAP[templateIdentifier]) {
    return EXTENDED_MAP[templateIdentifier];
  }

  // If it's a numeric ID, map it to a string key
  const numericId = typeof templateIdentifier === 'string' ? parseInt(templateIdentifier, 10) : templateIdentifier;
  if (!isNaN(numericId) && TEMPLATE_ID_MAP[numericId]) {
    return TEMPLATE_ID_MAP[numericId];
  }

  // Fallback to 'ats' if no match found
  console.warn(`⚠️ Unknown template identifier: ${templateIdentifier}, falling back to 'ats'`);
  return 'ats';
};


// ... (skipping unchanged code) ...


// 🔄 Load template from URL param (HIGHEST PRIORITY) or Redux






// ==================== WEBGL ENGINE COMPONENT ====================

const normalizeColorForInput = (color) => {
  if (!color || color === 'transparent') return '#ffffff';
  if (color.startsWith('#')) {
    if (color.length === 9) return color.slice(0, 7);
    return color;
  }
  return color;
};

// Internal WebGLStage removed - now using standalone version from components/engine/WebEngine.jsx




// ==================== MAIN UI EDITOR COMPONENT ====================

const UIEditor = () => {
  // Refs
  const sectionRefs = useRef({});
  const webGLStageRef1 = useRef(null);
  const webGLStageRef2 = useRef(null);


  // State
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumeId: paramResumeId, templateId } = useParams();

  // Handle 'new' keyword for resume creation flow
  const resumeId = paramResumeId === 'new' ? null : paramResumeId;

  const userId = useSelector((s) => s.auth.userId);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showPage2, setShowPage2] = useState(false);
  const [isAutoFlowEnabled, setIsAutoFlowEnabled] = useState(false); // 🎯 Default to false as requested by user
  const [zoom, setZoom] = useState(1);
  const [isMagneticEnabled, setIsMagneticEnabled] = useState(false); // 🚀 NEW: Magnetic Flow (Default OFF)
  const [isDividerSyncEnabled, setIsDividerSyncEnabled] = useState(false); // 🚀 NEW: Divider Auto-Sync (Default OFF per user request)

  const extractWidthsAndHeightsFromConfig = (config) => {
    const widths = {};
    const heights = {};
    Object.keys(config).forEach(key => {
      if (config[key]?.container?.width) {
        widths[key] = config[key].container.width;
      }
      if (config[key]?.container?.height) {
        heights[key] = config[key].container.height;
      }
    });
    return { widths, heights };
  };

  const globalCurrentTemplate = useSelector((state) => state.resume.currentTemplateName); // 🔄 Read template from Redux
  const savedStyleConfig = useSelector((state) => state.resume.savedStyleConfig); // 🆕 Read saved style config from Redux

  // 🎯 Resolve initial template key
  const initialTemplateKey = useMemo(() => normalizeTemplateKey(globalCurrentTemplate || 'ats'), [globalCurrentTemplate]);
  const initialConfig = useMemo(() => {
    // 💎 Load saved/active style configuration from Redux as top priority
    if (savedStyleConfig) {
      console.log("💎 Applying saved style configuration from Redux on mount");
      return savedStyleConfig;
    }
    // Fallback to template default if no saved config exists
    return TEMPLATES[initialTemplateKey] || ATS_TEMPLATE_CONFIG;
  }, [initialTemplateKey, savedStyleConfig]);

  const [currentTemplateName, setLocalTemplateName] = useState(initialTemplateKey);
  const [sectionPositions, setSectionPositions] = useState(initialConfig.positions || {});
  const [lines, setLines] = useState(initialConfig.lines || []);
  const [backgroundShapes, setBackgroundShapes] = useState(initialConfig.shapes || []);
  const [nextLineId, setNextLineId] = useState(() => {
    return initialConfig.lines && initialConfig.lines.length > 0
      ? Math.max(...initialConfig.lines.map(l => l.id)) + 1
      : 1;
  });
  const [nextShapeId, setNextShapeId] = useState(() => {
    const shapes = initialConfig.shapes || initialConfig.backgroundShapes || [];
    return shapes && shapes.length > 0
      ? Math.max(...shapes.map(s => s.id)) + 1
      : 1;
  });

  const [sectionWidths, setSectionWidths] = useState(() => {
    const { widths } = extractWidthsAndHeightsFromConfig(initialConfig);
    return widths;
  });
  const [sectionHeights, setSectionHeights] = useState(() => {
    const { heights } = extractWidthsAndHeightsFromConfig(initialConfig);
    return heights;
  });
  const [styleConfig, setStyleConfig] = useState(initialConfig);
  const [styleKey, setStyleKey] = useState(0); // 🚀 Force rerender key
  const [webglResetKey, setWebglResetKey] = useState(0); // 🚀 Restart engine key
  const [backupConfig, setBackupConfig] = useState(null); // 🆕 Store previous layout for restore
  const [isLayoutDirty, setIsLayoutDirty] = useState(false); // 🆕 Track manual layout changes
  const [sectionSnapshots, setSectionSnapshots] = useState({});
  const [TemplateComponents, setTemplateComponents] = useState(null);
  const currentResume = useSelector((state) => state.resume.currentResume);
  const currentResumeId = useSelector((state) => state.resume.resumeId);
  const lastDispatchedRef = useRef(null); // 🛡️ Prevent infinite sync loops

  const [resumeData, setResumeData] = useState(defaultResumeData);
  const [resumeDetails, setResumeDetails] = useState(defaultResumeData);
  const [customSections, setCustomSections] = useState([]);

  // 🛡️ Section Visibility State (New Feature)
  const [sectionVisibility, setSectionVisibility] = useState({
    summary: true,
    skills: true,
    experience: true,
    projects: true,
    education: true,
    certifications: true,
    contact: true,
    header: true
  });

  // 🔄 Sync visibility from prop/redux on mount
  useEffect(() => {
    if (resumeData) {
      setSectionVisibility(prev => {
        const newVis = {
          ...prev, // Keep existing custom ones
          summary: resumeData.showSummary ?? true,
          skills: resumeData.showSkills ?? true,
          experience: resumeData.showExperience ?? true,
          projects: resumeData.showProjects ?? true,
          education: resumeData.showEducation ?? true,
          certifications: resumeData.showCertifications ?? true,
          contact: true,
          header: true
        };

        // Add custom sections if not present
        if (customSections) {
          customSections.forEach(section => {
            const id = `custom-${section.id}`;
            if (newVis[id] === undefined) newVis[id] = true;
          });
        }
        return newVis;
      });
    }
  }, [resumeData, customSections]);

  // 🛡️ SYNC CUSTOM SECTIONS FROM RESUME DETAILS
  useEffect(() => {
    if (resumeDetails?.customSections) {
      setCustomSections(resumeDetails.customSections);
    }
  }, [resumeDetails]);

  // 🛡️ SYNC CUSTOM SECTIONS TO WEBGL (Auto-Initialize Positions) - Same as ResumeEditorv3
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

    // 🛡️ Initialize widths for custom sections to show in left panel
    setSectionWidths(prev => {
      const updated = { ...prev };
      let hasChanges = false;
      customSections.forEach(section => {
        const id = `custom-${section.id}`;
        if (!updated[id]) {
          updated[id] = '515px'; // default width
          hasChanges = true;
        }
      });
      return hasChanges ? updated : prev;
    });
  }, [customSections]);



  // 🎬 GPU Animation State
  const [headerAnimating, setHeaderAnimating] = useState(false);
  const [skillsAnimating, setSkillsAnimating] = useState(false); // New state for skills
  const [activeSectionAccordion, setActiveSectionAccordion] = useState(null); // 🗂 Sub-section accordion state

  // ✨ UI Animation State
  const [isAnimationsEnabled, setIsAnimationsEnabled] = useState(false);
  const [isPhysicsEnabled, setIsPhysicsEnabled] = useState(false); // 🚀 Added

  const headerContainerRef = useRef(null);
  const skillsContainerRef = useRef(null); // New ref for skills container
  const physicsManager = useRef(null); // 🚀 Added

  const headerAnimationRef = useRef({
    active: false,
    startTime: 0,
    duration: 500, // 🎬 Reduced for decoupled feel
  });

  const skillsAnimationRef = useRef({
    active: false,
    startTime: 0,
    duration: 500, // 🎬 Reduced for decoupled feel
  });

  // 🧠 SMART SNAPSHOT: Track previous styles to avoid unnecessary re-captures
  const prevStyleConfigRef = useRef({});

  const handleTemplateSwitch = (templateName, overrideConfig = null) => {
    const normalizedKey = normalizeTemplateKey(templateName);

    // 1️⃣ Ignore if same template (unless overriding with fresh config)
    if (normalizedKey === currentTemplateName && !overrideConfig) return;

    // 2️⃣ Safeguard: Warn if layout is dirty and switching to a DIFFERENT template
    // Only warn if editing an existing resume (resumeId is present)
    if (isLayoutDirty && !overrideConfig && resumeId) {
      const confirmSwitch = window.confirm("Are you sure you want to change the template? Your current custom layout will be backed up.");
      if (!confirmSwitch) return;
    }

    console.log(`🔄 Switching to template: ${normalizedKey}`);

    // 3️⃣ Backup current state before overwrite
    setBackupConfig({
      styleConfig: JSON.parse(JSON.stringify(styleConfig)),
      positions: { ...sectionPositions },
      lines: [...lines],
      shapes: [...backgroundShapes],
      templateName: currentTemplateName
    });

    // 4️⃣ Load New Template Config
    setLocalTemplateName(normalizedKey);
    dispatch(setCurrentTemplate(normalizedKey)); // 🔄 Sync to Redux to avoid fight/revert

    // 🛡️ Robust Lookup from TEMPLATES map
    let template = overrideConfig || TEMPLATES[normalizedKey] || ATS_TEMPLATE_CONFIG;

    // 🆕 If custom template and we have saved config, use it
    if (normalizedKey === 'custom' && savedStyleConfig) {
      console.log("✨ Using saved style config for custom template");
      template = savedStyleConfig;
    }

    if (!template) {
      console.error(`ERROR: Template '${normalizedKey}' not found and fallback failed.`);
      return;
    }

    setStyleConfig(template);

    // 🛡️ PRESERVE CUSTOM SECTION POSITIONS DURING TEMPLATE SWITCH
    setSectionPositions(prev => {
      const newPos = { ...(template.positions || {}) };
      // Keep existing custom sections
      Object.keys(prev).forEach(key => {
        if (key.startsWith('custom-')) {
          newPos[key] = prev[key];
        }
      });
      return newPos;
    });

    const { widths, heights } = extractWidthsAndHeightsFromConfig(template);
    setSectionWidths(widths);
    setSectionHeights(heights);

    setLines(template.lines || []);
    setBackgroundShapes(template.shapes || []);
    setZoom(1);
    setSelectedLine(null);
    setSelectedShape(null);
    setSelectedSection(null);
    setIsLayoutDirty(false); // Reset dirty flag after switch

    // Reset counters
    if (template.lines && template.lines.length > 0) {
      setNextLineId(Math.max(...template.lines.map(l => l.id || 0)) + 1);
    } else {
      setNextLineId(1);
    }

    const shapes = template.shapes || template.backgroundShapes || [];
    if (shapes && shapes.length > 0) {
      setNextShapeId(Math.max(...shapes.map(s => s.id || 0)) + 1);
    } else {
      setNextShapeId(1);
    }
  };

  const handleRestoreBackup = () => {
    if (!backupConfig) return;

    console.log("💾 Restoring layout from backup...");
    setStyleConfig(backupConfig.styleConfig);
    setSectionPositions(backupConfig.positions);
    setLines(backupConfig.lines);
    setBackgroundShapes(backupConfig.shapes);
    setLocalTemplateName(backupConfig.templateName);
    dispatch(setCurrentTemplate(backupConfig.templateName));
    setIsLayoutDirty(true);
  };



  const handleSaveAll = async () => {

    if (userId == null) {
      // Assuming simple alert or toast if window.showMessage not available, 
      // but strictly following user pattern:
      if (window.showMessage) window.showMessage('Please Login First.', 'warning');
      else alert('Please Login First.');
      return;
    }
    setSaving(true);
    setSaveError("");
    setSuccessMessage("");

    const MAX_RETRIES = 3;
    let attempt = 0;
    const timeout = 30000;

    while (attempt < MAX_RETRIES) {
      let controller;
      try {
        const updatedConfig = {
          ...styleConfig,
          positions: sectionPositions,
          lines: lines,
          shapes: backgroundShapes,
        };

        const transformedSkills = (resumeDetails.skills || []).map(skill =>
          typeof skill === 'string' ? { name: skill.trim() } : skill
        ).filter(skill => skill.name !== "");

        const transformedCertifications = (resumeDetails.certifications || []).map(cert =>
          typeof cert === 'string' ? { name: cert.trim() } : cert
        ).filter(cert => cert.name !== "");

        const transformedCustomSections = (resumeDetails.customSections || []).map(section => ({
          title: section.title,
          sectionData: {
            items: section.items
          }
        }));

        const payload = {
          title: resumeDetails.resumeDetails?.title || "My Resume",
          templateId: String(currentTemplateName || "custom"),
          userId: userId,
          details: {
            name: resumeDetails.resumeDetails?.name,
            title: resumeDetails.resumeDetails?.title,
            summary: resumeDetails.resumeDetails?.summary,
          },
          contact: resumeDetails.resumeDetails?.contact,
          skills: transformedSkills,
          experiences: resumeDetails.experiences,
          projects: resumeDetails.projects,
          educationList: resumeDetails.educationList,
          certifications: transformedCertifications,
          customSections: transformedCustomSections,
          styleConfig: updatedConfig,
          sectionTitles: resumeDetails.sectionTitles || {}
        };

        const targetResumeId = resumeId || currentResumeId;
        const endpoint = targetResumeId
          ? `/update/${targetResumeId}`
          : `/saveall`;

        const method = targetResumeId ? "PUT" : "POST";

        controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), timeout);

        const res = await api({
          method: method,
          url: endpoint,
          data: payload,
          signal: controller.signal
        });

        clearTimeout(tid);

        // Axios throws on non-2xx by default, but we can double check or just catch
        const data = res.data;

        if (!targetResumeId && data.resumeId) {
          dispatch(setCurrentResumeId(data.resumeId));
        }
        dispatch(setSavedStyleConfig(updatedConfig));
        dispatch(setCurrentTemplate(currentTemplateName));

        const msg = "Resume configuration saved successfully!";
        setSuccessMessage(msg);
        setIsLayoutDirty(false);
        if (window.showMessage) window.showMessage('Success', msg, 'success', 1500);
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
        if (window.showMessage) window.showMessage('Error', finalMsg, 'error', 1500);
        break;
      }
    }
    setSaving(false);
  };

  // Mobile responsiveness state
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('controls'); // 'controls' | 'properties'
  const [isAnimating, setIsAnimating] = useState(false); // TEST ANIMATION STATE

  // Mobile detection effect
  // Mobile detection & Viewport tracking
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      const mobile = width <= 768;
      setIsMobile(mobile);

      // If entering mobile mode, reset zoom to 1 (we rely on native stage scaling)
      if (mobile) {
        setActiveTab('preview');
        setZoom(1.0);
      }
    };

    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate Responsive Canvas Props
  const canvasTargetWidth = isMobile ? (viewportWidth - 30) : 595;
  const canvasScale = canvasTargetWidth / 595;
  const canvasTargetHeight = 842 * canvasScale;
  useEffect(() => {
    if (!currentResume) return;

    // 🛡️ Only update local state if Redux changed from an EXTERNAL source
    const currentResumeStr = JSON.stringify(currentResume);
    if (currentResumeStr !== lastDispatchedRef.current && currentResumeStr !== JSON.stringify(resumeData)) {
      console.log("📥 Syncing b3 local state from Redux");
      setResumeData(currentResume);
      setResumeDetails(currentResume);
    }
  }, [currentResume]);

  // 🔄 Sync local template state when Redux template changes (e.g., from ResumeEditorv3)
  useEffect(() => {
    // Only trigger if Redux value actually differs from local state
    // AND is not null (avoids reset on mount if Redux is empty)
    if (globalCurrentTemplate && globalCurrentTemplate !== currentTemplateName) {
      console.log(`📤 Redux Sync: Template changed to ${globalCurrentTemplate}`);
      handleTemplateSwitch(globalCurrentTemplate, savedStyleConfig);
    }
  }, [globalCurrentTemplate, currentTemplateName]); // 🛡️ Reduced dependencies to avoid jitter



  // 🎬 GPU Header Layout Animation Handler
  const animateHeaderLayoutChange = async (newLayoutConfig) => {
    if (!headerContainerRef.current) {
      // Fallback: instant update if no WebGL container
      setStyleConfig(prev => ({
        ...prev,
        header: { ...prev.header, ...newLayoutConfig }
      }));
      return;
    }

    // 🚀 Start animating IMMEDIATELY to block DOM re-capture
    if (!isAnimationsEnabled) {
      setStyleConfig(prev => ({
        ...prev,
        header: {
          ...prev.header,
          ...newLayoutConfig,
          nameStyle: { ...prev.header?.nameStyle, ...newLayoutConfig.nameStyle },
          titleStyle: { ...prev.header?.titleStyle, ...newLayoutConfig.titleStyle }
        }
      }));
      return;
    }

    setHeaderAnimating(true);

    // 1. Capture current position
    const startX = headerContainerRef.current.x;
    const startY = headerContainerRef.current.y;

    // 2. Update config (this triggers DOM update for new snapshot)
    setStyleConfig(prev => ({
      ...prev,
      header: {
        ...prev.header,
        ...newLayoutConfig,
        // Deep merge styles
        nameStyle: { ...prev.header?.nameStyle, ...newLayoutConfig.nameStyle },
        titleStyle: { ...prev.header?.titleStyle, ...newLayoutConfig.titleStyle }
      }
    }));

    // 3. Wait for new coordinates to be calculated (DOM -> Snapshot -> WebGL Layout)
    // We use a shorter delay to ensure we catch the re-render frame early
    setTimeout(() => {
      // Find the header position in the freshly updated sectionPositions
      const endPos = sectionPositions.header || { x: startX, y: startY };

      // 4. Update GPU animation parameters for FADE-OUT
      headerAnimationRef.current = {
        active: true,
        startTime: performance.now(),
        duration: 800, // 800ms fade-out
        lastLoggedPercent: -1
      };

      setHeaderAnimating(true);
      console.log('🎬 FADE-OUT STARTED (2s)');
    }, 40); // Catch it quickly
  };

  // 🎬 GPU Skills Layout Animation Handler
  const animateSkillsLayoutChange = async (newLayoutConfig) => {
    if (!skillsContainerRef.current || !isAnimationsEnabled) {
      setStyleConfig(prev => ({
        ...prev,
        skills: { ...prev.skills, ...newLayoutConfig }
      }));
      return;
    }

    setSkillsAnimating(true);

    // Fade out
    skillsAnimationRef.current = {
      active: true,
      startTime: performance.now(),
      duration: 500,
      lastLoggedPercent: -1
    };

    setStyleConfig(prev => ({
      ...prev,
      skills: { ...prev.skills, ...newLayoutConfig }
    }));

    // Reset after animation
    setTimeout(() => {
      setSkillsAnimating(false);
    }, 600);
  };



  // Initialize template on mount

  useEffect(() => {
    const defaultTemplate = TEMPLATES['ats'] || ATS_TEMPLATE_CONFIG;

    if (defaultTemplate) {
      setSectionPositions(defaultTemplate.positions || {});
      setLines(defaultTemplate.lines || []);
      setBackgroundShapes(defaultTemplate.shapes || []);

      // Initialize IDs
      if (defaultTemplate.lines && defaultTemplate.lines.length > 0) {
        setNextLineId(Math.max(...defaultTemplate.lines.map(l => l.id || 0)) + 1);
      }
      if (defaultTemplate.shapes && defaultTemplate.shapes.length > 0) {
        setNextShapeId(Math.max(...defaultTemplate.shapes.map(s => s.id || 0)) + 1);
      }
    } else {
      console.error("CRITICAL: Default 'ats' template not found!");
    }
  }, []);


  // ==================== USE EFFECTS ====================

  // Sync regular and custom sections to refs
  useEffect(() => {
    const regularSections = ['header', 'contact', 'summary', 'skills', 'experience', 'education', 'projects', 'certifications'];
    regularSections.forEach(section => {
      if (!sectionRefs.current[section]) {
        sectionRefs.current[section] = React.createRef();
      }
    });

    customSections.forEach(section => {
      const id = `custom-${section.id}`;
      if (!sectionRefs.current[id]) {
        sectionRefs.current[id] = React.createRef();
      }
    });
  }, [customSections]);

  // Initialize template components
  useEffect(() => {
    setTemplateComponents({
      header: FlexibleHeaderSection,
      contact: FlexibleContactSection,
      summary: FlexibleSummarySection,
      skills: FlexibleSkillsSection,
      experience: FlexibleExperienceSection,
      projects: FlexibleProjectsSection,
      education: FlexibleEducationSection,
      certifications: FlexibleCertificationsSection
    });
  }, []);





  // Handle width change
  const handleWidthChange = (sectionName, value) => {
    let clampedValue = value;
    const numericValue = parseInt(value);
    if (!isNaN(numericValue) && numericValue > 575) {
      clampedValue = value.toString().includes('px') ? '575px' : '575';
    }

    setSectionWidths(prev => ({
      ...prev,
      [sectionName]: clampedValue
    }));
  };



  // Add this helper function with your other helper functions
  const handleHeightChange = (sectionName, value) => {
    setSectionHeights(prev => ({
      ...prev,
      [sectionName]: value
    }));
  };

  // Add this to apply height
  const handleHeightBlur = (sectionName) => {
    const height = sectionHeights[sectionName];
    setStyleConfig(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        container: {
          ...prev[sectionName]?.container,
          height: height
        }
      }
    }));
  };


  // Handle width blur (apply the width)
  const handleWidthBlur = (sectionName) => {
    const width = sectionWidths[sectionName];
    setStyleConfig(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        container: {
          ...prev[sectionName]?.container,
          width: width
        }
      }
    }));
  };

  // Helper to map generic 'bodyStyle' to section-specific style names
  const getStyleType = (sectionName, genericType) => {
    if (genericType === 'subtitleStyle') {
      const subtitleMappings = {
        skills: 'categoryStyle',
        experience: 'companyStyle',
        education: 'institutionStyle',
        projects: 'durationStyle'
      };
      return subtitleMappings[sectionName] || 'subtitleStyle';
    }

    if (genericType !== 'bodyStyle') return genericType;
    const mappings = {
      header: 'nameStyle',
      skills: 'valueStyle',
      experience: 'positionStyle',
      projects: 'nameStyle',
      education: 'degreeStyle',
      certifications: 'itemStyle'
    };
    return mappings[sectionName] || 'bodyStyle';
  };

  // Handle style changes with smart section-to-property mapping
  const handleStyleChange = (sectionName, styleType, value, property) => {
    const targetType = getStyleType(sectionName, styleType);

    setStyleConfig(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [targetType]: {
          ...prev[sectionName]?.[targetType],
          [property]: value
        }
      }
    }));
  };

  // Add these helper methods to your component

  const handleSectionOrderChange = (currentIndex, direction) => {
    const currentOrder = styleConfig.header?.sectionOrder || ['name', 'title', 'contact'];
    const newOrder = [...currentOrder];

    if (direction === 'up' && currentIndex > 0) {
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
    } else if (direction === 'down' && currentIndex < newOrder.length - 1) {
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
    }

    setStyleConfig(prev => ({
      ...prev,
      header: {
        ...prev.header,
        sectionOrder: newOrder
      }
    }));
  };

  // Reset Layout
  // const resetLayout = () => {
  //   const template = TEMPLATES[currentTemplateName];
  //   setSectionPositions(template.positions || {});
  //   setSectionWidths(extractWidthsFromConfig(template));
  //   setLines(template.lines || []);
  //   setBackgroundShapes(template.backgroundShapes || []);
  //   setZoom(1);

  //   // Reset line and shape ID counters
  //   if (template.lines && template.lines.length > 0) {
  //     setNextLineId(Math.max(...template.lines.map(l => l.id)) + 1);
  //   } else {
  //     setNextLineId(1);
  //   }
  //   if (template.backgroundShapes && template.backgroundShapes.length > 0) {
  //     setNextShapeId(Math.max(...template.backgroundShapes.map(s => s.id)) + 1);
  //   } else {
  //     setNextShapeId(1);
  //   }
  // };


  const handleGlobalStyleChange = (key, value) => {
    setStyleConfig(prev => ({
      ...prev,
      [key]: value
    }));

    // 🚀 Force engine rerender for these critical changes
    if (key === 'globalFontFamily' || key.includes('Color') || key === 'globalBulletTop') {
      setStyleKey(prev => prev + 1);
    }

    setIsLayoutDirty(true);
  };

  // Reset Layout - UPDATED
  const resetLayout = () => {
    // 🔄 Normalize template identifier first
    const normalizedKey = normalizeTemplateKey(currentTemplateName);
    const template = TEMPLATES[normalizedKey] || ATS_TEMPLATE_CONFIG;

    // 🛡️ Null safety: Only update if template exists
    if (!template) {
      console.warn(`⚠️ Template "${currentTemplateName}" not found, skipping reset`);
      return;
    }

    setSectionPositions(template.positions || {});

    const { widths, heights } = extractWidthsAndHeightsFromConfig(template);
    setSectionWidths(widths);
    setSectionHeights(heights);

    setLines(template.lines || []);
    setBackgroundShapes(template.shapes || []);
    setZoom(1);

    // Reset line and shape ID counters
    if (template.lines && template.lines.length > 0) {
      setNextLineId(Math.max(...template.lines.map(l => l.id)) + 1);
    } else {
      setNextLineId(1);
    }
    if (template.shapes && template.shapes.length > 0) {
      setNextShapeId(Math.max(...template.shapes.map(s => s.id)) + 1);
    } else {
      setNextShapeId(1);
    }
  };

  // Download as image
  const downloadResume = async () => {
    const app1 = webGLStageRef1.current?.app;
    if (!app1) return;

    const selectedId = selectedSection || selectedShape || selectedLine;

    // 🛡️ Helper: Capture stage with Scaling Fix & No Borders
    const getPageCanvas = async (app) => {
      if (!app) {
        console.error("❌ getPageCanvas: App is null");
        return null;
      }
      try {
        // 1. Hide selection borders
        app.stage.children.forEach(layer => {
          if (layer.children) {
            layer.children.forEach(container => {
              const border = container.children?.find(c => c.name === 'selectionBorder');
              if (border) border.visible = false;
            });
          }
        });

        // 2. Temporarily reset scale for full-quality capture (Fixes Mobile Clipping)
        const originalScale = app.stage.scale.x;
        const originalMask = app.stage.mask;
        app.stage.scale.set(1);
        app.stage.mask = null;
        if (originalMask) originalMask.visible = false;

        // 🚀 Ensure scene is updated before capture
        if (app.renderer) {
          app.renderer.render(app.stage);
        }

        // 🔍 DIAGNOSTIC LOGS
        console.log("🔍 [getPageCanvas] Stage Diagnostics:", {
          children: app.stage.children.length,
          bounds: app.stage.getBounds(),
          scale: { x: app.stage.scale.x, y: app.stage.scale.y },
          position: { x: app.stage.position.x, y: app.stage.position.y },
          renderer: { width: app.renderer.width, height: app.renderer.height }
        });

        const contentBounds = app.stage.getBounds();
        if (contentBounds.width === 0 || contentBounds.height === 0) {
          console.error("❌ CRITICAL: Stage content bounds are ZERO! Nothing to capture.");
        }

        // 3. Extract with resolution = 1 on mobile to avoid artifacts
        console.log("📸 [getPageCanvas] Triggering PIXI extract...");
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const exportResolution = isMobile ? 1 : Math.min(app.renderer.resolution || 1, 2.0);

        const canvas = await app.renderer.extract.canvas({
          target: app.stage,
          resolution: exportResolution,
          frame: new PIXI.Rectangle(0, 0, 595, 842)
        });

        // 4. Restore original state
        app.stage.scale.set(originalScale);
        app.stage.mask = originalMask;
        if (originalMask) originalMask.visible = true;

        // 5. Restore active selection border
        app.stage.children.forEach(layer => {
          if (layer.children) {
            layer.children.forEach(container => {
              if (container._id === selectedId) {
                const border = container.children?.find(ch => ch.name === 'selectionBorder');
                if (border) border.visible = true;
              }
            });
          }
        });

        return canvas;
      } catch (err) {
        console.error("❌ getPageCanvas Error:", err);
        return null;
      }
    };

    try {
      const downloadCanvas = (canvas, filename) => {
        const uri = canvas.toDataURL('image/jpeg', 0.9);
        const link = document.createElement('a');
        link.download = filename.replace('.png', '.jpg');
        link.href = uri;
        link.click();
      };

      // 1. Capture and Download Page 1
      const canvas1 = await getPageCanvas(app1);
      if (canvas1) downloadCanvas(canvas1, 'resume-page1.png');

      // 2. Capture and Download Page 2 if active
      if (showPage2) {
        const app2 = webGLStageRef2.current?.app;
        if (app2) {
          const canvas2 = await getPageCanvas(app2);
          if (canvas2) {
            setTimeout(() => {
              downloadCanvas(canvas2, 'resume-page2.png');
            }, 300);
          }
        }
      }

      console.log('✅ Resume PNG(s) downloaded');
    } catch (err) {
      console.error('Failed to download resume:', err);
    }
  };

  // Download as PDF
  const downloadPDF = async () => {
    const app1 = webGLStageRef1.current?.app;
    if (!app1) {
      console.error("❌ WebGL App not found for Page 1");
      return;
    }

    const selectedId = selectedSection || selectedShape || selectedLine;

    // 🛡️ Reuse capture logic from downloadResume (duplicated here for scope safety)
    const getPageCanvas = async (app) => {
      if (!app) return null;
      try {
        // 1. Hide ALL visual artifacts (borders, masks, selection indicators)
        app.stage.children.forEach(l => l.children?.forEach(c => {
          const b = c.children?.find(ch => ch.name === 'selectionBorder');
          if (b) b.visible = false;
        }));

        // 2. Hide stage mask and borders that cause lines
        const originalScale = app.stage.scale.x;
        const originalMask = app.stage.mask;
        const originalAlpha = app.stage.alpha;

        app.stage.scale.set(1);
        app.stage.mask = null;
        app.stage.alpha = 1; // Ensure full opacity
        if (originalMask) originalMask.visible = false;

        if (app.renderer) {
          app.renderer.render(app.stage);
        }

        const stageBounds = app.stage.getBounds();
        console.log("🔍 [PDF getPageCanvas] Stage Diagnostics:", {
          childrenCount: app.stage.children.length,
          bounds: { x: stageBounds.x, y: stageBounds.y, width: stageBounds.width, height: stageBounds.height },
          scale: { x: app.stage.scale.x, y: app.stage.scale.y },
          renderer: { width: app.renderer.width, height: app.renderer.height },
          firstChildVisible: app.stage.children[0]?.visible,
          firstChildAlpha: app.stage.children[0]?.alpha
        });

        // 🔧 Use renderer resolution for export (capped at 2.0)
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const exportResolution = Math.min(app.renderer.resolution || 1, 2.0);

        console.log("📐 [PDF Export] Resolution:", { isMobile, exportResolution });

        const canvas = await app.renderer.extract.canvas({
          target: app.stage,
          resolution: exportResolution,
          frame: new PIXI.Rectangle(0, 0, 595, 842)
        });

        console.log("📸 [PDF getPageCanvas] Extracted Canvas:", {
          width: canvas.width,
          height: canvas.height,
          dataUrlLength: canvas.toDataURL().length
        });

        if (canvas.toDataURL().length < 1000) {
          console.error("❌ CRITICAL: Extracted canvas seems empty (data URL too short)!");
        }

        app.stage.scale.set(originalScale);
        app.stage.mask = originalMask;
        if (originalMask) originalMask.visible = true;
        app.stage.children.forEach(l => l.children?.forEach(c => {
          const b = c.children?.find(ch => ch.name === 'selectionBorder');
          if (b && c._id === selectedId) b.visible = true;
        }));
        return canvas;
      } catch (err) {
        console.error("❌ PDF getPageCanvas Error:", err);
        return null;
      }
    };

    try {
      console.log('📄 Starting PDF Generation...');

      // 1. Setup PDF (A4 size in points: 595.28 x 841.89)
      const pdf = new jsPDF('p', 'pt', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      // 2. Extract Page 1
      const canvas1 = await getPageCanvas(app1);
      if (!canvas1) throw new Error("Failed to capture Page 1");
      const imgData1 = canvas1.toDataURL('image/jpeg', 0.9);

      pdf.addImage(imgData1, 'JPEG', 0, 0, width, height, undefined, 'FAST');

      // 3. Extract Page 2 (if active)
      if (showPage2) {
        const app2 = webGLStageRef2.current?.app;
        if (app2) {
          console.log('📄 Adding Page 2...');
          const canvas2 = await getPageCanvas(app2);
          if (canvas2) {
            const imgData2 = canvas2.toDataURL('image/jpeg', 0.9);
            pdf.addPage();
            pdf.addImage(imgData2, 'JPEG', 0, 0, width, height, undefined, 'FAST');
          }
        }
      }

      // 4. ADD INTERACTIVE LINKS (Post-process snapshots)
      console.log('🔗 Injecting Interactive Links...');

      const addLinksToPage = (targetPageNum) => {
        pdf.setPage(targetPageNum);
        const yOffset = (targetPageNum - 1) * 842;

        Object.entries(sectionPositions).forEach(([sectionId, pos]) => {
          // Determine which page this section starts on
          const sectionY = pos.y;
          const sectionPage = sectionY >= 842 ? 2 : 1;

          if (sectionPage !== targetPageNum) return;

          const snapshot = sectionSnapshots[sectionId];
          if (!snapshot || !snapshot.nodes) return;

          snapshot.nodes.forEach(node => {
            if (node.href && node.width > 0 && node.height > 0) {
              // Calculate absolute coordinates on the PDF page
              // sectionY is global, we need relative to current PDF page
              const relativeY = sectionY - yOffset;
              const linkX = pos.x + node.x;
              const linkY = relativeY + node.y;

              pdf.link(linkX, linkY, node.width, node.height, { url: node.href });
            }
          });
        });
      };

      addLinksToPage(1);
      if (showPage2) addLinksToPage(2);

      // 5. ADD INVISIBLE TEXT LAYER (Crucial for ATS)
      console.log('📄 Injecting Invisible Text Layer for ATS...');

      const addTextLayerToPage = (targetPageNum) => {
        pdf.setPage(targetPageNum);
        const yOffset = (targetPageNum - 1) * 842;

        Object.entries(sectionPositions).forEach(([sectionId, pos]) => {
          const sectionY = pos.y;
          const sectionPage = sectionY >= 842 ? 2 : 1;

          if (sectionPage !== targetPageNum) return;

          const snapshot = sectionSnapshots[sectionId];
          if (!snapshot || !snapshot.nodes) return;

          snapshot.nodes.forEach(node => {
            if (node.type === 'text' && node.text) {
              const relativeY = sectionY - yOffset;
              const textX = pos.x + node.x;
              const textY = relativeY + node.y;

              // Use styles for font size and color (though we make it transparent)
              const fontSize = node.styles?.fontSize || 10;

              // Map standard fonts to PDF fonts
              const fontMap = {
                'Helvetica': 'helvetica',
                'Arial': 'helvetica',
                'Times New Roman': 'times',
                'Courier New': 'courier'
              };
              const fontFamily = fontMap[node.styles?.fontFamily] || 'helvetica';
              const fontWeight = (node.styles?.fontWeight === 'bold' || node.styles?.fontWeight >= 700) ? 'bold' : 'normal';

              pdf.setFontSize(fontSize);
              pdf.setFont(fontFamily, fontWeight);

              // 🧠 Baseline Fix: jsPDF 'text' Y is the baseline, while node.y is the top.
              // We add ~80% of fontSize to align the baseline correctly.
              const baselineY = textY + (fontSize * 0.8);

              // Make text invisible but extractable
              // Mode 3 is "Invisible"
              pdf.text(node.text, textX, baselineY, {
                renderingMode: 'invisible',
                maxWidth: node.width
              });
            }
          });
        });
      };

      addTextLayerToPage(1);
      if (showPage2) addTextLayerToPage(2);

      pdf.save('resume.pdf');
      console.log('✅ PDF Generation Complete');
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    }
  };

  // Handle canvas click (deselect)


  // Separate elements by page
  const getElementsForPage = (pageNum) => {
    const pageStart = (pageNum - 1) * 842;
    const pageEnd = pageNum * 842;

    return {
      sections: Object.entries(sectionPositions || {}).filter(([name, pos]) => {
        if (!pos) return false;
        if (!sectionVisibility[name]) return false; // 🛡️ Hide from WebGL if toggled off
        const height = sectionHeights[name] || (sectionSnapshots[name]?.height) || 200;
        // Intersection check: top is in page OR bottom is in page
        return (pos.y < pageEnd && pos.y + height > pageStart);
      }),
      lines: (lines || []).filter(line => {
        // Broaden range slightly to catch line thickness/overlap
        const yMin = Math.min(line.y1, line.y2);
        const yMax = Math.max(line.y1, line.y2);
        return (yMax > pageStart && yMin < pageEnd);
      }),
      shapes: (backgroundShapes || []).filter(shape => {
        return (shape.y < pageEnd && shape.y + (shape.height || 100) > pageStart);
      })
    };
  };






  // ==================== TEMPLATE SWITCHING ====================

  // const handleTemplateSwitch = (templateName) => {
  //   setCurrentTemplate(templateName);
  //   const template = TEMPLATES[templateName];
  //   setStyleConfig(template);
  //   setSectionPositions(template.positions || {});
  //   setSectionWidths(extractWidthsFromConfig(template));
  //   setLines(template.lines || []);
  //   setBackgroundShapes(template.backgroundShapes || []);
  //   setZoom(1);
  //   setSelectedLine(null);
  //   setSelectedShape(null);
  //   setSelectedSection(null);

  //   // Reset counters
  //   if (template.lines && template.lines.length > 0) {
  //     setNextLineId(Math.max(...template.lines.map(l => l.id)) + 1);
  //   } else {
  //     setNextLineId(1);
  //   }
  //   if (template.backgroundShapes && template.backgroundShapes.length > 0) {
  //     setNextShapeId(Math.max(...template.backgroundShapes.map(s => s.id)) + 1);
  //   } else {
  //     setNextShapeId(1);
  //   }
  // };













  // ==================== LINE FUNCTIONS ====================

  // Add line
  const addLine = (orientation) => {
    const newLine = {
      id: nextLineId,
      label: `Line ${nextLineId}`,
      orientation: orientation,
      x1: orientation === 'horizontal' ? 100 : 200,
      y1: orientation === 'horizontal' ? 200 : 100,
      x2: orientation === 'horizontal' ? 400 : 200,
      y2: orientation === 'horizontal' ? 200 : 400,
      thickness: 1,
      color: '#000000'
    };
    setLines([...lines, newLine]);
    setNextLineId(nextLineId + 1);
    setSelectedLine(newLine.id);
    setIsLayoutDirty(true); // 🆕 Layout change
  };

  // Delete line
  const deleteLine = (id) => {
    setLines(lines.filter(line => line.id !== id));
    if (selectedLine === id) setSelectedLine(null);
    setIsLayoutDirty(true); // 🆕 Layout change
  };

  // Update line property
  const updateLine = (id, property, value) => {
    setLines(lines.map(line =>
      line.id === id ? { ...line, [property]: value } : line
    ));
  };

  // Move line
  const moveLine = (id, direction) => {
    const step = 2; // Reduced step for fine control
    setLines(prevLines => prevLines.map(line => {
      if (line.id !== id) return line;

      let updatedLine = { ...line };
      switch (direction) {
        case 'up':
          updatedLine = { ...line, y1: line.y1 - step, y2: line.y2 - step };
          break;
        case 'down':
          updatedLine = { ...line, y1: line.y1 + step, y2: line.y2 + step };
          break;
        case 'left':
          updatedLine = { ...line, x1: line.x1 - step, x2: line.x2 - step };
          break;
        case 'right':
          updatedLine = { ...line, x1: line.x1 + step, x2: line.x2 + step };
          break;
      }

      // 🧠 Recalculate offsetY if this is a section divider
      if (updatedLine.isSectionDivider) {
        const sectionPos = sectionPositions[updatedLine.isSectionDivider];
        if (sectionPos) {
          updatedLine.offsetY = updatedLine.y1 - sectionPos.y;
        }
      }
      return updatedLine;
    }));
    setIsDividerSyncEnabled(false); // 🚀 TURN OFF SYNC on manual nudge
    setIsLayoutDirty(true);
  };

  // Resize line
  const resizeLine = (id, action) => {
    const step = 20;
    setLines(lines.map(line => {
      if (line.id !== id) return line;

      if (line.orientation === 'horizontal') {
        return {
          ...line,
          x2: action === 'increase' ? line.x2 + step : line.x2 - step
        };
      } else {
        return {
          ...line,
          y2: action === 'increase' ? line.y2 + step : line.y2 - step
        };
      }
    }));
    setIsLayoutDirty(true);
  };

  // Handle line drag end
  const handleLineDragEnd = (id, newPos) => {
    setLines(lines.map(line => {
      if (line.id === id) {
        const updatedLine = { ...line, ...newPos };
        // 🧠 If this is a section divider, update its relative offset
        // This ensures that when sync is ON, it maintains the user's custom positioning
        if (line.isSectionDivider) {
          const sectionPos = sectionPositions[line.isSectionDivider];
          if (sectionPos) {
            updatedLine.offsetY = updatedLine.y1 - sectionPos.y;
          }
        }
        return updatedLine;
      }
      return line;
    }));
    setIsDividerSyncEnabled(false); // 🚀 Turning sync OFF if user manually adjusts a line
    setIsLayoutDirty(true); // 🆕 Layout change
    // 🛡️ Selection persists (User Request)
  };

  // Handle line update
  const handleLineUpdate = (id, updates) => {
    setLines(prevLines => prevLines.map(line => {
      if (line.id === id) {
        const updatedLine = { ...line, ...updates };
        // 🧠 Recalculate offsetY if this is a section divider and Y changed
        if (updatedLine.isSectionDivider && (updates.y1 !== undefined || updates.y2 !== undefined)) {
          const sectionPos = sectionPositions[updatedLine.isSectionDivider];
          if (sectionPos) {
            updatedLine.offsetY = updatedLine.y1 - sectionPos.y;
          }
        }
        return updatedLine;
      }
      return line;
    }));
    setIsDividerSyncEnabled(false); // 🚀 TURN OFF SYNC on manual edit
    setIsLayoutDirty(true); // 🆕 Layout change
  };




  // ==================== BACKGROUND SHAPE FUNCTIONS ====================

  // Add background shape
  const addShape = () => {
    const newShape = {
      id: nextShapeId,
      label: `Shape ${nextShapeId}`,
      x: 50,
      y: 50,
      width: 200,
      height: 100,
      color: '#e5e7eb'
    };
    setBackgroundShapes([...backgroundShapes, newShape]);
    setNextShapeId(nextShapeId + 1);
    setSelectedShape(newShape.id);
    setIsLayoutDirty(true); // 🆕 Layout change
  };

  // Delete background shape
  const deleteBackgroundShape = (id) => {
    setBackgroundShapes(backgroundShapes.filter(shape => shape.id !== id));
    if (selectedShape === id) setSelectedShape(null);
    setIsLayoutDirty(true); // 🆕 Layout change
  };

  // Update background shape property
  const updateBackgroundShape = (id, property, value) => {
    setBackgroundShapes(backgroundShapes.map(shape =>
      shape.id === id ? { ...shape, [property]: value } : shape
    ));
    setIsLayoutDirty(true); // 🆕 Layout change
  };

  // Handle shape drag end
  const handleShapeDragEnd = (id, newPos) => {
    setBackgroundShapes(backgroundShapes.map(shape =>
      shape.id === id ? { ...shape, x: newPos.x, y: newPos.y } : shape
    ));
    setIsLayoutDirty(true); // 🆕 Layout change
    // 🛡️ Selection persists (User Request)
  };

  // Handle shape update
  const handleShapeUpdate = (id, updates) => {
    setBackgroundShapes(backgroundShapes.map(shape =>
      shape.id === id ? { ...shape, ...updates } : shape
    ));
    setIsLayoutDirty(true); // 🆕 Layout change
  };

  // Move background shape
  const moveShape = (id, direction) => {
    const step = 5;
    setBackgroundShapes(prev => prev.map(shape => {
      if (shape.id !== id) return shape;
      switch (direction) {
        case 'up': return { ...shape, y: shape.y - step };
        case 'down': return { ...shape, y: shape.y + step };
        case 'left': return { ...shape, x: shape.x - step };
        case 'right': return { ...shape, x: shape.x + step };
        default: return shape;
      }
    }));
  };




  // ==================== SECTION FUNCTIONS ====================

  // Handle section drag start (Initialize Physics)
  const handleSectionDragStart = (id) => {
    if (!isPhysicsEnabled) return;

    if (physicsManager.current) {
      physicsManager.current.destroy();
    }

    const allSections = Object.entries(sectionPositions).filter(([name]) => sectionVisibility[name]);
    physicsManager.current = new PhysicsPushingManager(
      allSections,
      sectionSnapshots,
      sectionWidths,
      sectionHeights
    );
  };

  // Handle section drag end
  const handleSectionDragEnd = (sectionName, newPos, allPositions) => {
    if (allPositions) {
      // 🚀 Batch Update for Collision Physics
      setSectionPositions(prev => ({
        ...prev,
        ...allPositions
      }));
      // Batch update linked lines
      Object.entries(allPositions).forEach(([name, pos]) => {
        updateLinkedLines(name, pos);
      });
    } else {
      setSectionPositions(prev => ({
        ...prev,
        [sectionName]: newPos
      }));
      updateLinkedLines(sectionName, newPos);
    }
    setIsLayoutDirty(true); // 🆕 Layout change
    // 🛡️ Selection persists (User Request)
  };

  const moveSection = (sectionName, direction) => {
    const step = 2;
    setSectionPositions(prev => {
      const pos = prev[sectionName] || { x: 0, y: 0 };
      let newPos = { ...pos };
      switch (direction) {
        case 'up': newPos.y -= step; break;
        case 'down': newPos.y += step; break;
        case 'left': newPos.x -= step; break;
        case 'right': newPos.x += step; break;
      }
      updateLinkedLines(sectionName, newPos);
      return { ...prev, [sectionName]: newPos };
    });
  };

  const updateLinkedLines = (sectionName, newPos, newWidth) => {
    // 🚀 We always update linked lines to follow sections, but the 'Sync' toggle 
    // now specifically controls whether we force the default 22px position.
    setLines(prevLines => prevLines.map(line => {
      if (line.isSectionDivider === sectionName) {
        const width = newWidth ? Math.min(parseInt(newWidth) || 575, 575) : Math.abs(line.x2 - line.x1);

        // 🧠 If Sync is ON, we force the default 22px offset.
        // 🧠 If Sync is OFF, we use the custom offsetY (falls back to 22 if none set).
        const offsetY = isDividerSyncEnabled ? 22 : (line.offsetY !== undefined ? line.offsetY : 22);

        return {
          ...line,
          x1: newPos.x,
          y1: newPos.y + offsetY,
          x2: newPos.x + width,
          y2: newPos.y + offsetY,
          offsetY: offsetY
        };
      }
      return line;
    }));
  };

  const updateGlobalSectionDividers = (updates) => {
    const sections = ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'];

    setStyleConfig(prev => {
      const currentGlobal = prev.globalSectionDividers || { enabled: false, thickness: 2, color: '#000000' };
      const globalConfig = { ...currentGlobal, ...updates };

      // Update styleConfig state
      const newConfig = {
        ...prev,
        globalSectionDividers: globalConfig
      };

      // Handle actual line objects in lines array
      if (updates.enabled === true || (globalConfig.enabled && (updates.thickness !== undefined || updates.color !== undefined))) {
        // We need to sync/add lines
        setLines(currentLines => {
          let newLines = [...currentLines];
          let localNextId = nextLineId;

          sections.forEach(section => {
            const existingLineIndex = newLines.findIndex(l => l.isSectionDivider === section);
            const pos = sectionPositions[section];
            const widthStr = sectionWidths[section] || "560px";
            const width = parseInt(widthStr) || 560;

            if (pos) {
              if (existingLineIndex > -1) {
                // Update existing
                const existingLine = newLines[existingLineIndex];
                // 🧠 Respect the sync toggle even when global styles are applied
                const offsetY = isDividerSyncEnabled ? 22 : (existingLine.offsetY !== undefined ? existingLine.offsetY : 22);
                newLines[existingLineIndex] = {
                  ...existingLine,
                  thickness: globalConfig.thickness,
                  color: globalConfig.color,
                  x1: pos.x,
                  y1: pos.y + offsetY,
                  x2: pos.x + width,
                  y2: pos.y + offsetY,
                  offsetY: offsetY
                };
              } else {
                // Add new
                newLines.push({
                  id: localNextId++,
                  label: `${section.charAt(0).toUpperCase() + section.slice(1)} Divider`,
                  orientation: 'horizontal',
                  x1: pos.x,
                  y1: pos.y + 22,
                  x2: pos.x + width,
                  y2: pos.y + 22,
                  thickness: globalConfig.thickness,
                  color: globalConfig.color,
                  isSectionDivider: section,
                  offsetY: 22
                });
              }
            }
          });
          setNextLineId(localNextId);
          return newLines;
        });
      } else if (updates.enabled === false) {
        // Remove all section divider lines
        setLines(currentLines => currentLines.filter(l => !l.isSectionDivider));
      }

      return newConfig;
    });
  };


  // Handle section transform - COMPLETE VERSION
  const handleSectionTransform = (sectionName, newAttrs) => {
    console.log('Transform:', sectionName, newAttrs); // Debug log

    setSectionPositions(prev => ({
      ...prev,
      [sectionName]: {
        x: newAttrs.x,
        y: newAttrs.y
      }
    }));
    updateLinkedLines(sectionName, { x: newAttrs.x, y: newAttrs.y }, newAttrs.width);

    // Update WIDTH
    if (newAttrs.width) {
      const clampedWidth = Math.min(Math.round(newAttrs.width), 575);
      const widthPx = `${clampedWidth}px`;

      setSectionWidths(prev => ({
        ...prev,
        [sectionName]: widthPx
      }));

      setStyleConfig(prev => ({
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          container: {
            ...prev[sectionName]?.container,
            width: widthPx
          }
        }
      }));
    }

    // Update HEIGHT
    if (newAttrs.height) {
      const heightPx = `${Math.round(newAttrs.height)}px`;

      setSectionHeights(prev => ({
        ...prev,
        [sectionName]: heightPx
      }));

      setStyleConfig(prev => ({
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          container: {
            ...prev[sectionName]?.container,
            height: heightPx
          }
        }
      }));
    }
    setIsLayoutDirty(true); // 🆕 Layout change
  };

  // Auto-flow sections - Header Aligned & Height Managed
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
        const height = sectionSnapshots[name]?.height || sectionHeights[name] || 150;
        currentY += height + spacing;
        return;
      }

      const snapshot = sectionSnapshots[name];
      const height = snapshot ? snapshot.height : (parseInt(sectionHeights[name]) || 100);

      // 🎯 Auto-Align on X cross header
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
    // Batch update linked lines
    Object.entries(newPositions).forEach(([name, pos]) => {
      updateLinkedLines(name, pos);
    });
    console.log("🚀 Auto-flow complete: aligned items to X:", headerX);
  };




  // ==================== USE EFFECTS ====================

  // Initialize template components


  useEffect(() => {
    if (!TemplateComponents || !resumeData) return;

    const renderSectionData = async (sectionName) => {
      const ref = sectionRefs.current[sectionName];
      if (!ref?.current) {
        // console.warn(`No ref found for ${sectionName}`);
        return;
      }

      const element = ref.current;

      // 🧠 SMART SNAPSHOT LOGIC
      // Check if safely initialized
      if (!prevStyleConfigRef || !prevStyleConfigRef.current) return;

      const currentStyle = styleConfig[sectionName] || {};
      const prevStyle = prevStyleConfigRef.current[sectionName] || {};

      // 🎯 FORCE RE-CAPTURE ON GLOBAL STYLE CHANGES
      // Global changes affect the rendering even if the section style object itself is unchanged
      const globalStylesChanged =
        prevStyleConfigRef.current.globalFontFamily !== styleConfig.globalFontFamily ||
        prevStyleConfigRef.current.globalTitleColor !== styleConfig.globalTitleColor ||
        prevStyleConfigRef.current.globalSubtitleColor !== styleConfig.globalSubtitleColor ||
        prevStyleConfigRef.current.globalTextColor !== styleConfig.globalTextColor ||
        prevStyleConfigRef.current.globalBulletColor !== styleConfig.globalBulletColor ||
        prevStyleConfigRef.current.globalBulletTop !== styleConfig.globalBulletTop ||
        prevStyleConfigRef.current.globalPrimaryColor !== styleConfig.globalPrimaryColor;

      // Always capture if no snapshot exists
      const hasSnapshot = !!sectionSnapshots[sectionName];

      // Use the static method from Engine 4
      const needsCapture = !hasSnapshot || globalStylesChanged || GeometrySnapshot.shouldReCapture(prevStyle, currentStyle);

      if (!needsCapture) {
        // Styles are identical or only layout changed (x/y), which Pixi handles directly via props
        return;
      }

      const captureStart = performance.now();
      try {
        // 🚀 DELAY CAPTURE: Wait for font rendering & DOM layout to settle
        await new Promise(resolve => setTimeout(resolve, 50));
        await document.fonts.ready;

        // Force layout recalculation
        element.offsetHeight; // Trigger reflow

        // 1. CAPTURE FOR WEBGL (Geometry Snapshot)
        console.log(`📸 [SMART-CAPTURE] Capturing ${sectionName} (${globalStylesChanged ? 'Global Style Change' : 'Visual Update'})`);
        const scanner = new GeometrySnapshot();
        const snapshot = await scanner.capture(element);

        const duration = performance.now() - captureStart;
        console.log(`⏱️ [SMART-CAPTURE] ${sectionName} captured in ${duration.toFixed(2)}ms`);

        setSectionSnapshots(prev => ({ ...prev, [sectionName]: snapshot }));
      } catch (error) {
        console.error(`Error rendering ${sectionName}:`, error);
      }
    };

    // Render all sections in parallel
    const renderAllSections = async () => {
      const startTime = performance.now();
      console.log('🏁 [RENDER-CYCLE] Starting Full DOM Capture...');

      const sections = Object.keys(sectionRefs.current);
      await Promise.all(sections.map(sectionName => renderSectionData(sectionName)));

      const totalTime = performance.now() - startTime;
      console.log(`🏆 [RENDER-CYCLE] Full DOM Capture Complete. Total Time: ${totalTime.toFixed(2)}ms`);

      // Update the partial ref for next comparison
      prevStyleConfigRef.current = JSON.parse(JSON.stringify(styleConfig));
    };

    const timer = setTimeout(() => {
      renderAllSections();
    }, 0);

    return () => clearTimeout(timer);
  }, [
    TemplateComponents,
    styleConfig,
    resumeData,
    sectionWidths,
    sectionHeights,
    customSections,
  ]);



  // 🎯 REACTIVE AUTO-FLOW: Trigger on content change
  useEffect(() => {
    // 🛡️ User Request: Disable auto-flow for multi-column templates based on Config ID/Type
    // We check both 'type' (new) and 'id' (legacy/specific) to be safe
    if (styleConfig.type === 'multi-column' || styleConfig.id === 'two-column-professional') return;

    if (isAutoFlowEnabled && Object.keys(sectionSnapshots).length > 0) {
      autoFlowSections();
    }
  }, [sectionSnapshots, resumeData, isAutoFlowEnabled, styleConfig.type, styleConfig.id]);

  // 🎨 BOUNCE ANIMATION: Animate sections when isAnimating is true
  useEffect(() => {
    if (!isAnimating) return;

    const sectionNames = Object.keys(sectionPositions);
    const originalPositions = { ...sectionPositions };
    const startTime = Date.now();
    const duration = 2500; // 2.5 seconds

    // Physics props per section
    const physicsProps = {};
    Object.keys(sectionPositions).forEach(k => {
      physicsProps[k] = {
        s: 0.5 + Math.random() * 1.0,   // speed: SLOWER (0.5x to 1.5x)
        a: 15 + Math.random() * 25,     // amplitude: GENTLER (15px to 40px)
        p: Math.random() * Math.PI * 2  // phase: Random start
      };
    });

    let animationFrame;

    const animate = () => {
      const elapsed = Date.now() - startTime;

      setSectionPositions(prev => {
        const updated = {};
        sectionNames.forEach(name => {
          const P = physicsProps[name] || { s: 4, a: 50, p: 0 };
          // Infinite loop (no decay)
          const timeSec = elapsed / 1000;
          const yOffset = Math.sin((timeSec * Math.PI * P.s) + P.p) * P.a;

          updated[name] = {
            x: originalPositions[name].x,
            y: originalPositions[name].y + yOffset
          };
        });
        return updated;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      setSectionPositions(originalPositions);
    };
  }, [isAnimating]);

  // 🔄 Sync positions from ResumeEditorv3 when savedStyleConfig changes
  useEffect(() => {
    console.log('🔍 [Position Sync] useEffect triggered', {
      hasSavedStyleConfig: !!savedStyleConfig,
      savedStyleConfig: savedStyleConfig
    });

    if (!savedStyleConfig) {
      console.log('⚠️ [Position Sync] No savedStyleConfig in Redux');
      return;
    }

    console.log('🔄 [Position Sync] Syncing from ResumeEditorv3:', {
      hasPositions: !!savedStyleConfig.positions,
      positionsCount: savedStyleConfig.positions ? Object.keys(savedStyleConfig.positions).length : 0,
      hasLines: !!savedStyleConfig.lines,
      linesCount: savedStyleConfig.lines ? savedStyleConfig.lines.length : 0,
      hasShapes: !!savedStyleConfig.shapes,
      shapesCount: savedStyleConfig.shapes ? savedStyleConfig.shapes.length : 0
    });

    // Update positions if they exist in savedStyleConfig
    if (savedStyleConfig.positions && Object.keys(savedStyleConfig.positions).length > 0) {
      console.log('✅ [Position Sync] Updating section positions:', savedStyleConfig.positions);
      setSectionPositions(prev => {
        const updated = {
          ...prev,
          ...savedStyleConfig.positions
        };
        console.log('📍 [Position Sync] New positions:', updated);
        return updated;
      });
    }

    // Update lines if they exist
    if (savedStyleConfig.lines && Array.isArray(savedStyleConfig.lines)) {
      console.log('✅ [Position Sync] Updating lines:', savedStyleConfig.lines.length);
      setLines(savedStyleConfig.lines);
      if (savedStyleConfig.lines.length > 0) {
        setNextLineId(Math.max(...savedStyleConfig.lines.map(l => l.id)) + 1);
      }
    }

    // Update shapes if they exist
    if (savedStyleConfig.shapes && Array.isArray(savedStyleConfig.shapes)) {
      console.log('✅ [Position Sync] Updating shapes:', savedStyleConfig.shapes.length);
      setBackgroundShapes(savedStyleConfig.shapes);
      if (savedStyleConfig.shapes.length > 0) {
        setNextShapeId(Math.max(...savedStyleConfig.shapes.map(s => s.id)) + 1);
      }
    }
  }, [savedStyleConfig]);

  // 🔄 SYNC TO GLOBAL REDUX: Keep currentResume updated for ResumeEditorv3
  useEffect(() => {
    if (!resumeData) return;

    const updatedResume = {
      ...resumeData,
      styleConfig: {
        ...styleConfig,
        positions: sectionPositions,
        lines: lines,
        shapes: backgroundShapes,
      }
    };

    const updatedResumeStr = JSON.stringify(updatedResume);
    const currentResumeStr = JSON.stringify(currentResume);

    // Check if data actually changed to avoid redundant dispatches
    if (updatedResumeStr !== currentResumeStr) {
      lastDispatchedRef.current = updatedResumeStr; // 🛡️ Mark as our own change
      dispatch(setCurrentResume(updatedResume));
      console.log("🔄 Global currentResume synced from b3.jsx");
    }
  }, [resumeData, styleConfig, sectionPositions, lines, backgroundShapes, dispatch, currentResume]);

  // Initialize layout on mount
  useEffect(() => {
    // 🛡️ Don't reset if we have saved positions from ResumeEditorv3
    if (savedStyleConfig && savedStyleConfig.positions && Object.keys(savedStyleConfig.positions).length > 0) {
      console.log('⏭️ Skipping layout reset - using saved positions from ResumeEditorv3');
      return;
    }

    console.log('Initial layout reset');
    resetLayout();
  }, [currentTemplateName, savedStyleConfig]);

  // Calculate page elements
  // Calculate page elements - Optimized with Memo
  const page1Elements = useMemo(() => getElementsForPage(1), [sectionPositions, lines, backgroundShapes, sectionHeights, sectionSnapshots]);
  const page2Elements = useMemo(() => showPage2 ? getElementsForPage(2) : { sections: [], lines: [], shapes: [] }, [showPage2, sectionPositions, lines, backgroundShapes, sectionHeights, sectionSnapshots]);




  // ==================== JSX RETURN ====================

  return (
    <div className="editor-container">

      {/* Hidden rendering area */}
      <div className="hidden-render" style={{
        position: 'fixed',
        left: '-10000px', // 🚀 Move off-screen
        top: '0',
        visibility: 'hidden',
        opacity: 0, // 🚀 Addition
        pointerEvents: 'none', // 🚀 Addition
        width: '400px',
        height: '560px',
        background: 'white',
        zIndex: -1, // 🚀 Move behind everything
        overflowY: 'auto',
        maxWidth: 'none',
        fontFamily: styleConfig.globalFontFamily || 'Helvetica',
        color: styleConfig.globalTextColor || '#000000',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', background: '#3b82f6', color: 'white', padding: '4px 8px', fontSize: '10px', fontWeight: 'bold' }}>
          🛠️ LIVE DOM RENDER (Snapshot Source)
        </div>
        {Object.entries(sectionRefs.current).map(([key, ref]) => {
          let Component = TemplateComponents ? TemplateComponents[key] : null;
          let isCustom = key.startsWith('custom-');

          if (isCustom) {
            Component = FlexibleCustomSection;
          }

          if (!Component) return null;

          // 🚀 DIRECT PASS: Always use the local styleConfig for the hidden render
          const renderConfig = styleConfig;

          // Map data according to your FlexibleSection component props
          const propsMap = {
            header: { resumeDetails: resumeData?.resumeDetails, styleConfig: renderConfig },
            contact: { resumeDetails: resumeData?.resumeDetails, styleConfig: renderConfig },
            summary: { summary: resumeData?.resumeDetails?.summary, styleConfig: renderConfig },
            skills: { skills: resumeData?.skills, styleConfig: renderConfig },
            experience: { experiences: resumeData?.experiences, styleConfig: renderConfig },
            projects: { projects: resumeData?.projects, styleConfig: renderConfig },
            education: { educationList: resumeData?.educationList, styleConfig: renderConfig },
            certifications: { certifications: resumeData?.certifications, styleConfig: renderConfig }
          };

          if (isCustom) {
            const actualId = key.replace('custom-', '');
            // Support both string and number comparison just in case
            const sectionData = customSections.find(s => String(s.id) === String(actualId));
            if (!sectionData) return null;
            propsMap[key] = {
              customSections: [sectionData],
              styleConfig: renderConfig
            };
          }

          // 🛡️ Hide empty sections to prevent title rendering
          if (!sectionVisibility[key]) return null;

          let isEmpty = false;
          if (isCustom) {
            isEmpty = false; // We already checked for sectionData above
          } else {
            if (key === 'summary') isEmpty = !resumeData?.resumeDetails?.summary || resumeData.resumeDetails.summary.trim() === '';
            else if (key === 'skills') isEmpty = !resumeData?.skills || resumeData.skills.length === 0;
            else if (key === 'experience') isEmpty = !resumeData?.experiences || resumeData.experiences.length === 0;
            else if (key === 'projects') isEmpty = !resumeData?.projects || resumeData.projects.length === 0;
            else if (key === 'education') isEmpty = !resumeData?.educationList || resumeData.educationList.length === 0;
            else if (key === 'certifications') isEmpty = !resumeData?.certifications || resumeData.certifications.length === 0;
          }

          if (isEmpty) return null;

          return (
            <div
              key={key}
              ref={ref}
              data-section={key}
              style={{
                width: renderConfig[key]?.container?.width || (isCustom ? (renderConfig.custom?.container?.width || '515px') : 'auto'),
                height: renderConfig[key]?.container?.height || 'auto',
                minHeight: renderConfig[key]?.container?.height || 'auto',
                maxHeight: renderConfig[key]?.container?.height || 'none',
                overflow: 'visible',
                boxSizing: 'border-box',
                position: 'relative',
                minWidth: 0,
                maxWidth: 'none',
              }}>
              <Component {...propsMap[key]} />
            </div>
          );
        })}
      </div>



      {/* LEFT PANEL - Section Controls */}
      <div className="left-panel">
        {/* --- GROUP 1: TEMPLATE & ACTIONS --- */}
        {!isMobile && <h3 className="panel-title">TEMPLATE & ACTIONS</h3>}

        {TEMPLATES && Object.keys(TEMPLATES).length > 0 && (
          <div className="control-group">
            <label className="control-label">Choose Template</label>
            <select
              value={currentTemplateName}
              onChange={(e) => handleTemplateSwitch(e.target.value)}
              className="control-select"
            >
              {Object.keys(TEMPLATES).map(key => (
                <option key={key} value={key}>
                  {TEMPLATES[key].name || key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
            {backupConfig && (
              <button
                onClick={handleRestoreBackup}
                className="btn-secondary full-width"
                style={{
                  marginTop: '10px',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fcd34d',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                ⏪ RESTORE PREVIOUS CONFIG
              </button>
            )}
            {resumeId && (
              <div style={{
                marginTop: '8px',
                padding: '6px',
                backgroundColor: '#ecfdf5',
                color: '#047857',
                borderRadius: '4px',
                fontSize: '12px',
                border: '1px solid #a7f3d0',
                textAlign: 'center'
              }}>
                ✨ Custom Template Active
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {/* Mobile PDF Quality Warning */}
          {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              borderRadius: '6px',
              fontSize: '11px',
              border: '1px solid #fcd34d',
              lineHeight: '1.5',
              marginBottom: '8px'
            }}>
              <div style={{ fontWeight: '700', marginBottom: '4px', fontSize: '12px' }}>⚠️ Mobile Export Notice</div>
              <div>PDF exports may have minor visual artifacts on mobile devices. For best quality, please use a desktop/laptop computer.</div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Hide PNG download on mobile - it's broken */}
            {!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) && (
              <button onClick={downloadResume} className="btn-secondary full-width" style={{ backgroundColor: 'white', color: '#1f2937' }}>📥 DOWNLOAD PNG</button>
            )}
            <button onClick={downloadPDF} className="btn-secondary full-width" style={{ backgroundColor: 'white', color: '#1f2937' }}>📄 DOWNLOAD PDF</button>
          </div>
          <button
            onClick={handleSaveAll}
            className="btn-primary full-width"
            style={{ backgroundColor: 'white', color: '#1f2937', border: '1px solid #e5e7eb' }}
            disabled={saving}
          >
            {saving ? 'SAVING...' : (resumeId ? '💾 UPDATE TEMPLATE' : '💾 SAVE TEMPLATE')}
          </button>
          <button onClick={resetLayout} className="btn-primary full-width">
            ↻ RESET LAYOUT
          </button>
        </div>


        {/* --- GROUP 2: GLOBAL STYLES --- */}
        <h3 className="panel-title">GLOBAL STYLES</h3>
        <div className="control-group" style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>

          {/* FONT SELECTOR */}
          <div style={{ marginBottom: '15px' }}>
            <label className="control-label">Resume Font (ATS Friendly)</label>
            <select
              value={styleConfig.globalFontFamily || 'Helvetica'}
              onChange={(e) => handleGlobalStyleChange('globalFontFamily', e.target.value)}
              className="control-select"
              style={{
                fontFamily: styleConfig.globalFontFamily || 'inherit',
                fontWeight: '600',
                fontSize: '14px',
                height: '40px'
              }}
            >
              <option value="Arial">Arial (Standard)</option>
              <option value="Helvetica">Helvetica (Classic)</option>
              <option value="Times New Roman">Times New Roman (Serif)</option>
              <option value="Georgia">Georgia (Professional Serif)</option>
              <option value="Calibri">Calibri (Modern)</option>
              <option value="Verdana">Verdana (Clear Sans)</option>
              <option value="Tahoma">Tahoma (Compact)</option>
              <option value="Roboto">Roboto (Clean)</option>
              <option value="Inter">Inter (Premium)</option>
            </select>
          </div>

          {/* COLOR PICKER - BULLET ONLY */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
            <div>
              <label className="control-label" style={{ fontSize: '10px' }}>Bullet Color</label>
              <input
                type="color"
                value={normalizeColorForInput(styleConfig.globalBulletColor || styleConfig.globalPrimaryColor || '#000000')}
                onChange={(e) => handleGlobalStyleChange('globalBulletColor', e.target.value)}
                className="control-color"
                style={{ width: '100%', height: '30px', padding: '2px' }}
              />
            </div>
          </div>

          {/* BULLET STYLE SELECTOR */}
          <div style={{ marginTop: '10px' }}>
            <label className="control-label" style={{ fontSize: '10px' }}>Bullet Shape</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '4px' }}>
              {['•', '◦', '▪', '▫', '★', '➜', '–', '✓'].map(char => (
                <button
                  key={char}
                  onClick={() => handleGlobalStyleChange('globalBulletChar', char)}
                  className={`btn-secondary ${styleConfig.globalBulletChar === char ? 'active' : ''}`}
                  style={{
                    padding: '4px',
                    fontSize: '14px',
                    border: styleConfig.globalBulletChar === char ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                    background: styleConfig.globalBulletChar === char ? '#eff6ff' : 'white'
                  }}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <label className="control-label" style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
              Bullet Vertical Offset <span>{styleConfig.globalBulletTop || 0}px</span>
            </label>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={styleConfig.globalBulletTop || 0}
              onChange={(e) => handleGlobalStyleChange('globalBulletTop', e.target.value)}
              style={{ width: '100%', accentColor: '#3b82f6' }}
            />
          </div>

          <p style={{ fontSize: '10px', color: '#6b7280', marginTop: '10px', fontStyle: 'italic', lineHeight: '1.4' }}>
            ℹ️ These global settings override template defaults for a consistent look.
          </p>
        </div>


        {/* --- GROUP 3: FLOW & SMART FEATURES --- */}
        <h3 className="panel-title">SMART FEATURES</h3>

        <div className="flow-action" style={{ marginBottom: '15px' }}>
          <button
            onClick={() => setIsAutoFlowEnabled(!isAutoFlowEnabled)}
            className={`btn-primary full-width btn-auto-flow-action ${isAutoFlowEnabled ? 'active' : ''}`}
          >
            {isAutoFlowEnabled ? 'Auto-Flow: ON (Header Aligned)' : 'Auto-Flow: OFF'}
          </button>

          <button
            onClick={() => {
              const newState = !isMagneticEnabled;
              setIsMagneticEnabled(newState);
              if (newState) {
                setIsAnimationsEnabled(false); // 🚀 Turning on Magnet turns OFF Physics
                setIsPhysicsEnabled(false);
              }
            }}
            className={`btn-primary full-width btn-auto-flow-action ${isMagneticEnabled ? 'active' : ''}`}
            style={{
              marginTop: '10px',
              backgroundColor: isMagneticEnabled ? '#e0f2fe' : 'white',
              color: isMagneticEnabled ? '#0369a1' : '#1f2937',
              borderColor: isMagneticEnabled ? '#7dd3fc' : '#e5e7eb'
            }}
          >
            {isMagneticEnabled ? '🧲 Magnetic Flow: ON' : '🧲 Magnetic Flow: OFF'}
          </button>

          <button
            onClick={() => setIsDividerSyncEnabled(!isDividerSyncEnabled)}
            className={`btn-primary full-width btn-auto-flow-action ${isDividerSyncEnabled ? 'active' : ''}`}
            style={{
              marginTop: '10px',
              backgroundColor: isDividerSyncEnabled ? '#ecfdf5' : 'white',
              color: isDividerSyncEnabled ? '#047857' : '#1f2937',
              borderColor: isDividerSyncEnabled ? '#a7f3d0' : '#e5e7eb',
              fontWeight: '700'
            }}
          >
            {isDividerSyncEnabled ? '📏 Divider Auto-Sync: ON' : '📏 Divider Auto-Sync: OFF'}
          </button>
        </div>

        <div className="control-group" style={{ marginBottom: '20px' }}>
          <button
            onClick={() => {
              const newState = !isAnimationsEnabled;
              setIsAnimationsEnabled(newState);
              setIsPhysicsEnabled(newState);
              if (newState) setIsMagneticEnabled(false); // 🚀 Turning on Physics turns OFF Magnet
            }}
            className={`btn-primary full-width ${isAnimationsEnabled ? 'active' : ''}`}
            style={{
              background: isAnimationsEnabled ? '#fef3c7' : '#f3f4f6',
              color: isAnimationsEnabled ? '#92400e' : '#6b7280',
              borderColor: isAnimationsEnabled ? '#fbbf24' : '#e5e7eb',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isAnimationsEnabled ? '✨ EFFECTS: ON' : '✨ EFFECTS: OFF'}
          </button>
        </div>

        {/* --- GROUP 4: RECOVERY --- */}
        <h3 className="panel-title">RECOVERY</h3>
        <div className="control-group" style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setWebglResetKey(prev => prev + 1)}
            className="btn-primary full-width"
            style={{
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderColor: '#fecaca',
              fontWeight: '600'
            }}
          >
            🔄 RESTART WEBGL ENGINE
          </button>
          <p style={{ fontSize: '10px', color: '#6b7280', marginTop: '6px', fontStyle: 'italic', textAlign: 'center' }}>
            Use if preview disappears or freezes
          </p>
        </div>

        {/* --- ACCORDION SECTIONS --- */}



        {/* SECTION SIZES & POSITIONS SECTION */}
        <h3 className="panel-title">Section Layouts</h3>
        <div className="section-widths-container" style={{ marginBottom: '20px' }}>
          {Object.keys(sectionWidths).map(sectionName => {
            const isTransparent = styleConfig[sectionName]?.container?.backgroundColor === 'transparent';
            const position = sectionPositions[sectionName] || { x: 0, y: 0 };
            const isOnPage2 = position.y >= 800;
            const isOpen = activeSectionAccordion === sectionName;

            return (
              <div key={sectionName} className={`sub-accordion-item ${isOpen ? 'active' : ''}`}>
                <div
                  className="sub-accordion-trigger"
                  onClick={() => setActiveSectionAccordion(isOpen ? null : sectionName)}
                >
                  <span className="section-name" style={{
                    color: sectionName.startsWith('custom-') ? '#9333ea' : 'inherit',
                    fontWeight: sectionName.startsWith('custom-') ? 'bold' : 'normal'
                  }}>
                    {sectionName.startsWith('custom-')
                      ? (customSections.find(s => `custom-${s.id}` === sectionName)?.title || sectionName)
                      : sectionName}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

                    {/* 👁️ VISIBILITY TOGGLE */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSectionVisibility(prev => ({
                          ...prev,
                          [sectionName]: !prev[sectionName]
                        }));
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '2px',
                        opacity: sectionVisibility[sectionName] ? 1 : 0.4
                      }}
                      title={sectionVisibility[sectionName] ? "Hide Section" : "Show Section"}
                    >
                      {sectionVisibility[sectionName] ? '👁️' : '🚫'}
                    </button>

                    {isTransparent && <span className="badge-mini">T</span>}
                    {isOnPage2 && <span className="badge-mini blue">P2</span>}
                    <span className="arrow">{isOpen ? '▼' : '▶'}</span>
                  </div>
                </div>

                <div className={`sub-accordion-content ${isOpen ? 'expanded' : ''}`}>
                  <div className="position-controls-wrapper">

                    {/* HEADER LAYOUTS (Embedded) */}
                    {sectionName === 'header' && (
                      <div style={{ marginBottom: '16px' }}>
                        <label className="control-label-small" style={{ marginBottom: '8px', display: 'block' }}>Header Style</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                          {HEADER_LAYOUTS && Object.entries(HEADER_LAYOUTS).map(([key, layout]) => (
                            <button
                              key={key}
                              onClick={() => setStyleConfig(prev => ({
                                ...prev,
                                header: {
                                  ...prev.header,
                                  ...layout.config,
                                  nameStyle: { ...prev.header?.nameStyle, ...layout.config.nameStyle },
                                  titleStyle: { ...prev.header?.titleStyle, ...layout.config.titleStyle }
                                }
                              }))}
                              className={`btn-secondary ${isAnimationsEnabled ? 'animate-btn-spring' : ''}`}
                              style={{
                                fontSize: '10px',
                                padding: '6px',
                                border: styleConfig.header?.nameAlign === layout.config.nameAlign ? '2px solid #3b82f6' : '1px solid #ddd'
                              }}
                            >
                              {layout.label}
                            </button>
                          ))}
                        </div>

                        {/* CONTACT LAYOUTS (Restored) */}
                        <label className="control-label-small" style={{ marginBottom: '8px', display: 'block', marginTop: '12px' }}>Contact Style</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                          {CONTACT_LAYOUTS && Object.entries(CONTACT_LAYOUTS).map(([key, layout]) => (
                            <button
                              key={key}
                              onClick={() => setStyleConfig(prev => ({
                                ...prev,
                                header: {
                                  ...prev.header,
                                  ...layout.config
                                }
                              }))}
                              className={`btn-secondary ${isAnimationsEnabled ? 'animate-btn-spring' : ''}`}
                              style={{
                                fontSize: '10px',
                                padding: '6px',
                                border: (styleConfig.header?.contactLayout?.display === layout.config.contactLayout?.display &&
                                  styleConfig.header?.contactLayout?.flexDirection === layout.config.contactLayout?.flexDirection)
                                  ? '2px solid #3b82f6' : '1px solid #ddd'
                              }}
                            >
                              {layout.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SKILLS LAYOUTS (Embedded) */}
                    {sectionName === 'skills' && (
                      <div style={{ marginBottom: '16px' }}>
                        <label className="control-label-small" style={{ marginBottom: '8px', display: 'block' }}>Skills Layout</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          {SKILLS_LAYOUTS && Object.entries(SKILLS_LAYOUTS).map(([key, layout]) => (
                            <button
                              key={key}
                              onClick={() => setStyleConfig(prev => ({
                                ...prev,
                                skills: { ...prev.skills, ...layout.config }
                              }))}
                              className="btn-secondary"
                              style={{
                                fontSize: '10px',
                                padding: '6px',
                                border: styleConfig.skills?.categoryValueSeparator === layout.config.categoryValueSeparator ? '2px solid #3b82f6' : '1px solid #ddd'
                              }}
                            >
                              {layout.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>


                </div>

              </div>

            );
          })}
        </div>

        {/* BACKGROUND ZONES SECTION */}
        <h3 className="panel-title">BACKGROUND ZONES</h3>
        <div style={{ marginBottom: '20px' }}>
          {/* ANIMATION TEST BUTTON */}
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className={`btn-primary full-width ${isAnimating ? 'active-anim' : ''}`}
            style={{ marginBottom: '10px', backgroundColor: isAnimating ? '#ef4444' : '#8b5cf6' }}
          >
            {isAnimating ? '⏹ STOP BOUNCE ANIMATION' : '▶ TEST BOUNCE ANIMATION'}
          </button>

          <button onClick={addShape} className="btn-primary full-width">
            + ADD BACKGROUND SHAPE
          </button>

          {backgroundShapes.length > 0 && backgroundShapes.map(shape => (
            <div key={shape.id} className={`shape-control ${selectedShape === shape.id ? 'selected' : ''}`}>
              <div className="line-header">
                <span className="line-label">{shape.label}</span>
                <button onClick={() => deleteBackgroundShape(shape.id)} className="btn-delete">✕</button>
              </div>

              <div className="line-move-control" style={{ marginTop: '12px' }}>
                <label className="control-label">Nudge Position</label>
                <div className="arrow-grid">
                  <div></div>
                  <button onClick={() => moveShape(shape.id, 'up')} className="btn-arrow">↑</button>
                  <div></div>
                  <button onClick={() => moveShape(shape.id, 'left')} className="btn-arrow">←</button>
                  <div className="arrow-center">MOVE</div>
                  <button onClick={() => moveShape(shape.id, 'right')} className="btn-arrow">→</button>
                  <div></div>
                  <button onClick={() => moveShape(shape.id, 'down')} className="btn-arrow">↓</button>
                  <div></div>
                </div>
              </div>

              <div className="shape-properties">
                <div className="property-control">
                  <label className="control-label">X Position (px)</label>
                  <input
                    type="number"
                    value={shape.x}
                    onChange={(e) => updateBackgroundShape(shape.id, 'x', parseInt(e.target.value))}
                    className="control-input"
                  />
                </div>
                <div className="property-control">
                  <label className="control-label">Y Position (px)</label>
                  <input
                    type="number"
                    value={shape.y}
                    onChange={(e) => updateBackgroundShape(shape.id, 'y', parseInt(e.target.value))}
                    className="control-input"
                  />
                </div>
                <div className="property-control">
                  <label className="control-label">Width (px)</label>
                  <input
                    type="number"
                    value={shape.width}
                    onChange={(e) => updateBackgroundShape(shape.id, 'width', parseInt(e.target.value))}
                    className="control-input"
                  />
                </div>
                <div className="property-control">
                  <label className="control-label">Height (px)</label>
                  <input
                    type="number"
                    value={shape.height}
                    onChange={(e) => updateBackgroundShape(shape.id, 'height', parseInt(e.target.value))}
                    className="control-input"
                  />
                </div>
                <div className="property-control">
                  <label className="control-label">Color</label>
                  <input
                    type="color"
                    value={shape.color}
                    onChange={(e) => updateBackgroundShape(shape.id, 'color', e.target.value)}
                    className="control-color"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="panel-title">GLOBAL SECTION DIVIDERS</h3>
        <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="property-control" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <label className="control-label" style={{ marginBottom: 0 }}>Enable Lines</label>
            <input
              type="checkbox"
              checked={styleConfig.globalSectionDividers?.enabled || false}
              onChange={(e) => updateGlobalSectionDividers({ enabled: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>

          <div className="property-control" style={{ marginBottom: '12px' }}>
            <label className="control-label">Thickness ({styleConfig.globalSectionDividers?.thickness || 2}px)</label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={styleConfig.globalSectionDividers?.thickness || 2}
              onChange={(e) => updateGlobalSectionDividers({ thickness: parseFloat(e.target.value) })}
              className="control-input"
              style={{ padding: 0 }}
            />
          </div>

          <div className="property-control">
            <label className="control-label">Line Color</label>
            <input
              type="color"
              value={styleConfig.globalSectionDividers?.color || '#000000'}
              onChange={(e) => updateGlobalSectionDividers({ color: e.target.value })}
              className="control-color"
              style={{ height: '30px' }}
            />
          </div>
        </div>

        <h3 className="panel-title">DIVIDER LINES</h3>
        <div className="button-grid">
          <button onClick={() => addLine('horizontal')} className="btn-secondary">─ H</button>
          <button onClick={() => addLine('vertical')} className="btn-secondary">│ V</button>
        </div>

        {
          lines.length > 0 && lines.map(line => (
            <div key={line.id} className={`line-control ${selectedLine === line.id ? 'selected' : ''}`}>
              <div className="line-header">
                <span className="line-label">{line.label}</span>
                <button onClick={() => deleteLine(line.id)} className="btn-delete">✕</button>
              </div>

              <div className="line-move-control">
                <label className="control-label">Move Position</label>
                <div className="arrow-grid">
                  <div></div>
                  <button onClick={() => moveLine(line.id, 'up')} className="btn-arrow">↑</button>
                  <div></div>
                  <button onClick={() => moveLine(line.id, 'left')} className="btn-arrow">←</button>
                  <div className="arrow-center">MOVE</div>
                  <button onClick={() => moveLine(line.id, 'right')} className="btn-arrow">→</button>
                  <div></div>
                  <button onClick={() => moveLine(line.id, 'down')} className="btn-arrow">↓</button>
                  <div></div>
                </div>
              </div>

              <div className="line-resize-control">
                <label className="control-label">
                  Resize {line.orientation === 'vertical' ? 'Height' : 'Width'}
                </label>
                <div className="resize-buttons">
                  <button onClick={() => resizeLine(line.id, 'decrease')} className="btn-resize">−</button>
                  <button onClick={() => resizeLine(line.id, 'increase')} className="btn-resize">+</button>
                </div>
              </div>

              <div className="line-properties">
                <div className="property-control">
                  <label className="control-label">X Position (px)</label>
                  <input
                    type="number"
                    value={line.x1}
                    onChange={(e) => {
                      const newX1 = parseInt(e.target.value) || 0;
                      const dx = newX1 - line.x1;
                      handleLineUpdate(line.id, { x1: newX1, x2: line.x2 + dx });
                    }}
                    className="control-input"
                  />
                </div>
                <div className="property-control">
                  <label className="control-label">Y Position (px)</label>
                  <input
                    type="number"
                    value={line.y1}
                    onChange={(e) => {
                      const newY1 = parseInt(e.target.value) || 0;
                      const dy = newY1 - line.y1;
                      handleLineUpdate(line.id, { y1: newY1, y2: line.y2 + dy });
                    }}
                    className="control-input"
                  />
                </div>
                <div className="property-control">
                  <label className="control-label">
                    {line.orientation === 'horizontal' ? 'Width (px)' : 'Height (px)'}
                  </label>
                  <input
                    type="number"
                    value={line.orientation === 'horizontal' ? Math.abs(line.x2 - line.x1) : Math.abs(line.y2 - line.y1)}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      if (line.orientation === 'horizontal') {
                        handleLineUpdate(line.id, { x2: line.x1 + val });
                      } else {
                        handleLineUpdate(line.id, { y2: line.y1 + val });
                      }
                    }}
                    className="control-input"
                  />
                </div>
                <div className="property-control">
                  <label className="control-label">Thickness</label>
                  <input
                    type="number"
                    value={line.thickness}
                    onChange={(e) => updateLine(line.id, 'thickness', parseFloat(e.target.value))}
                    step="0.5"
                    className="control-input"
                  />
                </div>
                <div className="property-control">
                  <label className="control-label">Color</label>
                  <input
                    type="color"
                    value={normalizeColorForInput(line.color)}
                    onChange={(e) => updateLine(line.id, 'color', e.target.value)}
                    className="control-color"
                  />
                </div>
              </div>
            </div>
          ))
        }





      </div>


      {/* MIDDLE - Canvas */}
      < div className="canvas-container" >
        <div className="template-badge">
          {currentTemplateName === 'ats' ? '📄 ATS' : currentTemplateName === 'modern' ? '✨ MODERN' : '📑 TWO COLUMN'}
        </div>
        <div className="canvas-hint">💡 DRAG & RESIZE • Scroll to see more</div>
        <div className="canvas-scroll-wrapper">
          <div className="canvas-stack-layout">
            {/* Page 1 */}
            <div className="canvas-wrapper" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
              <WebGLStage
                key={`page1-${styleKey}-${webglResetKey}`}
                width={canvasTargetWidth}
                height={canvasTargetHeight}
                stageScale={canvasScale}
                shapes={page1Elements.shapes}
                lines={page1Elements.lines}
                sections={page1Elements.sections}
                snapshot={sectionSnapshots}
                isMagneticEnabled={isMagneticEnabled}
                physicsEnabled={isPhysicsEnabled}
                physicsManagerRef={physicsManager}
                onDragStart={(type, id) => {
                  if (type === 'section') handleSectionDragStart(id);
                }}
                onDragEnd={(type, id, pos, allPositions) => {
                  if (type === 'section') handleSectionDragEnd(id, pos, allPositions);
                  if (type === 'shape') handleShapeDragEnd(id, pos);
                  if (type === 'line') handleLineDragEnd(id, pos);
                }}
                onSelect={(type, id) => {
                  if (!type) {
                    setSelectedShape(null);
                    setSelectedLine(null);
                    setSelectedSection(null);
                    return;
                  }
                  if (type === 'shape') setSelectedShape(id);
                  if (type === 'line') setSelectedLine(id);
                  if (type === 'section') setSelectedSection(id);
                }}
                selectedId={selectedShape || selectedLine || selectedSection}
                onHeaderContainerReady={(container) => {
                  headerContainerRef.current = container;
                }}
                onSkillsContainerReady={(container) => {
                  skillsContainerRef.current = container;
                }}
                ref={webGLStageRef1}
              />
              <div className="page-number">Page 1</div>
            </div>



            {/* Page 2 */}
            <div
              className="canvas-wrapper"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                display: showPage2 ? 'block' : 'none'
              }}
            >
              <WebGLStage
                key={`page2-${styleKey}-${webglResetKey}`}
                width={canvasTargetWidth}
                height={canvasTargetHeight}
                stageScale={canvasScale}
                shapes={page2Elements.shapes}
                lines={page2Elements.lines}
                sections={page2Elements.sections}
                snapshot={sectionSnapshots}
                physicsEnabled={isPhysicsEnabled}
                physicsManagerRef={physicsManager}
                onDragStart={(type, id) => {
                  if (type === 'section') handleSectionDragStart(id);
                }}
                yOffset={842}
                onDragEnd={(type, id, pos, allPositions) => {
                  const adjustedPos = { ...pos, y: pos.y + 842 };

                  // 🚀 Apply OFFSETS to batch updates for Page 2
                  let adjustedAll = null;
                  if (allPositions) {
                    adjustedAll = {};
                    Object.keys(allPositions).forEach(k => {
                      adjustedAll[k] = {
                        x: allPositions[k].x,
                        y: allPositions[k].y + 842
                      };
                    });
                  }

                  if (type === 'section') handleSectionDragEnd(id, adjustedPos, adjustedAll);
                  if (type === 'shape') handleShapeDragEnd(id, adjustedPos);
                  if (type === 'line') {
                    handleLineDragEnd(id, {
                      ...pos,
                      y1: pos.y1 + 842,
                      y2: pos.y2 + 842
                    });
                  }
                }}
                onSelect={(type, id) => {
                  if (!type) {
                    setSelectedShape(null);
                    setSelectedLine(null);
                    setSelectedSection(null);
                    return;
                  }
                  if (type === 'shape') setSelectedShape(id);
                  if (type === 'line') setSelectedLine(id);
                  if (type === 'section') setSelectedSection(id);
                }}
                selectedId={selectedShape || selectedLine || selectedSection}
                ref={webGLStageRef2}
              />
              <div className="page-number">Page 2</div>
            </div>
          </div>
        </div>



        <div className="zoom-controls">

          <button onClick={() => setZoom(Math.max(0.3, zoom - 0.1))} className="btn-zoom">−</button>
          <span className="zoom-value">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="btn-zoom">+</button>
          <button onClick={() => setZoom(1)} className="btn-zoom-reset">100%</button>
          <button onClick={() => setZoom(0.7)} className="btn-zoom-reset">FIT</button>

          <button
            onClick={() => setShowPage2(!showPage2)}
            className={`btn-zoom-reset ${showPage2 ? 'active' : ''}`}
            style={{ marginLeft: '10px' }}
          >
            {showPage2 ? '1 PAGE' : '2 PAGES'}
          </button>
        </div>
      </div >

      {/* ======================= RIGHT PANEL START ======================= */}



      < div className="right-panel" >
        <h3 className="panel-title">QUICK STYLE</h3>

        {/* --- SECTION SELECTOR (Unified Switcher) --- */}
        <div style={{ padding: '0 12px 16px 12px', borderBottom: '1px solid #e5e7eb', marginBottom: '8px' }}>
          <label style={{ fontSize: '10px', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
            Select Section
          </label>
          <select
            value={selectedSection || ''}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedSection(val || null);
              if (val) {
                setSelectedShape(null);
                setSelectedLine(null);
              }
            }}
            className="control-select"
            style={{ width: '100%' }}
          >
            <option value="">-- No Selection --</option>
            {sectionVisibility && Object.keys(sectionVisibility).map(name => (
              <option key={name} value={name}>
                📍 {name.charAt(0).toUpperCase() + name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {
          selectedSection ? (
            <div style={{ padding: '12px' }}>
              <div style={{
                background: '#f3f4f6',
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                📝 {selectedSection.toUpperCase()}
              </div>

              {/* X/Y Position Controls - Moved from Left Panel */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div className="control-item" style={{ flex: 1 }}>
                  <label className="control-label-small" style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>X Position</label>
                  <input
                    type="number"
                    value={Math.round(sectionPositions[selectedSection]?.x || 0)}
                    onChange={(e) => {
                      const newVal = parseInt(e.target.value) || 0;
                      const newPos = { ...sectionPositions[selectedSection], x: newVal };
                      setSectionPositions(p => ({
                        ...p,
                        [selectedSection]: newPos
                      }));
                      updateLinkedLines(selectedSection, newPos);
                    }}
                    className={`control-input ${isAnimationsEnabled ? 'animate-input-spring' : ''}`}
                    style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px' }}
                  />
                </div>
                <div className="control-item" style={{ flex: 1 }}>
                  <label className="control-label-small" style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>Y Position</label>
                  <input
                    type="number"
                    value={Math.round(sectionPositions[selectedSection]?.y || 0)}
                    onChange={(e) => {
                      const newVal = parseInt(e.target.value) || 0;
                      const newPos = { ...sectionPositions[selectedSection], y: newVal };
                      setSectionPositions(p => ({
                        ...p,
                        [selectedSection]: newPos
                      }));
                      updateLinkedLines(selectedSection, newPos);
                    }}
                    className="control-input"
                    style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px' }}
                  />
                </div>
              </div>

              {/* Dimensions Control - Moved to Quick Style for convenience */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div className="control-item" style={{ flex: 1 }}>
                  <label className="control-label-small" style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>Width (px)</label>
                  <input
                    type="text"
                    value={sectionWidths[selectedSection] || '575px'}
                    onChange={(e) => handleWidthChange(selectedSection, e.target.value)}
                    onBlur={() => handleWidthBlur(selectedSection)}
                    className="control-input"
                    style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px' }}
                    placeholder="575px"
                  />
                </div>
                <div className="control-item" style={{ flex: 1 }}>
                  <label className="control-label-small" style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>Height (px)</label>
                  <input
                    type="text"
                    value={sectionHeights[selectedSection] || 'auto'}
                    onChange={(e) => handleHeightChange(selectedSection, e.target.value)}
                    onBlur={() => handleHeightBlur(selectedSection)}
                    className="control-input"
                    style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px' }}
                    placeholder="auto or 200px"
                  />
                </div>
              </div>

              {/* Nudge Controls for Section - RIGHT PANEL */}
              <div className="line-move-control" style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Fine Position Control (Nudge)
                </label>
                <div className="arrow-grid">
                  <div></div>
                  <button onClick={() => moveSection(selectedSection, 'up')} className="btn-arrow">↑</button>
                  <div></div>
                  <button onClick={() => moveSection(selectedSection, 'left')} className="btn-arrow">←</button>
                  <div className="arrow-center">MOVE</div>
                  <button onClick={() => moveSection(selectedSection, 'right')} className="btn-arrow">→</button>
                  <div></div>
                  <button onClick={() => moveSection(selectedSection, 'down')} className="btn-arrow">↓</button>
                  <div></div>
                </div>
              </div>

              {/* 🚀 NEW: Layout & Spacing Controls */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Layout & Spacing
                </h4>

                {/* Padding Control */}
                <div className="property-control">
                  <label className="control-label">Padding (px)</label>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="2"
                    value={parseInt(styleConfig[selectedSection]?.container?.padding) || 0}
                    onChange={(e) => handleStyleChange(selectedSection, 'container', `${e.target.value}px`, 'padding')}
                    className="control-input"
                    style={{ padding: 0 }}
                  />
                </div>

                {/* Content Indent Control */}
                <div className="property-control" style={{ marginTop: '8px' }}>
                  <label className="control-label">Content Indent (px)</label>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="2"
                    value={parseInt(styleConfig[selectedSection]?.bodyStyle?.marginLeft || styleConfig[selectedSection]?.contentLayout?.marginLeft || 0)}
                    onChange={(e) => {
                      // Try applying to bodyStyle (Summary) and contentLayout (Skills) and itemStyle (Experience/Projects)
                      handleStyleChange(selectedSection, 'bodyStyle', `${e.target.value}px`, 'marginLeft');
                      handleStyleChange(selectedSection, 'contentLayout', `${e.target.value}px`, 'marginLeft');
                      // For lists (Experience/Projects), we might want itemStyle margin-left or padding-left
                      handleStyleChange(selectedSection, 'itemStyle', `${e.target.value}px`, 'marginLeft');
                    }}
                    className="control-input"
                    style={{ padding: 0 }}
                  />
                </div>

                {/* Alignment Controls */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {/* Content Align */}
                  <div style={{ flex: 1 }}>
                    <label className="control-label-small">Content Align</label>
                    <div className="button-group-row">
                      <button
                        onClick={() => {
                          handleStyleChange(selectedSection, 'container', 'left', 'textAlign');
                          // Also try to help specific layouts like flex columns
                          handleStyleChange(selectedSection, 'layout', 'flex-start', 'alignItems');
                        }}
                        className="btn-secondary small"
                        title="Align Left"
                      >
                        Left
                      </button>
                      <button
                        onClick={() => {
                          handleStyleChange(selectedSection, 'container', 'center', 'textAlign');
                          // Also try to help specific layouts like flex columns
                          handleStyleChange(selectedSection, 'layout', 'center', 'alignItems');
                        }}
                        className="btn-secondary small"
                        title="Align Center"
                      >
                        Center
                      </button>
                    </div>
                  </div>

                  {/* Title Align (Separate) */}
                  <div style={{ flex: 1 }}>
                    <label className="control-label-small">Title Align</label>
                    <div className="button-group-row">
                      <button
                        onClick={() => handleStyleChange(selectedSection, 'titleStyle', 'left', 'textAlign')}
                        className="btn-secondary small"
                        title="Align Left"
                      >
                        Left
                      </button>
                      <button
                        onClick={() => handleStyleChange(selectedSection, 'titleStyle', 'center', 'textAlign')}
                        className="btn-secondary small"
                        title="Align Center"
                      >
                        Center
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Font Size Quick Controls */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                  {selectedSection === 'header' ? 'Name Font Size' : 'Font Size'}
                </label>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      const type = getStyleType(selectedSection, 'bodyStyle');
                      const current = parseInt(styleConfig[selectedSection]?.[type]?.fontSize) || 10;
                      handleStyleChange(selectedSection, 'bodyStyle', `${Math.max(6, current - 1)}px`, 'fontSize');
                    }}
                    className={`btn-secondary ${isAnimationsEnabled ? 'animate-btn-spring' : ''}`}
                    style={{ padding: '8px 14px', fontSize: '16px', flex: 1 }}
                  >
                    −
                  </button>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    minWidth: '40px',
                    textAlign: 'center',
                    background: 'white',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb'
                  }}>
                    {(() => {
                      const type = getStyleType(selectedSection, 'bodyStyle');
                      return parseInt(styleConfig[selectedSection]?.[type]?.fontSize) || 10;
                    })()}
                  </span>
                  <button
                    onClick={() => {
                      const type = getStyleType(selectedSection, 'bodyStyle');
                      const current = parseInt(styleConfig[selectedSection]?.[type]?.fontSize) || 10;
                      handleStyleChange(selectedSection, 'bodyStyle', `${Math.min(32, current + 1)}px`, 'fontSize');
                    }}
                    className="btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '16px', flex: 1 }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 🚀 Dedicated Contact Font Size Control */}
              {(selectedSection === 'header' || selectedSection === 'contact') && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                    Contact Info Size (Email, Phone, etc.)
                  </label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button
                      onClick={() => {
                        const current = parseInt(styleConfig[selectedSection]?.contactItemStyle?.fontSize) || 8;
                        handleStyleChange(selectedSection, 'contactItemStyle', `${Math.max(4, current - 1)}px`, 'fontSize');
                      }}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '16px', flex: 1 }}
                    >
                      −
                    </button>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      minWidth: '40px',
                      textAlign: 'center',
                      background: 'white',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb'
                    }}>
                      {parseInt(styleConfig[selectedSection]?.contactItemStyle?.fontSize) || (selectedSection === 'header' ? 8 : 10)}
                    </span>
                    <button
                      onClick={() => {
                        const current = parseInt(styleConfig[selectedSection]?.contactItemStyle?.fontSize) || 8;
                        handleStyleChange(selectedSection, 'contactItemStyle', `${Math.min(24, current + 1)}px`, 'fontSize');
                      }}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '16px', flex: 1 }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Title Font Size (if applicable) */}
              {styleConfig[selectedSection]?.titleStyle && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                    Title Font Size
                  </label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button
                      onClick={() => {
                        const current = parseInt(styleConfig[selectedSection]?.titleStyle?.fontSize) || 14;
                        handleStyleChange(selectedSection, 'titleStyle', `${Math.max(8, current - 1)}px`, 'fontSize');
                      }}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '16px', flex: 1 }}
                    >
                      −
                    </button>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      minWidth: '40px',
                      textAlign: 'center',
                      background: 'white',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb'
                    }}>
                      {parseInt(styleConfig[selectedSection]?.titleStyle?.fontSize) || 14}
                    </span>
                    <button
                      onClick={() => {
                        const current = parseInt(styleConfig[selectedSection]?.titleStyle?.fontSize) || 14;
                        handleStyleChange(selectedSection, 'titleStyle', `${Math.min(36, current + 1)}px`, 'fontSize');
                      }}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '16px', flex: 1 }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Text Color */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Text Color
                </label>
                <input
                  type="color"
                  value={(() => {
                    const type = getStyleType(selectedSection, 'bodyStyle');
                    return normalizeColorForInput(styleConfig[selectedSection]?.[type]?.color);
                  })()}
                  onChange={(e) => handleStyleChange(selectedSection, 'bodyStyle', e.target.value, 'color')}
                  style={{
                    width: '100%',
                    height: '40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Title Color (if applicable) */}
              {styleConfig[selectedSection]?.titleStyle && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                    Title Color
                  </label>
                  <input
                    type="color"
                    value={normalizeColorForInput(styleConfig[selectedSection]?.titleStyle?.color)}
                    onChange={(e) => handleStyleChange(selectedSection, 'titleStyle', e.target.value, 'color')}
                    style={{
                      width: '100%',
                      height: '40px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              )}

              {/* Subtitle Style (Skill Categories, Company Names, etc.) */}
              {(() => {
                const sType = getStyleType(selectedSection, 'subtitleStyle');
                const sStyle = styleConfig[selectedSection]?.[sType];
                if (!sStyle) return null;

                const label = selectedSection === 'skills' ? 'Skill Category' :
                  selectedSection === 'experience' ? 'Company Name' :
                    selectedSection === 'education' ? 'Institution' : 'Subtitle';

                return (
                  <div style={{ marginTop: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#111827', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      🏷️ {label} Style
                    </h4>

                    {/* Subtitle Font Size */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                        Font Size
                      </label>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button
                          onClick={() => {
                            const current = parseInt(sStyle.fontSize) || 10;
                            handleStyleChange(selectedSection, 'subtitleStyle', `${Math.max(6, current - 1)}px`, 'fontSize');
                          }}
                          className="btn-secondary"
                          style={{ padding: '8px 14px', fontSize: '16px', flex: 1 }}
                        >
                          −
                        </button>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          minWidth: '40px',
                          textAlign: 'center',
                          background: 'white',
                          padding: '8px',
                          borderRadius: '4px',
                          border: '1px solid #e5e7eb'
                        }}>
                          {parseInt(sStyle.fontSize) || 10}
                        </span>
                        <button
                          onClick={() => {
                            const current = parseInt(sStyle.fontSize) || 10;
                            handleStyleChange(selectedSection, 'subtitleStyle', `${Math.min(32, current + 1)}px`, 'fontSize');
                          }}
                          className="btn-secondary"
                          style={{ padding: '8px 14px', fontSize: '16px', flex: 1 }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Subtitle Color */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                        Color
                      </label>
                      <input
                        type="color"
                        value={normalizeColorForInput(sStyle.color)}
                        onChange={(e) => handleStyleChange(selectedSection, 'subtitleStyle', e.target.value, 'color')}
                        style={{
                          width: '100%',
                          height: '40px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  </div>
                );
              })()}
              {styleConfig[selectedSection]?.bulletConfig && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                    Content Font Size
                  </label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button
                      onClick={() => {
                        const current = parseInt(styleConfig[selectedSection]?.bulletConfig?.textSize) || 9;
                        handleStyleChange(selectedSection, 'bulletConfig', `${Math.max(6, current - 1)}px`, 'textSize');
                      }}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '16px', flex: 1 }}
                    >
                      −
                    </button>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      minWidth: '40px',
                      textAlign: 'center',
                      background: 'white',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb'
                    }}>
                      {parseInt(styleConfig[selectedSection]?.bulletConfig?.textSize) || 9}
                    </span>
                    <button
                      onClick={() => {
                        const current = parseInt(styleConfig[selectedSection]?.bulletConfig?.textSize) || 9;
                        handleStyleChange(selectedSection, 'bulletConfig', `${Math.min(32, current + 1)}px`, 'textSize');
                      }}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '16px', flex: 1 }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Bullet Point Spacing (Gap) */}
              {styleConfig[selectedSection]?.bulletConfig && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                    Content Spacing (Points)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={parseInt(styleConfig[selectedSection]?.bulletConfig?.gap) || 0}
                      onChange={(e) => handleStyleChange(selectedSection, 'bulletConfig', `${e.target.value}px`, 'gap')}
                      style={{ width: '100%' }}
                    />
                    <div style={{ minWidth: '40px', textAlign: 'right', fontSize: '13px', color: '#374151' }}>
                      {(parseInt(styleConfig[selectedSection]?.bulletConfig?.gap) || 0) + 'px'}
                    </div>
                  </div>
                </div>
              )}

              {/* Content Color (Bullet Points) */}
              {styleConfig[selectedSection]?.bulletConfig && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                    Content Color
                  </label>
                  <input
                    type="color"
                    value={normalizeColorForInput(styleConfig[selectedSection]?.bulletConfig?.textColor)}
                    onChange={(e) => handleStyleChange(selectedSection, 'bulletConfig', e.target.value, 'textColor')}
                    style={{
                      width: '100%',
                      height: '40px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              )}


              {/* Background Color */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Background
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="color"
                    value={normalizeColorForInput(styleConfig[selectedSection]?.container?.backgroundColor)}
                    onChange={(e) => handleStyleChange(selectedSection, 'container', e.target.value, 'backgroundColor')}
                    disabled={styleConfig[selectedSection]?.container?.backgroundColor === 'transparent'}
                    style={{
                      flex: 1,
                      height: '40px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      opacity: styleConfig[selectedSection]?.container?.backgroundColor === 'transparent' ? 0.5 : 1
                    }}
                  />
                  <button
                    onClick={() => {
                      const currentBg = styleConfig[selectedSection]?.container?.backgroundColor;
                      handleStyleChange(selectedSection, 'container', currentBg === 'transparent' ? '#FFFFFF' : 'transparent', 'backgroundColor');
                    }}
                    className="btn-secondary"
                    style={{
                      padding: '0 16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: styleConfig[selectedSection]?.container?.backgroundColor === 'transparent' ? '#3b82f6' : 'white',
                      color: styleConfig[selectedSection]?.container?.backgroundColor === 'transparent' ? 'white' : '#374151',
                      border: styleConfig[selectedSection]?.container?.backgroundColor === 'transparent' ? '1px solid #3b82f6' : '1px solid #d1d5db'
                    }}
                  >
                    {styleConfig[selectedSection]?.container?.backgroundColor === 'transparent' ? '⊘' : 'T'}
                  </button>
                </div>
                <span style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  {styleConfig[selectedSection]?.container?.backgroundColor === 'transparent' ? 'Transparent' : 'Solid'}
                </span>
              </div>

              {/* Section Title Color Picker */}
              {styleConfig[selectedSection]?.sectionTitle && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                    Section Title Color
                  </label>

                  {/* Color Palette */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', marginBottom: '8px' }}>
                    {['#000000', '#3b82f6', '#ef4444', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'].map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          setStyleConfig(prev => ({
                            ...prev,
                            [selectedSection]: {
                              ...prev[selectedSection],
                              sectionTitle: {
                                ...prev[selectedSection]?.sectionTitle,
                                color: color
                              }
                            }
                          }));
                          setInitTrigger(t => t + 1);
                        }}
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: color,
                          border: styleConfig[selectedSection]?.sectionTitle?.color === color ? '3px solid #1f2937' : '1px solid #d1d5db',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        title={color}
                      />
                    ))}
                  </div>

                  {/* Custom Color Picker */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={styleConfig[selectedSection]?.sectionTitle?.color || '#000000'}
                      onChange={(e) => {
                        setStyleConfig(prev => ({
                          ...prev,
                          [selectedSection]: {
                            ...prev[selectedSection],
                            sectionTitle: {
                              ...prev[selectedSection]?.sectionTitle,
                              color: e.target.value
                            }
                          }
                        }));
                        setInitTrigger(t => t + 1);
                      }}
                      style={{ width: '50px', height: '32px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'monospace' }}>
                      {styleConfig[selectedSection]?.sectionTitle?.color || '#000000'}
                    </span>
                  </div>
                </div>
              )}

              {/* Project Link Styles */}
              {selectedSection === 'projects' && (
                <div style={{ marginTop: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '12px', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🔗 Project Link Styling
                  </label>

                  {/* Link Color */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                      Link Color
                    </label>
                    <input
                      type="color"
                      value={normalizeColorForInput(styleConfig.projects?.linkStyle?.color)}
                      onChange={(e) => handleStyleChange('projects', 'linkStyle', e.target.value, 'color')}
                      style={{
                        width: '100%',
                        height: '36px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    />
                  </div>

                  {/* Link Spacing (Margin Top) */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                      Link Spacing (Top)
                    </label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={parseInt(styleConfig.projects?.linkStyle?.marginTop) || 0}
                        onChange={(e) => handleStyleChange('projects', 'linkStyle', `${e.target.value}px`, 'marginTop')}
                        style={{ flex: 1 }}
                      />
                      <span style={{ fontSize: '12px', fontWeight: '600', minWidth: '30px' }}>
                        {parseInt(styleConfig.projects?.linkStyle?.marginTop) || 0}px
                      </span>
                    </div>
                  </div>

                  {/* Link Spacing (Margin Bottom) */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                      Link Spacing (Bottom)
                    </label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={parseInt(styleConfig.projects?.linkStyle?.marginBottom) || 0}
                        onChange={(e) => handleStyleChange('projects', 'linkStyle', `${e.target.value}px`, 'marginBottom')}
                        style={{ flex: 1 }}
                      />
                      <span style={{ fontSize: '12px', fontWeight: '600', minWidth: '30px' }}>
                        {parseInt(styleConfig.projects?.linkStyle?.marginBottom) || 0}px
                      </span>
                    </div>
                  </div>

                  {/* Underline Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: '#374151' }}>Show Underline</label>
                    <input
                      type="checkbox"
                      checked={styleConfig.projects?.linkStyle?.textDecoration === 'underline'}
                      onChange={(e) => handleStyleChange('projects', 'linkStyle', e.target.checked ? 'underline' : 'none', 'textDecoration')}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              )}

              {/* Padding */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Padding
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={parseInt(styleConfig[selectedSection]?.container?.padding) || 0}
                  onChange={(e) => {
                    const newPadding = `${e.target.value}px`;
                    handleStyleChange(selectedSection, 'container', newPadding, 'padding');
                  }}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>
                  <span>0px</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>
                    {parseInt(styleConfig[selectedSection]?.container?.padding) || 0}px
                  </span>
                  <span>50px</span>
                </div>
              </div>

              {/* Width (range slider) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Width
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="range"
                    min={200}
                    max={595}
                    value={parseInt(sectionWidths[selectedSection]) || 515}
                    onChange={(e) => handleWidthChange(selectedSection, `${e.target.value}px`)}
                    onMouseUp={() => handleWidthBlur(selectedSection)}
                    onTouchEnd={() => handleWidthBlur(selectedSection)}
                    style={{ width: '100%' }}
                  />
                  <div style={{ minWidth: '64px', textAlign: 'right', fontSize: '13px', color: '#374151' }}>
                    {(parseInt(sectionWidths[selectedSection]) || 515) + 'px'}
                  </div>
                </div>
              </div>

              {/* Title Spacing Control */}
              {styleConfig[selectedSection]?.titleStyle?.marginBottom && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                    Title Spacing (Title → Content)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={parseInt(styleConfig[selectedSection]?.titleStyle?.marginBottom) || 0}
                      onChange={(e) => handleStyleChange(selectedSection, 'titleStyle', `${e.target.value}px`, 'marginBottom')}
                      style={{ width: '100%' }}
                    />
                    <div style={{ minWidth: '64px', textAlign: 'right', fontSize: '13px', color: '#374151' }}>
                      {(parseInt(styleConfig[selectedSection]?.titleStyle?.marginBottom) || 0) + 'px'}
                    </div>
                  </div>
                </div>
              )}

              {/* Title Padding Bottom Control */}
              {styleConfig[selectedSection]?.titleStyle && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                    Title Padding Bottom
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={parseInt(styleConfig[selectedSection]?.titleStyle?.paddingBottom) || 0}
                      onChange={(e) => handleStyleChange(selectedSection, 'titleStyle', `${e.target.value}px`, 'paddingBottom')}
                      style={{ width: '100%' }}
                    />
                    <div style={{ minWidth: '64px', textAlign: 'right', fontSize: '13px', color: '#374151' }}>
                      {(parseInt(styleConfig[selectedSection]?.titleStyle?.paddingBottom) || 0) + 'px'}
                    </div>
                  </div>
                </div>
              )}

              {/* Entry Spacing Control */}
              {(styleConfig[selectedSection]?.itemMarginBottom || ['education', 'experience', 'projects'].includes(selectedSection)) && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                    Entry Spacing (Between Items)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      value={parseInt(styleConfig[selectedSection]?.itemMarginBottom) || 0}
                      onChange={(e) => {
                        setStyleConfig(prev => ({
                          ...prev,
                          [selectedSection]: {
                            ...prev[selectedSection],
                            itemMarginBottom: `${e.target.value}px`
                          }
                        }));

                      }}
                      style={{ width: '100%' }}
                    />
                    <div style={{ minWidth: '64px', textAlign: 'right', fontSize: '13px', color: '#374151' }}>
                      {(parseInt(styleConfig[selectedSection]?.itemMarginBottom) || 0) + 'px'}
                    </div>
                  </div>
                </div>
              )}

              {/* Content Gap Control (for skills section) */}
              {styleConfig[selectedSection]?.contentLayout?.gap && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                    Content Gap (Between Categories)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={parseInt(styleConfig[selectedSection]?.contentLayout?.gap) || 0}
                      onChange={(e) => {
                        setStyleConfig(prev => ({
                          ...prev,
                          [selectedSection]: {
                            ...prev[selectedSection],
                            contentLayout: {
                              ...prev[selectedSection]?.contentLayout,
                              gap: `${e.target.value}px`
                            }
                          }
                        }));

                      }}
                      style={{ width: '100%' }}
                    />
                    <div style={{ minWidth: '64px', textAlign: 'right', fontSize: '13px', color: '#374151' }}>
                      {(parseInt(styleConfig[selectedSection]?.contentLayout?.gap) || 0) + 'px'}
                    </div>
                  </div>
                </div>
              )}

              {/* Inner Field Spacing for Education */}
              {selectedSection === 'education' && styleConfig.education?.degreeStyle?.marginBottom && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                      Degree Spacing (After Degree)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        value={parseInt(styleConfig.education?.degreeStyle?.marginBottom) || 0}
                        onChange={(e) => handleStyleChange('education', 'degreeStyle', `${e.target.value}px`, 'marginBottom')}
                        style={{ width: '100%' }}
                      />
                      <div style={{ minWidth: '64px', textAlign: 'right', fontSize: '13px', color: '#374151' }}>
                        {(parseInt(styleConfig.education?.degreeStyle?.marginBottom) || 0) + 'px'}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                      Institution Spacing (After Institution)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        value={parseInt(styleConfig.education?.institutionStyle?.marginBottom) || 0}
                        onChange={(e) => handleStyleChange('education', 'institutionStyle', `${e.target.value}px`, 'marginBottom')}
                        style={{ width: '100%' }}
                      />
                      <div style={{ minWidth: '64px', textAlign: 'right', fontSize: '13px', color: '#374151' }}>
                        {(parseInt(styleConfig.education?.institutionStyle?.marginBottom) || 0) + 'px'}
                      </div>
                    </div>
                  </div>
                </>)}

              {/* Item Padding Control (for sections with entries) */}
              {(selectedSection === 'education' || selectedSection === 'experience' || selectedSection === 'projects') && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                    Item Left Indent
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      value={parseInt(styleConfig[selectedSection]?.itemStyle?.padding) || 0}
                      onChange={(e) => {
                        setStyleConfig(prev => ({
                          ...prev,
                          [selectedSection]: {
                            ...prev[selectedSection],
                            itemStyle: {
                              ...prev[selectedSection]?.itemStyle,
                              padding: `${e.target.value}px`
                            }
                          }
                        }));

                      }}
                      style={{ width: '100%' }}
                    />
                    <div style={{ minWidth: '64px', textAlign: 'right', fontSize: '13px', color: '#374151' }}>
                      {(parseInt(styleConfig[selectedSection]?.itemStyle?.padding) || 0) + 'px'}
                    </div>
                  </div>
                </div>
              )}

              <div style={{
                background: '#fef3c7',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #fbbf24',
                marginTop: '20px'
              }}>
                <p style={{ fontSize: '11px', color: '#92400e', margin: 0, lineHeight: '1.5' }}>
                  💡 <strong>Tip:</strong> Select a section on canvas to quickly adjust its style here!
                </p>
              </div>
            </div>
          ) : selectedShape ? (
            <div style={{ padding: '12px' }}>
              <div style={{
                background: '#f3f4f6',
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                💠 {backgroundShapes.find(s => s.id === selectedShape)?.label?.toUpperCase() || 'SHAPE'}
              </div>

              {/* Nudge Controls for Shape - RIGHT PANEL */}
              <div className="line-move-control" style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Fine Position Control (Nudge)
                </label>
                <div className="arrow-grid">
                  <div></div>
                  <button onClick={() => moveShape(selectedShape, 'up')} className="btn-arrow">↑</button>
                  <div></div>
                  <button onClick={() => moveShape(selectedShape, 'left')} className="btn-arrow">←</button>
                  <div className="arrow-center">MOVE</div>
                  <button onClick={() => moveShape(selectedShape, 'right')} className="btn-arrow">→</button>
                  <div></div>
                  <button onClick={() => moveShape(selectedShape, 'down')} className="btn-arrow">↓</button>
                  <div></div>
                </div>
              </div>

              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '6px', border: '1px solid #3b82f6', marginTop: '20px' }}>
                <p style={{ fontSize: '11px', color: '#1e40af', margin: 0 }}>
                  💡 Use the <strong>Left Panel</strong> for color and size adjustments of background shapes.
                </p>
              </div>
            </div>
          ) : selectedLine ? (
            <div style={{ padding: '12px' }}>
              <div style={{
                background: '#f3f4f6',
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                📏 {lines.find(l => l.id === selectedLine)?.label?.toUpperCase() || 'LINE'}
              </div>

              {/* Nudge Controls for Line - RIGHT PANEL */}
              <div className="line-move-control" style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Fine Position Control (Nudge)
                </label>
                <div className="arrow-grid">
                  <div></div>
                  <button onClick={() => moveLine(selectedLine, 'up')} className="btn-arrow">↑</button>
                  <div></div>
                  <button onClick={() => moveLine(selectedLine, 'left')} className="btn-arrow">←</button>
                  <div className="arrow-center">MOVE</div>
                  <button onClick={() => moveLine(selectedLine, 'right')} className="btn-arrow">→</button>
                  <div></div>
                  <button onClick={() => moveLine(selectedLine, 'down')} className="btn-arrow">↓</button>
                  <div></div>
                </div>
              </div>

              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '6px', border: '1px solid #3b82f6', marginTop: '20px' }}>
                <p style={{ fontSize: '11px', color: '#1e40af', margin: 0 }}>
                  💡 Use the <strong>Left Panel</strong> for thickness and color of divider lines.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ padding: '12px' }}>
              <div style={{
                background: '#f3f4f6',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '12px'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎨</div>
                <p style={{ margin: 0 }}>
                  Click on an element in the canvas to edit its styles
                </p>
              </div>

              <div style={{ marginTop: '20px', padding: '12px', background: '#eff6ff', borderRadius: '6px', border: '1px solid #3b82f6' }}>
                <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#1e40af', margin: '0 0 8px 0' }}>
                  Quick Actions:
                </h4>
                <ul style={{ fontSize: '11px', color: '#1e40af', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Drag elements to reposition</li>
                  <li>Click to select and style</li>
                  <li>Use "Nudge" for fine control</li>
                </ul>
              </div>
            </div>
          )
        }
      </div >


      {/* ======================= RIGHT PANEL END ========================= */}




    </div >


  );
};

export default UIEditor;