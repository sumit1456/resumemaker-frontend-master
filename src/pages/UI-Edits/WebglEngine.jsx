/**
 * Hybrid Canvas Layout Engine
 * Three rendering modes:
 * 1. CSS Layout Engine (manual layout building) - Original
 * 2. Geometry Snapshot (DOM capture) - NEW
 * 3. PixiJS Renderer (GPU accelerated) - NEW
 * 
 * Choose based on your needs:
 * - Mode 1: Full control, pure programmatic
 * - Mode 2: WYSIWYG, captures real DOM
 * - Mode 3: Best performance, GPU rendering
 */

import * as PIXI from 'pixi.js';

// ==================== UTILITY FUNCTIONS ====================

function parseSize(value, base = 0) {
    if (typeof value === 'number') return value;
    if (!value) return 0;

    const str = String(value);
    if (str.endsWith('px')) return parseFloat(str);
    if (str.endsWith('%')) return (parseFloat(str) / 100) * base;
    if (str === 'auto') return 0;
    return parseFloat(str) || 0;
}

function parsePadding(padding) {
    if (typeof padding === 'number') {
        return { top: padding, right: padding, bottom: padding, left: padding };
    }
    if (typeof padding === 'object') {
        return {
            top: padding.top || 0,
            right: padding.right || 0,
            bottom: padding.bottom || 0,
            left: padding.left || 0
        };
    }
    return { top: 0, right: 0, bottom: 0, left: 0 };
}

function parseMargin(margin) {
    return parsePadding(margin);
}

// ==================== MODE 2: GEOMETRY SNAPSHOT ENGINE ====================
// Captures DOM layout geometry (positions, styles) without pixel data
// Ultra-lightweight: ~10-50KB vs 50-100MB for image capture

class GeometrySnapshot {
    constructor(options = {}) {
        this.options = {
            mode: 'performance', // 'performance' (fast) or 'deep' (high fidelity)
            ...options
        };
        this.nodes = [];
        this.rootWidth = 0;
        this.rootHeight = 0;
    }

    /**
     * Capture DOM geometry recursively
     * Returns: { nodes: [], width: number, height: number }
     */
    capture(element, overrideOptions = {}) {
        if (!element) return null;

        // Merge options for this specific capture
        const options = { ...this.options, ...overrideOptions };
        this.currentMode = options.mode;

        // Store original transform
        const originalTransform = element.style.transform;

        // Temporarily remove any transforms that might affect measurement
        let current = element;
        const transforms = [];
        while (current && current !== document.body) {
            if (current.style.transform && current.style.transform !== 'none') {
                transforms.push({
                    element: current,
                    transform: current.style.transform
                });
                current.style.transform = 'none';
            }
            current = current.parentElement;
        }

        const rootRect = element.getBoundingClientRect();
        this.rootRect = rootRect;
        this.rootWidth = Math.ceil(rootRect.width);
        this.rootHeight = Math.ceil(rootRect.height);
        this.nodes = [];
        this.processedNodes = new Set();

        this.captureNode(element);

        // Restore transforms
        transforms.forEach(({ element, transform }) => {
            element.style.transform = transform;
        });

        console.log(`📸 GeometrySnapshot: Captured ${this.nodes.length} nodes from ${element.tagName}`);

        // TEST FIX: Verify layout capture
        this.verifyCapture();

        return {
            nodes: this.nodes,
            width: this.rootWidth,
            height: this.rootHeight
        };
    }

    captureNode(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) return;
        if (this.processedNodes.has(element)) return;

        const rect = element.getBoundingClientRect();

        // ✅ FIX: Calculate ABSOLUTE position from root
        // This ensures all coordinates are in the same coordinate system
        const x = Math.round((rect.left - this.rootRect.left) * 2) / 2;
        const y = Math.round((rect.top - this.rootRect.top) * 2) / 2;
        const width = Math.round(rect.width * 2) / 2;
        const height = Math.round(rect.height * 2) / 2;

        const computed = window.getComputedStyle(element);

        // Skip hidden elements (Note: we allow visibility: hidden as it's common for off-screen capture)
        if (computed.display === 'none' || parseFloat(computed.opacity) === 0) {
            return;
        }

        const type = this.getNodeType(element, computed);
        const styles = this.extractStyles(element, computed);

        // Redundancy Check: Skip identical backgrounds to prevent ghosting/Z-fighting
        if (type === 'box' && this.nodes.length > 0) {
            const lastNode = this.nodes[this.nodes.length - 1];
            if (lastNode.x === x && lastNode.y === y && lastNode.width === width && lastNode.height === height) {
                if (styles.backgroundColor && lastNode.styles.backgroundColor === styles.backgroundColor) {
                    this.processedNodes.add(element);
                    for (const child of element.children) {
                        this.captureNode(child); // Process children but skip this container
                    }
                    return;
                }
            }
        }

        const nodeData = {
            type,
            x, y, width, height,
            styles,
            zIndex: parseInt(computed.zIndex) || 0
        };

        if (type === 'text') {
            nodeData.text = element.textContent.trim();
            if (!nodeData.text) return; // Skip containers that look like text but are empty

            // ✅ DEBUG LOG (remove in production)
            if (styles.fontWeight === 'bold' || styles.fontSize > 13 || nodeData.text.length < 50) {
                console.log(`[GEO] Text: "${nodeData.text.substring(0, 20)}..."`, {
                    x, y,
                    w: width,
                    h: height,
                    fs: styles.fontSize,
                    lh: styles.lineHeight,
                    padL: styles.padding?.left || 0,
                    padT: styles.padding?.top || 0,
                    finalY: y
                });
            }

            this.markProcessedRecursive(element);
        } else if (type === 'image') {
            nodeData.src = element.src;
            this.processedNodes.add(element);
        } else {
            this.processedNodes.add(element);
        }

        // Attach direct text to boxes if they have it
        if (type === 'box') {
            const directTextNodes = Array.from(element.childNodes)
                .filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0);

