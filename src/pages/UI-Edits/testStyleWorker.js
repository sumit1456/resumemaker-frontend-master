/**
 * Test Style Worker
 * Verifies that StyleWorker processes raw styles correctly
 */

import { getStyleWorker, terminateStyleWorker } from '../../workers/workerManager.js';

async function testStyleWorker() {
    console.log('🧪 Starting Style Worker Test...');

    const worker = getStyleWorker();
    const ready = await worker.initialize();

    if (!ready) {
        console.error('❌ Style Worker failed to initialize');
        return;
    }

    const rawStylesBatch = [
        {
            backgroundColor: 'rgb(255, 0, 0)',
            borderRadius: '10px',
            fontSize: '14px',
            opacity: '0.5',
            paddingTop: '5px',
            paddingRight: '10px',
            paddingBottom: '5px',
            paddingLeft: '10px',
            boxShadow: '10px 10px 5px #888888',
            transform: 'scale(1.1)',
            zIndex: 'auto'
        },
        {
            backgroundColor: 'transparent',
            borderRadius: '50%',
            fontSize: '20px',
            opacity: '1',
            paddingTop: '0px',
            paddingRight: '0px',
            paddingBottom: '0px',
            paddingLeft: '0px',
            boxShadow: 'none',
            transform: 'none',
            zIndex: '100'
        }
    ];

    console.log('Sending raw styles to worker...');
    const start = performance.now();
    const result = await worker.execute('PARSE_STYLES', { rawStylesBatch });
    const end = performance.now();

    if (result && result.processedBatch) {
        console.log(`✅ Received ${result.processedBatch.length} processed styles in ${(end - start).toFixed(2)}ms`);
        console.log('Sample result:', result.processedBatch[0]);

        // Assertions
        const first = result.processedBatch[0];
        if (first.fontSize === 14 && first.opacity === 0.5 && first.padding.top === 5) {
            console.log('✨ All assertions passed!');
        } else {
            console.error('❌ Assertions failed!', first);
        }
    } else {
        console.error('❌ No result from worker');
    }

    terminateStyleWorker();
}

// Check if running in browser
if (typeof window !== 'undefined') {
    testStyleWorker();
}
