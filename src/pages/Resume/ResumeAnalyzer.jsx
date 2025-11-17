import React, { useState } from "react";
import { data } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentResume, setEnhancedResume } from "../../redux/store";
import { retry } from "@reduxjs/toolkit/query";
import { useEffect } from "react";



const API_BASE_URL = 'http://localhost:8080';
const API_BASE_URL2 = 'https://resumemaker-1.onrender.com';

const techSkills = [
  "javascript","python","java","react","angular","vue","node",
  "typescript","sql","mongodb","aws","azure","docker","kubernetes",
  "git","agile","scrum","rest","api","microservices","spring boot",
  "hibernate","html","css","webpack","redux"
];

const actionVerbs = [
  "develop","build","design","implement","manage","lead",
  "create","optimize","deploy","maintain","collaborate"
];

export default function ResumeAnalyzer({
  resumeDetails,
  skills,
  experiences,
  projects,
  educationList,
  certifications,
  customSections,
  showSummary = true,
  showSkills = true,
  showExperience = true,
  showProjects = true,
  showEducation = true,
  showCertifications = true
}) {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAIAnalysis, setIsAIAnalysis] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [foundSkills, setFoundSkills] = useState([]);
  const [foundVerbs, setFoundVerbs] = useState([]);
  const [jobDescriptionInsights, setJobDescriptionInsights] = useState("");
  const [createComparisonReport, setCreateComparisonReport] = useState("false");
  const currentResume = useSelector((state)=> state.currentResume);
  const enhancedResume = useSelector((state)=> state.enhancedResume);
  const [currentLocalResume, setCurrentLocalResume] = useState(null);
  const [newLocalResume, setNewLocalResume] = useState(null);
  const [reportOutput, setReportOutput] = useState(null);


  
const API_BASE_URL2 = 'http://localhost:8080';
const API_BASE_URL = 'https://resumemaker-1.onrender.com';

const dispatch = useDispatch();


useEffect(() => {

  
  
  if (currentLocalResume) {
    console.log("===============================================================");
    console.log("Current resume updated locally:");
    console.log(currentLocalResume);
    
    console.log("===============================================================");
  }
}, [currentLocalResume]);


useEffect(() => {

  
  
  if (currentResume) {
    console.log("===============================================================");
    console.log("Current resume updated globally:");
    console.log(currentResume);
    
    console.log("===============================================================");
  }
}, [currentResume]);




  // Build resume string for AI analysis
  const buildResumeString = () => {
    let r = `${resumeDetails.name}\n${resumeDetails.title}\n`;
    if (resumeDetails.contact) {
      r += `Contact: ${resumeDetails.contact.email || ""} | ${resumeDetails.contact.phone || ""} | ${resumeDetails.contact.location || ""}\n`;
      if (resumeDetails.contact.linkedin) r += `LinkedIn: ${resumeDetails.contact.linkedin}\n`;
      if (resumeDetails.contact.github) r += `GitHub: ${resumeDetails.contact.github}\n`;
    }
    r += "\n";

    if (showSummary && resumeDetails.summary)
      r += `SUMMARY\n${resumeDetails.summary}\n\n`;

    if (showSkills && skills.length) {
      r += "SKILLS\n";
      skills.forEach(s => r += `• ${s.trim()}\n`);
      r += "\n";
    }

    if (showExperience && experiences.length) {
      r += "EXPERIENCE\n";
      experiences.forEach(exp => {
        r += `${exp.position} | ${exp.company}\n`;
        r += `${exp.location || ""} | ${exp.duration}\n`;
        exp.achievements?.forEach(a => a.trim() && (r += `• ${a.trim()}\n`));
        r += "\n";
      });
    }

    if (showProjects && projects.length) {
      r += "PROJECTS\n";
      projects.forEach(p => {
        r += `${p.name}${p.duration ? ` | ${p.duration}` : ""}\n`;
        if (p.technologies) r += `Tech: ${p.technologies}\n`;
        p.description?.forEach(d => d.trim() && (r += `• ${d.trim()}\n`));
        r += "\n";
      });
    }

    if (showEducation && educationList.length) {
      r += "EDUCATION\n";
      educationList.forEach(e => {
        r += `${e.degree} ${e.year ? `| ${e.year}` : ""}\n`;
        if (e.institution) r += `${e.institution}\n`;
        if (e.location || e.gpa) r += `${e.location || ""}${e.gpa ? ` | GPA: ${e.gpa}` : ""}\n`;
        r += "\n";
      });
    }

    if (showCertifications && certifications.length) {
      r += "CERTIFICATIONS\n";
      certifications.forEach(c => r += `• ${c.trim()}\n`);
      r += "\n";
    }

    if (customSections?.length) {
      customSections.forEach(section => {
        if (!section.title.trim()) return;
        r += `${section.title.toUpperCase()}\n`;
        section.items.forEach(item => item.trim() && (r += `• ${item.trim()}\n`));
        r += "\n";
      });
    }

    return r.trim();
  };

  // ==================== STYLES ====================
// Centralized style objects matching your About page design

const COLORS = {
  primary: '#224361ff',
  secondary: '#201f1f',
  tertiary: '#272727',
  accent: '#282727ff',
  white: '#ffffff',
  gray: '#aaaaaa',
  lightGray: '#cccccc'
};

