
import React, { useState, useRef, useEffect, useCallback } from "react";
import { fabric } from "fabric";
import html2canvas from "html2canvas";
import { useSelector } from "react-redux";
import { mergeResumeData } from "./Utils";
import { ATS_TEMPLATE_CONFIG, MODERN_TEMPLATE_CONFIG, TWO_COLUMN_TEMPLATE_CONFIG } from "./TemplateConfigs";
import { defaultResumeData } from "./Utils";
import "./UIEditor.css";


import { Stage, Layer, Image as KonvaImage, Line, Rect, Transformer, Text } from 'react-konva';


const FlexibleContainer = ({ children, config }) => {
  return (
    <div style={{
      width: config.width || "fit-content",
      maxWidth: config.maxWidth || "100%",
      padding: config.padding || "10px",
      margin: config.margin || "0",
      backgroundColor: config.backgroundColor || "#FFFFFF",
      fontFamily: config.fontFamily || "Arial",
      color: config.color || "#000000",
      boxSizing: "border-box",
      overflow: config.overflow || "hidden",
      border: config.border || "none",
      borderRadius: config.borderRadius || "0",
      boxShadow: config.boxShadow || "none",
    }}>
      {children}
    </div>
  );
};

/**
 * Flexible Section Header - Can render any section title with full config
 */
const FlexibleSectionHeader = ({ title, config }) => {
  return (
    <div style={{
      fontSize: config.fontSize || "14px",
      fontWeight: config.fontWeight || "bold",
      color: config.color || "#000000",
      marginBottom: config.marginBottom || "8px",
      marginTop: config.marginTop || "0",
      paddingBottom: config.paddingBottom || "3px",
      paddingTop: config.paddingTop || "0",
      borderBottom: config.borderBottom || "none",
      borderTop: config.borderTop || "none",
      textTransform: config.textTransform || "none",
      letterSpacing: config.letterSpacing || "0",
      textAlign: config.textAlign || "left",
      display: config.display || "block",
      background: config.background || "transparent",
      padding: config.padding,
    }}>
      {config.icon && <span style={{ marginRight: "8px" }}>{config.icon}</span>}
      {title}
    </div>
  );
};

/**
 * Flexible Layout Container - Handles flex/grid layouts
 */
const FlexibleLayout = ({ children, config }) => {
  const isGrid = config.display === "grid";
  
  return (
    <div style={{
      display: config.display || "flex",
      flexDirection: config.flexDirection || "row",
      justifyContent: config.justifyContent || "flex-start",
      alignItems: config.alignItems || "stretch",
      flexWrap: config.flexWrap || "nowrap",
      gap: config.gap || "0",
      gridTemplateColumns: isGrid ? config.gridTemplateColumns : undefined,
      gridTemplateRows: isGrid ? config.gridTemplateRows : undefined,
      padding: config.padding,
      margin: config.margin,
    }}>
      {children}
    </div>
  );
};

/**
 * Flexible Text Block - For any text content
 */
const FlexibleText = ({ children, config }) => {
  return (
    <div style={{
      fontSize: config.fontSize || "10px",
      fontWeight: config.fontWeight || "normal",
      fontStyle: config.fontStyle || "normal",
      color: config.color || "#000000",
      lineHeight: config.lineHeight || "1.4",
      textAlign: config.textAlign || "left",
      marginBottom: config.marginBottom || "0",
      marginTop: config.marginTop || "0",
      padding: config.padding,
      textTransform: config.textTransform || "none",
      letterSpacing: config.letterSpacing || "0",
      wordWrap: config.wordWrap || "break-word",
      whiteSpace: config.whiteSpace || "normal",
      textDecoration: config.textDecoration || "none",
      background: config.background || "transparent",
      border: config.border,
      borderRadius: config.borderRadius,
      display: config.display || "block",
      flex: config.flex,
      width: config.width,
      maxWidth: config.maxWidth,
    }}>
      {children}
    </div>
  );
};

/**
 * Flexible Bullet List - Configurable bullet points
 */
const FlexibleBulletList = ({ items, config }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <div style={{ marginTop: config.containerMarginTop || "0" }}>
      {items.filter(item => item?.trim()).map((item, index) => (
        <div key={index} style={{
          display: "flex",
          marginBottom: config.itemMarginBottom || "3px",
          alignItems: config.alignItems || "flex-start",
        }}>
          <div style={{
            width: config.bulletWidth || "10px",
            minWidth: config.bulletWidth || "10px",
            color: config.bulletColor || "#000000",
            fontSize: config.bulletSize || "10px",
            flexShrink: 0,
            marginRight: config.bulletMarginRight || "0",
            marginTop: config.bulletMarginTop || "0",
          }}>
            {config.bulletStyle || "•"}
          </div>
          <FlexibleText config={{
            fontSize: config.textSize || "10px",
            color: config.textColor || "#000000",
            lineHeight: config.lineHeight || "1.4",
            flex: 1,
          }}>
            {item}
          </FlexibleText>
        </div>
      ))}
    </div>
  );
};

// ========== FLEXIBLE SECTION COMPONENTS ==========

/**
 * HEADER SECTION - Fully Flexible
 */
export const FlexibleHeaderSection = ({ resumeDetails, styleConfig }) => {
  const config = styleConfig.header;
  
  return (
    <FlexibleContainer config={config.container}>
      <FlexibleLayout config={config.mainLayout}>
        {/* Name Section */}
        <FlexibleLayout config={config.nameSection}>
          <FlexibleText config={config.nameStyle}>
            {resumeDetails.name || "Your Name"}
          </FlexibleText>
          {config.showTitle && (
            <FlexibleText config={config.titleStyle}>
              {resumeDetails.title || "Your Title"}
            </FlexibleText>
          )}
        </FlexibleLayout>
        
        {/* Contact Section */}
        {config.showContact && (
          <FlexibleLayout config={config.contactLayout}>
            {config.contactOrder.map((contactType, idx) => {
              const value = resumeDetails.contact?.[contactType];
              if (!value) return null;
              
              return (
                <FlexibleText key={idx} config={config.contactItemStyle}>
                  {config.showContactIcons && config.contactIcons?.[contactType] && (
                    <span style={{ marginRight: "4px" }}>{config.contactIcons[contactType]}</span>
                  )}
                  {value}
                </FlexibleText>
              );
            })}
          </FlexibleLayout>
        )}
      </FlexibleLayout>
      
      {config.showDivider && (
        <div style={{
          borderBottom: config.dividerStyle || "1px solid #000",
          marginTop: config.dividerMarginTop || "8px",
          marginBottom: config.dividerMarginBottom || "8px",
        }} />
      )}
    </FlexibleContainer>
  );
};

/**
 * SUMMARY SECTION - Fully Flexible
 */
export const FlexibleSummarySection = ({ summary, styleConfig }) => {
  const config = styleConfig.summary;
  
  return (
    <FlexibleContainer config={config.container}>
      {config.showTitle && (
        <FlexibleSectionHeader title="SUMMARY" config={config.titleStyle} />
      )}
      <FlexibleText config={config.bodyStyle}>
        {summary}
      </FlexibleText>
    </FlexibleContainer>
  );
};

/**
 * SKILLS SECTION - Fully Flexible
 */
export const FlexibleSkillsSection = ({ skills, styleConfig }) => {
  const config = styleConfig.skills;
  
  // Parse skills (grouped vs flat)
  const groupedSkills = {};
  const ungroupedSkills = [];
  
  if (skills && Array.isArray(skills)) {
    skills.forEach(skill => {
      if (skill && skill.includes(" - ")) {
        const [cat, val] = skill.split(" - ");
        groupedSkills[cat.trim()] = val.trim();
      } else if (skill?.trim()) {
        ungroupedSkills.push(skill.trim());
      }
    });
  }
  
  return (
    <FlexibleContainer config={config.container}>
      {config.showTitle && (
        <FlexibleSectionHeader title="SKILLS" config={config.titleStyle} />
      )}
      
      <FlexibleLayout config={config.contentLayout}>
        {/* Grouped Skills */}
        {Object.entries(groupedSkills).map(([category, value], idx) => (
          <div key={idx} style={{ marginBottom: config.itemMarginBottom || "8px" }}>
            {config.showCategories && (
              <FlexibleText config={config.categoryStyle}>
                {category}
              </FlexibleText>
            )}
            <FlexibleText config={config.valueStyle}>
              {value}
            </FlexibleText>
          </div>
        ))}
        
        {/* Ungrouped Skills */}
        {ungroupedSkills.length > 0 && (
          <div style={{ marginBottom: config.itemMarginBottom || "8px" }}>
            {config.showCategories && (
              <FlexibleText config={config.categoryStyle}>
                Other
              </FlexibleText>
            )}
            {config.displayType === "list" ? (
              <FlexibleBulletList items={ungroupedSkills} config={config.bulletConfig} />
            ) : (
              <FlexibleText config={config.valueStyle}>
                {ungroupedSkills.join(config.separator || ", ")}
              </FlexibleText>
            )}
          </div>
        )}
      </FlexibleLayout>
    </FlexibleContainer>
  );
};

/**
 * EXPERIENCE SECTION - Fully Flexible
 */
export const FlexibleExperienceSection = ({ experiences, styleConfig }) => {
  const config = styleConfig.experience;
  
  return (
    <FlexibleContainer config={config.container}>
      {config.showTitle && (
        <FlexibleSectionHeader title="EXPERIENCE" config={config.titleStyle} />
      )}
      
      {experiences.map((exp, idx) => (
        <div key={idx} style={{ marginBottom: config.itemMarginBottom || "12px" }}>
          <FlexibleLayout config={config.headerLayout}>
            {/* Position/Company layout controlled by config */}
            {config.positionFirst ? (
              <>
                <FlexibleText config={config.positionStyle}>
                  {exp.position}
                </FlexibleText>
                <FlexibleText config={config.durationStyle}>
                  {exp.duration}
                </FlexibleText>
              </>
            ) : (
              <>
                <FlexibleText config={config.companyStyle}>
                  {exp.company}
                </FlexibleText>
                <FlexibleText config={config.durationStyle}>
                  {exp.duration}
                </FlexibleText>
              </>
            )}
          </FlexibleLayout>
          
          <FlexibleLayout config={config.subHeaderLayout}>
            <FlexibleText config={config.companyStyle}>
              {config.positionFirst ? exp.company : exp.position}
              {exp.location && config.showLocation ? `, ${exp.location}` : ""}
            </FlexibleText>
          </FlexibleLayout>
          
          {/* Achievements */}
          {config.showAchievements && exp.achievements && (
            <FlexibleBulletList items={exp.achievements} config={config.bulletConfig} />
          )}
        </div>
      ))}
    </FlexibleContainer>
  );
};

/**
 * PROJECTS SECTION - Fully Flexible
 */