            if (directTextNodes.length > 0) {
                // Optimization: If it's just one text node and no element children, it's a simple text-box
                nodeData.text = directTextNodes.map(n => n.textContent).join(' ').trim();
            }
        }

        this.nodes.push(nodeData);

        // Recurse into children
        if (type !== 'text') {
            for (const child of element.children) {
                this.captureNode(child);
            }
        }
    }

    verifyCapture() {
        console.group('🔍 Geometry Capture Verification');

        // Check for suspicious patterns
        const nodesAtOrigin = this.nodes.filter(n => n.x === 0 && n.y === 0);
        if (nodesAtOrigin.length > 5) {
            console.warn(`⚠️ WARNING: ${nodesAtOrigin.length} nodes at (0,0) - likely positioning bug!`);
            console.log('Nodes at origin:', nodesAtOrigin.map(n => ({
                type: n.type,
                text: n.text?.substring(0, 30),
                size: `${n.width}x${n.height}`
            })));
        }

        // Check for overlapping text nodes
        const textNodes = this.nodes.filter(n => n.type === 'text');
        let overlaps = 0;
        for (let i = 0; i < textNodes.length; i++) {
            for (let j = i + 1; j < textNodes.length; j++) {
                const a = textNodes[i];
                const b = textNodes[j];

                // Check if rectangles overlap
                if (a.x < b.x + b.width && a.x + a.width > b.x &&
                    a.y < b.y + b.height && a.y + a.height > b.y) {
                    overlaps++;
                    if (overlaps <= 3) { // Only show first 3
                        console.warn('Overlapping text:', {
                            text1: a.text?.substring(0, 20),
                            pos1: `(${a.x}, ${a.y})`,
                            text2: b.text?.substring(0, 20),
                            pos2: `(${b.x}, ${b.y})`
                        });
                    }
                }
            }
        }

        if (overlaps > 0) {
            console.warn(`⚠️ Found ${overlaps} overlapping text nodes`);
        }

        console.groupEnd();
    }

    // Recurse into children


    markProcessedRecursive(element) {
        this.processedNodes.add(element);
        for (const child of element.children) {
            this.markProcessedRecursive(child);
        }
    }

    getNodeType(element, computed) {
        if (element.tagName === 'IMG') return 'image';

        // CRITICAL FIX: If it has visible styles, it MUST be a box to render them
        const hasVisibleBoxStyle =
            (computed.backgroundColor !== 'rgba(0, 0, 0, 0)' && computed.backgroundColor !== 'transparent') ||
            (computed.backgroundImage && computed.backgroundImage !== 'none') ||
            (parseFloat(computed.borderTopWidth) > 0 && computed.borderTopStyle !== 'none') ||
            (computed.boxShadow && computed.boxShadow !== 'none');

        if (hasVisibleBoxStyle) return 'box';

        const textContent = element.textContent.trim();
        const hasOnlyText = element.children.length === 0 ||
            Array.from(element.children).every(child =>
                ['SPAN', 'STRONG', 'EM', 'B', 'I', 'MARK', 'BR'].includes(child.tagName)
            );

        const isTextElement = ['SPAN', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
            'STRONG', 'EM', 'B', 'I', 'LABEL', 'A', 'LI'].includes(element.tagName);

        // If it's a text element with content and no complex children, treat as text
        if (isTextElement && textContent.length > 0 && hasOnlyText) {
            return 'text';
        }

        // Check for meaningful direct text
        const hasDirectText = Array.from(element.childNodes).some(
            child => child.nodeType === Node.TEXT_NODE &&
                child.textContent.trim().length > 0
        );

        if (hasDirectText && !element.querySelector('div, section, article, main, aside, header, footer, nav')) {
            return 'text';
        }

        return 'box';
    }

    extractStyles(element, computed) {
        const styles = {
            backgroundColor: computed.backgroundColor,
            backgroundImage: computed.backgroundImage,
            borderWidth: parseFloat(computed.borderTopWidth) || 0, // More reliable than borderWidth
            borderColor: computed.borderTopColor || computed.borderColor,
            borderStyle: computed.borderTopStyle || computed.borderStyle,
            borderRadius: computed.borderRadius.includes('%') ? computed.borderRadius : (parseFloat(computed.borderRadius) || 0),
            color: computed.color,
            fontSize: parseFloat(computed.fontSize) || 12,
            fontFamily: computed.fontFamily,
            fontWeight: computed.fontWeight,
            fontStyle: computed.fontStyle,
            textAlign: computed.textAlign,
            justifyContent: computed.justifyContent,
            alignItems: computed.alignItems,
            lineHeight: parseFloat(computed.lineHeight) || parseFloat(computed.fontSize) * 1.2,
            letterSpacing: parseFloat(computed.letterSpacing) || 0,
            padding: {
                top: parseFloat(computed.paddingTop) || 0,
                right: parseFloat(computed.paddingRight) || 0,
                bottom: parseFloat(computed.paddingBottom) || 0,
                left: parseFloat(computed.paddingLeft) || 0
            },
            opacity: parseFloat(computed.opacity) || 1,
            boxShadow: computed.boxShadow !== 'none' ? computed.boxShadow : null,
            transform: computed.transform !== 'none' ? computed.transform : null,
            zIndex: computed.zIndex !== 'auto' ? parseInt(computed.zIndex) : 0,
            overflow: computed.overflow,
            visibility: computed.visibility,
            whiteSpace: computed.whiteSpace,
            wordBreak: computed.wordBreak
        };

        // If in deep mode, extract more complex properties
        if (this.currentMode === 'deep') {
            if (styles.backgroundImage && styles.backgroundImage !== 'none') {
                const gradient = this.parseGradient(styles.backgroundImage);
                if (gradient) styles.gradient = gradient;
            }
        }

        return this.compactStyles(styles);
    }

    parseGradient(bgImage) {
        if (!bgImage || bgImage === 'none') return null;

        console.log('================ GRADIENT PARSE START ================');
        console.log('Raw BG Image:', bgImage);

        // Robust layer splitting: match top-level commas
        let layers = [];
        let depth = 0;
        let lastIdx = 0;
        for (let i = 0; i < bgImage.length; i++) {
            if (bgImage[i] === '(') depth++;
            else if (bgImage[i] === ')') depth--;
            else if (bgImage[i] === ',' && depth === 0) {
                layers.push(bgImage.substring(lastIdx, i).trim());
                lastIdx = i + 1;
            }
        }
        layers.push(bgImage.substring(lastIdx).trim());

        const cleanBg = layers[0];
        console.log('Target Layer:', cleanBg);

        let result = null;

        // Match linear or radial gradient, taking everything inside the outermost parentheses
        const linearMatch = cleanBg.match(/linear-gradient\((.*)\)/s);
        const radialMatch = cleanBg.match(/radial-gradient\((.*)\)/s);

        if (linearMatch) {
            // Find the balanced content for linear-gradient
            // Since we split cleanBg already, we can assume the rest is content
            const content = linearMatch[1].trim();
            result = this.parseLinearGradient(content);
        } else if (radialMatch) {
            const content = radialMatch[1].trim();
            result = this.parseRadialGradient(content);
        }

        if (result) {
            console.log('Parsed Result:', JSON.stringify(result, null, 2));
        } else {
            console.warn('Failed to parse gradient string');
        }
        console.log('================ GRADIENT PARSE END ==================');

        return result;
    }

    parseLinearGradient(content) {
        // Robust splitting of linear-gradient parts
        let parts = [];
        let depth = 0;
        let lastIdx = 0;
        for (let i = 0; i < content.length; i++) {
            if (content[i] === '(') depth++;
            else if (content[i] === ')') depth--;
            else if (content[i] === ',' && depth === 0) {
                parts.push(content.substring(lastIdx, i).trim());
                lastIdx = i + 1;
            }
        }
        parts.push(content.substring(lastIdx).trim());

        let angle = 180; // default (to bottom)
        let startIdx = 0;

        const firstPart = parts[0];
        if (firstPart.includes('deg')) {
            angle = parseFloat(parts[0]);
            startIdx = 1;
        } else if (parts[0].includes('to ')) {
            const direction = parts[0].toLowerCase();
            if (direction.includes('right')) angle = 90;
            if (direction.includes('left')) angle = 270;
            if (direction.includes('top')) angle = 0;
            if (direction.includes('bottom')) angle = 180;
            startIdx = 1;
        }

        const stops = this.parseColorStops(parts, startIdx);
        return { type: 'linear', angle, stops };
    }

    parseRadialGradient(content) {
        // Robust splitting
        let parts = [];
        let depth = 0;
        let lastIdx = 0;
        for (let i = 0; i < content.length; i++) {
            if (content[i] === '(') depth++;
            else if (content[i] === ')') depth--;
            else if (content[i] === ',' && depth === 0) {
                parts.push(content.substring(lastIdx, i).trim());
                lastIdx = i + 1;
            }
        }
        parts.push(content.substring(lastIdx).trim());

        return {
            type: 'radial',
            stops: this.parseColorStops(parts, 1)
        };
    }

    parseColorStops(parts, startIdx) {
        const stops = [];
        for (let i = startIdx; i < parts.length; i++) {
            const stop = parts[i];
            // Split into color and position (e.g., "#fff 50%")
            // But be careful: color might be rgb(0,0,0)
            const colorMatch = stop.match(/(#[a-fA-F0-0]{3,8}|rgba?\(.*?\)|[a-zA-Z]+)/);
            const percentMatch = stop.match(/(\d+)%/);

            if (colorMatch) {
                const color = colorMatch[0];
                const position = percentMatch ? parseFloat(percentMatch[1]) / 100 :
                    (i - startIdx) / (parts.length - startIdx - 1 || 1);

                stops.push({ color, position });
            }
        }
        return stops;
    }

    compactStyles(styles) {
        const compact = {};

        for (const [key, value] of Object.entries(styles)) {
            if (value === null || value === undefined || value === '' || value === 0) continue;
            if (key === 'backgroundColor' && (value === 'rgba(0, 0, 0, 0)' || value === 'transparent')) continue;
            if (key === 'borderStyle' && value === 'none') continue;

            compact[key] = value;
        }

        return compact;
    }

    estimateSize() {
        const json = JSON.stringify({ nodes: this.nodes, width: this.rootWidth, height: this.rootHeight });
        return Math.round(json.length / 1024 * 10) / 10;
    }

    // Convert to Canvas2D rendering
    renderToCanvas(canvas, scale = 1) {
        const ctx = canvas.getContext('2d');
        canvas.width = this.rootWidth * scale;
        canvas.height = this.rootHeight * scale;
        ctx.scale(scale, scale);

        // Clear
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, this.rootWidth, this.rootHeight);

        // Sort nodes by z-index if available, or maintain original order
        const sortedNodes = [...this.nodes].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

        // Render each node
        for (const node of sortedNodes) {
            this.renderNode(ctx, node);
        }

        return canvas;
    }


    renderNode(ctx, node) {
        const { x, y, width, height, styles, type, text, src } = node;

        ctx.save();

        // 0. GLOBAL OPACITY
        if (styles.opacity !== undefined) {
            ctx.globalAlpha = styles.opacity;
        }

        // 1. SHADOW (Apply to the box/image first)
        if (styles.boxShadow && styles.boxShadow !== 'none') {
            const colorMatch = styles.boxShadow.match(/(rgba?\(.*?\)|#[0-9a-fA-F]{3,8}|[a-zA-Z]+)/);
            if (colorMatch) {
                const shadowColor = colorMatch[0];
                const otherParts = styles.boxShadow.replace(shadowColor, '').trim().split(/\s+/);

                ctx.shadowColor = shadowColor;
                ctx.shadowOffsetX = parseFloat(otherParts[0]) || 0;
                ctx.shadowOffsetY = parseFloat(otherParts[1]) || 0;
                ctx.shadowBlur = parseFloat(otherParts[2]) || 0;
            }
        }

        // Helper to get absolute border radius
        const getRadius = () => {
            let r = styles.borderRadius || 0;
            if (typeof r === 'string' && r.endsWith('%')) {
                return (Math.min(width, height) * parseFloat(r)) / 100;
            }
            return parseFloat(r) || 0;
        };
        const radius = getRadius();


        // 2. BACKGROUND 
        if (styles.backgroundColor && styles.backgroundColor !== 'transparent') {
            ctx.fillStyle = styles.backgroundColor;
            if (radius > 0) {
                this.roundRect(ctx, x, y, width, height, radius);
                ctx.fill();
            } else {
                ctx.fillRect(x, y, width, height);
            }
        }


        // 3. GRADIENT OVERLAY
        if (styles.gradient) {
            let gradient;
            if (styles.gradient.type === 'radial') {
                const centerX = x + width / 2;
                const centerY = y + height / 2;
                const gr = Math.max(width, height) / 2;
                gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, gr);

            } else {
                const angle = styles.gradient.angle !== undefined ? styles.gradient.angle : 180;
                const angleRad = ((angle - 90) * Math.PI) / 180;
                const length = Math.abs(width * Math.cos(angleRad)) + Math.abs(height * Math.sin(angleRad));
                const centerX = x + width / 2;
                const centerY = y + height / 2;
                const x1 = centerX - (Math.cos(angleRad) * length) / 2;
                const y1 = centerY - (Math.sin(angleRad) * length) / 2;
                const x2 = centerX + (Math.cos(angleRad) * length) / 2;
                const y2 = centerY + (Math.sin(angleRad) * length) / 2;
                gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            }

            styles.gradient.stops.forEach(stop => {
                gradient.addColorStop(stop.position, stop.color);
            });

            ctx.fillStyle = gradient;
            if (radius > 0) {
                this.roundRect(ctx, x, y, width, height, radius);
                ctx.fill();
            } else {
                ctx.fillRect(x, y, width, height);
            }

        }

        // 4. IMAGE
        if (type === 'image' && src) {
            // NOTE: This assumes images are preloaded or cached in browser.
            // For a benchmark, the source images already exist on page.
            const img = new Image();
            img.src = src;
            if (img.complete) {
                if (radius > 0) {
                    ctx.save();
                    this.roundRect(ctx, x, y, width, height, radius);
                    ctx.clip();
                    ctx.drawImage(img, x, y, width, height);
                    ctx.restore();
                } else {
                    ctx.drawImage(img, x, y, width, height);
                }

            } else {
                // If not complete, draw a placeholder but start loading
                ctx.fillStyle = '#f3f4f6';
                ctx.fillRect(x, y, width, height);
                img.onload = () => { /* Redraw will happen on next run */ };
            }
        }

        // Reset shadow for subsequent items
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // 5. BORDER
        if (styles.borderWidth > 0 && styles.borderStyle !== 'none') {
            ctx.strokeStyle = styles.borderColor || '#000';
            ctx.lineWidth = styles.borderWidth;

            // Handle dashed/dotted
            if (styles.borderStyle === 'dashed') {
                ctx.setLineDash([styles.borderWidth * 3, styles.borderWidth * 2]);
            } else if (styles.borderStyle === 'dotted') {
                ctx.setLineDash([styles.borderWidth, styles.borderWidth * 2]);
            } else {
                ctx.setLineDash([]);
            }

            if (radius > 0) {
                this.roundRect(ctx, x, y, width, height, radius);
                ctx.stroke();
            } else {
                const strokeOffset = ctx.lineWidth / 2;
                ctx.strokeRect(x + strokeOffset, y + strokeOffset, width - ctx.lineWidth, height - ctx.lineWidth);
            }

            ctx.setLineDash([]); // Reset
        }

        // 6. TEXT (Works for both 'text' type and 'box' type with direct text)
        if (text) {
            ctx.fillStyle = styles.color || '#000';
            ctx.font = `${styles.fontStyle || ''} ${styles.fontWeight || ''} ${styles.fontSize}px ${styles.fontFamily || 'Helvetica'}`;
            ctx.textBaseline = 'top';

            const pLeft = (styles.padding?.left || 0);
            const pTop = (styles.padding?.top || 0);
            const pRight = (styles.padding?.right || 0);
            const mWidth = Math.max(10, width - pLeft - pRight);

            const lines = this.wrapText(ctx, text, mWidth);
            let cY = y + pTop;

            // Adjust vertical centering if it's a box with single line text
            if (type === 'box' && lines.length === 1 && !styles.padding?.top) {
                const tHeight = styles.lineHeight || styles.fontSize * 1.2;
                cY = y + (height - tHeight) / 2;
            }

            lines.forEach(line => {
                let aX = x + pLeft;
                if (styles.textAlign === 'center') {
                    const m = ctx.measureText(line);
                    aX = x + width / 2 - m.width / 2;
                } else if (styles.textAlign === 'right') {
                    const m = ctx.measureText(line);
                    aX = x + width - pRight - m.width;
                }
                ctx.fillText(line, aX, cY);
                cY += (styles.lineHeight || styles.fontSize * 1.2);
            });
        }


        ctx.restore();
    }


    wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines;
    }

    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
    }
}



