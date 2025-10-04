import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardMain from "./DashboardMain";
import ResumeEditor from "../Resume/ResumeEditor";

export default function ResumeDashboard({userId}) {
  // Lifted states
  const [resumeId, setResumeId] = useState(null);
  const [resume, setResume] = useState(null);      // full resume object

  return (
    <Routes>
      {/* Main Dashboard page */}
      <Route index element={<DashboardMain userId={userId} />} />

      {/* Nested Resume Editor route */}
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
    </Routes>
  );
}
