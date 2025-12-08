/**
 * INFINITY CLUB - 15 VARIATIONS ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeManager();
    initNavigation();
    initQuotes();
    initScrollReveal();
});

// --- THEME MANAGER ---
const themes = [
    { id: 1, name: "Cosmic Network", accent: "#64ffda", type: "network" },
    { id: 2, name: "Lorenz Attractor", accent: "#ff6b6b", type: "lorenz" },
    { id: 3, name: "Matrix Rain", accent: "#00ff41", type: "matrix" },
    { id: 4, name: "Möbius Strip", accent: "#e0aaff", type: "mobius" },
    { id: 5, name: "Game of Life", accent: "#f77f00", type: "gol" },
    { id: 6, name: "Fractal Tree", accent: "#4cc9f0", type: "tree" },
    { id: 7, name: "Spirograph", accent: "#f72585", type: "spiro" },
    { id: 8, name: "Starfield Warp", accent: "#ffffff", type: "warp" },
    { id: 9, name: "Fluid Flow", accent: "#00b4d8", type: "fluid" },
    { id: 10, name: "Sine Waves", accent: "#ff9e00", type: "sine" },
    { id: 11, name: "Voronoi Cells", accent: "#9d4edd", type: "voronoi" },
    { id: 12, name: "Hex Grid", accent: "#ffd60a", type: "hex" },
    { id: 13, name: "Binary Void", accent: "#3a86ff", type: "binary" },
    { id: 14, name: "Golden Spiral", accent: "#d4af37", type: "spiral" },
    { id: 15, name: "Chaos Pendulum", accent: "#ef476f", type: "pendulum" }
];

function initThemeManager() {
    // 1. Select random theme on load
    let currentThemeIndex = Math.floor(Math.random() * themes.length);
    
    // 2. Apply Theme
    applyTheme(currentThemeIndex);

    // 3. Switcher Logic
    const switcher = document.getElementById('theme-switcher');
    if(switcher) {
        switcher.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            applyTheme(currentThemeIndex);
        });
    }
}

function applyTheme(index) {
    const theme = themes[index];
    const root = document.documentElement;
    const indicator = document.getElementById('theme-name');
    
    // Update Colors
    root.style.setProperty('--accent', theme.accent);
    // Convert hex to RGB for rgba() usage
    const hex = theme.accent.substring(1);
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);
    root.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
    
    // Update UI Text
    if(indicator) indicator.textContent = `${theme.id}. ${theme.name}`;
    
    // Initialize Canvas Background
    initBackground(theme.type, theme.accent);
}

// --- BACKGROUND ENGINE ---
let animationId; // To cancel previous loops

function initBackground(type, color) {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Cleanup previous animation
    if (animationId) cancelAnimationFrame(animationId);
    
    // Reset Canvas
    let w, h;
    const resize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    };
    window.removeEventListener('resize', canvas.resizeHandler); // Remove old listener
    canvas.resizeHandler = resize;
    window.addEventListener('resize', resize);
    resize();

    // --- ANIMATION SWITCH ---
    switch(type) {
        case 'network': runNetwork(ctx, w, h, color); break;
        case 'lorenz': runLorenz(ctx, w, h, color); break;
        case 'matrix': runMatrix(ctx, w, h, color); break;
        case 'mobius': runMobius(ctx, w, h, color); break;
        case 'gol': runGOL(ctx, w, h, color); break;
        case 'tree': runTree(ctx, w, h, color); break;
        case 'spiro': runSpirograph(ctx, w, h, color); break;
        case 'warp': runWarp(ctx, w, h, color); break;
        case 'fluid': runFluid(ctx, w, h, color); break;
        case 'sine': runSine(ctx, w, h, color); break;
        case 'voronoi': runVoronoi(ctx, w, h, color); break;
        case 'hex': runHex(ctx, w, h, color); break;
        case 'binary': runBinary(ctx, w, h, color); break;
        case 'spiral': runSpiral(ctx, w, h, color); break;
        case 'pendulum': runPendulum(ctx, w, h, color); break;
    }
}

/* ===========================
   THE 15 ANIMATION FUNCTIONS
   =========================== */

