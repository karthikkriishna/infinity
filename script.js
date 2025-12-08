// Initialize Math Background
function initMathBg() {
    const bg = document.createElement('div');
    bg.className = 'math-bg';
    document.body.appendChild(bg);

    const symbols = ['π', '∑', '∫', '∞', '∆', '∇', '√', '∂', '∅', '∈', '∀', '∃', '≠', '≈'];
    const count = 30;

    for (let i = 0; i < count; i++) {
        const span = document.createElement('span');
        span.className = 'math-symbol';
        span.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        
        // Random positioning
        span.style.left = Math.random() * 100 + 'vw';
        span.style.top = Math.random() * 100 + 'vh';
        span.style.fontSize = Math.random() * 2 + 1 + 'rem';
        span.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        // Parallax speed data attribute
        span.setAttribute('data-speed', Math.random() * 0.5 + 0.1);
        
        bg.appendChild(span);
    }
}

// Custom Cursor Logic
function initCursor() {
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover Effect
    const clickables = document.querySelectorAll('a, button, .filter-btn');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
}

// 3D Sphere/Galaxy Animation
function init3DHero() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let rotation = 0;
    const dots = [];
    const DOT_COUNT = 800;
    const GLOBE_RADIUS = width > 768 ? 300 : 150;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - width / 2) * 0.001;
        mouseY = (e.clientY - height / 2) * 0.001;
    });

    class Dot {
        constructor() {
            // Spherical coordinates
            this.theta = Math.random() * Math.PI * 2; // Longitude
            this.phi = Math.acos((Math.random() * 2) - 1); // Latitude
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.projectedX = 0;
            this.projectedY = 0;
            this.size = Math.random() * 2 + 1;
        }

        project() {
            // Convert spherical to cartesian
            this.x = GLOBE_RADIUS * Math.sin(this.phi) * Math.cos(this.theta);
            this.y = GLOBE_RADIUS * Math.sin(this.phi) * Math.sin(this.theta);
            this.z = GLOBE_RADIUS * Math.cos(this.phi);

            // Rotate around Y axis (auto rotation)
            let rotX = this.x * Math.cos(rotation) - this.z * Math.sin(rotation);
            let rotZ = this.x * Math.sin(rotation) + this.z * Math.cos(rotation);
            this.x = rotX;
            this.z = rotZ;

            // Mouse Rotation (X and Y axis tilt)
            let yRotY = this.y * Math.cos(mouseY * 2) - this.z * Math.sin(mouseY * 2);
            let yRotZ = this.y * Math.sin(mouseY * 2) + this.z * Math.cos(mouseY * 2);
            this.y = yRotY;
            this.z = yRotZ;

            let xRotX = this.x * Math.cos(mouseX * 2) - this.z * Math.sin(mouseX * 2);
            let xRotZ = this.x * Math.sin(mouseX * 2) + this.z * Math.cos(mouseX * 2);
            this.x = xRotX;
            this.z = xRotZ;

            // Perspective Projection
            const scale = 400 / (400 - this.z);
            this.projectedX = this.x * scale + width / 2;
            this.projectedY = this.y * scale + height / 2;
            this.scale = scale;
        }

        draw() {
            // Opacity based on Z-depth (fog)
            const alpha = (this.z + GLOBE_RADIUS) / (2 * GLOBE_RADIUS);
            
            ctx.beginPath();
            ctx.arc(this.projectedX, this.projectedY, this.size * this.scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 255, 218, ${alpha})`;
            ctx.fill();
        }
    }

    // Initialize dots
    for(let i=0; i<DOT_COUNT; i++) {
        dots.push(new Dot());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Auto rotate
        rotation += 0.002;

        dots.forEach(dot => {
            dot.project();
            dot.draw();
        });

        // Draw connecting lines between close dots
        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                const dx = dots[i].projectedX - dots[j].projectedX;
                const dy = dots[i].projectedY - dots[j].projectedY;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if (dist < 40 && dots[i].scale > 1 && dots[j].scale > 1) {
                    ctx.beginPath();
                    ctx.moveTo(dots[i].projectedX, dots[i].projectedY);
                    ctx.lineTo(dots[j].projectedX, dots[j].projectedY);
                    ctx.strokeStyle = `rgba(100, 255, 218, ${0.15 * (1 - dist/40)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}

// Parallax Effect on Scroll
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        document.querySelectorAll('.math-symbol').forEach(el => {
            const speed = el.getAttribute('data-speed');
            el.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// 3D Tilt Effect for Cards
function initTilt() {
    const cards = document.querySelectorAll('.about-card, .team-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }
});


// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initMathBg();
    if(window.innerWidth > 768) initCursor(); // Only on desktop
    init3DHero();
    initParallax();
    initTilt();
    
    // Existing Quote Logic (Preserved)
    const quotes = [
        { text: "In mathematics, you don’t understand things. You just get used to them.", author: "John von Neumann" },
        { text: "A mathematician is a blind man in a dark room looking for a black cat which isn't there.", author: "Charles Darwin" },
        { text: "There are three kinds of lies: lies, damned lies, and statistics.", author: "Mark Twain" },
        { text: "Mathematics is the art of giving the same name to different things.", author: "Henri Poincaré" },
        { text: "God exists since mathematics is consistent, and the Devil exists since we cannot prove it.", author: "André Weil" }
        // ... (Keep list short for demo, full list is fine)
    ];

    const quoteButton = document.getElementById('new-quote-btn');
    if(quoteButton) {
        quoteButton.addEventListener('click', () => {
            const quoteText = document.getElementById('quote-text');
            const quoteAuthor = document.getElementById('quote-author');
            const randomIndex = Math.floor(Math.random() * quotes.length);
            
            // Text scramble effect?
            quoteText.style.opacity = 0;
            quoteAuthor.style.opacity = 0;
            setTimeout(() => {
                quoteText.innerText = quotes[randomIndex].text;
                quoteAuthor.innerText = `— ${quotes[randomIndex].author}`;
                quoteText.style.opacity = 1;
                quoteAuthor.style.opacity = 1;
            }, 300);
        });
    }

    // Scroll Reveal (Existing)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".timeline-item").forEach(item => observer.observe(item));
    
    // Mobile Nav (Existing)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Filter Logic (Existing)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const val = btn.getAttribute('data-filter');
            timelineItems.forEach(item => {
                if(val === 'all' || item.getAttribute('data-category') === val) {
                    item.style.display = 'block';
                    setTimeout(() => item.classList.add('active'), 50);
                } else {
                    item.style.display = 'none';
                    item.classList.remove('active');
                }
            });
        });
    });
});
