
import React, { useState, useRef, useEffect, useCallback } from "react";
import { fabric } from "fabric";
import html2canvas from "html2canvas";
import { useSelector } from "react-redux";
import { mergeResumeData } from "./Utils";
import { ATS_TEMPLATE_CONFIG, MODERN_TEMPLATE_CONFIG, TWO_COLUMN_TEMPLATE_CONFIG, TEMPLATE5_CONFIG } from "./TemplateConfigs";
import { defaultResumeData } from "./Utils";
import "./UIEditor.css";
import {
  buildHeaderLayout,
  configToLayout,
  parseSize,
  renderHeaderWithLayoutEngine,
  buildTwoColumnResume,
  buildSkillsGrid,
  buildExperienceTimeline,
  buildCompleteResume,
  buildSkillsSection,
  buildEducationSection,
  buildExperienceSection,
  buildProjectsSection,
  buildCertificationsSection
} from './CanvasEngineFunctions';

import {
  CanvasLayoutEngine,
  FlexNode,
  GridNode,
  TextNode,
  BlockNode,
  SpacerNode
} from "./CanvasEngine.jsx";


import { Stage, Layer, Image as KonvaImage, Line, Rect, Transformer, Text } from 'react-konva';


// const FlexibleContainer = ({ children, config }) => {
//   return (
//     <div style={{
//       width: config.width || "fit-content",
//       maxWidth: config.maxWidth || "100%",
//       padding: config.padding || "10px",
//       margin: config.margin || "0",
//       backgroundColor: config.backgroundColor || "#FFFFFF",
//       fontFamily: config.fontFamily || "Arial",
//       color: config.color || "#000000",
//       boxSizing: "border-box",
//       overflow: config.overflow || "hidden",
//       border: config.border || "none",
//       borderRadius: config.borderRadius || "0",
//       boxShadow: config.boxShadow || "none",
//     }}>
//       {children}
//     </div>
//   );
// };

// /**
//  * Flexible Section Header - Can render any section title with full config
//  */
// const FlexibleSectionHeader = ({ title, config }) => {
//   return (
//     <div style={{
//       fontSize: config.fontSize || "14px",
//       fontWeight: config.fontWeight || "bold",
//       color: config.color || "#000000",
//       marginBottom: config.marginBottom || "8px",
//       marginTop: config.marginTop || "0",
//       paddingBottom: config.paddingBottom || "3px",
//       paddingTop: config.paddingTop || "0",
//       borderBottom: config.borderBottom || "none",
//       borderTop: config.borderTop || "none",
//       textTransform: config.textTransform || "none",
//       letterSpacing: config.letterSpacing || "0",
//       textAlign: config.textAlign || "left",
//       display: config.display || "block",
//       background: config.background || "transparent",
//       padding: config.padding,
//     }}>
//       {config.icon && <span style={{ marginRight: "8px" }}>{config.icon}</span>}
//       {title}
//     </div>
//   );
// };

// /**
//  * Flexible Layout Container - Handles flex/grid layouts
//  */
// const FlexibleLayout = ({ children, config }) => {
//   const isGrid = config.display === "grid";
  
//   return (
//     <div style={{
//       display: config.display || "flex",
//       flexDirection: config.flexDirection || "row",
//       justifyContent: config.justifyContent || "flex-start",
//       alignItems: config.alignItems || "stretch",
//       flexWrap: config.flexWrap || "nowrap",
//       gap: config.gap || "0",
//       gridTemplateColumns: isGrid ? config.gridTemplateColumns : undefined,
//       gridTemplateRows: isGrid ? config.gridTemplateRows : undefined,
//       padding: config.padding,
//       margin: config.margin,
//     }}>
//       {children}
//     </div>
//   );
// };

// /**
//  * Flexible Text Block - For any text content
//  */
// const FlexibleText = ({ children, config }) => {
//   return (
//     <div style={{
//       fontSize: config.fontSize || "10px",
//       fontWeight: config.fontWeight || "normal",
//       fontStyle: config.fontStyle || "normal",
//       color: config.color || "#000000",
//       lineHeight: config.lineHeight || "1.4",
//       textAlign: config.textAlign || "left",
//       marginBottom: config.marginBottom || "0",
//       marginTop: config.marginTop || "0",
//       padding: config.padding,
//       textTransform: config.textTransform || "none",
//       letterSpacing: config.letterSpacing || "0",
//       wordWrap: config.wordWrap || "break-word",
//       whiteSpace: config.whiteSpace || "normal",
//       textDecoration: config.textDecoration || "none",
//       background: config.background || "transparent",
//       border: config.border,
//       borderRadius: config.borderRadius,
//       display: config.display || "block",
//       flex: config.flex,
//       width: config.width,
//       maxWidth: config.maxWidth,
//     }}>
//       {children}
//     </div>
//   );
// };

// /**
//  * Flexible Bullet List - Configurable bullet points
//  */
// // const FlexibleBulletList = ({ items, config }) => {
// //   if (!items || items.length === 0) return null;
  
// //   return (
// //     <div style={{ marginTop: config.containerMarginTop || "0" }}>
// //       {items.filter(item => item?.trim()).map((item, index) => (
// //         <div key={index} style={{
// //           display: "flex",
// //           marginBottom: config.itemMarginBottom || "3px",
// //           alignItems: config.alignItems || "flex-start",
// //         }}>
// //           <div style={{
// //             width: config.bulletWidth || "10px",
// //             minWidth: config.bulletWidth || "10px",
// //             color: config.bulletColor || "#000000",
// //             fontSize: config.bulletSize || "10px",
// //             flexShrink: 0,
// //             marginRight: config.bulletMarginRight || "0",
// //             marginTop: config.bulletMarginTop || "0",
// //           }}>
// //             {config.bulletStyle || "•"}
// //           </div>
// //           <FlexibleText config={{
// //             fontSize: config.textSize || "10px",
// //             color: config.textColor || "#000000",
// //             lineHeight: config.lineHeight || "1.4",
// //             flex: 1,
// //           }}>
// //             {item}
// //           </FlexibleText>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };


// // ========== FLEXIBLE BULLET LIST ==========
// const FlexibleBulletList = ({ items = [], styleConfig = {} }) => {
//   const config = styleConfig;

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         gap: config.bulletGap || "4px",
//         width: "100%",
//       }}
//     >
//       {items.map((item, index) => (
//         <div
//           key={index}
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             alignItems: "flex-start",
//             width: "100%",
//           }}
//         >
//           {/* Bullet */}
//           <div
//             style={{
//               marginTop: "2px",
//               width: "10px",
//               minWidth: "10px",
//               fontSize: config.bulletSize || "12px",
//               color: config.textColor || "#000000",
//               lineHeight: config.lineHeight || "1.4",
//               userSelect: "none",
//             }}
//           >
//             •
//           </div>