const STYLES = {
  // Container
  container: {
    backgroundColor: COLORS.secondary,
    color: COLORS.white,
    padding: '24px',
    borderRadius: '12px',   // smoother corners
    minHeight: '500px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
  },

  // Header
  header: {
    marginBottom: '32px',
    paddingBottom: '16px',
    borderBottom: `1px solid ${COLORS.gray}`,
  },

  headerTitle: {
    margin: '0 0 8px 0',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: '1px'
  },

  headerSubtitle: {
    margin: '0',
    fontSize: '0.9rem',
    color: COLORS.gray,
    letterSpacing: '0.5px'
  },

  // Card
  card: {
    border: 'none',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: COLORS.tertiary,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },

  cardAccent: {
    border: 'none',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: COLORS.accent,
    textAlign: 'center',
    color: COLORS.white,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },

  cardLight: {
    border: 'none',
    padding: '24px',
    borderRadius: '12px',
    backgroundColor: COLORS.white,
    color: COLORS.primary,
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
  },

  // Typography
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderBottom: `1px solid ${COLORS.gray}`,
    paddingBottom: '8px'
  },

  cardTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: '10px'
  },

  label: {
    fontSize: '0.75rem',
    color: COLORS.gray,
    marginBottom: '6px',
    textTransform: 'uppercase',
    fontWeight: '600'
  },

  bigNumber: {
    fontSize: '2rem',
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: '-0.5px'
  },

  mediumNumber: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: '-0.5px'
  },

  // Badge/Pill
  badge: {
    padding: '6px 14px',
    borderRadius: '20px',
    backgroundColor: COLORS.primary,
    fontSize: '0.75rem',
    color: COLORS.white,
    fontWeight: '600',
    letterSpacing: '0.5px'
  },

  // Grid
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '32px'
  },

  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px'
  },

  // List
  list: {
    margin: '0',
    paddingLeft: '20px',
    fontSize: '0.85rem',
    lineHeight: '1.8',
    color: COLORS.lightGray
  }


  
};


// ==================== UTILITY COMPONENTS ====================

const StatCard = ({ label, value, accent = false }) => (
  <div style={{
    ...STYLES.card,
    ...(accent ? { backgroundColor: COLORS.accent } : {}),
    textAlign: 'center'
  }}>
    <div style={STYLES.label}>{label}</div>
    <div style={STYLES.bigNumber}>{value}</div>
  </div>
);

const SkillCategory = ({ title, skills, count }) => (
  <div style={STYLES.card}>
    <div style={STYLES.cardTitle}>
      {title} · {count}
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {skills.map(skill => (
        <span key={skill} style={STYLES.badge}>
          {skill.toUpperCase()}
        </span>
      ))}
    </div>
  </div>
);

const RecommendationCard = ({ icon, title, items }) => (
  <div style={{ 
    ...STYLES.card,
    backgroundColor: title.includes('Gap') ? COLORS.primary : COLORS.tertiary
  }}>
    <div style={STYLES.cardTitle}>
      {icon} {title}
    </div>
    <ul style={STYLES.list}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </div>
);

const LoadingState = () => (
  <div style={{
    ...STYLES.container,
    textAlign: 'center',
    minHeight: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <div style={{
      ...STYLES.card,
      padding: '32px'
    }}>
      <p style={{
        fontSize: '1.2rem',
        color: COLORS.white,
        margin: '0 0 12px 0',
        fontWeight: '700',
        letterSpacing: '1px',
        textTransform: 'uppercase'
      }}>
        🤖 AI Analyzing
      </p>
      <p style={{
        fontSize: '0.9rem',
        color: COLORS.gray,
        margin: '0',
        letterSpacing: '0.5px'
      }}>
        This may take a few moments
      </p>
    </div>
  </div>
);

const ErrorState = ({ title, message, subtitle }) => (
  <div style={STYLES.container}>
    <div style={STYLES.card}>
      <h4 style={STYLES.cardTitle}>
        ❌ {title}
      </h4>
      <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: COLORS.lightGray }}>
        {message}
      </p>
      {subtitle && (
        <p style={{ margin: '0', fontSize: '0.8rem', color: COLORS.gray }}>
          {subtitle}
        </p>
      )}
    </div>
  </div>
);


// const formatValue = (val) => {
//   if (!val) return "—";

//   // If value is string → show directly
//   if (typeof val === "string") return val;

//   // If value is array → render each item
//   if (Array.isArray(val)) {
//     return val.map((item, idx) => (
//       <div key={idx} style={{ 
//         marginBottom: "12px",
//         paddingBottom: "12px",
//         borderBottom: idx < val.length - 1 ? "1px solid #333" : "none"
//       }}>
//         {typeof item === "string" ? (
//           item
//         ) : (
//           <div>
//             {item.title && (
//               <div style={{ color: "#fff", fontWeight: "600", marginBottom: "6px" }}>
//                 {item.title}
//               </div>
//             )}
//             {item.description && (
//               <div style={{ color: "#d0d0d0", fontSize: "13px", marginBottom: "6px" }}>
//                 {item.description}
//               </div>
//             )}
//             {item.technologies && (
//               <div style={{ color: "#888", fontSize: "12px" }}>
//                 Technologies: {Array.isArray(item.technologies) ? item.technologies.join(", ") : item.technologies}
//               </div>
//             )}
//             {item.url && (
//               <div style={{ color: "#ffb86c", fontSize: "12px", marginTop: "4px" }}>
//                 {item.url}
//               </div>
//             )}
//             {/* Fallback for any other object structure */}
//             {!item.title && !item.description && (
//               <pre style={{ 
//                 whiteSpace: "pre-wrap", 
//                 color: "#ccc", 
//                 fontSize: "12px",
//                 margin: 0,
//                 fontFamily: "monospace"
//               }}>
//                 {JSON.stringify(item, null, 2)}
//               </pre>
//             )}
//           </div>
//         )}
//       </div>
//     ));
//   }

//   // If value is object → pretty print
//   if (typeof val === "object") {
//     return (
//       <pre style={{ 
//         whiteSpace: "pre-wrap", 
//         color: "#ccc",
//         fontSize: "12px",
//         margin: 0,
//         fontFamily: "monospace"
//       }}>
//         {JSON.stringify(val, null, 2)}
//       </pre>
//     );
//   }

//   return String(val);
// };

// const formatComparisonReport = (report) => {
//   if (!report?.differences) return <p>No comparison found.</p>;

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
//       {Object.entries(report.differences).map(([section, data], idx) => {
//         const icon = section.includes("summary")
//           ? "💼"
//           : section.includes("skills")
//           ? "🧩"
//           : section.includes("project")
//           ? "🛠️"
//           : "📄";

