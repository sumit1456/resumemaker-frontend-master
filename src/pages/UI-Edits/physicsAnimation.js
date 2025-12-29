// Matter.js Physics Animation for Section Bouncing
export const createPhysicsAnimation = (sectionPositions, sectionHeights, setSectionPositions, setIsAnimating) => {
    return import('matter-js').then((Matter) => {
        const Engine = Matter.Engine;
        const Bodies = Matter.Bodies;
        const World = Matter.World;

        const sectionNames = Object.keys(sectionPositions);
        const originalPositions = { ...sectionPositions };

        // Create physics engine
        const engine = Engine.create({ gravity: { x: 0, y: 0.4 } });
        const bodies = [];

        // Create physics bodies for each section
        sectionNames.forEach((name) => {
            const pos = sectionPositions[name];
            const height = sectionHeights[name] ? parseInt(sectionHeights[name]) || 80 : 80;
            const mass = height / 40; // Larger sections are heavier

            const body = Bodies.rectangle(
                pos.x + 287.5,
                pos.y + height / 2,
                575,
                height,
                {
                    mass: mass,
                    restitution: 0.85, // Bounciness
                    friction: 0.005,
                    frictionAir: 0.015,
                    label: name,
                    velocity: {
                        x: (Math.random() - 0.5) * 3,
                        y: -8 - Math.random() * 7 // Strong upward thrust
                    }
                }
            );

            bodies.push(body);
            World.add(engine.world, body);
        });

        let animationFrame;
        const startTime = Date.now();
        const duration = 3500;

        const animate = () => {
            const elapsed = Date.now() - startTime;

            if (elapsed < duration) {
                Engine.update(engine, 1000 / 60);

                setSectionPositions(prev => {
                    const updated = {};
                    bodies.forEach(body => {
                        const name = body.label;
                        const height = sectionHeights[name] ? parseInt(sectionHeights[name]) || 80 : 80;
                        updated[name] = {
                            x: Math.max(0, Math.min(20, body.position.x - 287.5)),
                            y: Math.max(0, Math.min(800, body.position.y - height / 2))
                        };
                    });
                    return updated;
                });

                animationFrame = requestAnimationFrame(animate);
            } else {
                setSectionPositions(originalPositions);
                setIsAnimating(false);
                World.clear(engine.world);
                Engine.clear(engine);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            World.clear(engine.world);
            Engine.clear(engine);
        };
    }).catch(err => {
        console.error('Matter.js failed:', err);
        setIsAnimating(false);
    });
};
