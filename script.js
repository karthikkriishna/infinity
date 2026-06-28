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
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ============================================
// Scrollspy — highlight the active nav link
// ============================================
const navLinks = document.querySelectorAll('.site-nav a');
const sectionMap = new Map();

navLinks.forEach((link) => {
  const id = link.getAttribute('href').slice(1);
  const section = document.getElementById(id);
  if (section) sectionMap.set(section, link);
});

if ('IntersectionObserver' in window && sectionMap.size) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = sectionMap.get(entry.target);
        if (!link || !entry.isIntersecting) return;
        navLinks.forEach((l) => l.classList.remove('is-active'));
        link.classList.add('is-active');
      });
    },
    { rootMargin: '-45% 0px -45% 0px' }
  );

  sectionMap.forEach((_, section) => spy.observe(section));
}

// ============================================
// Timeline filters
// ============================================
const filterChips = document.querySelectorAll('.filter-chip');
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineGroups = document.querySelectorAll('.timeline-group');

if (filterChips.length) {
  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChips.forEach((c) => {
        c.classList.remove('is-active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');

      const filter = chip.dataset.filter;

      timelineItems.forEach((item) => {
        const show = filter === 'all' || item.dataset.tag === filter;
        item.classList.toggle('is-hidden', !show);
      });

      timelineGroups.forEach((group) => {
        const visible = group.querySelectorAll('.timeline-item:not(.is-hidden)');
        group.classList.toggle('is-hidden', visible.length === 0);
      });
    });
  });
}

// ============================================
// Back to top
// ============================================
const backToTop = document.getElementById('back-to-top');

if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 480);
  });

  backToTop.addEventListener('click', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

// ============================================
// Copy email
// ============================================
const copyBtn = document.querySelector('.copy-btn');

if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const text = copyBtn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
      const original = copyBtn.textContent;
      copyBtn.textContent = 'Copied';
      setTimeout(() => {
        copyBtn.textContent = original;
      }, 1600);
    } catch (err) {
      // Clipboard API unavailable — the mailto link next to it still works.
    }
  });
}