//         return (
//           <div
//             key={idx}
//             style={{
//               background: "linear-gradient(145deg, #2d2d2d 0%, #262626 100%)",
//               border: "1px solid #404040",
//               borderRadius: "12px",
//               padding: "0",
//               overflow: "hidden",
//               boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
//             }}
//           >
//             {/* Header with gradient background */}
//             <div style={{ 
//               background: "linear-gradient(135deg, #3a3a3a 0%, #2d2d2d 100%)",
//               display: "flex", 
//               alignItems: "center", 
//               gap: "12px",
//               padding: "16px 20px",
//               borderBottom: "1px solid #404040"
//             }}>
//               <div style={{
//                 background: "linear-gradient(135deg, #4a4a4a, #3a3a3a)",
//                 width: "40px",
//                 height: "40px",
//                 borderRadius: "10px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: "20px",
//                 boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
//               }}>
//                 {icon}
//               </div>
//               <h3 style={{ 
//                 color: "#fff", 
//                 margin: 0, 
//                 fontSize: "15px", 
//                 fontWeight: "600",
//                 letterSpacing: "0.5px"
//               }}>
//                 {section.replace(/_/g, " ").toUpperCase()}
//               </h3>
//             </div>

//             <div style={{ padding: "20px" }}>
//               {/* Old Version */}
//               <div style={{ marginBottom: "20px" }}>
//                 <div style={{ 
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                   marginBottom: "10px" 
//                 }}>
//                   <div style={{
//                     width: "4px",
//                     height: "14px",
//                     background: "#888",
//                     borderRadius: "2px"
//                   }}></div>
//                   <span style={{ 
//                     color: "#888", 
//                     fontSize: "11px", 
//                     fontWeight: "700",
//                     textTransform: "uppercase",
//                     letterSpacing: "1px"
//                   }}>
//                     Old Version
//                   </span>
//                 </div>
//                 <div style={{ 
//                   color: "#d0d0d0",
//                   background: "#1e1e1e",
//                   padding: "14px 16px",
//                   borderRadius: "8px",
//                   border: "1px solid #333",
//                   fontSize: "13.5px",
//                   lineHeight: "1.6"
//                 }}>
//                   {formatValue(data.old)}
//                 </div>
//               </div>

//               {/* New Version */}
//               <div style={{ marginBottom: "20px" }}>
//                 <div style={{ 
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                   marginBottom: "10px" 
//                 }}>
//                   <div style={{
//                     width: "4px",
//                     height: "14px",
//                     background: "#888",
//                     borderRadius: "2px"
//                   }}></div>
//                   <span style={{ 
//                     color: "#888", 
//                     fontSize: "11px", 
//                     fontWeight: "700",
//                     textTransform: "uppercase",
//                     letterSpacing: "1px"
//                   }}>
//                     New Version
//                   </span>
//                 </div>
//                 <div style={{ 
//                   color: "#d0d0d0",
//                   background: "#1e1e1e",
//                   padding: "14px 16px",
//                   borderRadius: "8px",
//                   border: "1px solid #333",
//                   fontSize: "13.5px",
//                   lineHeight: "1.6"
//                 }}>
//                   {formatValue(data.new)}
//                 </div>
//               </div>

//               {/* Changes Detected */}
//               {Array.isArray(data.changes) && data.changes.length > 0 && (
//                 <div style={{
//                   background: "#1e1e1e",
//                   padding: "16px",
//                   borderRadius: "8px",
//                   border: "1px solid #333"
//                 }}>
//                   <div style={{ 
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                     marginBottom: "12px" 
//                   }}>
//                     <span style={{ 
//                       color: "#ffb86c", 
//                       fontSize: "11px", 
//                       fontWeight: "700",
//                       textTransform: "uppercase",
//                       letterSpacing: "1px"
//                     }}>
//                       Changes Detected
//                     </span>
//                   </div>
//                   <ul style={{ 
//                     color: "#d0d0d0", 
//                     margin: 0,
//                     paddingLeft: "20px",
//                     listStyleType: "none",
//                     fontSize: "13px",
//                     lineHeight: "1.7"
//                   }}>
//                     {data.changes.map((c, i) => (
//                       <li key={i} style={{ 
//                         marginBottom: "8px",
//                         position: "relative",
//                         paddingLeft: "8px"
//                       }}>
//                         <span style={{
//                           position: "absolute",
//                           left: "-12px",
//                           color: "#ffb86c"
//                         }}>•</span>
//                         {c}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

