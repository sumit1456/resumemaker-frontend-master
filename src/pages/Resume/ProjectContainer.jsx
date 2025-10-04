import React, { useState } from "react";
import ProjectForm from "./ProjectForm";
import "./css-files/ProjectContainer.css";

export default function ProjectsContainer({ resumeId }) {
  const [projects, setProjects] = useState([{}]);

  const handleAddProject = () => setProjects(prev => [...prev, {}]);

  const handleProjectSubmit = (index, data) => {
    setProjects(prev => {
      const updated = [...prev];
      updated[index] = data;
      return updated;
    });
    console.log("All projects so far:", projects);
  };

  if (!resumeId) return <p>Loading Resume ID... Please submit resume first.</p>;

  return (
    <div className="projects-wrapper max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>

      {projects.map((_, idx) => (
        <div key={idx} className="project-card mb-4 p-4 bg-white rounded-xl shadow">
          <ProjectForm 
            resumeId={resumeId} 
            onSubmit={(data) => handleProjectSubmit(idx, data)} 
          />
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddProject}
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
      >
        + Add Project
      </button>
    </div>
  );
}
