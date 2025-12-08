// UTILITIES
const random = (min, max) => Math.random() * (max - min) + min;
const mapRange = (value, low1, high1, low2, high2) => low2 + (high2 - low2) * (value - low1) / (high1 - low1);
const lerp = (a, b, n) => (1 - n) * a + n * b;

// 1. LORENZ ATTRACTOR (CHAOS THEORY) HERO BACKGROUND - OPTIMIZED
class LorenzAttractor {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', { alpha: false }); // Optimization: Disable alpha channel
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Lorenz Constants
        this.sigma = 10;
        this.rho = 28;
        this.beta = 8/3;
        
        // Simulation State
        this.points = [];
        this.numTrails = 60; // REDUCED from 150 for performance
        this.trailLength = 20; // REDUCED from 40 for performance
        this.dt = 0.008;
        
        // Interaction
        this.rotationY = 0;
        this.rotationX = 0;
        this.targetRotationY = 0;
        this.targetRotationX = 0;
        
        this.init();
        
        // Throttled Resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.resize(), 100);
        });

        // Mouse Move (Lightweight)
        window.addEventListener('mousemove', (e) => {
            this.targetRotationY = (e.clientX - this.width/2) * 0.0005;
            this.targetRotationX = (e.clientY - this.height/2) * 0.0005;
        });
    }
    
    init() {
        this.points = [];
        for(let i=0; i<this.numTrails; i++) {
            this.points.push({
                x: random(-10, 10),
                y: random(-10, 10),
                z: random(0, 40),
                color: Math.random() > 0.5 ? '#64ffda' : '#57cbff',
                trail: []
            });
        }
    }
    
    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    
    update() {
        // Smooth rotation
        this.rotationY = lerp(this.rotationY, this.targetRotationY, 0.05);
        this.rotationX = lerp(this.rotationX, this.targetRotationX, 0.05);
        
        // Auto rotate slowly
        this.rotationY += 0.002;

        // Pre-calculate rotation constants to save trig calls
        const cosY = Math.cos(this.rotationY);
        const sinY = Math.sin(this.rotationY);
        const cosX = Math.cos(this.rotationX);
        const sinX = Math.sin(this.rotationX);

        for(let i = 0; i < this.points.length; i++) {
            let p = this.points[i];
            
            // Lorenz Equations
            let dx = (this.sigma * (p.y - p.x)) * this.dt;
            let dy = (p.x * (this.rho - p.z) - p.y) * this.dt;
            let dz = (p.x * p.y - this.beta * p.z) * this.dt;
            
            p.x += dx;
            p.y += dy;
            p.z += dz;
            
            // Store trail
            p.trail.push({x: p.x, y: p.y, z: p.z});
            if(p.trail.length > this.trailLength) p.trail.shift();
        }

        return { cosY, sinY, cosX, sinX };
    }
    
    draw(trig) {
        // Clear with opacity hack for trail effect? No, we manage trails manually.
        this.ctx.fillStyle = '#020c1b'; 
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        const cx = this.width/2;
        const cy = this.height/2;

        this.ctx.lineWidth = 0.5; // Thinner lines for crisp look

        for(let i = 0; i < this.points.length; i++) {
            let p = this.points[i];
            if(p.trail.length < 2) continue;

            this.ctx.beginPath();
            this.ctx.strokeStyle = p.color;
            
            // Optimization: Move moveTo outside loop
            // Project first point
            let p0 = p.trail[0];
            let r0 = this.rotateFast(p0.x, p0.y, p0.z - 25, trig);
            this.ctx.moveTo(cx + r0.x * 15, cy + r0.y * 15);

            for(let j=1; j<p.trail.length; j++) {
                let pt = p.trail[j];
                // 3D Rotation Projection
                let r = this.rotateFast(pt.x, pt.y, pt.z - 25, trig);
                this.ctx.lineTo(cx + r.x * 15, cy + r.y * 15);
            }
            this.ctx.stroke();
            
            // Draw head
            let head = p.trail[p.trail.length-1];
            let rHead = this.rotateFast(head.x, head.y, head.z - 25, trig);
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(cx + rHead.x * 15, cy + rHead.y * 15, 1, 1);
        }
    }
    
    // Optimized rotation reusing trig values
    rotateFast(x, y, z, { cosY, sinY, cosX, sinX }) {
        // Rotate around Y
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;
        
        // Rotate around X
        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;
        
        return {x: x1, y: y2, z: z2};
    }
    
    animate() {
        const trig = this.update();
        this.draw(trig);
        requestAnimationFrame(() => this.animate());
    }
}


// 2. TEXT SCRAMBLE - OPTIMIZED
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 20); // Faster duration
            const end = start + Math.floor(Math.random() * 20);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}


// 3. OPTIMIZED CURSOR (RAF LOOP)
function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    
    if(!dot || !outline) return;

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animate() {
        // Lerp for smooth movement
        dotX = lerp(dotX, mouseX, 1); // Instant
        dotY = lerp(dotY, mouseY, 1);
        
        outlineX = lerp(outlineX, mouseX, 0.15); // Smooth lag
        outlineY = lerp(outlineY, mouseY, 0.15);
        
        dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
        outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
        
        requestAnimationFrame(animate);
    }
    animate();
    
    // Efficient Hover
    document.querySelectorAll('a, button, .magnetic-btn').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
}


// 4. SPIROGRAPH GENERATOR
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
    
    // 1. Remove Preloader
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if(preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 600);
        }
    }, 1000);
    
    // 2. Init Lorenz Attractor
    const heroCanvas = document.getElementById('hero-canvas');
    if(heroCanvas) {
        const attractor = new LorenzAttractor(heroCanvas);
        attractor.animate();
    }
    
    // 3. Init Cursor (Desktop only for performance)
    if (window.matchMedia("(pointer: fine)").matches) {
        initCursor();
    }
    
    // 4. Init Math Background (Optimized)
    const bg = document.createElement('div');
    bg.className = 'math-bg';
    document.body.appendChild(bg);
    const symbols = ['∫', '∑', '∞', 'π', '∆', '∇', '∂', '∅', '≈', '≠'];
    const symbolEls = [];
    
    // Reduced count for performance
    for(let i=0; i<20; i++) {
        const s = document.createElement('span');
        s.className = 'math-symbol';
        s.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        s.style.left = random(0, 100) + 'vw';
        s.style.top = random(0, 100) + 'vh';
        s.style.fontSize = random(1, 3) + 'rem';
        s.style.opacity = random(0.02, 0.08);
        bg.appendChild(s);
        symbolEls.push({ el: s, speed: (i % 3 + 1) * 0.05 });
    }

    // Optimized Parallax using RAF
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    }, { passive: true }); // Passive listener

    function animateParallax() {
        symbolEls.forEach(({ el, speed }) => {
            el.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.02}deg)`;
        });
        requestAnimationFrame(animateParallax);
    }
    animateParallax();

    // 5. Decrypt Headers on Scroll (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger Text Scramble
                if(!entry.target.dataset.scrambled) {
                    const scrambler = new TextScramble(entry.target);
                    scrambler.setText(entry.target.innerText);
                    entry.target.dataset.scrambled = "true";
                }
            }
        });
    }, { threshold: 0.1 }); // Lower threshold
    
    document.querySelectorAll('.section-title').forEach(el => observer.observe(el));
    document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));
    
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
            
            el.style.opacity = 0; auth.style.opacity = 0;
            setTimeout(() => {
                el.innerText = q.text;
                auth.innerText = `— ${q.author}`;
                el.style.opacity = 1; auth.style.opacity = 1;
            }, 300);
        });
    }
});