const formatValue = (value) => {
  if (Array.isArray(value)) {
    // Check if it's an array of project objects
    if (value.length > 0 && typeof value[0] === 'object' && value[0].name) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {value.map((project, i) => (
            <div key={i} style={{
              background: "#252525",
              padding: "16px",
              borderRadius: "6px",
              border: "1px solid #333"
            }}>
              <div style={{ 
                color: "#fbbf24", 
                fontWeight: "600", 
                marginBottom: "8px",
                fontSize: "0.95rem"
              }}>
                {project.name}
              </div>
              {project.duration && (
                <div style={{ 
                  color: "#999", 
                  fontSize: "0.8rem",
                  marginBottom: "8px"
                }}>
                  {project.duration}
                </div>
              )}
              {project.technologies && (
                <div style={{ 
                  color: "#888", 
                  fontSize: "0.8rem",
                  marginBottom: "10px"
                }}>
                  {project.technologies}
                </div>
              )}
              {project.description && Array.isArray(project.description) && (
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: "20px",
                  color: "#d4d4d4",
                  fontSize: "0.85rem"
                }}>
                  {project.description.map((desc, j) => (
                    <li key={j} style={{ marginBottom: "4px", lineHeight: "1.5" }}>
                      {desc}
                    </li>
                  ))}
                </ul>
              )}
              {project.link && (
                <div style={{ marginTop: "10px" }}>
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: "#fbbf24", 
                      fontSize: "0.8rem",
                      textDecoration: "none"
                    }}
                  >
                    🔗 {project.link}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    // Regular array (like skills)
    return (
      <ul style={{ 
        margin: 0, 
        paddingLeft: "20px",
        color: "#d4d4d4"
      }}>
        {value.map((item, i) => (
          <li key={i} style={{ marginBottom: "6px", lineHeight: "1.6" }}>
            {typeof item === 'object' ? JSON.stringify(item) : item}
          </li>
        ))}
      </ul>
    );
  }
  
  if (typeof value === 'object' && value !== null) {
    return <pre style={{ margin: 0, color: "#d4d4d4", fontSize: "0.88rem" }}>{JSON.stringify(value, null, 2)}</pre>;
  }
  
  return <span style={{ color: "#d4d4d4" }}>{String(value)}</span>;
};

const formatComparisonReport = (report) => {
  if (!report?.differences) return <p>No comparison found.</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {Object.entries(report.differences).map(([section, data], idx) => {
        const icon = section.includes("summary")
          ? "📋"
          : section.includes("skills")
          ? "🧩"
          : section.includes("project")
          ? "🛠️"
          : section.includes("experience")
          ? "⚡"
          : "📄";

        return (
          <div
            key={idx}
            style={{
              background: "#2a2a2a",
              borderRadius: "8px",
              border: "1px solid #3a3a3a",
              padding: "24px",
            }}
          >
            {/* Section Header */}
            <h4 style={{
              margin: "0 0 20px 0",
              fontSize: "1rem",
              fontWeight: "600",
              color: "#ffffff",
              letterSpacing: "0.5px",
              paddingBottom: "12px",
              borderBottom: "2px solid #3a3a3a",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              {icon} {section.replace(/_/g, " ").toUpperCase()}
            </h4>

            {/* Old Version */}
            <div style={{
              background: "#1e1e1e",
              padding: "18px",
              borderRadius: "6px",
              marginBottom: "14px",
              borderLeft: "3px solid #888",
            }}>
              <div style={{
                fontSize: "0.75rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#888",
                marginBottom: "10px"
              }}>
                Old Version
              </div>
              <div style={{ 
                fontSize: "0.88rem",
                lineHeight: "1.7"
              }}>
                {formatValue(data.old)}
              </div>
            </div>

            {/* New Version */}
            <div style={{
              background: "#1e1e1e",
              padding: "18px",
              borderRadius: "6px",
              marginBottom: "14px",
              borderLeft: "3px solid #4a4a4a",
            }}>
              <div style={{
                fontSize: "0.75rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#999",
                marginBottom: "10px"
              }}>
                New Version
              </div>
              <div style={{ 
                fontSize: "0.88rem",
                lineHeight: "1.7"
              }}>
                {formatValue(data.new)}
              </div>
            </div>

            {/* Changes Detected */}
            {Array.isArray(data.changes) && data.changes.length > 0 && (
              <div style={{
                background: "#252525",
                padding: "18px",
                borderRadius: "6px",
                border: "1px solid #3a3a3a"
              }}>
                <div style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#fbbf24",
                  marginBottom: "12px"
                }}>
                  Changes Detected
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {data.changes.map((c, i) => (
                    <div key={i} style={{ 
                      display: "flex", 
                      gap: "12px", 
                      lineHeight: "1.7", 
                      color: "#d4d4d4", 
                      fontSize: "0.88rem" 
                    }}>
                      <span style={{ 
                        color: "#fbbf24", 
                        fontWeight: "bold", 
                        fontSize: "1.1rem", 
                        marginTop: "2px" 
                      }}>•</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};






















const analyzeQuick = () => {
  if (!jobDescription.trim()) return;
  setIsAnalyzing(true);
  setIsAIAnalysis(false);

  const text = jobDescription.toLowerCase();
  const detectedSkills = techSkills.filter(skill => text.includes(skill));
  const detectedVerbs = actionVerbs.filter(verb => text.includes(verb));
  const matchRate = Math.round((detectedSkills.length / techSkills.length) * 100);

  const experienceMatch = jobDescription.match(/(\d+)\+?\s*(year|yr)/i);
  const experienceRequired = experienceMatch ? experienceMatch[1] : 'N/A';

  // Categorize skills
  const frontendSkills = detectedSkills.filter(s => 
    ['react', 'vue', 'angular', 'html', 'css', 'javascript', 'typescript'].includes(s)
  );
  const backendSkills = detectedSkills.filter(s => 
    ['node', 'python', 'java', 'spring', 'django', 'flask'].includes(s)
  );
  const databaseSkills = detectedSkills.filter(s => 
    ['mongodb', 'postgresql', 'mysql', 'redis'].includes(s)
  );
  const cloudSkills = detectedSkills.filter(s => 
    ['aws', 'azure', 'docker', 'kubernetes'].includes(s)
  );

  setTimeout(() => {
    setFoundSkills(detectedSkills);
    setFoundVerbs(detectedVerbs);

    setJobDescriptionInsights(
      <div style={STYLES.container}>
        
        {/* Header */}
        <div style={{
          background: '#212121ff',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <h2 style={{
            margin: '0 0 8px 0',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#fff'
          }}>
            📊 Quick Analysis
          </h2>
          <p style={{
            margin: '0',
            fontSize: '0.9rem',
            color: '#999'
          }}>
            Instant keyword detection and match scoring
          </p>
        </div>

        {/* Overview Cards */}
        <div style={STYLES.grid2}>
          <StatCard label="Match Rate" value={`${matchRate}%`} accent />
          <StatCard label="Skills Found" value={detectedSkills.length} />
          <StatCard label="Action Verbs" value={detectedVerbs.length} />
          <StatCard label="Experience" value={`${experienceRequired}y`} />
        </div>

        {/* Skills Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🎯 SKILLS DETECTED
          </h3>
          
          {detectedSkills.length === 0 ? (
            <div style={{
              background: '#252424ff',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <p style={{
                margin: '0',
                fontSize: '0.9rem',
                color: '#999'
              }}>
                No technical skills detected in job description
              </p>
            </div>
          ) : (
            <div style={STYLES.grid2}>
              {frontendSkills.length > 0 && (
                <SkillCategory 
                  title="Frontend" 
                  skills={frontendSkills} 
                  count={frontendSkills.length} 
                />
              )}
              {backendSkills.length > 0 && (
                <SkillCategory 
                  title="Backend" 
                  skills={backendSkills} 
                  count={backendSkills.length} 
                />
              )}
              {databaseSkills.length > 0 && (
                <SkillCategory 
                  title="Database" 
                  skills={databaseSkills} 
                  count={databaseSkills.length} 
                />
              )}
              {cloudSkills.length > 0 && (
                <SkillCategory 
                  title="Cloud & DevOps" 
                  skills={cloudSkills} 
                  count={cloudSkills.length} 
                />
              )}
            </div>
          )}
        </div>

        {/* Action Verbs */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ⚡ ACTION VERBS · {detectedVerbs.length}
          </h3>
          
          {detectedVerbs.length > 0 ? (
            <div style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '20px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '10px'
              }}>
                {detectedVerbs.map(verb => (
                  <div key={verb} style={{
                    background: '#262626',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    padding: '10px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#fff',
                    letterSpacing: '0.5px'
                  }}>
                    {verb}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <p style={{
                margin: '0',
                fontSize: '0.9rem',
                color: '#999'
              }}>
                No action verbs detected in job description
              </p>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            💡 RECOMMENDATIONS
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* ATS Optimization */}
            <div style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '20px'
            }}>
              <h4 style={{
                margin: '0 0 12px 0',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#fff',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ⚡ ATS OPTIMIZATION
              </h4>
              <ul style={{
                margin: '0',
                padding: '0',
                listStyle: 'none',
                color: '#ccc',
                fontSize: '0.85rem',
                lineHeight: '1.8'
              }}>
                <li style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ color: '#fff' }}>▸</span>
                  <span>Include all {detectedSkills.length} detected skills prominently</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ color: '#fff' }}>▸</span>
                  <span>Use exact keyword matches (not synonyms)</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ color: '#fff' }}>▸</span>
                  <span>Avoid complex formatting that ATS can't parse</span>
                </li>
                <li style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: '#fff' }}>▸</span>
                  <span>Save as .docx or PDF with selectable text</span>
                </li>
              </ul>
            </div>

            {/* Content Strategy */}
            <div style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '20px'
            }}>
              <h4 style={{
                margin: '0 0 12px 0',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#fff',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ✍️ CONTENT STRATEGY
              </h4>
              <ul style={{
                margin: '0',
                padding: '0',
                listStyle: 'none',
                color: '#ccc',
                fontSize: '0.85rem',
                lineHeight: '1.8'
              }}>
                <li style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ color: '#fff' }}>▸</span>
                  <span>Start bullet points with action verbs</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ color: '#fff' }}>▸</span>
                  <span>Quantify achievements with metrics</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ color: '#fff' }}>▸</span>
                  <span>Mirror job description terminology</span>
                </li>
                <li style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: '#fff' }}>▸</span>
                  <span>Highlight relevant experience prominently</span>
                </li>
              </ul>
            </div>

            {/* Skills Gap Alert */}
            {matchRate < 70 && (
              <div style={{
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <h4 style={{
                  margin: '0 0 12px 0',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#fff',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  ⚠️ SKILLS GAP ALERT
                </h4>
                <ul style={{
                  margin: '0',
                  padding: '0',
                  listStyle: 'none',
                  color: '#ccc',
                  fontSize: '0.85rem',
                  lineHeight: '1.8'
                }}>
                  <li style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ color: '#fff' }}>▸</span>
                    <span>Match rate is {matchRate}% - aim for 70%+</span>
                  </li>
                  <li style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ color: '#fff' }}>▸</span>
                    <span>Review job description for additional skills</span>
                  </li>
                  <li style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ color: '#fff' }}>▸</span>
                    <span>Consider upskilling in missing technologies</span>
                  </li>
                  <li style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ color: '#fff' }}>▸</span>
                    <span>Focus on transferable skills</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Formatting Tips */}
            <div style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '20px'
            }}>
              <h4 style={{
                margin: '0 0 12px 0',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#fff',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📄 FORMATTING TIPS
              </h4>
              <ul style={{
                margin: '0',
                padding: '0',
                listStyle: 'none',
                color: '#ccc',
                fontSize: '0.85rem',
                lineHeight: '1.8'
              }}>
                <li style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ color: '#fff' }}>▸</span>
                  <span>Keep resume to 1-2 pages maximum</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ color: '#fff' }}>▸</span>
                  <span>Use clear section headers</span>
                </li>
                <li style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ color: '#fff' }}>▸</span>
                  <span>Choose readable fonts at 10-12pt</span>
                </li>
                <li style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: '#fff' }}>▸</span>
                  <span>Maintain consistent formatting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div style={{
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h4 style={{
            margin: '0 0 12px 0',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🎯 NEXT STEPS
          </h4>
          <ol style={{
            margin: '0',
            paddingLeft: '20px',
            fontSize: '0.85rem',
            lineHeight: '1.8',
            color: '#ccc'
          }}>
            <li style={{ marginBottom: '8px' }}>
              Tailor resume using <strong style={{ color: '#fff' }}>{detectedSkills.length}</strong> detected skills
            </li>
            <li style={{ marginBottom: '8px' }}>
              Incorporate <strong style={{ color: '#fff' }}>{detectedVerbs.length}</strong> action verbs into bullets
            </li>
            <li style={{ marginBottom: '8px' }}>Add quantifiable achievements</li>
            <li style={{ marginBottom: '8px' }}>Review for spelling and grammar</li>
            <li>Use <strong style={{ color: '#fff' }}>AI Detailed Review</strong> for in-depth analysis</li>
          </ol>
        </div>

      </div>
    );

    setIsAnalyzing(false);
  }, 250);
};




