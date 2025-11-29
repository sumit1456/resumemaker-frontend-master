// import React, { useEffect, useRef, useState } from "react";
// import { fabric } from "fabric";
// import html2canvas from "html2canvas";
// import { useSelector, useDispatch } from "react-redux";

// // ========== TEMPLATE COMPONENT ==========
// const Template1HTMLEditable = ({
//   resumeDetails = {},
//   skills = [],
//   experiences = [],
//   projects = [],
//   educationList = [],
//   certifications = [],
//   showSummary = true,
//   showSkills = true,
//   showExperience = true,
//   showProjects = true,
//   showEducation = true,
//   showCertifications = true,
//   sectionTitles = {},
//   customSections = [],
//   styleConfig = {}
// }) => {
//   const defaultConfig = {
//     primaryColor: "#000000",
//     textColor: "#000000",
//     accentColor: "#000000",
//     backgroundColor: "#FFFFFF",
//     fontFamily: "Helvetica",
//     nameFontSize: 24,
//     titleFontSize: 11,
//     headerFontSize: 11,
//     bodyFontSize: 10,
//     smallFontSize: 9,
//     lineHeight: 1.4,
//     letterSpacing: 0.5,
//     textTransform: "uppercase",
//     pageMargin: 40,
//     headerMarginBottom: 20,
//     columnGap: 15,
//     leftColumnWidth: "35%",
//     rightColumnWidth: "65%",
//     sectionMarginTop: 12,
//     sectionMarginBottom: 6,
//     itemMarginBottom: 8,
//     headerBorderWidth: 3,
//     sectionBorderWidth: 1.5,
//     columnBorderWidth: 2,
//     bulletStyle: "•"
//   };


//   const currentResume = useSelector((state)=> state.resume.currentResume);


//   useEffect(()=>{
//     if(!currentResume) return;

//       resumeDetails = currentResume.resumeDetails;
      


//   }, [currentResume]);

//   const config = { ...defaultConfig, ...styleConfig };

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

//   const pageStyle = {
//     width: "210mm",
//     minHeight: "297mm",
//     padding: config.pageMargin,
//     backgroundColor: config.backgroundColor,
//     fontFamily: config.fontFamily,
//     color: config.textColor,
//     fontSize: config.bodyFontSize,
//     lineHeight: config.lineHeight,
//     boxSizing: "border-box"
//   };

//   const sectionHeaderStyle = {
//     fontSize: config.headerFontSize,
//     fontWeight: "bold",
//     color: config.primaryColor,
//     marginTop: config.sectionMarginTop,
//     marginBottom: config.sectionMarginBottom,
//     borderBottom: `${config.sectionBorderWidth}px solid ${config.accentColor}`,
//     textTransform: config.textTransform,
//     letterSpacing: config.letterSpacing,
//     paddingBottom: 3,
//   };

//   return (
//     <div style={pageStyle}>
//       {/* HEADER */}
//       <div style={{ marginBottom: config.headerMarginBottom }}>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "baseline",
//             marginBottom: 6,
//             paddingBottom: 8,
//             borderBottom: `${config.headerBorderWidth}px solid ${config.primaryColor}`,
//           }}
//         >
//           <div style={{ fontSize: config.nameFontSize, fontWeight: "bold", letterSpacing: config.letterSpacing, color: config.primaryColor }}>
//             {resumeDetails.name || "Your Name"}
//           </div>
//           <div style={{ fontSize: config.titleFontSize, fontWeight: "bold", color: config.primaryColor }}>
//             {resumeDetails.title || "Your Title"}
//           </div>
//         </div>

//         <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 6 }}>
//           <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
//             {resumeDetails.contact?.phone && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.phone}</div>}
//             {resumeDetails.contact?.email && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.email}</div>}
//           </div>
//           <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-end" }}>
//             {resumeDetails.contact?.linkedin && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.linkedin}</div>}
//             {resumeDetails.contact?.github && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.github}</div>}
//             {resumeDetails.contact?.location && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.location}</div>}
//           </div>
//         </div>
//       </div>

//       {/* SUMMARY */}
//       {showSummary && resumeDetails.summary && (
//         <div>
//           <div style={sectionHeaderStyle}>{sectionTitles.summary || "SUMMARY"}</div>
//           <div style={{ marginBottom: 8, fontSize: config.bodyFontSize, textAlign: "justify" }}>{resumeDetails.summary}</div>
//         </div>
//       )}

