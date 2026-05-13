
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentResume, setCurrentResumeId, setSavedStyleConfig, setCurrentTemplate } from "../../redux/store.js";
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
import { jsPDF } from "jspdf";
import api from "../../api/axios";

// ==================== TEMPLATE MAPPINGS ====================
const TEMPLATES = {
    custom: { name: 'Custom (Saved)', ...ATS_TEMPLATE_CONFIG },
    balancedHybrid: BALANCED_HYBRID_CONFIG,
    modern: MODERN_TEMPLATE_CONFIG,
    twoColumn: TWO_COLUMN_TEMPLATE_CONFIG,
    template5: TEMPLATE5_CONFIG,
    newAts: NEW_ATS_CONFIG,
    atsCompact: ATS_COMPACT_CONFIG
};

const TEMPLATE_ID_MAP = {
    1: 'ats', 2: 'modern', 3: 'ats', 4: 'twoColumn', 5: 'template5',
    6: 'newAts', 7: 'modern', 10: 'ats', 11: 'modern'
};

const normalizeTemplateKey = (templateIdentifier) => {
    if (templateIdentifier === 'custom') return 'custom';
    if (typeof templateIdentifier === 'string' && TEMPLATES[templateIdentifier]) return templateIdentifier;
    const EXTENDED_MAP = {
        "ats-optimized": "ats", "ats-compact": "atsCompact", "balanced-hybrid": "balancedHybrid",
        "modern-ats-two-column": "modern", "two-column-professional": "twoColumn",
        "ats-edgy": "newAts", "tech-innovator": "template5"
    };
    if (EXTENDED_MAP[templateIdentifier]) return EXTENDED_MAP[templateIdentifier];
    const numericId = typeof templateIdentifier === 'string' ? parseInt(templateIdentifier, 10) : templateIdentifier;
    if (!isNaN(numericId) && TEMPLATE_ID_MAP[numericId]) return TEMPLATE_ID_MAP[numericId];
    return 'ats';
};

const normalizeColorForInput = (color) => {
    if (!color || color === 'transparent') return '#ffffff';
    if (color.startsWith('#')) return color.length === 9 ? color.slice(0, 7) : color;
    return color;
};