//           {/* Text */}
//           <div
//             style={{
//               flex: 1,
//               minWidth: 0, // 💥 REQUIRED so bullets don’t break line
//               fontSize: config.textSize || "10px",
//               color: config.textColor || "#000000",
//               lineHeight: config.lineHeight || "1.4",
//               whiteSpace: "normal",
//               wordBreak: "normal",
//               overflowWrap: "anywhere", // 💥 best for resumes
//             }}
//           >
//             {item}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };


// // ========== FLEXIBLE SECTION COMPONENTS ==========

// /**
//  * HEADER SECTION - Fully Flexible
//  */
// export const FlexibleHeaderSection = ({ resumeDetails, styleConfig }) => {
//   const config = styleConfig.header;
  
//   return (
//     <FlexibleContainer config={config.container}>
//       <FlexibleLayout config={config.mainLayout}>
//         {/* Name Section */}
//         <FlexibleLayout config={config.nameSection}>
//           <FlexibleText config={config.nameStyle}>
//             {resumeDetails.name || "Your Name"}
//           </FlexibleText>
//           {config.showTitle && (
//             <FlexibleText config={config.titleStyle}>
//               {resumeDetails.title || "Your Title"}
//             </FlexibleText>
//           )}
//         </FlexibleLayout>
        
//         {/* Contact Section */}
//         {config.showContact && (
//           <FlexibleLayout config={config.contactLayout}>
//             {config.contactOrder.map((contactType, idx) => {
//               const value = resumeDetails.contact?.[contactType];
//               if (!value) return null;
              
//               return (
//                 <FlexibleText key={idx} config={config.contactItemStyle}>
//                   {config.showContactIcons && config.contactIcons?.[contactType] && (
//                     <span style={{ marginRight: "4px" }}>{config.contactIcons[contactType]}</span>
//                   )}
//                   {value}
//                 </FlexibleText>
//               );
//             })}
//           </FlexibleLayout>
//         )}
//       </FlexibleLayout>
      
//       {config.showDivider && (
//         <div style={{
//           borderBottom: config.dividerStyle || "1px solid #000",
//           marginTop: config.dividerMarginTop || "8px",
//           marginBottom: config.dividerMarginBottom || "8px",
//         }} />
//       )}
//     </FlexibleContainer>
//   );
// };

// /**
//  * SUMMARY SECTION - Fully Flexible
//  */
// export const FlexibleSummarySection = ({ summary, styleConfig }) => {
//   const config = styleConfig.summary;
  
//   return (
//     <FlexibleContainer config={config.container}>
//       {config.showTitle && (
//         <FlexibleSectionHeader title="SUMMARY" config={config.titleStyle} />
//       )}
//       <FlexibleText config={config.bodyStyle}>
//         {summary}
//       </FlexibleText>
//     </FlexibleContainer>
//   );
// };

// /**
//  * SKILLS SECTION - Fully Flexible
//  */
// export const FlexibleSkillsSection = ({ skills, styleConfig }) => {
//   const config = styleConfig.skills;
  
//   // Parse skills (grouped vs flat)
//   const groupedSkills = {};
//   const ungroupedSkills = [];
  
//   if (skills && Array.isArray(skills)) {
//     skills.forEach(skill => {
//       if (skill && skill.includes(" - ")) {
//         const [cat, val] = skill.split(" - ");
//         groupedSkills[cat.trim()] = val.trim();
//       } else if (skill?.trim()) {
//         ungroupedSkills.push(skill.trim());
//       }
//     });
//   }
  
//   return (
//     <FlexibleContainer config={config.container}>
//       {config.showTitle && (
//         <FlexibleSectionHeader title="SKILLS" config={config.titleStyle} />
//       )}
      
//       <FlexibleLayout config={config.contentLayout}>
//         {/* Grouped Skills */}
//         {Object.entries(groupedSkills).map(([category, value], idx) => (
//           <div key={idx} style={{ marginBottom: config.itemMarginBottom || "8px" }}>
//             {config.showCategories && (
//               <FlexibleText config={config.categoryStyle}>
//                 {category}
//               </FlexibleText>
//             )}
//             <FlexibleText config={config.valueStyle}>
//               {value}
//             </FlexibleText>
//           </div>
//         ))}
        
//         {/* Ungrouped Skills */}
//         {ungroupedSkills.length > 0 && (
//           <div style={{ marginBottom: config.itemMarginBottom || "8px" }}>
//             {config.showCategories && (
//               <FlexibleText config={config.categoryStyle}>
//                 Other
//               </FlexibleText>
//             )}
//             {config.displayType === "list" ? (
//               <FlexibleBulletList items={ungroupedSkills} config={config.bulletConfig} />
//             ) : (
//               <FlexibleText config={config.valueStyle}>
//                 {ungroupedSkills.join(config.separator || ", ")}
//               </FlexibleText>
//             )}
//           </div>
//         )}
//       </FlexibleLayout>
//     </FlexibleContainer>
//   );
// };

// /**
//  * EXPERIENCE SECTION - Fully Flexible
//  */
// export const FlexibleExperienceSection = ({ experiences, styleConfig }) => {
//   const config = styleConfig.experience;
  
//   return (
//     <FlexibleContainer config={config.container}>
//       {config.showTitle && (
//         <FlexibleSectionHeader title="EXPERIENCE" config={config.titleStyle} />
//       )}
      
//       {experiences.map((exp, idx) => (
//         <div key={idx} style={{ marginBottom: config.itemMarginBottom || "12px" }}>
//           <FlexibleLayout config={config.headerLayout}>
//             {/* Position/Company layout controlled by config */}
//             {config.positionFirst ? (
//               <>
//                 <FlexibleText config={config.positionStyle}>
//                   {exp.position}
//                 </FlexibleText>
//                 <FlexibleText config={config.durationStyle}>
//                   {exp.duration}
//                 </FlexibleText>
//               </>
//             ) : (
//               <>
//                 <FlexibleText config={config.companyStyle}>
//                   {exp.company}
//                 </FlexibleText>
//                 <FlexibleText config={config.durationStyle}>
//                   {exp.duration}
//                 </FlexibleText>
//               </>
//             )}
//           </FlexibleLayout>
          
//           <FlexibleLayout config={config.subHeaderLayout}>
//             <FlexibleText config={config.companyStyle}>
//               {config.positionFirst ? exp.company : exp.position}
//               {exp.location && config.showLocation ? `, ${exp.location}` : ""}
//             </FlexibleText>
//           </FlexibleLayout>
          
//           {/* Achievements */}
//           {config.showAchievements && exp.achievements && (
//             <FlexibleBulletList items={exp.achievements} config={config.bulletConfig} />
//           )}
//         </div>
//       ))}
//     </FlexibleContainer>
//   );
// };

// /**
//  * PROJECTS SECTION - Fully Flexible
//  */
// export const FlexibleProjectsSection = ({ projects, styleConfig }) => {
//   const config = styleConfig.projects;
  
//   return (
//     <FlexibleContainer config={config.container}>
//       {config.showTitle && (
//         <FlexibleSectionHeader title="PROJECTS" config={config.titleStyle} />
//       )}
      