//       {/* TWO COLUMNS */}
//       <div style={{ display: "flex", gap: config.columnGap }}>
//         {/* LEFT COLUMN */}
//         <div style={{ width: config.leftColumnWidth, paddingRight: 10 }}>
//           {/* SKILLS */}
//           {showSkills && skills?.length > 0 && (
//             <div>
//               <div style={sectionHeaderStyle}>{sectionTitles.skills || "SKILLS"}</div>
//               {Object.entries(groupedSkills).map(([cat, val], idx) => (
//                 <div key={idx} style={{ marginBottom: config.itemMarginBottom }}>
//                   <div style={{ fontSize: config.smallFontSize + 0.5, fontWeight: "bold", color: config.textColor }}>{cat}</div>
//                   <div style={{ fontSize: config.smallFontSize, color: config.textColor }}>{val}</div>
//                 </div>
//               ))}
//               {ungroupedSkills.length > 0 && (
//                 <div style={{ marginBottom: config.itemMarginBottom }}>
//                   <div style={{ fontSize: config.smallFontSize + 0.5, fontWeight: "bold", color: config.textColor }}>Other</div>
//                   <div style={{ fontSize: config.smallFontSize, color: config.textColor }}>{ungroupedSkills.join(", ")}</div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* EDUCATION */}
//           {showEducation && educationList?.length > 0 && (
//             <div>
//               <div style={sectionHeaderStyle}>{sectionTitles.education || "EDUCATION"}</div>
//               {educationList.map((edu, idx) => (
//                 <div key={idx} style={{ marginBottom: 10 }}>
//                   <div style={{ fontWeight: "bold", fontSize: config.bodyFontSize, color: config.textColor }}>{edu.degree}</div>
//                   {edu.institution && <div style={{ fontSize: config.smallFontSize, color: config.textColor }}>{edu.institution}</div>}
//                   <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", color: config.textColor }}>
//                     {edu.year}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
//                   </div>
//                   {edu.location && <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", color: config.textColor }}>{edu.location}</div>}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* CERTIFICATIONS */}
//           {showCertifications && certifications?.length > 0 && (
//             <div>
//               <div style={sectionHeaderStyle}>{sectionTitles.certifications || "CERTIFICATIONS"}</div>
//               {certifications.filter(cert => cert?.trim()).map((cert, idx) => (
//                 <div key={idx} style={{ marginBottom: 4, color: config.textColor, fontSize: config.smallFontSize }}>
//                   {config.bulletStyle} {cert}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* RIGHT COLUMN */}
//         <div style={{ width: config.rightColumnWidth, paddingLeft: 10, borderLeft: `${config.columnBorderWidth}px solid ${config.accentColor}` }}>
//           {/* EXPERIENCE */}
//           {showExperience && experiences?.length > 0 && (
//             <div>
//               <div style={sectionHeaderStyle}>{sectionTitles.experience || "EXPERIENCE"}</div>
//               {experiences.map((exp, idx) => (
//                 <div key={idx} style={{ marginBottom: 12 }}>
//                   <div style={{ marginBottom: 3 }}>
//                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
//                       <div style={{ fontWeight: "bold", fontSize: config.headerFontSize, color: config.textColor }}>{exp.position}</div>
//                       <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", color: config.textColor }}>{exp.duration}</div>
//                     </div>
//                     <div style={{ fontSize: config.smallFontSize + 0.5, marginBottom: 4, color: config.textColor }}>
//                       {exp.company}{exp.location ? `, ${exp.location}` : ""}
//                     </div>
//                   </div>
//                   {exp.achievements?.filter(a => a?.trim()).map((ach, j) => (
//                     <div key={j} style={{ display: "flex", marginBottom: 3 }}>
//                       <div style={{ width: 10, color: config.textColor }}>{config.bulletStyle}</div>
//                       <div style={{ flex: 1, fontSize: config.smallFontSize + 0.5, lineHeight: config.lineHeight, color: config.textColor }}>{ach}</div>
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* PROJECTS */}
//           {showProjects && projects?.length > 0 && (
//             <div>
//               <div style={sectionHeaderStyle}>{sectionTitles.projects || "PROJECTS"}</div>
//               {projects.map((proj, idx) => (
//                 <div key={idx} style={{ marginBottom: 11 }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
//                     <div style={{ fontWeight: "bold", fontSize: config.headerFontSize, color: config.textColor }}>{proj.name}</div>
//                     {proj.duration && <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", color: config.textColor }}>{proj.duration}</div>}
//                   </div>
//                   {proj.technologies && <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", marginBottom: 4, color: config.textColor }}>{proj.technologies}</div>}
//                   {proj.description?.filter(d => d?.trim()).map((desc, j) => (
//                     <div key={j} style={{ display: "flex", marginBottom: 3 }}>
//                       <div style={{ width: 10, color: config.textColor }}>{config.bulletStyle}</div>
//                       <div style={{ flex: 1, fontSize: config.smallFontSize + 0.5, lineHeight: config.lineHeight, color: config.textColor }}>{desc}</div>
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ========== FABRIC HTML PREVIEW COMPONENT ==========
// const FabricHtmlPreview = ({
//   resumeDetails = {},
//   skills = [],
//   experiences = [],
//   projects = [],
//   educationList = [],
//   certifications = [],
//   customSections = [],
//   sectionTitles = {},
//   styleConfig = {},
// }) => {
//   const containerRef = useRef(null);
//   const canvasRef = useRef(null);
//   const fabricRef = useRef(null);
//   const hiddenRef = useRef(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!canvasRef.current || fabricRef.current) return;

