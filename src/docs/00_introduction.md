# 00: Introduction to Hybrid Engine

The **Hybrid WebGL/Canvas Layout Engine** is a high-performance rendering library designed for complex UI editors (like resume makers, graphic design tools, etc.).

## 🚀 Why "Hybrid"?
Traditional DOM rendering is great for layout but difficult to export cleanly or manipulate with high-performance animations (like physics). This engine bridges both worlds:

1.  **DOM Layout**: Design your UI using familiar HTML/CSS or React components.
2.  **Geometry Snapping**: The engine "captures" the computed styles and positions of your DOM elements.
3.  **WebGL Rendering**: It mirrors that design onto a high-speed GPU canvas using **PixiJS**.

## 🏗️ Architecture Overview

The library consists of three main layers:

-   **Snapshot Layer**: Captures DOM nodes and converts them into a serializable `LayoutNode` tree.
-   **Orchestration Layer (`HybridRenderer`)**: Manages the switch between CSS view, Canvas view, and GPU view.
-   **Processing Layer (Workers)**: Offloads heavy gradient color calculations and style parsing to background threads to keep the UI at 60 FPS.

## ✨ Key Features
-   **Instant Previews**: Generate PNG/PDF snapshots directly from the GPU.
-   **Interactive Objects**: Built-in support for dragging, resizing, and physics.
-   **Serializable State**: Export the entire design as a JS snapshot for later use.
-   **Threaded Performance**: Web Worker integration for non-blocking style processing.