//       {projects.map((proj, idx) => (
//         <div key={idx} style={{ marginBottom: config.itemMarginBottom || "12px" }}>
//           <FlexibleLayout config={config.headerLayout}>
//             <FlexibleText config={config.nameStyle}>
//               {proj.name}
//             </FlexibleText>
//             {proj.duration && config.showDuration && (
//               <FlexibleText config={config.durationStyle}>
//                 {proj.duration}
//               </FlexibleText>
//             )}
//           </FlexibleLayout>
          
//           {proj.technologies && config.showTechnologies && (
//             <FlexibleText config={config.techStyle}>
//               {proj.technologies}
//             </FlexibleText>
//           )}
          
//           {config.showDescription && proj.description && (
//             <FlexibleBulletList items={proj.description} config={config.bulletConfig} />
//           )}
//         </div>
//       ))}
//     </FlexibleContainer>
//   );
// };

// /**
//  * EDUCATION SECTION - Fully Flexible
//  */
// export const FlexibleEducationSection = ({ educationList, styleConfig }) => {
//   const config = styleConfig.education;
  
//   return (
//     <FlexibleContainer config={config.container}>
//       {config.showTitle && (
//         <FlexibleSectionHeader title="EDUCATION" config={config.titleStyle} />
//       )}
      
//       {educationList.map((edu, idx) => (
//         <div key={idx} style={{ marginBottom: config.itemMarginBottom || "10px" }}>
//           <FlexibleText config={config.degreeStyle}>
//             {edu.degree}
//           </FlexibleText>
          
//           {edu.institution && config.showInstitution && (
//             <FlexibleText config={config.institutionStyle}>
//               {edu.institution}
//             </FlexibleText>
//           )}
          
//           <FlexibleLayout config={config.detailsLayout}>
//             {edu.year && (
//               <FlexibleText config={config.detailsStyle}>
//                 {edu.year}
//               </FlexibleText>
//             )}
//             {edu.gpa && config.showGpa && (
//               <FlexibleText config={config.detailsStyle}>
//                 {config.gpaPrefix || "GPA: "}{edu.gpa}
//               </FlexibleText>
//             )}
//             {edu.location && config.showLocation && (
//               <FlexibleText config={config.detailsStyle}>
//                 {edu.location}
//               </FlexibleText>
//             )}
//           </FlexibleLayout>
//         </div>
//       ))}
//     </FlexibleContainer>
//   );
// };

// /**
//  * CERTIFICATIONS SECTION - Fully Flexible
//  */
// export const FlexibleCertificationsSection = ({ certifications, styleConfig }) => {
//   const config = styleConfig.certifications;
  
//   return (
//     <FlexibleContainer config={config.container}>
//       {config.showTitle && (
//         <FlexibleSectionHeader title="CERTIFICATIONS" config={config.titleStyle} />
//       )}
      
//       {config.displayType === "list" ? (
//         <FlexibleBulletList items={certifications} config={config.bulletConfig} />
//       ) : (
//         certifications.filter(cert => cert?.trim()).map((cert, idx) => (
//           <FlexibleText key={idx} config={config.itemStyle}>
//             {cert}
//           </FlexibleText>
//         ))
//       )}
//     </FlexibleContainer>
//   );
// };


// ========== ENHANCED BASE COMPONENTS ==========

/**
 * Universal Style Applicator - Applies any CSS property
 * Filters out non-CSS properties and nested objects
 */


// const applyStyles = (baseStyle, configStyle) => {
//   if (!configStyle) return baseStyle;
  
//   const validStyles = {};
//   const validCSSProps = new Set([
//     'alignContent', 'alignItems', 'alignSelf', 'animation', 'animationDelay', 
//     'animationDirection', 'animationDuration', 'animationFillMode', 
//     'animationIterationCount', 'animationName', 'animationPlayState', 
//     'animationTimingFunction', 'backfaceVisibility', 'background', 
//     'backgroundAttachment', 'backgroundBlendMode', 'backgroundClip', 
//     'backgroundColor', 'backgroundImage', 'backgroundOrigin', 'backgroundPosition', 
//     'backgroundRepeat', 'backgroundSize', 'border', 'borderBottom', 
//     'borderBottomColor', 'borderBottomLeftRadius', 'borderBottomRightRadius', 
//     'borderBottomStyle', 'borderBottomWidth', 'borderCollapse', 'borderColor', 
//     'borderImage', 'borderImageOutset', 'borderImageRepeat', 'borderImageSlice', 
//     'borderImageSource', 'borderImageWidth', 'borderLeft', 'borderLeftColor', 
//     'borderLeftStyle', 'borderLeftWidth', 'borderRadius', 'borderRight', 
//     'borderRightColor', 'borderRightStyle', 'borderRightWidth', 'borderSpacing', 
//     'borderStyle', 'borderTop', 'borderTopColor', 'borderTopLeftRadius', 
//     'borderTopRightRadius', 'borderTopStyle', 'borderTopWidth', 'borderWidth', 
//     'bottom', 'boxDecorationBreak', 'boxShadow', 'boxSizing', 'breakAfter', 
//     'breakBefore', 'breakInside', 'captionSide', 'caretColor', 'clear', 'clip', 
//     'clipPath', 'color', 'columnCount', 'columnFill', 'columnGap', 'columnRule', 
//     'columnRuleColor', 'columnRuleStyle', 'columnRuleWidth', 'columnSpan', 
//     'columnWidth', 'columns', 'content', 'counterIncrement', 'counterReset', 
//     'cursor', 'direction', 'display', 'emptyCells', 'filter', 'flex', 
//     'flexBasis', 'flexDirection', 'flexFlow', 'flexGrow', 'flexShrink', 
//     'flexWrap', 'float', 'font', 'fontFamily', 'fontFeatureSettings', 
//     'fontKerning', 'fontSize', 'fontSizeAdjust', 'fontStretch', 'fontStyle', 
//     'fontSynthesis', 'fontVariant', 'fontVariantCaps', 'fontVariantLigatures', 
//     'fontVariantNumeric', 'fontVariantPosition', 'fontWeight', 'gap', 'grid', 
//     'gridArea', 'gridAutoColumns', 'gridAutoFlow', 'gridAutoRows', 'gridColumn', 
//     'gridColumnEnd', 'gridColumnGap', 'gridColumnStart', 'gridGap', 'gridRow', 
//     'gridRowEnd', 'gridRowGap', 'gridRowStart', 'gridTemplate', 'gridTemplateAreas', 
//     'gridTemplateColumns', 'gridTemplateRows', 'height', 'hyphens', 'imageRendering', 
//     'isolation', 'justifyContent', 'justifyItems', 'justifySelf', 'left', 
//     'letterSpacing', 'lineBreak', 'lineHeight', 'listStyle', 'listStyleImage', 
//     'listStylePosition', 'listStyleType', 'margin', 'marginBottom', 'marginLeft', 
//     'marginRight', 'marginTop', 'mask', 'maskClip', 'maskComposite', 'maskImage', 
//     'maskMode', 'maskOrigin', 'maskPosition', 'maskRepeat', 'maskSize', 'maskType', 
//     'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'mixBlendMode', 'objectFit', 
//     'objectPosition', 'opacity', 'order', 'orphans', 'outline', 'outlineColor', 
//     'outlineOffset', 'outlineStyle', 'outlineWidth', 'overflow', 'overflowWrap', 
//     'overflowX', 'overflowY', 'padding', 'paddingBottom', 'paddingLeft', 
//     'paddingRight', 'paddingTop', 'pageBreakAfter', 'pageBreakBefore', 
//     'pageBreakInside', 'perspective', 'perspectiveOrigin', 'placeContent', 
//     'placeItems', 'placeSelf', 'pointerEvents', 'position', 'quotes', 'resize', 
//     'right', 'rowGap', 'scrollBehavior', 'tabSize', 'tableLayout', 'textAlign', 
//     'textAlignLast', 'textCombineUpright', 'textDecoration', 'textDecorationColor', 
//     'textDecorationLine', 'textDecorationStyle', 'textIndent', 'textJustify', 
//     'textOrientation', 'textOverflow', 'textShadow', 'textTransform', 
//     'textUnderlinePosition', 'top', 'transform', 'transformOrigin', 'transformStyle', 
//     'transition', 'transitionDelay', 'transitionDuration', 'transitionProperty', 
//     'transitionTimingFunction', 'unicodeBidi', 'userSelect', 'verticalAlign', 
//     'visibility', 'whiteSpace', 'widows', 'width', 'willChange', 'wordBreak', 
//     'wordSpacing', 'wordWrap', 'writingMode', 'zIndex'
//   ]);
  
