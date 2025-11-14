import React, { useState } from "react";

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
  const [foundSkills, setFoundSkills] = useState([]);
  const [foundVerbs, setFoundVerbs] = useState([]);
  const [jobDescriptionInsights, setJobDescriptionInsights] = useState("");

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
  const frontendSkills = detectedSkills.filter(s => ['react', 'vue', 'angular', 'html', 'css', 'javascript', 'typescript'].includes(s));
  const backendSkills = detectedSkills.filter(s => ['node', 'python', 'java', 'spring', 'django', 'flask'].includes(s));
  const databaseSkills = detectedSkills.filter(s => ['mongodb', 'postgresql', 'mysql', 'redis'].includes(s));
  const cloudSkills = detectedSkills.filter(s => ['aws', 'azure', 'docker', 'kubernetes'].includes(s));

  setTimeout(() => {
    setFoundSkills(detectedSkills);
    setFoundVerbs(detectedVerbs);

    setJobDescriptionInsights(
      <div style={{ 
        backgroundColor: '#201f1fff',
        color: '#ffffff',
        padding: '24px',
        borderRadius: '0px',
        minHeight: '500px'
      }}>
        
        {/* Header */}
        <div style={{ 
          marginBottom: '32px',
          paddingBottom: '20px',
          borderBottom: '2px solid #ffffff'
        }}>
          <h2 style={{ 
            margin: '0 0 8px 0',
            fontSize: '1.0rem',
            fontWeight: '500',
            color: '#ffffff',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            📊 Quick Analysis
          </h2>
          <p style={{ 
            margin: '0',
            fontSize: '0.85rem',
            color: '#aaaaaa',
            letterSpacing: '0.5px'
          }}>
            Instant keyword detection and match scoring
          </p>
        </div>

        {/* Overview Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '16px',
          marginBottom: '40px'
        }}>
          <div style={{ 
            border: '2px solid #ffffff',
            padding: '20px',
            borderRadius: '0px',
            backgroundColor: '#7c7575ff',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '0.7rem', 
              color: '#aaaaaa', 
              marginBottom: '8px', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              fontWeight: '600'
            }}>
              Match Rate
            </div>
            <div style={{ 
              fontSize: '1.2rem', 
              fontWeight: '800', 
              color: '#ffffff',
              letterSpacing: '-1px'
            }}>
              {matchRate}%
            </div>
          </div>
          
          <div style={{ 
            border: '2px solid #ffffff',
            padding: '20px',
            borderRadius: '0px',
            backgroundColor: '#000000',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '0.7rem', 
              color: '#aaaaaa', 
              marginBottom: '8px', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              fontWeight: '600'
            }}>
              Skills Found
            </div>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: '900', 
              color: '#ffffff',
              letterSpacing: '-1px'
            }}>
              {detectedSkills.length}
            </div>
          </div>
          
          <div style={{ 
            border: '2px solid #ffffff',
            padding: '20px',
            borderRadius: '0px',
            backgroundColor: '#000000',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '0.7rem', 
              color: '#aaaaaa', 
              marginBottom: '8px', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              fontWeight: '600'
            }}>
              Action Verbs
            </div>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: '900', 
              color: '#ffffff',
              letterSpacing: '-1px'
            }}>
              {detectedVerbs.length}
            </div>
          </div>
          
          <div style={{ 
            border: '2px solid #ffffff',
            padding: '20px',
            borderRadius: '0px',
            backgroundColor: '#000000',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '0.7rem', 
              color: '#aaaaaa', 
              marginBottom: '8px', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              fontWeight: '600'
            }}>
              Experience
            </div>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: '900', 
              color: '#ffffff',
              letterSpacing: '-1px'
            }}>
              {experienceRequired}y
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            fontWeight: '700', 
            color: '#ffffff', 
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderBottom: '2px solid #ffffff',
            paddingBottom: '12px'
          }}>
            Skills Detected
          </h3>
          
          {detectedSkills.length === 0 ? (
            <div style={{ 
              padding: '24px',
              border: '2px solid #ffffff',
              backgroundColor: '#000000',
              textAlign: 'center'
            }}>
              <p style={{ 
                margin: '0',
                fontSize: '0.95rem', 
                color: '#aaaaaa',
                letterSpacing: '0.5px'
              }}>
                No technical skills detected in job description
              </p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px'
            }}>
              {frontendSkills.length > 0 && (
                <div style={{ 
                  border: '2px solid #ffffff',
                  padding: '20px',
                  backgroundColor: '#000000'
                }}>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: '700', 
                    color: '#ffffff', 
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Frontend · {frontendSkills.length}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {frontendSkills.map(skill => (
                      <span key={skill} style={{
                        padding: '6px 12px',
                        border: '2px solid #ffffff',
                        backgroundColor: '#000000',
                        fontSize: '0.75rem',
                        color: '#ffffff',
                        fontWeight: '600',
                        letterSpacing: '0.5px'
                      }}>
                        {skill.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {backendSkills.length > 0 && (
                <div style={{ 
                  border: '2px solid #ffffff',
                  padding: '20px',
                  backgroundColor: '#000000'
                }}>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: '700', 
                    color: '#ffffff', 
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Backend · {backendSkills.length}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {backendSkills.map(skill => (
                      <span key={skill} style={{
                        padding: '6px 12px',
                        border: '2px solid #ffffff',
                        backgroundColor: '#000000',
                        fontSize: '0.75rem',
                        color: '#ffffff',
                        fontWeight: '600',
                        letterSpacing: '0.5px'
                      }}>
                        {skill.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {databaseSkills.length > 0 && (
                <div style={{ 
                  border: '2px solid #ffffff',
                  padding: '20px',
                  backgroundColor: '#000000'
                }}>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: '700', 
                    color: '#ffffff', 
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Database · {databaseSkills.length}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {databaseSkills.map(skill => (
                      <span key={skill} style={{
                        padding: '6px 12px',
                        border: '2px solid #ffffff',
                        backgroundColor: '#000000',
                        fontSize: '0.75rem',
                        color: '#ffffff',
                        fontWeight: '600',
                        letterSpacing: '0.5px'
                      }}>
                        {skill.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {cloudSkills.length > 0 && (
                <div style={{ 
                  border: '2px solid #ffffff',
                  padding: '20px',
                  backgroundColor: '#000000'
                }}>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: '700', 
                    color: '#ffffff', 
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Cloud & DevOps · {cloudSkills.length}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {cloudSkills.map(skill => (
                      <span key={skill} style={{
                        padding: '6px 12px',
                        border: '2px solid #ffffff',
                        backgroundColor: '#000000',
                        fontSize: '0.75rem',
                        color: '#ffffff',
                        fontWeight: '600',
                        letterSpacing: '0.5px'
                      }}>
                        {skill.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Verbs */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            fontWeight: '700', 
            color: '#ffffff', 
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderBottom: '2px solid #ffffff',
            paddingBottom: '12px'
          }}>
            Action Verbs · {detectedVerbs.length}
          </h3>
          
          {detectedVerbs.length > 0 ? (
            <div style={{ 
              border: '2px solid #ffffff',
              padding: '20px',
              backgroundColor: '#000000'
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                gap: '10px'
              }}>
                {detectedVerbs.map(verb => (
                  <div key={verb} style={{
                    padding: '10px',
                    border: '2px solid #ffffff',
                    backgroundColor: '#000000',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    color: '#ffffff',
                    fontWeight: '600',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    {verb}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ 
              padding: '24px',
              border: '2px solid #ffffff',
              backgroundColor: '#000000',
              textAlign: 'center'
            }}>
              <p style={{ 
                margin: '0',
                fontSize: '0.95rem', 
                color: '#aaaaaa',
                letterSpacing: '0.5px'
              }}>
                No action verbs detected in job description
              </p>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            fontWeight: '700', 
            color: '#ffffff', 
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderBottom: '2px solid #ffffff',
            paddingBottom: '12px'
          }}>
            Recommendations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* ATS Optimization */}
            <div style={{ 
              border: '2px solid #ffffff',
              padding: '20px',
              backgroundColor: '#272727ff'
            }}>
              <div style={{ 
                fontWeight: '700', 
                marginBottom: '12px', 
                fontSize: '0.9rem', 
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                ⚡ ATS Optimization
              </div>
              <ul style={{ 
                margin: '0', 
                paddingLeft: '20px', 
                fontSize: '0.85rem', 
                lineHeight: '1.9', 
                color: '#cccccc'
              }}>
                <li>Include all {detectedSkills.length} detected skills prominently</li>
                <li>Use exact keyword matches (not synonyms)</li>
                <li>Avoid complex formatting that ATS can't parse</li>
                <li>Save as .docx or PDF with selectable text</li>
              </ul>
            </div>

            {/* Content Strategy */}
            <div style={{ 
              border: '2px solid #ffffff',
              padding: '20px',
              backgroundColor: '#000000'
            }}>
              <div style={{ 
                fontWeight: '700', 
                marginBottom: '12px', 
                fontSize: '0.9rem', 
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                ✍️ Content Strategy
              </div>
              <ul style={{ 
                margin: '0', 
                paddingLeft: '20px', 
                fontSize: '0.85rem', 
                lineHeight: '1.9', 
                color: '#cccccc'
              }}>
                <li>Start bullet points with action verbs</li>
                <li>Quantify achievements with metrics</li>
                <li>Mirror job description terminology</li>
                <li>Highlight relevant experience prominently</li>
              </ul>
            </div>

            {/* Skills Gap Alert */}
            {matchRate < 70 && (
              <div style={{ 
                border: '2px solid #ffffff',
                padding: '20px',
                backgroundColor: '#000000'
              }}>
                <div style={{ 
                  fontWeight: '700', 
                  marginBottom: '12px', 
                  fontSize: '0.9rem', 
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  ⚠️ Skills Gap Alert
                </div>
                <ul style={{ 
                  margin: '0', 
                  paddingLeft: '20px', 
                  fontSize: '0.85rem', 
                  lineHeight: '1.9', 
                  color: '#cccccc'
                }}>
                  <li>Match rate is {matchRate}% - aim for 70%+</li>
                  <li>Review job description for additional skills</li>
                  <li>Consider upskilling in missing technologies</li>
                  <li>Focus on transferable skills</li>
                </ul>
              </div>
            )}

            {/* Format Tips */}
            <div style={{ 
              border: '2px solid #ffffff',
              padding: '20px',
              backgroundColor: '#000000'
            }}>
              <div style={{ 
                fontWeight: '700', 
                marginBottom: '12px', 
                fontSize: '0.9rem', 
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                📄 Formatting Tips
              </div>
              <ul style={{ 
                margin: '0', 
                paddingLeft: '20px', 
                fontSize: '0.85rem', 
                lineHeight: '1.9', 
                color: '#cccccc'
              }}>
                <li>Keep resume to 1-2 pages maximum</li>
                <li>Use clear section headers</li>
                <li>Choose readable fonts at 10-12pt</li>
                <li>Maintain consistent formatting</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div style={{ 
          padding: '24px', 
          backgroundColor: '#ffffff',
          border: '2px solid #ffffff',
          color: '#000000'
        }}>
          <h4 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '1rem', 
            fontWeight: '700',
            color: '#000000',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Next Steps
          </h4>
          <ol style={{ 
            margin: '0', 
            paddingLeft: '20px', 
            fontSize: '0.85rem', 
            lineHeight: '2', 
            color: '#000000'
          }}>
            <li>Tailor resume using {detectedSkills.length} detected skills</li>
            <li>Incorporate {detectedVerbs.length} action verbs into bullets</li>
            <li>Add quantifiable achievements</li>
            <li>Review for spelling and grammar</li>
            <li>Use <strong>AI Detailed Review</strong> for in-depth analysis</li>
          </ol>
        </div>

      </div>
    );

    setIsAnalyzing(false);
  }, 250);
};


// Helper function to parse and format AI response
const formatAIResponse = (text) => {
  const sections = text.split(/##\s+/);
  
  return sections.map((section, idx) => {
    if (!section.trim()) return null;
    
    const lines = section.split('\n');
    const title = lines[0].replace(/\*\*/g, '').trim();
    const content = lines.slice(1).join('\n').trim();
    
    let icon = '📋';
    if (title.toLowerCase().includes('requirements')) icon = '⚙️';
    else if (title.toLowerCase().includes('experience') || title.toLowerCase().includes('skills')) icon = '💼';
    else if (title.toLowerCase().includes('gap') || title.toLowerCase().includes('missing')) icon = '⚠️';
    else if (title.toLowerCase().includes('strong') || title.toLowerCase().includes('match')) icon = '✅';
    else if (title.toLowerCase().includes('recommendation') || title.toLowerCase().includes('suggest')) icon = '💡';
    
    return (
      <div key={idx} style={{ 
        marginBottom: '20px',
        border: '2px solid #ffffff',
        padding: '24px',
        backgroundColor: '#000000'
      }}>
        <h4 style={{ 
          margin: '0 0 16px 0',
          fontSize: '1rem',
          fontWeight: '700',
          color: '#ffffff',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          {icon} {title}
        </h4>
        <div style={{ 
          fontSize: '0.9rem',
          lineHeight: '2',
          color: '#cccccc'
        }}>
          {content.split('\n').map((line, i) => {
            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
              const text = line.replace(/^[-*]\s+/, '').replace(/\*\*/g, '');
              return (
                <div key={i} style={{ 
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '12px',
                  paddingLeft: '0px'
                }}>
                  <span style={{ color: '#ffffff', flexShrink: 0, fontWeight: '900' }}>•</span>
                  <span>{text}</span>
                </div>
              );
            }
            if (line.includes('**')) {
              const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #ffffff; font-weight: 700;">$1</strong>');
              return <div key={i} dangerouslySetInnerHTML={{ __html: formatted }} style={{ marginBottom: '10px' }} />;
            }
            return line.trim() ? <div key={i} style={{ marginBottom: '10px' }}>{line}</div> : null;
          })}
        </div>
      </div>
    );
  }).filter(Boolean);
};

// AI Analysis
const analyzeWithAI = async () => {
  if (!jobDescription.trim()) {
    alert("Paste job description first");
    return;
  }

  setIsAIAnalysis(true);
  setJobDescriptionInsights(
    <div style={{ 
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '24px',
      textAlign: 'center',
      minHeight: '300px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        padding: '32px',
        border: '2px solid #ffffff',
        backgroundColor: '#000000'
      }}>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#ffffff', 
          margin: '0 0 12px 0', 
          fontWeight: '700',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          🤖 AI Analyzing
        </p>
        <p style={{ 
          fontSize: '0.9rem', 
          color: '#aaaaaa', 
          margin: '0',
          letterSpacing: '0.5px'
        }}>
          This may take a few moments
        </p>
      </div>
    </div>
  );

  try {
    const payload = {
      jobDescription,
      resume: buildResumeString()
    };

    const res = await fetch("http://localhost:8080/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Status ${res.status}`);

    const data = await res.json();
    
    if (data.error) {
      setJobDescriptionInsights(
        <div style={{ 
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: '24px'
        }}>
          <div style={{ 
            padding: '24px',
            border: '2px solid #ffffff',
            backgroundColor: '#000000'
          }}>
            <h4 style={{ 
              margin: '0 0 12px 0',
              fontSize: '1rem',
              fontWeight: '700',
              color: '#ffffff',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              ❌ AI Analysis Failed
            </h4>
            <p style={{ margin: '0', fontSize: '0.9rem', color: '#cccccc' }}>
              {data.error}
            </p>
          </div>
        </div>
      );
    } else {
      const aiResult = data.result;
      
      setJobDescriptionInsights(
        <div style={{ 
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: '24px'
        }}>
          {/* AI Analysis Header */}
          <div style={{ 
            marginBottom: '32px',
            paddingBottom: '20px',
            borderBottom: '2px solid #ffffff'
          }}>
            <h2 style={{ 
              margin: '0 0 8px 0',
              fontSize: '1.4rem',
              fontWeight: '700',
              color: '#ffffff',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              🤖 AI Detailed Analysis
            </h2>
            <p style={{ 
              margin: '0',
              fontSize: '0.85rem',
              color: '#aaaaaa',
              letterSpacing: '0.5px'
            }}>
              Powered by Advanced AI • Generated just now
            </p>
          </div>

          {/* AI Response Content */}
          <div>
            {formatAIResponse(aiResult)}
          </div>

          {/* Action Footer */}
          <div style={{ 
            marginTop: '24px',
            padding: '24px',
            border: '2px solid #ffffff',
            backgroundColor: '#ffffff',
            color: '#000000'
          }}>
            <h4 style={{ 
              margin: '0 0 12px 0',
              fontSize: '1rem',
              fontWeight: '700',
              color: '#000000',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              💡 Next Steps
            </h4>
            <p style={{ 
              margin: '0',
              fontSize: '0.85rem',
              color: '#000000',
              lineHeight: '1.8'
            }}>
              Review the AI suggestions above and update your resume accordingly. 
              For a quick overview, try <strong>Quick Analysis</strong> to see keyword matches and skill breakdowns.
            </p>
          </div>
        </div>
      );
    }
  } catch (err) {
    setJobDescriptionInsights(
      <div style={{ 
        backgroundColor: '#000000',
        color: '#ffffff',
        padding: '24px'
      }}>
        <div style={{ 
          padding: '24px',
          border: '2px solid #ffffff',
          backgroundColor: '#1d1c1cff'
        }}>
          <h4 style={{ 
            margin: '0 0 12px 0',
            fontSize: '1rem',
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            ❌ Connection Error
          </h4>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#cccccc' }}>
            {err.message}
          </p>
          <p style={{ margin: '0', fontSize: '0.8rem', color: '#aaaaaa' }}>
            Make sure your backend server is running on http://localhost:8080
          </p>
        </div>
      </div>
    );
  } finally {
    setIsAIAnalysis(false);
  }
};


  return (
    <div className="section-manager job-description-section">
      <h3>Job Description</h3>
      <textarea
        className="job-description-textarea"
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={e => setJobDescription(e.target.value)}
        rows={8}
      />

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button onClick={analyzeQuick} disabled={isAnalyzing || isAIAnalysis}>
          {isAnalyzing ? "Analyzing..." : "Quick Analysis"}
        </button>

        <button onClick={analyzeWithAI} disabled={isAnalyzing || isAIAnalysis}>
          {isAIAnalysis ? "Analyzing..." : "AI Detailed Review"}
        </button>

        <button
          onClick={() => {
            setJobDescription("");
            setJobDescriptionInsights("");
            setFoundSkills([]);
            setFoundVerbs([]);
          }}
          disabled={!jobDescription.trim()}
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
    </div>
  );
}
