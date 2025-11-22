import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentResume, setEnhancedResume, setImportedResume } from "../../redux/store";
import "./css-files/analyze.css";
import LoadingAnimation from "../../components/PopUp/LoadingAnimation";
// import "./css-files/analysis-output.css"; // Import the new CSS file

const API_BASE_URL2 = 'http://localhost:8080';
// const API_BASE_URL = 'https://resumemaker-1.onrender.com';
const API_BASE_URL = 'http://localhost:8080';

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
  const [jobDescriptionInsights, setJobDescriptionInsights] = useState("");
  const [createComparisonReport, setCreateComparisonReport] = useState("false");
  const enhancedResume = useSelector((state) => state.resume.enhancedResume);
  const currentResume = useSelector((state) => state.resume.currentResume);
 



  

  const [currentLocalResume, setCurrentLocalResume] = useState(null);
  const [newLocalResume, setNewLocalResume] = useState(null);
  const [reportOutput, setReportOutput] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();

  const canGenerateReport = currentResume && enhancedResume;
  const isDisabled = !canGenerateReport || createComparisonReport;
  const isJDPresent = jobDescription.trim().length > 0;
  const disableQuick = !isJDPresent || isAnalyzing || isAIAnalysis || isEnhancing;
  const disableAIDetailed = !isJDPresent || isAnalyzing || isAIAnalysis || isEnhancing;

  useEffect(() => {
    if (currentLocalResume) {
      console.log("Current resume updated locally:", currentLocalResume);
    }
  }, [currentLocalResume]);

  useEffect(() => {
    if (currentResume) {
      console.log("Current resume updated globally:", currentResume);
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




  const buildResumePayload = () => {
  return {
    details: {
      name: resumeDetails?.name || "",
      title: resumeDetails?.title || "",
      summary: resumeDetails?.summary || ""
    },
    skills: skills || [],
    experiences: experiences || [],
    projects: projects || [],
    educationList: educationList || [],
    certifications: certifications || [],
  
  };
};


  // ==================== UTILITY COMPONENTS ====================

  const StatCard = ({ label, value, accent = false }) => (
    <div className={`stat-card ${accent ? 'stat-card-accent' : ''}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );

  const SkillCategory = ({ title, skills, count }) => (
    <div className="skill-category-card">
      <div className="skill-category-title">
        {title} · {count}
      </div>
      <div className="skills-badge-container">
        {skills.map(skill => (
          <span key={skill} className="skill-badge">
            {skill.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );

  const LoadingState = () => (
    <div className="analysis-container">
      <div className="loading-state">
        <div className="loading-card">
          <p className="loading-title">🤖 AI Analyzing</p>
          <p className="loading-subtitle">This may take a few moments</p>
        </div>
      </div>
    </div>
  );

  const ErrorState = ({ title, message, subtitle }) => (
    <div className="analysis-container">
      <div className="error-card">
        <h4 className="error-title">❌ {title}</h4>
        <p className="error-message">{message}</p>
        {subtitle && <p className="error-subtitle">{subtitle}</p>}
      </div>
    </div>
  );

  const formatAIResponse = (json) => {
    if (!json) return null;

    return (
      <div className="ai-response-container">
        {/* SUMMARY SECTION */}
        <div className="ai-section-card">
          <h4 className="ai-section-title">📋 {json.summary.title}</h4>
          <div>
            {json.summary.points.map((p, i) => (
              <div key={i} className="ai-point-item">
                <span className="ai-bullet">•</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* STRENGTHS */}
        <div className="ai-section-card">
          <h4 className="ai-section-title">💼 Strengths</h4>
          {json.strengths.map((item, i) => (
            <div key={i} className="ai-detail-item">
              <div><span className="ai-detail-label">Area:</span> {item.area}</div>
              <div><span className="ai-detail-label">Strong:</span> {item.strong}</div>
              <div><span className="ai-detail-label">Why It Matters:</span> {item.why}</div>
            </div>
          ))}
        </div>

        {/* IMPROVEMENTS */}
        <div className="ai-section-card">
          <h4 className="ai-section-title">⚠️ Improvements</h4>
          <div>
            {json.improvements.map((item, i) => (
              <div key={i} className="ai-point-item">
                <span className="ai-bullet">•</span>
                <span>
                  <span className="ai-detail-label">{item.issue}:</span> {item.suggestion}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* VERDICT */}
        <div className="ai-section-card">
          <h4 className="ai-section-title">💡 Final Verdict</h4>
          <p className="version-content">{json.verdict}</p>
        </div>
      </div>
    );
  };

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object' && value[0].name) {
        return (
          <div>
            {value.map((project, i) => (
              <div key={i} className="project-card">
                <div className="project-name">{project.name}</div>
                {project.duration && (
                  <div className="project-duration">{project.duration}</div>
                )}
                {project.technologies && (
                  <div className="project-tech">{project.technologies}</div>
                )}
                {project.description && Array.isArray(project.description) && (
                  <ul className="project-description-list">
                    {project.description.map((desc, j) => (
                      <li key={j}>{desc}</li>
                    ))}
                  </ul>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                    🔗 {project.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        );
      }
      
      return (
        <ul className="project-description-list">
          {value.map((item, i) => (
            <li key={i}>{typeof item === 'object' ? JSON.stringify(item) : item}</li>
          ))}
        </ul>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return <pre className="version-content">{JSON.stringify(value, null, 2)}</pre>;
    }
    
    return <span className="version-content">{String(value)}</span>;
  };

  const formatComparisonReport = (report) => {
   
    if (!report?.differences) return <p>No comparison found.</p>;

    return (
      <div>
        {Object.entries(report.differences).map(([section, data], idx) => {
          const icon = section.includes("summary") ? "📋"
            : section.includes("skills") ? "🧩"
            : section.includes("project") ? "🛠️"
            : section.includes("experience") ? "⚡"
            : "📄";

          return (
            <div key={idx} className="comparison-section">
              <h4 className="comparison-header">
                {icon} {section.replace(/_/g, " ").toUpperCase()}
              </h4>

              {/* Old Version */}
              <div className="comparison-version-card old">
                <div className="version-label old">Old Version</div>
                <div className="version-content">{formatValue(data.old)}</div>
              </div>

              {/* New Version */}
              <div className="comparison-version-card new">
                <div className="version-label new">New Version</div>
                <div className="version-content">{formatValue(data.new)}</div>
              </div>

              {/* Changes Detected */}
              {Array.isArray(data.changes) && data.changes.length > 0 && (
                <div className="changes-detected-card">
                  <div className="changes-label">Changes Detected</div>
                  <div>
                    {data.changes.map((c, i) => (
                      <div key={i} className="ai-point-item">
                        <span className="ai-bullet">•</span>
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
    setLoading(true);
    setMessage('Analyzing Resume...')
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    setIsAIAnalysis(false);

    const text = jobDescription.toLowerCase();
    const detectedSkills = techSkills.filter(skill => text.includes(skill));
    const detectedVerbs = actionVerbs.filter(verb => text.includes(verb));
    const matchRate = Math.round((detectedSkills.length / techSkills.length) * 100);

    const experienceMatch = jobDescription.match(/(\d+)\+?\s*(year|yr)/i);
    const experienceRequired = experienceMatch ? experienceMatch[1] : 'N/A';

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
        <div className="analysis-output-wrapper">
          <div className="analysis-container">
            
            {/* Header */}
            <div className="analysis-header">
              <h2 className="analysis-header-title">Result of Quick Analysis</h2>
              <p className="analysis-header-subtitle">Instant keyword detection and match scoring</p>
            </div>

            {/* Overview Cards */}
            <div className="stats-grid-2">
              <StatCard label="Match Rate" value={`${matchRate}%`} accent />
              <StatCard label="Skills Found" value={detectedSkills.length} />
              <StatCard label="Action Verbs" value={detectedVerbs.length} />
              <StatCard label="Experience" value={`${experienceRequired}y`} />
            </div>

            {/* Skills Section */}
            <div className="analysis-section">
              <h3 className="section-header">🎯 SKILLS DETECTED</h3>
              
              {detectedSkills.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-state-text">No technical skills detected in job description</p>
                </div>
              ) : (
                <div className="skills-grid">
                  {frontendSkills.length > 0 && (
                    <SkillCategory title="Frontend" skills={frontendSkills} count={frontendSkills.length} />
                  )}
                  {backendSkills.length > 0 && (
                    <SkillCategory title="Backend" skills={backendSkills} count={backendSkills.length} />
                  )}
                  {databaseSkills.length > 0 && (
                    <SkillCategory title="Database" skills={databaseSkills} count={databaseSkills.length} />
                  )}
                  {cloudSkills.length > 0 && (
                    <SkillCategory title="Cloud & DevOps" skills={cloudSkills} count={cloudSkills.length} />
                  )}
                </div>
              )}
            </div>

            {/* Action Verbs */}
            <div className="analysis-section">
              <h3 className="section-header">⚡ ACTION VERBS · {detectedVerbs.length}</h3>
              
              {detectedVerbs.length > 0 ? (
                <div className="action-verbs-container">
                  <div className="action-verbs-grid">
                    {detectedVerbs.map(verb => (
                      <div key={verb} className="action-verb-item">{verb}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <p className="empty-state-text">No action verbs detected in job description</p>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="analysis-section">
              <h3 className="section-header">💡 RECOMMENDATIONS</h3>

              <div>
                <div className="recommendation-card">
                  <h4 className="recommendation-title">⚡ ATS OPTIMIZATION</h4>
                  <ul className="recommendation-list">
                    <li className="recommendation-list-item">
                      <span className="recommendation-bullet">▸</span>
                      <span>Include all {detectedSkills.length} detected skills prominently</span>
                    </li>
                    <li className="recommendation-list-item">
                      <span className="recommendation-bullet">▸</span>
                      <span>Use exact keyword matches (not synonyms)</span>
                    </li>
                    <li className="recommendation-list-item">
                      <span className="recommendation-bullet">▸</span>
                      <span>Avoid complex formatting that ATS can't parse</span>
                    </li>
                    <li className="recommendation-list-item">
                      <span className="recommendation-bullet">▸</span>
                      <span>Save as .docx or PDF with selectable text</span>
                    </li>
                  </ul>
                </div>

                <div className="recommendation-card">
                  <h4 className="recommendation-title">✍️ CONTENT STRATEGY</h4>
                  <ul className="recommendation-list">
                    <li className="recommendation-list-item">
                      <span className="recommendation-bullet">▸</span>
                      <span>Start bullet points with action verbs</span>
                    </li>
                    <li className="recommendation-list-item">
                      <span className="recommendation-bullet">▸</span>
                      <span>Quantify achievements with metrics</span>
                    </li>
                    <li className="recommendation-list-item">
                      <span className="recommendation-bullet">▸</span>
                      <span>Mirror job description terminology</span>
                    </li>
                    <li className="recommendation-list-item">
                      <span className="recommendation-bullet">▸</span>
                      <span>Highlight relevant experience prominently</span>
                    </li>
                  </ul>
                </div>

                {matchRate < 70 && (
                  <div className="recommendation-card">
                    <h4 className="recommendation-title">⚠️ SKILLS GAP ALERT</h4>
                    <ul className="recommendation-list">
                      <li className="recommendation-list-item">
                        <span className="recommendation-bullet">▸</span>
                        <span>Match rate is {matchRate}% - aim for 70%+</span>
                      </li>
                      <li className="recommendation-list-item">
                        <span className="recommendation-bullet">▸</span>
                        <span>Review job description for additional skills</span>
                      </li>
                      <li className="recommendation-list-item">
                        <span className="recommendation-bullet">▸</span>
                        <span>Consider upskilling in missing technologies</span>
                      </li>
                      <li className="recommendation-list-item">
                        <span className="recommendation-bullet">▸</span>
                        <span>Focus on transferable skills</span>
                      </li>
                    </ul>
                  </div>
                )}

                <div className="recommendation-card">
                  <h4 className="recommendation-title">📄 FORMATTING TIPS</h4>
                  <ul className="recommendation-list">
                    <li className="recommendation-list-item">
                      <span className="recommendation-bullet">▸</span>
                      <span>Keep resume to 1-2 pages maximum</span>
                    </li>
                    <li className="recommendation-list-item">
                      <span className="recommendation-bullet">▸</span>
                      <span>Use clear section headers</span>
                    </li>
                    <li className="recommendation-list-item">
                      <span className="recommendation-bullet">▸</span>
                      <span>Choose readable fonts at 10-12pt</span>
                    </li>
                    <li className="recommendation-list-item">
                      <span className="recommendation-bullet">▸</span>
                      <span>Maintain consistent formatting</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="next-steps-card">
              <h4 className="next-steps-title">🎯 NEXT STEPS</h4>
              <ol className="next-steps-list">
                <li>Tailor resume using <strong>{detectedSkills.length}</strong> detected skills</li>
                <li>Incorporate <strong>{detectedVerbs.length}</strong> action verbs into bullets</li>
                <li>Add quantifiable achievements</li>
                <li>Review for spelling and grammar</li>
                <li>Use <strong>AI Detailed Review</strong> for in-depth analysis</li>
              </ol>
            </div>

          </div>
        </div>
      );

      setIsAnalyzing(false);
      setLoading(false);
    }, 250);
  };

  const analyzeWithAI = async () => {
    setIsAIAnalysis(true);
    setLoading(true);
    setMessage('AI Analysis...')
    setJobDescriptionInsights(<LoadingState />);

    try {
      const payload = {
        jobDescription,
        resume: buildResumeString()
      };

      const res = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);

      const data = await res.json();

      if (data.error) {
        setJobDescriptionInsights(
          <ErrorState title="AI Analysis Failed" message={data.error} />
        );
        return;
      }

      const aiJson = data;

      setJobDescriptionInsights(
        <div className="analysis-output-wrapper">
          <div className="ai-response-container">
            {/* Header */}
            <div className="ai-response-header">
              <h2 className="ai-response-header-title">🤖 AI Detailed Analysis</h2>
              <p className="ai-response-header-subtitle">Powered by Advanced AI • Generated just now</p>
            </div>

            {/* JSON rendered cleanly */}
            <div>{formatAIResponse(aiJson)}</div>

            {/* Next Steps */}
            <div className="next-steps-card">
              <h4 className="next-steps-title">💡 Next Steps</h4>
              <p className="next-steps-content">
                Review the AI suggestions above and update your resume accordingly. 
                For a quick overview, try <strong>Quick Analysis</strong>.
              </p>
            </div>
          </div>
        </div>
      );

    } catch (err) {
      setJobDescriptionInsights(
        <ErrorState
          title="Connection Error"
          message={err.message}
          subtitle="Make sure your backend is running on API_BASE_URL"
        />
      );
    } finally {
      setIsAIAnalysis(false);
      setLoading(false);
    }
  };

  const buildATSPayload = () => {
    const transformedSkills = skills
      .map(skill => ({ name: skill.trim() }))
      .filter(skill => skill.name !== "");

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
      setReportOutput(<LoadingState />);
      setLoading(true);
      setMessage('Creating Report...')

      const payload = {
        oldResume: currentLocalResume,
        newResume: newLocalResume,
      };

      const res = await fetch(`${API_BASE_URL}/create-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        setReportOutput(<ErrorState title="Report Generation Failed" message={`Backend responded with status ${res.status}: ${text}`} />);
        return;
      }

      const resData = await res.json();

      if (resData.error) {
        setReportOutput(<ErrorState title="Report Generation Failed" message={resData.error} />);
        return;
      }

      const reportData = resData.result || resData;
      setReportOutput(
        <div className="analysis-output-wrapper">
          <div className="analysis-container">
            <div className="analysis-header">
              <h2 className="analysis-header-title">📄 Resume Comparison Report</h2>
              <p className="analysis-header-subtitle">Generated from your old vs new resume • Powered by AI</p>
            </div>

            <div>{formatComparisonReport(reportData)}</div>

            <div className="next-steps-card light">
              <h4 className="next-steps-title">💡 Next Steps</h4>
              <p className="next-steps-content">
                Review the comparison highlights above and update your resume accordingly.
              </p>
            </div>
          </div>
        </div>
      );

    } catch (err) {
      setReportOutput(<ErrorState title="Connection Error" message="Cannot reach backend. Make sure the server is running." />);
    } finally {
      setCreateComparisonReport(false);
      setLoading(false);
    }
  };

  const improveATSContent = async () => {
    try {
      setIsEnhancing(true);
      setLoading(true);
      setMessage('Enhancing your Resume...')
      const payload = buildATSPayload();
      
      setCurrentLocalResume(payload);
      


      const res = await fetch(`${API_BASE_URL}/enhanceResume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        console.error("Backend error:", res.status, res.statusText);
        return;
      }
      
      const data = await res.json();
      downloadResponse(data);
      dispatch(setEnhancedResume(data));
     
      setNewLocalResume(data);
    } catch (err) {
      console.error("❌ Error calling enhanceResume:", err);
    } finally {
      setIsEnhancing(false);
      setLoading(false);
      
    }
  };

  const importResume = async (e) => {
  setLoading(true);
  setMessage('Importing...');
  const file = e.target.files[0];
  if (!file) return;

  if (file.type !== "application/pdf") {
    alert("Please upload a PDF file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE_URL2}/uploadResume`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    const resumeJsonString = data.choices?.[0]?.message?.content?.trim();

    if (resumeJsonString) {
      try {
        const resumeData = JSON.parse(resumeJsonString);
        dispatch(setImportedResume(resumeData));
      } catch (err) {
        console.error("Failed to parse AI resume JSON:", err, resumeJsonString);
      }
    } else {
      console.error("No content found in AI response", data);
    }

    console.log("Upload successful:", data);
  } catch (error) {
    console.error("Upload failed:", error);
  } finally {
    e.target.value = '';  // <-- reset input so same file can be uploaded again
    setLoading(false);
    setMessage('');
  }
};



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


  return (
    <div className="ai-analysis-container">
      <LoadingAnimation message={message} show={loading}/>
      <h3 className="ai-analysis-title">🔗AI Analysis Section</h3>

      <textarea
        className="job-description-textarea"
        placeholder={`Type "Analyze" for general resume feedback.
Paste a Job Description for Quick Analysis or AI Analysis.
Press "Enhance Resume" to improve your resume.
Generate a Report to compare original vs enhanced resume.`}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <div className="ai-buttons-container">
        <button
          className={`ai-button quick-analysis ${disableQuick ? "disabled" : ""}`}
          onClick={analyzeQuick}
        >
          {isAnalyzing ? "Analyzing..." : "Quick Analysis"}
        </button>

        <button
          className={`ai-button detailed-analysis ${disableAIDetailed ? "disabled" : ""}`}
          onClick={analyzeWithAI}
        >
          {isAIAnalysis ? "Analyzing..." : "AI Detailed Review"}
        </button>

        <button
          className={`ai-button enhance-resume ${
            isAnalyzing || isAIAnalysis || isEnhancing ? "disabled" : ""
          }`}
          onClick={improveATSContent}
        >
          {isEnhancing ? "Enhancing..." : "Enhance Your Resume"}
        </button>

        <button
          className={`ai-button generate-report ${isDisabled ? "disabled" : ""}`}
          onClick={createReport}
        >
          {canGenerateReport ? "Generate Report" : "Enhance Resume for Report"}
        </button>
        
         
         <label className="ai-button">
            Import PDF Resume
            <input
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={importResume} 
            />
         </label>

       

        <button
          className={`ai-button clear-button ${!jobDescription.trim() ? "disabled" : ""}`}
          onClick={() => {
            setJobDescription("");
            setJobDescriptionInsights("");
            setFoundSkills([]);
            setFoundVerbs([]);
            setCreateComparisonReport([]);
            setReportOutput([]);
          }}
        >
          Clear
        </button>
      </div>

      {jobDescriptionInsights && (
        <div className="ai-analysis-output">
          <h4 className="ai-output-title">
            {isAIAnalysis ? "🤖 AI Analysis" : "📊 Quick Analysis"}
          </h4>
          {jobDescriptionInsights}
        </div>
      )}

      {reportOutput && (
        <div className="ai-analysis-output">
          <h4 className="ai-output-title">
            {createComparisonReport ? "⏳ Generating Report..." : "📊 Resume Comparison"}
          </h4>
          {reportOutput}
        </div>
      )}
    </div>
  );
}