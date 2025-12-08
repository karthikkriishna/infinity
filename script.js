// 50 Quotes List
const quotes = [
    { text: "In mathematics, you don’t understand things. You just get used to them.", author: "John von Neumann" },
    { text: "A mathematician is a blind man in a dark room looking for a black cat which isn't there.", author: "Charles Darwin" },
    { text: "There are three kinds of lies: lies, damned lies, and statistics.", author: "Mark Twain" },
    { text: "If I were again beginning my studies, I would follow the advice of Plato and start with mathematics.", author: "Galileo Galilei" },
    { text: "I have heard that [a former student] has become a poet. I can well believe it; he did not have enough imagination to be a mathematician.", author: "David Hilbert" },
    { text: "Arithmetic is being able to count up to twenty without taking off your shoes.", author: "Mickey Mouse" },
    { text: "Mathematics is the only science where one never knows what one is talking about nor whether what is said is true.", author: "Bertrand Russell" },
    { text: "Black holes are where God divided by zero.", author: "Steven Wright" },
    { text: "The difference between the poet and the mathematician is that the poet tries to get his head into the heavens while the mathematician tries to get the heavens into his head.", author: "G.K. Chesterton" },
    { text: "God exists since mathematics is consistent, and the Devil exists since we cannot prove it.", author: "André Weil" },
    { text: "Mathematics is the language with which God has written the universe.", author: "Galileo Galilei" },
    { text: "Mathematics, rightly viewed, possesses not only truth, but supreme beauty—a beauty cold and austere, like that of sculpture.", author: "Bertrand Russell" },
    { text: "It is impossible to be a mathematician without being a poet in soul.", author: "Sofia Kovalevskaya" },
    { text: "An equation for me has no meaning unless it expresses a thought of God.", author: "Srinivasa Ramanujan" },
    { text: "The moving power of mathematical invention is not reasoning but imagination.", author: "Augustus De Morgan" },
    { text: "May not music be described as the mathematics of the sense, mathematics as music of the reason?", author: "James Joseph Sylvester" },
    { text: "The study of mathematics, like the Nile, begins in minuteness but ends in magnificence.", author: "Charles Caleb Colton" },
    { text: "Pure mathematics is, in its way, the poetry of logical ideas.", author: "Albert Einstein" },
    { text: "The beauty of mathematics only shows itself to more patient followers.", author: "Maryam Mirzakhani" },
    { text: "Algebra is nothing more than geometry, in words; geometry is nothing more than algebra, in pictures.", author: "Sophie Germain" },
    { text: "God does not care about our mathematical difficulties. He integrates empirically.", author: "Albert Einstein" },
    { text: "Mathematics is the art of giving the same name to different things.", author: "Henri Poincaré" },
    { text: "Geometry is knowledge of the eternally existent.", author: "Plato" },
    { text: "No human investigation can be called true science without passing through mathematical tests.", author: "Leonardo da Vinci" },
    { text: "Mathematics is the queen of the sciences and number theory is the queen of mathematics.", author: "Carl Friedrich Gauss" },
    { text: "Without mathematics, there’s nothing you can do. Everything around you is mathematics. Everything around you is numbers.", author: "Shakuntala Devi" },
    { text: "Just as a musician can hear the notes on a page, a mathematician can see the logic in an equation.", author: "Marcus du Sautoy" },
    { text: "One of the most amazing things about mathematics is the people who do it.", author: "Lárus Thorlacius" },
    { text: "Mathematics compares the most diverse phenomena and discovers the secret analogies that unite them.", author: "Joseph Fourier" },
    { text: "Q.E.D.", author: "Euclid" },
    { text: "I think, therefore I am.", author: "René Descartes" },
    { text: "Eureka!", author: "Archimedes" },
    { text: "Number is the ruler of forms and ideas.", author: "Pythagoras" },
    { text: "Mathematics is the music of reason.", author: "James Joseph Sylvester" },
    { text: "Calculus is the most powerful weapon of thought yet devised by the wit of man.", author: "W.B. Smith" },
    { text: "Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding.", author: "William Paul Thurston" },
    { text: "A proof tells us where to concentrate our doubts.", author: "Morris Kline" },
    { text: "Nature is written in mathematical language.", author: "Galileo Galilei" },
    { text: "Mathematics involves no patents.", author: "Craig Venter" },
    { text: "A mathematician is a machine for turning coffee into theorems.", author: "Alfréd Rényi" },
    { text: "My brain is open.", author: "Paul Erdős" },
    { text: "If you ask a mathematician to solve a problem, he will first show you that the problem is unsolved, then he will show you that it is unsolvable.", author: "Anonymous" }
];

// Quote Generator Logic
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const quoteButton = document.getElementById('new-quote-btn');

function generateQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];

    quoteText.style.opacity = 0;
    quoteAuthor.style.opacity = 0;

    setTimeout(() => {
        quoteText.innerText = selectedQuote.text;
        quoteAuthor.innerText = `— ${selectedQuote.author}`;
        quoteText.style.opacity = 1;
        quoteAuthor.style.opacity = 1;
    }, 300);
}

if(quoteButton) {
    quoteButton.addEventListener('click', generateQuote);
}

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.backgroundColor = 'rgba(10, 25, 47, 0.98)';
        nav.style.boxShadow = '0 10px 30px -10px rgba(2,12,27,0.7)';
    } else {
        nav.style.backgroundColor = 'rgba(10, 25, 47, 0.95)';
        nav.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
    }
});

// Scroll Reveal Animation
function reveal() {
    var reveals = document.querySelectorAll(".timeline-item");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);
reveal(); // Trigger once on load

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links a');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Animate hamburger to X (optional, keeping simple for now)
    });
}

// Close mobile menu when a link is clicked
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Event Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const timelineItems = document.querySelectorAll('.timeline-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active to clicked
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        timelineItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                // Small timeout to allow display:block to apply before opacity transition
                setTimeout(() => item.classList.add('active'), 50); 
            } else {
                item.style.display = 'none';
                item.classList.remove('active');
            }
        });
        
        // Re-trigger reveal to ensure visible items are animated
        reveal();
    });
});

// Hero Canvas Animation (Constellation Effect)
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.directionX = (Math.random() * 0.4) - 0.2;
            this.directionY = (Math.random() * 0.4) - 0.2;
            this.size = Math.random() * 2 + 1;
            this.color = '#64ffda';
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    opacityValue = 1 - (distance/20000);
                    ctx.strokeStyle = 'rgba(100, 255, 218,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    init();
    animate();
}
