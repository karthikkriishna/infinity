// UTILITIES
const random = (min, max) => Math.random() * (max - min) + min;

// 1. MÖBIUS STRIP HERO BACKGROUND
class MobiusStrip {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: false });
        this.resize();
        
        // Configuration
        this.radius = 200; // Main radius of the loop
        this.width = 60;   // Width of the strip
        this.particleCount = 400;
        
        // State
        this.particles = [];
        this.rotationY = 0;
        this.rotationX = 0.5; // Slight tilt
        
        this.init();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            // Subtle rotation influence
            this.targetRotY = (e.clientX - this.w/2) * 0.0002;
            this.targetRotX = (e.clientY - this.h/2) * 0.0002;
        });
    }
    
    resize() {
        this.w = this.canvas.width = window.innerWidth;
        this.h = this.canvas.height = window.innerHeight;
        this.cx = this.w / 2;
        this.cy = this.h / 2;
        // Adjust scale based on screen size
        this.scale = Math.min(this.w, this.h) / 3; 
    }
    
    init() {
        this.particles = [];
        for(let i=0; i<this.particleCount; i++) {
            this.particles.push({
                u: Math.random() * Math.PI * 4, // Position along the loop (0 to 4pi for full Möbius traversal)
                v: (Math.random() * 2 - 1),     // Position across the width (-1 to 1)
                speed: Math.random() * 0.02 + 0.005,
                color: Math.random() > 0.6 ? '#64ffda' : '#57cbff'
            });
        }
    }
    
    update() {
        this.rotationY += 0.005; // Auto rotate
        
        this.particles.forEach(p => {
            p.u += p.speed;
            if(p.u > Math.PI * 4) p.u -= Math.PI * 4;
        });
    }
    
    draw() {
        this.ctx.fillStyle = '#020c1b';
        this.ctx.fillRect(0, 0, this.w, this.h);
        
        const cosRY = Math.cos(this.rotationY);
        const sinRY = Math.sin(this.rotationY);
        const cosRX = Math.cos(this.rotationX);
        const sinRX = Math.sin(this.rotationX);

        this.ctx.lineWidth = 1.5;

        for(let i=0; i<this.particles.length; i++) {
            let p = this.particles[i];
            
            // Möbius Strip Parametric Equations
            // R = radius, w = half-width
            // x = (R + w*v*cos(u/2)) * cos(u)
            // y = (R + w*v*cos(u/2)) * sin(u)
            // z = w*v*sin(u/2)
            
            // We scale v by 0.5 to keep it tighter
            let w_v = 0.5 * p.v; 
            let half_u = p.u / 2;
            
            let common = 1 + w_v * Math.cos(half_u);
            
            let x = common * Math.cos(p.u);
            let y = common * Math.sin(p.u);
            let z = w_v * Math.sin(half_u);
            
            // 3D Rotation
            // Rotate around X (tilt)
            let y1 = y * cosRX - z * sinRX;
            let z1 = y * sinRX + z * cosRX;
            
            // Rotate around Y (spin)
            let x2 = x * cosRY - z1 * sinRY;
            let z2 = x * sinRY + z1 * cosRY;
            
            // Perspective Projection
            let scale = 4 / (4 - z2); // Camera distance roughly 4 units
            let x2d = x2 * scale * this.scale + this.cx;
            let y2d = y1 * scale * this.scale + this.cy;
            
            // Depth Fog
            let alpha = Math.max(0.1, (scale - 0.5));
            
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = alpha;
            this.ctx.beginPath();
            this.ctx.arc(x2d, y2d, scale * 1.5, 0, Math.PI*2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}


// 2. OPTIMIZED CURSOR
function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    
    if(!dot || !outline) return;

    let mouseX = -100, mouseY = -100; // Start off-screen
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Direct transform for dot (fastest)
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        
        // Slight delay for outline via CSS transition or simple RAF
        // Using RAF for outline to decouple from event loop
    });
    
    let outlineX = 0, outlineY = 0;
    function loop() {
        outlineX += (mouseX - outlineX) * 0.2;
        outlineY += (mouseY - outlineY) * 0.2;
        outline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
    }
    loop();
    
    // Hover States
    document.body.addEventListener('mouseover', (e) => {
        if(e.target.matches('a, button, .magnetic-btn')) {
            document.body.classList.add('hovering');
        } else {
            document.body.classList.remove('hovering');
        }
    });
}


