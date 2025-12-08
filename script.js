document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroAnimation();
    initQuotes();
    initScrollReveal();
});

// 1. Navigation & Mobile Toggle
function initNavigation() {
    const nav = document.querySelector('.navbar');
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.nav-menu');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) nav.classList.remove('hidden');
        else if (currentScroll > lastScroll && !menu.classList.contains('active')) nav.classList.add('hidden');
        else nav.classList.remove('hidden');
        lastScroll = currentScroll;
    });

    toggle.addEventListener('click', () => menu.classList.toggle('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => menu.classList.remove('active')));
}

// 2. Hero Animation: Interactive Colored Network
function initHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    
    // Fun Palette
    const colors = ['#64ffda', '#f472b6', '#60a5fa', '#ffd700'];

    const mouse = { x: null, y: null };
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.baseX = this.x;
            this.baseY = this.y;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Boundary bounce
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;

            // Mouse Repulsion (Fun interaction)
            if (mouse.x) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const angle = Math.atan2(dy, dx);
                    const force = (150 - dist) / 150;
                    this.vx -= Math.cos(angle) * force * 0.5;
                    this.vy -= Math.sin(angle) * force * 0.5;
                }
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < 80; i++) particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Connect
        particles.forEach((a, i) => {
            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(136, 146, 176, ${1 - dist/120})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
    animate();
}

// 3. Quote Generator with "Slot Machine" Scramble Effect
function initQuotes() {
    const quotes = [
        { text: "Pure mathematics is, in its way, the poetry of logical ideas.", author: "Albert Einstein" },
        { text: "The book of nature is written in the language of mathematics.", author: "Galileo Galilei" },
        { text: "Mathematics is the art of giving the same name to different things.", author: "Henri Poincaré" },
        { text: "A mathematician is a machine for turning coffee into theorems.", author: "Alfréd Rényi" },
        { text: "Obvious is the most dangerous word in mathematics.", author: "E.T. Bell" }
    ];

    const btn = document.getElementById('new-quote-btn');
    const textEl = document.getElementById('quote-display');
    const authorEl = document.getElementById('quote-author');

    function scrambleText(element, targetText, duration = 500) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        const steps = Math.floor(duration / 30);
        let step = 0;
        
        const interval = setInterval(() => {
            const progress = step / steps;
            const revealIdx = Math.floor(progress * targetText.length);
            
            let scrambled = targetText.substring(0, revealIdx);
            for (let i = revealIdx; i < targetText.length; i++) {
                scrambled += chars[Math.floor(Math.random() * chars.length)];
            }
            element.textContent = scrambled;
            
            step++;
            if (step > steps) {
                clearInterval(interval);
                element.textContent = targetText;
            }
        }, 30);
    }

    if (btn) {
        btn.addEventListener('click', () => {
            const random = quotes[Math.floor(Math.random() * quotes.length)];
            scrambleText(textEl, random.text);
            authorEl.textContent = `— ${random.author}`;
        });
    }
}

// 4. Scroll Reveal
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}