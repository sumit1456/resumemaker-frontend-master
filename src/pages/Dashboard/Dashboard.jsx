import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardMain from "./DashboardMain";
import ResumeEditor from "../Resume/ResumeEditor";

export default function ResumeDashboard({ userId }) {
  const [resumeId, setResumeId] = useState(null);
  const [resume, setResume] = useState(null);

  return (
    <Routes>
      {/* Dashboard main page */}
      <Route index element={<DashboardMain userId={userId} />} />

      {/* Resume editor (blank / new resume) */}
      <Route
        path="resume-editor"
        element={
          <ResumeEditor
            resume={resume}
            setResume={setResume}
            resumeId={resumeId}
            setResumeId={setResumeId}
            userId={userId}
          />
        }
      />

      {/* Resume editor (edit existing resume) */}
      <Route
        path="resume-editor/:resumeId"
        element={
          <ResumeEditor
            resume={resume}
            setResume={setResume}
            resumeId={resumeId}
            setResumeId={setResumeId}
            userId={userId}
          />
        }
      />
    </Routes>
  );
}
