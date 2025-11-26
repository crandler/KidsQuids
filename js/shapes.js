/**
 * KidsQuids - Shape Classes
 * Colorful, animated shapes for the game
 */

// Color themes
const colorThemes = {
    default: {
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'],
        background: '#F8F9FA',
        accent: '#6C5CE7'
    },
    pastel: {
        colors: ['#FFB5BA', '#B5DEFF', '#C3FFC3', '#FFFFC3', '#E8C3FF', '#FFD9C3', '#C3FFFF', '#FFC3E8'],
        background: '#FFF5F5',
        accent: '#B5B5FF'
    },
    neon: {
        colors: ['#FF0080', '#00FF80', '#8000FF', '#FF8000', '#00FFFF', '#FFFF00', '#FF00FF', '#80FF00'],
        background: '#1A1A2E',
        accent: '#00FFFF'
    },
    rainbow: {
        colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3', '#FF1493'],
        background: '#FFFAF0',
        accent: '#FF69B4'
    }
};

// Shape types
const SHAPE_TYPES = ['circle', 'square', 'triangle', 'star', 'heart', 'hexagon', 'diamond', 'oval'];

// Base Shape class
class Shape {
    constructor(x, y, size, color, type = 'circle') {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.type = type;
        this.rotation = 0;
        this.scale = 1;
        this.alpha = 1;
        this.velocity = { x: 0, y: 0 };
        this.angularVelocity = 0;
        this.wobble = 0;
        this.wobbleSpeed = 0.1;
        this.wobbleAmount = 0;
        this.isHovered = false;
        this.isClicked = false;
        this.isActive = true;
        this.pulsePhase = Math.random() * Math.PI * 2;

        // For animations
        this.targetX = x;
        this.targetY = y;
        this.targetScale = 1;
        this.animationSpeed = 0.1;

        // Face expression
        this.expression = 'happy'; // happy, surprised, sleeping
        this.eyeBlink = 0;
        this.blinkTimer = Math.random() * 200;
    }

    update(deltaTime) {
        // Update wobble
        this.wobble += this.wobbleSpeed;

        // Update pulse
        this.pulsePhase += 0.05;

        // Smooth movement towards target
        this.x += (this.targetX - this.x) * this.animationSpeed;
        this.y += (this.targetY - this.y) * this.animationSpeed;
        this.scale += (this.targetScale - this.scale) * this.animationSpeed;

        // Apply velocity
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;

        // Apply rotation
        this.rotation += this.angularVelocity * deltaTime;

        // Eye blink timer
        this.blinkTimer--;
        if (this.blinkTimer <= 0) {
            this.eyeBlink = 1;
            setTimeout(() => { this.eyeBlink = 0; }, 100);
            this.blinkTimer = 150 + Math.random() * 200;
        }

        // Hover effect
        if (this.isHovered) {
            this.targetScale = 1.15;
            this.wobbleAmount = 3;
        } else {
            this.targetScale = 1;
            this.wobbleAmount = 0;
        }
    }