// ==================== MODE 3: PIXI RENDERER (GPU ACCELERATED) ====================

class PixiRenderer {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            width: options.width || 595,
            height: options.height || 842,
            backgroundColor: options.backgroundColor || 0xffffff,
            resolution: options.resolution || 3,
            antialias: options.antialias ?? true,
            ...options
        };
        this.app = null;
        this.textureCache = new Map();
    }

    async initialize() {
        // Use imported PIXI first, fall back to window.PIXI
        const PIXI_LIB = PIXI || window.PIXI;

        if (!PIXI_LIB) {
            console.error('PixiJS not loaded. Add: <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.3.2/pixi.min.js"></script>');
            return false;
        }

        const appOptions = {
            width: this.options.width,
            height: this.options.height,
            backgroundColor: this.options.backgroundColor,
            resolution: this.options.resolution,
            antialias: this.options.antialias,
            autoDensity: true
        };

        try {
            // Support both PIXI v7 and v8
            if (PIXI_LIB.Application.prototype.init) {
                // v8 style
                this.app = new PIXI_LIB.Application();
                await this.app.init(appOptions);
                this.container.appendChild(this.app.canvas);
            } else {
                // v7 style
                this.app = new PIXI_LIB.Application(appOptions);
                this.container.appendChild(this.app.view);
            }

            return true;
        } catch (e) {
            console.error('PixiJS Initialization failed:', e);
            return false;
        }
    }

    async render(geometrySnapshot, options = {}) {
        if (!this.app && !options.targetContainer) {
            const initialized = await this.initialize();
            if (!initialized) return null;
        }

        const stage = options.targetContainer || this.app.stage;

        if (!options.targetContainer) {
            stage.removeChildren();
        }

        const PIXI_LIB = PIXI || window.PIXI;
        const mainContainer = new PIXI_LIB.Container();
        stage.addChild(mainContainer);

        // 1. Render Shapes (Background)
        if (options.shapes && options.shapes.length > 0) {
            const shapesContainer = new PIXI_LIB.Container();
            mainContainer.addChild(shapesContainer);
            this.renderShapes(options.shapes, shapesContainer);
        }

        // 2. Render Content
        if (geometrySnapshot && geometrySnapshot.nodes) {
            const contentContainer = new PIXI_LIB.Container();
            mainContainer.addChild(contentContainer);

            const sortedNodes = [...geometrySnapshot.nodes].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
            for (const node of sortedNodes) {
                const displayObject = await this.renderNode(node);
                if (displayObject) contentContainer.addChild(displayObject);
            }
        }

        // 3. Render Lines
        if (options.lines && options.lines.length > 0) {
            const linesContainer = new PIXI_LIB.Container();
            mainContainer.addChild(linesContainer);
            this.renderLines(options.lines, linesContainer);
        }

        return mainContainer;
    }

    renderShapes(shapes, container) {
        const PIXI_LIB = PIXI || window.PIXI;
        shapes.forEach(shape => {
            const graphics = new PIXI_LIB.Graphics();
            const colorData = this.parseColor(shape.color || '#cccccc');
            const alpha = colorData.alpha !== undefined ? colorData.alpha : 1;

            if (graphics.fill) {
                graphics.fill({ color: colorData.hex, alpha });
                if (shape.type === 'circle') {
                    graphics.circle(shape.width / 2, shape.height / 2, shape.width / 2);
                } else {
                    // Default to rect
                    graphics.rect(0, 0, shape.width, shape.height);
                }
            } else {
                graphics.beginFill(colorData.hex, alpha);
                if (shape.type === 'circle') {
                    graphics.drawCircle(shape.width / 2, shape.height / 2, shape.width / 2);
                } else {
                    graphics.drawRect(0, 0, shape.width, shape.height);
                }
                graphics.endFill();
            }

            graphics.x = shape.x;
            graphics.y = shape.y;
            console.log(`   └─ Shape: ${shape.type || 'rect'} at (${shape.x}, ${shape.y}) size ${shape.width}x${shape.height} color: ${shape.color}`);
            container.addChild(graphics);
        });
    }

    renderLines(lines, container) {
        const PIXI_LIB = PIXI || window.PIXI;
        lines.forEach(line => {
            const graphics = new PIXI_LIB.Graphics();
            const colorData = this.parseColor(line.color || '#000000');
            const alpha = colorData.alpha !== undefined ? colorData.alpha : 1;

            if (graphics.stroke) {
                graphics.stroke({ color: colorData.hex, width: line.thickness || 1, alpha });
                graphics.moveTo(line.x1, line.y1);
                graphics.lineTo(line.x2, line.y2);
            } else {
                graphics.lineStyle(line.thickness || 1, colorData.hex, alpha);
                graphics.moveTo(line.x1, line.y1);
                graphics.lineTo(line.x2, line.y2);
            }
            console.log(`   └─ Line: (${line.x1}, ${line.y1}) to (${line.x2}, ${line.y2}) color: ${line.color}`);
            container.addChild(graphics);
        });
    }

    async renderNode(node) {

        switch (node.type) {
            case 'box':
                return this.renderBox(node);
            case 'text':
                return this.renderText(node);
            case 'image':
                return await this.renderImage(node);
            default:
                return null;
        }
    }

    renderBox(node) {
        const PIXI_LIB = PIXI || window.PIXI;
        // Wrap everything in a container for v8 compatibility with shadow ordering
        const wrap = new PIXI_LIB.Container();
        const graphics = new PIXI_LIB.Graphics();
        const { x, y, width, height, styles } = node;

        // Diagnostic log for borders
        if (styles.borderWidth > 0) {
            console.log(`[RENDER-BOX] Border found: ${styles.borderWidth}px ${styles.borderStyle} ${styles.borderColor}`);
        }

        wrap.addChild(graphics);

        // Apply visual properties
        if (styles.opacity !== undefined) wrap.alpha = styles.opacity;

        // Respect transform
        if (styles.transform && styles.transform !== 'none') {
            this.applyTransform(wrap, styles.transform, x, y, width, height);
        } else {
            wrap.x = x;
            wrap.y = y;
        }

        // 1. BOX SHADOW
        if (styles.boxShadow && styles.boxShadow !== 'none') {
            this.renderShadow(wrap, styles.boxShadow, width, height, styles.borderRadius);
        }

        // 2. BACKGROUND COLOR
        if (styles.backgroundColor && styles.backgroundColor !== 'transparent') {
            const colorData = this.parseColor(styles.backgroundColor);
            const fillAlpha = (styles.opacity !== undefined ? styles.opacity : 1) * colorData.alpha;

            if (graphics.fill) {
                graphics.beginPath();
                let radius = styles.borderRadius;
                if (typeof radius === 'string' && radius.endsWith('%')) {
                    radius = (Math.min(width, height) * parseFloat(radius)) / 100;
                }
                graphics.roundRect(0, 0, width, height, radius || 0);
                graphics.fill({ color: colorData.hex, alpha: fillAlpha });
            } else {
                graphics.beginFill(colorData.hex, fillAlpha);
                let radius = styles.borderRadius;
                if (typeof radius === 'string' && radius.endsWith('%')) {
                    radius = (Math.min(width, height) * parseFloat(radius)) / 100;
                }
                graphics.drawRoundedRect(0, 0, width, height, radius || 0);
                graphics.endFill();
            }
        }

        // 3. GRADIENT OVERLAY
        if (styles.gradient) {
            const texture = this.createGradientTexture(width, height, styles.gradient);
            if (texture) {
                const sprite = new PIXI_LIB.Sprite(texture);
                sprite.width = width;
                sprite.height = height;

                if (styles.borderRadius > 0) {
                    const mask = new PIXI_LIB.Graphics();
                    if (mask.fill) {
                        mask.beginPath();
                        mask.roundRect(0, 0, width, height, styles.borderRadius);
                        mask.fill(0xffffff);
                    } else {
                        mask.beginFill(0xffffff);
                        mask.drawRoundedRect(0, 0, width, height, styles.borderRadius);
                        mask.endFill();
                    }
                    sprite.mask = mask;
                    wrap.addChild(mask); // Add mask to wrap
                }
                wrap.addChild(sprite); // Add gradient to wrap on top of background
            }
        }

        // 4. BORDER (Top Layer)
        if (styles.borderWidth > 0 && styles.borderStyle !== 'none') {
            const borderColorData = this.parseColor(styles.borderColor || '#000000');
            const strokeAlpha = borderColorData.alpha;

            if (styles.borderStyle === 'dashed' || styles.borderStyle === 'dotted') {
                this.drawDashedBorder(wrap, node);
            } else {
                const borderGraphics = new PIXI_LIB.Graphics();
                let radius = styles.borderRadius;
                if (typeof radius === 'string' && radius.endsWith('%')) {
                    radius = (Math.min(width, height) * parseFloat(radius)) / 100;
                }

                if (borderGraphics.stroke) {
                    borderGraphics.beginPath();
                    borderGraphics.roundRect(0, 0, width, height, radius || 0);
                    borderGraphics.stroke({
                        color: borderColorData.hex,
                        width: styles.borderWidth,
                        alignment: 0,
                        alpha: strokeAlpha
                    });
                } else {
                    borderGraphics.lineStyle(styles.borderWidth, borderColorData.hex, strokeAlpha);
                    borderGraphics.drawRoundedRect(0, 0, width, height, radius || 0);
                }
                wrap.addChild(borderGraphics);
            }
        }

        // 5. INTERNAL TEXT (For elements that are both box and text)
        if (node.text) {
            const textSprite = this.renderText(node, true); // true = local coordinates
            if (textSprite) wrap.addChild(textSprite);
        }

        return wrap;
    }

    createGradientTexture(width, height, gradient) {
        if (!gradient || !gradient.stops || gradient.stops.length === 0) return null;

        const cacheKey = `${width}x${height}_${gradient.type}_${gradient.angle || 0}_${JSON.stringify(gradient.stops)}`;
        if (this.textureCache.has(cacheKey)) return this.textureCache.get(cacheKey);

        console.log('================ TEXTURE GEN START ================');
        console.log(`Size: ${width}x${height}, Type: ${gradient.type}, Angle: ${gradient.angle}`);

        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(width);
        canvas.height = Math.ceil(height);
        const ctx = canvas.getContext('2d');

        let grad;
        if (gradient.type === 'radial') {
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.max(width, height) / 2;
            grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        } else {
            const angle = gradient.angle !== undefined ? gradient.angle : 180;
            const angleRad = ((angle - 90) * Math.PI) / 180;
            const length = Math.abs(width * Math.cos(angleRad)) + Math.abs(height * Math.sin(angleRad));

            const centerX = width / 2;
            const centerY = height / 2;

            const x1 = centerX - (Math.cos(angleRad) * length) / 2;
            const y1 = centerY - (Math.sin(angleRad) * length) / 2;
            const x2 = centerX + (Math.cos(angleRad) * length) / 2;
            const y2 = centerY + (Math.sin(angleRad) * length) / 2;

            grad = ctx.createLinearGradient(x1, y1, x2, y2);
        }

        gradient.stops.forEach(stop => {
            const colorData = this.parseColor(stop.color);
            // Convert hex to rgb string for canvas
            const r = (colorData.hex >> 16) & 255;
            const g = (colorData.hex >> 8) & 255;
            const b = colorData.hex & 255;
            grad.addColorStop(stop.position, `rgba(${r},${g},${b},${colorData.alpha})`);
        });

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        const PIXI_LIB = PIXI || window.PIXI;
        const texture = PIXI_LIB.Texture.from(canvas);
        this.textureCache.set(cacheKey, texture);

        console.log('Texture Generated and Cached');
        console.log('================ TEXTURE GEN END ==================');

        return texture;
    }

    drawDashedBorder(container, node) {
        const { styles, width, height } = node;
        const borderColorData = this.parseColor(styles.borderColor || '#000000');
        const strokeAlpha = borderColorData.alpha;
        const PIXI_LIB = PIXI || window.PIXI;
        const dashGraphics = new PIXI_LIB.Graphics();

        let radius = styles.borderRadius;
        if (typeof radius === 'string' && radius.endsWith('%')) {
            radius = (Math.min(width, height) * parseFloat(radius)) / 100;
        }
        radius = parseFloat(radius) || 0;

        const dashLen = styles.borderStyle === 'dotted' ? Math.max(1, styles.borderWidth * 0.5) : 10;
        const gapLen = styles.borderStyle === 'dotted' ? styles.borderWidth * 2 : 5;

        // Use a path-based dashing approach for complex shapes
        const drawSegmentedPath = (points) => {
            let overflow = 0;
            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const nx = dx / dist;
                const ny = dy / dist;

                let pos = overflow;
                while (pos < dist) {
                    const d = Math.min(dashLen, dist - pos);
                    dashGraphics.moveTo(p1.x + nx * pos, p1.y + ny * pos);
                    dashGraphics.lineTo(p1.x + nx * (pos + d), p1.y + ny * (pos + d));
                    pos += dashLen + gapLen;
                }
                overflow = pos - dist;
            }
        };

        // Create a precise set of points for the rounded rectangle
        let points = [];
        if (radius === 0) {
            points = [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height }, { x: 0, y: 0 }];
        } else {
            const r = Math.min(radius, width / 2, height / 2);
            const steps = 8; // Points per corner for smooth look

            // Top-Right
            for (let i = 0; i <= steps; i++) {
                const ang = (Math.PI * 1.5) + (Math.PI * 0.5 * (i / steps));
                points.push({ x: width - r + Math.cos(ang) * r, y: r + Math.sin(ang) * r });
            }
            // Bottom-Right
            for (let i = 0; i <= steps; i++) {
                const ang = 0 + (Math.PI * 0.5 * (i / steps));
                points.push({ x: width - r + Math.cos(ang) * r, y: height - r + Math.sin(ang) * r });
            }
            // Bottom-Left
            for (let i = 0; i <= steps; i++) {
                const ang = (Math.PI * 0.5) + (Math.PI * 0.5 * (i / steps));
                points.push({ x: r + Math.cos(ang) * r, y: height - r + Math.sin(ang) * r });
            }
            // Top-Left
            for (let i = 0; i <= steps; i++) {
                const ang = Math.PI + (Math.PI * 0.5 * (i / steps));
                points.push({ x: r + Math.cos(ang) * r, y: r + Math.sin(ang) * r });
            }
            points.push(points[0]); // Close path
        }

        drawSegmentedPath(points);

        if (dashGraphics.stroke) {
            dashGraphics.stroke({ color: borderColorData.hex, width: styles.borderWidth, alpha: strokeAlpha, alignment: 0 });
        } else {
            dashGraphics.lineStyle(styles.borderWidth, borderColorData.hex, strokeAlpha);
        }

        container.addChild(dashGraphics);
    }

    renderShadow(container, shadowStr, width, height, radius) {
        const PIXI_LIB = PIXI || window.PIXI;
        const parts = shadowStr.split(/ (?![^(]*\))/);
        let color = '#000000';
        let ox = undefined, oy = undefined, blur = undefined;

        for (const part of parts) {
            if (part.includes('rgb') || part.startsWith('#')) {
                color = part;
            } else if (part.endsWith('px') || /^\d+$/.test(part)) {
                const val = parseFloat(part);
                if (ox === undefined) ox = val;
                else if (oy === undefined) oy = val;
                else if (blur === undefined) blur = val;
            }
        }

        // Defaults
        ox = ox || 0;
        oy = oy || 0;
        blur = blur || 0;

        const shadowColorData = this.parseColor(color);
        const shadow = new PIXI_LIB.Graphics();

        // Multi-layer for smoothness
        const shadowAlpha = (shadowColorData.alpha || 0.2) / 5; // Lighter layers

        for (let i = 1; i <= 5; i++) {
            const b = (blur / 5) * i;
            if (shadow.fill) {
                shadow.beginPath();
                shadow.roundRect(ox - b, oy - b, width + b * 2, height + b * 2, (radius || 0) + b);
                shadow.fill({ color: shadowColorData.hex, alpha: shadowAlpha });
            } else {
                shadow.beginFill(shadowColorData.hex, shadowAlpha);
                shadow.drawRoundedRect(ox - b, oy - b, width + b * 2, height + b * 2, (radius || 0) + b);
                shadow.endFill();
            }
        }

        // Add at the back of the container
        container.addChildAt(shadow, 0);
    }

    applyTransform(displayObject, transformStr, x, y, width, height) {
        const matrixMatch = transformStr.match(/matrix\(([^)]+)\)/);
        if (matrixMatch) {
            const [a, b, c, d, tx, ty] = matrixMatch[1].split(',').map(v => parseFloat(v));
            displayObject.x = x;
            displayObject.y = y;
            displayObject.scale.x = Math.sqrt(a * a + b * b);
            displayObject.scale.y = Math.sqrt(c * c + d * d);
            displayObject.rotation = Math.atan2(b, a);
        } else {
            displayObject.x = x;
            displayObject.y = y;
        }
    }

    renderText(node, isLocal = false) {
        if (!node || !node.text) return null;
        const PIXI_LIB = PIXI || window.PIXI;
        const { x, y, width, height, text, styles } = node;

        let lineHeight = styles.lineHeight || styles.fontSize * 1.2;
        if (lineHeight < styles.fontSize && lineHeight > 0 && lineHeight < 10) {
            lineHeight = styles.fontSize * lineHeight;
        }

        const textStyleOptions = {
            fontFamily: styles.fontFamily || 'Helvetica',
            fontSize: styles.fontSize || 14,
            fontWeight: styles.fontWeight || 'normal',
            fontStyle: styles.fontStyle || 'normal',
            fill: styles.color || '#000000',
            align: styles.textAlign || 'left',
            lineHeight: lineHeight,
            padding: 5
        };

        const paddingLeft = (styles.padding?.left || 0);
        const paddingRight = (styles.padding?.right || 0);
        const paddingTop = (styles.padding?.top || 0);
        const effectiveWidth = Math.max(1, width - paddingLeft - paddingRight);
        const isSingleLine = height < lineHeight * 1.5;

        if (isSingleLine || styles.whiteSpace === 'nowrap') {
            textStyleOptions.wordWrap = false;
        } else {
            textStyleOptions.wordWrap = true;
            textStyleOptions.wordWrapWidth = effectiveWidth + 10;
        }

        let pixiText;
        try {
            pixiText = new PIXI_LIB.Text({ text: text, style: textStyleOptions });
        } catch (e) {
            pixiText = new PIXI_LIB.Text(text, new PIXI_LIB.TextStyle(textStyleOptions));
        }

        // --- HIGH ACCURACY POSITIONING & ANCHORS ---
        const align = (styles.textAlign || 'left').toLowerCase();
        const jc = (styles.justifyContent || '').toLowerCase();
        const ai = (styles.alignItems || '').toLowerCase();
        const isFlexCenter = jc.includes('center') || ai.includes('center');

        if (align === 'center' || (isLocal && isFlexCenter)) {
            pixiText.anchor.set(0.5, 0);
            pixiText.x = (isLocal ? 0 : x) + width / 2;
        } else if (align === 'right') {
            pixiText.anchor.set(1, 0);
            pixiText.x = (isLocal ? 0 : x) + width - paddingRight;
        } else {
            pixiText.x = (isLocal ? 0 : x) + paddingLeft;
        }

        // Vertical Centering for boxes or flex items
        if (isSingleLine && (height > lineHeight * 1.1 || isFlexCenter)) {
            pixiText.anchor.y = 0.5;
            pixiText.y = (isLocal ? 0 : y) + height / 2;
        } else {
            pixiText.y = (isLocal ? 0 : y) + paddingTop;
        }

        const colorData = this.parseColor(styles.color || '#000000');
        pixiText.alpha = (styles.opacity !== undefined ? styles.opacity : 1) * (colorData.alpha !== undefined ? colorData.alpha : 1);

        return pixiText;
    }

    async renderImage(node) {
        const PIXI_LIB = PIXI || window.PIXI;
        const { x, y, width, height, src, styles } = node;

        try {
            const texture = PIXI_LIB.Assets ? await PIXI_LIB.Assets.load(src) : await PIXI_LIB.Texture.fromURL(src);
            if (!texture) return null;

            const sprite = new PIXI_LIB.Sprite(texture);

            // --- OBJECT-FIT: COVER LOGIC ---
            const iW = texture.width;
            const iH = texture.height;
            if (iW > 0 && iH > 0) {
                const imageRatio = iW / iH;
                const containerRatio = width / height;

                let finalScale = 1;
                if (containerRatio > imageRatio) {
                    finalScale = width / iW;
                } else {
                    finalScale = height / iH;
                }

                sprite.scale.set(finalScale);
                sprite.x = x + (width - iW * finalScale) / 2;
                sprite.y = y + (height - iH * finalScale) / 2;
            } else {
                sprite.x = x;
                sprite.y = y;
                sprite.width = width;
                sprite.height = height;
            }

            if (styles.opacity !== undefined) sprite.alpha = styles.opacity;

            // Apply clipping mask
            const mask = new PIXI_LIB.Graphics();
            if (mask.rect) {
                mask.beginPath();
                mask.rect(x, y, width, height);
                mask.fill(0xffffff);
            } else {
                mask.beginFill(0xffffff);
                mask.drawRect(x, y, width, height);
                mask.endFill();
            }
            sprite.mask = mask;

            const container = new PIXI_LIB.Container();
            container.addChild(sprite);
            container.addChild(mask);

            return container;
        } catch (error) {
            console.error('Failed to load image:', src);
            return null;
        }
    }

    parseColor(cssColor) {
        if (!cssColor || cssColor === 'transparent') return { hex: 0xffffff, alpha: 0 };

        // Handle Hex
        if (cssColor.startsWith('#')) {
            let hex = cssColor.slice(1);
            if (hex.length === 3) hex = hex.split('').map(s => s + s).join('');
            if (hex.length === 6) return { hex: parseInt(hex, 16), alpha: 1 };
            if (hex.length === 8) return { hex: parseInt(hex.slice(0, 6), 16), alpha: parseInt(hex.slice(6, 8), 16) / 255 };
        }

        // Handle RGB/RGBA
        if (cssColor.startsWith('rgb')) {
            const match = cssColor.match(/[\d.]+/g);
            if (match && match.length >= 3) {
                const r = Math.min(255, parseInt(match[0]));
                const g = Math.min(255, parseInt(match[1]));
                const b = Math.min(255, parseInt(match[2]));
                const a = match[3] !== undefined ? parseFloat(match[3]) : 1;
                return { hex: (r << 16) | (g << 8) | b, alpha: a };
            }
        }

        // Handle Named Colors (Extensive List)
        const namedColors = {
            black: 0x000000, white: 0xffffff, red: 0xff0000, lime: 0x00ff00, blue: 0x0000ff, yellow: 0xffff00, cyan: 0x00ffff, magenta: 0xff00ff,
            silver: 0xc0c0c0, gray: 0x808080, grey: 0x808080, maroon: 0x800000, olive: 0x808000, green: 0x008000, purple: 0x800080, teal: 0x008080, navy: 0x000080,
            orange: 0xffa500, pink: 0xffc0cb, gold: 0xffd700, brown: 0xa52a2a, salmon: 0xfa8072, skyblue: 0x87ceeb, violet: 0xee82ee, tomato: 0xff6347
        };
        const color = namedColors[cssColor.toLowerCase().split(' ')[0]];
        if (color !== undefined) return { hex: color, alpha: 1 };

        return { hex: 0xffffff, alpha: 1 };
    }

    async exportImage() {
        if (!this.app) return null;
        const canvas = this.app.renderer.canvas || this.app.renderer.view;
        return canvas.toDataURL();
    }

    destroy() {
        if (this.app) {
            this.app.destroy(true);
            this.app = null;
        }
    }
}