export const FlexibleProjectsSection = ({ projects, styleConfig }) => {
  const config = styleConfig.projects;
  
  return (
    <FlexibleContainer config={config.container}>
      {config.showTitle && (
        <FlexibleSectionHeader title="PROJECTS" config={config.titleStyle} />
      )}
      
      {projects.map((proj, idx) => (
        <div key={idx} style={{ marginBottom: config.itemMarginBottom || "12px" }}>
          <FlexibleLayout config={config.headerLayout}>
            <FlexibleText config={config.nameStyle}>
              {proj.name}
            </FlexibleText>
            {proj.duration && config.showDuration && (
              <FlexibleText config={config.durationStyle}>
                {proj.duration}
              </FlexibleText>
            )}
          </FlexibleLayout>
          
          {proj.technologies && config.showTechnologies && (
            <FlexibleText config={config.techStyle}>
              {proj.technologies}
            </FlexibleText>
          )}
          
          {config.showDescription && proj.description && (
            <FlexibleBulletList items={proj.description} config={config.bulletConfig} />
          )}
        </div>
      ))}
    </FlexibleContainer>
  );
};

/**
 * EDUCATION SECTION - Fully Flexible
 */
export const FlexibleEducationSection = ({ educationList, styleConfig }) => {
  const config = styleConfig.education;
  
  return (
    <FlexibleContainer config={config.container}>
      {config.showTitle && (
        <FlexibleSectionHeader title="EDUCATION" config={config.titleStyle} />
      )}
      
      {educationList.map((edu, idx) => (
        <div key={idx} style={{ marginBottom: config.itemMarginBottom || "10px" }}>
          <FlexibleText config={config.degreeStyle}>
            {edu.degree}
          </FlexibleText>
          
          {edu.institution && config.showInstitution && (
            <FlexibleText config={config.institutionStyle}>
              {edu.institution}
            </FlexibleText>
          )}
          
          <FlexibleLayout config={config.detailsLayout}>
            {edu.year && (
              <FlexibleText config={config.detailsStyle}>
                {edu.year}
              </FlexibleText>
            )}
            {edu.gpa && config.showGpa && (
              <FlexibleText config={config.detailsStyle}>
                {config.gpaPrefix || "GPA: "}{edu.gpa}
              </FlexibleText>
            )}
            {edu.location && config.showLocation && (
              <FlexibleText config={config.detailsStyle}>
                {edu.location}
              </FlexibleText>
            )}
          </FlexibleLayout>
        </div>
      ))}
    </FlexibleContainer>
  );
};

/**
 * CERTIFICATIONS SECTION - Fully Flexible
 */
export const FlexibleCertificationsSection = ({ certifications, styleConfig }) => {
  const config = styleConfig.certifications;
  
  return (
    <FlexibleContainer config={config.container}>
      {config.showTitle && (
        <FlexibleSectionHeader title="CERTIFICATIONS" config={config.titleStyle} />
      )}
      
      {config.displayType === "list" ? (
        <FlexibleBulletList items={certifications} config={config.bulletConfig} />
      ) : (
        certifications.filter(cert => cert?.trim()).map((cert, idx) => (
          <FlexibleText key={idx} config={config.itemStyle}>
            {cert}
          </FlexibleText>
        ))
      )}
    </FlexibleContainer>
  );
};




              

// const UIEditor = () => {
//   const canvasRef = useRef(null);
//   const canvas2Ref = useRef(null);
//   const fabricRef = useRef(null);
//   const fabric2Ref = useRef(null);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [selectedLine, setSelectedLine] = useState(null);
//   const [selectedShape, setSelectedShape] = useState(null);
//   const [showPage2, setShowPage2] = useState(false);
//   const currentResume = useSelector((state) => state.resume.currentResume);
  
//   // Template Management
//   const [currentTemplate, setCurrentTemplate] = useState('ats');
//   const TEMPLATES = {
//     ats: ATS_TEMPLATE_CONFIG,
//     modern: MODERN_TEMPLATE_CONFIG,
//     twoColumn: TWO_COLUMN_TEMPLATE_CONFIG
//   };
  
//   // Style Config - initialized from template
//   const [styleConfig, setStyleConfig] = useState(ATS_TEMPLATE_CONFIG);
  
//   // Lines Management
//   const [lines, setLines] = useState([]);
//   const [nextLineId, setNextLineId] = useState(1);
  
//   // Background Shapes Management
//   const [backgroundShapes, setBackgroundShapes] = useState([]);
//   const [nextShapeId, setNextShapeId] = useState(1);
  
//   // Section Positions - initialized from template
//   const [sectionPositions, setSectionPositions] = useState(ATS_TEMPLATE_CONFIG.positions);
  
//   // Section Widths - extracted from template configs
//   const [sectionWidths, setSectionWidths] = useState({});
  
//   const [rememberedLinePositions, setRememberedLinePositions] = useState({});
//   const [rememberedShapePositions, setRememberedShapePositions] = useState({});
//   const [zoom, setZoom] = useState(1.0);
//   const [sectionHeights, setSectionHeights] = useState({});

//   // Resume Data
//   let resumeData = null;
//   if(currentResume){
//      resumeData = currentResume;
//   }
//   else{
//      resumeData = defaultResumeData;
//   }

//   // Section Refs for rendering
//   const sectionRefs = {
//     header: useRef(null),
//     summary: useRef(null),
//     skills: useRef(null),
//     experience: useRef(null),
//     projects: useRef(null),
//     education: useRef(null),
//     certifications: useRef(null)
//   };

//   // Template Components Mapping
//   const TemplateComponents = {
//     header: FlexibleHeaderSection,
//     summary: FlexibleSummarySection,
//     skills: FlexibleSkillsSection,
//     experience: FlexibleExperienceSection,
//     projects: FlexibleProjectsSection,
//     education: FlexibleEducationSection,
//     certifications: FlexibleCertificationsSection
//   };

//   // Extract widths from template config
//   const extractWidthsFromConfig = (config) => {
//     const widths = {};
//     Object.keys(config).forEach(section => {
//       if (config[section]?.container?.width) {
//         const width = parseInt(config[section].container.width);
//         if (!isNaN(width)) {
//           widths[section] = width;
//         }
//       }
//     });
//     return widths;
//   };

//   // Template Switching
//   const handleTemplateSwitch = (templateKey) => {
//     const template = TEMPLATES[templateKey];
//     setCurrentTemplate(templateKey);
//     setStyleConfig(template);
//     setSectionPositions(template.positions);
//     setLines(template.lines || []);
//     setBackgroundShapes(template.backgroundShapes || []);
//     setSectionWidths(extractWidthsFromConfig(template));
    
//     // Reset line ID counter
//     if (template.lines && template.lines.length > 0) {
//       setNextLineId(Math.max(...template.lines.map(l => l.id)) + 1);
//     } else {
//       setNextLineId(1);
//     }
    
//     // Reset shape ID counter
//     if (template.backgroundShapes && template.backgroundShapes.length > 0) {
//       setNextShapeId(Math.max(...template.backgroundShapes.map(s => s.id)) + 1);
//     } else {
//       setNextShapeId(1);
//     }
//   };

//   // Initialize widths on mount
//   useEffect(() => {
//     setSectionWidths(extractWidthsFromConfig(styleConfig));
//   }, []);

 
// const renderSectionToCanvas = async (refKey, sectionName) => {
//   const element = sectionRefs[refKey].current;
//   if (!element || !fabricRef.current) return;
//   const position = sectionPositions[sectionName];
  
//   try {
//     const wrapper = document.createElement("div");
//     wrapper.style.cssText = "position:absolute;left:-99999px;display:inline-block";
//     wrapper.appendChild(element.cloneNode(true));
//     document.body.appendChild(wrapper);
//     await new Promise(r => setTimeout(r, 10));
    
//     const sectionBg = styleConfig[sectionName]?.container?.backgroundColor;
//     const bgColor = (sectionBg === 'transparent' || !sectionBg) 
//       ? null 
//       : sectionBg;
    
//     const canvas = await html2canvas(wrapper, { 
//       scale: 2,
//       backgroundColor: bgColor,
//       logging: false,
//       useCORS: true,
//       allowTaint: true
//     });
    
//     document.body.removeChild(wrapper);
    
//     return new Promise((resolve) => {
//       fabric.Image.fromURL(canvas.toDataURL("image/png"), (img) => {
//         const yPos = position.y;
//         // Use 800 as threshold for page 2
//         const targetCanvas = (yPos >= 800 && showPage2 && fabric2Ref.current) ? fabric2Ref.current : fabricRef.current;
//         const adjustedY = yPos >= 800 ? yPos - 842 : yPos;
        
//         img.set({ 
//           left: position.x, 
//           top: adjustedY, 
//           scaleX: (position.scaleX || 1) * 0.5,
//           scaleY: (position.scaleY || 1) * 0.5,
//           selectable: true, 
//           lockRotation: true, 
//           cornerStyle: 'circle', 
//           cornerColor: '#0066ff', 
//           cornerSize: 10, 
//           borderColor: '#0066ff' 
//         });
//         img.sectionName = sectionName;
//         img.originalY = yPos;
//         targetCanvas.add(img);
//         resolve();
//       });
//     });
//   } catch (err) { 
//     console.error(err); 
//   }
// };

//   // Render Background Shape to Canvas
//   const renderBackgroundShapeToCanvas = (shape, targetCanvas) => {
//     if (!targetCanvas) return;
    
//     const fabricRect = new fabric.Rect({
//       left: shape.x,
//       top: shape.y,
//       width: shape.width,
//       height: shape.height,
//       fill: shape.color,
//       selectable: shape.selectable !== false,
//       lockRotation: true,
//       cornerColor: '#ff6b6b',
//       cornerSize: 10,
//       cornerStyle: 'circle',
//       borderColor: '#ff6b6b',
//       transparentCorners: false,
//       hasRotatingPoint: false
//     });
    
//     fabricRect.shapeId = shape.id;
//     targetCanvas.add(fabricRect);
//     fabricRect.sendToBack();
//   };

//   // Render Background Shape to Canvas (legacy name for compatibility)
//   const renderBackgroundShape = (shape) => {
//     renderBackgroundShapeToCanvas(shape, fabricRef.current);
//   };

//   // Render Line to Canvas on Page 2
//   const renderLineToCanvasOnPage2 = (line) => {
//     if (!fabric2Ref.current) return;
    
//     const fabricLine = new fabric.Line([line.x1, line.y1, line.x2, line.y2], {
//       stroke: line.color, 
//       strokeWidth: line.thickness, 
//       selectable: true, 
//       lockRotation: true,
//       cornerColor: '#0066ff', 
//       cornerSize: 10, 
//       cornerStyle: 'circle', 
//       borderColor: '#0066ff',
//       transparentCorners: false,
//       hasRotatingPoint: false,
//       lockScalingFlip: true
//     });
    
//     fabricLine.lineId = line.id;
//     fabricLine.lineOrientation = line.orientation;
    
//     fabricLine.setControlsVisibility({
//       mt: line.orientation === 'vertical',
//       mb: line.orientation === 'vertical',
//       ml: line.orientation === 'horizontal',
//       mr: line.orientation === 'horizontal',
//       tl: false, 
//       tr: false, 
//       bl: false, 
//       br: false, 
//       mtr: false
//     });
    
//     fabricLine.setCoords();
//     fabric2Ref.current.add(fabricLine);
//   };

//   // Render Line to Canvas
//   const renderLineToCanvas = (line) => {
//     if (!fabricRef.current) return;
    