    draw(ctx) {
        if (!this.isActive || this.alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const wobbleOffset = Math.sin(this.wobble) * this.wobbleAmount;
        ctx.scale(this.scale + Math.sin(this.pulsePhase) * 0.02, this.scale + Math.cos(this.pulsePhase) * 0.02);
        ctx.rotate(wobbleOffset * 0.05);

        // Draw shadow
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        // Draw shape
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.darkenColor(this.color, 20);
        ctx.lineWidth = 3;

        this.drawShape(ctx);

        // Reset shadow for face
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw cute face
        this.drawFace(ctx);

        ctx.restore();
    }

    drawShape(ctx) {
        const s = this.size;

        switch (this.type) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, s, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                break;

            case 'square':
                ctx.beginPath();
                this.roundRect(ctx, -s, -s, s * 2, s * 2, s * 0.2);
                ctx.fill();
                ctx.stroke();
                break;

            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -s);
                ctx.lineTo(s, s * 0.8);
                ctx.lineTo(-s, s * 0.8);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;

            case 'star':
                this.drawStar(ctx, 5, s, s * 0.5);
                break;

            case 'heart':
                this.drawHeart(ctx, s);
                break;

            case 'hexagon':
                this.drawPolygon(ctx, 6, s);
                break;

            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(0, -s);
                ctx.lineTo(s * 0.7, 0);
                ctx.lineTo(0, s);
                ctx.lineTo(-s * 0.7, 0);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;

            case 'oval':
                ctx.beginPath();
                ctx.ellipse(0, 0, s, s * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                break;

            default:
                ctx.beginPath();
                ctx.arc(0, 0, s, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
        }
    }

    drawFace(ctx) {
        const s = this.size * 0.4;
        const eyeSpacing = s * 0.6;
        const eyeY = -s * 0.2;

        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(-eyeSpacing, eyeY, s * 0.35, this.eyeBlink ? s * 0.05 : s * 0.35, 0, 0, Math.PI * 2);
        ctx.ellipse(eyeSpacing, eyeY, s * 0.35, this.eyeBlink ? s * 0.05 : s * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();

        if (!this.eyeBlink) {
            // Pupils
            ctx.fillStyle = '#333333';
            ctx.beginPath();
            ctx.arc(-eyeSpacing, eyeY, s * 0.15, 0, Math.PI * 2);
            ctx.arc(eyeSpacing, eyeY, s * 0.15, 0, Math.PI * 2);
            ctx.fill();

            // Eye shine
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(-eyeSpacing - s * 0.05, eyeY - s * 0.08, s * 0.08, 0, Math.PI * 2);
            ctx.arc(eyeSpacing - s * 0.05, eyeY - s * 0.08, s * 0.08, 0, Math.PI * 2);
            ctx.fill();
        }

        // Mouth based on expression
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        const mouthY = s * 0.4;

        switch (this.expression) {
            case 'happy':
                ctx.beginPath();
                ctx.arc(0, mouthY - s * 0.1, s * 0.3, 0.1 * Math.PI, 0.9 * Math.PI);
                ctx.stroke();
                break;
            case 'surprised':
                ctx.fillStyle = '#333333';
                ctx.beginPath();
                ctx.ellipse(0, mouthY, s * 0.15, s * 0.2, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'sleeping':
                ctx.beginPath();
                ctx.moveTo(-s * 0.2, mouthY);
                ctx.lineTo(s * 0.2, mouthY);
                ctx.stroke();
                break;
        }

        // Rosy cheeks
        ctx.fillStyle = 'rgba(255, 150, 150, 0.4)';
        ctx.beginPath();
        ctx.ellipse(-eyeSpacing - s * 0.2, eyeY + s * 0.4, s * 0.2, s * 0.12, 0, 0, Math.PI * 2);
        ctx.ellipse(eyeSpacing + s * 0.2, eyeY + s * 0.4, s * 0.2, s * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    drawStar(ctx, points, outerR, innerR) {
        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = (i * Math.PI) / points - Math.PI / 2;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    drawHeart(ctx, size) {
        ctx.beginPath();
        ctx.moveTo(0, size * 0.3);
        ctx.bezierCurveTo(-size, -size * 0.3, -size, -size, 0, -size * 0.5);
        ctx.bezierCurveTo(size, -size, size, -size * 0.3, 0, size * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    drawPolygon(ctx, sides, radius) {
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max((num >> 16) - amt, 0);
        const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
        const B = Math.max((num & 0x0000FF) - amt, 0);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }

    containsPoint(px, py) {
        const dx = px - this.x;
        const dy = py - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // Use targetScale for hitbox so shapes are clickable while animating
        const hitboxScale = Math.max(this.scale, this.targetScale, 0.5);
        return dist <= this.size * hitboxScale;
    }

    // Animation methods
    pop() {
        this.targetScale = 1.5;
        this.alpha = 1;
        setTimeout(() => {
            this.targetScale = 0;
            this.alpha = 0;
        }, 100);
    }

    bounce() {
        this.targetScale = 1.3;
        setTimeout(() => { this.targetScale = 1; }, 150);
    }

    shake() {
        this.wobbleAmount = 10;
        setTimeout(() => { this.wobbleAmount = 0; }, 300);
    }

    setExpression(expr) {
        this.expression = expr;
    }

    moveTo(x, y) {
        this.targetX = x;
        this.targetY = y;
    }
}

// Confetti particle for celebrations
class Confetti {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = 5 + Math.random() * 10;
        this.velocity = {
            x: (Math.random() - 0.5) * 15,
            y: -10 - Math.random() * 10
        };
        this.gravity = 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.3;
        this.alpha = 1;
        this.shape = Math.floor(Math.random() * 3); // 0: rect, 1: circle, 2: triangle
    }

    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.rotation += this.rotationSpeed;
        this.alpha -= 0.01;
    }

    draw(ctx) {
        if (this.alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;

        switch (this.shape) {
            case 0:
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2);
                break;
            case 1:
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 2:
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                ctx.lineTo(this.size / 2, this.size / 2);
                ctx.lineTo(-this.size / 2, this.size / 2);
                ctx.closePath();
                ctx.fill();
                break;
        }

        ctx.restore();
    }

    isAlive() {
        return this.alpha > 0;
    }
}

// Factory function to create random shapes
function createRandomShape(x, y, size, theme = 'default') {
    const colors = colorThemes[theme]?.colors || colorThemes.default.colors;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const type = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
    return new Shape(x, y, size, color, type);
}

// Create confetti burst
function createConfettiBurst(x, y, count = 30, theme = 'default') {
    const colors = colorThemes[theme]?.colors || colorThemes.default.colors;
    const confetti = [];
    for (let i = 0; i < count; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        confetti.push(new Confetti(x, y, color));
    }
    return confetti;
}