// ==================== MODE 1: ORIGINAL CSS LAYOUT ENGINE ====================
// (All your original code below - keeping it intact)

class LayoutNode {
    constructor(props = {}, children = []) {
        this.props = props;
        this.children = Array.isArray(children) ? children : [];
        this.bounds = null;
        this.intrinsicSize = null;
        this.parent = null;

        this.children.forEach(child => {
            if (child) child.parent = this;
        });
    }

    measure(constraints) {
        throw new Error('measure() must be implemented by subclass');
    }

    layout(bounds) {
        throw new Error('layout() must be implemented by subclass');
    }

    render(engine) {
        throw new Error('render() must be implemented by subclass');
    }

    getContentBox(bounds, padding) {
        const p = parsePadding(padding);
        return {
            x: bounds.x + p.left,
            y: bounds.y + p.top,
            width: bounds.width - p.left - p.right,
            height: bounds.height - p.top - p.bottom
        };
    }

    renderBox(engine) {
        if (!this.bounds) return;

        const { backgroundColor, border, borderRadius = 0 } = this.props;

        if (backgroundColor) {
            engine.ctx.fillStyle = backgroundColor;
            if (borderRadius > 0) {
                this.roundRect(engine.ctx, this.bounds, borderRadius);
                engine.ctx.fill();
            } else {
                engine.ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
            }
        }

        if (border) {
            const [width, style, color] = String(border).split(' ');
            engine.ctx.strokeStyle = color || '#000';
            engine.ctx.lineWidth = parseFloat(width) || 1;

            if (borderRadius > 0) {
                this.roundRect(engine.ctx, this.bounds, borderRadius);
                engine.ctx.stroke();
            } else {
                engine.ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
            }
        }
    }

