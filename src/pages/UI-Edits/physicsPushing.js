import Matter from 'matter-js';

/**
 * PhysicsPushingManager
 * Uses Matter.js to handle real-time pushing/displacement of resume sections.
 */
export class PhysicsPushingManager {
    constructor(sections, snapshot, sectionWidths, sectionHeights) {
        this.engine = Matter.Engine.create({
            gravity: { x: 0, y: 0 },
            enableSleeping: false
        });

        this.world = this.engine.world;
        this.bodies = {};

        // Create bodies for each section
        sections.forEach(([id, pos]) => {
            // Get dimensions from widths/heights or snapshot
            const wStr = sectionWidths?.[id] || (snapshot?.[id]?.width) || 575;
            const hStr = sectionHeights?.[id] || (snapshot?.[id]?.height) || 120;

            const width = typeof wStr === 'string' ? parseInt(wStr) : wStr;
            const height = typeof hStr === 'string' ? parseInt(hStr) : hStr;

            const body = Matter.Bodies.rectangle(
                pos.x + width / 2,
                pos.y + height / 2,
                width,
                height,
                {
                    label: id,
                    frictionAir: 0.2, // Dampen movement
                    restitution: 0,   // No bounce for "pushing"
                    inertia: Infinity, // Prevent rotation
                    friction: 0.1,
                    slop: 0.1,         // Allow small overlap for stability
                    mass: id === 'header' ? 100 : 1 // Header is heavier/harder to move?
                }
            );

            this.bodies[id] = body;
            Matter.World.add(this.world, body);
        });
    }

    /**
     * Update the position of the dragged section and step the physics world.
     */
    updateDragging(id, x, y) {
        const body = this.bodies[id];
        if (!body) return;

        // Calculate current center
        const width = body.bounds.max.x - body.bounds.min.x;
        const height = body.bounds.max.y - body.bounds.min.y;

        // Use Matter.Body.setPosition to move the dragged item
        Matter.Body.setPosition(body, {
            x: x + width / 2,
            y: y + height / 2
        });

        // Reset velocity for the dragged body so it doesn't "fling" others
        Matter.Body.setVelocity(body, { x: 0, y: 0 });

        // Run several engine steps for better collision resolution per frame
        for (let i = 0; i < 6; i++) {
            Matter.Engine.update(this.engine, 1000 / 60 / 6);
        }
    }

    /**
     * Get updated positions for all sections.
     */
    getPositions() {
        const positions = {};
        Object.entries(this.bodies).forEach(([id, body]) => {
            const width = body.bounds.max.x - body.bounds.min.x;
            const height = body.bounds.max.y - body.bounds.min.y;

            positions[id] = {
                x: Math.round(body.position.x - width / 2),
                y: Math.round(body.position.y - height / 2)
            };
        });
        return positions;
    }

    /**
     * Cleanup physics resources.
     */
    destroy() {
        if (this.world) Matter.World.clear(this.world);
        if (this.engine) Matter.Engine.clear(this.engine);
        this.bodies = {};
    }
}