// ==================== AI ANALYSIS FUNCTION ====================

// const analyzeWithAI = async () => {
//   if (!jobDescription.trim()) {
//     alert("Paste job description first");
//     return;
//   }

//   setIsAIAnalysis(true);
//   setJobDescriptionInsights(<LoadingState />);

//   try {
//     const payload = {
//       jobDescription,
//       resume: buildResumeString()
//     };
//     const res = await fetch(`http://localhost:8080/analyze`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) throw new Error(`Status ${res.status}`);

//     const data = await res.json();
    
//     if (data.error) {
//       setJobDescriptionInsights(
//         <ErrorState
//           title="AI Analysis Failed"
//           message={data.error}
//         />
//       );
//     } else {
//       const aiResult = data.result;
      
//       setJobDescriptionInsights(
//         <div style={STYLES.container}>
//           {/* AI Analysis Header */}
//           <div style={STYLES.header}>
//             <h2 style={STYLES.headerTitle}>
//               🤖 AI Detailed Analysis
//             </h2>
//             <p style={STYLES.headerSubtitle}>
//               Powered by Advanced AI • Generated just now
//             </p>
//           </div>

//           {/* AI Response Content */}
//           <div>
//             {formatAIResponse(aiResult)}
//           </div>

//           {/* Action Footer */}
//           <div style={STYLES.cardLight}>
//             <h4 style={{
//               margin: '0 0 12px 0',
//               fontSize: '1rem',
//               fontWeight: '700',
//               color: COLORS.primary,
//               letterSpacing: '1px',
//               textTransform: 'uppercase'
//             }}>
//               💡 Next Steps
//             </h4>
//             <p style={{
//               margin: '0',
//               fontSize: '0.85rem',
//               color: COLORS.primary,
//               lineHeight: '1.8'
//             }}>
//               Review the AI suggestions above and update your resume accordingly. 
//               For a quick overview, try <strong>Quick Analysis</strong> to see keyword matches and skill breakdowns.
//             </p>
//           </div>
//         </div>
//       );
//     }
//   } catch (err) {
//     setJobDescriptionInsights(
//       <ErrorState
//         title="Connection Error"
//         message={"Perhaps no tokens left.."}
//         subtitle="Make sure your backend server is running on http://localhost:8080"
//       />
//     );
//   } finally {
//     setIsAIAnalysis(false);
//   }
// };

