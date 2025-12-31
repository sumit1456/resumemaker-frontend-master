
import React, { useState, useRef, useEffect } from 'react';
import { WebGLStage, useWebGLSnapshot } from './components/engine/WebEngine';
import { captureDOMToCanvas } from './components/canvasEngine/CanvasEngineFunctions';
import html2canvas from 'html2canvas'; // Import html2canvas
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

    // Removed duplicate time state declarations

    const [html2canvasStats, setHtml2canvasStats] = useState(null);
    const [html2canvasTime, setHtml2canvasTime] = useState(0);
    const [html2canvasImage, setHtml2canvasImage] = useState(null);

    const { capture: captureWebGL } = useWebGLSnapshot();

    const runHtml2CanvasTest = async () => {
        setHtml2canvasImage(null);
        setHtml2canvasStats(null);
        setHtml2canvasTime(0);

        const start = performance.now();
        const canvas = await html2canvas(targetRef.current, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: null
        });
        const total = performance.now() - start;

        setHtml2canvasTime(total);
        setHtml2canvasImage(canvas.toDataURL());
        setHtml2canvasStats({
            total
        });
    };

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
                <section className="demo-section source-section">
                    <h2>1. Source DOM (React)</h2>

                    <div className="controls">
                        <select className="mode-select" value={mode} onChange={(e) => setMode(e.target.value)}>
                            <option value="performance">Performance Mode (Fast)</option>
                            <option value="deep">Deep Mode (Gradients/Shadows)</option>
                        </select>
                        <button onClick={runCanvasTest} className="btn-primary">
                            Run Canvas Engine
                        </button>
                        <button onClick={runWebGLTest} className="btn-secondary">
                            Run WebGL Engine
                        </button>
                        <button onClick={runHtml2CanvasTest} className="btn-accent" style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                            Run html2canvas
                        </button>
                    </div>

                    <div style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px', borderRadius: '8px', background: '#e2e8f0' }}>
                        <div className="preview-container">
                            <div ref={targetRef} className="test-suite">



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

                                {/* TEST CASE 5: NEW CREATIVE POSTER */}
                                <div className="test-category">
                                    <h3>Test 5: Creative Poster Design (Rotations & Blends)</h3>
                                    <div className="poster-container">
                                        <div className="poster-circle"></div>
                                        <div className="poster-title">CREATIVE<br />DESIGN</div>
                                        <div className="poster-card card-1">
                                            <span>01</span>
                                            <p>Overlapping Content</p>
                                        </div>
                                        <div className="poster-card card-2">
                                            <span>02</span>
                                            <p>Rotated Elements</p>
                                        </div>
                                        <div className="poster-footer">
                                            Designed for Stress Testing
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* RESULTS - NEW LAYOUT (2 Top, 1 Bottom) */}
                <div className="results-grid-custom">
                    <div className="result-row-top">
                        {/* CANVAS RESULT */}
                        <section className="demo-section">
                            <div className="section-header">
                                <h2>2. Canvas Engine</h2>
                                {canvasTime > 0 && (
                                    <div className="stats-box">
                                        <span className="time-badge">{canvasTime.toFixed(2)}ms Total</span>
                                        {canvasStats && (
                                            <div className="stats-details">
                                                <span>Nodes: {canvasStats.nodeCount}</span>
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
                                <h2>3. WebGL Engine</h2>
                                {webglTime > 0 && (
                                    <div className="stats-box">
                                        <span className="time-badge">{webglTime.toFixed(2)}ms Total</span>
                                        {webglStats && (
                                            <div className="stats-details">
                                                <span>Nodes: {webglStats.nodeCount || 0}</span>
                                                <span>Upload: {(webglStats.total - (webglStats.captureTime || 0)).toFixed(2)}ms</span>
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
                                        stageScale={1}
                                        resolution={2}
                                    />
                                ) : (
                                    <div className="placeholder">Click capture to see result</div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* HTML2CANVAS RESULT - FULL WIDTH BOTTOM */}
                    <div className="result-row-bottom">
                        <section className="demo-section full-width-section">
                            <div className="section-header">
                                <h2>4. html2canvas</h2>
                                {html2canvasTime > 0 && (
                                    <div className="stats-box">
                                        <span className="time-badge" style={{ background: '#f3e8ff', color: '#6b21a8' }}>{html2canvasTime.toFixed(2)}ms Total</span>
                                        <div className="stats-details">
                                            <span>Standard Lib</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="canvas-output-container">
                                {html2canvasImage ? (
                                    <img src={html2canvasImage} alt="html2canvas Output" className="output-img" />
                                ) : (
                                    <div className="placeholder">Click capture to see result</div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Demo;