//     const fabricLine = new fabric.Line([line.x1, line.y1, line.x2, line.y2], {
//       stroke: line.color, 
//       strokeWidth: line.thickness, 
//       selectable: true, 
//       lockRotation: true,
//       cornerColor: '#0066ff', 
//       cornerSize: 10, 
//       cornerStyle: 'circle', 
//       borderColor: '#0066ff',
//       transparentCorners: false,
//       hasRotatingPoint: false,
//       lockScalingFlip: true
//     });
    
//     fabricLine.lineId = line.id;
//     fabricLine.lineOrientation = line.orientation;
    
//     fabricLine.setControlsVisibility({
//       mt: line.orientation === 'vertical',
//       mb: line.orientation === 'vertical',
//       ml: line.orientation === 'horizontal',
//       mr: line.orientation === 'horizontal',
//       tl: false, 
//       tr: false, 
//       bl: false, 
//       br: false, 
//       mtr: false
//     });
    
//     fabricLine.setCoords();
//     fabricRef.current.add(fabricLine);
//   };

//   // Render All Sections
//   const renderAllSections = async () => {
//     if (!fabricRef.current) return;
    
//     fabricRef.current.clear();
//     if (fabric2Ref.current) fabric2Ref.current.clear();
    
//     const bgColor = styleConfig.page?.backgroundColor || styleConfig.header?.container?.backgroundColor || "#FFFFFF";
//     fabricRef.current.backgroundColor = bgColor;
//     if (fabric2Ref.current) fabric2Ref.current.backgroundColor = bgColor;
    
//     fabricRef.current.renderAll();
//     if (fabric2Ref.current) fabric2Ref.current.renderAll();
    
//     await new Promise(r => setTimeout(r, 100));
    
//     // Render background shapes on both pages
//     backgroundShapes.forEach(shape => {
//       const rememberedPos = rememberedShapePositions[shape.id];
//       const shapeData = rememberedPos ? { ...shape, ...rememberedPos } : shape;
      
//       if (shapeData.y < 842) {
//         renderBackgroundShapeToCanvas(shapeData, fabricRef.current);
//       }
//       if (showPage2 && fabric2Ref.current && shapeData.y + shapeData.height > 842) {
//         // Render on page 2 with adjusted Y position
//         renderBackgroundShapeToCanvas({
//           ...shapeData,
//           y: shapeData.y - 842
//         }, fabric2Ref.current);
//       }
//     });
    
//     // Render sections
//     await renderSectionToCanvas('header', "header");
//     await renderSectionToCanvas('summary', "summary");
//     await renderSectionToCanvas('skills', "skills");
//     await renderSectionToCanvas('experience', "experience");
//     await renderSectionToCanvas('projects', "projects");
//     await renderSectionToCanvas('education', "education");
//     await renderSectionToCanvas('certifications', "certifications");
    
//     // Render lines on both pages
//     lines.forEach(line => {
//       const rememberedPos = rememberedLinePositions[line.id];
//       const lineData = rememberedPos ? { ...line, ...rememberedPos } : line;
      
//       if (lineData.y1 < 842 || lineData.y2 < 842) {
//         renderLineToCanvas(lineData);
//       }
//       if (showPage2 && fabric2Ref.current && (lineData.y1 > 842 || lineData.y2 > 842)) {
//         // Render on page 2 with adjusted Y position
//         renderLineToCanvasOnPage2({
//           ...lineData,
//           y1: lineData.y1 - 842,
//           y2: lineData.y2 - 842
//         });
//       }
//     });
//   };

// const handleObjectModified = (e) => {
//   const obj = e.target;
  
//   if (obj?.sectionName) {
//     // Determine which canvas and calculate absolute Y position
//     const isOnPage2 = obj.canvas === fabric2Ref.current;
//     const absoluteY = isOnPage2 ? obj.top + 842 : obj.top;
    
//     // Store the original Y for page detection
//     const previousY = obj.originalY || sectionPositions[obj.sectionName]?.y || 0;
    
//     setSectionPositions(p => ({ 
//       ...p, 
//       [obj.sectionName]: { 
//         x: Math.round(obj.left), 
//         y: Math.round(absoluteY), 
//         scaleX: obj.scaleX, 
//         scaleY: obj.scaleY 
//       }
//     }));
    
//     // Update originalY for tracking
//     obj.originalY = absoluteY;
    
//     // If section crossed page boundary (around 800 threshold), re-render
//     const crossedToPage2 = previousY < 800 && absoluteY >= 800;
//     const crossedToPage1 = previousY >= 800 && absoluteY < 800;
    
//     if (crossedToPage2 || crossedToPage1) {
//       if (crossedToPage2) {
//         setShowPage2(true);
//       }
//       setTimeout(renderAllSections, 100);
//     }
//   } else if (obj?.lineId) {
//     const lineData = {
//       x1: Math.round(obj.x1),
//       y1: Math.round(obj.y1),
//       x2: Math.round(obj.x2),
//       y2: Math.round(obj.y2),
//       thickness: Math.round(obj.strokeWidth)
//     };
    
//     setRememberedLinePositions(prev => ({
//       ...prev,
//       [obj.lineId]: lineData
//     }));
    
//     setLines(p => p.map(l => {
//       if (l.id === obj.lineId) {
//         return { ...l, ...lineData };
//       }
//       return l;
//     }));
//   } else if (obj?.shapeId) {
//     const shapeData = {
//       x: Math.round(obj.left),
//       y: Math.round(obj.top),
//       width: Math.round(obj.width * obj.scaleX),
//       height: Math.round(obj.height * obj.scaleY)
//     };
    
//     setRememberedShapePositions(prev => ({
//       ...prev,
//       [obj.shapeId]: shapeData
//     }));
    
//     setBackgroundShapes(p => p.map(s => {
//       if (s.id === obj.shapeId) {
//         return { ...s, ...shapeData };
//       }
//       return s;
//     }));
//   }
// };

//   // Style Change Handler
//   const handleStyleChange = (section, key, value, nestedKey = null) => {
//     setStyleConfig(prev => {
//       if (nestedKey) {
//         return {
//           ...prev,
//           [section]: {
//             ...prev[section],
//             [key]: {
//               ...prev[section][key],
//               [nestedKey]: value
//             }
//           }
//         };
//       } else {
//         return {
//           ...prev,
//           [section]: {
//             ...prev[section],
//             [key]: value
//           }
//         };
//       }
//     });
//   };

//   // Width Change Handler
//   const handleWidthChange = (sectionName, newWidth) => {
//     setSectionWidths(p => ({ ...p, [sectionName]: newWidth }));
//   };

//   const handleWidthBlur = (sectionName) => {
//     let width = parseInt(sectionWidths[sectionName]);
    
//     if (isNaN(width) || width < 0) {
//       width = 50;
//     }
    
//     if (width > 1000) {
//       width = 1000;
//     }
    
//     setSectionWidths(p => ({ ...p, [sectionName]: width }));
    
//     setStyleConfig(prev => ({
//       ...prev,
//       [sectionName]: {
//         ...prev[sectionName],
//         container: {
//           ...prev[sectionName].container,
//           width: `${width}px`
//         }
//       }
//     }));
//   };

//   // Background Shape Management Functions
//   const addBackgroundShape = () => {
//     const newShape = {
//       id: nextShapeId,
//       x: 0,
//       y: 0,
//       width: 230,
//       height: 842,
//       color: '#2c3e50',
//       selectable: true,
//       label: `Background ${nextShapeId}`
//     };
//     setBackgroundShapes(p => [...p, newShape]);
//     setNextShapeId(p => p + 1);
//   };

//   const updateBackgroundShape = (id, key, value) => {
//     setBackgroundShapes(p => p.map(s => s.id === id ? { ...s, [key]: value } : s));
    
//     // Also update remembered positions so changes persist
//     if (['x', 'y', 'width', 'height'].includes(key)) {
//       setRememberedShapePositions(prev => ({
//         ...prev,
//         [id]: {
//           ...prev[id],
//           [key]: value
//         }
//       }));
//     }
//   };

//   const deleteBackgroundShape = (id) => {
//     setBackgroundShapes(p => p.filter(s => s.id !== id));
//     // Clean up remembered positions
//     setRememberedShapePositions(prev => {
//       const newPos = { ...prev };
//       delete newPos[id];
//       return newPos;
//     });
//   };

//   // Calculate actual section heights
//   const calculateSectionHeights = async () => {
//     const heights = {};
    
//     for (const [refKey, sectionName] of Object.entries({
//       header: 'header',
//       summary: 'summary',
//       skills: 'skills',
//       experience: 'experience',
//       projects: 'projects',
//       education: 'education',
//       certifications: 'certifications'
//     })) {
//       const element = sectionRefs[refKey].current;
//       if (element) {
//         // Force a reflow to get accurate height
//         element.style.display = 'block';
//         await new Promise(r => setTimeout(r, 10));
//         heights[sectionName] = element.offsetHeight;
//       }
//     }
    
//     setSectionHeights(heights);
//     return heights;
//   };

//   // Auto-flow sections to prevent overlapping
//   const autoFlowSections = async () => {
//     // First calculate all heights
//     const heights = await calculateSectionHeights();
//     const newPositions = { ...sectionPositions };
    
//     // Get current template to determine column layout
//     const leftColumnSections = ['header', 'skills', 'education'];
//     const rightColumnSections = ['summary', 'experience', 'projects', 'certifications'];
    
//     // Define column X positions and starting Y
//     const leftX = 40;
//     const rightX = 270;
//     const spacing = 20; // Gap between sections
    
//     // Flow left column
//     let leftY = 30;
//     leftColumnSections.forEach(section => {
//       if (heights[section] && newPositions[section]) {
//         newPositions[section] = {
//           ...newPositions[section],
//           x: leftX,
//           y: Math.round(leftY)
//         };
//         leftY += heights[section] + spacing;
//       }
//     });
    
//     // Flow right column
//     let rightY = 150;
//     rightColumnSections.forEach(section => {
//       if (heights[section] && newPositions[section]) {
//         newPositions[section] = {
//           ...newPositions[section],
//           x: rightX,
//           y: Math.round(rightY)
//         };
//         rightY += heights[section] + spacing;
//       }
//     });
    
//     setSectionPositions(newPositions);
    
//     // Check if we need page 2
//     const maxY = Math.max(leftY, rightY);
//     if (maxY > 800) {
//       setShowPage2(true);
//     }
    
//     // Show feedback
//     const totalPages = Math.ceil(maxY / 842);
//     alert(`✅ Auto-flow complete!\n\n📊 Layout:\n- Left column height: ${Math.round(leftY)}px\n- Right column height: ${Math.round(rightY)}px\n- Total pages needed: ${totalPages}`);
//   };
//   const addLine = (orientation) => {
//     const newLine = { 
//       id: nextLineId, 
//       x1: orientation === 'horizontal' ? 50 : 280, 
//       y1: orientation === 'horizontal' ? 300 : 100,
//       x2: orientation === 'horizontal' ? 300 : 280, 
//       y2: orientation === 'horizontal' ? 300 : 400,
//       color: '#000000', 
//       thickness: 2, 
//       orientation, 
//       label: `Line ${nextLineId}` 
//     };
//     setLines(p => [...p, newLine]);
//     setNextLineId(p => p + 1);
//   };