    roundRect(ctx, bounds, radius) {
        ctx.beginPath();
        ctx.moveTo(bounds.x + radius, bounds.y);
        ctx.lineTo(bounds.x + bounds.width - radius, bounds.y);
        ctx.arcTo(bounds.x + bounds.width, bounds.y, bounds.x + bounds.width, bounds.y + radius, radius);
        ctx.lineTo(bounds.x + bounds.width, bounds.y + bounds.height - radius);
        ctx.arcTo(bounds.x + bounds.width, bounds.y + bounds.height, bounds.x + bounds.width - radius, bounds.y + bounds.height, radius);
        ctx.lineTo(bounds.x + radius, bounds.y + bounds.height);
        ctx.arcTo(bounds.x, bounds.y + bounds.height, bounds.x, bounds.y + bounds.height - radius, radius);
        ctx.lineTo(bounds.x, bounds.y + radius);
        ctx.arcTo(bounds.x, bounds.y, bounds.x + radius, bounds.y, radius);
        ctx.closePath();
    }
}

class FlexNode extends LayoutNode {
    // Full FlexNode implementation from CanvasEngine
    measure(constraints) {
        const {
            flexDirection = 'row',
            gap = 0,
            padding = 0
        } = this.props;

        const p = parsePadding(padding);
        const isRow = flexDirection === 'row' || flexDirection === 'row-reverse';

        // Measure all children
        const childConstraints = {
            maxWidth: constraints.maxWidth - p.left - p.right,
            maxHeight: constraints.maxHeight - p.top - p.bottom
        };

        const childSizes = this.children.map(child => {
            const size = child.measure(childConstraints);
            child.intrinsicSize = size;
            return size;
        });

        if (childSizes.length === 0) {
            return { width: p.left + p.right, height: p.top + p.bottom };
        }

        const totalGap = gap * (this.children.length - 1);

        if (isRow) {
            const width = childSizes.reduce((sum, s) => sum + s.width, 0) + totalGap + p.left + p.right;
            const height = Math.max(...childSizes.map(s => s.height)) + p.top + p.bottom;
            this.intrinsicSize = { width, height };
            return this.intrinsicSize;
        } else {
            const width = Math.max(...childSizes.map(s => s.width)) + p.left + p.right;
            const height = childSizes.reduce((sum, s) => sum + s.height, 0) + totalGap + p.top + p.bottom;
            this.intrinsicSize = { width, height };
            return this.intrinsicSize;
        }
    }

