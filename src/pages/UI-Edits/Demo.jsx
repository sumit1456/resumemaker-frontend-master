import React, { useEffect, useRef, useState } from 'react';
import { GeometrySnapshot, PixiRenderer } from './WebglEngine';
import * as PIXI from 'pixi.js';
import { FlexibleHeaderSection } from './BaseTemplates';

const Demo = () => {
    const sourceRef = useRef(null);
    const canvasRef = useRef(null);
    const [snapshot, setSnapshot] = useState(null);
    const [renderTime, setRenderTime] = useState(0);

    const runTest = async () => {
        if (!sourceRef.current || !canvasRef.current) return;

        // Cleanup
        while (canvasRef.current.firstChild) {
            canvasRef.current.removeChild(canvasRef.current.firstChild);
        }

        const app = new PIXI.Application();
        await app.init({
            width: 800,
            height: 1000,
            backgroundColor: 0xf8f9fa,
            resolution: 2,
            antialias: true
        });
        canvasRef.current.appendChild(app.canvas);

        const scanner = new GeometrySnapshot();

        // Simulating layout settle
        await new Promise(r => setTimeout(r, 200));

        const t0 = performance.now();
        const data = scanner.capture(sourceRef.current);
        const t1 = performance.now();

        const renderer = new PixiRenderer(null, {
            width: 800,
            height: 1000,
            backgroundColor: 'transparent'
        });

        const container = new PIXI.Container();
        app.stage.addChild(container);

        renderer.render(data, { targetContainer: container });

        setSnapshot(data);
        setRenderTime(Math.round(t1 - t0));

        if (scanner.verifyCapture) {
            scanner.verifyCapture();
        }
    };

    // STRESS TEST CONFIG FOR HEADER
    const headerConfig = {
        header: {
            container: {
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', // Gradient
                padding: '40px',
                color: '#ffffff',
                marginBottom: '20px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
            },
            nameStyle: {
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#ffffff',
                letterSpacing: '-1px',
                marginBottom: '10px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            },
            titleStyle: {
                fontSize: '20px',
                color: '#bfdbfe',
                fontWeight: '500',
                marginBottom: '20px'
            },
            contactZone: {
                marginTop: '10px'
            },
            contactItemContainer: {
                marginRight: '20px',
                marginBottom: '10px'
            },
            contactItemStyle: {
                color: '#e0f2fe',
                fontSize: '14px'
            },
            contactIconColor: '#93c5fd',
            showTitle: true,
            showContact: true,
            showContactIcons: true,
            contactItems: ['email', 'phone', 'location', 'linkedin']
        }
    };

    const resumeDetails = {
        name: "Gradient Test User",
        title: "Senior Visual Designer",
        contact: {
            email: "designer@example.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA",
            linkedin: "linkedin.com/in/designer"
        }
    };

    return (
        <div style={{ padding: 20, fontFamily: 'Arial, sans-serif', background: '#333', minHeight: '100vh', color: '#fff', top: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Template Header Stress Test</h1>
                <div>
                    <button
                        onClick={runTest}
                        style={{
                            padding: '12px 24px',
                            fontSize: '18px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                        }}
                    >
                        ⚡ RUN COMPARAISON
                    </button>
                    <span style={{ marginLeft: 20, fontSize: 14, color: '#aaa' }}>
                        {snapshot ? `Captured ${snapshot.nodes.length} nodes in ${renderTime}ms` : 'Click to start'}
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>

                {/* SOURCE DOM */}
                <div>
                    <h3 style={{ textAlign: 'center', color: '#aaa' }}>BaseTemplate Component</h3>
                    <div
                        ref={sourceRef}
                        style={{
                            width: 800,
                            minHeight: 400,
                            background: 'white',
                            color: '#000',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <FlexibleHeaderSection
                            resumeDetails={resumeDetails}
                            styleConfig={headerConfig}
                        />

                        {/* Control Text to see stacking */}
                        <div style={{ padding: 40 }}>
                            <p>This section tests if the <strong>FlexibleHeaderSection</strong> outputs geometry correctly.</p>
                            <div style={{
                                height: 100,
                                background: 'rgba(255,0,0,0.1)',
                                border: '1px dashed red',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                Control Box (Should be below header)
                            </div>
                        </div>
                    </div>
                </div>

                {/* WEBGL OUTPUT */}
                <div style={{ backgroundColor: 'white' }}>
                    <h3 style={{ textAlign: 'center', color: '#aaa' }}>WebGL Output</h3>
                    <div ref={canvasRef} style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}></div>
                </div>

            </div>
        </div>
    );
};

export default Demo;
