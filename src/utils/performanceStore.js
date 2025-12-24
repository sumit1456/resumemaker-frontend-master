
/**
 * Simple performance store for tracking real-time metrics
 */

class PerformanceStore {
    constructor() {
        this.metrics = {
            fps: 0,
            memory: 0,
            snapshots: {}, // sectionName -> { time, nodeCount }
            renders: [],   // list of { time, type }
            heavyElements: []
        };
        this.subscribers = new Set();
        this.frameTime = 0;
        this.lastFrameStamp = performance.now();

        // Start FPS tracking
        this.trackFPS();
    }

    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    notify() {
        this.subscribers.forEach(cb => cb(this.metrics));
    }

    updateSnapshot(sectionName, time, nodeCount) {
        this.metrics.snapshots[sectionName] = { time, nodeCount };
        this.updateHeavyElements();
        this.notify();
    }

    updateRender(time, type) {
        this.metrics.renders.unshift({ time, type, timestamp: Date.now() });
        if (this.metrics.renders.length > 10) this.metrics.renders.pop();
        this.notify();
    }

    updateHeavyElements() {
        const list = Object.entries(this.metrics.snapshots)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.time - a.time)
            .slice(0, 5);

        this.metrics.heavyElements = list;
    }

    trackFPS() {
        const tick = () => {
            const now = performance.now();
            const delta = now - this.lastFrameStamp;
            this.lastFrameStamp = now;

            this.metrics.fps = Math.round(1000 / delta);

            if (performance.memory) {
                this.metrics.memory = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
            }

            this.notify();
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }
}

const perfStore = new PerformanceStore();
export default perfStore;