//     fabricRef.current = new fabric.Canvas(canvasRef.current, {
//       backgroundColor: "#fff",
//       selection: false,
//       renderOnAddRemove: true,
//     });

//     return () => {
//       fabricRef.current?.dispose();
//       fabricRef.current = null;
//     };
//   }, []);

//   useEffect(() => {
//     if (!hiddenRef.current || !fabricRef.current) return;

//     const renderHtmlToFabric = async () => {
//       setLoading(true);
//       try {
//         await new Promise((resolve) => setTimeout(resolve, 100));

//         const canvasElement = hiddenRef.current;
//         const scale = 2;

//         const htmlCanvas = await html2canvas(canvasElement, {
//           scale,
//           useCORS: true,
//           backgroundColor: styleConfig.backgroundColor || "#fff",
//         });

//         const imgData = htmlCanvas.toDataURL("image/png");
//         const fabricCanvas = fabricRef.current;
        
//         fabric.Image.fromURL(imgData, (img) => {
//           const containerWidth = containerRef.current.clientWidth;
//           const displayScale = containerWidth / img.width;

//           img.set({
//             selectable: false,
//             evented: false,
//             scaleX: displayScale,
//             scaleY: displayScale,
//           });

//           fabricCanvas.clear();
//           fabricCanvas.setDimensions({
//             width: img.width * displayScale,
//             height: img.height * displayScale,
//           });

//           fabricCanvas.add(img);
//           fabricCanvas.renderAll();
//         });
//       } catch (err) {
//         console.error("Failed to render HTML to Fabric:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     renderHtmlToFabric();
//   }, [resumeDetails, skills, experiences, projects, educationList, certifications, customSections, sectionTitles, styleConfig]);

//   return (
//     <div style={{ position: 'relative', width: '100%', height: '100%' }}>
//       <div
//         ref={hiddenRef}
//         style={{
//           position: "absolute",
//           top: 0,
//           left: "-99999px",
//           pointerEvents: "none",
//         }}
//       >
//         <Template1HTMLEditable
//           resumeDetails={resumeDetails}
//           skills={skills}
//           experiences={experiences}
//           projects={projects}
//           educationList={educationList}
//           certifications={certifications}
//           customSections={customSections}
//           sectionTitles={sectionTitles}
//           styleConfig={styleConfig}
//         />
//       </div>

//       <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '20px' }}>
//         <canvas ref={canvasRef} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)', maxWidth: '100%' }} />
//       </div>
//     </div>
//   );
// };

// // ========== MAIN UI EDITOR COMPONENT ==========
// const UIEditor = () => {
//   const defaultStyleConfig = {
//     primaryColor: "#000000",
//     textColor: "#000000",
//     accentColor: "#000000",
//     backgroundColor: "#FFFFFF",
//     fontFamily: "Helvetica",
//     nameFontSize: 24,
//     titleFontSize: 11,
//     headerFontSize: 11,
//     bodyFontSize: 10,
//     smallFontSize: 9,
//     lineHeight: 1.4,
//     letterSpacing: 0.5,
//     pageMargin: 40,
//     columnGap: 15,
//     leftColumnWidth: "35%",
//     rightColumnWidth: "65%",
//     headerBorderWidth: 3,
//     sectionBorderWidth: 1.5,
//     columnBorderWidth: 2,
//     bulletStyle: "•",
//   };

//   const [styleConfig, setStyleConfig] = useState(defaultStyleConfig);

//   const [resumeDetails] = useState({
//     name: "SUMIT HATEKAR",
//     title: "Full Stack Developer",
//     contact: {
//       phone: "+91 9876543210",
//       email: "sumithatekar@gmail.com",
//       linkedin: "linkedin.com/in/sumithatekar",
//       github: "github.com/sumithatekar",
//       location: "Pune, India",
//     },
//     summary: "Dedicated Java Developer with expertise in Java, Spring Boot, Hibernate/JPA, and RESTful APIs, specializing in building scalable backend systems. Skilled in database design, SQL optimization, and microservices architecture, with strong understanding of OOP and design patterns. Proficient in developing secure, high-performance enterprise applications and experienced in Agile/Scrum environments. Eager to contribute backend expertise while continuously growing as a Java professional.",
//   });

//   const [skills] = useState([
//     "Programming Languages - Java, JavaScript (ES6+), SQL",
//     "Databases - PostgreSQL, Oracle",
//     "Frameworks & Libraries - React.js, Spring Boot, Hibernate, Express.js (basic)",
//     "Tools & Platforms - Git, GitHub, Postman, Swagger, Maven, Eclipse/IntelliJ",
//     "Cloud & Deployment - AWS (EC2, S3, RDS), Docker (basic)",
//     "Soft Skills - Problem Solving, Communication, Agile Teamwork"
//   ]);

