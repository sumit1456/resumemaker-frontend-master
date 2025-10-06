import React from "react";
import { FileUp, Edit3 } from "lucide-react";
import "./css-files/Dashboard.css";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import ResumeEditor from "../Resume/ResumeEditor";

export default function DashboardMain({ onUpload }) {
  const navigate = useNavigate();

  const handleManual = () => {
    // Navigate directly to editor
    navigate("resume-editor");
  };



  
  return (
    <>
      <div style={{backgroundColor : ""}} className="dashboard">
        <h1>Build Your Resume</h1>

        <p className="lead">
          Choose how you’d like to get started. You can fill in details directly
          in the editor or upload an existing resume to auto-fill.
        </p>

        <div  className="dashboard-grid">
          {/* Manual Entry Card */}
          <div className="card">
            <Edit3 size={48} className="card-icon blue" />
            <h2>Fill Details Manually</h2>
            <p>Edit your resume details in one place and save them to the backend.</p>
            <button className="button primary" onClick={handleManual}>
              Start Editing
            </button>
          </div>

          {/* Upload Card */}
          <div className="card">
            <FileUp size={48} className="card-icon green" />
            <h2>Upload Existing Resume</h2>
            <p>We’ll parse your resume and pre-fill the editor.</p>
            <button className="button secondary" onClick={onUpload}>
              Upload File
            </button>
          </div>
        </div>
      </div>

      {/* Nested Route for ResumeEditor */}
      <Routes>
        <Route path="resume-editor" element={<ResumeEditor />} />
      </Routes>
    </>
  );
}
