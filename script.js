/**
 * INFINITY CLUB - 15 VARIATIONS ENGINE (UPGRADED)
 * Features: High Interactivity, Richer Visuals, Dynamic Physics
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeManager();
    initNavigation();
    initQuotes();
    initScrollReveal();
});

// --- GLOBAL MOUSE TRACKING ---
const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, down: false };
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mousedown', () => mouse.down = true);
window.addEventListener('mouseup', () => mouse.down = false);
window.addEventListener('touchstart', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; mouse.down = true; });
window.addEventListener('touchend', () => mouse.down = false);

// --- THEME MANAGER ---
const themes = [
    { id: 1, name: "Cosmic Neural Net", accent: "#64ffda", type: "network" },
    { id: 2, name: "Interactive Lorenz", accent: "#ff6b6b", type: "lorenz" },
    { id: 3, name: "Hyper Matrix", accent: "#00ff41", type: "matrix" },
    { id: 4, name: "Möbius Strip 3D", accent: "#e0aaff", type: "mobius" },
    { id: 5, name: "Interactive Life", accent: "#f77f00", type: "gol" },
    { id: 6, name: "Windy Fractal", accent: "#4cc9f0", type: "tree" },
    { id: 7, name: "Morphing Spiro", accent: "#f72585", type: "spiro" },
    { id: 8, name: "Hyperdrive", accent: "#ffffff", type: "warp" },
    { id: 9, name: "Neon Fluid", accent: "#00b4d8", type: "fluid" },
    { id: 10, name: "Sonic Waves", accent: "#ff9e00", type: "sine" },
    { id: 11, name: "Active Voronoi", accent: "#9d4edd", type: "voronoi" },
    { id: 12, name: "Cyber Hex", accent: "#ffd60a", type: "hex" },
    { id: 13, name: "Data Stream", accent: "#3a86ff", type: "binary" },
    { id: 14, name: "Hypnotic Spiral", accent: "#d4af37", type: "spiral" },
    { id: 15, name: "Chaos Physics", accent: "#ef476f", type: "pendulum" }
];

function initThemeManager() {
    let currentThemeIndex = Math.floor(Math.random() * themes.length);
    applyTheme(currentThemeIndex);

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
    
    root.style.setProperty('--accent', theme.accent);
    const hex = theme.accent.substring(1);
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);
    root.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
    
    if(indicator) indicator.textContent = `${theme.id}. ${theme.name}`;
    
    initBackground(theme.type, theme.accent);
}

// --- BACKGROUND ENGINE ---
let animationId; 

function initBackground(type, color) {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    if (animationId) cancelAnimationFrame(animationId);
    
    let w, h;
    const resize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    };
    window.removeEventListener('resize', canvas.resizeHandler);
    canvas.resizeHandler = resize;
    window.addEventListener('resize', resize);
    resize();

    // Reset context
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

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
   15 UPGRADED ANIMATIONS
   =========================== */