//   const [experiences] = useState([
//     {
//       position: "Software Engineer",
//       company: "Tech Solutions Ltd.",
//       location: "Pune, India",
//       duration: "Jan 2022 - Present",
//       achievements: [
//         "Developed client dashboard using React",
//         "Implemented REST APIs in Node.js"
//       ],
//     },
//   ]);

//   const [projects] = useState([
//     {
//       name: "Resume Maker Pro",
//       duration: "September 2023 - ongoing",
//       technologies: "React, Java, Spring Boot, Spring Security, Docker",
//       description: [
//         "Developed the backend using Java Spring Boot with Hibernate/JPA for efficient data storage and retrieval.",
//         "Built RESTful APIs to manage resume sections such as personal info, skills, certifications, and experience.",
//         "Implemented React.js frontend for real-time editing and live preview of resume templates.",
//         "Integrated resume download/export functionality (PDF/Docx) with formatted layouts.",
//         "Ensured scalable, modular architecture with clean code and reusable components."
//       ],
//     },
//     {
//       name: "Find Issue Web Application",
//       duration: "June 2023 - August 2023",
//       technologies: "Java, Spring Boot, Thymeleaf, MySQL",
//       description: [
//         "Built a web application to log, track, and manage software issues.",
//         "Implemented Spring Boot backend with RESTful APIs for CRUD operations on issues.",
//         "Designed MySQL database schema for efficient issue storage and retrieval.",
//         "Created user-friendly UI using Thymeleaf for issue submission and tracking.",
//         "Added role-based access control to allow admin and user-specific views."
//       ],
//     }
//   ]);

//   const [educationList] = useState([
//     {
//       degree: "Master of Science in Computer Applications",
//       institution: "Savitribai Phule University",
//       location: "Pune, India",
//       year: "2025",
//       gpa: "Currently pursuing",
//     },
//     {
//       degree: "BSc Chemistry",
//       institution: "Shivaji University",
//       location: "Koregaon Satara, India",
//       year: "2021",
//       gpa: "7.52",
//     },
//   ]);

//   const [certifications] = useState([
//     "Java Full Stack Development - QSpiders Wakad 2024",
//     "Scrum Master Certified",
//   ]);

//   const [sectionTitles] = useState({
//     summary: "SUMMARY",
//     skills: "SKILLS",
//     experience: "EXPERIENCE",
//     projects: "PROJECTS",
//     education: "EDUCATION",
//     certifications: "CERTIFICATIONS"
//   });

//   const handleStyleChange = (key, value) => {
//     setStyleConfig(prev => ({ ...prev, [key]: value }));
//   };

//   const inputStyle = {
//     width: '100%',
//     padding: '8px 10px',
//     border: '1px solid #333',
//     borderRadius: '4px',
//     background: '#1a1a1a',
//     color: '#fff',
//     fontSize: '13px'
//   };

//   const labelStyle = {
//     display: 'block',
//     marginBottom: '6px',
//     fontWeight: '500',
//     fontSize: '13px',
//     color: '#fff'
//   };

//   return (
//     <div style={{ 
//       display: 'grid', 
//       gridTemplateColumns: '300px 1fr 300px',
//       height: '100vh',
//       width: '100vw',
//       background: '#000',
//       fontFamily: 'system-ui, -apple-system, sans-serif',
//       overflow: 'hidden',
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0
//     }}>
//       {/* LEFT SIDEBAR - Content Editor */}
//       <div style={{
//         background: '#0d0d0d',
//         padding: '20px',
//         overflowY: 'auto',
//         borderRight: '1px solid #222',
//         height: '100vh'
//       }}>
//         <h3 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '16px', fontWeight: '600' }}>
//           CONTENT EDITOR
//         </h3>

//         <div style={{ marginBottom: '20px' }}>
//           <label style={labelStyle}>Template</label>
//           <select style={inputStyle}>
//             <option>Classic Template</option>
//           </select>
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label style={labelStyle}>Name</label>
//           <input
//             type="text"
//             value={resumeDetails.name}
//             readOnly
//             style={inputStyle}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label style={labelStyle}>Title</label>
//           <input
//             type="text"
//             value={resumeDetails.title}
//             readOnly
//             style={inputStyle}
//           />
//         </div>
//       </div>

//       {/* MIDDLE - Resume Preview */}
//       <div style={{ 
//         background: '#1a1a1a',
//         overflowY: 'auto',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'flex-start',
//         padding: '30px 20px',
//         height: '100vh'
//       }}>
//         <FabricHtmlPreview
//           resumeDetails={resumeDetails}
//           skills={skills}
//           experiences={experiences}
//           projects={projects}
//           educationList={educationList}
//           certifications={certifications}
//           sectionTitles={sectionTitles}
//           styleConfig={styleConfig}
//         />
//       </div>