//   const updateLine = (id, key, value) => setLines(p => p.map(l => l.id === id ? { ...l, [key]: value } : l));
  
//   const moveLine = (id, direction) => {
//     setLines(p => p.map(l => {
//       if (l.id === id) {
//         const step = 5;
//         if (l.orientation === 'vertical') {
//           if (direction === 'left') return { ...l, x1: l.x1 - step, x2: l.x2 - step };
//           if (direction === 'right') return { ...l, x1: l.x1 + step, x2: l.x2 + step };
//           if (direction === 'up') return { ...l, y1: l.y1 - step, y2: l.y2 - step };
//           if (direction === 'down') return { ...l, y1: l.y1 + step, y2: l.y2 + step };
//         } else {
//           if (direction === 'left') return { ...l, x1: l.x1 - step, x2: l.x2 - step };
//           if (direction === 'right') return { ...l, x1: l.x1 + step, x2: l.x2 + step };
//           if (direction === 'up') return { ...l, y1: l.y1 - step, y2: l.y2 - step };
//           if (direction === 'down') return { ...l, y1: l.y1 + step, y2: l.y2 + step };
//         }
//       }
//       return l;
//     }));
//   };

//   const resizeLine = (id, type) => {
//     setLines(p => p.map(l => {
//       if (l.id === id) {
//         const step = 10;
//         if (l.orientation === 'vertical') {
//           if (type === 'increase') return { ...l, y2: l.y2 + step };
//           if (type === 'decrease') return { ...l, y2: Math.max(l.y1 + 20, l.y2 - step) };
//         } else {
//           if (type === 'increase') return { ...l, x2: l.x2 + step };
//           if (type === 'decrease') return { ...l, x2: Math.max(l.x1 + 20, l.x2 - step) };
//         }
//       }
//       return l;
//     }));
//   };

//   const deleteLine = (id) => setLines(p => p.filter(l => l.id !== id));
  
//   const resetLayout = () => {
//     const template = TEMPLATES[currentTemplate];
//     setSectionPositions(template.positions);
//     setSectionWidths(extractWidthsFromConfig(template));
//     setLines(template.lines || []);
//     setBackgroundShapes(template.backgroundShapes || []);
    
//     // Clear all remembered positions
//     setRememberedLinePositions({});
//     setRememberedShapePositions({});
    
//     if (template.lines && template.lines.length > 0) {
//       setNextLineId(Math.max(...template.lines.map(l => l.id)) + 1);
//     } else {
//       setNextLineId(1);
//     }
//     if (template.backgroundShapes && template.backgroundShapes.length > 0) {
//       setNextShapeId(Math.max(...template.backgroundShapes.map(s => s.id)) + 1);
//     } else {
//       setNextShapeId(1);
//     }
//     setZoom(1);
//   };

//   const downloadResume = () => {
//     if (!fabricRef.current) return;
//     const link = document.createElement('a');
//     link.download = 'resume.png';
//     link.href = fabricRef.current.toDataURL({ format: 'png', quality: 1, multiplier: 3 }); // Increased multiplier for better quality
//     link.click();
//   };

//   // Initialize Canvas
//   useEffect(() => {
//     if (!canvasRef.current || fabricRef.current) return;
//     const bgColor = styleConfig.page?.backgroundColor || styleConfig.header?.container?.backgroundColor || "#FFFFFF";
    
//     // Initialize Page 1
//     const canvas = new fabric.Canvas(canvasRef.current, { 
//       backgroundColor: bgColor, 
//       width: 595, 
//       height: 842 
//     });
//     fabricRef.current = canvas;
//     canvas.on("object:modified", handleObjectModified);
    
//     // Initialize Page 2 if needed
//     if (canvas2Ref.current && !fabric2Ref.current) {
//       const canvas2 = new fabric.Canvas(canvas2Ref.current, { 
//         backgroundColor: bgColor, 
//         width: 595, 
//         height: 842 
//       });
//       fabric2Ref.current = canvas2;
//       canvas2.on("object:modified", handleObjectModified);
//     }
    
//     setTimeout(() => setIsInitialized(true), 100);
    
//     return () => { 
//       canvas.dispose(); 
//       fabricRef.current = null;
//       if (fabric2Ref.current) {
//         fabric2Ref.current.dispose();
//         fabric2Ref.current = null;
//       }
//     };
//   }, [styleConfig, showPage2]);

//   // Re-render on config change
//   useEffect(() => {
//     if (!fabricRef.current || !isInitialized) return;
//     const timer = setTimeout(renderAllSections, 800);
//     return () => clearTimeout(timer);
//   }, [styleConfig, sectionWidths, isInitialized]);

//   // Trigger re-render when shapes are added/deleted or colors change
//   useEffect(() => {
//     if (!fabricRef.current || !isInitialized) return;
//     const timer = setTimeout(renderAllSections, 300);
//     return () => clearTimeout(timer);
//   }, [backgroundShapes.length, backgroundShapes.map(s => s.color).join(',')]);

//   // Check if content overflows to page 2
//   useEffect(() => {
//     const hasOverflow = Object.values(sectionPositions).some(pos => pos.y >= 750);
//     if (hasOverflow && !showPage2) {
//       setShowPage2(true);
//     }
//   }, [sectionPositions]);

//   // Handle Zoom
//   useEffect(() => {
//     if (!fabricRef.current) return;
//     fabricRef.current.setZoom(zoom);
//     fabricRef.current.renderAll();
//     if (fabric2Ref.current) {
//       fabric2Ref.current.setZoom(zoom);
//       fabric2Ref.current.renderAll();
//     }
//   }, [zoom]);

//   return (
//     <div className="editor-container">
//       {/* Hidden rendering area */}
//       <div className="hidden-render">
//         <div ref={sectionRefs.header}>
//           <TemplateComponents.header 
//             resumeDetails={resumeData.resumeDetails} 
//             styleConfig={styleConfig} 
//           />
//         </div>
//         <div ref={sectionRefs.summary}>
//           <TemplateComponents.summary 
//             summary={resumeData.resumeDetails.summary} 
//             styleConfig={styleConfig} 
//           />
//         </div>
//         <div ref={sectionRefs.skills}>
//           <TemplateComponents.skills 
//             skills={resumeData.skills} 
//             styleConfig={styleConfig} 
//           />
//         </div>
//         <div ref={sectionRefs.experience}>
//           <TemplateComponents.experience 
//             experiences={resumeData.experiences} 
//             styleConfig={styleConfig} 
//           />
//         </div>
//         <div ref={sectionRefs.projects}>
//           <TemplateComponents.projects 
//             projects={resumeData.projects} 
//             styleConfig={styleConfig} 
//           />
//         </div>
//         <div ref={sectionRefs.education}>
//           <TemplateComponents.education 
//             educationList={resumeData.educationList} 
//             styleConfig={styleConfig} 
//           />
//         </div>
//         <div ref={sectionRefs.certifications}>
//           <TemplateComponents.certifications 
//             certifications={resumeData.certifications} 
//             styleConfig={styleConfig} 
//           />
//         </div>
//       </div>

//       {/* LEFT PANEL - Section Controls */}
//       <div className="left-panel">
//         <h3 className="panel-title">TEMPLATE SELECT</h3>
        
//         <div className="control-group">
//           <label className="control-label">Choose Template</label>
//           <select 
//             value={currentTemplate} 
//             onChange={(e) => handleTemplateSwitch(e.target.value)}
//             className="control-select"
//           >
//             <option value="ats">ATS Optimized</option>
//             <option value="modern">Modern Creative</option>
//             <option value="twoColumn">Two Column Professional</option>
//           </select>
//         </div>

//         {/* BACKGROUND SHAPES SECTION */}
//         <h3 className="panel-title">BACKGROUND ZONES</h3>
//         <button onClick={addBackgroundShape} className="btn-primary full-width">
//           + ADD BACKGROUND SHAPE
//         </button>
        
//         {backgroundShapes.length > 0 && backgroundShapes.map(shape => (
//           <div key={shape.id} className={`shape-control ${selectedShape === shape.id ? 'selected' : ''}`}>
//             <div className="line-header">
//               <span className="line-label">{shape.label}</span>
//               <button onClick={() => deleteBackgroundShape(shape.id)} className="btn-delete">✕</button>
//             </div>
            
//             <div className="shape-properties">
//               <div className="property-control">
//                 <label className="control-label">X Position</label>
//                 <input 
//                   type="number" 
//                   value={shape.x} 
//                   onChange={(e) => updateBackgroundShape(shape.id, 'x', parseInt(e.target.value))} 
//                   className="control-input"
//                 />
//               </div>
//               <div className="property-control">
//                 <label className="control-label">Y Position</label>
//                 <input 
//                   type="number" 
//                   value={shape.y} 
//                   onChange={(e) => updateBackgroundShape(shape.id, 'y', parseInt(e.target.value))} 
//                   className="control-input"
//                 />
//               </div>
//               <div className="property-control">
//                 <label className="control-label">Width</label>
//                 <input 
//                   type="number" 
//                   value={shape.width} 
//                   onChange={(e) => updateBackgroundShape(shape.id, 'width', parseInt(e.target.value))} 
//                   className="control-input"
//                 />
//               </div>
//               <div className="property-control">
//                 <label className="control-label">Height</label>
//                 <input 
//                   type="number" 
//                   value={shape.height} 
//                   onChange={(e) => updateBackgroundShape(shape.id, 'height', parseInt(e.target.value))} 
//                   className="control-input"
//                 />
//               </div>
//               <div className="property-control">
//                 <label className="control-label">Color</label>
//                 <input 
//                   type="color" 
//                   value={shape.color} 
//                   onChange={(e) => updateBackgroundShape(shape.id, 'color', e.target.value)} 
//                   className="control-color"
//                 />
//               </div>
//             </div>
//           </div>
//         ))}





//         {/* <h3 className="panel-title">SECTION SIZES</h3>
//         <div className="section-widths-container">
//           {Object.keys(sectionWidths).map(sectionName => {
//             const isTransparent = styleConfig[sectionName]?.container?.backgroundColor === 'transparent';
//             return (
//               <details key={sectionName} className="section-detail" open>
//                 <summary className="section-summary">
//                   {sectionName}
//                   {isTransparent && <span className="transparent-badge">TRANSPARENT</span>}
//                 </summary>
              
//               <div className="section-controls-grid"> */}

//               <h3 className="panel-title">SECTION SIZES & POSITIONS</h3>
// <div className="section-widths-container">
//   {Object.keys(sectionWidths).map(sectionName => {
//     const isTransparent = styleConfig[sectionName]?.container?.backgroundColor === 'transparent';
//     const position = sectionPositions[sectionName] || { x: 0, y: 0 };
//     const isOnPage2 = position.y >= 800;
//     return (
//       <details key={sectionName} className="section-detail" open>
//         <summary className="section-summary">
//           {sectionName}
//           {isTransparent && <span className="transparent-badge">TRANSPARENT</span>}
//           {isOnPage2 && <span className="transparent-badge" style={{ background: '#3b82f6' }}>PAGE 2</span>}
//         </summary>
      