    layout(bounds) {
        this.bounds = bounds;

        if (this.children.length === 0) return;

        const {
            flexDirection = 'row',
            justifyContent = 'flex-start',
            alignItems = 'stretch',
            gap = 0,
            padding = 0
        } = this.props;

        const contentBox = this.getContentBox(bounds, padding);
        const isRow = flexDirection === 'row' || flexDirection === 'row-reverse';
        const mainAxis = isRow ? 'width' : 'height';
        const crossAxis = isRow ? 'height' : 'width';

        // Calculate flex item sizes
        const sizes = this.calculateFlexSizes(contentBox[mainAxis], mainAxis, gap);

        // Calculate main axis positions
        const positions = this.calculateMainAxisPositions(
            sizes,
            justifyContent,
            contentBox[mainAxis],
            gap
        );

        // Layout each child
        this.children.forEach((child, i) => {
            const mainSize = sizes[i];
            const crossSize = this.calculateCrossSize(child, alignItems, contentBox[crossAxis]);
            const crossPos = this.calculateCrossPosition(child, alignItems, contentBox[crossAxis], crossSize);

            let childBounds;
            if (isRow) {
                childBounds = {
                    x: contentBox.x + positions[i],
                    y: contentBox.y + crossPos,
                    width: mainSize,
                    height: crossSize
                };
            } else {
                childBounds = {
                    x: contentBox.x + crossPos,
                    y: contentBox.y + positions[i],
                    width: crossSize,
                    height: mainSize
                };
            }

            child.layout(childBounds);
        });
    }

    calculateFlexSizes(availableSpace, mainAxis, gap) {
        const totalGap = gap * (this.children.length - 1);
        let remainingSpace = availableSpace - totalGap;

        // Step 1: Calculate base sizes (flex-basis or intrinsic)
        const baseSizes = this.children.map(child => {
            const flexBasis = child.props.flexBasis;
            if (flexBasis && flexBasis !== 'auto') {
                return parseSize(flexBasis, availableSpace);
            }
            return child.intrinsicSize[mainAxis];
        });

        const totalBaseSize = baseSizes.reduce((sum, size) => sum + size, 0);
        remainingSpace -= totalBaseSize;

        // Step 2: Grow or shrink
        const sizes = [...baseSizes];

        if (remainingSpace > 0) {
            // GROW
            const totalGrow = this.children.reduce((sum, child) =>
                sum + (parseFloat(child.props.flexGrow) || 0), 0
            );

            if (totalGrow > 0) {
                this.children.forEach((child, i) => {
                    const flexGrow = parseFloat(child.props.flexGrow) || 0;
                    sizes[i] += (remainingSpace * flexGrow / totalGrow);
                });
            }
        } else if (remainingSpace < 0) {
            // SHRINK
            const totalShrink = this.children.reduce((sum, child) =>
                sum + (parseFloat(child.props.flexShrink) || 1), 0
            );

            if (totalShrink > 0) {
                this.children.forEach((child, i) => {
                    const flexShrink = parseFloat(child.props.flexShrink) || 1;
                    const shrinkAmount = Math.abs(remainingSpace) * flexShrink / totalShrink;
                    sizes[i] = Math.max(0, sizes[i] - shrinkAmount);
                });
            }
        }

        return sizes;
    }

    calculateMainAxisPositions(sizes, justifyContent, availableSpace, gap) {
        const positions = [];
        const totalSize = sizes.reduce((sum, s) => sum + s, 0);
        const totalGap = gap * (sizes.length - 1);
        const freeSpace = availableSpace - totalSize - totalGap;

        let currentPos = 0;

        switch (justifyContent) {
            case 'flex-start':
                currentPos = 0;
                break;
            case 'flex-end':
                currentPos = freeSpace;
                break;
            case 'center':
                currentPos = freeSpace / 2;
                break;
            case 'space-between':
                currentPos = 0;
                break;
            case 'space-around':
                currentPos = freeSpace / (sizes.length * 2);
                break;
            case 'space-evenly':
                currentPos = freeSpace / (sizes.length + 1);
                break;
        }

        sizes.forEach((size, i) => {
            positions.push(currentPos);
            currentPos += size;

            if (i < sizes.length - 1) {
                if (justifyContent === 'space-between' && sizes.length > 1) {
                    currentPos += gap + freeSpace / (sizes.length - 1);
                } else if (justifyContent === 'space-around') {
                    currentPos += gap + freeSpace / sizes.length;
                } else if (justifyContent === 'space-evenly') {
                    currentPos += gap + freeSpace / (sizes.length + 1);
                } else {
                    currentPos += gap;
                }
            }
        });

        return positions;
    }

    calculateCrossSize(child, alignItems, availableCrossSize) {
        const alignSelf = child.props.alignSelf || alignItems;

        if (alignSelf === 'stretch' && !child.props.height && !child.props.width) {
            return availableCrossSize;
        }

        const crossAxis = (this.props.flexDirection === 'row' || this.props.flexDirection === 'row-reverse')
            ? 'height' : 'width';

        return child.intrinsicSize[crossAxis];
    }

    calculateCrossPosition(child, alignItems, availableCrossSize, crossSize) {
        const alignSelf = child.props.alignSelf || alignItems;

        switch (alignSelf) {
            case 'flex-start':
            case 'stretch':
                return 0;
            case 'flex-end':
                return availableCrossSize - crossSize;
            case 'center':
                return (availableCrossSize - crossSize) / 2;
            default:
                return 0;
        }
    }

    render(engine) {
        this.renderBox(engine);
        this.children.forEach(child => child.render(engine));
    }
}

