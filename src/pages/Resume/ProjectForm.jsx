import React, { useState } from "react";

// Predefined tech skills and action verbs
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
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [isAIAnalysis, setIsAIAnalysis] = useState(false);
  const [foundSkills, setFoundSkills] = useState([]);
  const [foundVerbs, setFoundVerbs] = useState([]);
  const [jobDescriptionInsights, setJobDescriptionInsights] = useState("");

  /** Quick client-side analysis */
  const analyzeQuick = () => {
  if (!jobDescription.trim()) return;

  setIsAnalyzing(true);
  setIsAIAnalysis(false);

  const text = jobDescription.toLowerCase();

  const skillsDetected = techSkills.filter(skill => text.includes(skill));
  const verbsDetected = actionVerbs.filter(verb => text.includes(verb));

  // Matching rate percentage
  const matchingRate = Math.round((skillsDetected.length / techSkills.length) * 100);

  setTimeout(() => {
    setFoundSkills(skillsDetected);
    setFoundVerbs(verbsDetected);

    const insights = (
      <div>
        <div className="analysis-section">
          <h4>📊 Key Skills Detected ({skillsDetected.length})</h4>
          <p>Matching Rate: <strong>{matchingRate}%</strong></p>
          <br />
          <div className="skills-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {skillsDetected.length > 0 ? (
              skillsDetected.map(skill => (
                <span 
                  key={skill} 
                  className="skill-tag" 
                  style={{
                    padding: '3px 6px',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    border : '2px solid white'
                  }}
                >
                  {skill.toUpperCase()}
                </span>
              ))
            ) : <p className="no-data">No common tech skills detected</p>}
          </div>
        </div>
        <br />

        <div className="analysis-section">
          <h4>💡 Action Verbs to Use</h4>
          <ul className="verb-list" style={{ paddingLeft: '1rem' }}>
            {verbsDetected.length > 0 ? (
              verbsDetected.map(verb => (
                <li key={verb}>{verb.charAt(0).toUpperCase() + verb.slice(1)}</li>
              ))
            ) : <li>Use action verbs from the description</li>}
          </ul>
        </div>

        <div className="analysis-section">
          <h4>✨ Quick Suggestions</h4>
          <ul className="suggestions-list" style={{ paddingLeft: '1rem' }}>
            <li>Mirror the language used in the job description</li>
            <li>Include <strong>{skillsDetected.length}</strong> detected skills in your resume</li>
            <li>Use similar formatting and keywords for ATS optimization</li>
            <li>Click <strong>"AI Detailed Review"</strong> for in-depth analysis</li>
          </ul>
        </div>
      </div>
    );

    setJobDescriptionInsights(insights);
    setIsAnalyzing(false);
  }, 300);
};

 

  const buildResumeString = () => {
    let resume = '';

    // Header
    resume += `${resumeDetails.name}\n${resumeDetails.title}\n`;
    if (resumeDetails.contact) {
      resume += `Contact: ${resumeDetails.contact.email || ''} | ${resumeDetails.contact.phone || ''} | ${resumeDetails.contact.location || ''}\n`;
      if (resumeDetails.contact.linkedin) resume += `LinkedIn: ${resumeDetails.contact.linkedin}\n`;
      if (resumeDetails.contact.github) resume += `GitHub: ${resumeDetails.contact.github}\n`;
    }
    resume += '\n';

    // Summary
    if (showSummary && resumeDetails.summary) {
      resume += 'PROFESSIONAL SUMMARY\n';
      resume += `${resumeDetails.summary}\n\n`;
    }

    // Skills
    if (showSkills && skills.length) {
      resume += 'TECHNICAL SKILLS\n';
      skills.forEach(skill => skill.trim() && (resume += `• ${skill.trim()}\n`));
      resume += '\n';
    }

    // Experience
    if (showExperience && experiences.length) {
      resume += 'EXPERIENCE\n';
      experiences.forEach(exp => {
        resume += `${exp.position} | ${exp.company}\n`;
        if (exp.location) resume += `${exp.location} | `;
        resume += `${exp.duration}\n`;
        if (exp.achievements) exp.achievements.forEach(a => a.trim() && (resume += `• ${a.trim()}\n`));
        resume += '\n';
      });
    }

    // Projects
    if (showProjects && projects.length) {
      resume += 'PROJECTS\n';
      projects.forEach(proj => {
        resume += `${proj.name}${proj.duration ? ` | ${proj.duration}` : ''}\n`;
        if (proj.technologies) resume += `Technologies: ${proj.technologies}\n`;
        if (proj.description) proj.description.forEach(d => d.trim() && (resume += `• ${d.trim()}\n`));
        resume += '\n';
      });
    }

    // Education
    if (showEducation && educationList.length) {
      resume += 'EDUCATION\n';
      educationList.forEach(edu => {
        resume += `${edu.degree}${edu.year ? ` | ${edu.year}` : ''}\n`;
        if (edu.institution) resume += `${edu.institution}\n`;
        if (edu.location || edu.gpa) resume += `${edu.location || ''}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}\n`;
        resume += '\n';
      });
    }

    // Certifications
    if (showCertifications && certifications.length) {
      resume += 'CERTIFICATIONS\n';
      certifications.forEach(c => c.trim() && (resume += `• ${c.trim()}\n`));
      resume += '\n';
    }

    // Custom sections
    if (customSections && customSections.length) {
      customSections.forEach(section => {
        if (section.title.trim()) {
          resume += `${section.title.toUpperCase()}\n`;
          section.items.forEach(item => item.trim() && (resume += `• ${item.trim()}\n`));
          resume += '\n';
        }
      });
    }

    return resume.trim();
  };


  

  /** AI-based analysis */
  const analyzeWithAI = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description first');
      return;
    }

    setIsAnalyzingAI(true);
    setIsAIAnalysis(true);
    setJobDescriptionInsights(
      <div className="loading-message">
        🤖 AI is analyzing your resume and job description...
      </div>
    );

    try {
      const payload = {
        jobDescription: jobDescription.trim(),
        resume: buildResumeString()
      };

      const response = await fetch('http://localhost:8080/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`Analysis failed with status ${response.status}`);

      const analysisText = await response.text();
      setJobDescriptionInsights(formatAIAnalysis(analysisText));

    } catch (error) {
      setJobDescriptionInsights(
        <div className="error-message">
          <h4>❌ Analysis Error</h4>
          <p>Failed to analyze with AI. Please try again.</p>
          <p className="error-detail">{error.message}</p>
        </div>
      );
    } finally {
      setIsAnalyzingAI(false);
    }
  };


   const formatAIAnalysis = (text) => {
    let html = text;
    html = html.replace(/### \*\*(.*?)\*\*/g, '<h4 class="section-title">$1</h4>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/✅/g, '<span class="check-icon">✅</span>');
    html = html.replace(/❌/g, '<span class="cross-icon">❌</span>');
    html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>\n?)+/g, '<ul class="analysis-list">$&</ul>');
    html = html.replace(/^\d+\.\s(.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(\d+\/100)/g, '<span class="score-badge">$1</span>');
    html = html.replace(/Score:\s*(\d+\/100)/gi, '<div class="score-highlight">Score: $1</div>');
    html = html.replace(/---/g, '<hr class="section-divider">');

    const paragraphs = html.split('\n\n').filter(p => p.trim());
    html = paragraphs.map(p => {
      if (p.includes('<h4') || p.includes('<ul') || p.includes('<div')) return p;
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('');

    return <div className="ai-analysis" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="section-manager job-description-section">
      <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Job Description</h3>
      <div className="job-description-container">
        {/* Textarea input for job description */}
        <textarea
          id="job-description"
          className="job-description-textarea"
          placeholder="Paste the job description here... (This will help tailor your resume)"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={8}
        />

        {/* Action Buttons */}
        <div className="job-description-actions">
          <button
            type="button"
            className="analyze-btn"
            onClick={analyzeQuick}
            disabled={!jobDescription.trim() || isAnalyzing || isAnalyzingAI}
          >
            {isAnalyzing ? "Analyzing..." : "Quick Analysis"}
          </button>

          <button
            type="button"
            className="ai-analyze-btn"
            onClick={analyzeWithAI}
            disabled={!jobDescription.trim() || isAnalyzingAI || isAnalyzing}
          >
            AI Detailed Review
          </button>

          <button
            type="button"
            className="clear-btn"
            onClick={() => {
              setJobDescription('');
              setJobDescriptionInsights('');
              setFoundSkills([]);
              setFoundVerbs([]);
            }}
            disabled={!jobDescription.trim()}
          >
            Clear
          </button>
        </div>

        {/* Insights Output */}
        {jobDescriptionInsights && (
          <div className="job-insights">
            <div className="insights-header">
              <span>{isAIAnalysis ? 'AI-Powered Analysis' : 'Quick Analysis'}</span>
            </div>
            <div className="insights-content">
              {isAIAnalysis ? jobDescriptionInsights : jobDescriptionInsights}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