//         <div className="position-controls" style={{ marginBottom: '12px', padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
//             <div className="control-item">
//               <label className="control-label-small">X Position</label>
//               <input 
//                 type="number" 
//                 value={Math.round(position.x)}
//                 onChange={(e) => {
//                   setSectionPositions(p => ({
//                     ...p,
//                     [sectionName]: { ...p[sectionName], x: parseInt(e.target.value) || 0 }
//                   }));
//                 }}
//                 className="control-input-small"
//               />
//             </div>
//             <div className="control-item">
//               <label className="control-label-small">Y Position</label>
//               <input 
//                 type="number" 
//                 value={Math.round(position.y)}
//                 onChange={(e) => {
//                   setSectionPositions(p => ({
//                     ...p,
//                     [sectionName]: { ...p[sectionName], y: parseInt(e.target.value) || 0 }
//                   }));
//                 }}
//                 className="control-input-small"
//               />
//             </div>
//           </div>
//           <div style={{ display: 'flex', gap: '4px' }}>
//             <button
//               onClick={() => {
//                 setSectionPositions(p => ({
//                   ...p,
//                   [sectionName]: { ...p[sectionName], y: 50 }
//                 }));
//               }}
//               className="btn-secondary"
//               style={{ fontSize: '10px', padding: '4px 8px', flex: 1 }}
//             >
//               → Page 1
//             </button>
//             <button
//               onClick={() => {
//                 setSectionPositions(p => ({
//                   ...p,
//                   [sectionName]: { ...p[sectionName], y: 900 }
//                 }));
//                 setShowPage2(true);
//               }}
//               className="btn-secondary"
//               style={{ fontSize: '10px', padding: '4px 8px', flex: 1 }}
//             >
//               → Page 2
//             </button>
//           </div>
//         </div>

//         <div className="section-controls-grid">
//                 <div className="control-item">
//                   <label className="control-label-small">Width (px)</label>
//                   <input 
//                     type="text" 
//                     value={sectionWidths[sectionName]} 
//                     onChange={(e) => handleWidthChange(sectionName, e.target.value)} 
//                     onBlur={() => handleWidthBlur(sectionName)}
//                     className="control-input-small"
//                     placeholder="Width"
//                   />
//                 </div>

//                 <div className="control-item">
//                   <label className="control-label-small">Padding (px)</label>
//                   <input 
//                     type="number" 
//                     value={parseInt(styleConfig[sectionName]?.container?.padding) || 0}
//                     onChange={(e) => {
//                       const newPadding = `${e.target.value}px`;
//                       handleStyleChange(sectionName, 'container', newPadding, 'padding');
//                     }}
//                     className="control-input-small"
//                     min="0"
//                     max="50"
//                   />
//                 </div>

//                 <div className="control-item">
//                   <label className="control-label-small">Margin (px)</label>
//                   <input 
//                     type="number" 
//                     value={parseInt(styleConfig[sectionName]?.container?.margin) || 0}
//                     onChange={(e) => {
//                       const newMargin = `${e.target.value}px`;
//                       handleStyleChange(sectionName, 'container', newMargin, 'margin');
//                     }}
//                     className="control-input-small"
//                     min="0"
//                     max="50"
//                   />
//                 </div>

//                 <div className="control-item">
//                   <label className="control-label-small">Background</label>
//                   <div className="color-with-transparent">
//                     <input 
//                       type="color" 
//                       value={styleConfig[sectionName]?.container?.backgroundColor === 'transparent' ? '#FFFFFF' : (styleConfig[sectionName]?.container?.backgroundColor || '#FFFFFF')}
//                       onChange={(e) => handleStyleChange(sectionName, 'container', e.target.value, 'backgroundColor')}
//                       className="control-color-small"
//                       disabled={styleConfig[sectionName]?.container?.backgroundColor === 'transparent'}
//                     />
//                     <button
//                       onClick={() => {
//                         const currentBg = styleConfig[sectionName]?.container?.backgroundColor;
//                         handleStyleChange(sectionName, 'container', currentBg === 'transparent' ? '#FFFFFF' : 'transparent', 'backgroundColor');
//                       }}
//                       className={`btn-transparent ${styleConfig[sectionName]?.container?.backgroundColor === 'transparent' ? 'active' : ''}`}
//                       title="Toggle Transparent"
//                     >
//                       {styleConfig[sectionName]?.container?.backgroundColor === 'transparent' ? '⊘' : 'T'}
//                     </button>
//                   </div>
//                 </div>

//                 {styleConfig[sectionName]?.titleStyle && (
//                   <>
//                     <div className="control-item">
//                       <label className="control-label-small">Title Size</label>
//                       <input 
//                         type="number" 
//                         value={parseInt(styleConfig[sectionName]?.titleStyle?.fontSize) || 12}
//                         onChange={(e) => handleStyleChange(sectionName, 'titleStyle', `${e.target.value}px`, 'fontSize')}
//                         className="control-input-small"
//                         min="8"
//                         max="32"
//                       />
//                     </div>

//                     <div className="control-item">
//                       <label className="control-label-small">Title Color</label>
//                       <input 
//                         type="color" 
//                         value={styleConfig[sectionName]?.titleStyle?.color || '#000000'}
//                         onChange={(e) => handleStyleChange(sectionName, 'titleStyle', e.target.value, 'color')}
//                         className="control-color-small"
//                       />
//                     </div>

//                     <div className="control-item">
//                       <label className="control-label-small">Title Weight</label>
//                       <select 
//                         value={styleConfig[sectionName]?.titleStyle?.fontWeight || 'bold'}
//                         onChange={(e) => handleStyleChange(sectionName, 'titleStyle', e.target.value, 'fontWeight')}
//                         className="control-input-small"
//                       >
//                         <option value="normal">Normal</option>
//                         <option value="600">Semi-Bold</option>
//                         <option value="bold">Bold</option>
//                         <option value="800">Extra Bold</option>
//                       </select>
//                     </div>

//                     <div className="control-item">
//                       <label className="control-label-small">Title Margin</label>
//                       <input 
//                         type="number" 
//                         value={parseInt(styleConfig[sectionName]?.titleStyle?.marginBottom) || 0}
//                         onChange={(e) => handleStyleChange(sectionName, 'titleStyle', `${e.target.value}px`, 'marginBottom')}
//                         className="control-input-small"
//                         min="0"
//                         max="30"
//                       />
//                     </div>
//                   </>
//                 )}

//                 {styleConfig[sectionName]?.bodyStyle && (
//                   <>
//                     <div className="control-item">
//                       <label className="control-label-small">Body Size</label>
//                       <input 
//                         type="number" 
//                         value={parseInt(styleConfig[sectionName]?.bodyStyle?.fontSize) || 10}
//                         onChange={(e) => handleStyleChange(sectionName, 'bodyStyle', `${e.target.value}px`, 'fontSize')}
//                         className="control-input-small"
//                         min="6"
//                         max="24"
//                       />
//                     </div>

//                     <div className="control-item">
//                       <label className="control-label-small">Body Color</label>
//                       <input 
//                         type="color" 
//                         value={styleConfig[sectionName]?.bodyStyle?.color || '#000000'}
//                         onChange={(e) => handleStyleChange(sectionName, 'bodyStyle', e.target.value, 'color')}
//                         className="control-color-small"
//                       />
//                     </div>

//                     <div className="control-item">
//                       <label className="control-label-small">Line Height</label>
//                       <input 
//                         type="number" 
//                         step="0.1"
//                         value={parseFloat(styleConfig[sectionName]?.bodyStyle?.lineHeight) || 1.5}
//                         onChange={(e) => handleStyleChange(sectionName, 'bodyStyle', e.target.value, 'lineHeight')}
//                         className="control-input-small"
//                         min="1"
//                         max="2.5"
//                       />
//                     </div>

//                     <div className="control-item">
//                       <label className="control-label-small">Body Margin</label>
//                       <input 
//                         type="number" 
//                         value={parseInt(styleConfig[sectionName]?.bodyStyle?.marginBottom) || 0}
//                         onChange={(e) => handleStyleChange(sectionName, 'bodyStyle', `${e.target.value}px`, 'marginBottom')}
//                         className="control-input-small"
//                         min="0"
//                         max="30"
//                       />
//                     </div>
//                   </>
//                 )}

//                 {/* Subtitle styles for experience/projects */}
//                 {styleConfig[sectionName]?.subtitleStyle && (
//                   <>
//                     <div className="control-item">
//                       <label className="control-label-small">Subtitle Size</label>
//                       <input 
//                         type="number" 
//                         value={parseInt(styleConfig[sectionName]?.subtitleStyle?.fontSize) || 10}
//                         onChange={(e) => handleStyleChange(sectionName, 'subtitleStyle', `${e.target.value}px`, 'fontSize')}
//                         className="control-input-small"
//                         min="6"
//                         max="20"
//                       />
//                     </div>

//                     <div className="control-item">
//                       <label className="control-label-small">Subtitle Color</label>
//                       <input 
//                         type="color" 
//                         value={styleConfig[sectionName]?.subtitleStyle?.color || '#666666'}
//                         onChange={(e) => handleStyleChange(sectionName, 'subtitleStyle', e.target.value, 'color')}
//                         className="control-color-small"
//                       />
//                     </div>

//                     <div className="control-item">
//                       <label className="control-label-small">Subtitle Weight</label>
//                       <select 
//                         value={styleConfig[sectionName]?.subtitleStyle?.fontWeight || 'normal'}
//                         onChange={(e) => handleStyleChange(sectionName, 'subtitleStyle', e.target.value, 'fontWeight')}
//                         className="control-input-small"
//                       >
//                         <option value="normal">Normal</option>
//                         <option value="600">Semi-Bold</option>
//                         <option value="bold">Bold</option>
//                       </select>
//                     </div>
//                   </>
//                 )}

//                 {/* Date styles for experience/projects/education */}
//                 {styleConfig[sectionName]?.dateStyle && (
//                   <>
//                     <div className="control-item">
//                       <label className="control-label-small">Date Size</label>
//                       <input 
//                         type="number" 
//                         value={parseInt(styleConfig[sectionName]?.dateStyle?.fontSize) || 9}
//                         onChange={(e) => handleStyleChange(sectionName, 'dateStyle', `${e.target.value}px`, 'fontSize')}
//                         className="control-input-small"
//                         min="6"
//                         max="16"
//                       />
//                     </div>

//                     <div className="control-item">
//                       <label className="control-label-small">Date Color</label>
//                       <input 
//                         type="color" 
//                         value={styleConfig[sectionName]?.dateStyle?.color || '#888888'}
//                         onChange={(e) => handleStyleChange(sectionName, 'dateStyle', e.target.value, 'color')}
//                         className="control-color-small"
//                       />
//                     </div>
//                   </>
//                 )}
//               </div>
//             </details>
//           )})}
//         </div>
        
//         <button onClick={resetLayout} className="btn-primary full-width">
//           ↻ RESET LAYOUT
//         </button>
        
//         <button onClick={autoFlowSections} className="btn-primary full-width" style={{ background: '#10b981', borderColor: '#10b981' }}>
//           ⚡ AUTO-FLOW CONTENT
//         </button>
        
//         <div className="button-grid">
//           <button onClick={downloadResume} className="btn-secondary">PNG</button>
//           <button onClick={() => alert('PDF export coming soon')} className="btn-secondary">PDF</button>
//         </div>
        
