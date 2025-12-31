# ResumeMaker - AI-Powered Resume Builder

A modern, feature-rich resume builder built with React, Redux, and Node.js. Create professional, ATS-friendly resumes with a powerful drag-and-drop editor, real-time preview, and AI-assisted content generation.

## 🚀 Key Features

*   **Advanced Editor (`ResumeEditorv3` & `b3`)**: 
    *   Drag-and-drop section reordering.
    *   Visual "Magnetic" layout flow (optional).
    *   Live preview with precise canvas rendering.
    *   Multi-page support with auto-flow.
*   **Template System**:
    *   Multiple professional templates (Modern, ATS, Creative, Tech, etc.).
    *   **Template Showcase**: Visual gallery to browse and select templates.
    *   Customizable styles (fonts, colors, spacing).
*   **AI Integration**:
    *   AI-powered resume analysis and scoring.
    *   Content improvement suggestions.
*   **User Management**:
    *   JWT-based Authentication (Login/Signup).
    *   Dashboard to manage saved resumes.
    *   Auto-restore session functionality.
*   **Export**:
    *   High-quality PNG and PDF export.

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, Redux Toolkit, React Router v6.
*   **Styling**: CSS Modules, Lucide React (Icons).
*   **Rendering Engines**: 
    *   **Canvas Engine**: Custom layout engine for precise pixel-perfect rendering.
    *   **WebGL (PixiJS)**: High-performance rendering for the editor.
*   **API**: Axios (Centralized instance with Interceptors).

## 📂 Project Structure

*   `src/pages/Resume/`: Core editor components (`ResumeEditorv3`).
*   `src/pages/UI-Edits/`: Advanced editor features (`b3.jsx`, `WebEngine.jsx`).
*   `src/pages/Dashboard/`: User dashboard and navigation.
*   `src/components/engine/`: WebGL and Canvas rendering engines.
*   `src/api/`: Centralized API configuration.

## 🚦 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## 📖 Architecture Documentation

See [PREVIEW_LOADING_ARCHITECTURE.md](./PREVIEW_LOADING_ARCHITECTURE.md) for a deep dive into the custom rendering engine and preview system.
