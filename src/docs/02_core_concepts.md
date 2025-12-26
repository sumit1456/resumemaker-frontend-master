# 02: Core Concepts

To master the engine, you must understand how it perceives the world. It doesn't use HTML; it uses a **Geometry Snapshot**.

## 📸 What is a Snapshot?
A Snapshot is a point-in-time calculation of your UI. When you call `capture(element)`, the engine:
1.  Recursively walks through the DOM element.
2.  Computes the exact bounding box (x, y, width, height) of every child.
3.  Captures computed styles: `backgroundColor`, `borderRadius`, `boxShadow`, `fontFamily`, `fontSize`, and more.
4.  Produces a serializable JSON object (`GeometrySnapshot`).

### 🏗️ Layout Nodes
The Snapshot is made of "Nodes". Each node represents a specific type of UI element:

| Node Type | Purpose | Key Properties |
| :--- | :--- | :--- |
| `BoxNode` | Containers, borders, backgrounds | `borderRadius`, `styles` |
| `TextNode` | All typography | `text`, `fontSize`, `lineHeight` |
| `ImageNode` | External assets (PNG/SVG/WebP) | `src`, `objectFit` |
| `LineNode` | SVG-like connector lines | `x1, y1, x2, y2`, `thickness` |

## 🕹️ Interaction Mode
The engine handles selection and drag interactions via PIXI's Event System.

-   **Selection**: When a node is selected, the engine adds a "selection highlight" on top of the stage.
-   **Z-Index**: Snapshots preserve the layering of your DOM. If you want an object on top, it must be the last child in your DOM or have a higher z-index.

## 🧵 The Worker Thread
Calculating complex gradients and parsing CSS colors can be slow. The engine automatically offloads these to:
1.  **GradientWorker**: Generates texture data for complex linear/radial gradients.
2.  **StyleWorker**: Rapidly parses raw CSS style objects into engine-friendly formats.
