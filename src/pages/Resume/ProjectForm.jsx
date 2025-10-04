import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import ResumeDocument from "./Template1.jsx";
import ModernResumeDocument from "./Template2.jsx";
import ATSFriendlyResumeDocument from "./Template3.jsx";
import "./css-files/ResumeEditor.css";
import { Database } from "lucide-react";

// === Debounce Hook ===
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function ResumeEditor({ resume: propsResume, userId }) {
  const resumeRef = useRef();

  // ===== STATE =====
  const [resumeDetails, setResumeDetails] = useState({
    name: "SUMIT HATEKAR",
    title: "Full Stack Developer",
    contact: {
      phone: "+91 9876543210",
      email: "janedoe@example.com",
      linkedin: "linkedin.com/in/janedoe",
      github: "github.com/janedoe",
      location: "Pune, India",
    },
    summary: "Experienced full stack developer with expertise in React and Node.js.",
  });

  // SEPARATE SKILLS STATE
  const [skills, setSkills] = useState([
    "Programming Languages - Java, JavaScript, SQL",
    "Databases - Postgres, Oracle",
    "Frameworks - React js, Spring Boot, Hibernate",
    "Tools - GitHub, Postman, Swagger, Eclipse, Maven",
    "Cloud - AWS",
    "Soft Skills - Problem Solving, Communation, Team work"
  ]);

  const [experiences, setExperiences] = useState([
    {
      position: "Software Engineer",
      company: "Tech Solutions Ltd.",
      location: "Pune, India",
      duration: "Jan 2022 - Present",
      achievements: ["Developed client dashboard using React", "Implemented REST APIs in Node.js"],
    },
  ]);

  const [projects, setProjects] = useState([
    {
      name: "Portfolio Website",
      duration: "March 2023 - May 2023",
      technologies: "React, CSS, Netlify",
      description: ["Designed personal portfolio website", "Showcased projects and resume online"],
      link: "https://janedoe.dev",
    },
  ]);

  const [educationList, setEducationList] = useState([
    {
      degree: "B.Sc Computer Science",
      institution: "Modern College, Pune",
      location: "Pune, India",
      year: "2021",
      gpa: "8.7/10",
    },
  ]);

  const [certifications, setCertifications] = useState([
    "AWS Certified Developer",
    "Scrum Master Certified",
  ]);

  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  // === NEW: template selector ===
  const [selectedTemplate, setSelectedTemplate] = useState("1");
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);

  // ===== COMBINED DATA & DEBOUNCE =====
  const combinedData = useMemo(
    () => ({
      resumeDetails,
      skills, // Now separate from resumeDetails
      experiences,
      projects,
      educationList,
      certifications,
    }),
    [resumeDetails, skills, experiences, projects, educationList, certifications]
  );
  const debouncedData = useDebounce(combinedData, 3000);

  // ===== LOAD FROM PROPS =====
  useEffect(() => {
    if (propsResume) {
      setResumeDetails({
        name: propsResume.name || resumeDetails.name,
        title: propsResume.title || resumeDetails.title,
        contact: propsResume.contact || resumeDetails.contact,
        summary: propsResume.summary || resumeDetails.summary,
      });
      // Handle skills - convert from string to array if needed
      if (propsResume.skills) {
        if (typeof propsResume.skills === 'string') {
          setSkills(propsResume.skills.split(',').map(skill => skill.trim()).filter(skill => skill));
        } else if (Array.isArray(propsResume.skills)) {
          setSkills(propsResume.skills);
        }
      }
      setExperiences(propsResume.experience || experiences);
      setProjects(propsResume.projects || projects);
      setEducationList(propsResume.education || educationList);
      setCertifications(propsResume.certifications || certifications);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsResume]);

  // ===== TEMPLATE CHANGE HANDLER =====
  const handleTemplateChange = useCallback((newTemplate) => {
    setIsTemplateLoading(true);
    setSelectedTemplate(newTemplate);
    
    // Small delay to prevent blank screen flicker
    setTimeout(() => {
      setIsTemplateLoading(false);
    }, 100);
  }, []);

  // ===== HANDLERS =====
  const handleResumeDetailChange = useCallback(
    (field, value) => {
      if (field in resumeDetails.contact) {
        setResumeDetails((prev) => ({
          ...prev,
          contact: { ...prev.contact, [field]: value },
        }));
      } else {
        setResumeDetails((prev) => ({ ...prev, [field]: value }));
      }
    },
    [resumeDetails.contact]
  );

  // SKILLS HANDLERS (Fixed - removed duplicate)
  const handleSkillChange = useCallback(
    (i, value) => {
      const updated = [...skills];
      updated[i] = value;
      setSkills(updated);
    },
    [skills]
  );

  const addSkill = () => setSkills((p) => [...p, ""]);
  const removeSkill = (i) => setSkills((p) => p.filter((_, idx) => idx !== i));

  const handleExperienceChange = useCallback(
    (i, field, value, sub) => {
      const updated = [...experiences];
      if (field === "achievements") updated[i].achievements[sub] = value;
      else updated[i][field] = value;
      setExperiences(updated);
    },
    [experiences]
  );

  const handleProjectChange = useCallback(
    (i, field, value, sub) => {
      const updated = [...projects];
      if (field === "description") updated[i].description[sub] = value;
      else updated[i][field] = value;
      setProjects(updated);
    },
    [projects]
  );

  const handleEducationChange = useCallback(
    (i, field, value) => {
      const updated = [...educationList];
      updated[i][field] = value;
      setEducationList(updated);
    },
    [educationList]
  );

  const handleCertificationChange = useCallback(
    (i, value) => {
      const updated = [...certifications];
      updated[i] = value;
      setCertifications(updated);
    },
    [certifications]
  );

  // ===== ADD / REMOVE =====
  const addExperience = () =>
    setExperiences((p) => [...p, { position: "", company: "", location: "", duration: "", achievements: [""] }]);
  const addProject = () =>
    setProjects((p) => [...p, { name: "", duration: "", technologies: "", description: [""], link: "" }]);
  const addEducation = () =>
    setEducationList((p) => [...p, { degree: "", institution: "", location: "", year: "", gpa: "" }]);
  const addCertification = () => setCertifications((p) => [...p, ""]);

  const removeExperience = (i) => setExperiences((p) => p.filter((_, idx) => idx !== i));
  const removeProject = (i) => setProjects((p) => p.filter((_, idx) => idx !== i));
  const removeEducation = (i) => setEducationList((p) => p.filter((_, idx) => idx !== i));
  const removeCertification = (i) => setCertifications((p) => p.filter((_, idx) => idx !== i));

  const addAchievement = (i) => {
    const updated = [...experiences];
    updated[i].achievements.push("");
    setExperiences(updated);
  };
  const removeAchievement = (i, j) => {
    const updated = [...experiences];
    updated[i].achievements.splice(j, 1);
    setExperiences(updated);
  };
  const addProjectPoint = (i) => {
    const updated = [...projects];
    updated[i].description.push("");
    setProjects(updated);
  };
  const removeProjectPoint = (i, j) => {
    const updated = [...projects];
    updated[i].description.splice(j, 1);
    setProjects(updated);
  };

  // ===== SAVE & DOWNLOAD =====
  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      let doc;
      switch (selectedTemplate) {
        case "1":
          doc = <ResumeDocument {...combinedData} />;
          break;
        case "2":
          doc = <ModernResumeDocument {...combinedData} />;
          break;
        case "3":
          doc = <ATSFriendlyResumeDocument {...combinedData} />;
          break;
        default:
          doc = <ResumeDocument {...combinedData} />;
      }
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resumeDetails.name.replace(/\s+/g, "_")}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error generating PDF");
    } finally {
      setDownloading(false);
    }
  };


  // save all method calling the Database====================================================================

  const handleSaveAll = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/saveall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          details: resumeDetails,
          skills, // Now separate from details
          experiences,
          projects,
          educationList,
          certifications,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save resume");
    } finally {
      setSaving(false);
    }
  };




  

  // ===== Memoized PDF Preview =====
  const memoizedResumeDocument = useMemo(() => {
    if (isTemplateLoading) return null;
    
    try {
      switch (selectedTemplate) {
        case "1":
          return <ResumeDocument {...debouncedData} />;
        case "2":
          return <ModernResumeDocument {...debouncedData} />;
        case "3":
          return <ATSFriendlyResumeDocument {...debouncedData} />;
        default:
          return <ResumeDocument {...debouncedData} />;
      }
    } catch (error) {
      console.error("Error rendering template:", error);
      return <ResumeDocument {...debouncedData} />;
    }
  }, [selectedTemplate, debouncedData, isTemplateLoading]);

  // ===== RENDER =====
  return (
    <div className="resume-editor-container">
      {/* Template Selector - Fixed positioning with proper spacing */}
      <div className="template-selector-header">
        <div className="template-selector-content">
          <h2 className="template-selector-title">Go to custom editor-</h2>
          <div className="template-selector-controls">
            <label className="template-label">Choose Template:</label>
            <select 
              value={selectedTemplate} 
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="template-select"
            >
              <option value="1">📄 Classic Template</option>
              <option value="2">🎨 Modern Template</option>
              <option value="3">🤖 ATS-Friendly Template</option>
            </select>
            {isTemplateLoading && (
              <span className="template-loading">
                Loading template...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="resume-editor-main">
        {/* === Editor Panel === */}
        <div className="editor-panel">
          <div className="ats-resume" ref={resumeRef}>
            {/* === Header === */}
            <header className="header">
              <input className="name" value={resumeDetails.name}
                onChange={(e) => handleResumeDetailChange("name", e.target.value)}
                placeholder="Full Name" />
              <input className="title" value={resumeDetails.title}
                onChange={(e) => handleResumeDetailChange("title", e.target.value)}
                placeholder="Professional Title" />
              <div className="contact">
                <input value={resumeDetails.contact.phone}
                  onChange={(e) => handleResumeDetailChange("phone", e.target.value)}
                  placeholder="Phone" />
                <span className="separator">|</span>
                <input value={resumeDetails.contact.email}
                  onChange={(e) => handleResumeDetailChange("email", e.target.value)}
                  placeholder="Email" />
                <span className="separator">|</span>
                <input value={resumeDetails.contact.linkedin}
                  onChange={(e) => handleResumeDetailChange("linkedin", e.target.value)}
                  placeholder="LinkedIn" />
                <span className="separator">|</span>
                <input value={resumeDetails.contact.github}
                  onChange={(e) => handleResumeDetailChange("github", e.target.value)}
                  placeholder="GitHub" />
                <span className="separator">|</span>
                <input value={resumeDetails.contact.location}
                  onChange={(e) => handleResumeDetailChange("location", e.target.value)}
                  placeholder="Location" />
              </div>
            </header>

            {/* === Summary === */}
            <section className="section">
              <div className="section-title">Summary</div>
              <textarea className="summary"
                value={resumeDetails.summary}
                onChange={(e) => handleResumeDetailChange("summary", e.target.value)} />
            </section>

            {/* === Skills === */}
            <section className="section">
              <div className="section-title">Skills</div>
              {skills.map((skill, i) => (
                <div className="skill" key={i}>
                  <span className="bullet">•</span>
                  <input className="skill-text" value={skill}
                    onChange={(e) => handleSkillChange(i, e.target.value)}
                    placeholder="Skill name" />
                  <button className="remove-small-btn" onClick={() => removeSkill(i)}>×</button>
                </div>
              ))}
              <button className="add-btn" onClick={addSkill}>Add Skill</button>
            </section>

            {/* === Experience === */}
            <section className="section">
              <div className="section-title">Experience</div>
              {experiences.map((exp, i) => (
                <div className="experience" key={i}>
                  <div className="exp-header">
                    <input className="position" value={exp.position}
                      onChange={(e) => handleExperienceChange(i, "position", e.target.value)}
                      placeholder="Position" />
                    <input className="company" value={exp.company}
                      onChange={(e) => handleExperienceChange(i, "company", e.target.value)}
                      placeholder="Company" />
                    <input className="duration" value={exp.duration}
                      onChange={(e) => handleExperienceChange(i, "duration", e.target.value)}
                      placeholder="Duration" />
                    <button className="remove-small-btn" onClick={() => removeExperience(i)}>Remove</button>
                  </div>
                  <input className="location" value={exp.location}
                    onChange={(e) => handleExperienceChange(i, "location", e.target.value)}
                    placeholder="Location" />
                  {exp.achievements.map((ach, j) => (
                    <div className="achievement" key={j}>
                      <span className="bullet">•</span>
                      <input className="achievement-text" value={ach}
                        onChange={(e) => handleExperienceChange(i, "achievements", e.target.value, j)} />
                      <button className="remove-small-btn" onClick={() => removeAchievement(i, j)}>×</button>
                    </div>
                  ))}
                  <button className="add-small-btn" onClick={() => addAchievement(i)}>Add Point</button>
                </div>
              ))}
              <button className="add-btn" onClick={addExperience}>Add Experience</button>
            </section>

            {/* === Projects === */}
            <section className="section">
              <div className="section-title">Projects</div>
              {projects.map((proj, i) => (
                <div className="project" key={i}>
                  <div className="project-header">
                    <input className="project-name" value={proj.name}
                      onChange={(e) => handleProjectChange(i, "name", e.target.value)}
                      placeholder="Project Name" />
                    <input className="project-duration" value={proj.duration}
                      onChange={(e) => handleProjectChange(i, "duration", e.target.value)}
                      placeholder="Duration" />
                    <button className="remove-small-btn" onClick={() => removeProject(i)}>Remove</button>
                  </div>
                  <input className="technologies" value={proj.technologies}
                    onChange={(e) => handleProjectChange(i, "technologies", e.target.value)}
                    placeholder="Technologies" />
                  <input className="project-link" value={proj.link}
                    onChange={(e) => handleProjectChange(i, "link", e.target.value)}
                    placeholder="Project Link" />
                  {proj.description.map((desc, j) => (
                    <div className="description" key={j}>
                      <span className="bullet">•</span>
                      <input className="description-text" value={desc}
                        onChange={(e) => handleProjectChange(i, "description", e.target.value, j)} />
                      <button className="remove-small-btn" onClick={() => removeProjectPoint(i, j)}>×</button>
                    </div>
                  ))}
                  <button className="add-small-btn" onClick={() => addProjectPoint(i)}>Add Point</button>
                </div>
              ))}
              <button className="add-btn" onClick={addProject}>Add Project</button>
            </section>

            {/* === Education === */}
            <section className="section">
              <div className="section-title">Education</div>
              {educationList.map((edu, i) => (
                <div className="education" key={i}>
                  <div className="edu-header">
                    <input className="degree" value={edu.degree}
                      onChange={(e) => handleEducationChange(i, "degree", e.target.value)}
                      placeholder="Degree" />
                    <input className="institution" value={edu.institution}
                      onChange={(e) => handleEducationChange(i, "institution", e.target.value)}
                      placeholder="Institution" />
                    <input className="year" value={edu.year}
                      onChange={(e) => handleEducationChange(i, "year", e.target.value)}
                      placeholder="Year" />
                    <button className="remove-small-btn" onClick={() => removeEducation(i)}>Remove</button>
                  </div>
                  <input className="edu-location" value={edu.location}
                    onChange={(e) => handleEducationChange(i, "location", e.target.value)}
                    placeholder="Location" />
                  <input className="gpa" value={edu.gpa}
                    onChange={(e) => handleEducationChange(i, "gpa", e.target.value)}
                    placeholder="GPA/Score" />
                </div>
              ))}
              <button className="add-btn" onClick={addEducation}>Add Education</button>
            </section>

            {/* === Certifications === */}
            <section className="section">
              <div className="section-title">Certifications</div>
              {certifications.map((cert, i) => (
                <div className="certification" key={i}>
                  <input className="cert-text" value={cert}
                    onChange={(e) => handleCertificationChange(i, e.target.value)}
                    placeholder="Certification Name" />
                  <button className="remove-small-btn" onClick={() => removeCertification(i)}>Remove</button>
                </div>
              ))}
              <button className="add-btn" onClick={addCertification}>Add Certification</button>
            </section>

            {/* === Action Buttons === */}
            <div className="action-buttons">
              <button className="btn-primary" onClick={handleSaveAll} disabled={saving}>
                {saving ? "Saving..." : "💾 Save Resume"}
              </button>
              <button className="btn-secondary" onClick={downloadPDF} disabled={downloading}>
                {downloading ? "Generating..." : "📄 Download PDF"}
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>

        {/* === PDF Preview Panel === */}
        <div className="preview-panel">
          <div className="preview-header">
            <h3>Live Preview</h3>
          </div>
          <div className="preview-content">
            {isTemplateLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading template...</p>
              </div>
            ) : (
              <PDFViewer width="100%" height="100%">
                {memoizedResumeDocument}
              </PDFViewer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}