//   Object.keys(configStyle).forEach(key => {
//     const value = configStyle[key];
//     // Only include valid CSS properties with primitive values
//     if (validCSSProps.has(key) && (typeof value === 'string' || typeof value === 'number')) {
//       validStyles[key] = value;
//     }
//   });
  
//   return { ...baseStyle, ...validStyles };
// };


const applyStyles = (baseStyle, configStyle) => {
  if (!configStyle) return baseStyle;
  
  const validStyles = {};
  const validCSSProps = new Set([
    'alignContent', 'alignItems', 'alignSelf', 'animation', 'animationDelay', 
    'animationDirection', 'animationDuration', 'animationFillMode', 
    'animationIterationCount', 'animationName', 'animationPlayState', 
    'animationTimingFunction', 'backfaceVisibility', 'background', 
    'backgroundAttachment', 'backgroundBlendMode', 'backgroundClip', 
    'backgroundColor', 'backgroundImage', 'backgroundOrigin', 'backgroundPosition', 
    'backgroundRepeat', 'backgroundSize', 'border', 'borderBottom', 
    'borderBottomColor', 'borderBottomLeftRadius', 'borderBottomRightRadius', 
    'borderBottomStyle', 'borderBottomWidth', 'borderCollapse', 'borderColor', 
    'borderImage', 'borderImageOutset', 'borderImageRepeat', 'borderImageSlice', 
    'borderImageSource', 'borderImageWidth', 'borderLeft', 'borderLeftColor', 
    'borderLeftStyle', 'borderLeftWidth', 'borderRadius', 'borderRight', 
    'borderRightColor', 'borderRightStyle', 'borderRightWidth', 'borderSpacing', 
    'borderStyle', 'borderTop', 'borderTopColor', 'borderTopLeftRadius', 
    'borderTopRightRadius', 'borderTopStyle', 'borderTopWidth', 'borderWidth', 
    'bottom', 'boxDecorationBreak', 'boxShadow', 'boxSizing', 'breakAfter', 
    'breakBefore', 'breakInside', 'captionSide', 'caretColor', 'clear', 'clip', 
    'clipPath', 'color', 'columnCount', 'columnFill', 'columnGap', 'columnRule', 
    'columnRuleColor', 'columnRuleStyle', 'columnRuleWidth', 'columnSpan', 
    'columnWidth', 'columns', 'content', 'counterIncrement', 'counterReset', 
    'cursor', 'direction', 'display', 'emptyCells', 'filter', 'flex', 
    'flexBasis', 'flexDirection', 'flexFlow', 'flexGrow', 'flexShrink', 
    'flexWrap', 'float', 'font', 'fontFamily', 'fontFeatureSettings', 
    'fontKerning', 'fontSize', 'fontSizeAdjust', 'fontStretch', 'fontStyle', 
    'fontSynthesis', 'fontVariant', 'fontVariantCaps', 'fontVariantLigatures', 
    'fontVariantNumeric', 'fontVariantPosition', 'fontWeight', 'gap', 'grid', 
    'gridArea', 'gridAutoColumns', 'gridAutoFlow', 'gridAutoRows', 'gridColumn', 
    'gridColumnEnd', 'gridColumnGap', 'gridColumnStart', 'gridGap', 'gridRow', 
    'gridRowEnd', 'gridRowGap', 'gridRowStart', 'gridTemplate', 'gridTemplateAreas', 
    'gridTemplateColumns', 'gridTemplateRows', 'height', 'hyphens', 'imageRendering', 
    'isolation', 'justifyContent', 'justifyItems', 'justifySelf', 'left', 
    'letterSpacing', 'lineBreak', 'lineHeight', 'listStyle', 'listStyleImage', 
    'listStylePosition', 'listStyleType', 'margin', 'marginBottom', 'marginLeft', 
    'marginRight', 'marginTop', 'mask', 'maskClip', 'maskComposite', 'maskImage', 
    'maskMode', 'maskOrigin', 'maskPosition', 'maskRepeat', 'maskSize', 'maskType', 
    'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'mixBlendMode', 'objectFit', 
    'objectPosition', 'opacity', 'order', 'orphans', 'outline', 'outlineColor', 
    'outlineOffset', 'outlineStyle', 'outlineWidth', 'overflow', 'overflowWrap', 
    'overflowX', 'overflowY', 'padding', 'paddingBottom', 'paddingLeft', 
    'paddingRight', 'paddingTop', 'pageBreakAfter', 'pageBreakBefore', 
    'pageBreakInside', 'perspective', 'perspectiveOrigin', 'placeContent', 
    'placeItems', 'placeSelf', 'pointerEvents', 'position', 'quotes', 'resize', 
    'right', 'rowGap', 'scrollBehavior', 'tabSize', 'tableLayout', 'textAlign', 
    'textAlignLast', 'textCombineUpright', 'textDecoration', 'textDecorationColor', 
    'textDecorationLine', 'textDecorationStyle', 'textIndent', 'textJustify', 
    'textOrientation', 'textOverflow', 'textShadow', 'textTransform', 
    'textUnderlinePosition', 'top', 'transform', 'transformOrigin', 'transformStyle', 
    'transition', 'transitionDelay', 'transitionDuration', 'transitionProperty', 
    'transitionTimingFunction', 'unicodeBidi', 'userSelect', 'verticalAlign', 
    'visibility', 'whiteSpace', 'widows', 'width', 'willChange', 'wordBreak', 
    'wordSpacing', 'wordWrap', 'writingMode', 'zIndex'
  ]);
  
  // Merge base and config first
  const merged = { ...baseStyle, ...configStyle };
  
  // Property conflict resolution: longhand properties take precedence over shorthand
  const shorthandMap = {
    'margin': ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
    'padding': ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
    'border': ['borderTop', 'borderRight', 'borderBottom', 'borderLeft'],
    'borderWidth': ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'],
    'borderStyle': ['borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle'],
    'borderColor': ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'],
  };
  
  // If any longhand property exists, remove the shorthand
  Object.keys(shorthandMap).forEach(shorthand => {
    const longhands = shorthandMap[shorthand];
    const hasLonghand = longhands.some(prop => merged[prop] !== undefined);
    if (hasLonghand && merged[shorthand] !== undefined) {
      delete merged[shorthand];
    }
  });
  
  // Filter to only valid CSS properties
  Object.keys(merged).forEach(key => {
    const value = merged[key];
    if (validCSSProps.has(key) && (typeof value === 'string' || typeof value === 'number')) {
      validStyles[key] = value;
    }
  });
  
  return validStyles;
};

