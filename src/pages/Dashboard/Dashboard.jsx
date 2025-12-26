import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardMain from "./DashboardMain";
import ResumeEditor from "../Resume/ResumeEditor";
import { RoseIcon } from "lucide-react";
import ResumeEditorv2 from "../Resume/ResumeEditorv2.jsx";



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
          <ResumeEditorv2
            resume={resume}
            setResume={setResume}
            resumeId={resumeId}
            setResumeId={setResumeId}
            userId={userId}
          />
        }
      />

      {/* <Route
        path="resume-editorv2"
        element={
          <ResumeEditorv2
            resume={resume}
            setResume={setResume}
            resumeId={resumeId}
            setResumeId={setResumeId}
            userId={userId}
          />
        }
      /> */}



      {/* Resume editor (edit existing resume) */}
      <Route
        path="resume-editorv2/:resumeId"
        element={
          <ResumeEditorv2
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