//         <h3 className="panel-title">DIVIDER LINES</h3>
//         <div className="button-grid">
//           <button onClick={() => addLine('horizontal')} className="btn-secondary">─ H</button>
//           <button onClick={() => addLine('vertical')} className="btn-secondary">│ V</button>
//         </div>
        
//         {lines.length > 0 && lines.map(line => (
//           <div key={line.id} className={`line-control ${selectedLine === line.id ? 'selected' : ''}`}>
//             <div className="line-header">
//               <span className="line-label">{line.label}</span>
//               <button onClick={() => deleteLine(line.id)} className="btn-delete">✕</button>
//             </div>
            
//             <div className="line-move-control">
//               <label className="control-label">Move Position</label>
//               <div className="arrow-grid">
//                 <div></div>
//                 <button onClick={() => moveLine(line.id, 'up')} className="btn-arrow">↑</button>
//                 <div></div>
//                 <button onClick={() => moveLine(line.id, 'left')} className="btn-arrow">←</button>
//                 <div className="arrow-center">MOVE</div>
//                 <button onClick={() => moveLine(line.id, 'right')} className="btn-arrow">→</button>
//                 <div></div>
//                 <button onClick={() => moveLine(line.id, 'down')} className="btn-arrow">↓</button>
//                 <div></div>
//               </div>
//             </div>
            
//             <div className="line-resize-control">
//               <label className="control-label">
//                 Resize {line.orientation === 'vertical' ? 'Height' : 'Width'}
//               </label>
//               <div className="resize-buttons">
//                 <button onClick={() => resizeLine(line.id, 'decrease')} className="btn-resize">−</button>
//                 <button onClick={() => resizeLine(line.id, 'increase')} className="btn-resize">+</button>
//               </div>
//             </div>
            
//             <div className="line-properties">
//               <div className="property-control">
//                 <label className="control-label">Thickness</label>
//                 <input 
//                   type="number" 
//                   value={line.thickness} 
//                   onChange={(e) => updateLine(line.id, 'thickness', parseFloat(e.target.value))} 
//                   step="0.5" 
//                   className="control-input"
//                 />
//               </div>
//               <div className="property-control">
//                 <label className="control-label">Color</label>
//                 <input 
//                   type="color" 
//                   value={line.color} 
//                   onChange={(e) => updateLine(line.id, 'color', e.target.value)} 
//                   className="control-color"
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* MIDDLE - Canvas */}
//       <div className="canvas-container">
//         <div className="canvas-scroll-wrapper">
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
//             <div className="canvas-wrapper" style={{ transform: `scale(${zoom})` }}>
//               <canvas ref={canvasRef} />
//             </div>
            
//             {showPage2 && (
//               <div className="canvas-wrapper" style={{ transform: `scale(${zoom})` }}>
//                 <canvas ref={canvas2Ref} />
//                 <div className="page-number">Page 2</div>
//               </div>
//             )}
//           </div>
//         </div>
        
//         <div className="zoom-controls">
//           <button onClick={() => setZoom(Math.max(0.3, zoom - 0.1))} className="btn-zoom">−</button>
//           <span className="zoom-value">{Math.round(zoom * 100)}%</span>
//           <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="btn-zoom">+</button>
//           <button onClick={() => setZoom(1)} className="btn-zoom-reset">100%</button>
//           <button onClick={() => setZoom(0.7)} className="btn-zoom-reset">FIT</button>
//           <button 
//             onClick={() => setShowPage2(!showPage2)} 
//             className={`btn-zoom-reset ${showPage2 ? 'active' : ''}`}
//             style={{ marginLeft: '10px' }}
//           >
//             {showPage2 ? '1 PAGE' : '2 PAGES'}
//           </button>
//         </div>
        
//         <div className="canvas-hint">💡 DRAG & RESIZE • Scroll to see more</div>
//         <div className="template-badge">
//           {currentTemplate === 'ats' ? '📄 ATS' : currentTemplate === 'modern' ? '✨ MODERN' : '📑 TWO COLUMN'}
//         </div>
//       </div>

//       {/* RIGHT PANEL - Quick Style Controls */}
//       <div className="right-panel">
//         <h3 className="panel-title">QUICK STYLE</h3>
        
//         <div className="style-section">
//           <h4 className="section-subtitle">GLOBAL SPACING</h4>
          
//           <div className="control-group">
//             <label className="control-label">Section Spacing (All)</label>
//             <input 
//               type="number" 
//               value={parseInt(styleConfig.header?.container?.marginBottom) || 0}
//               onChange={(e) => {
//                 const newMargin = `${e.target.value}px`;
//                 Object.keys(styleConfig).forEach(section => {
//                   if (styleConfig[section]?.container) {
//                     handleStyleChange(section, 'container', newMargin, 'marginBottom');
//                   }
//                 });
//               }}
//               min="0" 
//               max="40" 
//               className="control-input"
//             />
//           </div>

//           <div className="control-group">
//             <label className="control-label">Item Spacing (entries)</label>
//             <input 
//               type="number" 
//               value={parseInt(styleConfig.experience?.itemSpacing) || 0}
//               onChange={(e) => {
//                 const newSpacing = `${e.target.value}px`;
//                 ['experience', 'projects', 'education', 'certifications'].forEach(section => {
//                   if (styleConfig[section]) {
//                     handleStyleChange(section, 'itemSpacing', newSpacing);
//                   }
//                 });
//               }}
//               min="0" 
//               max="30" 
//               className="control-input"
//             />
//           </div>
//         </div>

//         <div className="style-section">
//           <h4 className="section-subtitle">COLORS</h4>
          
//           <div className="control-group">
//             <button 
//               onClick={() => {
//                 // Make all section backgrounds transparent (but NOT page background)
//                 Object.keys(styleConfig).forEach(section => {
//                   if (section !== 'page' && styleConfig[section]?.container?.backgroundColor) {
//                     handleStyleChange(section, 'container', 'transparent', 'backgroundColor');
//                   }
//                 });
//               }}
//               className="btn-secondary full-width"
//               style={{ marginBottom: '12px' }}
//             >
//               🔲 MAKE ALL SECTIONS TRANSPARENT
//             </button>
//           </div>
          
//           <div className="control-group">
//             <label className="control-label">Page Background</label>
//             <input 
//               type="color" 
//               value={styleConfig.page?.backgroundColor || '#FFFFFF'} 
//               onChange={(e) => handleStyleChange('page', 'backgroundColor', e.target.value)}
//               className="control-color"
//             />
//             <small style={{ color: '#999', fontSize: '9px', marginTop: '4px', display: 'block' }}>
//               ⚠️ Page background cannot be transparent
//             </small>
//           </div>

//           <div className="control-group">
//             <label className="control-label">Primary Text Color</label>
//             <input 
//               type="color" 
//               value={styleConfig.header?.nameStyle?.color || '#000000'} 
//               onChange={(e) => handleStyleChange('header', 'nameStyle', e.target.value, 'color')}
//               className="control-color"
//             />
//           </div>

//           <div className="control-group">
//             <label className="control-label">Section Title Color (All)</label>
//             <input 
//               type="color" 
//               value={styleConfig.summary?.titleStyle?.color || '#000000'} 
//               onChange={(e) => {
//                 const newColor = e.target.value;
//                 ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'].forEach(section => {
//                   if (styleConfig[section]?.titleStyle) {
//                     handleStyleChange(section, 'titleStyle', newColor, 'color');
//                   }
//                 });
//               }}
//               className="control-color"
//             />
//           </div>

//           <div className="control-group">
//             <label className="control-label">Subtitle/Company Color</label>
//             <input 
//               type="color" 
//               value={styleConfig.experience?.subtitleStyle?.color || '#666666'} 
//               onChange={(e) => {
//                 const newColor = e.target.value;
//                 ['experience', 'projects', 'education'].forEach(section => {
//                   if (styleConfig[section]?.subtitleStyle) {
//                     handleStyleChange(section, 'subtitleStyle', newColor, 'color');
//                   }
//                 });
//               }}
//               className="control-color"
//             />
//           </div>

//           <div className="control-group">
//             <label className="control-label">Date/Meta Color</label>
//             <input 
//               type="color" 
//               value={styleConfig.experience?.dateStyle?.color || '#888888'} 
//               onChange={(e) => {
//                 const newColor = e.target.value;
//                 ['experience', 'projects', 'education'].forEach(section => {
//                   if (styleConfig[section]?.dateStyle) {
//                     handleStyleChange(section, 'dateStyle', newColor, 'color');
//                   }
//                 });
//               }}
//               className="control-color"
//             />
//           </div>
//         </div>

//         <div className="style-section">
//           <h4 className="section-subtitle">TYPOGRAPHY</h4>
          
//           <div className="control-group">
//             <label className="control-label">Font Family</label>
//             <select 
//               value={styleConfig.header?.container?.fontFamily || 'Arial'}
//               onChange={(e) => {
//                 const newFont = e.target.value;
//                 Object.keys(styleConfig).forEach(section => {
//                   if (styleConfig[section]?.container) {
//                     handleStyleChange(section, 'container', newFont, 'fontFamily');
//                   }
//                 });
//               }}
//               className="control-select"
//             >
//               <option value="Arial">Arial</option>
//               <option value="Helvetica">Helvetica</option>
//               <option value="Times New Roman">Times New Roman</option>
//               <option value="Georgia">Georgia</option>
//               <option value="Verdana">Verdana</option>
//               <option value="Courier New">Courier New</option>
//               <option value="Calibri">Calibri</option>
//               <option value="Roboto">Roboto</option>
//             </select>
//           </div>

//           <div className="control-group">
//             <label className="control-label">Header Name Size</label>
//             <input 
//               type="number" 
//               value={parseInt(styleConfig.header?.nameStyle?.fontSize) || 24}
//               onChange={(e) => handleStyleChange('header', 'nameStyle', `${e.target.value}px`, 'fontSize')}
//               min="16" 
//               max="48" 
//               className="control-input"
//             />
//           </div>

//           <div className="control-group">
//             <label className="control-label">Section Title Size (All)</label>
//             <input 
//               type="number" 
//               value={parseInt(styleConfig.summary?.titleStyle?.fontSize) || 12}
//               onChange={(e) => {
//                 const newSize = `${e.target.value}px`;
//                 ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'].forEach(section => {
//                   if (styleConfig[section]?.titleStyle) {
//                     handleStyleChange(section, 'titleStyle', newSize, 'fontSize');
//                   }
//                 });
//               }}
//               min="8" 
//               max="24" 
//               className="control-input"
//             />
//           </div>

//           <div className="control-group">
//             <label className="control-label">Body Text Size (All)</label>
//             <input 
//               type="number" 
//               value={parseInt(styleConfig.summary?.bodyStyle?.fontSize) || 10}
//               onChange={(e) => {
//                 const newSize = `${e.target.value}px`;
//                 Object.keys(styleConfig).forEach(section => {
//                   if (styleConfig[section]?.bodyStyle) {
//                     handleStyleChange(section, 'bodyStyle', newSize, 'fontSize');
//                   }
//                 });
//               }}
//               min="7" 
//               max="20" 
//               className="control-input"
//             />
//           </div>

