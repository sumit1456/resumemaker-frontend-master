import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GeometrySnapshot, PixiRenderer } from './WebglEngine';
import * as PIXI from 'pixi.js';
import html2canvas from 'html2canvas';
import * as htmlToImage from 'html-to-image';

const ResumeCard = ({ isAnimating, sectionOrder }) => (
    <div style={{ background: '#f8fafc', color: 'black', padding: '15px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
        {sectionOrder.map((sectionId) => {
            if (sectionId === 'header') return (
                <div key="header" className={`tilt-section ${isAnimating ? 'anim-pulse' : ''}`} style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                    padding: '15px', borderRadius: '10px', boxShadow: '0 8px 12px -3px rgba(59, 130, 246, 0.3)'
                }}>
                    <h3 style={{ color: 'white', margin: 0, fontSize: '16px' }}>Senior Architect</h3>
                    <p style={{ color: '#bfdbfe', margin: '2px 0 0 0', fontSize: '11px' }}>Fidelity Enthusiast</p>
                </div>
            );

            if (sectionId === 'icons') return (
                <div key="icons" className="tilt-section" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div className={isAnimating ? 'anim-rotate' : ''} style={{ width: '35px', height: '35px', background: '#3b82f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
                        ★
                    </div>
                    <div className={isAnimating ? 'anim-slide' : ''} style={{ flex: 1, padding: '8px', background: '#fff', border: '1px solid #ddd', borderRadius: '6px', fontSize: '11px' }}>
                        CSS transform...
                    </div>
                </div>
            );

            if (sectionId === 'dashed') return (
                <div key="dashed" className="tilt-section bloom-effect" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ border: '2px dashed #3b82f6', borderRadius: '8px', padding: '10px', textAlign: 'center', fontSize: '10px' }}>
                        Dashed
                    </div>
                    <div style={{ border: '3px dotted #ec4899', borderRadius: '50%', width: '40px', height: '40px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                        Dot
                    </div>
                </div>
            );

            if (sectionId === 'image') return (
                <div key="image" className="tilt-section" style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                    <img src="/image.jpg" style={{ width: '100%', height: '70px', objectFit: 'cover' }} />
                </div>
            );

            return null;
        })}
    </div>
);

const Demo = () => {
    const sourceRef = useRef(null);
    const webglRef = useRef(null);
    const html2canvasRef = useRef(null);
    const htmlToImageRef = useRef(null);

    // Live Sync Refs
    const liveWebglCanvasRef = useRef(null);
    const liveH2cRef = useRef(null);
    const liveHtiRef = useRef(null);
    const pixiAppRef = useRef(null);
    const pixiRendererRef = useRef(null);

    const [snapshot, setSnapshot] = useState(null);
    const [stats, setStats] = useState({
        webgl: 0,
        h2c: 0,
        hti: 0,
        nodes: 0
    });

    const [isAnimating, setIsAnimating] = useState(false);
    const [isLiveSync, setIsLiveSync] = useState(false);
    const [liveStats, setLiveStats] = useState({
        webglFps: 0,
        h2cFps: 0,
        htiFps: 0
    });

    const [sectionOrder, setSectionOrder] = useState(['header', 'icons', 'dashed', 'image']);

    const shuffleLayout = () => {
        setSectionOrder([...sectionOrder].sort(() => Math.random() - 0.5));
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (pixiAppRef.current) {
                pixiAppRef.current.destroy(true, { children: true, texture: true, baseTexture: true });
            }
        };
    }, []);

    const runTest = async () => {
        if (!sourceRef.current || !webglRef.current || !html2canvasRef.current || !htmlToImageRef.current) return;

        // 1. Cleanup
        const clear = (ref) => {
            if (ref.current) {
                while (ref.current.firstChild) ref.current.removeChild(ref.current.firstChild);
            }
        };
        clear(webglRef);
        clear(html2canvasRef);
        clear(htmlToImageRef);

        // 2. Settlement
        await new Promise(r => setTimeout(r, 800));

        // 3. CAPTURE PHASE
        const scanner = new GeometrySnapshot({ mode: 'deep' });
        const data = scanner.capture(sourceRef.current);
        setSnapshot(data);

        // --- ENGINE 1: CUSTOM WEBGL (PIXI) ---
        const t0_webgl = performance.now();
        const app = new PIXI.Application();
        await app.init({
            width: data.width,
            height: data.height,
            backgroundAlpha: 0,
            resolution: 2,
            antialias: true
        });

        app.canvas.style.width = '100%';
        app.canvas.style.height = 'auto';
        webglRef.current.appendChild(app.canvas);

        const renderer = new PixiRenderer(null, {
            width: data.width,
            height: data.height
        });
        const webglContainer = new PIXI.Container();
        app.stage.addChild(webglContainer);
        renderer.render(data, { targetContainer: webglContainer });
        const t1_webgl = performance.now();


        // --- ENGINE 2: HTML2CANVAS ---
        const t0_h2c = performance.now();
        const h2cCanvas = await html2canvas(sourceRef.current, {
            scale: 2,
            backgroundColor: null,
            logging: false
        });
        h2cCanvas.style.width = '100%';
        h2cCanvas.style.height = 'auto';
        html2canvasRef.current.appendChild(h2cCanvas);
        const t1_h2c = performance.now();

        // --- ENGINE 3: HTML-TO-IMAGE ---
        const t0_hti = performance.now();
        try {
            const htiCanvas = await htmlToImage.toCanvas(sourceRef.current, {
                pixelRatio: 2,
                backgroundColor: '#ffffff'
            });
            htiCanvas.style.width = '100%';
            htiCanvas.style.height = 'auto';
            htmlToImageRef.current.appendChild(htiCanvas);
        } catch (err) {
            console.error('html-to-image failed:', err);
        }
        const t1_hti = performance.now();


        setStats({
            webgl: t1_webgl - t0_webgl,
            h2c: t1_h2c - t0_h2c,
            hti: t1_hti - t0_hti,
            nodes: data.nodes.length
        });
    };

    // --- LIVE SYNC LOOP ---
    useEffect(() => {
        let rafId;
        let lastTime = performance.now();
        let frameCounts = { webgl: 0, h2c: 0, hti: 0 };
        let lastFpsUpdate = performance.now();

        const scanner = new GeometrySnapshot({ mode: 'deep' });
        const dynamicSourceRef = document.getElementById('dynamic-dom-source');

        const loop = async () => {
            if (!isLiveSync) return;

            const now = performance.now();

            // 1. WEBGL SYNC (Ultra Fast)
            if (dynamicSourceRef && liveWebglCanvasRef.current) {
                if (!pixiAppRef.current) {
                    const bounds = dynamicSourceRef.getBoundingClientRect();
                    const app = new PIXI.Application();
                    await app.init({
                        width: bounds.width,
                        height: bounds.height,
                        backgroundAlpha: 0,
                        resolution: 2
                    });
                    app.canvas.style.width = '100%';
                    app.canvas.style.height = 'auto';
                    liveWebglCanvasRef.current.appendChild(app.canvas);
                    pixiAppRef.current = app;
                    pixiRendererRef.current = new PixiRenderer(null, { width: bounds.width, height: bounds.height });
                }

                const data = scanner.capture(dynamicSourceRef);
                if (pixiAppRef.current.stage.children.length > 0) {
                    pixiAppRef.current.stage.removeChildren();
                }
                const container = new PIXI.Container();
                pixiAppRef.current.stage.addChild(container);
                pixiRendererRef.current.render(data, { targetContainer: container });
                frameCounts.webgl++;
            }

            // 2. HTML2CANVAS (Heavy - Throttle to attempt every few frames)
            if (frameCounts.webgl % 30 === 0) {
                try {
                    const canvas = await html2canvas(dynamicSourceRef, { scale: 1, logging: false });
                    if (liveH2cRef.current) {
                        while (liveH2cRef.current.firstChild) liveH2cRef.current.removeChild(liveH2cRef.current.firstChild);
                        canvas.style.width = '100%';
                        liveH2cRef.current.appendChild(canvas);
                        frameCounts.h2c++;
                    }
                } catch (e) { }
            }

            // 3. HTML-TO-IMAGE (Slugish)
            if (frameCounts.webgl % 60 === 0) {
                try {
                    const canvas = await htmlToImage.toCanvas(dynamicSourceRef, { pixelRatio: 1 });
                    if (liveHtiRef.current) {
                        while (liveHtiRef.current.firstChild) liveHtiRef.current.removeChild(liveHtiRef.current.firstChild);
                        canvas.style.width = '100%';
                        liveHtiRef.current.appendChild(canvas);
                        frameCounts.hti++;
                    }
                } catch (e) { }
            }

            // Update FPS stats every second
            if (now - lastFpsUpdate > 1000) {
                const dt = (now - lastFpsUpdate) / 1000;
                setLiveStats({
                    webglFps: Math.round(frameCounts.webgl / dt),
                    h2cFps: (frameCounts.h2c / dt).toFixed(1),
                    htiFps: (frameCounts.hti / dt).toFixed(1)
                });
                frameCounts = { webgl: 0, h2c: 0, hti: 0 };
                lastFpsUpdate = now;
            }

            rafId = requestAnimationFrame(loop);
        };

        if (isLiveSync) {
            rafId = requestAnimationFrame(loop);
        } else {
            // Stop animations if sync stops
            if (pixiAppRef.current) {
                // Keep the app but stop update loop
            }
        }

        return () => cancelAnimationFrame(rafId);
    }, [isLiveSync]);

    return (
        <div style={{ padding: '30px', background: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'Inter, sans-serif' }}>
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes slide {
                    0% { transform: translateX(-20px); }
                    50% { transform: translateX(20px); }
                    100% { transform: translateX(-20px); }
                }
                .anim-pulse { animation: pulse 2s infinite ease-in-out; }
                .anim-rotate { animation: rotate 4s infinite linear; }
                .anim-slide { animation: slide 3s infinite ease-in-out; }

                /* NEW: DYNAMIC PERCEPTION EFFECTS */
                .tilt-section {
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                }
                .tilt-section:hover {
                    transform: perspective(1000px) rotateX(10deg) rotateY(-5deg) scale(1.05);
                    z-index: 50;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
                }
                .bloom-effect:hover {
                    box-shadow: 0 0 30px rgba(59, 130, 246, 0.6) !important;
                    background: white !important;
                }
            `}</style>

            {/* TOOLBAR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#1e293b', padding: '20px', borderRadius: '16px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '30px' }}>🎨</span> WebGL Engine Benchmark
                    </h1>
                    <p style={{ margin: '5px 0 0 0', opacity: 0.6, fontSize: '13px' }}>
                        Comparing Custom WebGL vs Industry standard Libraries
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setIsAnimating(!isAnimating)} style={{
                        padding: '12px 20px', background: isAnimating ? '#ef4444' : '#1e293b',
                        color: 'white', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                    }}>
                        {isAnimating ? 'STOP ANIMATION' : 'START ANIMATION'}
                    </button>
                    <button onClick={shuffleLayout} style={{
                        padding: '12px 20px', background: '#1e293b',
                        color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                    }}>
                        SHUFFLE LAYOUT
                    </button>
                    <button onClick={runTest} style={{
                        padding: '12px 30px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                    }}>
                        RUN STATIC TEST
                    </button>
                </div>
            </div>

            {/* LIVE ANIMATION STRESS TEST (1x4 GRID) */}
            <div style={{ paddingTop: '20px', marginBottom: '60px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', background: '#1e293b', padding: '20px', borderRadius: '12px' }}>
                    <div>
                        <h3 style={{ margin: 0, color: '#f59e0b', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            🔥 Live Animation Stress Test
                        </h3>
                        <p style={{ margin: '5px 0 0 0', opacity: 0.6, fontSize: '13px' }}>Real-time sync performance across multiple engines.</p>
                    </div>
                    <button onClick={() => setIsLiveSync(!isLiveSync)} style={{
                        padding: '12px 30px', background: isLiveSync ? '#ef4444' : '#10b981',
                        color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
                    }}>
                        {isLiveSync ? 'STOP LIVE SYNC' : 'START LIVE SYNC'}
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                    <div>
                        <Label title="1. DOM" color="#94a3b8" />
                        <div style={{ background: '#f8fafc', borderRadius: '12px', height: '450px', overflow: 'hidden', border: '1px solid #334155' }}>
                            <div id="dynamic-dom-source">
                                <ResumeCard isAnimating={isAnimating} sectionOrder={sectionOrder} />
                            </div>
                        </div>
                    </div>

                    <div style={{ opacity: isLiveSync ? 1 : 0.5 }}>
                        <Label title="2. WebGL" color="#22c55e" fps={liveStats.webglFps} />
                        <div ref={liveWebglCanvasRef} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', height: '450px', border: '2px solid #22c55e' }} />
                    </div>

                    <div style={{ opacity: isLiveSync ? 1 : 0.5 }}>
                        <Label title="3. h2c" color="#ec4899" fps={liveStats.h2cFps} />
                        <div ref={liveH2cRef} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', height: '450px', border: '1px solid #334155' }} />
                    </div>

                    <div style={{ opacity: isLiveSync ? 1 : 0.5 }}>
                        <Label title="4. hti" color="#8b5cf6" fps={liveStats.htiFps} />
                        <div ref={liveHtiRef} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', height: '450px', border: '1px solid #334155' }} />
                    </div>
                </div>
            </div>

            {/* STATIC BENCHMARK (1x4 GRID) */}
            <div style={{ paddingBottom: '60px', borderTop: '1px solid #1e293b', paddingTop: '40px' }}>
                <h3 style={{ marginBottom: '25px', color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px' }}>⚡ Static Snapshot Benchmark</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                    <div>
                        <Label title="1. DOM" color="#94a3b8" />
                        <div style={{ background: '#f8fafc', borderRadius: '12px', height: '450px', overflow: 'hidden', border: '1px solid #334155' }}>
                            <div ref={sourceRef}>
                                <ResumeCard isAnimating={false} sectionOrder={sectionOrder} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label title="2. WebGL" color="#22c55e" time={stats.webgl} />
                        <div ref={webglRef} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', height: '450px', border: '2px solid #22c55e' }} />
                    </div>

                    <div>
                        <Label title="3. h2c" color="#ec4899" time={stats.h2c} />
                        <div ref={html2canvasRef} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', height: '450px', border: '1px solid #334155' }} />
                    </div>

                    <div>
                        <Label title="4. hti" color="#8b5cf6" time={stats.hti} />
                        <div ref={htmlToImageRef} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', height: '450px', border: '1px solid #334155' }} />
                    </div>
                </div>
            </div>

            {snapshot && (
                <div style={{ marginTop: '60px', textAlign: 'center', opacity: 0.5, fontSize: '12px' }}>
                    Interactive Engine active. Deconstructed {stats.nodes} DOM nodes into WebGL primitives in real-time.
                </div>
            )}
        </div>
    );
};

const Label = ({ title, color, time, fps }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
        <h4 style={{ margin: 0, color, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h4>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {time !== undefined && <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>{Number(time).toFixed(1)}ms</span>}
            {fps !== undefined && (
                <span style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: fps > 30 ? '#22c55e' : (fps > 10 ? '#eab308' : '#ef4444'),
                    background: 'rgba(0,0,0,0.3)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                }}>
                    {fps} FPS
                </span>
            )}
        </div>
    </div>
);

export default Demo;