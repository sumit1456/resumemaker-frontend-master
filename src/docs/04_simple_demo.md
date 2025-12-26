# 04: Simple Demo

This is a minimal implementation that shows how to capture a simple DOM element and display it in the WebGL stage.

## 🚀 The Implementation

```jsx
import React, { useRef } from 'react';
import { WebGLStage, useWebGLSnapshot } from './WebGLStage';

function SimplePreview() {
  const { snapshot, capture } = useWebGLSnapshot();
  const sourceRef = useRef(null);

  const handleCapture = async () => {
    // 1. Take a snapshot of the DOM element
    if (sourceRef.current) {
        await capture(sourceRef.current);
    }
  };

  return (
    <div className="demo-container">
      {/* SOURCE: Standard HTML Designer */}
      <div className="sidebar">
        <div ref={sourceRef} className="card">
          <h1>Hello World</h1>
          <p>This HTML will be mirrored in WebGL.</p>
        </div>
        <button onClick={handleCapture}>Mirror to GPU</button>
      </div>

      {/* TARGET: WebGL Stage */}
      <div className="stage">
        <WebGLStage 
          width={500} 
          height={500} 
          snapshot={snapshot} 
        />
      </div>
    </div>
  );
}
```

## 📝 Explanation

### 1. `useWebGLSnapshot()`
This hook is the heart of the interaction. It provides:
-   `capture(element)`: An async function that scans the DOM and populates the snapshot state.
-   `snapshot`: The reactive state containing the layout tree.

### 2. `ref={sourceRef}`
We attach a React `ref` to the container we want to capture. The engine will scan this container and **all its children**.

### 3. `<WebGLStage />`
This is the component that houses the PIXI canvas. 
-   When `snapshot` is null, it displays a blank canvas.
-   When a `snapshot` is provided, it iterates through the layout nodes and draws them using GPU-accelerated graphics.

### 4. Why is this better than an image?
Unlike a static `<img>` tag, the elements in `WebGLStage` are **live**. You can add `onDragEnd` or `onSelect` props to the stage to allow users to manipulate these objects directly with their mouse or touch screen.