//       {/* RIGHT SIDEBAR - Style Editor */}
//       <div style={{
//         background: '#0d0d0d',
//         padding: '20px',
//         overflowY: 'auto',
//         borderLeft: '1px solid #222',
//         height: '100vh'
//       }}>
//         <h3 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '16px', fontWeight: '600' }}>
//           STYLE EDITOR
//         </h3>

//         <div style={{ marginBottom: '15px' }}>
//           <label style={labelStyle}>Name Font Size</label>
//           <input
//             type="number"
//             value={styleConfig.nameFontSize}
//             onChange={(e) => handleStyleChange("nameFontSize", parseInt(e.target.value))}
//             style={inputStyle}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label style={labelStyle}>Header Font Size</label>
//           <input
//             type="number"
//             value={styleConfig.headerFontSize}
//             onChange={(e) => handleStyleChange("headerFontSize", parseInt(e.target.value))}
//             style={inputStyle}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label style={labelStyle}>Body Font Size</label>
//           <input
//             type="number"
//             value={styleConfig.bodyFontSize}
//             onChange={(e) => handleStyleChange("bodyFontSize", parseInt(e.target.value))}
//             style={inputStyle}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label style={labelStyle}>Primary Color</label>
//           <input
//             type="color"
//             value={styleConfig.primaryColor}
//             onChange={(e) => handleStyleChange("primaryColor", e.target.value)}
//             style={{ ...inputStyle, height: '38px', padding: '4px' }}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label style={labelStyle}>Text Color</label>
//           <input
//             type="color"
//             value={styleConfig.textColor}
//             onChange={(e) => handleStyleChange("textColor", e.target.value)}
//             style={{ ...inputStyle, height: '38px', padding: '4px' }}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label style={labelStyle}>Accent Color</label>
//           <input
//             type="color"
//             value={styleConfig.accentColor}
//             onChange={(e) => handleStyleChange("accentColor", e.target.value)}
//             style={{ ...inputStyle, height: '38px', padding: '4px' }}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label style={labelStyle}>Background Color</label>
//           <input
//             type="color"
//             value={styleConfig.backgroundColor}
//             onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
//             style={{ ...inputStyle, height: '38px', padding: '4px' }}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label style={labelStyle}>Font Family</label>
//           <select
//             value={styleConfig.fontFamily}
//             onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
//             style={inputStyle}
//           >
//             <option value="Helvetica">Helvetica</option>
//             <option value="Arial">Arial</option>
//             <option value="Times New Roman">Times New Roman</option>
//             <option value="Courier New">Courier New</option>
//             <option value="Georgia">Georgia</option>
//           </select>
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label style={labelStyle}>Line Height</label>
//           <input
//             type="number"
//             step="0.1"
//             value={styleConfig.lineHeight}
//             onChange={(e) => handleStyleChange("lineHeight", parseFloat(e.target.value))}
//             style={inputStyle}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label style={labelStyle}>Letter Spacing</label>
//           <input
//             type="number"
//             step="0.1"
//             value={styleConfig.letterSpacing}
//             onChange={(e) => handleStyleChange("letterSpacing", parseFloat(e.target.value))}
//             style={inputStyle}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label style={labelStyle}>Page Margin</label>
//           <input
//             type="number"
//             value={styleConfig.pageMargin}
//             onChange={(e) => handleStyleChange("pageMargin", parseInt(e.target.value))}
//             style={inputStyle}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UIEditor;



import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import html2canvas from "html2canvas";
import { useSelector } from "react-redux";