// 1. Cosmic Neural Net (Mouse interaction + More particles)
function runNetwork(ctx, w, h, color) {
    const particles = Array.from({length: 100}, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
    }));
    
    function loop() {
        ctx.clearRect(0,0,w,h);
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            
            // Mouse repulsion
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < 150) {
                const force = (150 - dist) / 150;
                p.vx -= (dx/dist) * force * 0.5;
                p.vy -= (dy/dist) * force * 0.5;
            }

            if(p.x < 0 || p.x > w) p.vx *= -1;
            if(p.y < 0 || p.y > h) p.vy *= -1;
            
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
            
            for(let j=i+1; j<particles.length; j++){
                let p2 = particles[j];
                let d = Math.hypot(p.x-p2.x, p.y-p2.y);
                if(d < 120) {
                    ctx.globalAlpha = 1 - d/120; 
                    ctx.lineWidth = 0.5;
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                }
            }
        });
        ctx.globalAlpha = 1;
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 2. Interactive Lorenz (Rotate with mouse)
function runLorenz(ctx, w, h, color) {
    let points = [], x=0.1, y=0, z=0;
    const sigma = 10, rho = 28, beta = 8/3;
    let rotX = 0, rotY = 0;

    function loop() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.1)'; // Longer trails
        ctx.fillRect(0,0,w,h);
        
        // Interaction
        rotY += (mouse.x - w/2) * 0.0001;
        rotX += (mouse.y - h/2) * 0.0001;

        let dt = 0.01;
        let dx = (sigma * (y - x)) * dt;
        let dy = (x * (rho - z) - y) * dt;
        let dz = (x * y - beta * z) * dt;
        x += dx; y += dy; z += dz;
        points.push({x, y, z});
        if(points.length > 1500) points.shift();

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        const cx = w/2, cy = h/2, scale = 12;
        
        for(let i=1; i<points.length; i++){
            let p = points[i], prev = points[i-1];
            
            // 3D Rotation
            let x1 = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
            let z1 = p.x * Math.sin(rotY) + p.z * Math.cos(rotY);
            let y1 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
            
            let x2 = prev.x * Math.cos(rotY) - prev.z * Math.sin(rotY);
            let z2 = prev.x * Math.sin(rotY) + prev.z * Math.cos(rotY);
            let y2 = prev.y * Math.cos(rotX) - z2 * Math.sin(rotX);

            ctx.moveTo(cx + x2*scale, cy + y2*scale);
            ctx.lineTo(cx + x1*scale, cy + y1*scale);
        }
        ctx.stroke();
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 3. Hyper Matrix (Mouse disruption)
function runMatrix(ctx, w, h, color) {
    const cols = Math.floor(w / 20);
    const drops = Array(cols).fill(1);
    ctx.font = "16px monospace";
    
    function loop() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.1)';
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle = color;
        
        drops.forEach((y, i) => {
            const char = String.fromCharCode(0x30A0 + Math.random() * 96);
            const x = i*20;
            
            // Mouse disruption
            const dist = Math.abs(mouse.x - x);
            if(dist < 50 && Math.abs(mouse.y - y*20) < 50) {
                ctx.fillStyle = '#fff'; // Highlight near mouse
            } else {
                ctx.fillStyle = color;
            }

            ctx.fillText(char, x, y*20);
            if(y*20 > h && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 4. Möbius Strip 3D (Full rotation control)
function runMobius(ctx, w, h, color) {
    let t = 0;
    function loop() {
        ctx.clearRect(0,0,w,h);
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        const cx = w/2, cy = h/2;
        t += 0.02;
        
        let rotX = (mouse.y - h/2) * 0.005;
        let rotY = (mouse.x - w/2) * 0.005;

        for(let i = 0; i < Math.PI*4; i+=0.1) {
            let u = i;
            let radius = 150;
            
            // Draw strip width
            for(let j=-40; j<=40; j+=20) {
                let x = (radius + j * Math.cos(u/2)) * Math.cos(u);
                let y = (radius + j * Math.cos(u/2)) * Math.sin(u);
                let z = j * Math.sin(u/2);
                
                // Apply Mouse Rotation
                let x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
                let z1 = x * Math.sin(rotY) + z * Math.cos(rotY);
                let y1 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
                
                // Auto Spin
                let x2 = x1 * Math.cos(t) - y1 * Math.sin(t);
                let y2 = x1 * Math.sin(t) + y1 * Math.cos(t);

                // Point plotting instead of lines for cooler effect
                ctx.beginPath();
                ctx.arc(cx + x2, cy + y2, 1, 0, Math.PI*2);
                ctx.fill();
            }
        }
        ctx.fillStyle = color;
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 5. Interactive Life (Paint cells)
function runGOL(ctx, w, h, color) {
    const size = 8;
    const cols = Math.ceil(w/size), rows = Math.ceil(h/size);
    let grid = Array(cols).fill().map(() => Array(rows).fill().map(() => Math.random() > 0.9 ? 1 : 0));
    
    function loop() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.3)';
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle = color;
        
        // Paint with mouse
        if(mouse.down) {
            const mx = Math.floor(mouse.x / size);
            const my = Math.floor(mouse.y / size);
            if(mx >=0 && mx < cols && my >=0 && my < rows) {
                grid[mx][my] = 1;
                grid[(mx+1)%cols][my] = 1; // Brush size 2
                grid[mx][(my+1)%rows] = 1;
            }
        }

        let next = grid.map(arr => [...arr]);
        for(let i=0; i<cols; i++) {
            for(let j=0; j<rows; j++) {
                if(grid[i][j]) ctx.fillRect(i*size, j*size, size-1, size-1);
                let sum = 0;
                for(let I=-1; I<2; I++) for(let J=-1; J<2; J++) sum += grid[(i+I+cols)%cols][(j+J+rows)%rows];
                sum -= grid[i][j];
                if(grid[i][j] === 0 && sum === 3) next[i][j] = 1;
                else if(grid[i][j] === 1 && (sum < 2 || sum > 3)) next[i][j] = 0;
            }
        }
        grid = next;
        setTimeout(() => animationId = requestAnimationFrame(loop), 50);
    }
    loop();
}

// 6. Windy Fractal (Mouse controls wind)
function runTree(ctx, w, h, color) {
    function drawBranch(len, x, y, a, width) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        let x2 = x + len * Math.sin(a);
        let y2 = y - len * Math.cos(a);
        ctx.lineWidth = width;
        ctx.lineTo(x2, y2);
        ctx.stroke();
        if(len > 5) {
            drawBranch(len * 0.7, x2, y2, a + mouseX_influence, width * 0.7);
            drawBranch(len * 0.7, x2, y2, a - mouseX_influence, width * 0.7);
        }
    }
    let mouseX_influence = 0.5;
    function loop() {
        ctx.clearRect(0,0,w,h);
        ctx.strokeStyle = color;
        // Map mouse X to angle variance (Wind)
        let targetAngle = (mouse.x / w) * Math.PI / 2;
        mouseX_influence += (targetAngle - mouseX_influence) * 0.1;
        
        drawBranch(120, w/2, h, 0, 10);
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 7. Morphing Spiro (Mouse shape shift)
function runSpirograph(ctx, w, h, color) {
    let t = 0;
    function loop() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.1)';
        ctx.fillRect(0,0,w,h);
        ctx.strokeStyle = color;
        ctx.beginPath();
        const cx = w/2, cy = h/2;
        
        // Mouse controls parameters
        let R = 100 + (mouse.x / w) * 100;
        let r = 20 + (mouse.y / h) * 50;
        let a = 60;
        
        for(let i=0; i<20; i++) {
            t += 0.1;
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

// 8. Hyperdrive (Mouse controls warp direction)
function runWarp(ctx, w, h, color) {
    const stars = Array(300).fill().map(() => ({
        x: Math.random() * w - w/2,
        y: Math.random() * h - h/2,
        z: Math.random() * w
    }));
    function loop() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.3)'; // Trails
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle = color;
        
        // Shift center based on mouse
        let cx = w/2 + (mouse.x - w/2) * 0.5;
        let cy = h/2 + (mouse.y - h/2) * 0.5;

        stars.forEach(s => {
            s.z -= 10; // Speed
            if(s.z <= 0) {
                s.x = Math.random() * w - w/2;
                s.y = Math.random() * h - h/2;
                s.z = w;
            }
            let k = 128.0 / s.z;
            let px = s.x * k + cx;
            let py = s.y * k + cy;
            let sz = (1 - s.z / w) * 4;
            
            if(px >= 0 && px <= w && py >= 0 && py <= h) {
                ctx.beginPath(); ctx.arc(px, py, sz, 0, Math.PI*2); ctx.fill();
            }
        });
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 9. Neon Fluid (Stronger Interaction)
function runFluid(ctx, w, h, color) {
    const particles = Array(200).fill().map(() => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: 0, vy: 0,
        angle: Math.random() * Math.PI * 2
    }));
    function loop() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.05)';
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle = color;
        
        particles.forEach(p => {
            // Flow field
            let noise = Math.sin(p.x * 0.005) + Math.cos(p.y * 0.005);
            p.angle += noise * 0.05;
            p.vx += Math.cos(p.angle) * 0.2;
            p.vy += Math.sin(p.angle) * 0.2;
            
            // Mouse push
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let d = Math.sqrt(dx*dx + dy*dy);
            if(d < 100) {
                p.vx -= dx * 0.05;
                p.vy -= dy * 0.05;
            }
            
            // Friction
            p.vx *= 0.95; p.vy *= 0.95;
            p.x += p.vx; p.y += p.vy;
            
            if(p.x < 0) p.x = w; if(p.x > w) p.x = 0;
            if(p.y < 0) p.y = h; if(p.y > h) p.y = 0;
            
            ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI*2); ctx.fill();
        });
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 10. Sonic Waves (Mouse Frequency)
function runSine(ctx, w, h, color) {
    let t = 0;
    function loop() {
        ctx.clearRect(0,0,w,h);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        t += 0.05;
        
        let amplitude = (mouse.y / h) * 100;
        let freq = 0.01 + (mouse.x / w) * 0.05;

        for(let i=0; i<5; i++) {
            ctx.beginPath();
            for(let x=0; x<w; x+=5) {
                let y = h/2 + Math.sin(x * freq + t + i) * amplitude * Math.sin(t*0.5);
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 11. Active Voronoi (Mouse is a cell)
function runVoronoi(ctx, w, h, color) {
    const points = Array(15).fill().map(() => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random()-0.5), vy: (Math.random()-0.5)
    }));
    function loop() {
        ctx.clearRect(0,0,w,h);
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.2;
        
        // Add mouse as a dynamic point
        const activePoints = [...points, {x: mouse.x, y: mouse.y, vx:0, vy:0}];
        
        activePoints.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if(p.x < 0 || p.x > w) p.vx *= -1;
            if(p.y < 0 || p.y > h) p.vy *= -1;
            
            ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2); 
            ctx.fillStyle = (p === activePoints[activePoints.length-1]) ? '#fff' : color; // Highlight mouse
            ctx.fill();
        });
        
        for(let i=0; i<activePoints.length; i++){
            for(let j=i+1; j<activePoints.length; j++){
                let d = Math.hypot(activePoints[i].x - activePoints[j].x, activePoints[i].y - activePoints[j].y);
                if(d < 250) {
                    ctx.beginPath(); 
                    ctx.moveTo(activePoints[i].x, activePoints[i].y); 
                    ctx.lineTo(activePoints[j].x, activePoints[j].y); 
                    ctx.stroke();
                }
            }
        }
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 12. Cyber Hex (Light up on hover)
function runHex(ctx, w, h, color) {
    let t = 0;
    function drawHex(x, y, r) {
        ctx.beginPath();
        for(let i=0; i<6; i++) ctx.lineTo(x + r * Math.cos(i*Math.PI/3), y + r * Math.sin(i*Math.PI/3));
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
                let px = x + offset;
                
                // Mouse highlight
                let dist = Math.hypot(mouse.x - px, mouse.y - y);
                let pulse = Math.sin(t + px*0.01 + y*0.01) * 5;
                
                if(dist < 100) {
                    ctx.lineWidth = 2;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = color;
                } else {
                    ctx.lineWidth = 0.5;
                    ctx.shadowBlur = 0;
                }
                
                drawHex(px, y, size/2 + pulse);
            }
        }
        ctx.shadowBlur = 0;
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 13. Data Stream (Mouse scrambles data)
function runBinary(ctx, w, h, color) {
    ctx.font = "14px monospace";
    const nums = Array.from({length: 150}, () => ({
        x: Math.random()*w, y: Math.random()*h, v: Math.random()*3+1
    }));
    function loop() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.2)';
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle = color;
        nums.forEach(n => {
            n.y += n.v;
            if(n.y > h) n.y = 0;
            
            // Mouse scramble
            if(Math.abs(mouse.x - n.x) < 50 && Math.abs(mouse.y - n.y) < 50) {
                ctx.fillStyle = '#fff';
                ctx.fillText(Math.random() > 0.5 ? "?" : "!", n.x, n.y);
                ctx.fillStyle = color;
            } else {
                ctx.fillText(Math.random() > 0.5 ? "1" : "0", n.x, n.y);
            }
        });
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 14. Hypnotic Spiral (Mouse Zoom)
function runSpiral(ctx, w, h, color) {
    let t = 0;
    function loop() {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.1)';
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle = color;
        const cx = w/2, cy = h/2;
        t += 0.1;
        
        // Mouse zoom
        let zoom = 1 + (mouse.y / h);
        
        for(let i=0; i<300; i++) {
            let angle = 0.1 * i + t * 0.02;
            let r = 2 * i * zoom;
            let x = cx + r * Math.cos(angle);
            let y = cy + r * Math.sin(angle);
            
            // Color shift
            ctx.fillStyle = i % 20 === 0 ? '#fff' : color;
            
            ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI*2); ctx.fill();
        }
        animationId = requestAnimationFrame(loop);
    }
    loop();
}

