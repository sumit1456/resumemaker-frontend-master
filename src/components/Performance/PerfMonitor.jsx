
import React, { useEffect, useState } from 'react';
import perfStore from '../../utils/performanceStore';

const PerfMonitor = () => {
    const [metrics, setMetrics] = useState(perfStore.metrics);
    const [minimized, setMinimized] = useState(false);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const unsubscribe = perfStore.subscribe(newMetrics => {
            setMetrics({ ...newMetrics });
        });
        return unsubscribe;
    }, []);

    if (!visible) return (
        <button
            onClick={() => setVisible(true)}
            style={{
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                zIndex: 9999,
                background: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '12px'
            }}
        >
            📈
        </button>
    );

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            zIndex: 9999,
            background: 'rgba(20, 20, 20, 0.85)',
            backdropFilter: 'blur(10px)',
            color: '#00ff00',
            padding: '12px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            border: '1px solid #444',
            width: minimized ? '120px' : '280px',
            transition: 'all 0.3s ease',
            userSelect: 'none'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid #444', paddingBottom: '4px' }}>
                <span style={{ fontWeight: 'bold', color: '#fff' }}>🚀 PERF MONITOR</span>
                <div>
                    <span onClick={() => setMinimized(!minimized)} style={{ cursor: 'pointer', marginRight: '8px' }}>{minimized ? '□' : '—'}</span>
                    <span onClick={() => setVisible(false)} style={{ cursor: 'pointer' }}>✕</span>
                </div>
            </div>

            {!minimized && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>FPS:</span>
                        <span style={{ color: metrics.fps > 50 ? '#00ff00' : metrics.fps > 30 ? '#ffff00' : '#ff0000' }}>
                            {metrics.fps}
                        </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>Memory:</span>
                        <span>{metrics.memory} MB</span>
                    </div>

                    <div style={{ marginTop: '10px' }}>
                        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '10px', marginBottom: '4px' }}>HEAVY ELEMENTS (Capture Time)</div>
                        {metrics.heavyElements.length === 0 ? (
                            <div style={{ color: '#888', fontStyle: 'italic' }}>No data yet...</div>
                        ) : (
                            metrics.heavyElements.map((el, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontSize: '11px' }}>
                                    <span style={{ color: '#aaa' }}>{el.name}:</span>
                                    <span style={{ color: el.time > 50 ? '#ff0000' : el.time > 20 ? '#ffff00' : '#00ff00' }}>
                                        {el.time.toFixed(1)}ms <span style={{ color: '#666' }}>({el.nodeCount}n)</span>
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    <div style={{ marginTop: '10px' }}>
                        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '10px', marginBottom: '4px' }}>RECENT RENDERS</div>
                        {metrics.renders.slice(0, 3).map((r, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888' }}>
                                <span>{r.type}:</span>
                                <span>{r.time.toFixed(1)}ms</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '12px', fontSize: '10px', color: '#666', borderTop: '1px solid #333', paddingTop: '4px' }}>
                        Tip: Higher node counts increase capture time.
                    </div>
                </>
            )}

            {minimized && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>FPS: {metrics.fps}</span>
                    <span>{metrics.memory}M</span>
                </div>
            )}
        </div>
    );
};

export default PerfMonitor;
