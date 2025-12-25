
import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentResume, setCurrentResumeId } from "../../redux/store.js";
import { mergeResumeData } from "./Utils";
import { ATS_TEMPLATE_CONFIG, MODERN_TEMPLATE_CONFIG, TWO_COLUMN_TEMPLATE_CONFIG, TEMPLATE5_CONFIG, HEADER_LAYOUTS, CONTACT_LAYOUTS, SKILLS_LAYOUTS } from "./TemplateConfigs";
import { defaultResumeData } from "./Utils";
import "./b3.css";
import {
  FlexibleCertificationsSection, FlexibleContactSection,
  FlexibleEducationSection, FlexibleExperienceSection,
  FlexibleHeaderSection, FlexibleProjectsSection,
  FlexibleSkillsSection, FlexibleSummarySection
} from "./BaseTemplates.jsx";
import { PixiRenderer, GeometrySnapshotWithWorkers as GeometrySnapshot, HybridRenderer, initializeWorkers } from "./WebglEngineWithWorkers.js";
import * as PIXI from 'pixi.js';
import { jsPDF } from "jspdf";





// ==================== WEBGL ENGINE COMPONENT ====================

const normalizeColorForInput = (color) => {
  if (!color || color === 'transparent') return '#ffffff';
  if (color.startsWith('#')) {
    if (color.length === 9) return color.slice(0, 7);
    return color;
  }
  return color;
};