class GridNode extends LayoutNode {
    measure(constraints) {
        const {
            gridTemplateColumns = ['1fr'],
            gridTemplateRows = ['auto'],
            gap = 0,
            columnGap = gap,
            rowGap = gap,
            padding = 0
        } = this.props;

        const p = parsePadding(padding);

        // For auto-sized grids, we need to measure children
        const childConstraints = {
            maxWidth: constraints.maxWidth - p.left - p.right,
            maxHeight: constraints.maxHeight - p.top - p.bottom
        };

        this.children.forEach(child => {
            child.intrinsicSize = child.measure(childConstraints);
        });

        // Estimate size (will be resolved in layout)
        const colCount = gridTemplateColumns.length;
        const rowCount = gridTemplateRows.length;

        const estimatedWidth = constraints.maxWidth ||
            (colCount * 100 + parseSize(columnGap) * (colCount - 1) + p.left + p.right);
        const estimatedHeight = constraints.maxHeight ||
            (rowCount * 50 + parseSize(rowGap) * (rowCount - 1) + p.top + p.bottom);

        this.intrinsicSize = { width: estimatedWidth, height: estimatedHeight };
        return this.intrinsicSize;
    }

    layout(bounds) {
        this.bounds = bounds;

        if (this.children.length === 0) return;

        const {
            gridTemplateColumns = ['1fr'],
            gridTemplateRows = ['auto'],
            gap = 0,
            columnGap = gap,
            rowGap = gap,
            padding = 0
        } = this.props;

        const contentBox = this.getContentBox(bounds, padding);

        // Resolve grid tracks
        const colSizes = this.resolveGridTracks(
            gridTemplateColumns,
            contentBox.width,
            parseSize(columnGap),
            'width'
        );

        const rowSizes = this.resolveGridTracks(
            gridTemplateRows,
            contentBox.height,
            parseSize(rowGap),
            'height'
        );

        // Calculate grid line positions
        const colPositions = this.calculateGridLinePositions(colSizes, parseSize(columnGap));
        const rowPositions = this.calculateGridLinePositions(rowSizes, parseSize(rowGap));

        // Layout each child
        this.children.forEach((child, i) => {
            const placement = this.getGridPlacement(child, i, gridTemplateColumns.length);

            const childBounds = {
                x: contentBox.x + colPositions[placement.colStart],
                y: contentBox.y + rowPositions[placement.rowStart],
                width: colPositions[placement.colEnd] - colPositions[placement.colStart],
                height: rowPositions[placement.rowEnd] - rowPositions[placement.rowStart]
            };

            child.layout(childBounds);
        });
    }

    resolveGridTracks(tracks, availableSpace, gap, axis) {
        const sizes = [];
        let usedSpace = 0;
        const totalGap = gap * (tracks.length - 1);

        // Step 1: Calculate fixed and auto tracks
        const frTracks = [];

        tracks.forEach((track, i) => {
            if (String(track).endsWith('fr')) {
                frTracks.push({ index: i, value: parseFloat(track) });
                sizes[i] = 0;
            } else if (track === 'auto') {
                // Calculate auto size based on content
                const autoSize = this.calculateAutoTrackSize(i, axis);
                sizes[i] = autoSize;
                usedSpace += autoSize;
            } else {
                // Fixed size
                const size = parseSize(track, availableSpace);
                sizes[i] = size;
                usedSpace += size;
            }
        });

        // Step 2: Distribute remaining space to fr tracks
        const remaining = availableSpace - usedSpace - totalGap;
        const totalFr = frTracks.reduce((sum, t) => sum + t.value, 0);

        if (totalFr > 0 && remaining > 0) {
            const frUnit = remaining / totalFr;
            frTracks.forEach(({ index, value }) => {
                sizes[index] = frUnit * value;
            });
        }

        return sizes;
    }

    calculateAutoTrackSize(trackIndex, axis) {
        // Find all children in this track and get max size
        const { gridTemplateColumns = ['1fr'] } = this.props;
        const colCount = gridTemplateColumns.length;

        let maxSize = 0;

        this.children.forEach((child, i) => {
            const placement = this.getGridPlacement(child, i, colCount);
            const isInTrack = axis === 'width'
                ? (placement.colStart === trackIndex)
                : (placement.rowStart === trackIndex);

            if (isInTrack && child.intrinsicSize) {
                maxSize = Math.max(maxSize, child.intrinsicSize[axis]);
            }
        });

        return maxSize || 50; // Default size
    }

    calculateGridLinePositions(sizes, gap) {
        const positions = [0];
        let current = 0;

        sizes.forEach((size, i) => {
            current += size;
            positions.push(current);
            if (i < sizes.length - 1) {
                current += gap;
            }
        });

        return positions;
    }

    getGridPlacement(child, index, colCount) {
        // Check for explicit grid-area or grid-column/row
        if (child.props.gridArea) {
            return this.parseGridArea(child.props.gridArea);
        }

        if (child.props.gridColumn || child.props.gridRow) {
            return {
                colStart: this.parseGridLine(child.props.gridColumn, true) - 1,
                colEnd: this.parseGridLine(child.props.gridColumn, false),
                rowStart: this.parseGridLine(child.props.gridRow, true) - 1,
                rowEnd: this.parseGridLine(child.props.gridRow, false)
            };
        }

        // Auto-placement
        const row = Math.floor(index / colCount);
        const col = index % colCount;

        return {
            colStart: col,
            colEnd: col + 1,
            rowStart: row,
            rowEnd: row + 1
        };
    }

    parseGridArea(area) {
        // Format: "rowStart / colStart / rowEnd / colEnd"
        // or "row / col" (spans 1)
        const parts = String(area).split('/').map(s => s.trim());

        if (parts.length === 4) {
            return {
                rowStart: parseInt(parts[0]) - 1,
                colStart: parseInt(parts[1]) - 1,
                rowEnd: parseInt(parts[2]),
                colEnd: parseInt(parts[3])
            };
        } else if (parts.length === 2) {
            return {
                rowStart: parseInt(parts[0]) - 1,
                colStart: parseInt(parts[1]) - 1,
                rowEnd: parseInt(parts[0]),
                colEnd: parseInt(parts[1])
            };
        }

        return { colStart: 0, colEnd: 1, rowStart: 0, rowEnd: 1 };
    }

    parseGridLine(value, isStart) {
        if (!value) return isStart ? 1 : 2;

        const parts = String(value).split('/').map(s => s.trim());
        return parseInt(isStart ? parts[0] : (parts[1] || parts[0])) || (isStart ? 1 : 2);
    }

    render(engine) {
        this.renderBox(engine);

        // Debug: Draw grid lines
        if (engine.debug) {
            this.drawGridLines(engine);
        }

        this.children.forEach(child => child.render(engine));
    }

    drawGridLines(engine) {
        // Not implemented yet - would draw grid visualization
    }
}
class TextNode extends LayoutNode { constructor(content, props = {}) { super(props, []); this.content = content; } measure(constraints) { const { font = '16px Arial', maxWidth = constraints.maxWidth, lineHeight } = this.props; const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); ctx.font = font; const fontSize = parseInt(font) || 16; const lh = lineHeight || fontSize * 1.2; if (maxWidth === Infinity || !maxWidth) { const metrics = ctx.measureText(this.content); this.intrinsicSize = { width: metrics.width, height: lh }; } else { const lines = this.wrapText(ctx, this.content, maxWidth); this.intrinsicSize = { width: maxWidth, height: lines.length * lh }; } return this.intrinsicSize; } wrapText(ctx, text, maxWidth) { const words = text.split(' '); const lines = []; let currentLine = ''; words.forEach(word => { const testLine = currentLine ? `${currentLine} ${word}` : word; const metrics = ctx.measureText(testLine); if (metrics.width > maxWidth && currentLine) { lines.push(currentLine); currentLine = word; } else { currentLine = testLine; } }); if (currentLine) lines.push(currentLine); return lines; } layout(bounds) { this.bounds = bounds; } render(engine) { if (!this.bounds) return; const { font = '16px Arial', color = '#000000', textAlign = 'left', lineHeight } = this.props; const ctx = engine.ctx; ctx.font = font; ctx.fillStyle = color; ctx.textBaseline = 'top'; const fontSize = parseInt(font) || 16; const lh = lineHeight || fontSize * 1.2; const lines = this.wrapText(ctx, this.content, this.bounds.width); lines.forEach((line, i) => { let x = this.bounds.x; const y = this.bounds.y + (i * lh); if (textAlign === 'center') { const metrics = ctx.measureText(line); x = this.bounds.x + (this.bounds.width - metrics.width) / 2; } else if (textAlign === 'right') { const metrics = ctx.measureText(line); x = this.bounds.x + this.bounds.width - metrics.width; } ctx.fillText(line, x, y); }); } }
class BlockNode extends LayoutNode {
    measure(constraints) {
        const { width, height, padding = 0, margin = 0 } = this.props;
        const p = parsePadding(padding);
        const m = parseMargin(margin);

        // If explicit size provided
        if (width && height) {
            return {
                width: parseSize(width, constraints.maxWidth) + m.left + m.right,
                height: parseSize(height, constraints.maxHeight) + m.top + m.bottom
            };
        }

        // Otherwise measure children
        const childConstraints = {
            maxWidth: width ? parseSize(width, constraints.maxWidth) - p.left - p.right :
                constraints.maxWidth - p.left - p.right - m.left - m.right,
            maxHeight: height ? parseSize(height, constraints.maxHeight) - p.top - p.bottom :
                constraints.maxHeight - p.top - p.bottom - m.top - m.bottom
        };

        if (this.children.length === 0) {
            return {
                width: (width ? parseSize(width, constraints.maxWidth) : 0) + p.left + p.right + m.left + m.right,
                height: (height ? parseSize(height, constraints.maxHeight) : 0) + p.top + p.bottom + m.top + m.bottom
            };
        }

        const childSizes = this.children.map(child => {
            const size = child.measure(childConstraints);
            child.intrinsicSize = size;
            return size;
        });

        const contentWidth = Math.max(...childSizes.map(s => s.width));
        const contentHeight = childSizes.reduce((sum, s) => sum + s.height, 0);

        this.intrinsicSize = {
            width: (width ? parseSize(width, constraints.maxWidth) : contentWidth) + p.left + p.right + m.left + m.right,
            height: (height ? parseSize(height, constraints.maxHeight) : contentHeight) + p.top + p.bottom + m.top + m.bottom
        };

        return this.intrinsicSize;
    }

