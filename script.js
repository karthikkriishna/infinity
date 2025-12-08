// UTILITIES
const random = (min, max) => Math.random() * (max - min) + min;
const mapRange = (value, low1, high1, low2, high2) => low2 + (high2 - low2) * (value - low1) / (high1 - low1);

// 1. LORENZ ATTRACTOR (CHAOS THEORY) HERO BACKGROUND
class LorenzAttractor {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
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
        this.numTrails = 150;
        this.dt = 0.008;
        
        // Interaction
        this.rotationY = 0;
        this.rotationX = 0;
        this.targetRotationY = 0;
        this.targetRotationX = 0;
        
        this.init();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
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
    
    onMouseMove(e) {
        // Map mouse X to rotation Y (yaw), Y to rotation X (pitch)
        this.targetRotationY = (e.clientX - this.width/2) * 0.0005;
        this.targetRotationX = (e.clientY - this.height/2) * 0.0005;
    }
    
    update() {
        // Smooth rotation
        this.rotationY += (this.targetRotationY - this.rotationY) * 0.05;
        this.rotationX += (this.targetRotationX - this.rotationX) * 0.05;
        
        // Auto rotate slowly
        this.rotationY += 0.002;

        this.points.forEach(p => {
            // Lorenz Equations
            let dx = (this.sigma * (p.y - p.x)) * this.dt;
            let dy = (p.x * (this.rho - p.z) - p.y) * this.dt;
            let dz = (p.x * p.y - this.beta * p.z) * this.dt;
            
            p.x += dx;
            p.y += dy;
            p.z += dz;
            
            // Store trail
            p.trail.push({x: p.x, y: p.y, z: p.z});
            if(p.trail.length > 40) p.trail.shift();
        });
    }
    
    draw() {
        this.ctx.fillStyle = '#020c1b'; // Clear with background color (no transparency for clearer trails)
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Center the attractor
        this.ctx.save();
        this.ctx.translate(this.width/2, this.height/2);
        this.ctx.scale(15, 15); // Scale up
        
        this.points.forEach(p => {
            this.ctx.beginPath();
            this.ctx.strokeStyle = p.color;
            this.ctx.lineWidth = 0.15;
            
            for(let i=0; i<p.trail.length - 1; i++) {
                let p1 = p.trail[i];
                let p2 = p.trail[i+1];
                
                // 3D Rotation Projection
                let r1 = this.rotate(p1.x, p1.y, p1.z - 25); // Shift Z to center vertically
                let r2 = this.rotate(p2.x, p2.y, p2.z - 25);
                
                // Simple perspective
                let scale1 = 400 / (400 - r1.z);
                let scale2 = 400 / (400 - r2.z);
                
                this.ctx.moveTo(r1.x, r1.y);
                this.ctx.lineTo(r2.x, r2.y);
            }
            this.ctx.stroke();
            
            // Draw head
            let head = p.trail[p.trail.length-1];
            if(head) {
                 let rHead = this.rotate(head.x, head.y, head.z - 25);
                 this.ctx.fillStyle = '#fff';
                 this.ctx.fillRect(rHead.x, rHead.y, 0.3, 0.3);
            }
        });
        
        this.ctx.restore();
    }
    
    rotate(x, y, z) {
        // Rotate around Y
        let x1 = x * Math.cos(this.rotationY) - z * Math.sin(this.rotationY);
        let z1 = x * Math.sin(this.rotationY) + z * Math.cos(this.rotationY);
        
        // Rotate around X
        let y2 = y * Math.cos(this.rotationX) - z1 * Math.sin(this.rotationX);
        let z2 = y * Math.sin(this.rotationX) + z1 * Math.cos(this.rotationX);
        
        return {x: x1, y: y2, z: z2};
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}


// 2. TEXT SCRAMBLE / DECRYPT EFFECT
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
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
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
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


// 3. MAGNETIC BUTTONS & CURSOR
function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    
    // Smooth Follow Logic
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Dot moves instantly
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });
    
    function animateCursor() {
        // Outline follows smoothly
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        outline.style.left = `${outlineX}px`;
        outline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Magnetic Buttons
    const buttons = document.querySelectorAll('.cta-button, .magnetic-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Move button slightly towards cursor
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            
            // Hover state for cursor
            document.body.classList.add('hovering');
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            document.body.classList.remove('hovering');
        });
    });
    
    // Links hover
    document.querySelectorAll('a').forEach(a => {
        a.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        a.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
}


// 4. SPIROGRAPH GENERATOR FOR TEAM
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
    }, 1500);
    
    // 2. Init Lorenz Attractor
    const heroCanvas = document.getElementById('hero-canvas');
    if(heroCanvas) {
        const attractor = new LorenzAttractor(heroCanvas);
        attractor.animate();
    }
    
    // 3. Init Cursor
    if (window.matchMedia("(pointer: fine)").matches) {
        initCursor();
    }
    
    // 4. Init Math Background
    const bg = document.createElement('div');
    bg.className = 'math-bg';
    document.body.appendChild(bg);
    const symbols = ['∫', '∑', '∞', 'π', '∆', '∇', '∂', '∅', '≈', '≠'];
    for(let i=0; i<40; i++) {
        const s = document.createElement('span');
        s.className = 'math-symbol';
        s.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        s.style.left = random(0, 100) + 'vw';
        s.style.top = random(0, 100) + 'vh';
        s.style.fontSize = random(1, 3) + 'rem';
        s.style.opacity = random(0.02, 0.1);
        bg.appendChild(s);
    }
    // Parallax
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        document.querySelectorAll('.math-symbol').forEach((el, i) => {
            const speed = (i % 5 + 1) * 0.1;
            el.style.transform = `translateY(${y * speed}px) rotate(${y * 0.05}deg)`;
        });
    });

    // 5. Decrypt Headers on Scroll
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
    }, { threshold: 0.2 });
    
    document.querySelectorAll('.section-title').forEach(el => observer.observe(el));
    document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));
    
    // 6. Generate Team Spirographs
    document.querySelectorAll('.member-img-placeholder').forEach(div => {
        const canvas = document.createElement('canvas');
        canvas.className = 'member-canvas';
        div.prepend(canvas);
        drawSpirograph(canvas);
    });

    // 7. Timeline Drawing Animation (Simulated)
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Mobile Nav
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
            
            // Simple fade switch
            el.style.opacity = 0; auth.style.opacity = 0;
            setTimeout(() => {
                el.innerText = q.text;
                auth.innerText = `— ${q.author}`;
                el.style.opacity = 1; auth.style.opacity = 1;
            }, 300);
        });
    }
});