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

  // ==================== STYLES ====================
// Centralized style objects matching your About page design

const COLORS = {
  primary: '#000000',
  secondary: '#201f1f',
  tertiary: '#272727',
  accent: '#7c7575',
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

// ==================== QUICK ANALYSIS FUNCTION ====================

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
        <div style={STYLES.header}>
          <h2 style={STYLES.headerTitle}>
            📊 Quick Analysis
          </h2>
          <p style={STYLES.headerSubtitle}>
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
        <div style={{ marginBottom: '40px' }}>
          <h3 style={STYLES.sectionTitle}>Skills Detected</h3>
          
          {detectedSkills.length === 0 ? (
            <div style={{
              ...STYLES.card,
              padding: '24px',
              textAlign: 'center'
            }}>
              <p style={{
                margin: '0',
                fontSize: '0.95rem',
                color: COLORS.gray,
                letterSpacing: '0.5px'
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
        <div style={{ marginBottom: '40px' }}>
          <h3 style={STYLES.sectionTitle}>
            Action Verbs · {detectedVerbs.length}
          </h3>
          
          {detectedVerbs.length > 0 ? (
            <div style={STYLES.card}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '10px'
              }}>
                {detectedVerbs.map(verb => (
                  <div key={verb} style={{
                    ...STYLES.badge,
                    padding: '10px',
                    textAlign: 'center',
                    textTransform: 'uppercase'
                  }}>
                    {verb}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              ...STYLES.card,
              padding: '24px',
              textAlign: 'center'
            }}>
              <p style={{
                margin: '0',
                fontSize: '0.95rem',
                color: COLORS.gray,
                letterSpacing: '0.5px'
              }}>
                No action verbs detected in job description
              </p>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div style={{ marginBottom: '40px' }}>
          <h3 style={STYLES.sectionTitle}>Recommendations</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <RecommendationCard
              icon="⚡"
              title="ATS Optimization"
              items={[
                `Include all ${detectedSkills.length} detected skills prominently`,
                'Use exact keyword matches (not synonyms)',
                'Avoid complex formatting that ATS can\'t parse',
                'Save as .docx or PDF with selectable text'
              ]}
            />

            <RecommendationCard
              icon="✍️"
              title="Content Strategy"
              items={[
                'Start bullet points with action verbs',
                'Quantify achievements with metrics',
                'Mirror job description terminology',
                'Highlight relevant experience prominently'
              ]}
            />

            {matchRate < 70 && (
              <RecommendationCard
                icon="⚠️"
                title="Skills Gap Alert"
                items={[
                  `Match rate is ${matchRate}% - aim for 70%+`,
                  'Review job description for additional skills',
                  'Consider upskilling in missing technologies',
                  'Focus on transferable skills'
                ]}
              />
            )}

            <RecommendationCard
              icon="📄"
              title="Formatting Tips"
              items={[
                'Keep resume to 1-2 pages maximum',
                'Use clear section headers',
                'Choose readable fonts at 10-12pt',
                'Maintain consistent formatting'
              ]}
            />
          </div>
        </div>

        {/* Next Steps */}
        <div style={STYLES.cardLight}>
          <h4 style={{
            margin: '0 0 16px 0',
            fontSize: '1rem',
            fontWeight: '700',
            color: COLORS.primary,
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
            color: COLORS.primary
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

// ==================== AI RESPONSE FORMATTER ====================

const formatAIResponse = (text) => {
  const sections = text.split(/##\s+/);
  
  return sections.map((section, idx) => {
    if (!section.trim()) return null;
    
    const lines = section.split('\n');
    const title = lines[0].replace(/\*\*/g, '').trim();
    const content = lines.slice(1).join('\n').trim();
    
    // Icon mapping
    let icon = '📋';
    if (title.toLowerCase().includes('requirements')) icon = '⚙️';
    else if (title.toLowerCase().includes('experience') || title.toLowerCase().includes('skills')) icon = '💼';
    else if (title.toLowerCase().includes('gap') || title.toLowerCase().includes('missing')) icon = '⚠️';
    else if (title.toLowerCase().includes('strong') || title.toLowerCase().includes('match')) icon = '✅';
    else if (title.toLowerCase().includes('recommendation') || title.toLowerCase().includes('suggest')) icon = '💡';
    
    return (
      <div key={idx} style={{
        ...STYLES.card,
        marginBottom: '20px',
        padding: '24px'
      }}>
        <h4 style={{
          margin: '0 0 16px 0',
          fontSize: '1rem',
          fontWeight: '700',
          color: COLORS.white,
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          {icon} {title}
        </h4>
        <div style={{
          fontSize: '0.9rem',
          lineHeight: '2',
          color: COLORS.lightGray
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
                  <span style={{ color: COLORS.white, flexShrink: 0, fontWeight: '900' }}>•</span>
                  <span>{text}</span>
                </div>
              );
            }
            if (line.includes('**')) {
              const formatted = line.replace(
                /\*\*(.*?)\*\*/g,
                `<strong style="color: ${COLORS.white}; font-weight: 700;">$1</strong>`
              );
              return <div key={i} dangerouslySetInnerHTML={{ __html: formatted }} style={{ marginBottom: '10px' }} />;
            }
            return line.trim() ? <div key={i} style={{ marginBottom: '10px' }}>{line}</div> : null;
          })}
        </div>
      </div>
    );
  }).filter(Boolean);
};

// ==================== AI ANALYSIS FUNCTION ====================

const analyzeWithAI = async () => {
  if (!jobDescription.trim()) {
    alert("Paste job description first");
    return;
  }

  setIsAIAnalysis(true);
  setJobDescriptionInsights(<LoadingState />);

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
        <ErrorState
          title="AI Analysis Failed"
          message={data.error}
        />
      );
    } else {
      const aiResult = data.result;
      
      setJobDescriptionInsights(
        <div style={STYLES.container}>
          {/* AI Analysis Header */}
          <div style={STYLES.header}>
            <h2 style={STYLES.headerTitle}>
              🤖 AI Detailed Analysis
            </h2>
            <p style={STYLES.headerSubtitle}>
              Powered by Advanced AI • Generated just now
            </p>
          </div>

          {/* AI Response Content */}
          <div>
            {formatAIResponse(aiResult)}
          </div>

          {/* Action Footer */}
          <div style={STYLES.cardLight}>
            <h4 style={{
              margin: '0 0 12px 0',
              fontSize: '1rem',
              fontWeight: '700',
              color: COLORS.primary,
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              💡 Next Steps
            </h4>
            <p style={{
              margin: '0',
              fontSize: '0.85rem',
              color: COLORS.primary,
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
      <ErrorState
        title="Connection Error"
        message={err.message}
        subtitle="Make sure your backend server is running on http://localhost:8080"
      />
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
