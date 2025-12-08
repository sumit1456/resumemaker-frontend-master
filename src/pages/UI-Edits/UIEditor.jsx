
import React, { useState, useRef, useEffect } from "react";
import { fabric } from "fabric";
import html2canvas from "html2canvas";
import { useSelector } from "react-redux";
import { mergeResumeData } from "./Utils";
import { ATS_TEMPLATE_CONFIG, MODERN_TEMPLATE_CONFIG, TWO_COLUMN_TEMPLATE_CONFIG } from "./TemplateConfigs";
import { defaultResumeData } from "./Utils";
import "./UIEditor.css";


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




              

const UIEditor = () => {
  const canvasRef = useRef(null);
  const canvas2Ref = useRef(null);
  const fabricRef = useRef(null);
  const fabric2Ref = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [showPage2, setShowPage2] = useState(false);
  const currentResume = useSelector((state) => state.resume.currentResume);
  
  // Template Management
  const [currentTemplate, setCurrentTemplate] = useState('ats');
  const TEMPLATES = {
    ats: ATS_TEMPLATE_CONFIG,
    modern: MODERN_TEMPLATE_CONFIG,
    twoColumn: TWO_COLUMN_TEMPLATE_CONFIG
  };
  
  // Style Config - initialized from template
  const [styleConfig, setStyleConfig] = useState(ATS_TEMPLATE_CONFIG);
  
  // Lines Management
  const [lines, setLines] = useState([]);
  const [nextLineId, setNextLineId] = useState(1);
  
  // Background Shapes Management
  const [backgroundShapes, setBackgroundShapes] = useState([]);
  const [nextShapeId, setNextShapeId] = useState(1);
  
  // Section Positions - initialized from template
  const [sectionPositions, setSectionPositions] = useState(ATS_TEMPLATE_CONFIG.positions);
  
  // Section Widths - extracted from template configs
  const [sectionWidths, setSectionWidths] = useState({});
  
  const [rememberedLinePositions, setRememberedLinePositions] = useState({});
  const [rememberedShapePositions, setRememberedShapePositions] = useState({});
  const [zoom, setZoom] = useState(1.0);
  const [sectionHeights, setSectionHeights] = useState({});

  // Resume Data
  let resumeData = null;
  if(currentResume){
     resumeData = currentResume;
  }
  else{
     resumeData = defaultResumeData;
  }

  // Section Refs for rendering
  const sectionRefs = {
    header: useRef(null),
    summary: useRef(null),
    skills: useRef(null),
    experience: useRef(null),
    projects: useRef(null),
    education: useRef(null),
    certifications: useRef(null)
  };

  // Template Components Mapping
  const TemplateComponents = {
    header: FlexibleHeaderSection,
    summary: FlexibleSummarySection,
    skills: FlexibleSkillsSection,
    experience: FlexibleExperienceSection,
    projects: FlexibleProjectsSection,
    education: FlexibleEducationSection,
    certifications: FlexibleCertificationsSection
  };

  // Extract widths from template config
  const extractWidthsFromConfig = (config) => {
    const widths = {};
    Object.keys(config).forEach(section => {
      if (config[section]?.container?.width) {
        const width = parseInt(config[section].container.width);
        if (!isNaN(width)) {
          widths[section] = width;
        }
      }
    });
    return widths;
  };

  // Template Switching
  const handleTemplateSwitch = (templateKey) => {
    const template = TEMPLATES[templateKey];
    setCurrentTemplate(templateKey);
    setStyleConfig(template);
    setSectionPositions(template.positions);
    setLines(template.lines || []);
    setBackgroundShapes(template.backgroundShapes || []);
    setSectionWidths(extractWidthsFromConfig(template));
    
    // Reset line ID counter
    if (template.lines && template.lines.length > 0) {
      setNextLineId(Math.max(...template.lines.map(l => l.id)) + 1);
    } else {
      setNextLineId(1);
    }
    
    // Reset shape ID counter
    if (template.backgroundShapes && template.backgroundShapes.length > 0) {
      setNextShapeId(Math.max(...template.backgroundShapes.map(s => s.id)) + 1);
    } else {
      setNextShapeId(1);
    }
  };

  // Initialize widths on mount
  useEffect(() => {
    setSectionWidths(extractWidthsFromConfig(styleConfig));
  }, []);

  // Render Section to Canvas


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
      
  //     // Get the section's background color - if transparent, use null for html2canvas
  //     const sectionBg = styleConfig[sectionName]?.container?.backgroundColor;
  //     const bgColor = (sectionBg === 'transparent' || !sectionBg) 
  //       ? null 
  //       : sectionBg;
      
  //     const canvas = await html2canvas(wrapper, { 
  //       scale: 2, // Increased from 1 to 2 for better quality
  //       backgroundColor: bgColor,
  //       logging: false,
  //       useCORS: true,
  //       allowTaint: true
  //     });
      
  //     document.body.removeChild(wrapper);
      
  //     return new Promise((resolve) => {
  //       fabric.Image.fromURL(canvas.toDataURL("image/png"), (img) => {
  //         const yPos = position.y;
  //         const targetCanvas = (yPos >= 842 && showPage2 && fabric2Ref.current) ? fabric2Ref.current : fabricRef.current;
  //         const adjustedY = yPos >= 842 ? yPos - 842 : yPos;
          
  //         img.set({ 
  //           left: position.x, 
  //           top: adjustedY, 
  //           scaleX: (position.scaleX || 1) * 0.5, // Scale down since we doubled the render
  //           scaleY: (position.scaleY || 1) * 0.5,
  //           selectable: true, 
  //           lockRotation: true, 
  //           cornerStyle: 'circle', 
  //           cornerColor: '#0066ff', 
  //           cornerSize: 10, 
  //           borderColor: '#0066ff' 
  //         });
  //         img.sectionName = sectionName;
  //         img.originalY = yPos; // Store original Y for page detection
  //         targetCanvas.add(img);
  //         resolve();
  //       });
  //     });
  //   } catch (err) { 
  //     console.error(err); 
  //   }
  // };


  // Render Section to Canvas - REPLACE THIS FUNCTION
const renderSectionToCanvas = async (refKey, sectionName) => {
  const element = sectionRefs[refKey].current;
  if (!element || !fabricRef.current) return;
  const position = sectionPositions[sectionName];
  
  try {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = "position:absolute;left:-99999px;display:inline-block";
    wrapper.appendChild(element.cloneNode(true));
    document.body.appendChild(wrapper);
    await new Promise(r => setTimeout(r, 10));
    
    const sectionBg = styleConfig[sectionName]?.container?.backgroundColor;
    const bgColor = (sectionBg === 'transparent' || !sectionBg) 
      ? null 
      : sectionBg;
    
    const canvas = await html2canvas(wrapper, { 
      scale: 2,
      backgroundColor: bgColor,
      logging: false,
      useCORS: true,
      allowTaint: true
    });
    
    document.body.removeChild(wrapper);
    
    return new Promise((resolve) => {
      fabric.Image.fromURL(canvas.toDataURL("image/png"), (img) => {
        const yPos = position.y;
        // Use 800 as threshold for page 2
        const targetCanvas = (yPos >= 800 && showPage2 && fabric2Ref.current) ? fabric2Ref.current : fabricRef.current;
        const adjustedY = yPos >= 800 ? yPos - 842 : yPos;
        
        img.set({ 
          left: position.x, 
          top: adjustedY, 
          scaleX: (position.scaleX || 1) * 0.5,
          scaleY: (position.scaleY || 1) * 0.5,
          selectable: true, 
          lockRotation: true, 
          cornerStyle: 'circle', 
          cornerColor: '#0066ff', 
          cornerSize: 10, 
          borderColor: '#0066ff' 
        });
        img.sectionName = sectionName;
        img.originalY = yPos;
        targetCanvas.add(img);
        resolve();
      });
    });
  } catch (err) { 
    console.error(err); 
  }
};

  // Render Background Shape to Canvas
  const renderBackgroundShapeToCanvas = (shape, targetCanvas) => {
    if (!targetCanvas) return;
    
    const fabricRect = new fabric.Rect({
      left: shape.x,
      top: shape.y,
      width: shape.width,
      height: shape.height,
      fill: shape.color,
      selectable: shape.selectable !== false,
      lockRotation: true,
      cornerColor: '#ff6b6b',
      cornerSize: 10,
      cornerStyle: 'circle',
      borderColor: '#ff6b6b',
      transparentCorners: false,
      hasRotatingPoint: false
    });
    
    fabricRect.shapeId = shape.id;
    targetCanvas.add(fabricRect);
    fabricRect.sendToBack();
  };

  // Render Background Shape to Canvas (legacy name for compatibility)
  const renderBackgroundShape = (shape) => {
    renderBackgroundShapeToCanvas(shape, fabricRef.current);
  };

  // Render Line to Canvas on Page 2
  const renderLineToCanvasOnPage2 = (line) => {
    if (!fabric2Ref.current) return;
    
    const fabricLine = new fabric.Line([line.x1, line.y1, line.x2, line.y2], {
      stroke: line.color, 
      strokeWidth: line.thickness, 
      selectable: true, 
      lockRotation: true,
      cornerColor: '#0066ff', 
      cornerSize: 10, 
      cornerStyle: 'circle', 
      borderColor: '#0066ff',
      transparentCorners: false,
      hasRotatingPoint: false,
      lockScalingFlip: true
    });
    
    fabricLine.lineId = line.id;
    fabricLine.lineOrientation = line.orientation;
    
    fabricLine.setControlsVisibility({
      mt: line.orientation === 'vertical',
      mb: line.orientation === 'vertical',
      ml: line.orientation === 'horizontal',
      mr: line.orientation === 'horizontal',
      tl: false, 
      tr: false, 
      bl: false, 
      br: false, 
      mtr: false
    });
    
    fabricLine.setCoords();
    fabric2Ref.current.add(fabricLine);
  };

  // Render Line to Canvas
  const renderLineToCanvas = (line) => {
    if (!fabricRef.current) return;
    
    const fabricLine = new fabric.Line([line.x1, line.y1, line.x2, line.y2], {
      stroke: line.color, 
      strokeWidth: line.thickness, 
      selectable: true, 
      lockRotation: true,
      cornerColor: '#0066ff', 
      cornerSize: 10, 
      cornerStyle: 'circle', 
      borderColor: '#0066ff',
      transparentCorners: false,
      hasRotatingPoint: false,
      lockScalingFlip: true
    });
    
    fabricLine.lineId = line.id;
    fabricLine.lineOrientation = line.orientation;
    
    fabricLine.setControlsVisibility({
      mt: line.orientation === 'vertical',
      mb: line.orientation === 'vertical',
      ml: line.orientation === 'horizontal',
      mr: line.orientation === 'horizontal',
      tl: false, 
      tr: false, 
      bl: false, 
      br: false, 
      mtr: false
    });
    
    fabricLine.setCoords();
    fabricRef.current.add(fabricLine);
  };

  // Render All Sections
  const renderAllSections = async () => {
    if (!fabricRef.current) return;
    
    fabricRef.current.clear();
    if (fabric2Ref.current) fabric2Ref.current.clear();
    
    const bgColor = styleConfig.page?.backgroundColor || styleConfig.header?.container?.backgroundColor || "#FFFFFF";
    fabricRef.current.backgroundColor = bgColor;
    if (fabric2Ref.current) fabric2Ref.current.backgroundColor = bgColor;
    
    fabricRef.current.renderAll();
    if (fabric2Ref.current) fabric2Ref.current.renderAll();
    
    await new Promise(r => setTimeout(r, 100));
    
    // Render background shapes on both pages
    backgroundShapes.forEach(shape => {
      const rememberedPos = rememberedShapePositions[shape.id];
      const shapeData = rememberedPos ? { ...shape, ...rememberedPos } : shape;
      
      if (shapeData.y < 842) {
        renderBackgroundShapeToCanvas(shapeData, fabricRef.current);
      }
      if (showPage2 && fabric2Ref.current && shapeData.y + shapeData.height > 842) {
        // Render on page 2 with adjusted Y position
        renderBackgroundShapeToCanvas({
          ...shapeData,
          y: shapeData.y - 842
        }, fabric2Ref.current);
      }
    });
    
    // Render sections
    await renderSectionToCanvas('header', "header");
    await renderSectionToCanvas('summary', "summary");
    await renderSectionToCanvas('skills', "skills");
    await renderSectionToCanvas('experience', "experience");
    await renderSectionToCanvas('projects', "projects");
    await renderSectionToCanvas('education', "education");
    await renderSectionToCanvas('certifications', "certifications");
    
    // Render lines on both pages
    lines.forEach(line => {
      const rememberedPos = rememberedLinePositions[line.id];
      const lineData = rememberedPos ? { ...line, ...rememberedPos } : line;
      
      if (lineData.y1 < 842 || lineData.y2 < 842) {
        renderLineToCanvas(lineData);
      }
      if (showPage2 && fabric2Ref.current && (lineData.y1 > 842 || lineData.y2 > 842)) {
        // Render on page 2 with adjusted Y position
        renderLineToCanvasOnPage2({
          ...lineData,
          y1: lineData.y1 - 842,
          y2: lineData.y2 - 842
        });
      }
    });
  };

  // Handle Object Modified
  // const handleObjectModified = (e) => {
  //   const obj = e.target;
    
  //   if (obj?.sectionName) {
  //     // Check if object was moved from canvas 1 to canvas 2 or vice versa
  //     const actualY = obj.originalY ? obj.originalY : obj.top;
  //     const newY = obj.canvas === fabric2Ref.current ? obj.top + 842 : obj.top;
      
  //     setSectionPositions(p => ({ 
  //       ...p, 
  //       [obj.sectionName]: { 
  //         x: Math.round(obj.left), 
  //         y: Math.round(newY), 
  //         scaleX: obj.scaleX, 
  //         scaleY: obj.scaleY 
  //       }
  //     }));
      
  //     // If section crossed page boundary, re-render
  //     if ((actualY < 842 && newY >= 842) || (actualY >= 842 && newY < 842)) {
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
      
  //     // Update remembered positions
  //     setRememberedShapePositions(prev => ({
  //       ...prev,
  //       [obj.shapeId]: shapeData
  //     }));
      
  //     // Update the shapes array
  //     setBackgroundShapes(p => p.map(s => {
  //       if (s.id === obj.shapeId) {
  //         return { ...s, ...shapeData };
  //       }
  //       return s;
  //     }));
  //   }
  // };


  // Handle Object Modified - REPLACE THIS FUNCTION
const handleObjectModified = (e) => {
  const obj = e.target;
  
  if (obj?.sectionName) {
    // Determine which canvas and calculate absolute Y position
    const isOnPage2 = obj.canvas === fabric2Ref.current;
    const absoluteY = isOnPage2 ? obj.top + 842 : obj.top;
    
    // Store the original Y for page detection
    const previousY = obj.originalY || sectionPositions[obj.sectionName]?.y || 0;
    
    setSectionPositions(p => ({ 
      ...p, 
      [obj.sectionName]: { 
        x: Math.round(obj.left), 
        y: Math.round(absoluteY), 
        scaleX: obj.scaleX, 
        scaleY: obj.scaleY 
      }
    }));
    
    // Update originalY for tracking
    obj.originalY = absoluteY;
    
    // If section crossed page boundary (around 800 threshold), re-render
    const crossedToPage2 = previousY < 800 && absoluteY >= 800;
    const crossedToPage1 = previousY >= 800 && absoluteY < 800;
    
    if (crossedToPage2 || crossedToPage1) {
      if (crossedToPage2) {
        setShowPage2(true);
      }
      setTimeout(renderAllSections, 100);
    }
  } else if (obj?.lineId) {
    const lineData = {
      x1: Math.round(obj.x1),
      y1: Math.round(obj.y1),
      x2: Math.round(obj.x2),
      y2: Math.round(obj.y2),
      thickness: Math.round(obj.strokeWidth)
    };
    
    setRememberedLinePositions(prev => ({
      ...prev,
      [obj.lineId]: lineData
    }));
    
    setLines(p => p.map(l => {
      if (l.id === obj.lineId) {
        return { ...l, ...lineData };
      }
      return l;
    }));
  } else if (obj?.shapeId) {
    const shapeData = {
      x: Math.round(obj.left),
      y: Math.round(obj.top),
      width: Math.round(obj.width * obj.scaleX),
      height: Math.round(obj.height * obj.scaleY)
    };
    
    setRememberedShapePositions(prev => ({
      ...prev,
      [obj.shapeId]: shapeData
    }));
    
    setBackgroundShapes(p => p.map(s => {
      if (s.id === obj.shapeId) {
        return { ...s, ...shapeData };
      }
      return s;
    }));
  }
};

  // Style Change Handler
  const handleStyleChange = (section, key, value, nestedKey = null) => {
    setStyleConfig(prev => {
      if (nestedKey) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [key]: {
              ...prev[section][key],
              [nestedKey]: value
            }
          }
        };
      } else {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [key]: value
          }
        };
      }
    });
  };

  // Width Change Handler
  const handleWidthChange = (sectionName, newWidth) => {
    setSectionWidths(p => ({ ...p, [sectionName]: newWidth }));
  };

  const handleWidthBlur = (sectionName) => {
    let width = parseInt(sectionWidths[sectionName]);
    
    if (isNaN(width) || width < 0) {
      width = 50;
    }
    
    if (width > 1000) {
      width = 1000;
    }
    
    setSectionWidths(p => ({ ...p, [sectionName]: width }));
    
    setStyleConfig(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        container: {
          ...prev[sectionName].container,
          width: `${width}px`
        }
      }
    }));
  };

  // Background Shape Management Functions
  const addBackgroundShape = () => {
    const newShape = {
      id: nextShapeId,
      x: 0,
      y: 0,
      width: 230,
      height: 842,
      color: '#2c3e50',
      selectable: true,
      label: `Background ${nextShapeId}`
    };
    setBackgroundShapes(p => [...p, newShape]);
    setNextShapeId(p => p + 1);
  };

  const updateBackgroundShape = (id, key, value) => {
    setBackgroundShapes(p => p.map(s => s.id === id ? { ...s, [key]: value } : s));
    
    // Also update remembered positions so changes persist
    if (['x', 'y', 'width', 'height'].includes(key)) {
      setRememberedShapePositions(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          [key]: value
        }
      }));
    }
  };

  const deleteBackgroundShape = (id) => {
    setBackgroundShapes(p => p.filter(s => s.id !== id));
    // Clean up remembered positions
    setRememberedShapePositions(prev => {
      const newPos = { ...prev };
      delete newPos[id];
      return newPos;
    });
  };

  // Calculate actual section heights
  const calculateSectionHeights = async () => {
    const heights = {};
    
    for (const [refKey, sectionName] of Object.entries({
      header: 'header',
      summary: 'summary',
      skills: 'skills',
      experience: 'experience',
      projects: 'projects',
      education: 'education',
      certifications: 'certifications'
    })) {
      const element = sectionRefs[refKey].current;
      if (element) {
        // Force a reflow to get accurate height
        element.style.display = 'block';
        await new Promise(r => setTimeout(r, 10));
        heights[sectionName] = element.offsetHeight;
      }
    }
    
    setSectionHeights(heights);
    return heights;
  };

  // Auto-flow sections to prevent overlapping
  const autoFlowSections = async () => {
    // First calculate all heights
    const heights = await calculateSectionHeights();
    const newPositions = { ...sectionPositions };
    
    // Get current template to determine column layout
    const leftColumnSections = ['header', 'skills', 'education'];
    const rightColumnSections = ['summary', 'experience', 'projects', 'certifications'];
    
    // Define column X positions and starting Y
    const leftX = 40;
    const rightX = 270;
    const spacing = 20; // Gap between sections
    
    // Flow left column
    let leftY = 30;
    leftColumnSections.forEach(section => {
      if (heights[section] && newPositions[section]) {
        newPositions[section] = {
          ...newPositions[section],
          x: leftX,
          y: Math.round(leftY)
        };
        leftY += heights[section] + spacing;
      }
    });
    
    // Flow right column
    let rightY = 150;
    rightColumnSections.forEach(section => {
      if (heights[section] && newPositions[section]) {
        newPositions[section] = {
          ...newPositions[section],
          x: rightX,
          y: Math.round(rightY)
        };
        rightY += heights[section] + spacing;
      }
    });
    
    setSectionPositions(newPositions);
    
    // Check if we need page 2
    const maxY = Math.max(leftY, rightY);
    if (maxY > 800) {
      setShowPage2(true);
    }
    
    // Show feedback
    const totalPages = Math.ceil(maxY / 842);
    alert(`✅ Auto-flow complete!\n\n📊 Layout:\n- Left column height: ${Math.round(leftY)}px\n- Right column height: ${Math.round(rightY)}px\n- Total pages needed: ${totalPages}`);
  };
  const addLine = (orientation) => {
    const newLine = { 
      id: nextLineId, 
      x1: orientation === 'horizontal' ? 50 : 280, 
      y1: orientation === 'horizontal' ? 300 : 100,
      x2: orientation === 'horizontal' ? 300 : 280, 
      y2: orientation === 'horizontal' ? 300 : 400,
      color: '#000000', 
      thickness: 2, 
      orientation, 
      label: `Line ${nextLineId}` 
    };
    setLines(p => [...p, newLine]);
    setNextLineId(p => p + 1);
  };

  const updateLine = (id, key, value) => setLines(p => p.map(l => l.id === id ? { ...l, [key]: value } : l));
  
  const moveLine = (id, direction) => {
    setLines(p => p.map(l => {
      if (l.id === id) {
        const step = 5;
        if (l.orientation === 'vertical') {
          if (direction === 'left') return { ...l, x1: l.x1 - step, x2: l.x2 - step };
          if (direction === 'right') return { ...l, x1: l.x1 + step, x2: l.x2 + step };
          if (direction === 'up') return { ...l, y1: l.y1 - step, y2: l.y2 - step };
          if (direction === 'down') return { ...l, y1: l.y1 + step, y2: l.y2 + step };
        } else {
          if (direction === 'left') return { ...l, x1: l.x1 - step, x2: l.x2 - step };
          if (direction === 'right') return { ...l, x1: l.x1 + step, x2: l.x2 + step };
          if (direction === 'up') return { ...l, y1: l.y1 - step, y2: l.y2 - step };
          if (direction === 'down') return { ...l, y1: l.y1 + step, y2: l.y2 + step };
        }
      }
      return l;
    }));
  };

  const resizeLine = (id, type) => {
    setLines(p => p.map(l => {
      if (l.id === id) {
        const step = 10;
        if (l.orientation === 'vertical') {
          if (type === 'increase') return { ...l, y2: l.y2 + step };
          if (type === 'decrease') return { ...l, y2: Math.max(l.y1 + 20, l.y2 - step) };
        } else {
          if (type === 'increase') return { ...l, x2: l.x2 + step };
          if (type === 'decrease') return { ...l, x2: Math.max(l.x1 + 20, l.x2 - step) };
        }
      }
      return l;
    }));
  };

  const deleteLine = (id) => setLines(p => p.filter(l => l.id !== id));
  
  const resetLayout = () => {
    const template = TEMPLATES[currentTemplate];
    setSectionPositions(template.positions);
    setSectionWidths(extractWidthsFromConfig(template));
    setLines(template.lines || []);
    setBackgroundShapes(template.backgroundShapes || []);
    
    // Clear all remembered positions
    setRememberedLinePositions({});
    setRememberedShapePositions({});
    
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
    setZoom(1);
  };

  const downloadResume = () => {
    if (!fabricRef.current) return;
    const link = document.createElement('a');
    link.download = 'resume.png';
    link.href = fabricRef.current.toDataURL({ format: 'png', quality: 1, multiplier: 3 }); // Increased multiplier for better quality
    link.click();
  };

  // Initialize Canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;
    const bgColor = styleConfig.page?.backgroundColor || styleConfig.header?.container?.backgroundColor || "#FFFFFF";
    
    // Initialize Page 1
    const canvas = new fabric.Canvas(canvasRef.current, { 
      backgroundColor: bgColor, 
      width: 595, 
      height: 842 
    });
    fabricRef.current = canvas;
    canvas.on("object:modified", handleObjectModified);
    
    // Initialize Page 2 if needed
    if (canvas2Ref.current && !fabric2Ref.current) {
      const canvas2 = new fabric.Canvas(canvas2Ref.current, { 
        backgroundColor: bgColor, 
        width: 595, 
        height: 842 
      });
      fabric2Ref.current = canvas2;
      canvas2.on("object:modified", handleObjectModified);
    }
    
    setTimeout(() => setIsInitialized(true), 100);
    
    return () => { 
      canvas.dispose(); 
      fabricRef.current = null;
      if (fabric2Ref.current) {
        fabric2Ref.current.dispose();
        fabric2Ref.current = null;
      }
    };
  }, [styleConfig, showPage2]);

  // Re-render on config change
  useEffect(() => {
    if (!fabricRef.current || !isInitialized) return;
    const timer = setTimeout(renderAllSections, 800);
    return () => clearTimeout(timer);
  }, [styleConfig, sectionWidths, isInitialized]);

  // Trigger re-render when shapes are added/deleted or colors change
  useEffect(() => {
    if (!fabricRef.current || !isInitialized) return;
    const timer = setTimeout(renderAllSections, 300);
    return () => clearTimeout(timer);
  }, [backgroundShapes.length, backgroundShapes.map(s => s.color).join(',')]);

  // Check if content overflows to page 2
  useEffect(() => {
    const hasOverflow = Object.values(sectionPositions).some(pos => pos.y >= 750);
    if (hasOverflow && !showPage2) {
      setShowPage2(true);
    }
  }, [sectionPositions]);

  // Handle Zoom
  useEffect(() => {
    if (!fabricRef.current) return;
    fabricRef.current.setZoom(zoom);
    fabricRef.current.renderAll();
    if (fabric2Ref.current) {
      fabric2Ref.current.setZoom(zoom);
      fabric2Ref.current.renderAll();
    }
  }, [zoom]);

  return (
    <div className="editor-container">
      {/* Hidden rendering area */}
      <div className="hidden-render">
        <div ref={sectionRefs.header}>
          <TemplateComponents.header 
            resumeDetails={resumeData.resumeDetails} 
            styleConfig={styleConfig} 
          />
        </div>
        <div ref={sectionRefs.summary}>
          <TemplateComponents.summary 
            summary={resumeData.resumeDetails.summary} 
            styleConfig={styleConfig} 
          />
        </div>
        <div ref={sectionRefs.skills}>
          <TemplateComponents.skills 
            skills={resumeData.skills} 
            styleConfig={styleConfig} 
          />
        </div>
        <div ref={sectionRefs.experience}>
          <TemplateComponents.experience 
            experiences={resumeData.experiences} 
            styleConfig={styleConfig} 
          />
        </div>
        <div ref={sectionRefs.projects}>
          <TemplateComponents.projects 
            projects={resumeData.projects} 
            styleConfig={styleConfig} 
          />
        </div>
        <div ref={sectionRefs.education}>
          <TemplateComponents.education 
            educationList={resumeData.educationList} 
            styleConfig={styleConfig} 
          />
        </div>
        <div ref={sectionRefs.certifications}>
          <TemplateComponents.certifications 
            certifications={resumeData.certifications} 
            styleConfig={styleConfig} 
          />
        </div>
      </div>

      {/* LEFT PANEL - Section Controls */}
      <div className="left-panel">
        <h3 className="panel-title">TEMPLATE SELECT</h3>
        
        <div className="control-group">
          <label className="control-label">Choose Template</label>
          <select 
            value={currentTemplate} 
            onChange={(e) => handleTemplateSwitch(e.target.value)}
            className="control-select"
          >
            <option value="ats">ATS Optimized</option>
            <option value="modern">Modern Creative</option>
            <option value="twoColumn">Two Column Professional</option>
          </select>
        </div>

        {/* BACKGROUND SHAPES SECTION */}
        <h3 className="panel-title">BACKGROUND ZONES</h3>
        <button onClick={addBackgroundShape} className="btn-primary full-width">
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





        {/* <h3 className="panel-title">SECTION SIZES</h3>
        <div className="section-widths-container">
          {Object.keys(sectionWidths).map(sectionName => {
            const isTransparent = styleConfig[sectionName]?.container?.backgroundColor === 'transparent';
            return (
              <details key={sectionName} className="section-detail" open>
                <summary className="section-summary">
                  {sectionName}
                  {isTransparent && <span className="transparent-badge">TRANSPARENT</span>}
                </summary>
              
              <div className="section-controls-grid"> */}

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
                  <label className="control-label-small">Margin (px)</label>
                  <input 
                    type="number" 
                    value={parseInt(styleConfig[sectionName]?.container?.margin) || 0}
                    onChange={(e) => {
                      const newMargin = `${e.target.value}px`;
                      handleStyleChange(sectionName, 'container', newMargin, 'margin');
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

                    <div className="control-item">
                      <label className="control-label-small">Title Weight</label>
                      <select 
                        value={styleConfig[sectionName]?.titleStyle?.fontWeight || 'bold'}
                        onChange={(e) => handleStyleChange(sectionName, 'titleStyle', e.target.value, 'fontWeight')}
                        className="control-input-small"
                      >
                        <option value="normal">Normal</option>
                        <option value="600">Semi-Bold</option>
                        <option value="bold">Bold</option>
                        <option value="800">Extra Bold</option>
                      </select>
                    </div>

                    <div className="control-item">
                      <label className="control-label-small">Title Margin</label>
                      <input 
                        type="number" 
                        value={parseInt(styleConfig[sectionName]?.titleStyle?.marginBottom) || 0}
                        onChange={(e) => handleStyleChange(sectionName, 'titleStyle', `${e.target.value}px`, 'marginBottom')}
                        className="control-input-small"
                        min="0"
                        max="30"
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

                    <div className="control-item">
                      <label className="control-label-small">Line Height</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={parseFloat(styleConfig[sectionName]?.bodyStyle?.lineHeight) || 1.5}
                        onChange={(e) => handleStyleChange(sectionName, 'bodyStyle', e.target.value, 'lineHeight')}
                        className="control-input-small"
                        min="1"
                        max="2.5"
                      />
                    </div>

                    <div className="control-item">
                      <label className="control-label-small">Body Margin</label>
                      <input 
                        type="number" 
                        value={parseInt(styleConfig[sectionName]?.bodyStyle?.marginBottom) || 0}
                        onChange={(e) => handleStyleChange(sectionName, 'bodyStyle', `${e.target.value}px`, 'marginBottom')}
                        className="control-input-small"
                        min="0"
                        max="30"
                      />
                    </div>
                  </>
                )}

                {/* Subtitle styles for experience/projects */}
                {styleConfig[sectionName]?.subtitleStyle && (
                  <>
                    <div className="control-item">
                      <label className="control-label-small">Subtitle Size</label>
                      <input 
                        type="number" 
                        value={parseInt(styleConfig[sectionName]?.subtitleStyle?.fontSize) || 10}
                        onChange={(e) => handleStyleChange(sectionName, 'subtitleStyle', `${e.target.value}px`, 'fontSize')}
                        className="control-input-small"
                        min="6"
                        max="20"
                      />
                    </div>

                    <div className="control-item">
                      <label className="control-label-small">Subtitle Color</label>
                      <input 
                        type="color" 
                        value={styleConfig[sectionName]?.subtitleStyle?.color || '#666666'}
                        onChange={(e) => handleStyleChange(sectionName, 'subtitleStyle', e.target.value, 'color')}
                        className="control-color-small"
                      />
                    </div>

                    <div className="control-item">
                      <label className="control-label-small">Subtitle Weight</label>
                      <select 
                        value={styleConfig[sectionName]?.subtitleStyle?.fontWeight || 'normal'}
                        onChange={(e) => handleStyleChange(sectionName, 'subtitleStyle', e.target.value, 'fontWeight')}
                        className="control-input-small"
                      >
                        <option value="normal">Normal</option>
                        <option value="600">Semi-Bold</option>
                        <option value="bold">Bold</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Date styles for experience/projects/education */}
                {styleConfig[sectionName]?.dateStyle && (
                  <>
                    <div className="control-item">
                      <label className="control-label-small">Date Size</label>
                      <input 
                        type="number" 
                        value={parseInt(styleConfig[sectionName]?.dateStyle?.fontSize) || 9}
                        onChange={(e) => handleStyleChange(sectionName, 'dateStyle', `${e.target.value}px`, 'fontSize')}
                        className="control-input-small"
                        min="6"
                        max="16"
                      />
                    </div>

                    <div className="control-item">
                      <label className="control-label-small">Date Color</label>
                      <input 
                        type="color" 
                        value={styleConfig[sectionName]?.dateStyle?.color || '#888888'}
                        onChange={(e) => handleStyleChange(sectionName, 'dateStyle', e.target.value, 'color')}
                        className="control-color-small"
                      />
                    </div>
                  </>
                )}
              </div>
            </details>
          )})}
        </div>
        
        <button onClick={resetLayout} className="btn-primary full-width">
          ↻ RESET LAYOUT
        </button>
        
        <button onClick={autoFlowSections} className="btn-primary full-width" style={{ background: '#10b981', borderColor: '#10b981' }}>
          ⚡ AUTO-FLOW CONTENT
        </button>
        
        <div className="button-grid">
          <button onClick={downloadResume} className="btn-secondary">PNG</button>
          <button onClick={() => alert('PDF export coming soon')} className="btn-secondary">PDF</button>
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
            <div className="canvas-wrapper" style={{ transform: `scale(${zoom})` }}>
              <canvas ref={canvasRef} />
            </div>
            
            {showPage2 && (
              <div className="canvas-wrapper" style={{ transform: `scale(${zoom})` }}>
                <canvas ref={canvas2Ref} />
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
        
        <div className="style-section">
          <h4 className="section-subtitle">GLOBAL SPACING</h4>
          
          <div className="control-group">
            <label className="control-label">Section Spacing (All)</label>
            <input 
              type="number" 
              value={parseInt(styleConfig.header?.container?.marginBottom) || 0}
              onChange={(e) => {
                const newMargin = `${e.target.value}px`;
                Object.keys(styleConfig).forEach(section => {
                  if (styleConfig[section]?.container) {
                    handleStyleChange(section, 'container', newMargin, 'marginBottom');
                  }
                });
              }}
              min="0" 
              max="40" 
              className="control-input"
            />
          </div>

          <div className="control-group">
            <label className="control-label">Item Spacing (entries)</label>
            <input 
              type="number" 
              value={parseInt(styleConfig.experience?.itemSpacing) || 0}
              onChange={(e) => {
                const newSpacing = `${e.target.value}px`;
                ['experience', 'projects', 'education', 'certifications'].forEach(section => {
                  if (styleConfig[section]) {
                    handleStyleChange(section, 'itemSpacing', newSpacing);
                  }
                });
              }}
              min="0" 
              max="30" 
              className="control-input"
            />
          </div>
        </div>

        <div className="style-section">
          <h4 className="section-subtitle">COLORS</h4>
          
          <div className="control-group">
            <button 
              onClick={() => {
                // Make all section backgrounds transparent (but NOT page background)
                Object.keys(styleConfig).forEach(section => {
                  if (section !== 'page' && styleConfig[section]?.container?.backgroundColor) {
                    handleStyleChange(section, 'container', 'transparent', 'backgroundColor');
                  }
                });
              }}
              className="btn-secondary full-width"
              style={{ marginBottom: '12px' }}
            >
              🔲 MAKE ALL SECTIONS TRANSPARENT
            </button>
          </div>
          
          <div className="control-group">
            <label className="control-label">Page Background</label>
            <input 
              type="color" 
              value={styleConfig.page?.backgroundColor || '#FFFFFF'} 
              onChange={(e) => handleStyleChange('page', 'backgroundColor', e.target.value)}
              className="control-color"
            />
            <small style={{ color: '#999', fontSize: '9px', marginTop: '4px', display: 'block' }}>
              ⚠️ Page background cannot be transparent
            </small>
          </div>

          <div className="control-group">
            <label className="control-label">Primary Text Color</label>
            <input 
              type="color" 
              value={styleConfig.header?.nameStyle?.color || '#000000'} 
              onChange={(e) => handleStyleChange('header', 'nameStyle', e.target.value, 'color')}
              className="control-color"
            />
          </div>

          <div className="control-group">
            <label className="control-label">Section Title Color (All)</label>
            <input 
              type="color" 
              value={styleConfig.summary?.titleStyle?.color || '#000000'} 
              onChange={(e) => {
                const newColor = e.target.value;
                ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'].forEach(section => {
                  if (styleConfig[section]?.titleStyle) {
                    handleStyleChange(section, 'titleStyle', newColor, 'color');
                  }
                });
              }}
              className="control-color"
            />
          </div>

          <div className="control-group">
            <label className="control-label">Subtitle/Company Color</label>
            <input 
              type="color" 
              value={styleConfig.experience?.subtitleStyle?.color || '#666666'} 
              onChange={(e) => {
                const newColor = e.target.value;
                ['experience', 'projects', 'education'].forEach(section => {
                  if (styleConfig[section]?.subtitleStyle) {
                    handleStyleChange(section, 'subtitleStyle', newColor, 'color');
                  }
                });
              }}
              className="control-color"
            />
          </div>

          <div className="control-group">
            <label className="control-label">Date/Meta Color</label>
            <input 
              type="color" 
              value={styleConfig.experience?.dateStyle?.color || '#888888'} 
              onChange={(e) => {
                const newColor = e.target.value;
                ['experience', 'projects', 'education'].forEach(section => {
                  if (styleConfig[section]?.dateStyle) {
                    handleStyleChange(section, 'dateStyle', newColor, 'color');
                  }
                });
              }}
              className="control-color"
            />
          </div>
        </div>

        <div className="style-section">
          <h4 className="section-subtitle">TYPOGRAPHY</h4>
          
          <div className="control-group">
            <label className="control-label">Font Family</label>
            <select 
              value={styleConfig.header?.container?.fontFamily || 'Arial'}
              onChange={(e) => {
                const newFont = e.target.value;
                Object.keys(styleConfig).forEach(section => {
                  if (styleConfig[section]?.container) {
                    handleStyleChange(section, 'container', newFont, 'fontFamily');
                  }
                });
              }}
              className="control-select"
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Courier New">Courier New</option>
              <option value="Calibri">Calibri</option>
              <option value="Roboto">Roboto</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Header Name Size</label>
            <input 
              type="number" 
              value={parseInt(styleConfig.header?.nameStyle?.fontSize) || 24}
              onChange={(e) => handleStyleChange('header', 'nameStyle', `${e.target.value}px`, 'fontSize')}
              min="16" 
              max="48" 
              className="control-input"
            />
          </div>

          <div className="control-group">
            <label className="control-label">Section Title Size (All)</label>
            <input 
              type="number" 
              value={parseInt(styleConfig.summary?.titleStyle?.fontSize) || 12}
              onChange={(e) => {
                const newSize = `${e.target.value}px`;
                ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'].forEach(section => {
                  if (styleConfig[section]?.titleStyle) {
                    handleStyleChange(section, 'titleStyle', newSize, 'fontSize');
                  }
                });
              }}
              min="8" 
              max="24" 
              className="control-input"
            />
          </div>

          <div className="control-group">
            <label className="control-label">Body Text Size (All)</label>
            <input 
              type="number" 
              value={parseInt(styleConfig.summary?.bodyStyle?.fontSize) || 10}
              onChange={(e) => {
                const newSize = `${e.target.value}px`;
                Object.keys(styleConfig).forEach(section => {
                  if (styleConfig[section]?.bodyStyle) {
                    handleStyleChange(section, 'bodyStyle', newSize, 'fontSize');
                  }
                });
              }}
              min="7" 
              max="20" 
              className="control-input"
            />
          </div>

          <div className="control-group">
            <label className="control-label">Line Height (All)</label>
            <input 
              type="number" 
              step="0.1"
              value={parseFloat(styleConfig.summary?.bodyStyle?.lineHeight) || 1.5}
              onChange={(e) => {
                const newHeight = e.target.value;
                Object.keys(styleConfig).forEach(section => {
                  if (styleConfig[section]?.bodyStyle) {
                    handleStyleChange(section, 'bodyStyle', newHeight, 'lineHeight');
                  }
                });
              }}
              min="1" 
              max="2.5" 
              className="control-input"
            />
          </div>
        </div>

        <div className="style-section">
          <h4 className="section-subtitle">BULLETS</h4>
          
          <div className="control-group">
            <label className="control-label">Bullet Style</label>
            <select 
              value={styleConfig.experience?.bulletConfig?.bulletStyle || '•'}
              onChange={(e) => {
                const newBullet = e.target.value;
                ['experience', 'projects'].forEach(section => {
                  if (styleConfig[section]?.bulletConfig) {
                    handleStyleChange(section, 'bulletConfig', newBullet, 'bulletStyle');
                  }
                });
              }}
              className="control-select"
            >
              <option value="•">• Bullet</option>
              <option value="▪">▪ Square</option>
              <option value="→">→ Arrow</option>
              <option value="›">› Angle</option>
              <option value="-">- Dash</option>
              <option value="✓">✓ Check</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Bullet Color</label>
            <input 
              type="color" 
              value={styleConfig.experience?.bulletConfig?.bulletColor || '#000000'}
              onChange={(e) => {
                const newColor = e.target.value;
                ['experience', 'projects'].forEach(section => {
                  if (styleConfig[section]?.bulletConfig) {
                    handleStyleChange(section, 'bulletConfig', newColor, 'bulletColor');
                  }
                });
              }}
              className="control-color"
            />
          </div>

          <div className="control-group">
            <label className="control-label">Bullet Spacing</label>
            <input 
              type="number" 
              value={parseInt(styleConfig.experience?.bulletConfig?.bulletSpacing) || 5}
              onChange={(e) => {
                const newSpacing = `${e.target.value}px`;
                ['experience', 'projects'].forEach(section => {
                  if (styleConfig[section]?.bulletConfig) {
                    handleStyleChange(section, 'bulletConfig', newSpacing, 'bulletSpacing');
                  }
                });
              }}
              min="0" 
              max="20" 
              className="control-input"
            />
          </div>
        </div>

        {/* Advanced Section Controls */}
        <details className="collapsible">
          <summary>HEADER LAYOUT</summary>
          
          <div className="control-group">
            <label className="control-label">Layout Direction</label>
            <select 
              value={styleConfig.header?.mainLayout?.flexDirection || 'column'}
              onChange={(e) => handleStyleChange('header', 'mainLayout', e.target.value, 'flexDirection')}
              className="control-select"
            >
              <option value="column">Vertical (Stacked)</option>
              <option value="row">Horizontal (Side-by-side)</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Alignment</label>
            <select 
              value={styleConfig.header?.mainLayout?.alignItems || 'stretch'}
              onChange={(e) => handleStyleChange('header', 'mainLayout', e.target.value, 'alignItems')}
              className="control-select"
            >
              <option value="flex-start">Left</option>
              <option value="center">Center</option>
              <option value="flex-end">Right</option>
              <option value="stretch">Stretch</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Show Divider</label>
            <select 
              value={styleConfig.header?.showDivider ? 'yes' : 'no'}
              onChange={(e) => handleStyleChange('header', 'showDivider', e.target.value === 'yes')}
              className="control-select"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </details>

        <details className="collapsible">
          <summary>SKILLS DISPLAY</summary>
          
          <div className="control-group">
            <label className="control-label">Display Type</label>
            <select 
              value={styleConfig.skills?.displayType || 'inline'}
              onChange={(e) => handleStyleChange('skills', 'displayType', e.target.value)}
              className="control-select"
            >
              <option value="inline">Inline (comma separated)</option>
              <option value="list">List (bullet points)</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Show Categories</label>
            <select 
              value={styleConfig.skills?.showCategories ? 'yes' : 'no'}
              onChange={(e) => handleStyleChange('skills', 'showCategories', e.target.value === 'yes')}
              className="control-select"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {styleConfig.skills?.displayType === 'inline' && (
            <div className="control-group">
              <label className="control-label">Separator</label>
              <input 
                type="text" 
                value={styleConfig.skills?.separator || ', '}
                onChange={(e) => handleStyleChange('skills', 'separator', e.target.value)}
                className="control-input"
                placeholder=", "
              />
            </div>
          )}
        </details>

        <details className="collapsible">
          <summary>EXPERIENCE LAYOUT</summary>
          
          <div className="control-group">
            <label className="control-label">Show Position First</label>
            <select 
              value={styleConfig.experience?.positionFirst ? 'yes' : 'no'}
              onChange={(e) => handleStyleChange('experience', 'positionFirst', e.target.value === 'yes')}
              className="control-select"
            >
              <option value="yes">Position First</option>
              <option value="no">Company First</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Show Location</label>
            <select 
              value={styleConfig.experience?.showLocation ? 'yes' : 'no'}
              onChange={(e) => handleStyleChange('experience', 'showLocation', e.target.value === 'yes')}
              className="control-select"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </details>

        {/* Info Box */}
        <div className="info-box">
          <div className="info-title">💡 PRO TIP</div>
          <div className="info-text">
            Use <strong>AUTO-FLOW CONTENT</strong> to automatically arrange sections without overlapping. It calculates actual heights and positions them smartly across pages!
          </div>
        </div>
        
        <div className="info-box" style={{ marginTop: '12px', borderColor: '#10b981' }}>
          <div className="info-title" style={{ color: '#10b981' }}>⚡ AUTO-FLOW</div>
          <div className="info-text">
            • Calculates real section heights<br/>
            • Prevents overlapping<br/>
            • Auto-enables Page 2 if needed<br/>
            • Works with 2-column layouts
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIEditor;