const formatAIResponse = (json) => {
  if (!json) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* SUMMARY SECTION */}
      <div style={{ 
        background: "#2a2a2a", 
        borderRadius: "8px", 
        border: "1px solid #3a3a3a",
        padding: "24px" 
      }}>
        <h4 style={{
          margin: "0 0 20px 0",
          fontSize: "1rem",
          fontWeight: "600",
          color: "#ffffff",
          letterSpacing: "0.5px",
          paddingBottom: "12px",
          borderBottom: "2px solid #3a3a3a"
        }}>📋 {json.summary.title}</h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {json.summary.points.map((p, i) => (
            <div key={i} style={{ 
              display: "flex", 
              gap: "12px", 
              lineHeight: "1.7", 
              color: "#d4d4d4", 
              fontSize: "0.9rem" 
            }}>
              <span style={{ 
                color: "#fbbf24", 
                fontWeight: "bold", 
                fontSize: "1.1rem", 
                marginTop: "2px" 
              }}>•</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STRENGTHS */}
      <div style={{ 
        background: "#2a2a2a", 
        borderRadius: "8px", 
        border: "1px solid #3a3a3a",
        padding: "24px" 
      }}>
        <h4 style={{
          margin: "0 0 20px 0",
          fontSize: "1rem",
          fontWeight: "600",
          color: "#ffffff",
          letterSpacing: "0.5px",
          paddingBottom: "12px",
          borderBottom: "2px solid #3a3a3a"
        }}>💼 Strengths</h4>

        {json.strengths.map((item, i) => (
          <div key={i} style={{
            background: "#1e1e1e",
            padding: "18px",
            borderRadius: "6px",
            marginBottom: "14px",
            borderLeft: "3px solid #fbbf24",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            fontSize: "0.88rem",
            color: "#e5e5e5"
          }}>
            <div><strong>Area:</strong> {item.area}</div>
            <div><strong>Strong:</strong> {item.strong}</div>
            <div><strong>Why It Matters:</strong> {item.why}</div>
          </div>
        ))}
      </div>

      {/* IMPROVEMENTS */}
      <div style={{ 
        background: "#2a2a2a", 
        borderRadius: "8px", 
        border: "1px solid #3a3a3a",
        padding: "24px" 
      }}>
        <h4 style={{
          margin: "0 0 20px 0",
          fontSize: "1rem",
          fontWeight: "600",
          color: "#ffffff",
          letterSpacing: "0.5px",
          paddingBottom: "12px",
          borderBottom: "2px solid #3a3a3a"
        }}>⚠️ Improvements</h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {json.improvements.map((item, i) => (
            <div key={i} style={{ 
              display: "flex", 
              gap: "12px", 
              lineHeight: "1.7", 
              color: "#d4d4d4", 
              fontSize: "0.9rem" 
            }}>
              <span style={{ 
                color: "#fbbf24", 
                fontWeight: "bold", 
                fontSize: "1.1rem", 
                marginTop: "2px" 
              }}>•</span>
              <span>
                <strong>{item.issue}:</strong> {item.suggestion}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* VERDICT */}
      <div style={{ 
        background: "#252525", 
        borderRadius: "8px", 
        padding: "24px", 
        border: "1px solid #3a3a3a" 
      }}>
        <h4 style={{
          margin: "0 0 20px 0",
          fontSize: "1rem",
          fontWeight: "600",
          color: "#ffffff",
          letterSpacing: "0.5px",
          paddingBottom: "12px",
          borderBottom: "2px solid #3a3a3a"
        }}>💡 Final Verdict</h4>
        <p style={{
          margin: "0",
          fontSize: "0.9rem",
          color: "#d4d4d4",
          lineHeight: "1.7"
        }}>{json.verdict}</p>
      </div>
    </div>
  );
};


const analyzeWithAI = async () => {
 
  setIsAIAnalysis(true);
 
  
  setJobDescriptionInsights(<LoadingState />);

  try {
    const payload = {
      jobDescription,
      resume: buildResumeString()
    };

    const res = await fetch(`http://localhost:8080/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Status ${res.status}`);

    const data = await res.json();

    if (data.error) {
      setJobDescriptionInsights(
        <ErrorState
          title="AI Analysis Failed"
          message={data.error}
        />
      );
      return;
    }

    const aiJson = data;

    setJobDescriptionInsights(
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        maxWidth: "900px",
        margin: "0 auto"
      }}>
        {/* Header */}
        <div style={{
          textAlign: "center",
          padding: "32px 24px",
          background: "#1a1a1a",
          borderRadius: "8px",
          color: "white",
          border: "1px solid #333"
        }}>
          <h2 style={{
            margin: "0 0 8px 0",
            fontSize: "1.8rem",
            fontWeight: "600",
            letterSpacing: "-0.5px"
          }}>
            🤖 AI Detailed Analysis
          </h2>
          <p style={{
            margin: "0",
            fontSize: "0.85rem",
            opacity: "0.7",
            fontWeight: "400"
          }}>
            Powered by Advanced AI • Generated just now
          </p>
        </div>

        {/* JSON rendered cleanly */}
        <div>
          {formatAIResponse(aiJson)}
        </div>

        {/* Next Steps */}
        <div style={{
          background: "#252525",
          borderRadius: "8px",
          padding: "24px",
          border: "1px solid #3a3a3a"
        }}>
          <h4 style={{
            margin: '0 0 12px 0',
            fontSize: '1rem',
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            💡 Next Steps
          </h4>

          <p style={{
            margin: '0',
            fontSize: '0.85rem',
            color: '#d4d4d4',
            lineHeight: '1.8'
          }}>
            Review the AI suggestions above and update your resume accordingly. 
            For a quick overview, try <strong>Quick Analysis</strong>.
          </p>
        </div>
      </div>
    );

  } catch (err) {
    setJobDescriptionInsights(
      <ErrorState
        title="Connection Error"
        message={err.message}
        subtitle="Make sure your backend is running on http://localhost:8080"
      />
    );
  } finally {
    setIsAIAnalysis(false);
  }
};

const buildATSPayload = () => {
  console.log("Building safe ATS payload");

  // Transform skills
  const transformedSkills = skills
    .map(skill => ({ name: skill.trim() }))
    .filter(skill => skill.name !== "");

  // Limit experiences and projects to first 3 each to avoid large payload
  const limitedExperiences = experiences
    .slice(0, 3)
    .map(exp => ({
      ...exp,
      achievements: exp.achievements?.slice(0, 5).map(a => a.trim()) || []
    }));

  const limitedProjects = projects
    .slice(0, 3)
    .map(proj => ({
      ...proj,
      description: proj.description?.slice(0, 5).map(d => d.trim()) || []
    }));

  // Limit details to necessary text fields only
  const safeDetails = {
    name: resumeDetails.name,
    title: resumeDetails.title,
    summary: resumeDetails.summary
  };

  return {
    details: safeDetails,
    skills: transformedSkills,
    experiences: limitedExperiences,
    projects: limitedProjects
  };
};


const createReport = async () => {
  try {
    setCreateComparisonReport(true);
    setReportOutput(<LoadingState />); // show loading UI

    const payload = {
      oldResume: currentLocalResume,
      newResume: newLocalResume,
    };

    console.log("Payload for report:", payload);

    const res = await fetch(`http://localhost:8080/create-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Backend Error:", res.status, text);
      setReportOutput(<ErrorState title="Report Generation Failed" message={`Backend responded with status ${res.status}: ${text}`} />);
      return;
    }

    const resData = await res.json();
    console.log("Comparison Result:", resData);

    if (resData.error) {
      setReportOutput(<ErrorState title="Report Generation Failed" message={resData.error} />);
      return;
    }

    // Use new format function
    const reportData = resData.result || resData;
    setReportOutput(
      <div style={STYLES.container}>
        <div style={STYLES.header}>
          <h2 style={STYLES.headerTitle}>📄 Resume Comparison Report</h2>
          <p style={STYLES.headerSubtitle}>Generated from your old vs new resume • Powered by AI</p>
        </div>

        <div>{formatComparisonReport(reportData)}</div>

        <div style={STYLES.cardLight}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: '700', color: COLORS.primary, letterSpacing: '1px', textTransform: 'uppercase' }}>
            💡 Next Steps
          </h4>
          <p style={{ margin: '0', fontSize: '0.85rem', color: COLORS.primary, lineHeight: '1.8' }}>
            Review the comparison highlights above and update your resume accordingly.
          </p>
        </div>
      </div>
    );

  } catch (err) {
    console.error("❌ Error calling create Report:", err);
    setReportOutput(<ErrorState title="Connection Error" message="Cannot reach backend. Make sure the server is running." />);
  } finally {
    setCreateComparisonReport(false);
  }
};



 const improveATSContent = async () => {
  console.log("ATS content method was called");

  try {

    setIsEnhancing(true);
    const payload = buildATSPayload();
    console.log("===setting up current resume");
    
    setCurrentLocalResume(payload);
    dispatch(setCurrentResume(payload));

    
   
    const res = await fetch(`http://localhost:8080/enhanceResume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.error("Backend error:", res.status, res.statusText);
      return;
    }
    const data = await res.json();
    console.log("Enhanced resume:", data);
    console.log("trying to set up gloabal payload on enhanced resune");
    dispatch(setEnhancedResume(data));
    setNewLocalResume(data);
    createReport();

  } catch (err) {
    console.error("❌ Error calling enhanceResume:", err);
  }
  finally{
    setIsEnhancing(false);
  }
};



  return (
    <div className="section-manager job-description-section">
      <h3>AI Analysis Section</h3>
      {/* <textarea
      
        className="job-description-textarea"
        placeholder="Paste job description or Ask questions Reguarding your resume, Press AI Analysis for AI review and Questions"
        value={jobDescription}
        onChange={e => setJobDescription(e.target.value)}
        rows={8}
       
      /> */

      <textarea
  className="job-description-textarea"
  placeholder="Paste job description or Ask questions Regarding your resume, Press AI Analysis for AI review and Questions"
  value={jobDescription}
  onChange={e => setJobDescription(e.target.value)}
  rows={8}
  style={{
    backgroundColor: '#1f1f1f',
    color: '#e0e0e0',
    border: '1px solid #3a3a3a',
    borderRadius: '8px',
    padding: '1rem',
    fontSize: '14px',
    lineHeight: '1.6',
    transition: 'all 0.2s ease'
  }}
  onFocus={(e) => {
    e.target.style.backgroundColor = '#252525';
    e.target.style.borderColor = '#4a4a4a';
    e.target.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.05)';
  }}
  onBlur={(e) => {
    e.target.style.backgroundColor = '#1f1f1f';
    e.target.style.borderColor = '#3a3a3a';
    e.target.style.boxShadow = 'none';
  }}
/>}


    <div style={{ 
  display: "flex", 
  flexWrap: "wrap",
  gap: "10px", 
  marginTop: "10px",
  width: "100%"
}}>

  {/* Quick Analysis Button */}
  <button 
    onClick={analyzeQuick} 
    disabled={isAnalyzing || isAIAnalysis || isEnhancing}
    style={{
      cursor: isAnalyzing || isAIAnalysis || isEnhancing ? 'not-allowed' : 'pointer',
      border: 'none',
      fontWeight: '600',
      borderRadius: '8px',
      fontSize: '14px',
      padding: '12px 28px',
      transition: 'all 0.2s ease',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      background: '#2a2a2a',
      color: '#ffffff',
      opacity: isAnalyzing || isAIAnalysis || isEnhancing ? 0.3 : 1,
      flex: '1 1 auto',
      minWidth: '180px'
    }}
    onMouseEnter={(e) => {
      if (!isAnalyzing && !isAIAnalysis && !isEnhancing) {
        e.target.style.background = '#333';
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
      }
    }}
    onMouseLeave={(e) => {
      e.target.style.background = '#2a2a2a';
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }}
    onMouseDown={(e) => {
      if (!isAnalyzing && !isAIAnalysis && !isEnhancing) {
        e.target.style.transform = 'translateY(0)';
      }
    }}
  >
    {isAnalyzing ? "Analyzing..." : "Quick Analysis"}
  </button>

  {/* AI Detailed Review Button */}
  <button 
    onClick={analyzeWithAI} 
    disabled={isAnalyzing || isAIAnalysis || isEnhancing}
    style={{
      cursor: isAnalyzing || isAIAnalysis || isEnhancing ? 'not-allowed' : 'pointer',
      border: 'none',
      fontWeight: '600',
      borderRadius: '8px',
      fontSize: '14px',
      padding: '12px 28px',
      transition: 'all 0.2s ease',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      background: '#2a2a2a',
      color: '#ffffff',
      opacity: isAnalyzing || isAIAnalysis || isEnhancing ? 0.3 : 1,
      flex: '1 1 auto',
      minWidth: '180px'
    }}
    onMouseEnter={(e) => {
      if (!isAnalyzing && !isAIAnalysis && !isEnhancing) {
        e.target.style.background = '#333';
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
      }
    }}
    onMouseLeave={(e) => {
      e.target.style.background = '#2a2a2a';
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }}
    onMouseDown={(e) => {
      if (!isAnalyzing && !isAIAnalysis && !isEnhancing) {
        e.target.style.transform = 'translateY(0)';
      }
    }}
  >
    {isAIAnalysis ? "Analyzing..." : "AI Detailed Review"}
  </button>

  {/* Enhance Your Resume Button */}
  <button 
    onClick={improveATSContent} 
    disabled={isAnalyzing || isAIAnalysis || isEnhancing}
    style={{
      cursor: isAnalyzing || isAIAnalysis || isEnhancing ? 'not-allowed' : 'pointer',
      border: 'none',
      fontWeight: '600',
      borderRadius: '8px',
      fontSize: '14px',
      padding: '12px 28px',
      transition: 'all 0.2s ease',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      background: '#2a2a2a',
      color: '#ffffff',
      opacity: isAnalyzing || isAIAnalysis || isEnhancing ? 0.3 : 1,
      flex: '1 1 auto',
      minWidth: '180px'
    }}
    onMouseEnter={(e) => {
      if (!isAnalyzing && !isAIAnalysis && !isEnhancing) {
        e.target.style.background = '#333';
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
      }
    }}
    onMouseLeave={(e) => {
      e.target.style.background = '#2a2a2a';
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }}
    onMouseDown={(e) => {
      if (!isAnalyzing && !isAIAnalysis && !isEnhancing) {
        e.target.style.transform = 'translateY(0)';
      }
    }}
  >
    {isEnhancing ? "Enhancing..." : "Enhance Your Resume"}
  </button>

  {/* Generate Report Button */}
  <button 
    onClick={createReport} 
    disabled={createComparisonReport}
    style={{
      cursor: createComparisonReport ? 'not-allowed' : 'pointer',
      border: 'none',
      fontWeight: '600',
      borderRadius: '8px',
      fontSize: '14px',
      padding: '12px 28px',
      transition: 'all 0.2s ease',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      background: '#2a2a2a',
      color: '#ffffff',
      opacity: createComparisonReport ? 0.3 : 1,
      flex: '1 1 auto',
      minWidth: '180px'
    }}
    onMouseEnter={(e) => {
      if (!createComparisonReport) {
        e.target.style.background = '#333';
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
      }
    }}
    onMouseLeave={(e) => {
      e.target.style.background = '#2a2a2a';
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }}
    onMouseDown={(e) => {
      if (!createComparisonReport) {
        e.target.style.transform = 'translateY(0)';
      }
    }}
  >
    {createComparisonReport ? "Generating..." : "Generate Report"}
  </button>

  

  {/* Clear Button */}
  <button
    onClick={() => {
      setJobDescription("");
      setJobDescriptionInsights("");
      setFoundSkills([]);
      setFoundVerbs([]);
    }}
    disabled={!jobDescription.trim()}
    style={{
      cursor: !jobDescription.trim() ? 'not-allowed' : 'pointer',
      border: 'none',
      fontWeight: '600',
      borderRadius: '8px',
      fontSize: '14px',
      padding: '12px 28px',
      transition: 'all 0.2s ease',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      background: '#2a2a2a',
      color: '#ffffff',
      opacity: !jobDescription.trim() ? 0.3 : 1,
      flex: '1 1 auto',
      minWidth: '180px'
    }}
    onMouseEnter={(e) => {
      if (jobDescription.trim()) {
        e.target.style.background = '#dc2626';
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.3)';
      }
    }}
    onMouseLeave={(e) => {
      e.target.style.background = '#2a2a2a';
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }}
    onMouseDown={(e) => {
      if (jobDescription.trim()) {
        e.target.style.transform = 'translateY(0)';
      }
    }}
  >
    Clear
  </button>
</div>

{jobDescriptionInsights && (
  <div style={{ marginTop: "20px" }}>
    <h4>{isAIAnalysis ? "🤖 AI Analysis" : "📊 Quick Analysis"}</h4>
    {jobDescriptionInsights}
  </div>
)}

{reportOutput && (
  <div style={{ marginTop: "20px" }}>
    <h4>{createComparisonReport ? "⏳ Generating Report..." : "📊 Resume Comparison"}</h4>
    {reportOutput}
  </div>
)}

      

      {jobDescriptionInsights && (
        <div style={{ marginTop: "20px" }}>
          <h4>{isAIAnalysis ? "🤖 AI Analysis" : "📊 Quick Analysis"}</h4>
          {jobDescriptionInsights}
        </div>
      )}

      {reportOutput && (
      <div style={{ marginTop: "20px" }}>
     <h4>{createComparisonReport ? "⏳ Generating Report..." : "📊 Resume Comparison"}</h4>
      {reportOutput}
     </div>
)}

    </div>
  );
}