    layout(bounds) {
        const { position = 'relative', top, left, padding = 0, margin = 0 } = this.props;
        const m = parseMargin(margin);

        // Apply margin
        this.bounds = {
            x: bounds.x + m.left,
            y: bounds.y + m.top,
            width: bounds.width - m.left - m.right,
            height: bounds.height - m.top - m.bottom
        };

        if (position === 'absolute') {
            // Position absolutely within parent
            const x = left !== undefined ? bounds.x + parseSize(left, bounds.width) : this.bounds.x;
            const y = top !== undefined ? bounds.y + parseSize(top, bounds.height) : this.bounds.y;

            this.bounds = { ...this.bounds, x, y };
        }

        // Layout children within content box
        const contentBox = this.getContentBox(this.bounds, padding);

        let currentY = contentBox.y;
        this.children.forEach(child => {
            const childHeight = child.intrinsicSize?.height || 0;
            child.layout({
                x: contentBox.x,
                y: currentY,
                width: contentBox.width,
                height: childHeight
            });
            currentY += childHeight;
        });
    }

    render(engine) {
        this.renderBox(engine);
        this.children.forEach(child => child.render(engine));
    }
}

class ImageNode extends LayoutNode {
    constructor(src, props = {}) {
        super(props, []);
        this.src = src;
        this.image = null;
        this.loaded = false;

        if (typeof src === 'string') {
            this.image = new Image();
            this.image.onload = () => { this.loaded = true; };
            this.image.src = src;
        } else if (src instanceof Image) {
            this.image = src;
            this.loaded = src.complete;
        }
    }

    measure(constraints) {
        const { width, height, objectFit = 'contain' } = this.props;

        if (width && height) {
            this.intrinsicSize = {
                width: parseSize(width, constraints.maxWidth),
                height: parseSize(height, constraints.maxHeight)
            };
        } else if (this.loaded && this.image) {
            const aspectRatio = this.image.width / this.image.height;

            if (width) {
                const w = parseSize(width, constraints.maxWidth);
                this.intrinsicSize = { width: w, height: w / aspectRatio };
            } else if (height) {
                const h = parseSize(height, constraints.maxHeight);
                this.intrinsicSize = { width: h * aspectRatio, height: h };
            } else {
                this.intrinsicSize = {
                    width: Math.min(this.image.width, constraints.maxWidth),
                    height: Math.min(this.image.height, constraints.maxHeight)
                };
            }
        } else {
            this.intrinsicSize = { width: 100, height: 100 };
        }

        return this.intrinsicSize;
    }

    layout(bounds) {
        this.bounds = bounds;
    }

    render(engine) {
        if (!this.loaded || !this.image || !this.bounds) return;

        const { objectFit = 'contain', borderRadius = 0 } = this.props;

        const ctx = engine.ctx;

        // Calculate image dimensions based on objectFit
        let sx = 0, sy = 0, sw = this.image.width, sh = this.image.height;
        let dx = this.bounds.x, dy = this.bounds.y, dw = this.bounds.width, dh = this.bounds.height;

        if (objectFit === 'cover') {
            const scale = Math.max(dw / sw, dh / sh);
            const scaledWidth = sw * scale;
            const scaledHeight = sh * scale;
            sx = (scaledWidth - dw) / (2 * scale);
            sy = (scaledHeight - dh) / (2 * scale);
            sw = dw / scale;
            sh = dh / scale;
        } else if (objectFit === 'contain') {
            const scale = Math.min(dw / sw, dh / sh);
            dw = sw * scale;
            dh = sh * scale;
            dx = this.bounds.x + (this.bounds.width - dw) / 2;
            dy = this.bounds.y + (this.bounds.height - dh) / 2;
        }

        // Clip if borderRadius
        if (borderRadius > 0) {
            ctx.save();
            this.roundRect(ctx, { x: dx, y: dy, width: dw, height: dh }, borderRadius);
            ctx.clip();
        }

        ctx.drawImage(this.image, sx, sy, sw, sh, dx, dy, dw, dh);

        if (borderRadius > 0) {
            ctx.restore();
        }
    }
}

class SpacerNode extends LayoutNode {
    constructor(size, props = {}) {
        super(props, []);
        this.size = size;
    }

    measure(constraints) {
        this.intrinsicSize = {
            width: parseSize(this.size, constraints.maxWidth),
            height: parseSize(this.size, constraints.maxHeight)
        };
        return this.intrinsicSize;
    }

    layout(bounds) {
        this.bounds = bounds;
    }

    render(engine) {
        // Spacers don't render anything
    }
}


class CanvasLayoutEngine {
    constructor(canvas, config = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.config = config;
        this.scale = config.scale || 1;
        this.debug = config.debug || false;

        // Cache for performance
        this.measureCache = new Map();
    }

    initialize(width, height) {
        this.canvas.width = width * this.scale;
        this.canvas.height = height * this.scale;
        this.ctx.scale(this.scale, this.scale);
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';

        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);

        if (this.debug) {
            this.drawDebugGrid(width, height);
        }
    }

    renderLayoutTree(rootNode, bounds) {
        // Phase 1: Measure
        rootNode.layout(bounds);

        // Phase 3: Render
        rootNode.render(this);
    }

    drawDebugGrid(width, height) {
        this.ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x < width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }

        for (let y = 0; y < height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
    }

    toDataURL(type = 'image/png', quality = 1.0) {
        return this.canvas.toDataURL(type, quality);
    }

    toImage() {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = this.toDataURL();
        });
    }

    download(filename = 'layout') {
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = this.toDataURL();
        link.click();
    }
}

// ==================== CONFIG PARSER ====================

function parseConfigToLayout(config, data) {
    const { display = 'block', children = [], ...props } = config;

    const childNodes = children.map(child => {
        if (typeof child === 'string') {
            return new TextNode(child, props);
        } else if (child.type === 'text') {
            return new TextNode(child.content, child.props || {});
        } else if (child.type === 'image') {
            return new ImageNode(child.src, child.props || {});
        } else if (child.type === 'spacer') {
            return new SpacerNode(child.size, child.props || {});
        } else {
            return parseConfigToLayout(child, data);
        }
    });

    // Create appropriate node based on display
    if (display === 'flex') {
        return new FlexNode(props, childNodes);
    } else if (display === 'grid') {
        return new GridNode(props, childNodes);
    } else {
        return new BlockNode(props, childNodes);
    }
}

export {
    CanvasLayoutEngine,
    LayoutNode,
    FlexNode,
    GridNode,
    BlockNode,
    TextNode,
    ImageNode,
    SpacerNode,
    parseConfigToLayout,
    GeometrySnapshot,
    PixiRenderer,
    HybridRenderer
};

// ==================== HYBRID RENDERING ORCHESTRATOR ====================

class HybridRenderer {
    constructor(options = {}) {
        this.mode = options.mode || 'css'; // 'css' | 'geometry' | 'pixi'
        this.container = options.container;
        this.canvas = null;
        this.engine = null;
        this.pixiRenderer = null;
        this.geometrySnapshot = null;
    }

    /**
     * MODE 1: CSS Layout Engine (Manual Layout Building)
     */
    async renderWithCSSEngine(layoutTree, bounds) {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.container.appendChild(this.canvas);
        }

        this.engine = new CanvasLayoutEngine(this.canvas, { scale: 2 });
        this.engine.initialize(bounds.width, bounds.height);
        this.engine.renderLayoutTree(layoutTree, bounds);

        return this.canvas;
    }

    /**
     * MODE 2: Geometry Snapshot (DOM Capture)
     */
    async renderWithGeometrySnapshot(domElement, renderMode = 'canvas') {
        this.geometrySnapshot = new GeometrySnapshot();
        const snapshot = this.geometrySnapshot.capture(domElement);

        if (renderMode === 'canvas') {
            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.container.appendChild(this.canvas);
            }

            this.geometrySnapshot.renderToCanvas(this.canvas);
            return this.canvas;
        } else if (renderMode === 'pixi') {
            return this.renderSnapshotWithPixi(snapshot);
        }

        return snapshot;
    }

    /**
     * MODE 3: PixiJS Renderer (GPU Accelerated)
     */
    async renderWithPixi(geometrySnapshot, config = {}) {
        if (!this.pixiRenderer) {
            this.pixiRenderer = new PixiRenderer(this.container, {
                width: geometrySnapshot.width,
                height: geometrySnapshot.height
            });
            await this.pixiRenderer.initialize();
        }

        await this.pixiRenderer.render(geometrySnapshot, {
            shapes: config.shapes,
            lines: config.lines
        });
        return this.pixiRenderer;
    }

    async renderSnapshotWithPixi(snapshot, config = {}) {
        return this.renderWithPixi(snapshot, config);
    }

    async exportImage() {
        if (this.pixiRenderer) {
            return await this.pixiRenderer.exportImage();
        } else if (this.canvas) {
            return this.canvas.toDataURL();
        }
        return null;
    }

    destroy() {
        if (this.pixiRenderer) {
            this.pixiRenderer.destroy();
        }
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
    }
}