const WebGLStage = forwardRef(({ width, height, shapes, lines, sections, sectionSnapshots, onDragEnd, onSelect, selectedId, type, isAnimating, onHeaderContainerReady, headerAnimating, headerAnimationRef, setHeaderAnimating, skillsAnimating, skillsAnimationRef, setSkillsAnimating, onSkillsContainerReady, yOffset = 0 }, ref) => {
  // Device-specific config (Calculated once per render)
  const isMobile = window.innerWidth < 768;
  const resolution = isMobile ? Math.max(window.devicePixelRatio || 1, 1) : 2;

  const containerRef = useRef(null);
  const pixiApp = useRef(null);
  const [initTrigger, setInitTrigger] = useState(0);

  // Layer Refs to avoid index-based access
  const layers = useRef({
    shapes: null,
    sections: null,
    lines: null
  });
  const sharedRenderer = useRef(null);

  // Robust Drag Session Ref
  const dragSession = useRef({
    active: false,
    type: null,
    id: null,
    target: null, // The Pixi Graphics/Container object
    offset: { x: 0, y: 0 },
    startX: 0,
    startY: 0,
    dragStartX: 0,
    dragStartY: 0
  });

  useEffect(() => {
    let isMounted = true;
    let app;

    const initPixi = async () => {
      if (!containerRef.current || !isMounted) return;

      const PIXI_LIB = PIXI || window.PIXI;
      // Initialize PixiJS Application (v8 style)
      app = new PIXI_LIB.Application();


      try {
        await app.init({
          width: width,
          height: height,
          background: '#ffffff',
          resolution: resolution,
          antialias: true,
          preference: 'webgl', // 🚀 Force WebGL preference in v8
        });

        // Apply 30% reduction scale if on mobile
        if (isMobile) {
          app.stage.scale.set(0.8);
        }

        if (!isMounted) {
          app.destroy(true);
          return;
        }

        console.log(`[WebGL] Initialized. Mobile: ${isMobile}, Res: ${resolution}`);

        pixiApp.current = app;

        // Verify container still exists before appending
        if (containerRef.current) {
          containerRef.current.appendChild(app.canvas || app.view);
        } else {
          app.destroy(true);
          return;
        }

        // Create layers
        const backgroundLayer = new PIXI.Container(); // 🆕 Explicit White Background
        const shapesLayer = new PIXI.Container();
        const linesLayer = new PIXI.Container();
        const sectionsLayer = new PIXI.Container();
        sectionsLayer.sortableChildren = true; // 🎯 Enable Z-index sorting

        layers.current.background = backgroundLayer;
        layers.current.shapes = shapesLayer;
        layers.current.sections = sectionsLayer;
        layers.current.lines = linesLayer;

        app.stage.addChild(backgroundLayer);
        app.stage.addChild(shapesLayer);
        app.stage.addChild(sectionsLayer);
        app.stage.addChild(linesLayer);


        // ⬜ Add White Background Graphic immediately
        const bgValues = { width: width / (isMobile ? 0.8 : 1), height: height / (isMobile ? 0.8 : 1) };
        const bgGraphic = new PIXI.Graphics();
        bgGraphic.rect(0, 0, bgValues.width, bgValues.height);
        bgGraphic.fill({ color: 0xffffff, alpha: 1 });
        backgroundLayer.addChild(bgGraphic);

        // Global Event Listeners (Stage-level) to ensure "Pick once. Move forever"
        app.stage.interactive = true;
        app.stage.hitArea = app.screen;

        app.stage.on('pointermove', (e) => {
          if (dragSession.current.active && dragSession.current.target) {
            const session = dragSession.current;
            const newPos = e.data.getLocalPosition(app.stage);

            // Calculate new position based on original offset
            const deltaX = newPos.x - session.dragStartX;
            const deltaY = newPos.y - session.dragStartY;

            const nextX = session.startX + deltaX;
            const nextY = session.startY + deltaY;

            session.target.x = nextX;
            session.target.y = nextY;

            // 😡 ANGRY SECTION EFFECT (Collision + Push)
            if (session.type === 'section') {
              const dragged = session.target;
              // AABB Collision Check against other sections
              const otherSections = sectionsLayer.children.filter(c => c !== dragged);

              otherSections.forEach(other => {
                const b1 = dragged.getBounds(); // using Pixi bounds (includes scale)
                const b2 = other.getBounds();

                // Simple overlap check
                const isOverlapping = (
                  b1.x < b2.x + b2.width &&
                  b1.x + b1.width > b2.x &&
                  b1.y < b2.y + b2.height &&
                  b1.y + b1.height > b2.y
                );

                if (isOverlapping) {
                  // 🔴 TINT RED (Angry)
                  other.tint = 0xFF9999;

                  // 📳 SHAKE (Vibrate)
                  const jitter = 2;
                  other.x += (Math.random() - 0.5) * jitter;
                  other.y += (Math.random() - 0.5) * jitter;

                  // ⬇️⬆️⬅️➡️ MULTI-DIRECTIONAL PUSH PHYSICS
                  // Calculate centers to determine push direction
                  const c1 = { x: b1.x + b1.width / 2, y: b1.y + b1.height / 2 };
                  const c2 = { x: b2.x + b2.width / 2, y: b2.y + b2.height / 2 };

                  const dx = c2.x - c1.x;
                  const dy = c2.y - c1.y;

                  // Determine dominant axis
                  if (Math.abs(dy) > Math.abs(dx)) {
                    // Vertical Push
                    if (dy > 0) {
                      // Dragged is above, push target DOWN
                      other.y += 5;
                    } else {
                      // Dragged is below, push target UP
                      other.y -= 5;
                    }
                  } else {
                    // Horizontal Push
                    if (dx > 0) {
                      // Dragged is left, push target RIGHT
                      other.x += 5;
                    } else {
                      // Dragged is right, push target LEFT
                      other.x -= 5;
                    }
                  }

                } else {
                  // Reset tint if not colliding
                  other.tint = 0xFFFFFF;
                }
              });
            }
          }
        });

        const endDrag = () => {
          if (dragSession.current.active) {
            const session = dragSession.current;
            const finalX = Math.round(session.target.x);
            const finalY = Math.round(session.target.y);

            // Cleanup tints
            if (session.type === 'section' && layers.current.sections) {
              layers.current.sections.children.forEach(c => c.tint = 0xFFFFFF);
            }

            console.log(`[DRAG] Global End: ${session.type} ${session.id} at (${finalX}, ${finalY})`);

            // 🎯 LOG HEADER SECTION FINAL POSITION AFTER DRAG
            if (session.id === 'header') {
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('🎨 HEADER DRAG COMPLETE - Final WebGL Coordinates');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('📍 Final Position:');
              console.log(`   X: ${finalX}px`);
              console.log(`   Y: ${finalY}px`);
              console.log('📊 Drag Delta:');
              console.log(`   ΔX: ${finalX - session.startX}px`);
              console.log(`   ΔY: ${finalY - session.startY}px`);
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            }

            // Capture new positions of ALL sections (since others might have been pushed)
            if (session.type === 'section') {
              const allPositions = {};
              if (layers.current.sections) {
                layers.current.sections.children.forEach(c => {
                  if (c._sectionName) {
                    allPositions[c._sectionName] = { x: Math.round(c.x), y: Math.round(c.y) };
                  }
                });
              }
              // Pass batch updates to callback
              onDragEnd(session.type, session.id, { x: finalX, y: finalY }, allPositions);
            } else {
              onDragEnd(session.type, session.id, { x: finalX, y: finalY });
            }
            session.active = false;
            session.target = null;
          }
        };

        app.stage.on('pointerup', endDrag);
        app.stage.on('pointerupoutside', endDrag);

        // Background click to deselect
        app.stage.on('pointerdown', (e) => {
          // Only deselect if clicking directly on stage (not on children)
          if (e.target === app.stage) {
            onSelect(null, null); // Deselect all
          }
        });

        // Force a re-render once initialized
        setInitTrigger(prev => prev + 1);

      } catch (err) {
        console.error("PixiJS init failed:", err);
      }
    };

    initPixi();

    return () => {
      isMounted = false;
      if (app) {
        try {
          // Robust destruction check
          if (app.renderer) {
            // 🎯 FIXED: Do not destroy textures/baseTextures here as they might be shared
            // or still needed by Page 1 when Page 2 unmounts.
            app.destroy(true);
          }
        } catch (e) {
          console.warn("PixiJS destruction error (likely already destroyed):", e);
        }
        pixiApp.current = null;
        layers.current = { shapes: null, sections: null, lines: null };
      }
    };
  }, [width, height]);

  // Expose Pixi App to Parent
  useImperativeHandle(ref, () => ({
    app: pixiApp.current,
    container: containerRef.current
  }));

  const parseColor = (cssColor) => {
    if (!cssColor || cssColor === 'transparent') return { hex: 0xffffff, alpha: 0 };

    // Improved parser from WebglEngine
    const PIXI_LIB = PIXI || window.PIXI;

    // 1. Hex
    if (cssColor.startsWith('#')) {
      const hex = cssColor.slice(1);
      if (hex.length === 3) {
        const fullHex = hex.split('').map(c => c + c).join('');
        return { hex: parseInt(fullHex, 16), alpha: 1 };
      }
      if (hex.length === 8) {
        return { hex: parseInt(hex.slice(0, 6), 16), alpha: parseInt(hex.slice(6, 8), 16) / 255 };
      }
      return { hex: parseInt(hex, 16), alpha: 1 };
    }

    // 2. RGB/RGBA
    if (cssColor.startsWith('rgb')) {
      const values = cssColor.match(/[\d.]+/g);
      if (values) {
        const r = parseInt(values[0]);
        const g = parseInt(values[1]);
        const b = parseInt(values[2]);
        const a = values[3] !== undefined ? parseFloat(values[3]) : 1;
        return { hex: (r << 16) | (g << 8) | b, alpha: a };
      }
    }

    // 3. Named colors (Minimal set)
    const colors = { red: 0xff0000, blue: 0x0000ff, green: 0x00ff00, black: 0x000000, white: 0xffffff, gray: 0x888888 };
    if (colors[cssColor.toLowerCase()]) {
      return { hex: colors[cssColor.toLowerCase()], alpha: 1 };
    }

    return { hex: 0xcccccc, alpha: 1 };
  };

  useEffect(() => {
    let active = true;
    const app = pixiApp.current;
    if (!app || !app.stage) return;

    const shapesLayer = layers.current.shapes;
    const sectionsLayer = layers.current.sections;
    const linesLayer = layers.current.lines;

    if (!shapesLayer || !sectionsLayer || !linesLayer) return;

    if (!sharedRenderer.current) {
      sharedRenderer.current = new PixiRenderer(null, {
        width: width,
        height: height,
        resolution: resolution
      });
    }

    const renderAll = async () => {
      if (!active) return;

      // � Memory Safeguard: Purge cache if it grows too large (indicates template switching/heavy editing)
      if (sharedRenderer.current && sharedRenderer.current.textureCache.size > 200) {
        console.log(`[PIXI MEMORY] Purging sharedRenderer texture cache (${sharedRenderer.current.textureCache.size} entries)`);
        sharedRenderer.current.purgeCache();
      }

      // 🚀 SURGICAL CLEANUP: Destroy old graphics to free GPU memory
      // Include backgroundLayer in cleanup
      [layers.current.background, shapesLayer, sectionsLayer, linesLayer].forEach(layer => {
        if (layer) {
          const children = [...layer.children];
          children.forEach(child => {
            if (sharedRenderer.current) {
              sharedRenderer.current.destroyDisplayObject(child);
            } else {
              child.destroy({ children: true });
            }
          });
          layer.removeChildren();
        }
      });

      // ⬜ Re-draw White Background Graphic (Handles resizing)
      if (layers.current.background) {
        const bgValues = { width: width / (isMobile ? 0.8 : 1), height: height / (isMobile ? 0.8 : 1) };
        const bgGraphic = new PIXI.Graphics();
        bgGraphic.rect(0, 0, bgValues.width, bgValues.height);
        bgGraphic.fill({ color: 0xffffff, alpha: 1 });
        layers.current.background.addChild(bgGraphic);
      }

      // Render Shapes
      shapes.forEach(shape => {
        const graphics = new PIXI.Graphics();
        const colorData = parseColor(shape.color);

        if (graphics.fill) {
          if (shape.type === 'circle') {
            graphics.circle(shape.width / 2, shape.height / 2, shape.width / 2);
          } else {
            graphics.rect(0, 0, shape.width, shape.height);
          }
          graphics.fill({ color: colorData.hex, alpha: colorData.alpha });
        } else {
          graphics.beginFill(colorData.hex, colorData.alpha);
          if (shape.type === 'circle') {
            graphics.drawCircle(shape.width / 2, shape.height / 2, shape.width / 2);
          } else {
            graphics.drawRect(0, 0, shape.width, shape.height);
          }
          graphics.endFill();
        }
        graphics.x = shape.x;
        graphics.y = shape.y - yOffset;
        graphics._id = shape.id;

        graphics.interactive = true;
        graphics.buttonMode = true;

        graphics.on('pointerdown', (event) => {
          onSelect('shape', shape.id);
          const pointerPos = event.data.getLocalPosition(graphics.parent);
          dragSession.current = {
            active: true,
            type: 'shape',
            id: shape.id,
            target: graphics,
            startX: graphics.x,
            startY: graphics.y,
            dragStartX: pointerPos.x,
            dragStartY: pointerPos.y
          };
        });

        shapesLayer.addChild(graphics);
      });

      // Render Lines
      lines.forEach(line => {
        const graphics = new PIXI.Graphics();
        const colorData = parseColor(line.color);
        const thickness = line.thickness || 1;

        if (graphics.stroke) {
          graphics.moveTo(line.x1, line.y1 - yOffset);
          graphics.lineTo(line.x2, line.y2 - yOffset);
          graphics.stroke({ color: colorData.hex, width: thickness, alpha: colorData.alpha });
        } else {
          graphics.lineStyle(thickness, colorData.hex, colorData.alpha);
          graphics.moveTo(line.x1, line.y1 - yOffset);
          graphics.lineTo(line.x2, line.y2 - yOffset);
        }

        graphics.interactive = true;
        graphics.buttonMode = true;
        graphics.hitArea = new PIXI.Rectangle(
          Math.min(line.x1, line.x2) - 3, // Tighter hitarea (3px instead of 5px)
          Math.min(line.y1, line.y2) - 3,
          Math.abs(line.x2 - line.x1) + 6,
          Math.abs(line.y2 - line.y1) + 6
        );
        graphics.on('pointerdown', () => {
          console.log(`[CLICK] Line clicked: ${line.id} (${line.label})`);
          onSelect('line', line.id);
        });

        linesLayer.addChild(graphics);
      });

      // Render Sections
      for (const [sectionName, pos] of sections) {
        const snapshot = sectionSnapshots[sectionName];
        if (snapshot) {
          const sectionContainer = new PIXI.Container();
          sectionContainer.x = pos.x;
          sectionContainer.y = pos.y - yOffset;
          sectionContainer.interactive = true;
          sectionContainer.buttonMode = true;
          sectionContainer.cursor = 'move';
          sectionContainer._sectionName = sectionName;

          // 🎯 Ensure entire section area is clickable, even if transparent
          // We add a 5px padding to make it easier to grab the edges
          sectionContainer.hitArea = new PIXI.Rectangle(-5, -5, snapshot.width + 10, snapshot.height + 10);

          // 🎯 Bring selected section to front
          sectionContainer.zIndex = selectedId === sectionName ? 100 : 0;

          // 🎯 LOG HEADER SECTION COORDINATES FOR GPU ANIMATION
          if (sectionName === 'header' || sectionName === 'education') {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`🎨 ${sectionName.toUpperCase()} SECTION - WebGL Rendering Coordinates`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📍 Position:');
            console.log(`   X: ${pos.x}px`);
            console.log(`   Y: ${pos.y}px`);
            console.log('📐 Dimensions:');
            console.log(`   Width: ${snapshot.width}px`);
            console.log(`   Height: ${snapshot.height}px`);
            console.log('🔲 Bounding Box:');
            console.log(`   Top-Left: (${pos.x}, ${pos.y})`);
            console.log(`   Top-Right: (${pos.x + snapshot.width}, ${pos.y})`);
            console.log(`   Bottom-Left: (${pos.x}, ${pos.y + snapshot.height})`);
            console.log(`   Bottom-Right: (${pos.x + snapshot.width}, ${pos.y + snapshot.height})`);
            console.log('🎯 Container Properties:');
            console.log(`   Container X: ${sectionContainer.x}`);
            console.log(`   Container Y: ${sectionContainer.y}`);
            console.log(`   Interactive: ${sectionContainer.interactive}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          }

          // 🎬 Store header container reference for animations
          if (sectionName === 'header' && onHeaderContainerReady) {
            onHeaderContainerReady(sectionContainer);
          }
          if (sectionName === 'skills' && onSkillsContainerReady) {
            onSkillsContainerReady(sectionContainer);
          }

          const borderInset = 5;
          const selectionBorder = new PIXI.Graphics();
          if (selectionBorder.stroke) {
            selectionBorder.rect(-borderInset, -borderInset, snapshot.width + borderInset * 2, snapshot.height + borderInset * 2);
            selectionBorder.stroke({ color: 0x3b82f6, width: 2, alpha: 0.8 });
          } else {
            selectionBorder.lineStyle(2, 0x3b82f6, 0.8);
            selectionBorder.drawRect(-borderInset, -borderInset, snapshot.width + borderInset * 2, snapshot.height + borderInset * 2);
          }
          selectionBorder.name = '_selectionBorder';
          selectionBorder.visible = selectedId === sectionName;
          sectionContainer.addChild(selectionBorder);

          // 🎯 Visual feedback on hover
          sectionContainer.on('pointerover', () => {
            sectionContainer.cursor = 'pointer';
            if (selectionBorder) selectionBorder.visible = true;
          });
          sectionContainer.on('pointerout', () => {
            if (selectionBorder && selectedId !== sectionName) selectionBorder.visible = false;
          });

          sectionContainer.on('pointerdown', (event) => {
            console.log(`[CLICK] Section: ${sectionName} | Pos: (${pos.x}, ${pos.y}) | Snap: ${snapshot.width}x${snapshot.height}`);
            event.stopPropagation();

            const pointerPos = event.data.getLocalPosition(sectionContainer.parent);
            dragSession.current = {
              active: true,
              type: 'section',
              id: sectionName,
              target: sectionContainer,
              startX: sectionContainer.x,
              startY: sectionContainer.y,
              dragStartX: pointerPos.x,
              dragStartY: pointerPos.y
            };
            onSelect('section', sectionName);
          });

          sectionsLayer.addChild(sectionContainer);

          await sharedRenderer.current.render(snapshot, { targetContainer: sectionContainer });
        }
      }

      // Restore drag target if active
      if (dragSession.current.active) {
        const { type, id } = dragSession.current;
        if (type === 'shape') {
          dragSession.current.target = shapesLayer.children.find(c => c._id === id);
        } else if (type === 'section') {
          dragSession.current.target = sectionsLayer.children.find(c => c._sectionName === id);
        }
      }

      // 📊 LOG TEXTURE COUNT FOR MEMORY LEAK TRACKING
      if (app.renderer && app.renderer.texture && app.renderer.texture.managedTextures) {
        console.log(`[PIXI MEMORY] Active textures in memory: ${app.renderer.texture.managedTextures.length}`);
      }
    };

    renderAll();
    return () => { active = false; };
  }, [shapes, lines, sections, sectionSnapshots, selectedId, initTrigger, isAnimating, yOffset, width, height, resolution]);

  // Animation Ticker - SEPARATE useEffect
  useEffect(() => {
    const app = pixiApp.current;
    if (!app || !isAnimating) return;

    let time = 0;
    let frameCount = 0;
    let lastLogTime = performance.now();

    const animate = () => {
      time += 0.05;
      frameCount++;

      // Animation loop (no logging)

      // Animate Sections (Bounce)
      const sectionsLayer = app.stage.children[1];
      if (sectionsLayer) {
        sectionsLayer.children.forEach((child, index) => {
          // 🚫 Skip header if it's currently doing a layout animation
          if (child._sectionName === 'header' && headerAnimating) return;

          // Simple sine wave bounce based on index
          child.y += Math.sin(time + index) * 4;
        });
      }
    };

    app.ticker.add(animate);

    return () => {
      app.ticker.remove(animate);
    };
  }, [isAnimating, initTrigger]);

  // 🎬 Header Layout Animation Ticker
  useEffect(() => {
    const app = pixiApp.current;
    if (!app || !headerAnimating) return;

    let frameCount = 0; // Local frame counter for this ticker

    const animateHeaderLayout = () => {
      const anim = headerAnimationRef.current;
      const sectionsLayer = app.stage.children[1];
      const headerContainer = sectionsLayer?.children.find(c => c._sectionName === 'header');

      if (!anim.active) return;

      if (!headerContainer) {
        frameCount++;
        if (frameCount % 60 === 0) console.warn('⚠️ [ANIM] Header container not found in stage!');
        return;
      }

      const elapsed = performance.now() - anim.startTime;
      const progress = Math.min(elapsed / anim.duration, 1);

      // Simple linear or ease-in fade
      const alpha = 1 - progress;

      // Force apply alpha to the container
      headerContainer.alpha = alpha;

      // Diagnostic logging
      const progressPercent = Math.round(progress * 100);
      if (progressPercent % 10 === 0 && progressPercent !== anim.lastLoggedPercent) {
        console.log(`🎬 [FADE] ${progressPercent}% | Alpha: ${alpha.toFixed(2)}`);
        anim.lastLoggedPercent = progressPercent;
      }

      if (progress >= 1) {
        anim.active = false;
        headerContainer.alpha = 1.0; // Reset to visible
        if (setHeaderAnimating) setHeaderAnimating(false);
        console.log('✅ Header fade-out (decoupled) complete!');
      }
    };

    app.ticker.add(animateHeaderLayout);
    return () => app.ticker.remove(animateHeaderLayout);
  }, [headerAnimating, initTrigger]);

  // 🎬 Skills Layout Animation Ticker
  useEffect(() => {
    const app = pixiApp.current;
    if (!app || !skillsAnimating) return;

    const animateSkillsLayout = () => {
      const anim = skillsAnimationRef.current;
      if (!anim.active) return;

      const sectionsLayer = app.stage.children[1];
      const skillsContainer = sectionsLayer?.children.find(c => c._sectionName === 'skills');
      if (!skillsContainer) return;

      const elapsed = performance.now() - anim.startTime;
      const progress = Math.min(elapsed / anim.duration, 1);

      // Fade out for skills too
      skillsContainer.alpha = 1 - progress;

      if (progress >= 1) {
        anim.active = false;
        skillsContainer.alpha = 1.0; // Reset to visible
        if (setSkillsAnimating) setSkillsAnimating(false);
      }
    };

    app.ticker.add(animateSkillsLayout);
    return () => app.ticker.remove(animateSkillsLayout);
  }, [skillsAnimating, initTrigger]);

  return (
    <div
      ref={containerRef}
      className="webgl-stage-container"
      style={{
        width: width,
        height: height,
        boxShadow: '0 0 20px rgba(0,0,0,0.1)',
        background: 'white',
        border: '2px solid red'
      }}
    />
  );
});


// ==================== MAIN UI EDITOR COMPONENT ====================

const UIEditor = () => {
  // Refs
  const sectionRefs = useRef({});
  const webGLStageRef1 = useRef(null);
  const webGLStageRef2 = useRef(null);


  // State
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumeId } = useParams();
  const userId = useSelector((s) => s.auth.userId);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showPage2, setShowPage2] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [sectionPositions, setSectionPositions] = useState({});
  const [lines, setLines] = useState([]);
  const [backgroundShapes, setBackgroundShapes] = useState([]);
  const [nextLineId, setNextLineId] = useState(1);
  const [nextShapeId, setNextShapeId] = useState(1);
  const [currentTemplate, setCurrentTemplate] = useState('ats');
  const [sectionWidths, setSectionWidths] = useState({});
  const [styleConfig, setStyleConfig] = useState(ATS_TEMPLATE_CONFIG);
  const [sectionSnapshots, setSectionSnapshots] = useState({});
  const [TemplateComponents, setTemplateComponents] = useState(null);
  const [resumeData, setResumeData] = useState(defaultResumeData);
  const currentResume = useSelector((state) => state.resume.currentResume);
  const currentResumeId = useSelector((state) => state.resume.resumeId);

  const [resumeDetails, setResumeDetails] = useState(defaultResumeData);
  const API_BASE_URL2 = 'http://localhost:8080';
  const API_BASE_URL = 'https://resumemaker-1.onrender.com';

  // 🎬 GPU Animation State
  const [headerAnimating, setHeaderAnimating] = useState(false);
  const [skillsAnimating, setSkillsAnimating] = useState(false); // New state for skills
  const [activeSectionAccordion, setActiveSectionAccordion] = useState('header'); // 🗂 Sub-section accordion state
  const headerContainerRef = useRef(null);
  const skillsContainerRef = useRef(null); // New ref for skills container

  const headerAnimationRef = useRef({
    active: false,
    startTime: 0,
    duration: 500, // 🎬 Reduced for decoupled feel
  });

  const skillsAnimationRef = useRef({
    active: false,
    startTime: 0,
    duration: 500, // 🎬 Reduced for decoupled feel
  });

  const handleSaveAll = async () => {
    if (userId == null) {
      // Assuming simple alert or toast if window.showMessage not available, 
      // but strictly following user pattern:
      if (window.showMessage) window.showMessage('Please Login First.', 'warning');
      else alert('Please Login First.');
      return;
    }
    setSaving(true);
    setSaveError("");
    setSuccessMessage("");

    try {
      // 1. Merge layout state into styleConfig
      const updatedConfig = {
        ...styleConfig,
        positions: sectionPositions,
        lines: lines,
        shapes: backgroundShapes,
        // You might want to store widths/heights if not already in styleConfig
      };

      const API_BASE_URL = `${API_BASE_URL}/saveAllConfig-ResumeData`;

      // 2. Build Payload
      const payload = {
        title: resumeDetails.resumeDetails?.title || "My Resume",
        templateId: "custom", // Or whatever logic you have
        userId: userId,
        details: {
          name: resumeDetails.resumeDetails?.name,
          title: resumeDetails.resumeDetails?.title,
          summary: resumeDetails.resumeDetails?.summary,
          styleConfig: updatedConfig // <--- STORING CONFIG HERE
        },
        contact: resumeDetails.resumeDetails?.contact,
        skills: resumeDetails.skills,
        experiences: resumeDetails.experiences,
        projects: resumeDetails.projects,
        educationList: resumeDetails.educationList,
        certifications: resumeDetails.certifications,
        showSummary: true, // You might want to make these dynamic
        showSkills: true,
        showExperience: true,
        showProjects: true,
        showEducation: true,
        showCertifications: true,
        customSections: resumeDetails.customSections || [],
        sectionTitles: resumeDetails.sectionTitles || {} // Add if you have state for this
      };

      const targetResumeId = resumeId || currentResumeId;
      const endpoint = targetResumeId
        ? `${API_BASE_URL}/update/${targetResumeId}`
        : `${API_BASE_URL}/saveall`;

      const method = targetResumeId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Save failed: ${res.status}`);
      }

      const data = await res.json();

      // Update Redux
      if (!targetResumeId && data.resumeId) {
        dispatch(setCurrentResumeId(data.resumeId));
      }

      const msg = "Resume configuration saved successfully!";
      setSuccessMessage(msg);
      if (window.showMessage) window.showMessage('Success', msg, 'success', 1500);

    } catch (err) {
      console.error("Save error:", err);
      setSaveError(err.message);
      if (window.showMessage) window.showMessage('Error', err.message, 'error', 1500);
    } finally {
      setSaving(false);
    }
  };

  // Mobile responsiveness state
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('controls'); // 'controls' | 'properties'
  const [isAnimating, setIsAnimating] = useState(false); // TEST ANIMATION STATE

  // Mobile detection effect
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setActiveTab('preview'); // Default to preview for clean look
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize Web Workers
  useEffect(() => {
    initializeWorkers().catch(err => console.error('Failed to initialize workers:', err));
  }, []);


  useEffect(() => {
    if (!currentResume) return;
    setResumeData(currentResume);
    setResumeDetails(currentResume); // Sync local resumeDetails state

    // If the resume has a saved style configuration, load it
    if (currentResume.details?.styleConfig) {
      const savedConfig = currentResume.details.styleConfig;
      setStyleConfig(savedConfig);

      if (savedConfig.positions) setSectionPositions(savedConfig.positions);
      if (savedConfig.lines) setLines(savedConfig.lines);
      if (savedConfig.shapes) setBackgroundShapes(savedConfig.shapes);

      // You might also want to load widths/heights if you decide to store them
      // setSectionWidths(savedConfig.widths || {}); 
    }
  }, [currentResume])

  // 🎬 GPU Header Layout Animation Handler
  const animateHeaderLayoutChange = async (newLayoutConfig) => {
    if (!headerContainerRef.current) {
      // Fallback: instant update if no WebGL container
      setStyleConfig(prev => ({
        ...prev,
        header: { ...prev.header, ...newLayoutConfig }
      }));
      return;
    }

    // 🚀 Start animating IMMEDIATELY to block DOM re-capture
    setHeaderAnimating(true);

    // 1. Capture current position
    const startX = headerContainerRef.current.x;
    const startY = headerContainerRef.current.y;

    // 2. Update config (this triggers DOM update for new snapshot)
    setStyleConfig(prev => ({
      ...prev,
      header: {
        ...prev.header,
        ...newLayoutConfig,
        // Deep merge styles
        nameStyle: { ...prev.header?.nameStyle, ...newLayoutConfig.nameStyle },
        titleStyle: { ...prev.header?.titleStyle, ...newLayoutConfig.titleStyle }
      }
    }));

    // 3. Wait for new coordinates to be calculated (DOM -> Snapshot -> WebGL Layout)
    // We use a shorter delay to ensure we catch the re-render frame early
    setTimeout(() => {
      // Find the header position in the freshly updated sectionPositions
      const endPos = sectionPositions.header || { x: startX, y: startY };

      // 4. Update GPU animation parameters for FADE-OUT
      headerAnimationRef.current = {
        active: true,
        startTime: performance.now(),
        duration: 800, // 800ms fade-out
        lastLoggedPercent: -1
      };

      setHeaderAnimating(true);
      console.log('🎬 FADE-OUT STARTED (2s)');
    }, 40); // Catch it quickly
  };

  // 🎬 GPU Skills Layout Animation Handler
  const animateSkillsLayoutChange = async (newLayoutConfig) => {
    if (!skillsContainerRef.current) {
      setStyleConfig(prev => ({
        ...prev,
        skills: { ...prev.skills, ...newLayoutConfig }
      }));
      return;
    }

    setSkillsAnimating(true);

    // Fade out
    skillsAnimationRef.current = {
      active: true,
      startTime: performance.now(),
      duration: 500,
      lastLoggedPercent: -1
    };

    setStyleConfig(prev => ({
      ...prev,
      skills: { ...prev.skills, ...newLayoutConfig }
    }));

    // Reset after animation
    setTimeout(() => {
      setSkillsAnimating(false);
    }, 600);
  };

  const TEMPLATES = {
    ats: ATS_TEMPLATE_CONFIG,
    modern: MODERN_TEMPLATE_CONFIG,
    twoColumn: TWO_COLUMN_TEMPLATE_CONFIG,
    template5: TEMPLATE5_CONFIG
  };

  // Initialize template on mount

  useEffect(() => {
    const defaultTemplate = TEMPLATES['ats'];
    setSectionPositions(defaultTemplate.positions || {});
    setLines(defaultTemplate.lines || []);
    setBackgroundShapes(defaultTemplate.shapes || []);

    // Initialize IDs
    if (defaultTemplate.lines && defaultTemplate.lines.length > 0) {
      setNextLineId(Math.max(...defaultTemplate.lines.map(l => l.id || 0)) + 1);
    }
    if (defaultTemplate.shapes && defaultTemplate.shapes.length > 0) {
      setNextShapeId(Math.max(...defaultTemplate.shapes.map(s => s.id || 0)) + 1);
    }
  }, []);


  // ==================== USE EFFECTS ====================

  // Initialize template components
  useEffect(() => {

    setTemplateComponents({
      header: FlexibleHeaderSection,
      contact: FlexibleContactSection,
      summary: FlexibleSummarySection,
      skills: FlexibleSkillsSection,
      experience: FlexibleExperienceSection,
      projects: FlexibleProjectsSection,
      education: FlexibleEducationSection,
      certifications: FlexibleCertificationsSection
    });

    // Initialize section refs
    const sections = ['header', 'contact', 'summary', 'skills', 'experience', 'education', 'projects', 'certifications'];
    sections.forEach(section => {
      if (!sectionRefs.current[section]) {
        sectionRefs.current[section] = React.createRef();
      }
    });
  }, []);



  const extractWidthsAndHeightsFromConfig = (config) => {
    const widths = {};
    const heights = {};
    Object.keys(config).forEach(key => {
      if (config[key]?.container?.width) {
        widths[key] = config[key].container.width;
      }
      if (config[key]?.container?.height) {
        heights[key] = config[key].container.height;
      }
    });
    return { widths, heights };
  };


  // Handle width change
  const handleWidthChange = (sectionName, value) => {
    setSectionWidths(prev => ({
      ...prev,
      [sectionName]: value
    }));
  };


  const [sectionHeights, setSectionHeights] = useState({});

  // Add this helper function with your other helper functions
  const handleHeightChange = (sectionName, value) => {
    setSectionHeights(prev => ({
      ...prev,
      [sectionName]: value
    }));
  };

  // Add this to apply height
  const handleHeightBlur = (sectionName) => {
    const height = sectionHeights[sectionName];
    setStyleConfig(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        container: {
          ...prev[sectionName]?.container,
          height: height
        }
      }
    }));
  };


  // Handle width blur (apply the width)
  const handleWidthBlur = (sectionName) => {
    const width = sectionWidths[sectionName];
    setStyleConfig(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        container: {
          ...prev[sectionName]?.container,
          width: width
        }
      }
    }));
  };

  // Helper to map generic 'bodyStyle' to section-specific style names
  const getStyleType = (sectionName, genericType) => {
    if (genericType !== 'bodyStyle') return genericType;
    const mappings = {
      header: 'nameStyle',
      skills: 'valueStyle',
      experience: 'positionStyle',
      projects: 'nameStyle',
      education: 'degreeStyle',
      certifications: 'itemStyle'
    };
    return mappings[sectionName] || 'bodyStyle';
  };

  // Handle style changes with smart section-to-property mapping
  const handleStyleChange = (sectionName, styleType, value, property) => {
    const targetType = getStyleType(sectionName, styleType);

    setStyleConfig(prev => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [targetType]: {
          ...prev[sectionName]?.[targetType],
          [property]: value
        }
      }
    }));
  };

  // Add these helper methods to your component

  const handleHeaderLayoutChange = (key, value) => {
    setStyleConfig(prev => ({
      ...prev,
      header: {
        ...prev.header,
        [key]: value
      }
    }));
  };

  const handleHeaderStyleChange = (styleKey, property, value) => {
    setStyleConfig(prev => ({
      ...prev,
      header: {
        ...prev.header,
        [styleKey]: {
          ...prev.header?.[styleKey],
          [property]: value
        }
      }
    }));
  };

  const handleSectionOrderChange = (currentIndex, direction) => {
    const currentOrder = styleConfig.header?.sectionOrder || ['name', 'title', 'contact'];
    const newOrder = [...currentOrder];

    if (direction === 'up' && currentIndex > 0) {
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
    } else if (direction === 'down' && currentIndex < newOrder.length - 1) {
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
    }

    setStyleConfig(prev => ({
      ...prev,
      header: {
        ...prev.header,
        sectionOrder: newOrder
      }
    }));
  };

  // Reset Layout
  // const resetLayout = () => {
  //   const template = TEMPLATES[currentTemplate];
  //   setSectionPositions(template.positions || {});
  //   setSectionWidths(extractWidthsFromConfig(template));
  //   setLines(template.lines || []);
  //   setBackgroundShapes(template.backgroundShapes || []);
  //   setZoom(1);

  //   // Reset line and shape ID counters
  //   if (template.lines && template.lines.length > 0) {
  //     setNextLineId(Math.max(...template.lines.map(l => l.id)) + 1);
  //   } else {
  //     setNextLineId(1);
  //   }
  //   if (template.backgroundShapes && template.backgroundShapes.length > 0) {
  //     setNextShapeId(Math.max(...template.backgroundShapes.map(s => s.id)) + 1);
  //   } else {
  //     setNextShapeId(1);
  //   }
  // };


  // Reset Layout - UPDATED
  const resetLayout = () => {
    const template = TEMPLATES[currentTemplate];
    setSectionPositions(template.positions || {});

    const { widths, heights } = extractWidthsAndHeightsFromConfig(template);
    setSectionWidths(widths);
    setSectionHeights(heights);

    setLines(template.lines || []);
    setBackgroundShapes(template.shapes || []);
    setZoom(1);

    // Reset line and shape ID counters
    if (template.lines && template.lines.length > 0) {
      setNextLineId(Math.max(...template.lines.map(l => l.id)) + 1);
    } else {
      setNextLineId(1);
    }
    if (template.shapes && template.shapes.length > 0) {
      setNextShapeId(Math.max(...template.shapes.map(s => s.id)) + 1);
    } else {
      setNextShapeId(1);
    }
  };

  // Download as image
  const downloadResume = async () => {
    const app = webGLStageRef1.current?.app;
    if (!app) {
      console.error("❌ WebGL App not found for Page 1");
      return;
    }

    try {
      // Use Pixi extraction for Page 1
      const canvas = await app.renderer.extract.canvas(app.stage);
      const uri = canvas.toDataURL('image/png', 1.0);

      const link = document.createElement('a');
      link.download = 'resume-design.png';
      link.href = uri;
      link.click();

      console.log('✅ Resume downloaded via WebGL extraction');
    } catch (err) {
      console.error('Failed to download resume:', err);
    }
  };

  // Download as PDF
  const downloadPDF = async () => {
    const app1 = webGLStageRef1.current?.app;
    if (!app1) {
      console.error("❌ WebGL App not found for Page 1");
      return;
    }

    try {
      console.log('📄 Starting PDF Generation...');

      // 1. Setup PDF (A4 size in points: 595.28 x 841.89)
      const pdf = new jsPDF('p', 'pt', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      // 2. Extract Page 1
      const canvas1 = await app1.renderer.extract.canvas(app1.stage);
      const imgData1 = canvas1.toDataURL('image/png', 1.0);

      pdf.addImage(imgData1, 'PNG', 0, 0, width, height);

      // 3. Extract Page 2 (if active)
      if (showPage2) {
        const app2 = webGLStageRef2.current?.app;
        if (app2) {
          console.log('📄 Adding Page 2...');
          const canvas2 = await app2.renderer.extract.canvas(app2.stage);
          const imgData2 = canvas2.toDataURL('image/png', 1.0);

          pdf.addPage();
          pdf.addImage(imgData2, 'PNG', 0, 0, width, height);
        }
      }

      // 4. Save
      pdf.save('resume-design.pdf');
      console.log('✅ PDF downloaded successfully');

    } catch (err) {
      console.error('Failed to download PDF:', err);
    }
  };

  // Handle canvas click (deselect)


  // Separate elements by page
  const getElementsForPage = (pageNum) => {
    const pageStart = (pageNum - 1) * 842;
    const pageEnd = pageNum * 842;

    return {
      sections: Object.entries(sectionPositions || {}).filter(([name, pos]) => {
        if (!pos) return false;
        const height = parseInt(sectionHeights[name]) || (sectionSnapshots[name]?.height) || 200;
        // Intersection check: top is in page OR bottom is in page
        return (pos.y >= pageStart && pos.y < pageEnd) ||
          (pos.y + height > pageStart && pos.y < pageEnd);
      }),
      lines: (lines || []).filter(line => {
        return (line.y1 >= pageStart && line.y1 < pageEnd) ||
          (line.y2 >= pageStart && line.y2 < pageEnd);
      }),
      shapes: (backgroundShapes || []).filter(shape => {
        return (shape.y >= pageStart && shape.y < pageEnd) ||
          (shape.y + shape.height > pageStart && shape.y < pageEnd);
      })
    };
  };






  // ==================== TEMPLATE SWITCHING ====================

  // const handleTemplateSwitch = (templateName) => {
  //   setCurrentTemplate(templateName);
  //   const template = TEMPLATES[templateName];
  //   setStyleConfig(template);
  //   setSectionPositions(template.positions || {});
  //   setSectionWidths(extractWidthsFromConfig(template));
  //   setLines(template.lines || []);
  //   setBackgroundShapes(template.backgroundShapes || []);
  //   setZoom(1);
  //   setSelectedLine(null);
  //   setSelectedShape(null);
  //   setSelectedSection(null);

  //   // Reset counters
  //   if (template.lines && template.lines.length > 0) {
  //     setNextLineId(Math.max(...template.lines.map(l => l.id)) + 1);
  //   } else {
  //     setNextLineId(1);
  //   }
  //   if (template.backgroundShapes && template.backgroundShapes.length > 0) {
  //     setNextShapeId(Math.max(...template.backgroundShapes.map(s => s.id)) + 1);
  //   } else {
  //     setNextShapeId(1);
  //   }
  // };


  const handleTemplateSwitch = (templateName) => {
    setCurrentTemplate(templateName);
    const template = TEMPLATES[templateName];

    setStyleConfig(template);
    setSectionPositions(template.positions || {});

    const { widths, heights } = extractWidthsAndHeightsFromConfig(template);
    setSectionWidths(widths);
    setSectionHeights(heights);

    setLines(template.lines || []);
    setBackgroundShapes(template.shapes || []);
    setZoom(1);
    setSelectedLine(null);
    setSelectedShape(null);
    setSelectedSection(null);

    // Reset counters
    if (template.lines && template.lines.length > 0) {
      setNextLineId(Math.max(...template.lines.map(l => l.id)) + 1);
    } else {
      setNextLineId(1);
    }
    if (template.shapes && template.shapes.length > 0) {
      setNextShapeId(Math.max(...template.shapes.map(s => s.id)) + 1);
    } else {
      setNextShapeId(1);
    }
  };





  // ==================== LINE FUNCTIONS ====================

  // Add line
  const addLine = (orientation) => {
    const newLine = {
      id: nextLineId,
      label: `Line ${nextLineId}`,
      orientation: orientation,
      x1: orientation === 'horizontal' ? 100 : 200,
      y1: orientation === 'horizontal' ? 200 : 100,
      x2: orientation === 'horizontal' ? 400 : 200,
      y2: orientation === 'horizontal' ? 200 : 400,
      thickness: 1,
      color: '#000000'
    };
    setLines([...lines, newLine]);
    setNextLineId(nextLineId + 1);
    setSelectedLine(newLine.id);
  };

  // Delete line
  const deleteLine = (id) => {
    setLines(lines.filter(line => line.id !== id));
    if (selectedLine === id) setSelectedLine(null);
  };

  // Update line property
  const updateLine = (id, property, value) => {
    setLines(lines.map(line =>
      line.id === id ? { ...line, [property]: value } : line
    ));
  };

  // Move line
  const moveLine = (id, direction) => {
    const step = 10;
    setLines(lines.map(line => {
      if (line.id !== id) return line;

      switch (direction) {
        case 'up':
          return { ...line, y1: line.y1 - step, y2: line.y2 - step };
        case 'down':
          return { ...line, y1: line.y1 + step, y2: line.y2 + step };
        case 'left':
          return { ...line, x1: line.x1 - step, x2: line.x2 - step };
        case 'right':
          return { ...line, x1: line.x1 + step, x2: line.x2 + step };
        default:
          return line;
      }
    }));
  };

  // Resize line
  const resizeLine = (id, action) => {
    const step = 20;
    setLines(lines.map(line => {
      if (line.id !== id) return line;

      if (line.orientation === 'horizontal') {
        return {
          ...line,
          x2: action === 'increase' ? line.x2 + step : line.x2 - step
        };
      } else {
        return {
          ...line,
          y2: action === 'increase' ? line.y2 + step : line.y2 - step
        };
      }
    }));
  };

  // Handle line drag end
  const handleLineDragEnd = (id, newPos) => {
    setLines(lines.map(line =>
      line.id === id ? { ...line, ...newPos } : line
    ));
  };

  // Handle line update
  const handleLineUpdate = (id, updates) => {
    setLines(lines.map(line =>
      line.id === id ? { ...line, ...updates } : line
    ));
  };




  // ==================== BACKGROUND SHAPE FUNCTIONS ====================

  // Add background shape
  const addShape = () => {
    const newShape = {
      id: nextShapeId,
      label: `Shape ${nextShapeId}`,
      x: 50,
      y: 50,
      width: 200,
      height: 100,
      color: '#e5e7eb'
    };
    setBackgroundShapes([...backgroundShapes, newShape]);
    setNextShapeId(nextShapeId + 1);
    setSelectedShape(newShape.id);
  };

  // Delete background shape
  const deleteBackgroundShape = (id) => {
    setBackgroundShapes(backgroundShapes.filter(shape => shape.id !== id));
    if (selectedShape === id) setSelectedShape(null);
  };

  // Update background shape property
  const updateBackgroundShape = (id, property, value) => {
    setBackgroundShapes(backgroundShapes.map(shape =>
      shape.id === id ? { ...shape, [property]: value } : shape
    ));
  };

  // Handle shape drag end
  const handleShapeDragEnd = (id, newPos) => {
    setBackgroundShapes(backgroundShapes.map(shape =>
      shape.id === id ? { ...shape, x: newPos.x, y: newPos.y } : shape
    ));
  };

  // Handle shape update
  const handleShapeUpdate = (id, updates) => {
    setBackgroundShapes(backgroundShapes.map(shape =>
      shape.id === id ? { ...shape, ...updates } : shape
    ));
  };

  // Move background shape
  const moveShape = (id, direction) => {
    const step = 5;
    setBackgroundShapes(prev => prev.map(shape => {
      if (shape.id !== id) return shape;
      switch (direction) {
        case 'up': return { ...shape, y: shape.y - step };
        case 'down': return { ...shape, y: shape.y + step };
        case 'left': return { ...shape, x: shape.x - step };
        case 'right': return { ...shape, x: shape.x + step };
        default: return shape;
      }
    }));
  };




  // ==================== SECTION FUNCTIONS ====================

  // Handle section drag end
  const handleSectionDragEnd = (sectionName, newPos, allPositions) => {
    if (allPositions) {
      // 🚀 Batch Update for Collision Physics
      setSectionPositions(prev => ({
        ...prev,
        ...allPositions
      }));
    } else {
      setSectionPositions(prev => ({
        ...prev,
        [sectionName]: newPos
      }));
    }
  };

  // Move section
  const moveSection = (sectionName, direction) => {
    const step = 2; // Fine-grained movement for sections
    setSectionPositions(prev => {
      const pos = prev[sectionName] || { x: 0, y: 0 };
      switch (direction) {
        case 'up':
          return { ...prev, [sectionName]: { ...pos, y: pos.y - step } };
        case 'down':
          return { ...prev, [sectionName]: { ...pos, y: pos.y + step } };
        case 'left':
          return { ...prev, [sectionName]: { ...pos, x: pos.x - step } };
        case 'right':
          return { ...prev, [sectionName]: { ...pos, x: pos.x + step } };
        default:
          return prev;
      }
    });
  };


  // Handle section transform - COMPLETE VERSION
  const handleSectionTransform = (sectionName, newAttrs) => {
    console.log('Transform:', sectionName, newAttrs); // Debug log

    setSectionPositions(prev => ({
      ...prev,
      [sectionName]: {
        x: newAttrs.x,
        y: newAttrs.y
      }
    }));

    // Update WIDTH
    if (newAttrs.width) {
      const widthPx = `${Math.round(newAttrs.width)}px`;

      setSectionWidths(prev => ({
        ...prev,
        [sectionName]: widthPx
      }));

      setStyleConfig(prev => ({
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          container: {
            ...prev[sectionName]?.container,
            width: widthPx
          }
        }
      }));
    }

    // Update HEIGHT
    if (newAttrs.height) {
      const heightPx = `${Math.round(newAttrs.height)}px`;

      setSectionHeights(prev => ({
        ...prev,
        [sectionName]: heightPx
      }));

      setStyleConfig(prev => ({
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          container: {
            ...prev[sectionName]?.container,
            height: heightPx
          }
        }
      }));
    }
  };

  // Auto-flow sections - WITH PAGINATION
  const autoFlowSections = () => {
    let currentY = 50;
    const spacing = 20;
    const PAGE_HEIGHT = 842;
    const PAGE_MARGIN = 50;
    let currentPage = 1;

    // Sort by current Y position to maintain relative order
    const sortedSections = Object.keys(sectionPositions).sort((a, b) => {
      const posA = sectionPositions[a];
      const posB = sectionPositions[b];
      return (posA?.y || 0) - (posB?.y || 0);
    });

    const newPositions = {};

    sortedSections.forEach(sectionName => {
      const snapshot = sectionSnapshots[sectionName];
      const height = snapshot ? snapshot.height : 100;
      const currentX = sectionPositions[sectionName]?.x || 40;

      // Check if we need to break to next page
      if (currentPage === 1 && (currentY + height) > (PAGE_HEIGHT - PAGE_MARGIN)) {
        currentPage = 2;
        currentY = PAGE_HEIGHT + PAGE_MARGIN;
        setShowPage2(true);
      }

      newPositions[sectionName] = { x: currentX, y: currentY };
      currentY += height + spacing;
    });

    setSectionPositions(newPositions);
  };







  // ==================== USE EFFECTS ====================

  // Initialize template components


  useEffect(() => {
    if (!TemplateComponents || !resumeData) return;

    // 🎬 Do not recapture while animating!
    // 🎬 Animations are now decoupled - we recapture even if animating
    // if (headerAnimating) return;
    const renderSectionData = async (sectionName) => {
      const t0 = performance.now();
      const ref = sectionRefs.current[sectionName];
      if (!ref?.current) {
        console.warn(`No ref found for ${sectionName}`);
        return;
      }

      const element = ref.current;

      try {
        // Wait for fonts to load
        await document.fonts.ready;
        const t1 = performance.now();

        // Force layout recalculation
        element.offsetHeight; // Trigger reflow
        const t2 = performance.now();

        // 1. CAPTURE FOR WEBGL (Geometry Snapshot)
        console.log(`📸 [RE-CAPTURE] Starting DOM capture for: ${sectionName}...`);
        const scanner = new GeometrySnapshot();
        const snapshot = await scanner.capture(element);
        const t3 = performance.now();
        console.log(`✅ [RE-CAPTURE] Done capturing ${sectionName} in ${(t3 - t2).toFixed(1)}ms`);

        setSectionSnapshots(prev => ({ ...prev, [sectionName]: snapshot }));
      } catch (error) {
        console.error(`Error rendering ${sectionName}:`, error);
      }
    };

    // Render all sections in parallel
    const renderAllSections = async () => {
      console.log('--- START RENDER ALL SECTIONS ---');
      const tStart = performance.now();
      const sections = Object.keys(sectionRefs.current);
      console.log('📋 Sections in refs:', sections);
      await Promise.all(sections.map(sectionName => renderSectionData(sectionName)));
      const tEnd = performance.now();
      console.log(`--- END RENDER ALL SECTIONS: ${(tEnd - tStart).toFixed(1)}ms ---`);
    };

    const timer = setTimeout(() => {
      renderAllSections();
    }, 0);

    return () => clearTimeout(timer);
  }, [
    TemplateComponents,
    styleConfig,
    resumeData,
    sectionWidths,
    sectionHeights,
  ]);




  // Initialize layout on mount
  useEffect(() => {
    console.log('Initial layout reset');
    resetLayout();
  }, [currentTemplate]);

  // Calculate page elements
  const page1Elements = getElementsForPage(1);
  const page2Elements = showPage2 ? getElementsForPage(2) : { sections: [], lines: [], shapes: [] };




  // ==================== JSX RETURN ====================

  return (
    <div className="editor-container">

      {/* Hidden rendering area */}
      <div className="hidden-render" style={{
        position: 'absolute',
        right: '-100px',
        top: '0',
        visibility: 'hidden',
        width: '595px',
        height: '842px',
        background: 'white',
        padding: '0',
        zIndex: 10000000,
        pointerEvents: 'none',
        transform: 'scale(1)',
        transformOrigin: 'top right',
        overflow: 'hidden'
      }}>
        {TemplateComponents && Object.entries(sectionRefs.current).map(([key, ref]) => {
          const Component = TemplateComponents[key];
          if (!Component) return null;

          // Map data according to your FlexibleSection component props
          const propsMap = {
            header: { resumeDetails: resumeData?.resumeDetails, styleConfig: styleConfig },
            contact: { resumeDetails: resumeData?.resumeDetails, styleConfig: styleConfig },
            summary: { summary: resumeData?.resumeDetails?.summary, styleConfig: styleConfig },
            skills: { skills: resumeData?.skills, styleConfig: styleConfig },
            experience: { experiences: resumeData?.experiences, styleConfig: styleConfig },
            projects: { projects: resumeData?.projects, styleConfig: styleConfig },
            education: { educationList: resumeData?.educationList, styleConfig: styleConfig },
            certifications: { certifications: resumeData?.certifications, styleConfig: styleConfig }
          };

          return (
            <div
              key={key}
              ref={ref}
              data-section={key}
              style={{
                width: styleConfig[key]?.container?.width || 'auto',
                height: styleConfig[key]?.container?.height || 'auto',
                minHeight: styleConfig[key]?.container?.height || 'auto',
                maxHeight: styleConfig[key]?.container?.height || 'none',
                overflow: 'visible',
                boxSizing: 'border-box',
                position: 'relative',
                minWidth: 0,
              }}>
              <Component {...propsMap[key]} />
            </div>
          );
        })}
      </div>



      {/* LEFT PANEL - Section Controls */}
      <div className="left-panel">
        {!isMobile && <h3 className="panel-title">TEMPLATE SELECT</h3>}

        {TEMPLATES && Object.keys(TEMPLATES).length > 0 && (
          <div className="control-group">
            <label className="control-label">Choose Template</label>
            <select
              value={currentTemplate}
              onChange={(e) => handleTemplateSwitch(e.target.value)}
              className="control-select"
            >
              {Object.keys(TEMPLATES).map(key => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* --- ACCORDION SECTIONS --- */}

        {/* HEADER LAYOUTS SECTION */}
        <h3 className="panel-title">HEADER LAYOUTS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          {HEADER_LAYOUTS && Object.entries(HEADER_LAYOUTS).map(([key, layout]) => (
            <button
              key={key}
              onClick={() => setStyleConfig(prev => ({
                ...prev,
                header: {
                  ...prev.header,
                  ...layout.config,
                  // Deep merge styles
                  nameStyle: { ...prev.header?.nameStyle, ...layout.config.nameStyle },
                  titleStyle: { ...prev.header?.titleStyle, ...layout.config.titleStyle }
                }
              }))}
              className="btn-secondary"
              style={{
                fontSize: '10px',
                padding: '8px',
                border: styleConfig.header?.nameAlign === layout.config.nameAlign ? '2px solid #3b82f6' : '1px solid #ddd'
              }}
            >
              {layout.label}
            </button>
          ))}
        </div>

        {/* SKILLS LAYOUTS SECTION */}
        <h3 className="panel-title">SKILLS LAYOUTS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          {SKILLS_LAYOUTS && Object.entries(SKILLS_LAYOUTS).map(([key, layout]) => (
            <button
              key={key}
              onClick={() => setStyleConfig(prev => ({
                ...prev,
                skills: { ...prev.skills, ...layout.config }
              }))}
              className="btn-secondary"
              style={{
                fontSize: '10px',
                padding: '8px',
                border: styleConfig.skills?.categoryValueSeparator === layout.config.categoryValueSeparator ? '2px solid #3b82f6' : '1px solid #ddd'
              }}
            >
              {layout.label}
            </button>
          ))}
        </div>

        {/* CONTACT LAYOUTS SECTION */}
        <h3 className="panel-title">CONTACT LAYOUTS</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          {CONTACT_LAYOUTS && Object.entries(CONTACT_LAYOUTS).map(([key, layout]) => (
            <button
              key={key}
              onClick={() => animateHeaderLayoutChange(layout.config)}
              className="btn-secondary"
              style={{ fontSize: '10px', padding: '8px' }}
            >
              {layout.label}
            </button>
          ))}
        </div>

        {/* BACKGROUND ZONES SECTION */}
        <h3 className="panel-title">BACKGROUND ZONES</h3>
        <div style={{ marginBottom: '20px' }}>
          {/* ANIMATION TEST BUTTON */}
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className={`btn-primary full-width ${isAnimating ? 'active-anim' : ''}`}
            style={{ marginBottom: '10px', backgroundColor: isAnimating ? '#ef4444' : '#8b5cf6' }}
          >
            {isAnimating ? '⏹ STOP BOUNCE ANIMATION' : '▶ TEST BOUNCE ANIMATION'}
          </button>

          <button onClick={addShape} className="btn-primary full-width">
            + ADD BACKGROUND SHAPE
          </button>

          {backgroundShapes.length > 0 && backgroundShapes.map(shape => (
            <div key={shape.id} className={`shape-control ${selectedShape === shape.id ? 'selected' : ''}`}>
              <div className="line-header">
                <span className="line-label">{shape.label}</span>
                <button onClick={() => deleteBackgroundShape(shape.id)} className="btn-delete">✕</button>
              </div>

              <div className="line-move-control" style={{ marginTop: '12px' }}>
                <label className="control-label">Nudge Position</label>
                <div className="arrow-grid">
                  <div></div>
                  <button onClick={() => moveShape(shape.id, 'up')} className="btn-arrow">↑</button>
                  <div></div>
                  <button onClick={() => moveShape(shape.id, 'left')} className="btn-arrow">←</button>
                  <div className="arrow-center">MOVE</div>
                  <button onClick={() => moveShape(shape.id, 'right')} className="btn-arrow">→</button>
                  <div></div>
                  <button onClick={() => moveShape(shape.id, 'down')} className="btn-arrow">↓</button>
                  <div></div>
                </div>
              </div>

              <div className="shape-properties">
                <div className="property-control">
                  <label className="control-label">X Position</label>
                  <input
                    type="number"
                    value={shape.x}
                    onChange={(e) => updateBackgroundShape(shape.id, 'x', parseInt(e.target.value))}
                    className="control-input"
                  />
                </div>
                <div className="property-control">
                  <label className="control-label">Y Position</label>
                  <input
                    type="number"
                    value={shape.y}
                    onChange={(e) => updateBackgroundShape(shape.id, 'y', parseInt(e.target.value))}
                    className="control-input"
                  />
                </div>
                <div className="property-control">
                  <label className="control-label">Width</label>
                  <input
                    type="number"
                    value={shape.width}
                    onChange={(e) => updateBackgroundShape(shape.id, 'width', parseInt(e.target.value))}
                    className="control-input"
                  />
                </div>
                <div className="property-control">
                  <label className="control-label">Height</label>
                  <input
                    type="number"
                    value={shape.height}
                    onChange={(e) => updateBackgroundShape(shape.id, 'height', parseInt(e.target.value))}
                    className="control-input"
                  />
                </div>
                <div className="property-control">
                  <label className="control-label">Color</label>
                  <input
                    type="color"
                    value={shape.color}
                    onChange={(e) => updateBackgroundShape(shape.id, 'color', e.target.value)}
                    className="control-color"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>



        {/* SECTION SIZES & POSITIONS SECTION */}
        <h3 className="panel-title">SECTION SIZES & POSITIONS</h3>
        <div className="section-widths-container" style={{ marginBottom: '20px' }}>
          {Object.keys(sectionWidths).map(sectionName => {
            const isTransparent = styleConfig[sectionName]?.container?.backgroundColor === 'transparent';
            const position = sectionPositions[sectionName] || { x: 0, y: 0 };
            const isOnPage2 = position.y >= 800;
            const isOpen = activeSectionAccordion === sectionName;

            return (
              <div key={sectionName} className={`sub-accordion-item ${isOpen ? 'active' : ''}`}>
                <div
                  className="sub-accordion-trigger"
                  onClick={() => setActiveSectionAccordion(isOpen ? null : sectionName)}
                >
                  <span className="section-name">{sectionName}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isTransparent && <span className="badge-mini">T</span>}
                    {isOnPage2 && <span className="badge-mini blue">P2</span>}
                    <span className="arrow">{isOpen ? '▼' : '▶'}</span>
                  </div>
                </div>

                <div className={`sub-accordion-content ${isOpen ? 'expanded' : ''}`}>
                  <div className="position-controls-wrapper">
                    <div className="position-grid-layout">
                      <div className="control-item">
                        <label className="control-label-small">X Pos</label>
                        <input
                          type="number"
                          value={Math.round(position.x)}
                          onChange={(e) => {
                            setSectionPositions(p => ({
                              ...p,
                              [sectionName]: { ...p[sectionName], x: parseInt(e.target.value) || 0 }
                            }));
                          }}
                          className="control-input-small"
                        />
                      </div>
                      <div className="control-item">
                        <label className="control-label-small">Y Pos</label>
                        <input
                          type="number"
                          value={Math.round(position.y)}
                          onChange={(e) => {
                            setSectionPositions(p => ({
                              ...p,
                              [sectionName]: { ...p[sectionName], y: parseInt(e.target.value) || 0 }
                            }));
                          }}
                          className="control-input-small"
                        />
                      </div>
                    </div>

                    {/* Nudge Controls for Section */}
                    <div className="line-move-control" style={{ marginTop: '12px', marginBottom: '12px' }}>
                      <label className="control-label" style={{ fontSize: '10px' }}>Nudge Position</label>
                      <div className="arrow-grid">
                        <div></div>
                        <button onClick={() => moveSection(sectionName, 'up')} className="btn-arrow">↑</button>
                        <div></div>
                        <button onClick={() => moveSection(sectionName, 'left')} className="btn-arrow">←</button>
                        <div className="arrow-center">MOVE</div>
                        <button onClick={() => moveSection(sectionName, 'right')} className="btn-arrow">→</button>
                        <div></div>
                        <button onClick={() => moveSection(sectionName, 'down')} className="btn-arrow">↓</button>
                        <div></div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => {
                          setSectionPositions(p => ({
                            ...p,
                            [sectionName]: { ...p[sectionName], y: 50 }
                          }));
                        }}
                        className="btn-secondary btn-page-nav"
                      >
                        → Page 1
                      </button>
                      <button
                        onClick={() => {
                          setSectionPositions(p => ({
                            ...p,
                            [sectionName]: { ...p[sectionName], y: 900 }
                          }));
                          setShowPage2(true);
                        }}
                        className="btn-secondary btn-page-nav"
                      >
                        → Page 2
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>



        <button onClick={resetLayout} className="btn-primary full-width">
          ↻ RESET LAYOUT
        </button>

        <button onClick={autoFlowSections} className="btn-primary full-width btn-auto-flow-action">
          ⚡ AUTO-FLOW CONTENT
        </button>



        <div className="button-grid">
          <button onClick={downloadResume} className="btn-secondary">📥 PNG</button>
          <button onClick={downloadPDF} className="btn-secondary">📄 PDF</button>
          <button
            onClick={handleSaveAll}
            className="btn-primary"
            style={{ background: '#2563eb' }}
            disabled={saving}
          >
            {saving ? 'Saving...' : '💾 SAVE TEMPLATE'}
          </button>
        </div>

        <h3 className="panel-title">DIVIDER LINES</h3>
        <div className="button-grid">
          <button onClick={() => addLine('horizontal')} className="btn-secondary">─ H</button>
          <button onClick={() => addLine('vertical')} className="btn-secondary">│ V</button>
        </div>

        {
          lines.length > 0 && lines.map(line => (
            <div key={line.id} className={`line-control ${selectedLine === line.id ? 'selected' : ''}`}>
              <div className="line-header">
                <span className="line-label">{line.label}</span>
                <button onClick={() => deleteLine(line.id)} className="btn-delete">✕</button>
              </div>

              <div className="line-move-control">
                <label className="control-label">Move Position</label>
                <div className="arrow-grid">
                  <div></div>
                  <button onClick={() => moveLine(line.id, 'up')} className="btn-arrow">↑</button>
                  <div></div>
                  <button onClick={() => moveLine(line.id, 'left')} className="btn-arrow">←</button>
                  <div className="arrow-center">MOVE</div>
                  <button onClick={() => moveLine(line.id, 'right')} className="btn-arrow">→</button>
                  <div></div>
                  <button onClick={() => moveLine(line.id, 'down')} className="btn-arrow">↓</button>
                  <div></div>
                </div>
              </div>

              <div className="line-resize-control">
                <label className="control-label">
                  Resize {line.orientation === 'vertical' ? 'Height' : 'Width'}
                </label>
                <div className="resize-buttons">
                  <button onClick={() => resizeLine(line.id, 'decrease')} className="btn-resize">−</button>
                  <button onClick={() => resizeLine(line.id, 'increase')} className="btn-resize">+</button>
                </div>
              </div>

              <div className="line-properties">
                <div className="property-control">
                  <label className="control-label">Thickness</label>
                  <input
                    type="number"
                    value={line.thickness}
                    onChange={(e) => updateLine(line.id, 'thickness', parseFloat(e.target.value))}
                    step="0.5"
                    className="control-input"
                  />
                </div>
                <div className="property-control">
                  <label className="control-label">Color</label>
                  <input
                    type="color"
                    value={normalizeColorForInput(line.color)}
                    onChange={(e) => updateLine(line.id, 'color', e.target.value)}
                    className="control-color"
                  />
                </div>
              </div>
            </div>
          ))
        }
      </div >


      {/* MIDDLE - Canvas */}
      < div className="canvas-container" >
        <div className="template-badge">
          {currentTemplate === 'ats' ? '📄 ATS' : currentTemplate === 'modern' ? '✨ MODERN' : '📑 TWO COLUMN'}
        </div>
        <div className="canvas-hint">💡 DRAG & RESIZE • Scroll to see more</div>
        <div className="canvas-scroll-wrapper">
          <div className="canvas-stack-layout">
            {/* Page 1 */}
            <div className="canvas-wrapper" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
              <WebGLStage
                width={isMobile ? 595 * 0.7 : 595}
                height={isMobile ? 842 * 0.7 : 842}
                shapes={page1Elements.shapes}
                lines={page1Elements.lines}
                sections={page1Elements.sections}
                sectionSnapshots={sectionSnapshots}
                onDragEnd={(type, id, pos, allPositions) => {
                  if (type === 'section') handleSectionDragEnd(id, pos, allPositions);
                  if (type === 'shape') handleShapeDragEnd(id, pos);
                  if (type === 'line') handleLineDragEnd(id, pos);
                }}
                onSelect={(type, id) => {
                  if (type === 'shape') setSelectedShape(id);
                  if (type === 'line') setSelectedLine(id);
                  if (type === 'section') setSelectedSection(id);
                }}
                selectedId={selectedShape || selectedLine || selectedSection}
                isAnimating={isAnimating}
                onHeaderContainerReady={(container) => {
                  headerContainerRef.current = container;
                }}
                headerAnimating={headerAnimating}
                headerAnimationRef={headerAnimationRef}
                setHeaderAnimating={setHeaderAnimating}
                skillsAnimating={skillsAnimating}
                skillsAnimationRef={skillsAnimationRef}
                setSkillsAnimating={setSkillsAnimating}
                onSkillsContainerReady={(container) => {
                  skillsContainerRef.current = container;
                }}
                ref={webGLStageRef1}
              />
              <div className="page-number">Page 1</div>
            </div>



            {/* Page 2 */}
            <div
              className="canvas-wrapper"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                display: showPage2 ? 'block' : 'none'
              }}
            >
              <WebGLStage
                width={isMobile ? 595 * 0.7 : 595}
                height={isMobile ? 842 * 0.7 : 842}
                shapes={page2Elements.shapes}
                lines={page2Elements.lines}
                sections={page2Elements.sections}
                sectionSnapshots={sectionSnapshots}
                yOffset={842}
                onDragEnd={(type, id, pos, allPositions) => {
                  const adjustedPos = { ...pos, y: pos.y + 842 };

                  // 🚀 Apply OFFSETS to batch updates for Page 2
                  let adjustedAll = null;
                  if (allPositions) {
                    adjustedAll = {};
                    Object.keys(allPositions).forEach(k => {
                      adjustedAll[k] = {
                        x: allPositions[k].x,
                        y: allPositions[k].y + 842
                      };
                    });
                  }

                  if (type === 'section') handleSectionDragEnd(id, adjustedPos, adjustedAll);
                  if (type === 'shape') handleShapeDragEnd(id, adjustedPos);
                  if (type === 'line') {
                    handleLineDragEnd(id, {
                      ...pos,
                      y1: pos.y1 + 842,
                      y2: pos.y2 + 842
                    });
                  }
                }}
                onSelect={(type, id) => {
                  if (type === 'shape') setSelectedShape(id);
                  if (type === 'line') setSelectedLine(id);
                  if (type === 'section') setSelectedSection(id);
                }}
                selectedId={selectedShape || selectedLine || selectedSection}
                isAnimating={isAnimating}
                ref={webGLStageRef2}
              />
              <div className="page-number">Page 2</div>
            </div>
          </div>
        </div>



        <div className="zoom-controls">

          <button onClick={() => setZoom(Math.max(0.3, zoom - 0.1))} className="btn-zoom">−</button>
          <span className="zoom-value">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="btn-zoom">+</button>
          <button onClick={() => setZoom(1)} className="btn-zoom-reset">100%</button>
          <button onClick={() => setZoom(0.7)} className="btn-zoom-reset">FIT</button>
          <button
            onClick={() => setShowPage2(!showPage2)}
            className={`btn-zoom-reset ${showPage2 ? 'active' : ''}`}
            style={{ marginLeft: '10px' }}
          >
            {showPage2 ? '1 PAGE' : '2 PAGES'}
          </button>
        </div>
      </div >

      {/* ======================= RIGHT PANEL START ======================= */}



      < div className="right-panel" >
        <h3 className="panel-title">QUICK STYLE</h3>

        {
          selectedSection ? (
            <div style={{ padding: '12px' }}>
              <div style={{
                background: '#f3f4f6',
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                📝 {selectedSection.toUpperCase()}
              </div>

              {/* Height Control (Moved to Quick Style for convenience) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Height (px)
                </label>
                <input
                  type="text"
                  value={sectionHeights[selectedSection] || 'auto'}
                  onChange={(e) => handleHeightChange(selectedSection, e.target.value)}
                  onBlur={() => handleHeightBlur(selectedSection)}
                  className="control-input"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}
                  placeholder="auto or 200px"
                />
              </div>

              {/* Nudge Controls for Section - RIGHT PANEL */}
              <div className="line-move-control" style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Fine Position Control (Nudge)
                </label>
                <div className="arrow-grid">
                  <div></div>
                  <button onClick={() => moveSection(selectedSection, 'up')} className="btn-arrow">↑</button>
                  <div></div>
                  <button onClick={() => moveSection(selectedSection, 'left')} className="btn-arrow">←</button>
                  <div className="arrow-center">MOVE</div>
                  <button onClick={() => moveSection(selectedSection, 'right')} className="btn-arrow">→</button>
                  <div></div>
                  <button onClick={() => moveSection(selectedSection, 'down')} className="btn-arrow">↓</button>
                  <div></div>
                </div>
              </div>

              {/* Font Size Quick Controls */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Font Size
                </label>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      const type = getStyleType(selectedSection, 'bodyStyle');
                      const current = parseInt(styleConfig[selectedSection]?.[type]?.fontSize) || 10;
                      handleStyleChange(selectedSection, 'bodyStyle', `${Math.max(6, current - 1)}px`, 'fontSize');
                    }}
                    className="btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '16px', flex: 1 }}
                  >
                    −
                  </button>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    minWidth: '40px',
                    textAlign: 'center',
                    background: 'white',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb'
                  }}>
                    {(() => {
                      const type = getStyleType(selectedSection, 'bodyStyle');
                      return parseInt(styleConfig[selectedSection]?.[type]?.fontSize) || 10;
                    })()}
                  </span>
                  <button
                    onClick={() => {
                      const type = getStyleType(selectedSection, 'bodyStyle');
                      const current = parseInt(styleConfig[selectedSection]?.[type]?.fontSize) || 10;
                      handleStyleChange(selectedSection, 'bodyStyle', `${Math.min(32, current + 1)}px`, 'fontSize');
                    }}
                    className="btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '16px', flex: 1 }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Title Font Size (if applicable) */}
              {styleConfig[selectedSection]?.titleStyle && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                    Title Font Size
                  </label>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button
                      onClick={() => {
                        const current = parseInt(styleConfig[selectedSection]?.titleStyle?.fontSize) || 14;
                        handleStyleChange(selectedSection, 'titleStyle', `${Math.max(8, current - 1)}px`, 'fontSize');
                      }}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '16px', flex: 1 }}
                    >
                      −
                    </button>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      minWidth: '40px',
                      textAlign: 'center',
                      background: 'white',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb'
                    }}>
                      {parseInt(styleConfig[selectedSection]?.titleStyle?.fontSize) || 14}
                    </span>
                    <button
                      onClick={() => {
                        const current = parseInt(styleConfig[selectedSection]?.titleStyle?.fontSize) || 14;
                        handleStyleChange(selectedSection, 'titleStyle', `${Math.min(36, current + 1)}px`, 'fontSize');
                      }}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '16px', flex: 1 }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Text Color */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Text Color
                </label>
                <input
                  type="color"
                  value={(() => {
                    const type = getStyleType(selectedSection, 'bodyStyle');
                    return normalizeColorForInput(styleConfig[selectedSection]?.[type]?.color);
                  })()}
                  onChange={(e) => handleStyleChange(selectedSection, 'bodyStyle', e.target.value, 'color')}
                  style={{
                    width: '100%',
                    height: '40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Title Color (if applicable) */}
              {styleConfig[selectedSection]?.titleStyle && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                    Title Color
                  </label>
                  <input
                    type="color"
                    value={normalizeColorForInput(styleConfig[selectedSection]?.titleStyle?.color)}
                    onChange={(e) => handleStyleChange(selectedSection, 'titleStyle', e.target.value, 'color')}
                    style={{
                      width: '100%',
                      height: '40px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              )}

              {/* Background Color */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Background
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="color"
                    value={normalizeColorForInput(styleConfig[selectedSection]?.container?.backgroundColor)}
                    onChange={(e) => handleStyleChange(selectedSection, 'container', e.target.value, 'backgroundColor')}
                    disabled={styleConfig[selectedSection]?.container?.backgroundColor === 'transparent'}
                    style={{
                      flex: 1,
                      height: '40px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      opacity: styleConfig[selectedSection]?.container?.backgroundColor === 'transparent' ? 0.5 : 1
                    }}
                  />
                  <button
                    onClick={() => {
                      const currentBg = styleConfig[selectedSection]?.container?.backgroundColor;
                      handleStyleChange(selectedSection, 'container', currentBg === 'transparent' ? '#FFFFFF' : 'transparent', 'backgroundColor');
                    }}
                    className="btn-secondary"
                    style={{
                      padding: '0 16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: styleConfig[selectedSection]?.container?.backgroundColor === 'transparent' ? '#3b82f6' : 'white',
                      color: styleConfig[selectedSection]?.container?.backgroundColor === 'transparent' ? 'white' : '#374151',
                      border: styleConfig[selectedSection]?.container?.backgroundColor === 'transparent' ? '1px solid #3b82f6' : '1px solid #d1d5db'
                    }}
                  >
                    {styleConfig[selectedSection]?.container?.backgroundColor === 'transparent' ? '⊘' : 'T'}
                  </button>
                </div>
                <span style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                  {styleConfig[selectedSection]?.container?.backgroundColor === 'transparent' ? 'Transparent' : 'Solid'}
                </span>
              </div>

              {/* Padding */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Padding
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={parseInt(styleConfig[selectedSection]?.container?.padding) || 0}
                  onChange={(e) => {
                    const newPadding = `${e.target.value}px`;
                    handleStyleChange(selectedSection, 'container', newPadding, 'padding');
                  }}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>
                  <span>0px</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>
                    {parseInt(styleConfig[selectedSection]?.container?.padding) || 0}px
                  </span>
                  <span>50px</span>
                </div>
              </div>

              {/* Width (range slider) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Width
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="range"
                    min={200}
                    max={595}
                    value={parseInt(sectionWidths[selectedSection]) || 515}
                    onChange={(e) => handleWidthChange(selectedSection, `${e.target.value}px`)}
                    onMouseUp={() => handleWidthBlur(selectedSection)}
                    onTouchEnd={() => handleWidthBlur(selectedSection)}
                    style={{ width: '100%' }}
                  />
                  <div style={{ minWidth: '64px', textAlign: 'right', fontSize: '13px', color: '#374151' }}>
                    {(parseInt(sectionWidths[selectedSection]) || 515) + 'px'}
                  </div>
                </div>
              </div>

              <div style={{
                background: '#fef3c7',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #fbbf24',
                marginTop: '20px'
              }}>
                <p style={{ fontSize: '11px', color: '#92400e', margin: 0, lineHeight: '1.5' }}>
                  💡 <strong>Tip:</strong> Select a section on canvas to quickly adjust its style here!
                </p>
              </div>
            </div>
          ) : selectedShape ? (
            <div style={{ padding: '12px' }}>
              <div style={{
                background: '#f3f4f6',
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                💠 {backgroundShapes.find(s => s.id === selectedShape)?.label?.toUpperCase() || 'SHAPE'}
              </div>

              {/* Nudge Controls for Shape - RIGHT PANEL */}
              <div className="line-move-control" style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Fine Position Control (Nudge)
                </label>
                <div className="arrow-grid">
                  <div></div>
                  <button onClick={() => moveShape(selectedShape, 'up')} className="btn-arrow">↑</button>
                  <div></div>
                  <button onClick={() => moveShape(selectedShape, 'left')} className="btn-arrow">←</button>
                  <div className="arrow-center">MOVE</div>
                  <button onClick={() => moveShape(selectedShape, 'right')} className="btn-arrow">→</button>
                  <div></div>
                  <button onClick={() => moveShape(selectedShape, 'down')} className="btn-arrow">↓</button>
                  <div></div>
                </div>
              </div>

              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '6px', border: '1px solid #3b82f6', marginTop: '20px' }}>
                <p style={{ fontSize: '11px', color: '#1e40af', margin: 0 }}>
                  💡 Use the <strong>Left Panel</strong> for color and size adjustments of background shapes.
                </p>
              </div>
            </div>
          ) : selectedLine ? (
            <div style={{ padding: '12px' }}>
              <div style={{
                background: '#f3f4f6',
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                📏 {lines.find(l => l.id === selectedLine)?.label?.toUpperCase() || 'LINE'}
              </div>

              {/* Nudge Controls for Line - RIGHT PANEL */}
              <div className="line-move-control" style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px', color: '#374151' }}>
                  Fine Position Control (Nudge)
                </label>
                <div className="arrow-grid">
                  <div></div>
                  <button onClick={() => moveLine(selectedLine, 'up')} className="btn-arrow">↑</button>
                  <div></div>
                  <button onClick={() => moveLine(selectedLine, 'left')} className="btn-arrow">←</button>
                  <div className="arrow-center">MOVE</div>
                  <button onClick={() => moveLine(selectedLine, 'right')} className="btn-arrow">→</button>
                  <div></div>
                  <button onClick={() => moveLine(selectedLine, 'down')} className="btn-arrow">↓</button>
                  <div></div>
                </div>
              </div>

              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '6px', border: '1px solid #3b82f6', marginTop: '20px' }}>
                <p style={{ fontSize: '11px', color: '#1e40af', margin: 0 }}>
                  💡 Use the <strong>Left Panel</strong> for thickness and color of divider lines.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ padding: '12px' }}>
              <div style={{
                background: '#f3f4f6',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '12px'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎨</div>
                <p style={{ margin: 0 }}>
                  Click on an element in the canvas to edit its styles
                </p>
              </div>

              <div style={{ marginTop: '20px', padding: '12px', background: '#eff6ff', borderRadius: '6px', border: '1px solid #3b82f6' }}>
                <h4 style={{ fontSize: '11px', fontWeight: '600', color: '#1e40af', margin: '0 0 8px 0' }}>
                  Quick Actions:
                </h4>
                <ul style={{ fontSize: '11px', color: '#1e40af', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Drag elements to reposition</li>
                  <li>Click to select and style</li>
                  <li>Use "Nudge" for fine control</li>
                  <li>Navigate using left panel accordions</li>
                </ul>
              </div>
            </div>
          )
        }
      </div >


      {/* ======================= RIGHT PANEL END ========================= */}




    </div >

  );
};

export default UIEditor;