// 1. Cosmic Network
function runNetwork(ctx, w, h, color) {
    const particles = Array.from({length: 60}, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5
    }));
    function loop() {
        ctx.clearRect(0,0,w,h);
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if(p.x < 0 || p.x > w) p.vx *= -1;
            if(p.y < 0 || p.y > h) p.vy *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fill();
            for(let j=i+1; j<particles.length; j++){
                let p2 = particles[j];
                let d = Math.hypot(p.x-p2.x, p.y-p2.y);
                if(d < 150) {
                    ctx.globalAlpha = 1 - d/150; ctx.lineWidth = 0.5;
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                }
            }
        });
        ctx.globalAlpha = 1;
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 2. Lorenz Attractor
function runLorenz(ctx, w, h, color) {
    let x = 0.1, y = 0, z = 0;
    const sigma = 10, rho = 28, beta = 8/3;
    const points = [];
    function loop() {
        // Fade effect
        ctx.fillStyle = 'rgba(10, 25, 47, 0.05)';
        ctx.fillRect(0,0,w,h);
        
        let dt = 0.01;
        let dx = (sigma * (y - x)) * dt;
        let dy = (x * (rho - z) - y) * dt;
        let dz = (x * y - beta * z) * dt;
        x += dx; y += dy; z += dz;
        points.push({x, y, z});
        if(points.length > 2000) points.shift();

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        const cx = w/2, cy = h/2, scale = 15;
        for(let i=1; i<points.length; i++){
            // Simple rotation
            let p = points[i], prev = points[i-1];
            ctx.moveTo(cx + prev.x*scale, cy + prev.y*scale);
            ctx.lineTo(cx + p.x*scale, cy + p.y*scale);
        }
        ctx.stroke();
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 3. Matrix Rain
function runMatrix(ctx, w, h, color) {
    const cols = Math.floor(w / 20);
    const drops = Array(cols).fill(1);
    ctx.font = "15px monospace";
    function loop() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.1)';
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle = color;
        drops.forEach((y, i) => {
            const text = String.fromCharCode(Math.random() * 128);
            ctx.fillText(text, i*20, y*20);
            if(y*20 > h && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 4. Möbius Strip (Wireframe)
function runMobius(ctx, w, h, color) {
    let t = 0;
    function loop() {
        ctx.clearRect(0,0,w,h);
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        const cx = w/2, cy = h/2;
        t += 0.01;
        ctx.beginPath();
        for(let i = 0; i < Math.PI*4; i+=0.1) {
            let u = i;
            let v = 0; // center line
            let radius = 150;
            let x = (radius + v * Math.cos(u/2)) * Math.cos(u);
            let y = (radius + v * Math.cos(u/2)) * Math.sin(u);
            let z = v * Math.sin(u/2);
            
            // Rotate
            let x2 = x * Math.cos(t) - z * Math.sin(t);
            let y2 = y; 
            
            // Draw multiple strips
            for(let j=-50; j<=50; j+=25) {
                let x_ = (radius + j * Math.cos(u/2)) * Math.cos(u);
                let y_ = (radius + j * Math.cos(u/2)) * Math.sin(u);
                let z_ = j * Math.sin(u/2);
                let xr = x_ * Math.cos(t) - z_ * Math.sin(t);
                let yr = y_ * Math.cos(t*0.5) - x_ * Math.sin(t*0.5); // tumbling
                ctx.rect(cx + xr, cy + yr, 1, 1);
            }
        }
        ctx.stroke();
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 5. Game of Life
function runGOL(ctx, w, h, color) {
    const size = 10;
    const rows = Math.ceil(h/size);
    const cols = Math.ceil(w/size);
    let grid = Array(cols).fill().map(() => Array(rows).fill().map(() => Math.random() > 0.85 ? 1 : 0));
    
    function loop() {
        // Don't clear, let it build up slightly or clear full
        ctx.clearRect(0,0,w,h); 
        ctx.fillStyle = color;
        
        let next = grid.map(arr => [...arr]);
        
        for(let i=0; i<cols; i++) {
            for(let j=0; j<rows; j++) {
                let state = grid[i][j];
                if(state === 1) ctx.fillRect(i*size, j*size, size-1, size-1);
                
                // Logic
                let sum = 0;
                for(let I=-1; I<2; I++){
                    for(let J=-1; J<2; J++){
                        let col = (i+I+cols)%cols;
                        let row = (j+J+rows)%rows;
                        sum += grid[col][row];
                    }
                }
                sum -= state;
                if(state == 0 && sum == 3) next[i][j] = 1;
                else if(state == 1 && (sum < 2 || sum > 3)) next[i][j] = 0;
            }
        }
        grid = next;
        setTimeout(() => {
            animationId = requestAnimationFrame(loop);
        }, 100); // slow down
    }
    loop();
}

// 6. Fractal Tree
function runTree(ctx, w, h, color) {
    let angle = 0;
    function drawBranch(len, x, y, a) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        let x2 = x + len * Math.sin(a);
        let y2 = y - len * Math.cos(a);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        if(len > 10) {
            drawBranch(len * 0.7, x2, y2, a + angle);
            drawBranch(len * 0.7, x2, y2, a - angle);
        }
    }
    function loop() {
        ctx.clearRect(0,0,w,h);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        angle = Math.PI / 4 * Math.sin(Date.now() * 0.0005) + 0.5;
        drawBranch(100, w/2, h, 0);
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 7. Spirograph
function runSpirograph(ctx, w, h, color) {
    let t = 0;
    function loop() {
        // Trail effect
        ctx.fillStyle = 'rgba(10, 25, 47, 0.05)';
        ctx.fillRect(0,0,w,h);
        
        ctx.strokeStyle = color;
        ctx.beginPath();
        const cx = w/2, cy = h/2;
        let R = 100, r = 22, a = 60;
        
        for(let i=0; i<10; i++) {
            t += 0.05;
            let x = cx + (R-r)*Math.cos(t) + a*Math.cos(((R-r)/r)*t);
            let y = cy + (R-r)*Math.sin(t) - a*Math.sin(((R-r)/r)*t);
            if(i==0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 8. Starfield Warp
function runWarp(ctx, w, h, color) {
    const stars = Array(200).fill().map(() => ({
        x: Math.random() * w - w/2,
        y: Math.random() * h - h/2,
        z: Math.random() * w
    }));
    function loop() {
        ctx.fillStyle = '#0a192f';
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle = color;
        
        stars.forEach(s => {
            s.z -= 5; // speed
            if(s.z <= 0) {
                s.x = Math.random() * w - w/2;
                s.y = Math.random() * h - h/2;
                s.z = w;
            }
            let k = 128.0 / s.z;
            let px = s.x * k + w/2;
            let py = s.y * k + h/2;
            let sz = (1 - s.z / w) * 3;
            if(px >= 0 && px <= w && py >= 0 && py <= h) {
                ctx.beginPath(); ctx.arc(px, py, sz, 0, Math.PI*2); ctx.fill();
            }
        });
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 9. Fluid Flow (Simulated with particles)
function runFluid(ctx, w, h, color) {
    const particles = Array(100).fill().map(() => ({
        x: Math.random() * w, y: Math.random() * h,
        angle: Math.random() * Math.PI * 2
    }));
    function loop() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.1)';
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle = color;
        particles.forEach(p => {
            // Perlin-ish noise simulation
            let noise = Math.sin(p.x * 0.005) + Math.cos(p.y * 0.005);
            p.angle += noise * 0.1;
            p.x += Math.cos(p.angle) * 2;
            p.y += Math.sin(p.angle) * 2;
            
            if(p.x < 0) p.x = w; if(p.x > w) p.x = 0;
            if(p.y < 0) p.y = h; if(p.y > h) p.y = 0;
            
            ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI*2); ctx.fill();
        });
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 10. Sine Waves
function runSine(ctx, w, h, color) {
    let t = 0;
    function loop() {
        ctx.clearRect(0,0,w,h);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        t += 0.02;
        for(let i=0; i<5; i++) {
            ctx.beginPath();
            for(let x=0; x<w; x+=5) {
                let y = h/2 + Math.sin(x * 0.01 + t + i) * 50 * Math.sin(t*0.5);
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 11. Voronoi (Dot based)
function runVoronoi(ctx, w, h, color) {
    const points = Array(15).fill().map(() => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5), vy: (Math.random() - 0.5)
    }));
    function loop() {
        ctx.clearRect(0,0,w,h);
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.2;
        
        points.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if(p.x < 0 || p.x > w) p.vx *= -1;
            if(p.y < 0 || p.y > h) p.vy *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fillStyle = color; ctx.fill();
        });
        
        // Draw simplistic triangulation (not true voronoi, but cool)
        for(let i=0; i<points.length; i++){
            for(let j=i+1; j<points.length; j++){
                let d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
                if(d < 200) {
                    ctx.beginPath(); ctx.moveTo(points[i].x, points[i].y); ctx.lineTo(points[j].x, points[j].y); ctx.stroke();
                }
            }
        }
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 12. Hex Grid
function runHex(ctx, w, h, color) {
    let t = 0;
    function drawHex(x, y, r) {
        ctx.beginPath();
        for(let i=0; i<6; i++) {
            ctx.lineTo(x + r * Math.cos(i*Math.PI/3), y + r * Math.sin(i*Math.PI/3));
        }
        ctx.closePath();
        ctx.stroke();
    }
    function loop() {
        ctx.clearRect(0,0,w,h);
        ctx.strokeStyle = color;
        t += 0.02;
        const size = 40;
        for(let y=0; y<h+size; y+=size*1.5) {
            for(let x=0; x<w+size; x+=size*1.732) {
                let offset = (Math.floor(y/(size*1.5))%2) * (size*1.732/2);
                let pulse = Math.sin(t + x*0.01 + y*0.01) * 10;
                drawHex(x + offset, y, size/2 + pulse);
            }
        }
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 13. Binary Void
function runBinary(ctx, w, h, color) {
    ctx.font = "12px monospace";
    const nums = [];
    for(let i=0; i<100; i++) nums.push({x: Math.random()*w, y: Math.random()*h, v: Math.random()*2+1});
    function loop() {
        ctx.clearRect(0,0,w,h);
        ctx.fillStyle = color;
        nums.forEach(n => {
            n.y += n.v;
            if(n.y > h) n.y = 0;
            ctx.fillText(Math.random() > 0.5 ? "1" : "0", n.x, n.y);
        });
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 14. Golden Spiral
function runSpiral(ctx, w, h, color) {
    let t = 0;
    function loop() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.1)';
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle = color;
        const cx = w/2, cy = h/2;
        t += 0.1;
        for(let i=0; i<200; i++) {
            let angle = 0.1 * i + t * 0.02;
            let r = 2 * i;
            let x = cx + r * Math.cos(angle);
            let y = cy + r * Math.sin(angle);
            ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI*2); ctx.fill();
        }
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 15. Chaos Pendulum (Double Pendulum Simulation)
function runPendulum(ctx, w, h, color) {
    let r1 = 100, r2 = 100, m1 = 10, m2 = 10;
    let a1 = Math.PI/2, a2 = Math.PI/2;
    let a1_v = 0, a2_v = 0;
    let path = [];
    const cx = w/2, cy = h/3;
    
    function loop() {
        // Physics (simplified)
        let num1 = -9.81 * (2 * m1 + m2) * Math.sin(a1);
        let num2 = -m2 * 9.81 * Math.sin(a1 - 2 * a2);
        let num3 = -2 * Math.sin(a1 - a2) * m2;
        let num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * Math.cos(a1 - a2);
        let den = r1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
        let a1_a = (num1 + num2 + num3 * num4) / den;

        let num1_2 = 2 * Math.sin(a1 - a2);
        let num2_2 = (a1_v * a1_v * r1 * (m1 + m2));
        let num3_2 = 9.81 * (m1 + m2) * Math.cos(a1);
        let num4_2 = a2_v * a2_v * r2 * m2 * Math.cos(a1 - a2);
        let den_2 = r2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
        let a2_a = (num1_2 * (num2_2 + num3_2 + num4_2)) / den_2;

        a1_v += a1_a; a2_v += a2_a;
        a1 += a1_v; a2 += a2_v;
        a1_v *= 0.999; a2_v *= 0.999; // damping

        let x1 = r1 * Math.sin(a1) + cx;
        let y1 = r1 * Math.cos(a1) + cy;
        let x2 = x1 + r2 * Math.sin(a2);
        let y2 = y1 + r2 * Math.cos(a2);

        path.push({x: x2, y: y2});
        if(path.length > 500) path.shift();

        ctx.clearRect(0,0,w,h);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        // Draw Arms
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        
        // Draw Trail
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        if(path.length > 0) {
            ctx.moveTo(path[0].x, path[0].y);
            for(let i=1; i<path.length; i++) ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();

        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// --- UTILS ---
function initNavigation() {
    const nav = document.querySelector('.navbar');
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.nav-menu');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const current = window.pageYOffset;
        if (current <= 0) nav.classList.remove('hidden');
        else if (current > lastScroll && !menu.classList.contains('active')) nav.classList.add('hidden');
        else nav.classList.remove('hidden');
        lastScroll = current;
    });
    toggle.addEventListener('click', () => menu.classList.toggle('active'));
}

function initQuotes() {
    const quotes = [
        { text: "Pure mathematics is, in its way, the poetry of logical ideas.", author: "Albert Einstein" },
        { text: "The book of nature is written in the language of mathematics.", author: "Galileo" },
        { text: "Mathematics is the art of giving the same name to different things.", author: "Poincaré" }
    ];
    const btn = document.getElementById('new-quote-btn');
    const d = document.getElementById('quote-display');
    const a = document.getElementById('quote-author');
    if(btn) btn.addEventListener('click', () => {
        const q = quotes[Math.floor(Math.random()*quotes.length)];
        d.textContent = q.text; a.textContent = `— ${q.author}`;
    });
}

function initScrollReveal() {
    const obs = new IntersectionObserver(e => e.forEach(x => { if(x.isIntersecting) x.target.classList.add('active'); }), {threshold:0.1});
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