// ==================== MAIN UI EDITOR COMPONENT ====================
const UIEditor = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { resumeId: paramResumeId, templateId: paramTemplateId } = useParams();
    const resumeId = paramResumeId === 'new' ? null : paramResumeId;
    const userId = useSelector((s) => s.auth.userId);

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [selectedLine, setSelectedLine] = useState(null);
    const [selectedShape, setSelectedShape] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [showPage2, setShowPage2] = useState(false);
    const [isAutoFlowEnabled, setIsAutoFlowEnabled] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [isMagneticEnabled, setIsMagneticEnabled] = useState(false);
    const [isDividerSyncEnabled, setIsDividerSyncEnabled] = useState(false);

    const globalCurrentTemplate = useSelector((state) => state.resume.currentTemplateName);
    const savedStyleConfig = useSelector((state) => state.resume.savedStyleConfig);

    const initialTemplateKey = useMemo(() => normalizeTemplateKey(globalCurrentTemplate || 'ats'), [globalCurrentTemplate]);
    const initialConfig = useMemo(() => savedStyleConfig || TEMPLATES[initialTemplateKey] || ATS_TEMPLATE_CONFIG, [initialTemplateKey, savedStyleConfig]);

    const [currentTemplateName, setLocalTemplateName] = useState(initialTemplateKey);
    const [sectionPositions, setSectionPositions] = useState(initialConfig.positions || {});
    const [lines, setLines] = useState(initialConfig.lines || []);
    const [backgroundShapes, setBackgroundShapes] = useState(initialConfig.shapes || []);
    const [nextLineId, setNextLineId] = useState(() => (initialConfig.lines?.length ? Math.max(...initialConfig.lines.map(l => l.id)) + 1 : 1));
    const [nextShapeId, setNextShapeId] = useState(() => {
        const shapes = initialConfig.shapes || initialConfig.backgroundShapes || [];
        return shapes?.length ? Math.max(...shapes.map(s => s.id)) + 1 : 1;
    });

    const extractWidthsAndHeightsFromConfig = (config) => {
        const widths = {}; const heights = {};
        Object.keys(config).forEach(key => {
            if (config[key]?.container?.width) widths[key] = config[key].container.width;
            if (config[key]?.container?.height) heights[key] = config[key].container.height;
        });
        return { widths, heights };
    };

    const [sectionWidths, setSectionWidths] = useState(() => extractWidthsAndHeightsFromConfig(initialConfig).widths);
    const [sectionHeights, setSectionHeights] = useState(() => extractWidthsAndHeightsFromConfig(initialConfig).heights);
    const [styleConfig, setStyleConfig] = useState(initialConfig);
    const [backupConfig, setBackupConfig] = useState(null);
    const [isLayoutDirty, setIsLayoutDirty] = useState(false);

    const currentResume = useSelector((state) => state.resume.currentResume);
    const currentResumeId = useSelector((state) => state.resume.resumeId);
    const lastDispatchedRef = useRef(null);

    const [resumeData, setResumeData] = useState(defaultResumeData);
    const [customSections, setCustomSections] = useState([]);
    const [sectionVisibility, setSectionVisibility] = useState({
        summary: true, skills: true, experience: true, projects: true, education: true, certifications: true, contact: true, header: true
    });

    const TemplateComponents = {
        header: FlexibleHeaderSection, contact: FlexibleContactSection,
        summary: FlexibleSummarySection, skills: FlexibleSkillsSection,
        experience: FlexibleExperienceSection, projects: FlexibleProjectsSection,
        education: FlexibleEducationSection, certifications: FlexibleCertificationsSection
    };

    // ==================== REFS FOR PERFORMANCE ====================
    const positionsRef = useRef(initialConfig.positions || {});
    const linesRef = useRef(initialConfig.lines || []);
    const shapesRef = useRef(initialConfig.shapes || []);
    const sectionRefs = useRef({});
    const lineRefs = useRef({});
    const shapeRefs = useRef({});
    const dragInfo = useRef({ active: false, type: null, id: null, startX: 0, startY: 0, initialPos: null });

    // Sync state with refs initially and on template switch
    useEffect(() => {
        positionsRef.current = sectionPositions;
        linesRef.current = lines;
        shapesRef.current = backgroundShapes;
    }, [sectionPositions, lines, backgroundShapes]);

    // ==================== DRAG HANDLERS (NO-RENDER) ====================
    const handlePointerDown = (e, type, id) => {
        e.stopPropagation();

        let initialPos = { x: 0, y: 0 };
        if (type === 'section') {
            initialPos = positionsRef.current[id] || { x: 0, y: 0 };
            setSelectedSection(id); setSelectedLine(null); setSelectedShape(null);
        } else if (type === 'line') {
            const line = linesRef.current.find(l => l.id === id);
            initialPos = { x: line.x1, y: line.y1 };
            setSelectedLine(id); setSelectedSection(null); setSelectedShape(null);
        } else if (type === 'shape') {
            const shape = shapesRef.current.find(s => s.id === id);
            initialPos = { x: shape.x, y: shape.y };
            setSelectedShape(id); setSelectedSection(null); setSelectedLine(null);
        }

        dragInfo.current = { active: true, type, id, startX: e.clientX, startY: e.clientY, initialPos };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (!dragInfo.current.active) return;

        const { type, id, startX, startY, initialPos } = dragInfo.current;
        const dx = (e.clientX - startX) / zoom;
        const dy = (e.clientY - startY) / zoom;

        const newX = Math.round(initialPos.x + dx);
        const newY = Math.round(initialPos.y + dy);

        if (type === 'section') {
            const el = sectionRefs.current[id];
            if (el) {
                const pageOffset = newY >= 842 ? 842 : 0;
                el.style.left = `${newX}px`;
                el.style.top = `${newY - pageOffset}px`;
                positionsRef.current = { ...positionsRef.current, [id]: { x: newX, y: newY } };

                // Update linked lines in DOM directly
                linesRef.current.forEach(line => {
                    if (line.isSectionDivider === id) {
                        const lineEl = lineRefs.current[line.id];
                        if (lineEl) {
                            const offsetY = isDividerSyncEnabled ? 22 : (line.offsetY !== undefined ? line.offsetY : 22);
                            lineEl.style.left = `${newX}px`;
                            lineEl.style.top = `${newY + offsetY - (newY + offsetY >= 842 ? 842 : 0)}px`;
                        }
                    }
                });
            }
        } else if (type === 'line') {
            const el = lineRefs.current[id];
            if (el) {
                const pageOffset = newY >= 842 ? 842 : 0;
                el.style.left = `${newX}px`;
                el.style.top = `${newY - pageOffset}px`;
                linesRef.current = linesRef.current.map(l => {
                    if (l.id === id) {
                        const width = Math.abs(l.x2 - l.x1);
                        const height = Math.abs(l.y2 - l.y1);
                        return { ...l, x1: newX, y1: newY, x2: l.orientation === 'horizontal' ? newX + width : newX, y2: l.orientation === 'vertical' ? newY + height : newY };
                    }
                    return l;
                });
            }
        } else if (type === 'shape') {
            const el = shapeRefs.current[id];
            if (el) {
                const pageOffset = newY >= 842 ? 842 : 0;
                el.style.left = `${newX}px`;
                el.style.top = `${newY - pageOffset}px`;
                shapesRef.current = shapesRef.current.map(s => s.id === id ? { ...s, x: newX, y: newY } : s);
            }
        }
    };

    const handlePointerUp = (e) => {
        if (!dragInfo.current.active) return;
        setSectionPositions({ ...positionsRef.current });
        setLines([...linesRef.current]);
        setBackgroundShapes([...shapesRef.current]);
        dragInfo.current.active = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    useEffect(() => {
        if (currentResume) {
            const currentResumeStr = JSON.stringify(currentResume);
            if (currentResumeStr !== lastDispatchedRef.current && currentResumeStr !== JSON.stringify(resumeData)) {
                setResumeData(currentResume);
                if (currentResume.customSections) setCustomSections(currentResume.customSections);
            }
        }
    }, [currentResume]);

    useEffect(() => {
        if (resumeData) {
            setSectionVisibility(prev => ({
                ...prev,
                summary: resumeData.showSummary ?? true,
                skills: resumeData.showSkills ?? true,
                experience: resumeData.showExperience ?? true,
                projects: resumeData.showProjects ?? true,
                education: resumeData.showEducation ?? true,
                certifications: resumeData.showCertifications ?? true,
            }));
        }
    }, [resumeData]);

    const handleTemplateSwitch = (templateName, overrideConfig = null) => {
        const normalizedKey = normalizeTemplateKey(templateName);
        if (normalizedKey === currentTemplateName && !overrideConfig) return;
        setBackupConfig({ styleConfig: JSON.parse(JSON.stringify(styleConfig)), positions: { ...sectionPositions }, lines: [...lines], shapes: [...backgroundShapes], templateName: currentTemplateName });
        setLocalTemplateName(normalizedKey);
        dispatch(setCurrentTemplate(normalizedKey));
        let template = overrideConfig || TEMPLATES[normalizedKey] || ATS_TEMPLATE_CONFIG;
        if (normalizedKey === 'custom' && savedStyleConfig) template = savedStyleConfig;
        setStyleConfig(template);
        setSectionPositions(prev => {
            const newPos = { ...(template.positions || {}) };
            Object.keys(prev).forEach(key => { if (key.startsWith('custom-')) newPos[key] = prev[key]; });
            return newPos;
        });
        const { widths, heights } = extractWidthsAndHeightsFromConfig(template);
        setSectionWidths(widths); setSectionHeights(heights);
        setLines(template.lines || []);
        setBackgroundShapes(template.shapes || []);
        setZoom(1); setSelectedLine(null); setSelectedShape(null); setSelectedSection(null); setIsLayoutDirty(false);
    };

    const handleSaveAll = async () => {
        if (userId == null) { alert('Please Login First.'); return; }
        setSaving(true);
        try {
            const updatedConfig = { ...styleConfig, positions: sectionPositions, lines, shapes: backgroundShapes };
            const payload = {
                title: resumeData.resumeDetails?.title || "My Resume",
                templateId: String(currentTemplateName || "custom"),
                userId,
                details: resumeData.resumeDetails,
                contact: resumeData.resumeDetails?.contact,
                skills: resumeData.skills,
                experiences: resumeData.experiences,
                projects: resumeData.projects,
                educationList: resumeData.educationList,
                certifications: resumeData.certifications,
                customSections: resumeData.customSections,
                styleConfig: updatedConfig,
                sectionTitles: resumeData.sectionTitles || {}
            };
            const targetResumeId = resumeId || currentResumeId;
            const endpoint = targetResumeId ? `/update/${targetResumeId}` : `/saveall`;
            const method = targetResumeId ? "PUT" : "POST";
            const res = await api({ method, url: endpoint, data: payload });
            if (!targetResumeId && res.data.resumeId) dispatch(setCurrentResumeId(res.data.resumeId));
            dispatch(setSavedStyleConfig(updatedConfig));
            dispatch(setCurrentTemplate(currentTemplateName));
            setIsLayoutDirty(false);
            if (window.showMessage) window.showMessage('Success', 'Resume configuration saved!', 'success', 1500);
        } catch (err) {
            console.error(err);
            if (window.showMessage) window.showMessage('Error', err.response?.data?.message || err.message, 'error', 1500);
        }
        setSaving(false);
    };

    const getElementsForPage = (pageNum) => {
        const pageStart = (pageNum - 1) * 842;
        const pageEnd = pageNum * 842;
        return {
            sections: Object.entries(sectionPositions || {}).filter(([name, pos]) => {
                if (!pos || !sectionVisibility[name]) return false;
                const height = parseInt(sectionHeights[name]) || 200;
                return (pos.y < pageEnd && pos.y + height > pageStart);
            }),
            lines: (lines || []).filter(line => Math.max(line.y1, line.y2) > pageStart && Math.min(line.y1, line.y2) < pageEnd),
            shapes: (backgroundShapes || []).filter(shape => shape.y < pageEnd && shape.y + (shape.height || 100) > pageStart)
        };
    };

    const updateLinkedLines = (sectionName, newPos, newWidth) => {
        setLines(prevLines => prevLines.map(line => {
            if (line.isSectionDivider === sectionName) {
                const width = newWidth ? Math.min(parseInt(newWidth) || 575, 575) : Math.abs(line.x2 - line.x1);
                const offsetY = isDividerSyncEnabled ? 22 : (line.offsetY !== undefined ? line.offsetY : 22);
                return { ...line, x1: newPos.x, y1: newPos.y + offsetY, x2: newPos.x + width, y2: newPos.y + offsetY, offsetY };
            }
            return line;
        }));
    };

    const moveSection = (sectionName, direction) => {
        setSectionPositions(prev => {
            const pos = prev[sectionName] || { x: 0, y: 0 };
            const newPos = { ...pos };
            if (direction === 'up') newPos.y -= 2; if (direction === 'down') newPos.y += 2;
            if (direction === 'left') newPos.x -= 2; if (direction === 'right') newPos.x += 2;
            updateLinkedLines(sectionName, newPos);
            return { ...prev, [sectionName]: newPos };
        });
    };

    const handleGlobalStyleChange = (key, value) => {
        setStyleConfig(prev => ({ ...prev, [key]: value }));
        setIsLayoutDirty(true);
    };

    const resetLayout = () => {
        const template = TEMPLATES[normalizeTemplateKey(currentTemplateName)] || ATS_TEMPLATE_CONFIG;
        setSectionPositions(template.positions || {});
        const { widths, heights } = extractWidthsAndHeightsFromConfig(template);
        setSectionWidths(widths); setSectionHeights(heights);
        setLines(template.lines || []); setBackgroundShapes(template.shapes || []); setZoom(1);
    };

    const addLine = (orientation) => {
        const newLine = { id: nextLineId, label: `Line ${nextLineId}`, orientation, x1: 100, y1: 200, x2: orientation === 'horizontal' ? 400 : 100, y2: orientation === 'vertical' ? 400 : 200, thickness: 1, color: '#000000' };
        setLines([...lines, newLine]); setNextLineId(nextLineId + 1); setSelectedLine(newLine.id);
    };

    const addShape = () => {
        const newShape = { id: nextShapeId, label: `Shape ${nextShapeId}`, x: 50, y: 50, width: 200, height: 100, color: '#e5e7eb' };
        setBackgroundShapes([...backgroundShapes, newShape]); setNextShapeId(nextShapeId + 1); setSelectedShape(newShape.id);
    };

    const updateLine = (id, prop, val) => setLines(lines.map(l => l.id === id ? { ...l, [prop]: val } : l));
    const updateShape = (id, prop, val) => setBackgroundShapes(backgroundShapes.map(s => s.id === id ? { ...s, [prop]: val } : s));

    const page1Elements = useMemo(() => getElementsForPage(1), [sectionPositions, lines, backgroundShapes, sectionVisibility, sectionHeights]);
    const page2Elements = useMemo(() => showPage2 ? getElementsForPage(2) : { sections: [], lines: [], shapes: [] }, [showPage2, sectionPositions, lines, backgroundShapes, sectionVisibility, sectionHeights]);

    const renderSection = (name, pos, pageOffset = 0) => {
        const isCustom = name.startsWith('custom-');
        let Component = isCustom ? FlexibleCustomSection : TemplateComponents[name];
        if (!Component) return null;

        const propsMap = {
            header: { resumeDetails: resumeData?.resumeDetails, styleConfig },
            contact: { resumeDetails: resumeData?.resumeDetails, styleConfig },
            summary: { summary: resumeData?.resumeDetails?.summary, styleConfig },
            skills: { skills: resumeData?.skills, styleConfig },
            experience: { experiences: resumeData?.experiences, styleConfig },
            projects: { projects: resumeData?.projects, styleConfig },
            education: { educationList: resumeData?.educationList, styleConfig },
            certifications: { certifications: resumeData?.certifications, styleConfig }
        };

        let props = propsMap[name];
        if (isCustom) {
            const actualId = name.replace('custom-', '');
            const sectionData = customSections.find(s => String(s.id) === String(actualId));
            if (!sectionData) return null;
            props = { customSections: [sectionData], styleConfig };
        }

        return (
            <div
                key={name}
                ref={el => sectionRefs.current[name] = el}
                onPointerEnter={() => { if (!dragInfo.current.active && !dragInfo.current.isLocked) setSelectedSection(name); }}
                onPointerLeave={() => { if (!dragInfo.current.active && selectedSection === name && !dragInfo.current.isLocked) setSelectedSection(null); }}
                onPointerDown={(e) => {
                    handlePointerDown(e, 'section', name);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    dragInfo.current.isLocked = true;
                    setSelectedSection(name); setSelectedLine(null); setSelectedShape(null);
                }}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`dom-section-item ${selectedSection === name ? 'selected' : ''}`}
                style={{
                    position: 'absolute',
                    left: `${pos.x}px`,
                    top: `${pos.y - pageOffset}px`,
                    width: sectionWidths[name] || '515px',
                    minHeight: '20px',
                    cursor: 'move',
                    zIndex: selectedSection === name ? 110 : 10,
                    outline: selectedSection === name ? '2px solid #3b82f6' : 'none',
                    background: 'transparent',
                    touchAction: 'none'
                }}
            >
                <Component {...props} />
            </div>
        );
    };

    return (
        <div className="editor-container no-webgl" style={{ gridTemplateColumns: '340px 1fr 380px', height: '100vh', background: '#000', color: '#fff' }}>

            {/* LEFT PANEL */}
            <div className="left-panel" style={{ overflowY: 'auto', padding: '15px', borderRight: '1px solid #333' }}>
                <h3 className="panel-title">TEMPLATE & LAYOUT</h3>
                <select value={currentTemplateName} onChange={(e) => handleTemplateSwitch(e.target.value)} className="control-select">
                    {Object.keys(TEMPLATES).map(k => <option key={k} value={k}>{TEMPLATES[k].name || k}</option>)}
                </select>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
                    <button onClick={handleSaveAll} className="btn-primary" disabled={saving}>{saving ? 'Saving...' : '💾 SAVE'}</button>
                    <button onClick={resetLayout} className="btn-secondary">↻ RESET</button>
                </div>

                <h3 className="panel-title" style={{ marginTop: '20px' }}>LINES & SHAPES</h3>
                <div className="button-grid">
                    <button onClick={() => addLine('horizontal')} className="btn-secondary">─ LINE H</button>
                    <button onClick={() => addLine('vertical')} className="btn-secondary">│ LINE V</button>
                    <button onClick={addShape} className="btn-secondary">square SHAPE</button>
                </div>

                <h3 className="panel-title" style={{ marginTop: '20px' }}>GLOBAL FONT</h3>
                <select value={styleConfig.globalFontFamily || 'Helvetica'} onChange={(e) => handleGlobalStyleChange('globalFontFamily', e.target.value)} className="control-select">
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Inter">Inter</option>
                </select>
            </div>

            {/* MIDDLE - DOM PREVIEW */}
            <div className="canvas-container" style={{ flex: 1, position: 'relative', overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#1a1a1a', padding: '40px' }}>
                <div className="dom-canvas-wrapper" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Page 1 */}
                    <div className="page-view" style={{ width: '595px', height: '842px', background: 'white', position: 'relative', color: '#000', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }} onClick={() => { setSelectedSection(null); setSelectedLine(null); setSelectedShape(null); if (dragInfo.current) dragInfo.current.isLocked = false; }}>
                        {page1Elements.shapes.map(s => (
                            <div key={s.id}
                                ref={el => shapeRefs.current[s.id] = el}
                                onPointerEnter={() => { if (!dragInfo.current.active && !dragInfo.current.isLocked) setSelectedShape(s.id); }}
                                onPointerLeave={() => { if (!dragInfo.current.active && selectedShape === s.id && !dragInfo.current.isLocked) setSelectedShape(null); }}
                                onPointerDown={(e) => {
                                    handlePointerDown(e, 'shape', s.id);
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dragInfo.current.isLocked = true;
                                    setSelectedShape(s.id); setSelectedSection(null); setSelectedLine(null);
                                }}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                style={{ position: 'absolute', left: s.x, top: s.y, width: s.width, height: s.height, background: s.color, border: selectedShape === s.id ? '2px solid #3b82f6' : 'none', zIndex: selectedShape === s.id ? 105 : 1, cursor: 'move', touchAction: 'none' }} />
                        ))}
                        {page1Elements.lines.map(l => (
                            <div key={l.id}
                                ref={el => lineRefs.current[l.id] = el}
                                onPointerEnter={() => { if (!dragInfo.current.active && !dragInfo.current.isLocked) setSelectedLine(l.id); }}
                                onPointerLeave={() => { if (!dragInfo.current.active && selectedLine === l.id && !dragInfo.current.isLocked) setSelectedLine(null); }}
                                onPointerDown={(e) => {
                                    handlePointerDown(e, 'line', l.id);
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dragInfo.current.isLocked = true;
                                    setSelectedLine(l.id); setSelectedSection(null); setSelectedShape(null);
                                }}
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                                style={{ position: 'absolute', left: l.x1, top: l.y1, width: l.orientation === 'horizontal' ? Math.abs(l.x2 - l.x1) : l.thickness, height: l.orientation === 'vertical' ? Math.abs(l.y2 - l.y1) : l.thickness, background: l.color, border: selectedLine === l.id ? '2px solid #3b82f6' : 'none', zIndex: selectedLine === l.id ? 106 : 2, cursor: 'move', touchAction: 'none' }} />
                        ))}
                        {page1Elements.sections.map(([name, pos]) => renderSection(name, pos, 0))}
                        <div style={{ position: 'absolute', bottom: '-25px', width: '100%', textAlign: 'center', color: '#666', fontSize: '12px' }}>Page 1</div>
                    </div>

                    {/* Page 2 */}
                    {showPage2 && (
                        <div className="page-view" style={{ width: '595px', height: '842px', background: 'white', position: 'relative', color: '#000', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }} onClick={() => { setSelectedSection(null); setSelectedLine(null); setSelectedShape(null); if (dragInfo.current) dragInfo.current.isLocked = false; }}>
                            {page2Elements.shapes.map(s => (
                                <div key={s.id}
                                    ref={el => shapeRefs.current[s.id] = el}
                                    onPointerEnter={() => { if (!dragInfo.current.active && !dragInfo.current.isLocked) setSelectedShape(s.id); }}
                                    onPointerLeave={() => { if (!dragInfo.current.active && selectedShape === s.id && !dragInfo.current.isLocked) setSelectedShape(null); }}
                                    onPointerDown={(e) => {
                                        handlePointerDown(e, 'shape', s.id);
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dragInfo.current.isLocked = true;
                                        setSelectedShape(s.id); setSelectedSection(null); setSelectedLine(null);
                                    }}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                    style={{ position: 'absolute', left: s.x, top: s.y - 842, width: s.width, height: s.height, background: s.color, border: selectedShape === s.id ? '2px solid #3b82f6' : 'none', zIndex: selectedShape === s.id ? 105 : 1, cursor: 'move', touchAction: 'none' }} />
                            ))}
                            {page2Elements.lines.map(l => (
                                <div key={l.id}
                                    ref={el => lineRefs.current[l.id] = el}
                                    onPointerEnter={() => { if (!dragInfo.current.active && !dragInfo.current.isLocked) setSelectedLine(l.id); }}
                                    onPointerLeave={() => { if (!dragInfo.current.active && selectedLine === l.id && !dragInfo.current.isLocked) setSelectedLine(null); }}
                                    onPointerDown={(e) => {
                                        handlePointerDown(e, 'line', l.id);
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dragInfo.current.isLocked = true;
                                        setSelectedLine(l.id); setSelectedSection(null); setSelectedShape(null);
                                    }}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={handlePointerUp}
                                    style={{ position: 'absolute', left: l.x1, top: l.y1 - 842, width: l.orientation === 'horizontal' ? Math.abs(l.x2 - l.x1) : l.thickness, height: l.orientation === 'vertical' ? Math.abs(l.y2 - l.y1) : l.thickness, background: l.color, border: selectedLine === l.id ? '2px solid #3b82f6' : 'none', zIndex: selectedLine === l.id ? 106 : 2, cursor: 'move', touchAction: 'none' }} />
                            ))}
                            {page2Elements.sections.map(([name, pos]) => renderSection(name, pos, 842))}
                            <div style={{ position: 'absolute', bottom: '-25px', width: '100%', textAlign: 'center', color: '#666', fontSize: '12px' }}>Page 2</div>
                        </div>
                    )}
                </div>

                {/* Zoom Controls */}
                <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.8)', padding: '10px', borderRadius: '30px' }}>
                    <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} style={{ color: '#fff', border: 'none', background: 'none', padding: '5px 10px', cursor: 'pointer' }}>−</button>
                    <span style={{ color: '#fff', fontSize: '14px' }}>{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} style={{ color: '#fff', border: 'none', background: 'none', padding: '5px 10px', cursor: 'pointer' }}>+</button>
                    <button onClick={() => setShowPage2(!showPage2)} style={{ color: '#fff', fontSize: '12px', border: '1px solid #444', background: 'none', borderRadius: '15px', padding: '5px 15px', marginLeft: '10px' }}>{showPage2 ? 'Single Page' : 'Double Page'}</button>
                </div>
            </div>

            {/* RIGHT PANEL - STYLE EDITOR */}
            <div className="right-panel" style={{ overflowY: 'auto', padding: '15px', borderLeft: '1px solid #333' }}>
                <h3 className="panel-title">STYLE CONTROLS</h3>
                {selectedSection ? (
                    <div>
                        <div style={{ background: '#333', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>Editing: <strong>{selectedSection.toUpperCase()}</strong></div>
                        <div className="control-group">
                            <label className="control-label">X Position</label>
                            <input type="number" value={Math.round(sectionPositions[selectedSection]?.x || 0)} onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                setSectionPositions(prev => ({ ...prev, [selectedSection]: { ...prev[selectedSection], x: val } }));
                            }} className="control-input" />
                        </div>
                        <div className="control-group">
                            <label className="control-label">Y Position</label>
                            <input type="number" value={Math.round(sectionPositions[selectedSection]?.y || 0)} onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                setSectionPositions(prev => ({ ...prev, [selectedSection]: { ...prev[selectedSection], y: val } }));
                            }} className="control-input" />
                        </div>
                        <div className="control-group">
                            <label className="control-label">Width</label>
                            <input type="text" value={sectionWidths[selectedSection] || '515px'} onChange={(e) => setSectionWidths(prev => ({ ...prev, [selectedSection]: e.target.value }))} className="control-input" />
                        </div>

                        <div className="arrow-grid" style={{ marginTop: '20px' }}>
                            <div></div><button onClick={() => moveSection(selectedSection, 'up')} className="btn-arrow">↑</button><div></div>
                            <button onClick={() => moveSection(selectedSection, 'left')} className="btn-arrow">←</button>
                            <div style={{ textAlign: 'center', fontSize: '10px' }}>NUDGE</div>
                            <button onClick={() => moveSection(selectedSection, 'right')} className="btn-arrow">→</button>
                            <div></div><button onClick={() => moveSection(selectedSection, 'down')} className="btn-arrow">↓</button><div></div>
                        </div>
                    </div>
                ) : selectedShape ? (
                    <div>
                        <div style={{ background: '#333', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>Editing: <strong>{(backgroundShapes.find(s => s.id === selectedShape)?.label || 'SHAPE').toUpperCase()}</strong></div>
                        <div className="control-group">
                            <label className="control-label">Label</label>
                            <input type="text" value={backgroundShapes.find(s => s.id === selectedShape)?.label || ''} onChange={(e) => updateShape(selectedShape, 'label', e.target.value)} className="control-input" />
                        </div>
                        <div className="control-group">
                            <label className="control-label">X Position</label>
                            <input type="number" value={Math.round(backgroundShapes.find(s => s.id === selectedShape)?.x || 0)} onChange={(e) => updateShape(selectedShape, 'x', parseInt(e.target.value))} className="control-input" />
                        </div>
                        <div className="control-group">
                            <label className="control-label">Y Position</label>
                            <input type="number" value={Math.round(backgroundShapes.find(s => s.id === selectedShape)?.y || 0)} onChange={(e) => updateShape(selectedShape, 'y', parseInt(e.target.value))} className="control-input" />
                        </div>
                        <div className="control-group">
                            <label className="control-label">Width</label>
                            <input type="number" value={backgroundShapes.find(s => s.id === selectedShape)?.width} onChange={(e) => updateShape(selectedShape, 'width', parseInt(e.target.value))} className="control-input" />
                        </div>
                        <div className="control-group">
                            <label className="control-label">Height</label>
                            <input type="number" value={backgroundShapes.find(s => s.id === selectedShape)?.height} onChange={(e) => updateShape(selectedShape, 'height', parseInt(e.target.value))} className="control-input" />
                        </div>
                        <div className="control-group">
                            <label className="control-label">Background Color</label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input type="color" value={normalizeColorForInput(backgroundShapes.find(s => s.id === selectedShape)?.color)} onChange={(e) => updateShape(selectedShape, 'color', e.target.value)} style={{ width: '50px', height: '32px' }} />
                                <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>{backgroundShapes.find(s => s.id === selectedShape)?.color}</span>
                            </div>
                        </div>

                        <div className="arrow-grid" style={{ marginTop: '20px' }}>
                            <div></div><button onClick={() => {
                                const s = backgroundShapes.find(sh => sh.id === selectedShape);
                                updateShape(selectedShape, 'y', s.y - 2);
                            }} className="btn-arrow">↑</button><div></div>
                            <button onClick={() => {
                                const s = backgroundShapes.find(sh => sh.id === selectedShape);
                                updateShape(selectedShape, 'x', s.x - 2);
                            }} className="btn-arrow">←</button>
                            <div style={{ textAlign: 'center', fontSize: '10px' }}>NUDGE</div>
                            <button onClick={() => {
                                const s = backgroundShapes.find(sh => sh.id === selectedShape);
                                updateShape(selectedShape, 'x', s.x + 2);
                            }} className="btn-arrow">→</button>
                            <div></div><button onClick={() => {
                                const s = backgroundShapes.find(sh => sh.id === selectedShape);
                                updateShape(selectedShape, 'y', s.y + 2);
                            }} className="btn-arrow">↓</button><div></div>
                        </div>

                        <button onClick={() => {
                            setBackgroundShapes(backgroundShapes.filter(s => s.id !== selectedShape));
                            setSelectedShape(null);
                        }} className="btn-secondary" style={{ width: '100%', marginTop: '20px', color: '#ff4d4d', borderColor: '#ff4d4d' }}>
                            🗑 DELETE SHAPE
                        </button>
                    </div>
                ) : selectedLine ? (
                    <div>
                        <div style={{ background: '#333', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>Editing: <strong>{(lines.find(l => l.id === selectedLine)?.label || 'LINE').toUpperCase()}</strong></div>
                        <div className="control-group">
                            <label className="control-label">Label</label>
                            <input type="text" value={lines.find(l => l.id === selectedLine)?.label || ''} onChange={(e) => updateLine(selectedLine, 'label', e.target.value)} className="control-input" />
                        </div>
                        <div className="control-group">
                            <label className="control-label">Thickness</label>
                            <input type="number" step="0.5" value={lines.find(l => l.id === selectedLine)?.thickness} onChange={(e) => updateLine(selectedLine, 'thickness', parseFloat(e.target.value))} className="control-input" />
                        </div>
                        <div className="control-group">
                            <label className="control-label">Color</label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input type="color" value={normalizeColorForInput(lines.find(l => l.id === selectedLine)?.color)} onChange={(e) => updateLine(selectedLine, 'color', e.target.value)} style={{ width: '50px', height: '32px' }} />
                                <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>{lines.find(l => l.id === selectedLine)?.color}</span>
                            </div>
                        </div>

                        <div className="arrow-grid" style={{ marginTop: '20px' }}>
                            <div></div><button onClick={() => {
                                const l = lines.find(li => li.id === selectedLine);
                                updateLine(selectedLine, 'y1', l.y1 - 2); updateLine(selectedLine, 'y2', l.y2 - 2);
                            }} className="btn-arrow">↑</button><div></div>
                            <button onClick={() => {
                                const l = lines.find(li => li.id === selectedLine);
                                updateLine(selectedLine, 'x1', l.x1 - 2); updateLine(selectedLine, 'x2', l.x2 - 2);
                            }} className="btn-arrow">←</button>
                            <div style={{ textAlign: 'center', fontSize: '10px' }}>NUDGE</div>
                            <button onClick={() => {
                                const l = lines.find(li => li.id === selectedLine);
                                updateLine(selectedLine, 'x1', l.x1 + 2); updateLine(selectedLine, 'x2', l.x2 + 2);
                            }} className="btn-arrow">→</button>
                            <div></div><button onClick={() => {
                                const l = lines.find(li => li.id === selectedLine);
                                updateLine(selectedLine, 'y1', l.y1 + 2); updateLine(selectedLine, 'y2', l.y2 + 2);
                            }} className="btn-arrow">↓</button><div></div>
                        </div>

                        <button onClick={() => {
                            setLines(lines.filter(l => l.id !== selectedLine));
                            setSelectedLine(null);
                        }} className="btn-secondary" style={{ width: '100%', marginTop: '20px', color: '#ff4d4d', borderColor: '#ff4d4d' }}>
                            🗑 DELETE LINE
                        </button>
                    </div>
                ) : (
                    <div style={{ color: '#666', textAlign: 'center', marginTop: '40px' }}>Select an item to edit its properties</div>
                )}
            </div>
        </div>
    );
};

export default UIEditor;