//           <div className="control-group">
//             <label className="control-label">Line Height (All)</label>
//             <input 
//               type="number" 
//               step="0.1"
//               value={parseFloat(styleConfig.summary?.bodyStyle?.lineHeight) || 1.5}
//               onChange={(e) => {
//                 const newHeight = e.target.value;
//                 Object.keys(styleConfig).forEach(section => {
//                   if (styleConfig[section]?.bodyStyle) {
//                     handleStyleChange(section, 'bodyStyle', newHeight, 'lineHeight');
//                   }
//                 });
//               }}
//               min="1" 
//               max="2.5" 
//               className="control-input"
//             />
//           </div>
//         </div>

//         <div className="style-section">
//           <h4 className="section-subtitle">BULLETS</h4>
          
//           <div className="control-group">
//             <label className="control-label">Bullet Style</label>
//             <select 
//               value={styleConfig.experience?.bulletConfig?.bulletStyle || '•'}
//               onChange={(e) => {
//                 const newBullet = e.target.value;
//                 ['experience', 'projects'].forEach(section => {
//                   if (styleConfig[section]?.bulletConfig) {
//                     handleStyleChange(section, 'bulletConfig', newBullet, 'bulletStyle');
//                   }
//                 });
//               }}
//               className="control-select"
//             >
//               <option value="•">• Bullet</option>
//               <option value="▪">▪ Square</option>
//               <option value="→">→ Arrow</option>
//               <option value="›">› Angle</option>
//               <option value="-">- Dash</option>
//               <option value="✓">✓ Check</option>
//             </select>
//           </div>

//           <div className="control-group">
//             <label className="control-label">Bullet Color</label>
//             <input 
//               type="color" 
//               value={styleConfig.experience?.bulletConfig?.bulletColor || '#000000'}
//               onChange={(e) => {
//                 const newColor = e.target.value;
//                 ['experience', 'projects'].forEach(section => {
//                   if (styleConfig[section]?.bulletConfig) {
//                     handleStyleChange(section, 'bulletConfig', newColor, 'bulletColor');
//                   }
//                 });
//               }}
//               className="control-color"
//             />
//           </div>

//           <div className="control-group">
//             <label className="control-label">Bullet Spacing</label>
//             <input 
//               type="number" 
//               value={parseInt(styleConfig.experience?.bulletConfig?.bulletSpacing) || 5}
//               onChange={(e) => {
//                 const newSpacing = `${e.target.value}px`;
//                 ['experience', 'projects'].forEach(section => {
//                   if (styleConfig[section]?.bulletConfig) {
//                     handleStyleChange(section, 'bulletConfig', newSpacing, 'bulletSpacing');
//                   }
//                 });
//               }}
//               min="0" 
//               max="20" 
//               className="control-input"
//             />
//           </div>
//         </div>

//         {/* Advanced Section Controls */}
//         <details className="collapsible">
//           <summary>HEADER LAYOUT</summary>
          
//           <div className="control-group">
//             <label className="control-label">Layout Direction</label>
//             <select 
//               value={styleConfig.header?.mainLayout?.flexDirection || 'column'}
//               onChange={(e) => handleStyleChange('header', 'mainLayout', e.target.value, 'flexDirection')}
//               className="control-select"
//             >
//               <option value="column">Vertical (Stacked)</option>
//               <option value="row">Horizontal (Side-by-side)</option>
//             </select>
//           </div>

//           <div className="control-group">
//             <label className="control-label">Alignment</label>
//             <select 
//               value={styleConfig.header?.mainLayout?.alignItems || 'stretch'}
//               onChange={(e) => handleStyleChange('header', 'mainLayout', e.target.value, 'alignItems')}
//               className="control-select"
//             >
//               <option value="flex-start">Left</option>
//               <option value="center">Center</option>
//               <option value="flex-end">Right</option>
//               <option value="stretch">Stretch</option>
//             </select>
//           </div>

//           <div className="control-group">
//             <label className="control-label">Show Divider</label>
//             <select 
//               value={styleConfig.header?.showDivider ? 'yes' : 'no'}
//               onChange={(e) => handleStyleChange('header', 'showDivider', e.target.value === 'yes')}
//               className="control-select"
//             >
//               <option value="yes">Yes</option>
//               <option value="no">No</option>
//             </select>
//           </div>
//         </details>

//         <details className="collapsible">
//           <summary>SKILLS DISPLAY</summary>
          
//           <div className="control-group">
//             <label className="control-label">Display Type</label>
//             <select 
//               value={styleConfig.skills?.displayType || 'inline'}
//               onChange={(e) => handleStyleChange('skills', 'displayType', e.target.value)}
//               className="control-select"
//             >
//               <option value="inline">Inline (comma separated)</option>
//               <option value="list">List (bullet points)</option>
//             </select>
//           </div>

//           <div className="control-group">
//             <label className="control-label">Show Categories</label>
//             <select 
//               value={styleConfig.skills?.showCategories ? 'yes' : 'no'}
//               onChange={(e) => handleStyleChange('skills', 'showCategories', e.target.value === 'yes')}
//               className="control-select"
//             >
//               <option value="yes">Yes</option>
//               <option value="no">No</option>
//             </select>
//           </div>

//           {styleConfig.skills?.displayType === 'inline' && (
//             <div className="control-group">
//               <label className="control-label">Separator</label>
//               <input 
//                 type="text" 
//                 value={styleConfig.skills?.separator || ', '}
//                 onChange={(e) => handleStyleChange('skills', 'separator', e.target.value)}
//                 className="control-input"
//                 placeholder=", "
//               />
//             </div>
//           )}
//         </details>

//         <details className="collapsible">
//           <summary>EXPERIENCE LAYOUT</summary>
          
//           <div className="control-group">
//             <label className="control-label">Show Position First</label>
//             <select 
//               value={styleConfig.experience?.positionFirst ? 'yes' : 'no'}
//               onChange={(e) => handleStyleChange('experience', 'positionFirst', e.target.value === 'yes')}
//               className="control-select"
//             >
//               <option value="yes">Position First</option>
//               <option value="no">Company First</option>
//             </select>
//           </div>

//           <div className="control-group">
//             <label className="control-label">Show Location</label>
//             <select 
//               value={styleConfig.experience?.showLocation ? 'yes' : 'no'}
//               onChange={(e) => handleStyleChange('experience', 'showLocation', e.target.value === 'yes')}
//               className="control-select"
//             >
//               <option value="yes">Yes</option>
//               <option value="no">No</option>
//             </select>
//           </div>
//         </details>

//         {/* Info Box */}
//         <div className="info-box">
//           <div className="info-title">💡 PRO TIP</div>
//           <div className="info-text">
//             Use <strong>AUTO-FLOW CONTENT</strong> to automatically arrange sections without overlapping. It calculates actual heights and positions them smartly across pages!
//           </div>
//         </div>
        
//         <div className="info-box" style={{ marginTop: '12px', borderColor: '#10b981' }}>
//           <div className="info-title" style={{ color: '#10b981' }}>⚡ AUTO-FLOW</div>
//           <div className="info-text">
//             • Calculates real section heights<br/>
//             • Prevents overlapping<br/>
//             • Auto-enables Page 2 if needed<br/>
//             • Works with 2-column layouts
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UIEditor;


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

  const TEMPLATES = {
    ats: ATS_TEMPLATE_CONFIG,
    modern: MODERN_TEMPLATE_CONFIG,
    twoColumn: TWO_COLUMN_TEMPLATE_CONFIG
  };

  // ==================== TEMPLATE COMPONENTS ====================

const HeaderComponent = ({ resumeDetails, styleConfig }) => (
  <div style={{ ...styleConfig?.header?.container, fontFamily: 'Arial, sans-serif' }}>
    <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{resumeDetails?.name || 'Name'}</h1>
    <p style={{ margin: '4px 0', fontSize: '12px' }}>{resumeDetails?.title || 'Title'}</p>
    <p style={{ margin: '2px 0', fontSize: '9px', color: '#666' }}>
      {resumeDetails?.email} | {resumeDetails?.phone}
    </p>
  </div>
);

const SummaryComponent = ({ summary, styleConfig }) => (
  <div style={{ ...styleConfig?.summary?.container, fontFamily: 'Arial, sans-serif' }}>
    <h2 style={{ ...styleConfig?.summary?.titleStyle, margin: '0 0 8px 0', fontWeight: 'bold' }}>Summary</h2>
    <p style={{ ...styleConfig?.summary?.bodyStyle, margin: 0, lineHeight: '1.4' }}>{summary || 'Summary text...'}</p>
  </div>
);

const SkillsComponent = ({ skills, styleConfig }) => (
  <div style={{ ...styleConfig?.skills?.container, fontFamily: 'Arial, sans-serif' }}>
    <h2 style={{ ...styleConfig?.skills?.titleStyle, margin: '0 0 8px 0', fontWeight: 'bold' }}>Skills</h2>
    {skills?.map((skill, idx) => (
      <div key={idx} style={{ marginBottom: '6px' }}>
        <strong style={{ ...styleConfig?.skills?.bodyStyle, fontSize: '10px' }}>{skill.category}:</strong>
        <span style={{ ...styleConfig?.skills?.bodyStyle, marginLeft: '4px' }}>{skill.items?.join(', ')}</span>
      </div>
    ))}
  </div>
);

