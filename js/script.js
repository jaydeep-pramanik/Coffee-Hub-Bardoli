/* =============================================
   COFFEE HUB BARDOLI — Shared Script
   ============================================= */

/* --- Loading Screen --- */
// Use DOMContentLoaded + performance.now() so the 2.3 s minimum is always
// measured from actual page-navigation time, not from when images finish.
// This fixes the home page where many external images (Unsplash, Fonts)
// delayed window.load well past 2.3 s, making the loader flash briefly.
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;
  const elapsed = performance.now();               // ms since page nav
  const remaining = Math.max(2300 - elapsed, 400); // always ≥ 2.3 s total
  setTimeout(() => loader.classList.add('hidden'), remaining);
});

// Restore loader on bfcache restore (browser back/forward button)
window.addEventListener('pageshow', (e) => {
  if (!e.persisted) return;
  const loader = document.getElementById('loading-screen');
  if (!loader) return;
  loader.classList.remove('hidden');
  setTimeout(() => loader.classList.add('hidden'), 1600);
});

/* --- Theme (Dark Mode) --- */
const html = document.documentElement;
const body = document.body;
const THEME_KEY = 'ch-theme';

function applyTheme(theme) {
  if (theme === 'dark') {
    body.classList.add('dark');
    document.querySelectorAll('.theme-icon-moon').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.theme-icon-sun').forEach(el => el.style.display = 'block');
  } else {
    body.classList.remove('dark');
    document.querySelectorAll('.theme-icon-moon').forEach(el => el.style.display = 'block');
    document.querySelectorAll('.theme-icon-sun').forEach(el => el.style.display = 'none');
  }
}

function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  localStorage.setItem(THEME_KEY, saved);
  applyTheme(saved);
})();

document.querySelectorAll('.theme-btn').forEach(btn => btn.addEventListener('click', toggleTheme));

/* --- Scroll Progress Bar --- */
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  if (!progressBar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

/* --- Sticky Navbar --- */
const navbar = document.getElementById('navbar');
function handleNavScroll() {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* --- Active Nav Link --- */
(function setActiveLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    const isHome = (path === '/' || path === '/index.html') && (href === '/' || href === '/index.html');
    const isMatch = href && path.endsWith(href) && href !== '/';
    if (isHome || isMatch) link.classList.add('active');
  });
})();

/* --- Mobile Menu --- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');

function openMobileMenu() {
  mobileMenu?.classList.add('open');
  mobileOverlay?.classList.add('open');
  hamburger?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  mobileMenu?.classList.remove('open');
  mobileOverlay?.classList.remove('open');
  hamburger?.classList.remove('open');
  document.body.style.overflow = '';
}
hamburger?.addEventListener('click', () => {
  mobileMenu?.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
});
mobileOverlay?.addEventListener('click', closeMobileMenu);
document.querySelectorAll('.mobile-menu a').forEach(link => link.addEventListener('click', closeMobileMenu));

/* --- Scroll Reveal --- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('visible'), +delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el, i) => {
    const siblings = el.closest('.grid-2, .menu-grid, .categories-grid, .testimonials-grid, .diff-grid, .reviews-grid, .team-grid');
    if (siblings) {
      const children = siblings.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      const idx = Array.from(children).indexOf(el);
      if (idx >= 0) el.dataset.delay = idx * 90;
    }
    observer.observe(el);
  });
}
document.addEventListener('DOMContentLoaded', initScrollReveal);

/* --- Typing Animation --- */
function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const phrases = JSON.parse(el.dataset.phrases || '[]');
  if (!phrases.length) return;
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const phrase = phrases[phraseIdx];
    if (deleting) {
      charIdx--;
      el.textContent = phrase.substring(0, charIdx);
      if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(tick, 400); return; }
      setTimeout(tick, 45);
    } else {
      charIdx++;
      el.textContent = phrase.substring(0, charIdx);
      if (charIdx === phrase.length) { setTimeout(() => { deleting = true; tick(); }, 2200); return; }
      setTimeout(tick, 95);
    }
  }
  tick();
}
document.addEventListener('DOMContentLoaded', initTyping);

/* --- Animated Counters --- */
function animateCounter(el) {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}
document.addEventListener('DOMContentLoaded', initCounters);

/* --- Back To Top --- */
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* --- Ripple Effect --- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const ripple = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.className = 'ripple-effect';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});

/* --- Toast Notification --- */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const iconSvg = type === 'success'
    ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 16 4 11"/></svg>`
    : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>`;
  toast.innerHTML = `<div class="toast-icon">${iconSvg}</div><span>${message}</span>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 3800);
}
window.showToast = showToast;

/* --- Smooth scroll for anchor links --- */
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const target = document.querySelector(anchor.getAttribute('href'));
  if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
});

/* --- Parallax hero --- */
function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  const isMobile = window.innerWidth <= 768;
  if (isMobile) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
  }, { passive: true });
}
document.addEventListener('DOMContentLoaded', initParallax);

/* --- Newsletter --- */
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    if (input?.value) {
      showToast('You have been subscribed. Thank you!');
      input.value = '';
    }
  });
});

/* --- Lazy Load Images --- */
function initLazyLoad() {
  const imgs = document.querySelectorAll('img[data-src]');
  if (!imgs.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  imgs.forEach(img => observer.observe(img));
}
document.addEventListener('DOMContentLoaded', initLazyLoad);

/* --- FAQ Accordion --- */
function initFaq() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}
document.addEventListener('DOMContentLoaded', initFaq);

/* --- Page Exit Transitions --- */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
      href.startsWith('tel:') || href.startsWith('http') ||
      href.startsWith('//') || link.target === '_blank') return;
  const cur = window.location.pathname;
  if (cur === href || cur === href + 'index.html' || (href === '/' && (cur === '/' || cur === '/index.html'))) return;
  e.preventDefault();
  document.body.classList.add('page-exiting');
  setTimeout(() => { window.location.href = href; }, 290);
});

/* --- Cursor Glow --- */
(function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || window.matchMedia('(hover: none)').matches) return;
  let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
  let cx = tx, cy = ty;
  let started = false;

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    glow.style.opacity = '1';
    if (!started) { started = true; tick(); }
  }, { passive: true });

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

  function tick() {
    cx += (tx - cx) * 0.07;
    cy += (ty - cy) * 0.07;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(tick);
  }
})();

/* --- Card 3D Tilt --- */
(function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  const MAX = 7;
  document.querySelectorAll('.card, .category-card, .menu-card, .diff-card, .review-card, .team-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * MAX}deg) rotateY(${x * MAX}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();