/**
 * Enhanced Flexible Container
 */
const FlexibleContainer = ({ children, config = {} }) => {
  return (
    <div style={applyStyles({
      width: "fit-content",
      maxWidth: "100%",
      padding: "10px",
      margin: "0",
      backgroundColor: "#FFFFFF",
      fontFamily: "Arial",
      color: "#000000",
      boxSizing: "border-box",
      overflow: "hidden",
    }, config)}>
      {children}
    </div>
  );
};

/**
 * Enhanced Flexible Text - Any text element
 */
const FlexibleText = ({ children, config = {}, as = "div" }) => {
  const Element = as; // Can be div, span, p, h1, etc.
  
  return (
    <Element style={applyStyles({
      fontSize: "10px",
      fontWeight: "normal",
      fontStyle: "normal",
      color: "#000000",
      lineHeight: "1.4",
      textAlign: "left",
      margin: "0",
      padding: "0",
    }, config)}>
      {children}
    </Element>
  );
};

/**
 * Flexible Section Header
 */
const FlexibleSectionHeader = ({ title, config }) => {
  return (
    <div style={applyStyles({
      fontSize: "14px",
      fontWeight: "bold",
      color: "#000000",
      marginBottom: "8px",
      marginTop: "0",
      paddingBottom: "3px",
      paddingTop: "0",
      borderBottom: "none",
      borderTop: "none",
      textTransform: "none",
      letterSpacing: "0",
      textAlign: "left",
      display: "block",
      background: "transparent",
    }, config)}>
      {config.icon && <span style={{ marginRight: "8px" }}>{config.icon}</span>}
      {title}
    </div>
  );
};

/**
 * Enhanced Flexible Layout
 */
const FlexibleLayout = ({ children, config = {} }) => {
  const isGrid = config.display === "grid";
  
  return (
    <div style={applyStyles({
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "stretch",
      flexWrap: "nowrap",
      gap: "0",
    }, {
      ...config,
      gridTemplateColumns: isGrid ? config.gridTemplateColumns : undefined,
      gridTemplateRows: isGrid ? config.gridTemplateRows : undefined,
    })}>
      {children}
    </div>
  );
};

// ========== ENHANCED BULLET LIST ==========

const FlexibleBulletList = ({ items = [], styleConfig = {} }) => {
  const config = styleConfig;

  return (
    <div
      style={applyStyles({
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        width: "100%",
      }, config.containerStyle)}
    >
      {items.filter(item => item?.trim()).map((item, index) => (
        <div
          key={index}
          style={applyStyles({
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            width: "100%",
          }, config.itemStyle)}
        >
          {/* Bullet */}
          <div
            style={applyStyles({
              marginTop: "2px",
              width: "10px",
              minWidth: "10px",
              fontSize: config.bulletSize || "12px",
              color: config.bulletColor || config.textColor || "#000000",
              lineHeight: config.lineHeight || "1.4",
              userSelect: "none",
            }, config.bulletStyle)}
          >
            {config.bulletChar || config.bulletStyle?.bulletChar || "•"}
          </div>

          {/* Text */}
          <div
            style={applyStyles({
              flex: 1,
              minWidth: 0,
              fontSize: config.textSize || "10px",
              color: config.textColor || "#000000",
              lineHeight: config.lineHeight || "1.4",
              whiteSpace: "normal",
              wordBreak: "normal",
              overflowWrap: "anywhere",
            }, config.textStyle)}
          >
            {item}
          </div>
        </div>
      ))}
    </div>
  );
};

// ========== FLEXIBLE SECTION COMPONENTS (KEEPING ORIGINAL NAMES) ==========

/**
 * HEADER SECTION - Enhanced with backward compatibility
 */
// export const FlexibleHeaderSection = ({ resumeDetails, styleConfig }) => {
//   const config = styleConfig.header;
  
//   return (
//     <FlexibleContainer config={config.container}>
//       {/* Main Header Layout */}
//       <FlexibleLayout config={config.mainLayout}>
        
//         {/* Name Section - Enhanced */}
//         <FlexibleLayout config={config.nameSection}>
//           <FlexibleText 
//             config={config.nameConfig || config.nameStyle}
//             as={config.nameElement || "h1"}
//           >
//             {resumeDetails.name || "Your Name"}
//           </FlexibleText>
          
//           {config.showTitle && (
//             <FlexibleText 
//               config={config.titleConfig || config.titleStyle}
//               as={config.titleElement || "div"}
//             >
//               {resumeDetails.title || "Your Title"}
//             </FlexibleText>
//           )}
//         </FlexibleLayout>
        
//         {/* Contact Section - Enhanced with per-item styling */}
//         {config.showContact && (
//           <FlexibleLayout config={config.contactLayout}>
//             {config.contactOrder?.map((contactType, idx) => {
//               const value = resumeDetails.contact?.[contactType];
//               if (!value) return null;
              
//               // Get specific config for this contact type (NEW)
//               const itemConfig = config.contactStyles?.[contactType] || config.contactItemStyle || {};
//               const iconConfig = config.contactIconStyles?.[contactType] || config.contactIconStyle || {};
              
//               return (
//                 <FlexibleLayout 
//                   key={idx} 
//                   config={{ 
//                     display: "flex", 
//                     alignItems: "center",
//                     gap: "0px"
//                   }}
//                 >
//                   {config.showContactIcons && (
//                     <div style={applyStyles({
//                       width: "5px",
//                       height: "5px",
//                       backgroundColor: "#E74C3C",
//                       borderRadius: "50%",
//                       marginRight: "8px",
//                     }, iconConfig)} />
//                   )}
//                   <FlexibleText config={itemConfig}>
//                     {config.contactIcons?.[contactType] && (
//                       <span style={{ marginRight: "4px" }}>{config.contactIcons[contactType]}</span>
//                     )}
//                     {value}
//                   </FlexibleText>
//                 </FlexibleLayout>
//               );
//             })}
//           </FlexibleLayout>
//         )}
//       </FlexibleLayout>
      