const ExperienceComponent = ({ experiences, styleConfig }) => (
  <div style={{ ...styleConfig?.experience?.container, fontFamily: 'Arial, sans-serif' }}>
    <h2 style={{ ...styleConfig?.experience?.titleStyle, margin: '0 0 8px 0', fontWeight: 'bold' }}>Experience</h2>
    {experiences?.map((exp, idx) => (
      <div key={idx} style={{ marginBottom: '12px' }}>
        <h3 style={{ ...styleConfig?.experience?.bodyStyle, margin: '0', fontWeight: 'bold', fontSize: '11px' }}>
          {exp.title} - {exp.company}
        </h3>
        <p style={{ ...styleConfig?.experience?.bodyStyle, margin: '2px 0', fontSize: '9px' }}>
          {exp.startDate} - {exp.endDate}
        </p>
        <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
          {exp.description?.map((item, i) => (
            <li key={i} style={{ ...styleConfig?.experience?.bodyStyle, marginBottom: '2px' }}>{item}</li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const EducationComponent = ({ educationList, styleConfig }) => (
  <div style={{ ...styleConfig?.education?.container, fontFamily: 'Arial, sans-serif' }}>
    <h2 style={{ ...styleConfig?.education?.titleStyle, margin: '0 0 8px 0', fontWeight: 'bold' }}>Education</h2>
    {educationList?.map((edu, idx) => (
      <div key={idx} style={{ marginBottom: '8px' }}>
        <h3 style={{ ...styleConfig?.education?.bodyStyle, margin: '0', fontWeight: 'bold', fontSize: '11px' }}>
          {edu.degree}
        </h3>
        <p style={{ ...styleConfig?.education?.bodyStyle, margin: '2px 0' }}>
          {edu.school} - {edu.graduationDate}
        </p>
      </div>
    ))}
  </div>
);

const ProjectsComponent = ({ projects, styleConfig }) => (
  <div style={{ ...styleConfig?.projects?.container, fontFamily: 'Arial, sans-serif' }}>
    <h2 style={{ ...styleConfig?.projects?.titleStyle, margin: '0 0 8px 0', fontWeight: 'bold' }}>Projects</h2>
    {projects?.map((proj, idx) => (
      <div key={idx} style={{ marginBottom: '8px' }}>
        <h3 style={{ ...styleConfig?.projects?.bodyStyle, margin: '0', fontWeight: 'bold', fontSize: '11px' }}>
          {proj.name}
        </h3>
        <p style={{ ...styleConfig?.projects?.bodyStyle, margin: '2px 0' }}>{proj.description}</p>
      </div>
    ))}
  </div>
);

const CertificationsComponent = ({ certifications, styleConfig }) => (
  <div style={{ ...styleConfig?.certifications?.container, fontFamily: 'Arial, sans-serif' }}>
    <h2 style={{ ...styleConfig?.certifications?.titleStyle, margin: '0 0 8px 0', fontWeight: 'bold' }}>Certifications</h2>
    {certifications?.map((cert, idx) => (
      <div key={idx} style={{ marginBottom: '6px' }}>
        <p style={{ ...styleConfig?.certifications?.bodyStyle, margin: '0', fontWeight: 'bold' }}>{cert.name}</p>
        <p style={{ ...styleConfig?.certifications?.bodyStyle, margin: '2px 0', fontSize: '9px' }}>
          {cert.issuer} - {cert.date}
        </p>
      </div>
    ))}
  </div>
);





  // ==================== HELPER FUNCTIONS ====================

  // Extract widths from config
  const extractWidthsFromConfig = (config) => {
    const widths = {};
    Object.keys(config).forEach(key => {
      if (config[key]?.container?.width) {
        widths[key] = config[key].container.width;
      }
    });
    return widths;
  };

  // Handle width change
  const handleWidthChange = (sectionName, value) => {
    setSectionWidths(prev => ({
      ...prev,
      [sectionName]: value
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

  // Reset Layout
  const resetLayout = () => {
    const template = TEMPLATES[currentTemplate];
    setSectionPositions(template.positions || {});
    setSectionWidths(extractWidthsFromConfig(template));
    setLines(template.lines || []);
    setBackgroundShapes(template.backgroundShapes || []);
    setZoom(1);
    
    // Reset line and shape ID counters
    if (template.lines && template.lines.length > 0) {
      setNextLineId(Math.max(...template.lines.map(l => l.id)) + 1);
    } else {
      setNextLineId(1);
    }
    if (template.backgroundShapes && template.backgroundShapes.length > 0) {
      setNextShapeId(Math.max(...template.backgroundShapes.map(s => s.id)) + 1);
    } else {
      setNextShapeId(1);
    }
  };

  // Download as image
  const downloadResume = () => {
    if (!stageRef.current) return;
    
    const uri1 = stageRef.current.toDataURL({ pixelRatio: 3 });
    const link1 = document.createElement('a');
    link1.download = 'resume-page1.png';
    link1.href = uri1;
    link1.click();
    
    if (showPage2 && stage2Ref.current) {
      setTimeout(() => {
        const uri2 = stage2Ref.current.toDataURL({ pixelRatio: 3 });
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

  const handleTemplateSwitch = (templateName) => {
    setCurrentTemplate(templateName);
    const template = TEMPLATES[templateName];
    setStyleConfig(template);
    setSectionPositions(template.positions || {});
    setSectionWidths(extractWidthsFromConfig(template));
    setLines(template.lines || []);
    setBackgroundShapes(template.backgroundShapes || []);
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
    if (template.backgroundShapes && template.backgroundShapes.length > 0) {
      setNextShapeId(Math.max(...template.backgroundShapes.map(s => s.id)) + 1);
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
      
      switch(direction) {
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

  // Handle section transform
  const handleSectionTransform = (sectionName, newAttrs) => {
    setSectionPositions(prev => ({
      ...prev,
      [sectionName]: {
        x: newAttrs.x,
        y: newAttrs.y
      }
    }));
    
    if (newAttrs.width) {
      setSectionWidths(prev => ({
        ...prev,
        [sectionName]: `${Math.round(newAttrs.width)}px`
      }));
      
      setStyleConfig(prev => ({
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          container: {
            ...prev[sectionName]?.container,
            width: `${Math.round(newAttrs.width)}px`
          }
        }
      }));
    }
  };

  // Auto-flow sections
  const autoFlowSections = () => {
    let currentY = 50;
    const spacing = 20;
    const sortedSections = Object.keys(sectionPositions).sort((a, b) => {
      const posA = sectionPositions[a];
      const posB = sectionPositions[b];
      return (posA?.y || 0) - (posB?.y || 0);
    });
    
    const newPositions = {};
    
    sortedSections.forEach(sectionName => {
      const img = sectionImages[sectionName];
      const height = img ? img.height : 100;
      
      newPositions[sectionName] = {
        x: sectionPositions[sectionName]?.x || 40,
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

  // Draggable Section Component
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
              x: e.target.x(),
              y: e.target.y()
            });
          }}
          onTransformEnd={() => {
            const node = imageRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            
            onTransform(sectionName, {
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY)
            });
            
            node.scaleX(1);
            node.scaleY(1);
          }}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            rotateEnabled={false}
            enabledAnchors={['middle-left', 'middle-right']}
          />
        )}
      </>
    );
  };




  // ==================== USE EFFECTS ====================

  // Initialize template components
  useEffect(() => {
    console.log('Initializing template components...');
    
    setTemplateComponents({
      header: HeaderComponent,
      summary: SummaryComponent,
      skills: SkillsComponent,
      experience: ExperienceComponent,
      education: EducationComponent,
      projects: ProjectsComponent,
      certifications: CertificationsComponent
    });
    
    // Initialize section refs
    const sections = ['header', 'summary', 'skills', 'experience', 'education', 'projects', 'certifications'];
    sections.forEach(section => {
      if (!sectionRefs.current[section]) {
        sectionRefs.current[section] = React.createRef();
      }
    });
    
    console.log('Template components initialized');
  }, []);

  // Render sections as images
  useEffect(() => {
    if (!TemplateComponents) return;
    
    const renderSectionToImage = (sectionName) => {
      const ref = sectionRefs.current[sectionName];
      if (!ref?.current) {
        console.log(`No ref for ${sectionName}`);
        return;
      }
      
      const element = ref.current;
      const width = element.offsetWidth || 515;
      const height = element.offsetHeight || 100;
      
      console.log(`Rendering ${sectionName}: ${width}x${height}`);
      
      // Create high-res canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const scale = 1;
      
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);
      
      // Background
      const bgColor = styleConfig[sectionName]?.container?.backgroundColor;
      if (bgColor && bgColor !== 'transparent') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
      }
      
      // Get all text from element
      const allText = element.innerText || '';
      const lines = allText.split('\n').filter(line => line.trim());
      
      // Render text lines
      ctx.fillStyle = styleConfig[sectionName]?.bodyStyle?.color || '#000000';
      const fontSize = parseInt(styleConfig[sectionName]?.bodyStyle?.fontSize) || 10;
      ctx.font = `${fontSize}px Arial, sans-serif`;
      
      let y = 20;
      const lineHeight = fontSize + 6;
      const padding = 10;
      
      lines.forEach((line, idx) => {
        // Title style for first line (section header)
        if (idx === 0 && styleConfig[sectionName]?.titleStyle) {
          ctx.fillStyle = styleConfig[sectionName]?.titleStyle?.color || '#000000';
          ctx.font = `bold ${parseInt(styleConfig[sectionName]?.titleStyle?.fontSize) || 14}px Arial, sans-serif`;
        } else {
          ctx.fillStyle = styleConfig[sectionName]?.bodyStyle?.color || '#000000';
          ctx.font = `${fontSize}px Arial, sans-serif`;
        }
        
        // Wrap text if too long
        const maxWidth = width - (padding * 2);
        const words = line.split(' ');
        let currentLine = '';
        
        words.forEach((word) => {
          const testLine = currentLine + word + ' ';
          const metrics = ctx.measureText(testLine);
          
          if (metrics.width > maxWidth && currentLine !== '') {
            ctx.fillText(currentLine, padding, y);
            currentLine = word + ' ';
            y += lineHeight;
          } else {
            currentLine = testLine;
          }
        });
        
        ctx.fillText(currentLine, padding, y);
        y += lineHeight;
      });
      
      // Convert to image
      const img = new Image();
      img.onload = () => {
        console.log(`Successfully rendered ${sectionName}`);
        setSectionImages(prev => ({ ...prev, [sectionName]: img }));
      };
      img.onerror = () => {
        console.error(`Failed to render ${sectionName}`);
      };
      img.src = canvas.toDataURL();
    };
    
    // Delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const sections = Object.keys(sectionRefs.current);
      console.log('Rendering sections:', sections);
      sections.forEach(renderSectionToImage);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [TemplateComponents, styleConfig, resumeData, sectionWidths]);

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
      {/* Hidden rendering area */}
      <div className="hidden-render" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        {TemplateComponents && Object.entries(sectionRefs.current).map(([key, ref]) => {
          const Component = TemplateComponents[key];
          if (!Component) return null;
          
          const dataMap = {
            header: resumeData?.resumeDetails,
            summary: resumeData?.resumeDetails?.summary,
            skills: resumeData?.skills,
            experience: resumeData?.experiences,
            projects: resumeData?.projects,
            education: resumeData?.educationList,
            certifications: resumeData?.certifications
          };
          
          return (
            <div key={key} ref={ref} style={{ width: styleConfig[key]?.container?.width || 'auto' }}>
              <Component 
                {...(key === 'header' ? { resumeDetails: dataMap[key] } :
                   key === 'summary' ? { summary: dataMap[key] } :
                   key === 'skills' ? { skills: dataMap[key] } :
                   key === 'experience' ? { experiences: dataMap[key] } :
                   key === 'projects' ? { projects: dataMap[key] } :
                   key === 'education' ? { educationList: dataMap[key] } :
                   { certifications: dataMap[key] })}
                styleConfig={styleConfig}
              />
            </div>
          );
        })}
      </div>



      {/* LEFT PANEL - Section Controls */}
      <div className="left-panel">
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
              
                <div className="position-controls" style={{ marginBottom: '12px', padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
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
                      className="btn-secondary"
                      style={{ fontSize: '10px', padding: '4px 8px', flex: 1 }}
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
                      className="btn-secondary"
                      style={{ fontSize: '10px', padding: '4px 8px', flex: 1 }}
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
        
        <button onClick={autoFlowSections} className="btn-primary full-width" style={{ background: '#10b981', borderColor: '#10b981' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

      {/* RIGHT PANEL - Quick Style Controls */}
      <div className="right-panel">
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
            
            {/* Width */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                Width
              </label>
              <input 
                type="text" 
                value={sectionWidths[selectedSection] || '515px'} 
                onChange={(e) => handleWidthChange(selectedSection, e.target.value)} 
                onBlur={() => handleWidthBlur(selectedSection)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px'
                }}
                placeholder="e.g., 515px"
              />
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




    </div>
  );
};

export default UIEditor;