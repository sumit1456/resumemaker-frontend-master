# 01: Technical Setup Guide

Follow these steps to integrate the engine into a fresh React project.

## 📦 1. Dependencies
The engine uses **PixiJS** for WebGL rendering and **React** for state management.

```bash
npm install pixi.js react react-dom
```

## 📂 2. Core File Migration
Copy the following files from the source project:

### Logic Layer
- `WebgEngine4.jsx`: The main component and layout engine.
- `workerManager.js`: Essential for gradient and style processing.
- `WebglEngineWithWorkers.js`: Utility for multi-threaded initialization.

### Worker Layer (Required)
Copy these to your project's `public/workers/` folder:
- `gradientWorker.js`
- `styleWorker.js`

> [!IMPORTANT]
> Workers **must** be in the `public` folder so they can be loaded via URL.

## 🛠️ 3. Initialization
In your root component (e.g., `App.jsx`), initialize the workers once.

```javascript
import { useEffect } from 'react';
import { initializeWorkers } from './engine/WebglEngineWithWorkers';

function App() {
  useEffect(() => {
    initializeWorkers().then(() => console.log("Engine Ready"));
  }, []);

  return <MyEditor />;
}
```

## 🏗️ 4. Directory Structure
A typical clean installation looks like this:
```text
my-project/
├── public/
│   └── workers/
│       ├── gradientWorker.js
│       └── styleWorker.js
├── src/
│   ├── engine/
│   │   ├── WebgEngine4.jsx
│   │   ├── workerManager.js
│   │   └── WebglEngineWithWorkers.js
│   └── components/
│       └── WebGLPreview.jsx (Your implementation)
```
