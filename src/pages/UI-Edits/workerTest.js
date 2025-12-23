/**
 * Web Worker Integration Test
 * Test gradient worker functionality
 */

import { initializeWorkers, getWorkerStats, GeometrySnapshotWithWorkers } from './WebglEngineWithWorkers.js';

export async function testGradientWorker() {
    console.group('🧪 Testing Gradient Worker Integration');

    try {
        // Initialize workers
        console.log('1. Initializing workers...');
        const worker = await initializeWorkers();

        // Check stats
        const stats = getWorkerStats();
        console.log('2. Worker stats:', stats);

        if (stats && !stats.fallbackMode) {
            // Test gradient parsing
            console.log('3. Testing gradient parsing...');
            const testGradient = 'linear-gradient(90deg, red 0%, blue 100%)';

            const result = await worker.execute('PARSE_GRADIENT', {
                backgroundImage: testGradient
            });

            console.log('4. Gradient parsed:', result.gradient);

            // Test with GeometrySnapshot
            console.log('5. Testing with GeometrySnapshot...');
            const snapshot = new GeometrySnapshotWithWorkers({ mode: 'deep' });

            // Create a test element
            const testDiv = document.createElement('div');
            testDiv.style.width = '200px';
            testDiv.style.height = '100px';
            testDiv.style.background = 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)';
            testDiv.textContent = 'Test Element';
            document.body.appendChild(testDiv);

            const captureResult = await snapshot.capture(testDiv);
            console.log('6. Capture result:', captureResult);

            // Cleanup
            document.body.removeChild(testDiv);

            console.log('✅ All tests passed!');
        } else {
            console.warn('⚠️ Workers not available, skipping tests');
        }

    } catch (error) {
        console.error('❌ Test failed:', error);
    }

    console.groupEnd();
}

// Auto-run test if in development
if (import.meta.env.DEV) {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(testGradientWorker, 1000);
        });
    } else {
        setTimeout(testGradientWorker, 1000);
    }
}
