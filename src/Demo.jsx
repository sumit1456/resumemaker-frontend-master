import React, { useState, useRef } from 'react';
import { WebGLStage, useWebGLSnapshot } from './components/engine/WebEngine';
import { captureDOMToCanvas } from './components/canvasEngine/CanvasEngineFunctions';
import './Demo.css';

const Demo = () => {
    const targetRef = useRef(null);
    const [canvasImage, setCanvasImage] = useState(null);
    const [webglSnapshot, setWebglSnapshot] = useState(null);
    const [canvasTime, setCanvasTime] = useState(0);
    const [webglTime, setWebglTime] = useState(0);
    const [mode, setMode] = useState('performance');

    const styleWorkerRef = useRef(null);
    const gradientWorkerRef = useRef(null);

    React.useEffect(() => {
        styleWorkerRef.current = new Worker('/workers/styleWorker.js');
        gradientWorkerRef.current = new Worker('/workers/gradientWorker.js');
        return () => {
            styleWorkerRef.current?.terminate();
            gradientWorkerRef.current?.terminate();
        };
    }, []);

    const { capture: captureWebGL } = useWebGLSnapshot();

    const runCanvasTest = async () => {
        const start = performance.now();
        const img = await captureDOMToCanvas(targetRef.current, {
            scale: 2,
            mode: mode,
            styleWorker: styleWorkerRef.current,
            gradientWorker: gradientWorkerRef.current
        });
        setCanvasTime(performance.now() - start);
        setCanvasImage(img.src);
    };

    const runWebGLTest = async () => {
        const start = performance.now();
        const snapshot = await captureWebGL(targetRef.current, { mode: mode });
        setWebglTime(performance.now() - start);
        setWebglSnapshot(snapshot);
    };

    return (
        <div className="demo-page">
            <header className="demo-header">
                <h1>Engine Comparison Demo</h1>
                <p>WebGL (GPU) vs Canvas (CPU) Coordinate Extraction</p>
            </header>

            <main className="demo-main">
                {/* TARGET ELEMENT */}
                <section className="demo-section">
                    <h2>1. Source DOM Element</h2>
                    <div ref={targetRef} className="sample-card">
                        <div className="card-header">
                            <h3>Professional Summary</h3>
                            <span className="badge">Featured</span>
                        </div>
                        <p className="card-body">
                            Innovative Software Engineer with 5+ years of experience in building
                            high-performance web applications. Expert in React, PixiJS, and
                            geometric layout engines.
                        </p>
                        <div className="card-footer">
                            <div className="tag">React</div>
                            <div className="tag">WebGL</div>
                            <div className="tag">Canvas</div>
                        </div>
                    </div>
                    <div className="controls">
                        <select className="mode-select" value={mode} onChange={(e) => setMode(e.target.value)}>
                            <option value="performance">Performance Mode (Fast)</option>
                            <option value="deep">Deep Mode (Gradients/Shadows)</option>
                        </select>
                        <button className="btn btn-canvas" onClick={runCanvasTest}>
                            Capture with Canvas Engine
                        </button>
                        <button className="btn btn-webgl" onClick={runWebGLTest}>
                            Capture with WebGL Engine
                        </button>
                    </div>
                </section>

                {/* RESULTS */}
                <div className="results-grid">
                    {/* CANVAS RESULT */}
                    <section className="demo-section">
                        <div className="section-header">
                            <h2>2. Canvas Engine Result</h2>
                            {canvasTime > 0 && <span className="time">{canvasTime.toFixed(2)}ms</span>}
                        </div>
                        <div className="canvas-output-container">
                            {canvasImage ? (
                                <img src={canvasImage} alt="Canvas Output" className="output-img" />
                            ) : (
                                <div className="placeholder">Click capture to see result</div>
                            )}
                        </div>
                    </section>

                    {/* WEBGL RESULT */}
                    <section className="demo-section">
                        <div className="section-header">
                            <h2>3. WebGL Engine Result</h2>
                            {webglTime > 0 && <span className="time">{webglTime.toFixed(2)}ms</span>}
                        </div>
                        <div className="webgl-output-container">
                            {webglSnapshot ? (
                                <WebGLStage
                                    snapshot={webglSnapshot}
                                    width={webglSnapshot.width}
                                    height={webglSnapshot.height}
                                    resolution={2}
                                />
                            ) : (
                                <div className="placeholder">Click capture to see result</div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Demo;