//       {/* Optional Divider */}
//       {config.showDivider && (
//         <div style={applyStyles({
//           borderBottom: config.dividerStyle || "1px solid #000",
//           marginTop: config.dividerMarginTop || "8px",
//           marginBottom: config.dividerMarginBottom || "8px",
//         }, typeof config.dividerStyle === 'object' ? config.dividerStyle : {})} />
//       )}
//     </FlexibleContainer>
//   );
// };

export const FlexibleHeaderSection = ({ resumeDetails, styleConfig }) => {
  const config = styleConfig.header;

  // Helper function to render sections based on order
  const renderSection = (sectionType) => {
    switch (sectionType) {
      case 'name':
        return (
          <FlexibleLayout
            key="name"
            config={{
              display: "flex",
              flexDirection: "column",
              alignItems: config.nameAlign || "flex-start",
              justifyContent: config.nameJustify || "flex-start",
              marginBottom: config.nameMarginBottom || "0px",
              marginTop: config.nameMarginTop || "0px",
              marginLeft: config.nameMarginLeft || "0px",
              marginRight: config.nameMarginRight || "0px",
              padding: config.namePadding || "0px",
              width: config.nameWidth || "auto",
              flex: config.nameFlex || "initial",
              order: config.nameOrder ?? 1,
              ...config.nameZone,
            }}
          >
            <FlexibleText
              config={config.nameStyle}
              as={config.nameElement || "h1"}
            >
              {resumeDetails.name || "Your Name"}
            </FlexibleText>
          </FlexibleLayout>
        );

      case 'title':
        return config.showTitle ? (
          <FlexibleLayout
            key="title"
            config={{
              display: "flex",
              flexDirection: "column",
              alignItems: config.titleAlign || "flex-start",
              justifyContent: config.titleJustify || "flex-start",
              marginBottom: config.titleMarginBottom || "0px",
              marginTop: config.titleMarginTop || "0px",
              marginLeft: config.titleMarginLeft || "0px",
              marginRight: config.titleMarginRight || "0px",
              padding: config.titlePadding || "0px",
              width: config.titleWidth || "auto",
              flex: config.titleFlex || "initial",
              order: config.titleOrder ?? 2,
              ...config.titleZone,
            }}
          >
            <FlexibleText
              config={config.titleStyle}
              as={config.titleElement || "div"}
            >
              {resumeDetails.title || "Your Title"}
            </FlexibleText>
          </FlexibleLayout>
        ) : null;

      case 'contact':
        return config.showContact ? (
          <FlexibleLayout
            key="contact"
            config={{
              display: config.contactLayoutType === "grid" ? "grid" : "flex",
              flexDirection: config.contactDirection || "row",
              flexWrap: config.contactWrap || "wrap",
              gridTemplateColumns: config.contactGridColumns,
              gridTemplateRows: config.contactGridRows,
              gap: config.contactGap || "16px",
              rowGap: config.contactRowGap,
              columnGap: config.contactColumnGap,
              alignItems: config.contactAlign || "center",
              justifyContent: config.contactJustify || "flex-start",
              marginTop: config.contactMarginTop || "0px",
              marginBottom: config.contactMarginBottom || "0px",
              marginLeft: config.contactMarginLeft || "0px",
              marginRight: config.contactMarginRight || "0px",
              padding: config.contactPadding || "0px",
              width: config.contactWidth || "auto",
              flex: config.contactFlex || "initial",
              order: config.contactOrder ?? 3,
              ...config.contactZone,
            }}
          >
            {config.contactItems?.map((type, idx) => {
              const value = resumeDetails.contact?.[type];
              if (!value) return null;

              return (
                <FlexibleLayout
                  key={idx}
                  config={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: config.contactItemJustify || "flex-start",
                    padding: config.contactItemPadding || "0px",
                    margin: config.contactItemMargin || "0px",
                    ...config.contactItemContainer,
                  }}
                >
                  {config.showContactIcons && (
                    <div
                      style={{
                        width: config.contactIconSize || "5px",
                        height: config.contactIconSize || "5px",
                        borderRadius: config.contactIconBorderRadius || "50%",
                        backgroundColor: config.contactIconColor || "#E74C3C",
                        marginRight: config.contactIconMarginRight || "8px",
                        marginLeft: config.contactIconMarginLeft || "0px",
                      }}
                    />
                  )}

                  <FlexibleText config={config.contactItemStyle}>
                    {value}
                  </FlexibleText>
                </FlexibleLayout>
              );
            })}
          </FlexibleLayout>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <FlexibleContainer config={config.container}>
      <FlexibleLayout
        config={{
          display: config.layoutDisplay || "flex",
          flexDirection: config.layoutDirection || "column",
          alignItems: config.layoutAlign || "stretch",
          justifyContent: config.layoutJustify || "flex-start",
          gap: config.layoutGap || "0px",
          rowGap: config.layoutRowGap,
          columnGap: config.layoutColumnGap,
          padding: config.layoutPadding || "0px",
          ...config.layout,
        }}
      >
        {(config.sectionOrder || ['name', 'title', 'contact']).map(renderSection)}
      </FlexibleLayout>
    </FlexibleContainer>
  );
};

/**
 * SUMMARY SECTION - Enhanced
 */
export const FlexibleSummarySection = ({ summary, styleConfig }) => {
  const config = styleConfig.summary;
  
  return (
    <FlexibleContainer config={config.container}>
      {config.showTitle && (
        <FlexibleSectionHeader 
          title={config.titleText || "SUMMARY"} 
          config={config.titleStyle} 
        />
      )}
      
      {Array.isArray(summary) ? (
        config.displayType === "bullets" ? (
          <FlexibleBulletList items={summary} styleConfig={config.bulletConfig} />
        ) : (
          summary.map((para, idx) => (
            <FlexibleText key={idx} config={config.bodyStyle || config.valueStyle}>
              {para}
            </FlexibleText>
          ))
        )
      ) : (
        <FlexibleText config={config.bodyStyle || config.valueStyle}>
          {summary}
        </FlexibleText>
      )}
    </FlexibleContainer>
  );
};

/**
 * SKILLS SECTION - Enhanced with multiple display modes
 */
export const FlexibleSkillsSection = ({ skills, styleConfig }) => {
  const config = styleConfig.skills;
  
  // Parse skills based on display mode
  const groupedSkills = {};
  const flatSkills = [];
  
  if (skills && Array.isArray(skills)) {
    skills.forEach(skill => {
      const separator = config.categorySeparator || " - ";
      if (skill && skill.includes(separator)) {
        const [cat, val] = skill.split(separator);
        groupedSkills[cat.trim()] = val.trim();
      } else if (skill?.trim()) {
        flatSkills.push(skill.trim());
      }
    });
  }
  
  return (
    <FlexibleContainer config={config.container}>
      {config.showTitle && (
        <FlexibleSectionHeader 
          title={config.titleText || "SKILLS"} 
          config={config.titleStyle} 
        />
      )}
      
      <FlexibleLayout config={config.contentLayout}>
        {/* Display Mode: Categories (DEFAULT) */}
        {(!config.displayMode || config.displayMode === "categories" || config.displayMode === "text") && 
          Object.entries(groupedSkills).map(([category, value], idx) => (
          <div key={idx} style={applyStyles({ display: "flex", flexDirection: "column", marginBottom: config.itemMarginBottom || "8px" }, config.categoryLayout)}>
            {config.showCategories && (
              <FlexibleText config={config.categoryStyle}>
                {category}
                {config.categoryValueSeparator && (
                  <span style={applyStyles({}, config.separatorStyle || {})}>{config.categoryValueSeparator}</span>
                )}
              </FlexibleText>
            )}
            <FlexibleText config={config.valueStyle}>
              {value}
            </FlexibleText>
          </div>
        ))}
        
        {/* Display Mode: Tags */}
        {config.displayMode === "tags" && (
          <FlexibleLayout config={config.tagsContainer || { flexWrap: "wrap", gap: "6px" }}>
            {[...Object.keys(groupedSkills), ...flatSkills].map((skill, idx) => (
              <FlexibleText 
                key={idx}
                config={config.tagStyle || {
                  padding: "4px 10px",
                  backgroundColor: "#E74C3C",
                  color: "#FFFFFF",
                  borderRadius: "3px",
                  fontSize: "8px",
                  fontWeight: "500",
                }}
              >
                {skill}
              </FlexibleText>
            ))}
          </FlexibleLayout>
        )}
        
        {/* Display Mode: List */}
        {config.displayMode === "list" && (
          <FlexibleBulletList 
            items={[...Object.entries(groupedSkills).map(([k,v]) => `${k}: ${v}`), ...flatSkills]} 
            styleConfig={config.bulletConfig} 
          />
        )}
        
        {/* Display Mode: Inline */}
        {config.displayMode === "inline" && (
          <FlexibleText config={config.inlineStyle || config.valueStyle}>
            {[...Object.values(groupedSkills), ...flatSkills].join(config.inlineSeparator || ", ")}
          </FlexibleText>
        )}
        
        {/* Ungrouped Skills (for backward compatibility) */}
        {flatSkills.length > 0 && (!config.displayMode || config.displayMode === "categories" || config.displayMode === "text") && (
          <div style={{ marginBottom: config.itemMarginBottom || "8px" }}>
            {config.showCategories && (
              <FlexibleText config={config.categoryStyle}>
                Other
              </FlexibleText>
            )}
            <FlexibleText config={config.valueStyle}>
              {flatSkills.join(config.separator || ", ")}
            </FlexibleText>
          </div>
        )}
      </FlexibleLayout>
    </FlexibleContainer>
  );
};

/**
 * EXPERIENCE SECTION - Enhanced with custom structure support
 */
export const FlexibleExperienceSection = ({ experiences, styleConfig }) => {
  const config = styleConfig.experience;
  
  return (
    <FlexibleContainer config={config.container}>
      {config.showTitle && (
        <FlexibleSectionHeader 
          title={config.titleText || "EXPERIENCE"} 
          config={config.titleStyle} 
        />
      )}
      
      {experiences.map((exp, idx) => (
        <div key={idx} style={applyStyles({ marginBottom: config.itemMarginBottom || "12px" }, config.itemContainer || {})}>
          
          {/* Custom Header Structure (NEW FEATURE) */}
          {config.headerStructure ? (
            config.headerStructure.map((structure, structIdx) => (
              <FlexibleLayout key={structIdx} config={structure.layout}>
                {structure.fields?.map((fieldName, fieldIdx) => {
                  const value = exp[fieldName];
                  if (!value && !structure.showEmpty) return null;
                  
                  const fieldStyle = structure.styles?.[fieldName] || {};
                  const prefix = structure.prefix?.[fieldName] || "";
                  const suffix = structure.suffix?.[fieldName] || "";
                  
                  return (
                    <FlexibleText key={fieldIdx} config={fieldStyle}>
                      {prefix}{value}{suffix}
                    </FlexibleText>
                  );
                })}
              </FlexibleLayout>
            ))
          ) : (
            // Fallback to original layout (BACKWARD COMPATIBLE)
            <>
              <FlexibleLayout config={config.headerLayout}>
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
            </>
          )}
          
          {/* Achievements */}
          {config.showAchievements && exp.achievements && (
            <FlexibleBulletList items={exp.achievements} styleConfig={config.bulletConfig} />
          )}
        </div>
      ))}
    </FlexibleContainer>
  );
};

/**
 * PROJECTS SECTION - Enhanced
 */
export const FlexibleProjectsSection = ({ projects, styleConfig }) => {
  const config = styleConfig.projects;
  
  return (
    <FlexibleContainer config={config.container}>
      {config.showTitle && (
        <FlexibleSectionHeader 
          title={config.titleText || "PROJECTS"} 
          config={config.titleStyle} 
        />
      )}
      
      {projects.map((proj, idx) => (
        <FlexibleContainer 
          key={idx} 
          config={config.itemStyle || { marginBottom: config.itemMarginBottom || "12px" }}
        >
          {/* Project Header */}
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
          
          {/* Technologies */}
          {proj.technologies && config.showTechnologies && (
            <FlexibleText config={config.techStyle}>
              {config.techPrefix || ""}{proj.technologies}
            </FlexibleText>
          )}
          
          {/* Link */}
          {proj.link && config.showLink && (
            <FlexibleText 
              as="a" 
              config={{ ...config.linkStyle, href: proj.link, target: "_blank" }}
            >
              {proj.link}
            </FlexibleText>
          )}
          
          {/* Description */}
          {config.showDescription && proj.description && (
            Array.isArray(proj.description) ? (
              <FlexibleBulletList items={proj.description} styleConfig={config.bulletConfig} />
            ) : (
              <FlexibleText config={config.descriptionStyle || config.bodyStyle}>
                {proj.description}
              </FlexibleText>
            )
          )}
        </FlexibleContainer>
      ))}
    </FlexibleContainer>
  );
};

/**
 * EDUCATION SECTION - Enhanced with field order control
 */
export const FlexibleEducationSection = ({ educationList, styleConfig }) => {
  const config = styleConfig.education;
  
  return (
    <FlexibleContainer config={config.container}>
      {config.showTitle && (
        <FlexibleSectionHeader 
          title={config.titleText || "EDUCATION"} 
          config={config.titleStyle} 
        />
      )}
      
      {educationList.map((edu, idx) => (
        <FlexibleContainer 
          key={idx} 
          config={config.itemStyle || { marginBottom: config.itemMarginBottom || "10px" }}
        >
          {/* Custom Field Order (NEW FEATURE) */}
          {config.fieldOrder ? (
            config.fieldOrder.map((field, fieldIdx) => {
              const value = edu[field];
              if (!value && !config.showEmptyFields) return null;
              
              const fieldConfig = config.fieldStyles?.[field] || {};
              const prefix = config.fieldPrefixes?.[field] || "";
              
              return (
                <FlexibleText key={fieldIdx} config={fieldConfig}>
                  {prefix}{value}
                </FlexibleText>
              );
            })
          ) : (
            // Fallback to original layout (BACKWARD COMPATIBLE)
            <>
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
            </>
          )}
        </FlexibleContainer>
      ))}
    </FlexibleContainer>
  );
};

/**
 * CERTIFICATIONS SECTION - Enhanced with display types
 */
export const FlexibleCertificationsSection = ({ certifications, styleConfig }) => {
  const config = styleConfig.certifications;
  
  return (
    <FlexibleContainer config={config.container}>
      {config.showTitle && (
        <FlexibleSectionHeader 
          title={config.titleText || "CERTIFICATIONS"} 
          config={config.titleStyle} 
        />
      )}
      
      {config.displayType === "list" ? (
        <FlexibleBulletList items={certifications} styleConfig={config.bulletConfig} />
      ) : config.displayType === "grid" ? (
        <FlexibleLayout config={config.gridLayout || { flexWrap: "wrap", gap: "8px" }}>
          {certifications.filter(cert => cert?.trim()).map((cert, idx) => (
            <FlexibleText key={idx} config={config.itemStyle}>
              {cert}
            </FlexibleText>
          ))}
        </FlexibleLayout>
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
  const currentResume = useSelector((state)=> state.resume.currentResume);

  const [resumeDetails, setResumeDetails] = useState(defaultResumeData);

  useEffect(()=>{
     if(!currentResume) return;
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
    summary: FlexibleSummarySection,
    skills: FlexibleSkillsSection,
    experience: FlexibleExperienceSection,
    projects: FlexibleProjectsSection,
    education: FlexibleEducationSection,
    certifications: FlexibleCertificationsSection
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




  // ==================== HELPER FUNCTIONS ====================

  // Extract widths from config
  // const extractWidthsFromConfig = (config) => {
  //   const widths = {};
  //   Object.keys(config).forEach(key => {
  //     if (config[key]?.container?.width) {
  //       widths[key] = config[key].container.width;
  //     }
  //   });
  //   return widths;
  // };

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

  const renderSectionWithEngine = (sectionName) => {
    const ref = sectionRefs.current[sectionName];
    if (!ref?.current) return;

    const element = ref.current;
    const width = element.offsetWidth || 515;
    const height = element.offsetHeight || 200;

    console.log(`🎨 Rendering ${sectionName}: ${width}x${height}`);

    const canvas = document.createElement('canvas');
    const engine = new CanvasLayoutEngine(canvas, { scale: 6 });
    engine.initialize(width, height);

    let layoutTree;

    switch (sectionName) {
      case 'header':
        layoutTree = buildHeaderLayout(resumeData, styleConfig.header);
        console.log('Header layoutTree:', layoutTree);
        break;

      case 'skills':
        layoutTree = buildSkillsSection(resumeData.skills || []);
        console.log('Skills layoutTree:', layoutTree);
        break;

      case 'experience':
        layoutTree = buildExperienceSection(resumeData.experiences || []);
        console.log('Experience layoutTree:', layoutTree);
        break;

      case 'projects':
        layoutTree = buildProjectsSection(resumeData.projects || []);
        console.log('Projects layoutTree:', layoutTree);
        break;

      case 'summary':
        const summaryText = resumeData.resumeDetails?.summary || '';
        layoutTree = new BlockNode({ padding: 8 }, [
          new TextNode(summaryText, {
            font: `${parseInt(styleConfig.summary?.bodyStyle?.fontSize) || 12}px Arial`,
            color: styleConfig.summary?.bodyStyle?.color || '#000',
            lineHeight: 16
          })
        ]);
        console.log('Summary layoutTree:', layoutTree);
        break;

      case 'education':
        layoutTree = buildEducationSection(resumeData.educationList || []);
        console.log('Education layoutTree:', layoutTree);
        break;

      case 'certifications':
        layoutTree = buildCertificationsSection(resumeData.certifications || []);
        console.log('Certifications layoutTree:', layoutTree);
        break;

      default:
        return;
    }

    // Handle null layoutTree (when section is empty)
    if (!layoutTree) {
      console.warn(`⚠️ ${sectionName} layoutTree is null/undefined`);
      return;
    }

    try {
  console.log(`🖼️ About to render ${sectionName}...`);
  engine.renderLayoutTree(layoutTree, { x: 0, y: 0, width, height });
  
  // ✅ USE toDataURL() instead of toImage()
  const dataURL = engine.toDataURL('image/png', 1.0);
  console.log(`✅ ${sectionName} dataURL length:`, dataURL?.length);
  
  if (!dataURL || typeof dataURL !== 'string' || !dataURL.startsWith('data:image')) {
    console.error(`❌ Invalid dataURL for ${sectionName}:`, dataURL);
    return;
  }

  const img = new Image();
  img.width = width;
  img.height = height;
  img.onload = () => {
    console.log(`✅ Image loaded successfully for ${sectionName}`);
    setSectionImages(prev => ({ ...prev, [sectionName]: img }));
  };
  img.onerror = (e) => {
    console.error(`❌ Image load failed for ${sectionName}:`, e);
  };
  img.src = dataURL;
} catch (err) {
  console.error(`❌ Error rendering ${sectionName}:`, err);
  console.error('Stack:', err.stack);
}
  };

  const timer = setTimeout(() => {
    console.log('🚀 Starting render for all sections...');
    console.log('Available sections:', Object.keys(sectionRefs.current));
    console.log('Resume data:', resumeData);
    Object.keys(sectionRefs.current).forEach(renderSectionWithEngine);
  }, 300);

  return () => clearTimeout(timer);
}, [TemplateComponents, styleConfig, resumeData, sectionWidths, sectionHeights]);




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


      {/* Hidden rendering area */}
      <div className="hidden-render" style={{ position: 'absolute', left: '-100000x', top: '-10000px', visibility: 'none', width: '1050px', background: 'white' }}>
        {TemplateComponents && Object.entries(sectionRefs.current).map(([key, ref]) => {
          const Component = TemplateComponents[key];
          if (!Component) return null;
          
          // Map data according to your FlexibleSection component props
          const propsMap = {
            header: { resumeDetails: resumeData?.resumeDetails, styleConfig: styleConfig },
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
            <div key={key} ref={ref} style={{ 
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

      {/* ======================= RIGHT PANEL START ======================= */}


      
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