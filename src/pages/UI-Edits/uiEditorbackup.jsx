
import React, { useState, useRef, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";
import { useSelector } from "react-redux";
import { mergeResumeData } from "./Utils";
import { ATS_TEMPLATE_CONFIG, MODERN_TEMPLATE_CONFIG, TWO_COLUMN_TEMPLATE_CONFIG, TEMPLATE5_CONFIG } from "./TemplateConfigs";
import { defaultResumeData } from "./Utils";
import "./UIEditor.css";
import {
  FlexibleCertificationsSection, FlexibleContactSection,
  FlexibleEducationSection, FlexibleExperienceSection,
  FlexibleHeaderSection, FlexibleProjectsSection,
  FlexibleSkillsSection, FlexibleSummarySection
} from "./BaseTemplates.jsx";



import { Stage, Layer, Image as KonvaImage, Line, Rect, Transformer, Text } from 'react-konva';


// ==================== MAIN UI EDITOR COMPONENT ====================

const UIEditor = () => {
  // Refs
  const stageRef = useRef(null);
  const stage2Ref = useRef(null);
  const sectionRefs = useRef({});


  // State
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showPage2, setShowPage2] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [sectionPositions, setSectionPositions] = useState({});
  const [lines, setLines] = useState([]);
  const [backgroundShapes, setBackgroundShapes] = useState([]);
  const [nextLineId, setNextLineId] = useState(1);
  const [nextShapeId, setNextShapeId] = useState(1);
  const [currentTemplate, setCurrentTemplate] = useState('ats');
  const [sectionWidths, setSectionWidths] = useState({});
  const [styleConfig, setStyleConfig] = useState(ATS_TEMPLATE_CONFIG);
  const [sectionImages, setSectionImages] = useState({});
  const [TemplateComponents, setTemplateComponents] = useState(null);
  const [resumeData, setResumeData] = useState(defaultResumeData);
  const currentResume = useSelector((state) => state.resume.currentResume);

  const [resumeDetails, setResumeDetails] = useState(defaultResumeData);

  // Mobile responsiveness state
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('controls'); // 'controls' | 'properties'

  // Mobile detection effect
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setZoom(0.55); // A better default for mobile width
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!currentResume) return;
    setResumeData(currentResume);
  }, [currentResume])

  const TEMPLATES = {
    ats: ATS_TEMPLATE_CONFIG,
    modern: MODERN_TEMPLATE_CONFIG,
    twoColumn: TWO_COLUMN_TEMPLATE_CONFIG,
    template5: TEMPLATE5_CONFIG
  };

  // Initialize template on mount

  useEffect(() => {
    const defaultTemplate = TEMPLATES['ats'];
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
  }, []);


  // ==================== USE EFFECTS ====================

  // Initialize template components
  useEffect(() => {
    console.log('Initializing template components...');

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

    // Initialize section refs
    const sections = ['header', 'contact', 'summary', 'skills', 'experience', 'education', 'projects', 'certifications'];
    sections.forEach(section => {
      if (!sectionRefs.current[section]) {
        sectionRefs.current[section] = React.createRef();
      }
    });

    console.log('Template components initialized');
  }, []);



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


  // Handle width change
  const handleWidthChange = (sectionName, value) => {
    setSectionWidths(prev => ({
      ...prev,
      [sectionName]: value
    }));
  };


  const [sectionHeights, setSectionHeights] = useState({});

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

  // Handle style changes
  const handleStyleChange = (sectionName, styleType, value, property) => {
    setStyleConfig(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [styleType]: {
          ...prev[sectionName]?.[styleType],
          [property]: value
        }
      }
    }));
  };

  // Add these helper methods to your component

  const handleHeaderLayoutChange = (key, value) => {
    setStyleConfig(prev => ({
      ...prev,
      header: {
        ...prev.header,
        [key]: value
      }
    }));
  };

  const handleHeaderStyleChange = (styleKey, property, value) => {
    setStyleConfig(prev => ({
      ...prev,
      header: {
        ...prev.header,
        [styleKey]: {
          ...prev.header?.[styleKey],
          [property]: value
        }
      }
    }));
  };

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
  //   const template = TEMPLATES[currentTemplate];
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


  // Reset Layout - UPDATED
  const resetLayout = () => {
    const template = TEMPLATES[currentTemplate];
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
  const downloadResume = () => {
    if (!stageRef.current) return;

    const uri1 = stageRef.current.toDataURL({ pixelRatio: 5 });
    const link1 = document.createElement('a');
    link1.download = 'resume-page1.png';
    link1.href = uri1;
    link1.click();

    if (showPage2 && stage2Ref.current) {
      setTimeout(() => {
        const uri2 = stage2Ref.current.toDataURL({ pixelRatio: 5 });
        const link2 = document.createElement('a');
        link2.download = 'resume-page2.png';
        link2.href = uri2;
        link2.click();
      }, 100);
    }
  };

  // Handle canvas click (deselect)
  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedLine(null);
      setSelectedShape(null);
      setSelectedSection(null);
    }
  };

  // Separate elements by page
  const getElementsForPage = (pageNum) => {
    const pageStart = (pageNum - 1) * 842;
    const pageEnd = pageNum * 842;

    return {
      sections: Object.entries(sectionPositions || {}).filter(([_, pos]) => {
        return pos && pos.y >= pageStart && pos.y < pageEnd;
      }),
      lines: (lines || []).filter(line => {
        return (line.y1 >= pageStart && line.y1 < pageEnd) ||
          (line.y2 >= pageStart && line.y2 < pageEnd);
      }),
      shapes: (backgroundShapes || []).filter(shape => {
        return (shape.y >= pageStart && shape.y < pageEnd) ||
          (shape.y + shape.height > pageStart && shape.y < pageEnd);
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


  const handleTemplateSwitch = (templateName) => {
    setCurrentTemplate(templateName);
    const template = TEMPLATES[templateName];
    console.log(template);

    setStyleConfig(template);
    setSectionPositions(template.positions || {});

    const { widths, heights } = extractWidthsAndHeightsFromConfig(template);
    setSectionWidths(widths);
    setSectionHeights(heights);

    setLines(template.lines || []);
    setBackgroundShapes(template.shapes || []);
    setZoom(1);
    setSelectedLine(null);
    setSelectedShape(null);
    setSelectedSection(null);

    // Reset counters
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
  };

  // Delete line
  const deleteLine = (id) => {
    setLines(lines.filter(line => line.id !== id));
    if (selectedLine === id) setSelectedLine(null);
  };

  // Update line property
  const updateLine = (id, property, value) => {
    setLines(lines.map(line =>
      line.id === id ? { ...line, [property]: value } : line
    ));
  };

  // Move line
  const moveLine = (id, direction) => {
    const step = 10;
    setLines(lines.map(line => {
      if (line.id !== id) return line;

      switch (direction) {
        case 'up':
          return { ...line, y1: line.y1 - step, y2: line.y2 - step };
        case 'down':
          return { ...line, y1: line.y1 + step, y2: line.y2 + step };
        case 'left':
          return { ...line, x1: line.x1 - step, x2: line.x2 - step };
        case 'right':
          return { ...line, x1: line.x1 + step, x2: line.x2 + step };
        default:
          return line;
      }
    }));
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
  };

  // Handle line drag end
  const handleLineDragEnd = (id, newPos) => {
    setLines(lines.map(line =>
      line.id === id ? { ...line, ...newPos } : line
    ));
  };

  // Handle line update
  const handleLineUpdate = (id, updates) => {
    setLines(lines.map(line =>
      line.id === id ? { ...line, ...updates } : line
    ));
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
  };

  // Delete background shape
  const deleteBackgroundShape = (id) => {
    setBackgroundShapes(backgroundShapes.filter(shape => shape.id !== id));
    if (selectedShape === id) setSelectedShape(null);
  };

  // Update background shape property
  const updateBackgroundShape = (id, property, value) => {
    setBackgroundShapes(backgroundShapes.map(shape =>
      shape.id === id ? { ...shape, [property]: value } : shape
    ));
  };

  // Handle shape drag end
  const handleShapeDragEnd = (id, newPos) => {
    setBackgroundShapes(backgroundShapes.map(shape =>
      shape.id === id ? { ...shape, x: newPos.x, y: newPos.y } : shape
    ));
  };

  // Handle shape update
  const handleShapeUpdate = (id, updates) => {
    setBackgroundShapes(backgroundShapes.map(shape =>
      shape.id === id ? { ...shape, ...updates } : shape
    ));
  };




  // ==================== SECTION FUNCTIONS ====================

  // Handle section drag end
  const handleSectionDragEnd = (sectionName, newPos) => {
    setSectionPositions(prev => ({
      ...prev,
      [sectionName]: newPos
    }));
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

    // Update WIDTH
    if (newAttrs.width) {
      const widthPx = `${Math.round(newAttrs.width)}px`;

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
  };

  // Auto-flow sections - WITH PAGINATION
  const autoFlowSections = () => {
    let currentY = 50;
    const spacing = 20;
    const PAGE_HEIGHT = 842;
    const PAGE_MARGIN = 50;
    let currentPage = 1;

    // Sort by current Y position to maintain relative order
    const sortedSections = Object.keys(sectionPositions).sort((a, b) => {
      const posA = sectionPositions[a];
      const posB = sectionPositions[b];
      return (posA?.y || 0) - (posB?.y || 0);
    });

    const newPositions = {};

    sortedSections.forEach(sectionName => {
      const img = sectionImages[sectionName];
      const height = img ? img.height : 100;
      const currentX = sectionPositions[sectionName]?.x || 40;

      // Check if we need to break to next page
      // If currentY + height exceeds page boundary
      if (currentPage === 1 && (currentY + height) > (PAGE_HEIGHT - PAGE_MARGIN)) {
        currentPage = 2;
        currentY = PAGE_HEIGHT + PAGE_MARGIN; // Start at Page 2 top (842 + 50)
        setShowPage2(true);
      }

      newPositions[sectionName] = {
        x: currentX, // Keep X position (respect columns)
        y: currentY
      };

      currentY += height + spacing;
    });

    setSectionPositions(newPositions);
  };



  // ==================== DRAGGABLE COMPONENTS ====================

  // Draggable Line Component
  const DraggableLine = ({ line, onDragEnd, onUpdate, isSelected, onSelect }) => {
    const lineRef = useRef();
    const trRef = useRef();

    useEffect(() => {
      if (isSelected && trRef.current && lineRef.current) {
        trRef.current.nodes([lineRef.current]);
        trRef.current.getLayer().batchDraw();
      }
    }, [isSelected]);

    return (
      <>
        <Line
          ref={lineRef}
          points={[line.x1, line.y1, line.x2, line.y2]}
          stroke={line.color}
          strokeWidth={line.thickness}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => {
            const node = e.target;
            node.scaleX(1);
            node.scaleY(1);

            const dx = node.x();
            const dy = node.y();

            onDragEnd(line.id, {
              x1: line.x1 + dx,
              y1: line.y1 + dy,
              x2: line.x2 + dx,
              y2: line.y2 + dy
            });

            node.position({ x: 0, y: 0 });
          }}
          onTransformEnd={() => {
            const node = lineRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);

            onUpdate(line.id, {
              x2: line.x1 + (line.x2 - line.x1) * scaleX,
              y2: line.y1 + (line.y2 - line.y1) * scaleY
            });
          }}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            rotateEnabled={false}
            enabledAnchors={line.orientation === 'horizontal' ? ['middle-left', 'middle-right'] : ['top-center', 'bottom-center']}
          />
        )}
      </>
    );
  };

  // Draggable Shape Component
  const DraggableShape = ({ shape, onDragEnd, onUpdate, isSelected, onSelect }) => {
    const shapeRef = useRef();
    const trRef = useRef();

    useEffect(() => {
      if (isSelected && trRef.current && shapeRef.current) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer().batchDraw();
      }
    }, [isSelected]);

    return (
      <>
        <Rect
          ref={shapeRef}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          fill={shape.color}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => {
            onDragEnd(shape.id, {
              x: Math.round(e.target.x()),
              y: Math.round(e.target.y())
            });
          }}
          onTransformEnd={() => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);

            onUpdate(shape.id, {
              width: Math.max(10, Math.round(shape.width * scaleX)),
              height: Math.max(10, Math.round(shape.height * scaleY))
            });
          }}
        />
        {isSelected && <Transformer ref={trRef} rotateEnabled={false} />}
      </>
    );
  };

  // Draggable Section Component - WITH VISIBLE RESIZE HANDLES
  const DraggableSection = ({ sectionName, image, position, onDragEnd, onTransform, isSelected, onSelect }) => {
    const imageRef = useRef();
    const trRef = useRef();

    useEffect(() => {
      if (isSelected && trRef.current && imageRef.current) {
        trRef.current.nodes([imageRef.current]);
        trRef.current.getLayer().batchDraw();
      }
    }, [isSelected]);

    if (!image) return null;

    return (
      <>
        <KonvaImage
          ref={imageRef}
          image={image}
          x={position.x}
          y={position.y}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => {
            onDragEnd(sectionName, {
              x: Math.round(e.target.x()),
              y: Math.round(e.target.y())
            });
          }}
          onTransformEnd={() => {
            const node = imageRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            const newWidth = Math.max(50, Math.round(node.width() * scaleX));
            const newHeight = Math.max(20, Math.round(node.height() * scaleY));

            onTransform(sectionName, {
              x: Math.round(node.x()),
              y: Math.round(node.y()),
              width: newWidth,
              height: newHeight
            });

            node.scaleX(1);
            node.scaleY(1);
          }}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            rotateEnabled={false}
            keepRatio={false}
            enabledAnchors={[
              'top-left',
              'top-center',
              'top-right',
              'middle-right',
              'bottom-right',
              'bottom-center',
              'bottom-left',
              'middle-left'
            ]}
            // Make anchors MORE VISIBLE
            anchorSize={10}
            anchorStroke="#3b82f6"
            anchorFill="#ffffff"
            anchorStrokeWidth={2}
            anchorCornerRadius={2}
            borderStroke="#3b82f6"
            borderStrokeWidth={2}
            borderDash={[4, 4]}
            boundBoxFunc={(oldBox, newBox) => {
              // Minimum sizes
              if (newBox.width < 50) {
                newBox.width = 50;
              }
              if (newBox.height < 20) {
                newBox.height = 20;
              }
              return newBox;
            }}
          />
        )}
      </>
    );
  };



  // ==================== USE EFFECTS ====================

  // Initialize template components


  useEffect(() => {
    if (!TemplateComponents || !resumeData) return;

    const renderSectionToImage = async (sectionName) => {
      const ref = sectionRefs.current[sectionName];
      if (!ref?.current) {
        console.warn(`No ref found for ${sectionName}`);
        return;
      }

      const element = ref.current;

      try {
        // Wait for fonts to load
        await document.fonts.ready;

        // Force layout recalculation
        element.offsetHeight; // Trigger reflow

        // Small delay to ensure all styles are applied
        await new Promise(resolve => setTimeout(resolve, 100));

        // Capture with proper options
        const canvas = await html2canvas(element, {
          backgroundColor: null,
          scale: 8, // Optimized for parallel rendering speed while keeping high quality
          logging: false,
          useCORS: true,
          allowTaint: true,
          height: element.offsetHeight,

          letterRendering: true,
          imageTimeout: 0,

          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.querySelector(`[data-section="${sectionName}"]`);
            if (clonedElement) {
              clonedElement.style.opacity = '1';
              clonedElement.style.visibility = 'visible';
              clonedElement.style.display = 'block';
            }
          }
        });

        // Convert canvas to image
        const img = new Image();
        img.width = element.offsetWidth;
        img.height = element.offsetHeight;

        img.onload = () => {
          console.log(`✓ Rendered ${sectionName}: ${img.width}x${img.height}`);
          setSectionImages(prev => ({ ...prev, [sectionName]: img }));
        };

        img.onerror = (err) => {
          console.error(`Failed to render ${sectionName}:`, err);
        };

        img.src = canvas.toDataURL('image/png', 1.0);

      } catch (error) {
        console.error(`Error rendering ${sectionName}:`, error);
      }
    };

    // Render all sections in parallel
    const renderAllSections = async () => {
      const sections = Object.keys(sectionRefs.current);

      // Trigger all renders simultaneously
      await Promise.all(sections.map(sectionName => renderSectionToImage(sectionName)));

      console.log('✓ All sections rendered in parallel');
    };

    // Wait for React to render components, then capture
    const timer = setTimeout(() => {
      renderAllSections();
    }, 500);

    return () => clearTimeout(timer);
    // ❌ CRITICAL: Add ALL these dependencies so preview updates when you change styles
  }, [
    TemplateComponents,
    styleConfig,        // ← This makes it re-render when you change styles in panel
    resumeData,
    sectionWidths,      // ← Updates when width changes
    sectionHeights      // ← Updates when height changes
  ]);




  // Initialize layout on mount
  useEffect(() => {
    console.log('Initial layout reset');
    resetLayout();
  }, [currentTemplate]);

  // Calculate page elements
  const page1Elements = getElementsForPage(1);
  const page2Elements = showPage2 ? getElementsForPage(2) : { sections: [], lines: [], shapes: [] };




  // ==================== JSX RETURN ====================

  return (
    <div className="editor-container">
      {/* Mobile Tab Navigation */}
      {isMobile && (
        <div className="mobile-tabs">
          <button
            className={`mobile-tab ${activeTab === 'controls' ? 'active' : ''}`}
            onClick={() => setActiveTab('controls')}
          >
            Controls
          </button>
          <button
            className={`mobile-tab ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            Styles
          </button>
        </div>
      )}

      {/* Hidden rendering area */}


      {/* Hidden rendering area - NOW VISIBLE FOR COMPARISON */}
      <div className="hidden-render" style={{ position: 'fixed', right: '10px', top: '100px', visibility: 'hidden', width: '794px', background: 'white', border: '3px solid #ff6b6b', borderRadius: '8px', padding: '10px', maxHeight: '80vh', overflowY: 'auto', zIndex: -10000, pointerEvents: 'none' }}>
        {TemplateComponents && Object.entries(sectionRefs.current).map(([key, ref]) => {
          const Component = TemplateComponents[key];
          if (!Component) return null;

          // Map data according to your FlexibleSection component props
          const propsMap = {
            header: { resumeDetails: resumeData?.resumeDetails, styleConfig: styleConfig },
            contact: { resumeDetails: resumeData?.resumeDetails, styleConfig: styleConfig },
            summary: { summary: resumeData?.resumeDetails?.summary, styleConfig: styleConfig },
            skills: { skills: resumeData?.skills, styleConfig: styleConfig },
            experience: { experiences: resumeData?.experiences, styleConfig: styleConfig },
            projects: { projects: resumeData?.projects, styleConfig: styleConfig },
            education: { educationList: resumeData?.educationList, styleConfig: styleConfig },
            certifications: { certifications: resumeData?.certifications, styleConfig: styleConfig }
          };

          return (
            // <div key={key} ref={ref} style={{ width: styleConfig[key]?.container?.width || 'auto' }}>
            //   <Component {...propsMap[key]} />
            // </div>
            <div key={key} ref={ref} data-section={key} style={{
              width: styleConfig[key]?.container?.width || 'auto',
              height: styleConfig[key]?.container?.height || 'auto',
              minHeight: styleConfig[key]?.container?.height || 'auto',
              maxHeight: styleConfig[key]?.container?.height || 'none',
              overflow: 'visible',
              boxSizing: 'border-box',
              position: 'relative',
              minWidth: 0,
            }}>
              <Component {...propsMap[key]} />
            </div>
          );
        })}
      </div>



      {/* LEFT PANEL - Section Controls */}
      <div className={`left-panel ${isMobile && activeTab !== 'controls' ? 'mobile-hidden' : ''}`}>
        <h3 className="panel-title">TEMPLATE SELECT</h3>

        {TEMPLATES && Object.keys(TEMPLATES).length > 0 && (
          <div className="control-group">
            <label className="control-label">Choose Template</label>
            <select
              value={currentTemplate}
              onChange={(e) => handleTemplateSwitch(e.target.value)}
              className="control-select"
            >
              {Object.keys(TEMPLATES).map(key => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* BACKGROUND SHAPES SECTION */}
        <h3 className="panel-title">BACKGROUND ZONES</h3>
        <button onClick={addShape} className="btn-primary full-width">
          + ADD BACKGROUND SHAPE
        </button>

        {backgroundShapes.length > 0 && backgroundShapes.map(shape => (
          <div key={shape.id} className={`shape-control ${selectedShape === shape.id ? 'selected' : ''}`}>
            <div className="line-header">
              <span className="line-label">{shape.label}</span>
              <button onClick={() => deleteBackgroundShape(shape.id)} className="btn-delete">✕</button>
            </div>

            <div className="shape-properties">
              <div className="property-control">
                <label className="control-label">X Position</label>
                <input
                  type="number"
                  value={shape.x}
                  onChange={(e) => updateBackgroundShape(shape.id, 'x', parseInt(e.target.value))}
                  className="control-input"
                />
              </div>
              <div className="property-control">
                <label className="control-label">Y Position</label>
                <input
                  type="number"
                  value={shape.y}
                  onChange={(e) => updateBackgroundShape(shape.id, 'y', parseInt(e.target.value))}
                  className="control-input"
                />
              </div>
              <div className="property-control">
                <label className="control-label">Width</label>
                <input
                  type="number"
                  value={shape.width}
                  onChange={(e) => updateBackgroundShape(shape.id, 'width', parseInt(e.target.value))}
                  className="control-input"
                />
              </div>
              <div className="property-control">
                <label className="control-label">Height</label>
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



        <h3 className="panel-title">SECTION SIZES & POSITIONS</h3>
        <div className="section-widths-container">
          {Object.keys(sectionWidths).map(sectionName => {
            const isTransparent = styleConfig[sectionName]?.container?.backgroundColor === 'transparent';
            const position = sectionPositions[sectionName] || { x: 0, y: 0 };
            const isOnPage2 = position.y >= 800;
            return (
              <details key={sectionName} className="section-detail" open>
                <summary className="section-summary">
                  {sectionName}
                  {isTransparent && <span className="transparent-badge">TRANSPARENT</span>}
                  {isOnPage2 && <span className="transparent-badge" style={{ background: '#3b82f6' }}>PAGE 2</span>}
                </summary>

                <div className="position-controls-wrapper">
                  <div className="position-grid-layout">
                    <div className="control-item">
                      <label className="control-label-small">X Position</label>
                      <input
                        type="number"
                        value={Math.round(position.x)}
                        onChange={(e) => {
                          setSectionPositions(p => ({
                            ...p,
                            [sectionName]: { ...p[sectionName], x: parseInt(e.target.value) || 0 }
                          }));
                        }}
                        className="control-input-small"
                      />
                    </div>
                    <div className="control-item">
                      <label className="control-label-small">Y Position</label>
                      <input
                        type="number"
                        value={Math.round(position.y)}
                        onChange={(e) => {
                          setSectionPositions(p => ({
                            ...p,
                            [sectionName]: { ...p[sectionName], y: parseInt(e.target.value) || 0 }
                          }));
                        }}
                        className="control-input-small"
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => {
                        setSectionPositions(p => ({
                          ...p,
                          [sectionName]: { ...p[sectionName], y: 50 }
                        }));
                      }}
                      className="btn-secondary btn-page-nav"
                    >
                      → Page 1
                    </button>
                    <button
                      onClick={() => {
                        setSectionPositions(p => ({
                          ...p,
                          [sectionName]: { ...p[sectionName], y: 900 }
                        }));
                        setShowPage2(true);
                      }}
                      className="btn-secondary btn-page-nav"
                    >
                      → Page 2
                    </button>
                  </div>
                </div>

                <div className="section-controls-grid">
                  <div className="control-item">
                    <label className="control-label-small">Width (px)</label>
                    <input
                      type="text"
                      value={sectionWidths[sectionName]}
                      onChange={(e) => handleWidthChange(sectionName, e.target.value)}
                      onBlur={() => handleWidthBlur(sectionName)}
                      className="control-input-small"
                      placeholder="Width"
                    />
                  </div>



                  <div className="control-item">
                    <label className="control-label-small">Height (px)</label>
                    <input
                      type="text"
                      value={sectionHeights[sectionName] || '300px'}
                      onChange={(e) => handleHeightChange(sectionName, e.target.value)}
                      onBlur={() => handleHeightBlur(sectionName)}
                      className="control-input-small"
                      placeholder="auto or px"
                    />
                  </div>




                  <div className="control-item">
                    <label className="control-label-small">Padding (px)</label>
                    <input
                      type="number"
                      value={parseInt(styleConfig[sectionName]?.container?.padding) || 0}
                      onChange={(e) => {
                        const newPadding = `${e.target.value}px`;
                        handleStyleChange(sectionName, 'container', newPadding, 'padding');
                      }}
                      className="control-input-small"
                      min="0"
                      max="50"
                    />
                  </div>

                  <div className="control-item">
                    <label className="control-label-small">Background</label>
                    <div className="color-with-transparent">
                      <input
                        type="color"
                        value={styleConfig[sectionName]?.container?.backgroundColor === 'transparent' ? '#FFFFFF' : (styleConfig[sectionName]?.container?.backgroundColor || '#FFFFFF')}
                        onChange={(e) => handleStyleChange(sectionName, 'container', e.target.value, 'backgroundColor')}
                        className="control-color-small"
                        disabled={styleConfig[sectionName]?.container?.backgroundColor === 'transparent'}
                      />
                      <button
                        onClick={() => {
                          const currentBg = styleConfig[sectionName]?.container?.backgroundColor;
                          handleStyleChange(sectionName, 'container', currentBg === 'transparent' ? '#FFFFFF' : 'transparent', 'backgroundColor');
                        }}
                        className={`btn-transparent ${styleConfig[sectionName]?.container?.backgroundColor === 'transparent' ? 'active' : ''}`}
                        title="Toggle Transparent"
                      >
                        {styleConfig[sectionName]?.container?.backgroundColor === 'transparent' ? '⊘' : 'T'}
                      </button>
                    </div>
                  </div>

                  {styleConfig[sectionName]?.titleStyle && (
                    <>
                      <div className="control-item">
                        <label className="control-label-small">Title Size</label>
                        <input
                          type="number"
                          value={parseInt(styleConfig[sectionName]?.titleStyle?.fontSize) || 12}
                          onChange={(e) => handleStyleChange(sectionName, 'titleStyle', `${e.target.value}px`, 'fontSize')}
                          className="control-input-small"
                          min="8"
                          max="32"
                        />
                      </div>

                      <div className="control-item">
                        <label className="control-label-small">Title Color</label>
                        <input
                          type="color"
                          value={styleConfig[sectionName]?.titleStyle?.color || '#000000'}
                          onChange={(e) => handleStyleChange(sectionName, 'titleStyle', e.target.value, 'color')}
                          className="control-color-small"
                        />
                      </div>
                    </>
                  )}

                  {styleConfig[sectionName]?.bodyStyle && (
                    <>
                      <div className="control-item">
                        <label className="control-label-small">Body Size</label>
                        <input
                          type="number"
                          value={parseInt(styleConfig[sectionName]?.bodyStyle?.fontSize) || 10}
                          onChange={(e) => handleStyleChange(sectionName, 'bodyStyle', `${e.target.value}px`, 'fontSize')}
                          className="control-input-small"
                          min="6"
                          max="24"
                        />
                      </div>

                      <div className="control-item">
                        <label className="control-label-small">Body Color</label>
                        <input
                          type="color"
                          value={styleConfig[sectionName]?.bodyStyle?.color || '#000000'}
                          onChange={(e) => handleStyleChange(sectionName, 'bodyStyle', e.target.value, 'color')}
                          className="control-color-small"
                        />
                      </div>
                    </>
                  )}
                </div>
              </details>
            );
          })}
        </div>



        <button onClick={resetLayout} className="btn-primary full-width">
          ↻ RESET LAYOUT
        </button>

        <button onClick={autoFlowSections} className="btn-primary full-width btn-auto-flow-action">
          ⚡ AUTO-FLOW CONTENT
        </button>

        <div className="button-grid">
          <button onClick={downloadResume} className="btn-secondary">📥 PNG</button>
        </div>

        <h3 className="panel-title">DIVIDER LINES</h3>
        <div className="button-grid">
          <button onClick={() => addLine('horizontal')} className="btn-secondary">─ H</button>
          <button onClick={() => addLine('vertical')} className="btn-secondary">│ V</button>
        </div>

        {lines.length > 0 && lines.map(line => (
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
                  value={line.color}
                  onChange={(e) => updateLine(line.id, 'color', e.target.value)}
                  className="control-color"
                />
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* MIDDLE - Canvas */}
      <div className="canvas-container">
        <div className="canvas-scroll-wrapper">
          <div className="canvas-stack-layout">
            {/* Page 1 */}
            <div className="canvas-wrapper" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
              <Stage
                ref={stageRef}
                width={595}
                height={842}
                onClick={handleStageClick}
                onTap={handleStageClick}
              >
                {/* Background Layer */}
                <Layer>
                  {page1Elements.shapes.map(shape => (
                    <DraggableShape
                      key={shape.id}
                      shape={shape}
                      onDragEnd={handleShapeDragEnd}
                      onUpdate={handleShapeUpdate}
                      isSelected={selectedShape === shape.id}
                      onSelect={() => setSelectedShape(shape.id)}
                    />
                  ))}
                </Layer>

                {/* Lines Layer */}
                <Layer>
                  {page1Elements.lines.map(line => (
                    <DraggableLine
                      key={line.id}
                      line={line}
                      onDragEnd={handleLineDragEnd}
                      onUpdate={handleLineUpdate}
                      isSelected={selectedLine === line.id}
                      onSelect={() => setSelectedLine(line.id)}
                    />
                  ))}
                </Layer>

                {/* Content Layer */}
                <Layer>
                  {page1Elements.sections.map(([sectionName, pos]) => (
                    <DraggableSection
                      key={sectionName}
                      sectionName={sectionName}
                      image={sectionImages[sectionName]}
                      position={pos}
                      onDragEnd={handleSectionDragEnd}
                      onTransform={handleSectionTransform}
                      isSelected={selectedSection === sectionName}
                      onSelect={() => setSelectedSection(sectionName)}
                    />
                  ))}
                </Layer>
              </Stage>
              <div className="page-number">Page 1</div>
            </div>



            {/* Page 2 */}
            {showPage2 && (
              <div className="canvas-wrapper" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
                <Stage
                  ref={stage2Ref}
                  width={595}
                  height={842}
                  onClick={handleStageClick}
                  onTap={handleStageClick}
                >
                  <Layer>
                    {page2Elements.shapes.map(shape => {
                      const adjustedShape = { ...shape, y: shape.y - 842 };
                      return (
                        <DraggableShape
                          key={shape.id}
                          shape={adjustedShape}
                          onDragEnd={(id, pos) => handleShapeDragEnd(id, { ...pos, y: pos.y + 842 })}
                          onUpdate={handleShapeUpdate}
                          isSelected={selectedShape === shape.id}
                          onSelect={() => setSelectedShape(shape.id)}
                        />
                      );
                    })}
                  </Layer>

                  <Layer>
                    {page2Elements.lines.map(line => {
                      const adjustedLine = { ...line, y1: line.y1 - 842, y2: line.y2 - 842 };
                      return (
                        <DraggableLine
                          key={line.id}
                          line={adjustedLine}
                          onDragEnd={(id, pos) => handleLineDragEnd(id, {
                            x1: pos.x1, y1: pos.y1 + 842,
                            x2: pos.x2, y2: pos.y2 + 842
                          })}
                          onUpdate={handleLineUpdate}
                          isSelected={selectedLine === line.id}
                          onSelect={() => setSelectedLine(line.id)}
                        />
                      );
                    })}
                  </Layer>

                  <Layer>
                    {page2Elements.sections.map(([sectionName, pos]) => {
                      const adjustedPos = { ...pos, y: pos.y - 842 };
                      return (
                        <DraggableSection
                          key={sectionName}
                          sectionName={sectionName}
                          image={sectionImages[sectionName]}
                          position={adjustedPos}
                          onDragEnd={(name, newPos) => handleSectionDragEnd(name, { ...newPos, y: newPos.y + 842 })}
                          onTransform={handleSectionTransform}
                          isSelected={selectedSection === sectionName}
                          onSelect={() => setSelectedSection(sectionName)}
                        />
                      );
                    })}
                  </Layer>
                </Stage>
                <div className="page-number">Page 2</div>
              </div>
            )}
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

        <div className="canvas-hint">💡 DRAG & RESIZE • Scroll to see more</div>
        <div className="template-badge">
          {currentTemplate === 'ats' ? '📄 ATS' : currentTemplate === 'modern' ? '✨ MODERN' : '📑 TWO COLUMN'}
        </div>
      </div>

      {/* ======================= RIGHT PANEL START ======================= */}



      <div className={`right-panel ${isMobile && activeTab !== 'properties' ? 'mobile-hidden' : ''}`}>
        <h3 className="panel-title">QUICK STYLE</h3>

        {selectedSection ? (
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

            {/* Font Size Quick Controls */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                Font Size
              </label>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button
                  onClick={() => {
                    const current = parseInt(styleConfig[selectedSection]?.bodyStyle?.fontSize) || 10;
                    handleStyleChange(selectedSection, 'bodyStyle', `${Math.max(6, current - 1)}px`, 'fontSize');
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
                  {parseInt(styleConfig[selectedSection]?.bodyStyle?.fontSize) || 10}
                </span>
                <button
                  onClick={() => {
                    const current = parseInt(styleConfig[selectedSection]?.bodyStyle?.fontSize) || 10;
                    handleStyleChange(selectedSection, 'bodyStyle', `${Math.min(32, current + 1)}px`, 'fontSize');
                  }}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '16px', flex: 1 }}
                >
                  +
                </button>
              </div>
            </div>

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
                value={styleConfig[selectedSection]?.bodyStyle?.color || '#000000'}
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
                  value={styleConfig[selectedSection]?.titleStyle?.color || '#000000'}
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

            {/* Background Color */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                Background
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="color"
                  value={styleConfig[selectedSection]?.container?.backgroundColor === 'transparent' ? '#FFFFFF' : (styleConfig[selectedSection]?.container?.backgroundColor || '#FFFFFF')}
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
                Click on a section in the canvas to edit its styles
              </p>
            </div>

            <div style={{ marginTop: '20px', padding: '12px', background: '#eff6ff', borderRadius: '6px', border: '1px solid #3b82f6' }}>
              <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#1e40af', margin: '0 0 8px 0' }}>
                Quick Actions:
              </h4>
              <ul style={{ fontSize: '11px', color: '#1e40af', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>Drag sections to reposition</li>
                <li>Resize using corner handles</li>
                <li>Click to select and style</li>
                <li>Use left panel for advanced controls</li>
              </ul>
            </div>
          </div>
        )}
      </div>


      {/* ======================= RIGHT PANEL END ========================= */}




    </div>
  );
};

export default UIEditor;