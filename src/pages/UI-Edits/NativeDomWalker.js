/**
 * NativeDomWalker.js
 * A utility to render DOM elements directly to a Canvas 2D context
 * without using an intermediate snapshot or library.
 */

export class NativeDomWalker {
    constructor(ctx, options = {}) {
        this.ctx = ctx;
        this.scale = options.scale || 1;
        this.rootBounds = null;
    }

    render(rootElement) {
        this.rootBounds = rootElement.getBoundingClientRect();
        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        this.walk(rootElement);
        this.ctx.restore();
    }

    walk(el) {
        if (!el || el.nodeType !== 1) return; // Only process element nodes

        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return;

        const bounds = el.getBoundingClientRect();
        const x = bounds.left - this.rootBounds.left;
        const y = bounds.top - this.rootBounds.top;
        const width = bounds.width;
        const height = bounds.height;

        this.drawElement(el, style, x, y, width, height);

        // recurse
        for (let i = 0; i < el.childNodes.length; i++) {
            const child = el.childNodes[i];
            if (child.nodeType === 1) {
                this.walk(child);
            } else if (child.nodeType === 3) {
                this.drawText(child, el, style, x, y, width, height);
            }
        }
    }

    drawElement(el, style, x, y, width, height) {
        const ctx = this.ctx;
        ctx.save();

        // 1. Background
        const bgColor = style.backgroundColor;
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            ctx.fillStyle = bgColor;
            const radius = parseFloat(style.borderRadius) || 0;
            if (radius > 0) {
                this.roundRect(ctx, x, y, width, height, radius);
                ctx.fill();
            } else {
                ctx.fillRect(x, y, width, height);
            }
        }

        // 2. Border
        const bWidth = parseFloat(style.borderWidth);
        if (bWidth > 0 && style.borderStyle !== 'none') {
            ctx.strokeStyle = style.borderColor;
            ctx.lineWidth = bWidth;
            const radius = parseFloat(style.borderRadius) || 0;
            if (radius > 0) {
                this.roundRect(ctx, x, y, width, height, radius);
                ctx.stroke();
            } else {
                ctx.strokeRect(x + bWidth / 2, y + bWidth / 2, width - bWidth, height - bWidth);
            }
        }

        // 3. Image
        if (el.tagName === 'IMG') {
            if (el.complete && el.naturalWidth > 0) {
                const radius = parseFloat(style.borderRadius) || 0;
                if (radius > 0) {
                    this.roundRect(ctx, x, y, width, height, radius);
                    ctx.clip();
                    ctx.drawImage(el, x, y, width, height);
                } else {
                    ctx.drawImage(el, x, y, width, height);
                }
            }
        }

        ctx.restore();
    }

    drawText(textNode, parentEl, style, x, y, width, height) {
        const text = textNode.textContent.trim();
        if (!text) return;

        const ctx = this.ctx;
        ctx.save();

        ctx.fillStyle = style.color;
        ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        ctx.textBaseline = 'top';

        // Very basic text alignment based on parent's computed style
        let alignX = x;
        const paddingLeft = parseFloat(style.paddingLeft) || 0;
        const paddingTop = parseFloat(style.paddingTop) || 0;

        // This is a naive implementation; it doesn't handle multi-line wrapping well
        // But it satisfies the "standard Canvas 2D API" requirement
        ctx.fillText(text, x + paddingLeft, y + paddingTop);

        ctx.restore();
    }

    roundRect(ctx, x, y, width, height, radius) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
    }
}