// 3. SPIROGRAPH GENERATOR (Static, runs once)
function drawSpirograph(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 150;
    const h = canvas.height = 150;
    const cx = w/2, cy = h/2;
    
    ctx.strokeStyle = 'rgba(100, 255, 218, 0.6)';
    ctx.lineWidth = 1;
    
    let R = random(20, 50);
    let r = random(5, 40);
    let a = random(10, 50);
    
    ctx.beginPath();
    for(let t=0; t<=Math.PI*20; t+=0.1) {
        let x = cx + (R-r)*Math.cos(t) + a*Math.cos(((R-r)/r)*t);
        let y = cy + (R-r)*Math.sin(t) - a*Math.sin(((R-r)/r)*t);
        ctx.lineTo(x, y);
    }
    ctx.stroke();
}


// MAIN INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Remove Preloader Immediately
    const preloader = document.getElementById('preloader');
    if(preloader) preloader.remove(); // Just remove it, faster
    
    // 2. Init Mobius Strip
    const heroCanvas = document.getElementById('hero-canvas');
    if(heroCanvas) {
        const mobius = new MobiusStrip(heroCanvas);
        mobius.animate();
    }
    
    // 3. Init Cursor (Desktop only)
    if (window.matchMedia("(pointer: fine)").matches) {
        initCursor();
    }
    
    // 4. Init Math Background (STATIC - No Animation for Performance)
    const bg = document.createElement('div');
    bg.className = 'math-bg';
    document.body.appendChild(bg);
    const symbols = ['∫', '∑', '∞', 'π', '∆', '∇', '∂', '∅', '≈', '≠'];
    
    for(let i=0; i<15; i++) {
        const s = document.createElement('span');
        s.className = 'math-symbol';
        s.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        s.style.left = random(0, 100) + 'vw';
        s.style.top = random(0, 100) + 'vh';
        s.style.fontSize = random(1, 3) + 'rem';
        s.style.opacity = random(0.02, 0.05);
        // Static Rotation
        s.style.transform = `rotate(${random(0, 360)}deg)`;
        bg.appendChild(s);
    }

    // 5. Simple Intersection Observer (Fade in only, no decrypt/scramble)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.section-title, .timeline-item').forEach(el => observer.observe(el));
    
    // 6. Generate Team Spirographs
    document.querySelectorAll('.member-img-placeholder').forEach(div => {
        const canvas = document.createElement('canvas');
        canvas.className = 'member-canvas';
        div.prepend(canvas);
        drawSpirograph(canvas);
    });

    // 7. Mobile Nav
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Quote Generator
    const quotes = [
        { text: "Do not worry about your difficulties in Mathematics. I can assure you mine are still greater.", author: "Albert Einstein" },
        { text: "Mathematics is the art of giving the same name to different things.", author: "Henri Poincaré" },
        { text: "The book of nature is written in the language of mathematics.", author: "Galileo" },
        { text: "Pure mathematics is, in its way, the poetry of logical ideas.", author: "Einstein" }
    ];
    const quoteBtn = document.getElementById('new-quote-btn');
    if(quoteBtn) {
        quoteBtn.addEventListener('click', () => {
            const el = document.getElementById('quote-text');
            const auth = document.getElementById('quote-author');
            const q = quotes[Math.floor(Math.random()*quotes.length)];
            el.innerText = q.text;
            auth.innerText = `— ${q.author}`;
        });
    }
});