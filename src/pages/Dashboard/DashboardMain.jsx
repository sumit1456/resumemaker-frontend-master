import { Edit3, LayoutTemplate } from "lucide-react"; // 🚀 Import LayoutTemplate
import "./css-files/DashboardMain.css";
import { useNavigate } from "react-router-dom";


export default function DashboardMain() {
  const navigate = useNavigate();

  const handleManual = () => {
    navigate("resume-editor");
  };

  const handleShowcase = () => { // 🚀 New handler
    navigate("/templates");
  };

  return (
    <>
      <div className="dashboard">
        <h1>Build Your Resume</h1>
        <p className="lead">
          Start building your professional resume directly in our editor.
          Enter your details manually and customize everything in real-time.
        </p>

        <div className="dashboard-grid"> {/* 🚀 Removed 'single-card' class */}
          {/* Manual Entry Card */}
          <div className="card">
            <Edit3 size={48} className="card-icon blue" />
            <h2>Start Creating Resume</h2>
            <p>Edit your resume details easily and save them securely.</p>
            <button className="button primary" onClick={handleManual}>
              Start Editing
            </button>
          </div>

          {/* 🚀 Template Showcase Card */}
          <div className="card">
            <LayoutTemplate size={48} className="card-icon blue" />
            <h2>Template Showcase</h2>
            <p>Explore our visual gallery of professional templates.</p>
            <button className="button primary" onClick={handleShowcase}>
              View Templates
            </button>
          </div>
        </div>
      </div>


    </>
  );
}
