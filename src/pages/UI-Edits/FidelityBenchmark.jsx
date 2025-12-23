import React, { useEffect, useRef, useState } from 'react';
import { GeometrySnapshotWithWorkers as GeometrySnapshot, PixiRenderer, initializeWorkers } from './WebglEngineWithWorkers';
import * as PIXI from 'pixi.js';

const FidelityBenchmark = () => {
    const sourceRef = useRef(null);
    const canvasRef = useRef(null);
    const liveSourceRef = useRef(null);
    const liveCanvasRef = useRef(null);
    const requestRef = useRef();
    const [stats, setStats] = useState({ nodes: 0, time: 0 });
    const [isLive, setIsLive] = useState(false);
    const [fps, setFps] = useState(0);
    const frameCount = useRef(0);
    const lastFpsTime = useRef(performance.now());

    const runBenchmark = async () => {
        if (!sourceRef.current || !canvasRef.current) return;

        // 1. Capture
        const scanner = new GeometrySnapshot({ mode: 'deep' });
        const data = await scanner.capture(sourceRef.current);

        // 2. Render
        const t0 = performance.now();
        const renderer = new PixiRenderer(canvasRef.current, {
            width: data.width,
            height: data.height,
            resolution: 4
        });

        await renderer.render(data);
        const t1 = performance.now();

        setStats({
            nodes: data.nodes.length,
            time: t1 - t0
        });
    };

    const liveRendererRef = useRef(null);

    const animate = async () => {
        if (!isLive || !liveSourceRef.current || !liveCanvasRef.current) return;

        // 1. Light Capture (Standard Mode) - fast for live sync
        const scanner = new GeometrySnapshot();
        const data = await scanner.capture(liveSourceRef.current);

        // 2. Initialize Renderer Once
        if (!liveRendererRef.current) {
            liveRendererRef.current = new PixiRenderer(liveCanvasRef.current, {
                width: data.width,
                height: data.height,
                resolution: 2, // 2x for live performance
                clear: true
            });
            // We need to wait for init if it's async, but PixiRenderer.render handles init internally usually
            // However, checking the implementation, we should execute it.
        }

        // 3. Render Reuse
        // Update dimensions if changed (optional, but good for responsiveness)
        if (liveRendererRef.current.app && (liveRendererRef.current.options.width !== data.width || liveRendererRef.current.options.height !== data.height)) {
            liveRendererRef.current.app.renderer.resize(data.width, data.height);
        }

        await liveRendererRef.current.render(data);

        // FPS Calculation
        frameCount.current++;
        const now = performance.now();
        if (now - lastFpsTime.current >= 1000) {
            setFps(frameCount.current);
            frameCount.current = 0;
            lastFpsTime.current = now;
        }

        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (isLive) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(requestRef.current);
            // Optional: Cleanup renderer on stop if desired, or keep it for resumption
            if (liveRendererRef.current) {
                liveRendererRef.current.destroy();
                liveRendererRef.current = null;
            }
        }
        return () => {
            cancelAnimationFrame(requestRef.current);
            if (liveRendererRef.current) {
                liveRendererRef.current.destroy();
                liveRendererRef.current = null;
            }
        };
    }, [isLive]);

    useEffect(() => {
        initializeWorkers();
    }, []);

    return (
        <div style={{ padding: '40px', background: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
            <h1>🚀 Fidelity Benchmark v2</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
                {/* SOURCE DOM */}
                <div>
                    <h3>DOM Source (The Truth)</h3>
                    <div ref={sourceRef} style={{ background: 'white', padding: '30px', borderRadius: '12px', color: '#333' }}>

                        {/* TEST 1: RICH TEXT */}
                        <section style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                            <h2 style={{ margin: '0 0 10px 0', borderBottom: '2px solid #3b82f6' }}>Rich Text Stress Test</h2>
                            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                This line contains <strong>Bold Text</strong>, <em>Italic Text</em>,
                                and <span style={{ color: '#ef4444', fontWeight: 'bold', textDecoration: 'underline' }}>Red Underlined Bold Text</span>.
                                We also have <span style={{ fontSize: '18px' }}>Large Text</span> and <small>Small Text</small> in the same block.
                            </p>
                        </section>

                        {/* TEST 2: COMPLEX GRADIENTS */}
                        <section style={{ marginBottom: '20px' }}>
                            <h3>Gradient Stress Test</h3>
                            <div style={{
                                height: '100px',
                                borderRadius: '12px',
                                background: 'linear-gradient(45deg, #f87171 0%, #3b82f6 50%, #10b981 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}>
                                Multi-stop Linear
                            </div>
                            <div style={{
                                height: '100px',
                                marginTop: '10px',
                                borderRadius: '50%',
                                width: '100px',
                                margin: '10px auto',
                                background: 'radial-gradient(circle, #fbbf24 0%, #ea580c 100%)',
                                border: '4px solid white',
                                boxShadow: '0 0 20px rgba(234, 88, 12, 0.4)'
                            }} />
                        </section>

                        {/* TEST 3: SHADOWS & OPACITY */}
                        <section style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                            <div style={{
                                width: '80px', height: '80px', background: '#8b5cf6',
                                boxShadow: '10px 10px 0px #ddd', borderRadius: '8px'
                            }}>Hard Shadow</div>
                            <div style={{
                                width: '80px', height: '80px', background: '#ec4899',
                                boxShadow: '0 0 15px 5px rgba(236, 72, 153, 0.5)', borderRadius: '50%'
                            }}>Glow</div>
                            <div style={{
                                width: '80px', height: '80px', background: '#3b82f6',
                                opacity: 0.5, borderRadius: '8px'
                            }}>50% Opacity</div>
                        </section>

                        {/* TEST 4: ANIMATION STRESS TEST */}
                        <section>
                            <h3>Animation Stress Test</h3>
                            <style>{`
                                @keyframes pulse-rotate {
                                    0% { transform: scale(1) rotate(0deg); }
                                    50% { transform: scale(1.1) rotate(180deg); opacity: 0.8; }
                                    100% { transform: scale(1) rotate(360deg); }
                                }
                            `}</style>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                animation: 'pulse-rotate 3s infinite linear',
                                boxShadow: '0 10px 20px rgba(168, 85, 247, 0.3)'
                            }}>
                                SPIN
                            </div>
                        </section>
                    </div>
                </div>

                {/* WEBGL RENDER */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>WebGL Render (The Engine)</h3>
                        <button onClick={runBenchmark} style={{
                            padding: '8px 16px', background: '#3b82f6', color: 'white',
                            border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                        }}>
                            RUN CAPTURE
                        </button>
                    </div>
                    <div ref={canvasRef} style={{ background: '#333', borderRadius: '12px', height: '500px', overflow: 'auto', border: '2px solid #3b82f6' }} />

                    {stats.nodes > 0 && (
                        <div style={{ marginTop: '15px', padding: '15px', background: '#2d3748', borderRadius: '8px', fontSize: '14px' }}>
                            ✅ <strong>Stats:</strong> Captured {stats.nodes} nodes in {stats.time.toFixed(2)}ms
                        </div>
                    )}
                </div>
            </div>

            {/* LIVE SYNC BENCHMARK */}
            <div style={{ marginTop: '50px', borderTop: '2px dashed #444', paddingTop: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>⚡ Live Sync & Animation Benchmark</h2>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: fps > 30 ? '#10b981' : '#f59e0b' }}>
                            {fps} FPS
                        </div>
                        <button
                            onClick={() => setIsLive(!isLive)}
                            style={{
                                padding: '12px 24px',
                                background: isLive ? '#ef4444' : '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '16px'
                            }}
                        >
                            {isLive ? '⏹ STOP SYNC' : '▶ START LIVE SYNC'}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    {/* ANIMATION SOURCE */}
                    <div>
                        <h3>Animation Source (CSS)</h3>
                        <div ref={liveSourceRef} style={{ background: 'white', padding: '40px', borderRadius: '12px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <style>{`
                                @keyframes fast-spin {
                                    0% { transform: rotate(0deg) scale(1); border-radius: 0%; background-color: #ef4444; }
                                    25% { transform: rotate(90deg) scale(1.2); border-radius: 25%; background-color: #3b82f6; }
                                    50% { transform: rotate(180deg) scale(1); border-radius: 50%; background-color: #10b981; }
                                    75% { transform: rotate(270deg) scale(0.8); border-radius: 25%; background-color: #f59e0b; }
                                    100% { transform: rotate(360deg) scale(1); border-radius: 0%; background-color: #ef4444; }
                                }
                                .anim-box {
                                    width: 100px;
                                    height: 100px;
                                    animation: fast-spin 2s infinite linear;
                                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
                                }
                            `}</style>
                            <div className="anim-box"></div>
                        </div>
                    </div>

                    {/* LIVE WEBGL TARGET */}
                    <div>
                        <h3>WebGL Live Mirror</h3>
                        <div ref={liveCanvasRef} style={{ background: '#333', borderRadius: '12px', height: '380px', border: '2px solid #10b981' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FidelityBenchmark;
