import React, { useState, useRef, useEffect } from 'react';
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
    const gradientWorkerRef = useRef(null); // WebGL uses this (original)
    const canvasGradientWorkerRef = useRef(null); // Canvas uses this (new/fixed)

    useEffect(() => {
        styleWorkerRef.current = new Worker('/workers/styleWorker.js');
        gradientWorkerRef.current = new Worker('/workers/gradientWorker.js');
        canvasGradientWorkerRef.current = new Worker('/workers/canvasGradientWorker.js');

        return () => {
            styleWorkerRef.current?.terminate();
            gradientWorkerRef.current?.terminate();
            canvasGradientWorkerRef.current?.terminate();
        };
    }, []);

    const [canvasStats, setCanvasStats] = useState(null);
    const [webglStats, setWebglStats] = useState(null);

    const { capture: captureWebGL } = useWebGLSnapshot();

    const runCanvasTest = async () => {
        const start = performance.now();
        const result = await captureDOMToCanvas(targetRef.current, {
            scale: 2,
            mode: mode,
            styleWorker: styleWorkerRef.current,
            gradientWorker: canvasGradientWorkerRef.current // Use the new worker
        });
        const total = performance.now() - start;
        setCanvasTime(total);
        setCanvasImage(result.src);
        setCanvasStats({ ...result.stats, total });
    };

    const runWebGLTest = async () => {
        const start = performance.now();
        const snapshot = await captureWebGL(targetRef.current, { mode: mode });
        const total = performance.now() - start;
        setWebglTime(total);
        setWebglSnapshot(snapshot);
        setWebglStats({
            nodeCount: snapshot?.stats?.nodeCount || 0,
            captureTime: snapshot?.stats?.captureTime || 0,
            total
        });
    };

    return (
        <div className="demo-page">
            <header className="demo-header">
                <h1>Engine Comparison Demo</h1>
                <p>WebGL (GPU) vs Canvas (CPU) Coordinate Extraction</p>
            </header>

            <main className="demo-main">
                {/* TARGET ELEMENT - The Test Suite */}
                <section className="demo-section">
                    <h2>1. Source DOM Element (Test Suite)</h2>

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

                    <div style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px', borderRadius: '8px', background: '#e2e8f0' }}>
                        <div ref={targetRef} className="test-suite">

                            {/* TEST CASE 1: LINES & BORDERS */}
                            <div className="test-category">
                                <h3>Test 1: Lines & Borders (Dashed/Dotted)</h3>
                                <div className="line-box dashed-border">Dashed Border (Blue)</div>
                                <div className="line-box dotted-border">Dotted Border (Red)</div>
                                <div className="line-box mixed-border">Mixed Borders</div>
                            </div>

                            {/* TEST CASE 2: GRADIENTS */}
                            <div className="test-category">
                                <h3>Test 2: Gradients</h3>
                                <div className="gradient-box linear-gradient">Linear Gradient</div>
                                <div className="gradient-box radial-gradient">Radial Gradient</div>
                                <div className="gradient-box complex-gradient">Complex Gradient</div>
                            </div>

                            {/* TEST CASE 3: LAYOUT & Z-INDEX */}
                            <div className="test-category">
                                <h3>Test 3: Layout & Layers</h3>
                                <div className="layout-grid-test">
                                    <div className="layering-container">
                                        <div className="layer-box layer-1">Z-10</div>
                                        <div className="layer-box layer-2">Z-20</div>
                                        <div className="layer-box layer-3">Z-5</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <div style={{ background: '#ddd', padding: '5px' }}>Flex Item 1</div>
                                        <div style={{ background: '#ccc', padding: '5px' }}>Flex Item 2</div>
                                        <div style={{ background: '#bbb', padding: '5px' }}>Flex Item 3</div>
                                    </div>
                                </div>
                            </div>

                            {/* TEST CASE 4: COMPLEX RESUME LAYOUT */}
                            <div className="test-category">
                                <h3>Test 4: Complex Resume Layout</h3>
                                <div className="complex-resume-container">
                                    <div className="resume-header">
                                        <div className="resume-avatar">JD</div>
                                        <div className="resume-title-block">
                                            <h1>John Doe</h1>
                                            <h2>Senior Senior Developer</h2>
                                        </div>
                                    </div>
                                    <div className="resume-body">
                                        <div className="resume-sidebar">
                                            <h4>Skills</h4>
                                            <ul>
                                                <li>JavaScript (ES6+)</li>
                                                <li>React / Redux</li>
                                                <li>WebGL / Canvas</li>
                                                <li>Node.js</li>
                                            </ul>
                                            <h4>Contact</h4>
                                            <p>john.doe@example.com</p>
                                            <p>+1 234 567 890</p>
                                        </div>
                                        <div className="resume-main">
                                            <div className="experience-item">
                                                <div className="exp-date">2020 - Present</div>
                                                <h3>Tech Corp Inc.</h3>
                                                <p>Lead the development of a complex rendering engine using Canvas API. Optimized performance by 300%.</p>
                                            </div>
                                            <div className="experience-item">
                                                <div className="exp-date">2018 - 2020</div>
                                                <h3>Startup Studio</h3>
                                                <p>Built scalable frontend architectures for high-traffic e-commerce platforms.</p>
                                            </div>
                                            <div className="visual-skill-bar">
                                                <span>Performance Optimization</span>
                                                <div className="skill-track">
                                                    <div className="skill-fill" style={{ width: '90%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* RESULTS */}
                <div className="results-grid">
                    {/* CANVAS RESULT */}
                    <section className="demo-section">
                        <div className="section-header">
                            <h2>2. Canvas Engine Result</h2>
                            {canvasTime > 0 && (
                                <div className="stats-box">
                                    <span className="time-badge">{canvasTime.toFixed(2)}ms Total</span>
                                    {canvasStats && (
                                        <div className="stats-details">
                                            <span>Nodes: {canvasStats.nodeCount}</span>
                                            <span>Parse: {canvasStats.captureTime?.toFixed(2)}ms</span>
                                            <span>Render: {canvasStats.renderTime?.toFixed(2)}ms</span>
                                        </div>
                                    )}
                                </div>
                            )}
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
                            {webglTime > 0 && (
                                <div className="stats-box">
                                    <span className="time-badge">{webglTime.toFixed(2)}ms Total</span>
                                    {webglStats && (
                                        <div className="stats-details">
                                            <span>Nodes: {webglStats.nodeCount}</span>
                                            <span>Parse: {webglStats.captureTime?.toFixed(2)}ms</span>
                                            <span>GPU Upload: {(webglStats.total - webglStats.captureTime).toFixed(2)}ms</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="webgl-output-container">
                            {webglSnapshot ? (
                                <WebGLStage
                                    snapshot={webglSnapshot}
                                    width={webglSnapshot.width}
                                    height={webglSnapshot.height}
                                    stageScale={1} // Ensure 1:1 scale for comparison
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
