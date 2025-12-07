// 50 Quotes List
const quotes = [
    { text: "In mathematics, you don’t understand things. You just get used to them.", author: "John von Neumann" },
    { text: "A mathematician is a blind man in a dark room looking for a black cat which isn't there.", author: "Charles Darwin" },
    { text: "There are three kinds of lies: lies, damned lies, and statistics.", author: "Mark Twain (attributed to Benjamin Disraeli)" },
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
    { text: "To isolate mathematics from the practical demands of the sciences is to invite the sterility of a cow that is no longer pregnant with none but ghosts.", author: "Pafnuty Chebyshev" },
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
    { text: "Clouds are not spheres, mountains are not cones, coastlines are not circles, and bark is not smooth, nor does lightning travel in a straight line.", author: "Benoît Mandelbrot" },
    { text: "If you ask a mathematician to solve a problem, he will first show you that the problem is unsolved, then he will show you that it is unsolvable.", author: "Anonymous" },
    { text: "There is no branch of mathematics, however abstract, which may not some day be capable of application to phenomena of the real world.", author: "Nikolai Lobachevsky" },
    { text: "There was a young lady named Bright,
Who traveled much faster than light.
She started one day
In a relative way,
And returned on the previous night.", author: "A.H. Reginald Buller" },
    { text: "A sphere is a shape that’s quite rare,
With a surface that’s perfectly bare.
No corners or edges,
No angles or ledges,
Just a curve that is perfectly fair.", author: "Unknown" },
    { text: "It’s a number commonly seen,
Calculated by man and machine.
Starts with 3 point 1 4,
But there’s infinitely more,
It’s the circle’s ratio supreme.", author: "Unknown" },
    { text: "A mathematician named Phipps,
Drank coffee in small little sips.
'For a mug,' he would say,
'Is a donut today,
If you look at the geometry of lips!'", author: "Unknown" },
    { text: "There was an old fellow named Euclid,
Who looked at a circle and drew lid.
'The radius,' said he,
'Is as plain as can be,
Whatever the size of the new lid.'", author: "Unknown" }
];

// Quote Generator Logic
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const quoteButton = document.getElementById('new-quote-btn');

function generateQuote() {
    // Basic random selection
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];

    // Fade out
    quoteText.style.opacity = 0;
    quoteAuthor.style.opacity = 0;

    setTimeout(() => {
        // Update Content
        quoteText.innerText = selectedQuote.text;
        quoteAuthor.innerText = `— ${selectedQuote.author}`;
        
        // Fade in
        quoteText.style.opacity = 1;
        quoteAuthor.style.opacity = 1;
    }, 300);
}

// Add CSS transitions via JS to ensure they apply after load
quoteText.style.transition = "opacity 0.3s ease";
quoteAuthor.style.transition = "opacity 0.3s ease";

// Listeners
quoteButton.addEventListener('click', generateQuote);

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

// Reveal Elements on Scroll
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

// Add active class style in JS injection or simple class toggle
// Adding specific CSS for the reveal animation here for completeness
const style = document.createElement('style');
style.innerHTML = `
    .timeline-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }
    .timeline-item.active {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);