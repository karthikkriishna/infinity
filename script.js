// ============================================
// Mobile nav toggle
// ============================================
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu after picking a link (mobile)
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================================
// Scroll reveal
// ============================================
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ============================================
// Quote rotator (small, curated, no API call)
// ============================================
const quotes = [
  {
    text: 'Mathematics is the art of giving the same name to different things.',
    author: 'Henri Poincaré',
  },
  {
    text: 'Mathematics is the queen of the sciences.',
    author: 'Carl Friedrich Gauss',
  },
  {
    text: 'A mathematician is a device for turning coffee into theorems.',
    author: 'Alfréd Rényi',
  },
  {
    text: 'Pure mathematics is, in its way, the poetry of logical ideas.',
    author: 'Albert Einstein',
  },
  {
    text: 'There is no permanent place in the world for ugly mathematics.',
    author: 'G. H. Hardy',
  },
];

let quoteIndex = 0;

const quoteTextEl = document.getElementById('quote-text');
const quoteByEl = document.getElementById('quote-by');
const quoteBtn = document.getElementById('quote-next');

if (quoteBtn && quoteTextEl && quoteByEl) {
  quoteBtn.addEventListener('click', () => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    const next = quotes[quoteIndex];

    quoteTextEl.classList.add('quote-fade');
    quoteByEl.classList.add('quote-fade');

    setTimeout(() => {
      quoteTextEl.textContent = next.text;
      quoteByEl.textContent = `— ${next.author}`;
      quoteTextEl.classList.remove('quote-fade');
      quoteByEl.classList.remove('quote-fade');
    }, 200);
  });
}