// 15. Chaos Physics (Interactive Pendulum)
function runPendulum(ctx, w, h, color) {
    let r1 = 150, r2 = 150, m1 = 20, m2 = 20;
    let a1 = Math.PI/2, a2 = Math.PI/2;
    let a1_v = 0, a2_v = 0;
    let path = [];
    const cx = w/2, cy = h/3;
    
    function loop() {
        // Mouse drag (Basic)
        if(mouse.down) {
            // Reset velocity and drag slightly towards mouse X
            a1_v = 0; a2_v = 0;
            a1 = (mouse.x - cx) * 0.01;
            a2 = (mouse.y - cy) * 0.01;
            path = []; // clear trail
        } else {
            // Physics
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
            a1_v *= 0.999; a2_v *= 0.999; 
        }

        let x1 = r1 * Math.sin(a1) + cx;
        let y1 = r1 * Math.cos(a1) + cy;
        let x2 = x1 + r2 * Math.sin(a2);
        let y2 = y1 + r2 * Math.cos(a2);

        path.push({x: x2, y: y2});
        if(path.length > 300) path.shift();

        ctx.clearRect(0,0,w,h);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        
        ctx.beginPath(); ctx.arc(x1, y1, 5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(x2, y2, 5, 0, Math.PI*2); ctx.fill();

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

// --- UI LOGIC ---
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
    if(toggle) toggle.addEventListener('click', () => menu.classList.toggle('active'));
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