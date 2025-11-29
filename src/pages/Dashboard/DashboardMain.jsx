import React from "react";
import { Edit3 } from "lucide-react";
import "./css-files/DashboardMain.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import ResumeEditor from "../Resume/ResumeEditor";


export default function DashboardMain() {
  const navigate = useNavigate();

  const handleManual = () => {
    navigate("resume-editor");
  };

  return (
    <>
      <div className="dashboard">
        <h1>Build Your Resume</h1>
        <p className="lead">
          Start building your professional resume directly in our editor.
          Enter your details manually and customize everything in real-time.
        </p>

        <div className="dashboard-grid single-card">
          {/* Manual Entry Card */}
          <div className="card">
            <Edit3 size={48} className="card-icon blue" />
            <h2>Fill Details Manually</h2>
            <p>Edit your resume details easily and save them securely.</p>
            <button className="button primary" onClick={handleManual}>
              Start Editing
            </button>
          </div>
        </div>
      </div>

      {/* Nested Route for ResumeEditor */}
      <Routes>
        <Route path="resume-editor" element={<ResumeEditor />} />
        <Route path="resume-editor/:resumeId" element={<ResumeEditor />} />
      </Routes>
    </>
  );
}
