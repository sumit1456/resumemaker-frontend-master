# 03: Export Formats

The engine provides several ways to save and share your creations.

## 📥 1. High-Res PNG
Perfect for instant previews and social media sharing. 

-   **Resolution**: Controlled via the `resolution` prop in `WebGLStage`. High resolution (3x-4x) ensures text is crisp for print.
-   **Implementation**: Uses `app.renderer.extract.canvas()` for the most accurate GPU capture.

## 📄 2. Multi-Page PDF
Uses `jsPDF` in combination with the WebGL engine for professional-grade document export.

-   **Workflow**: The engine renders each design page onto a temporary Pixi canvas, extracts the image data, and injects it into a `jsPDF` document.
-   **Advantage**: This handles complex CSS overlays and gradients that standard HTML-to-PDF libraries often struggle with.

## 📑 3. Snapshot Export (The "JS" Format)
This is the most powerful export feature. Instead of an image, you export the engine's internal **Geometry State** as a JavaScript module.

### Why use JS Export?
-   **Instant Rehydration**: You can "load" a design into the WebGL stage instantly without needing the original HTML DOM.
-   **Offline Editing**: Since all styles are serialized, you can edit the design in environments where the original CSS might not be available.
-   **Small Size**: A 1MB PNG can be reduced to a 50KB JSON snapshot.

### Example Output:
```javascript
export const resumePreviewData = {
  snapshots: { ... },
  positions: { ... },
  lines: [ ... ],
  styleConfig: { ... }
};
```