// ========== TEMPLATE COMPONENT ==========
const Template1HTMLEditable = ({
  resumeDetails = {},
  skills = [],
  experiences = [],
  projects = [],
  educationList = [],
  certifications = [],
  showSummary = true,
  showSkills = true,
  showExperience = true,
  showProjects = true,
  showEducation = true,
  showCertifications = true,
  sectionTitles = {},
  customSections = [],
  styleConfig = {}
}) => {
  const defaultConfig = {
    primaryColor: "#000000",
    textColor: "#000000",
    accentColor: "#000000",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    nameFontSize: 24,
    titleFontSize: 11,
    headerFontSize: 11,
    bodyFontSize: 10,
    smallFontSize: 9,
    lineHeight: 1.4,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    pageMargin: 40,
    headerMarginBottom: 20,
    columnGap: 15,
    leftColumnWidth: "35%",
    rightColumnWidth: "65%",
    sectionMarginTop: 12,
    sectionMarginBottom: 6,
    itemMarginBottom: 8,
    headerBorderWidth: 3,
    sectionBorderWidth: 1.5,
    columnBorderWidth: 2,
    bulletStyle: "•"
  };

  const config = { ...defaultConfig, ...styleConfig };

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

  const pageStyle = {
    width: "210mm",
    minHeight: "297mm",
    padding: config.pageMargin,
    backgroundColor: config.backgroundColor,
    fontFamily: config.fontFamily,
    color: config.textColor,
    fontSize: config.bodyFontSize,
    lineHeight: config.lineHeight,
    boxSizing: "border-box"
  };

  const sectionHeaderStyle = {
    fontSize: config.headerFontSize,
    fontWeight: "bold",
    color: config.primaryColor,
    marginTop: config.sectionMarginTop,
    marginBottom: config.sectionMarginBottom,
    borderBottom: `${config.sectionBorderWidth}px solid ${config.accentColor}`,
    textTransform: config.textTransform,
    letterSpacing: config.letterSpacing,
    paddingBottom: 3,
  };

  return (
    <div style={pageStyle}>
      {/* HEADER */}
      <div style={{ marginBottom: config.headerMarginBottom }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 6,
            paddingBottom: 8,
            borderBottom: `${config.headerBorderWidth}px solid ${config.primaryColor}`,
          }}
        >
          <div style={{ fontSize: config.nameFontSize, fontWeight: "bold", letterSpacing: config.letterSpacing, color: config.primaryColor }}>
            {resumeDetails.name || "Your Name"}
          </div>
          <div style={{ fontSize: config.titleFontSize, fontWeight: "bold", color: config.primaryColor }}>
            {resumeDetails.title || "Your Title"}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 6 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {resumeDetails.contact?.phone && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.phone}</div>}
            {resumeDetails.contact?.email && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.email}</div>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-end" }}>
            {resumeDetails.contact?.linkedin && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.linkedin}</div>}
            {resumeDetails.contact?.github && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.github}</div>}
            {resumeDetails.contact?.location && <div style={{ fontSize: config.smallFontSize }}>{resumeDetails.contact.location}</div>}
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      {showSummary && resumeDetails.summary && (
        <div>
          <div style={sectionHeaderStyle}>{sectionTitles.summary || "SUMMARY"}</div>
          <div style={{ marginBottom: 8, fontSize: config.bodyFontSize, textAlign: "justify" }}>{resumeDetails.summary}</div>
        </div>
      )}

      {/* TWO COLUMNS */}
      <div style={{ display: "flex", gap: config.columnGap }}>
        {/* LEFT COLUMN */}
        <div style={{ width: config.leftColumnWidth, paddingRight: 10 }}>
          {/* SKILLS */}
          {showSkills && skills?.length > 0 && (
            <div>
              <div style={sectionHeaderStyle}>{sectionTitles.skills || "SKILLS"}</div>
              {Object.entries(groupedSkills).map(([cat, val], idx) => (
                <div key={idx} style={{ marginBottom: config.itemMarginBottom }}>
                  <div style={{ fontSize: config.smallFontSize + 0.5, fontWeight: "bold", color: config.textColor }}>{cat}</div>
                  <div style={{ fontSize: config.smallFontSize, color: config.textColor }}>{val}</div>
                </div>
              ))}
              {ungroupedSkills.length > 0 && (
                <div style={{ marginBottom: config.itemMarginBottom }}>
                  <div style={{ fontSize: config.smallFontSize + 0.5, fontWeight: "bold", color: config.textColor }}>Other</div>
                  <div style={{ fontSize: config.smallFontSize, color: config.textColor }}>{ungroupedSkills.join(", ")}</div>
                </div>
              )}
            </div>
          )}

          {/* EDUCATION */}
          {showEducation && educationList?.length > 0 && (
            <div>
              <div style={sectionHeaderStyle}>{sectionTitles.education || "EDUCATION"}</div>
              {educationList.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: "bold", fontSize: config.bodyFontSize, color: config.textColor }}>{edu.degree}</div>
                  {edu.institution && <div style={{ fontSize: config.smallFontSize, color: config.textColor }}>{edu.institution}</div>}
                  <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", color: config.textColor }}>
                    {edu.year}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                  </div>
                  {edu.location && <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", color: config.textColor }}>{edu.location}</div>}
                </div>
              ))}
            </div>
          )}

          {/* CERTIFICATIONS */}
          {showCertifications && certifications?.length > 0 && (
            <div>
              <div style={sectionHeaderStyle}>{sectionTitles.certifications || "CERTIFICATIONS"}</div>
              {certifications.filter(cert => cert?.trim()).map((cert, idx) => (
                <div key={idx} style={{ marginBottom: 4, color: config.textColor, fontSize: config.smallFontSize }}>
                  {config.bulletStyle} {cert}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ width: config.rightColumnWidth, paddingLeft: 10, borderLeft: `${config.columnBorderWidth}px solid ${config.accentColor}` }}>
          {/* EXPERIENCE */}
          {showExperience && experiences?.length > 0 && (
            <div>
              <div style={sectionHeaderStyle}>{sectionTitles.experience || "EXPERIENCE"}</div>
              {experiences.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: 12 }}>
                  <div style={{ marginBottom: 3 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <div style={{ fontWeight: "bold", fontSize: config.headerFontSize, color: config.textColor }}>{exp.position}</div>
                      <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", color: config.textColor }}>{exp.duration}</div>
                    </div>
                    <div style={{ fontSize: config.smallFontSize + 0.5, marginBottom: 4, color: config.textColor }}>
                      {exp.company}{exp.location ? `, ${exp.location}` : ""}
                    </div>
                  </div>
                  {exp.achievements?.filter(a => a?.trim()).map((ach, j) => (
                    <div key={j} style={{ display: "flex", marginBottom: 3 }}>
                      <div style={{ width: 10, color: config.textColor }}>{config.bulletStyle}</div>
                      <div style={{ flex: 1, fontSize: config.smallFontSize + 0.5, lineHeight: config.lineHeight, color: config.textColor }}>{ach}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* PROJECTS */}
          {showProjects && projects?.length > 0 && (
            <div>
              <div style={sectionHeaderStyle}>{sectionTitles.projects || "PROJECTS"}</div>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ marginBottom: 11 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <div style={{ fontWeight: "bold", fontSize: config.headerFontSize, color: config.textColor }}>{proj.name}</div>
                    {proj.duration && <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", color: config.textColor }}>{proj.duration}</div>}
                  </div>
                  {proj.technologies && <div style={{ fontSize: config.smallFontSize, fontStyle: "italic", marginBottom: 4, color: config.textColor }}>{proj.technologies}</div>}
                  {proj.description?.filter(d => d?.trim()).map((desc, j) => (
                    <div key={j} style={{ display: "flex", marginBottom: 3 }}>
                      <div style={{ width: 10, color: config.textColor }}>{config.bulletStyle}</div>
                      <div style={{ flex: 1, fontSize: config.smallFontSize + 0.5, lineHeight: config.lineHeight, color: config.textColor }}>{desc}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ========== FABRIC HTML PREVIEW COMPONENT ==========
const FabricHtmlPreview = ({
  resumeDetails = {},
  skills = [],
  experiences = [],
  projects = [],
  educationList = [],
  certifications = [],
  customSections = [],
  sectionTitles = {},
  styleConfig = {},
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const hiddenRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#fff",
      selection: false,
      renderOnAddRemove: true,
    });

    return () => {
      fabricRef.current?.dispose();
      fabricRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!hiddenRef.current || !fabricRef.current) return;

    const renderHtmlToFabric = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const canvasElement = hiddenRef.current;
        const scale = 2;

        const htmlCanvas = await html2canvas(canvasElement, {
          scale,
          useCORS: true,
          backgroundColor: styleConfig.backgroundColor || "#fff",
        });

        const imgData = htmlCanvas.toDataURL("image/png");
        const fabricCanvas = fabricRef.current;
        
        fabric.Image.fromURL(imgData, (img) => {
          const containerWidth = containerRef.current?.clientWidth || 800;
          const displayScale = containerWidth / img.width;

          img.set({
            selectable: false,
            evented: false,
            scaleX: displayScale,
            scaleY: displayScale,
          });

          fabricCanvas.clear();
          fabricCanvas.setDimensions({
            width: img.width * displayScale,
            height: img.height * displayScale,
          });

          fabricCanvas.add(img);
          fabricCanvas.renderAll();
        });
      } catch (err) {
        console.error("Failed to render HTML to Fabric:", err);
      } finally {
        setLoading(false);
      }
    };

    renderHtmlToFabric();
  }, [resumeDetails, skills, experiences, projects, educationList, certifications, customSections, sectionTitles, styleConfig]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={hiddenRef}
        style={{
          position: "absolute",
          top: 0,
          left: "-99999px",
          pointerEvents: "none",
        }}
      >
        <Template1HTMLEditable
          resumeDetails={resumeDetails}
          skills={skills}
          experiences={experiences}
          projects={projects}
          educationList={educationList}
          certifications={certifications}
          customSections={customSections}
          sectionTitles={sectionTitles}
          styleConfig={styleConfig}
        />
      </div>

      <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '20px' }}>
        <canvas ref={canvasRef} style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)', maxWidth: '100%' }} />
      </div>
    </div>
  );
};

// ========== MAIN UI EDITOR COMPONENT ==========
const UIEditor = () => {
  const defaultStyleConfig = {
    primaryColor: "#000000",
    textColor: "#000000",
    accentColor: "#000000",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    nameFontSize: 24,
    titleFontSize: 11,
    headerFontSize: 11,
    bodyFontSize: 10,
    smallFontSize: 9,
    lineHeight: 1.4,
    letterSpacing: 0.5,
    pageMargin: 40,
    columnGap: 15,
    leftColumnWidth: "35%",
    rightColumnWidth: "65%",
    headerBorderWidth: 3,
    sectionBorderWidth: 1.5,
    columnBorderWidth: 2,
    bulletStyle: "•",
  };

  const defaultResumeDetails = {
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
  };

  const defaultSectionTitles = {
    summary: "SUMMARY",
    skills: "SKILLS",
    experience: "EXPERIENCE",
    projects: "PROJECTS",
    education: "EDUCATION",
    certifications: "CERTIFICATIONS"
  };

  const [styleConfig, setStyleConfig] = useState(defaultStyleConfig);
  const [resumeDetails, setResumeDetails] = useState(defaultResumeDetails);
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

  const [sectionTitles, setSectionTitles] = useState(defaultSectionTitles);

  // Redux integration
  const currentResume = useSelector((state) => state?.resume?.currentResume);

  useEffect(() => {
    if (!currentResume) return;

    setResumeDetails(currentResume.resumeDetails ?? defaultResumeDetails);
    setSkills(currentResume.skills ?? []);
    setExperiences(currentResume.experiences ?? []);
    setProjects(currentResume.projects ?? []);
    setEducationList(currentResume.educationList ?? []);
    setCertifications(currentResume.certifications ?? []);
    setSectionTitles(currentResume.sectionTitles ?? defaultSectionTitles);
  }, [currentResume]);

  const handleStyleChange = (key, value) => {
    setStyleConfig(prev => ({ ...prev, [key]: value }));
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #333',
    borderRadius: '4px',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: '13px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '500',
    fontSize: '13px',
    color: '#fff'
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '300px 1fr 300px',
      height: '100%',
      width: '100%',
      background: '#000',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden'
    }}>
      {/* LEFT SIDEBAR - Content Editor */}
      <div style={{
        background: '#0d0d0d',
        padding: '20px',
        overflowY: 'auto',
        borderRight: '1px solid #222',
        height: '100%'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '16px', fontWeight: '600' }}>
          CONTENT EDITOR
        </h3>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Template</label>
          <select style={inputStyle}>
            <option>Classic Template</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Name</label>
          <input
            type="text"
            value={resumeDetails.name}
            readOnly
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Title</label>
          <input
            type="text"
            value={resumeDetails.title}
            readOnly
            style={inputStyle}
          />
        </div>
      </div>

      {/* MIDDLE - Resume Preview */}
      <div style={{ 
        background: '#1a1a1a',
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '30px 20px',
        height: '100%'
      }}>
        <FabricHtmlPreview
          resumeDetails={resumeDetails}
          skills={skills}
          experiences={experiences}
          projects={projects}
          educationList={educationList}
          certifications={certifications}
          sectionTitles={sectionTitles}
          styleConfig={styleConfig}
        />
      </div>

      {/* RIGHT SIDEBAR - Style Editor */}
      <div style={{
        background: '#0d0d0d',
        padding: '20px',
        overflowY: 'auto',
        borderLeft: '1px solid #222',
        height: '100%'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '16px', fontWeight: '600' }}>
          STYLE EDITOR
        </h3>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Name Font Size</label>
          <input
            type="number"
            value={styleConfig.nameFontSize}
            onChange={(e) => handleStyleChange("nameFontSize", parseInt(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Header Font Size</label>
          <input
            type="number"
            value={styleConfig.headerFontSize}
            onChange={(e) => handleStyleChange("headerFontSize", parseInt(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Body Font Size</label>
          <input
            type="number"
            value={styleConfig.bodyFontSize}
            onChange={(e) => handleStyleChange("bodyFontSize", parseInt(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Primary Color</label>
          <input
            type="color"
            value={styleConfig.primaryColor}
            onChange={(e) => handleStyleChange("primaryColor", e.target.value)}
            style={{ ...inputStyle, height: '38px', padding: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Text Color</label>
          <input
            type="color"
            value={styleConfig.textColor}
            onChange={(e) => handleStyleChange("textColor", e.target.value)}
            style={{ ...inputStyle, height: '38px', padding: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Accent Color</label>
          <input
            type="color"
            value={styleConfig.accentColor}
            onChange={(e) => handleStyleChange("accentColor", e.target.value)}
            style={{ ...inputStyle, height: '38px', padding: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Background Color</label>
          <input
            type="color"
            value={styleConfig.backgroundColor}
            onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
            style={{ ...inputStyle, height: '38px', padding: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Font Family</label>
          <select
            value={styleConfig.fontFamily}
            onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
            style={inputStyle}
          >
            <option value="Helvetica">Helvetica</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Line Height</label>
          <input
            type="number"
            step="0.1"
            value={styleConfig.lineHeight}
            onChange={(e) => handleStyleChange("lineHeight", parseFloat(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Letter Spacing</label>
          <input
            type="number"
            step="0.1"
            value={styleConfig.letterSpacing}
            onChange={(e) => handleStyleChange("letterSpacing", parseFloat(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Page Margin</label>
          <input
            type="number"
            value={styleConfig.pageMargin}
            onChange={(e) => handleStyleChange("pageMargin", parseInt(e.target.value))}
            style={inputStyle}
          />
        </div>
      </div>
    </div>
  );
};

export default UIEditor;