/* ---- Helpers ---- */
const $ = id => document.getElementById(id);
const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Custom Cursor (pointer devices only) ---- */
if (!isTouch) {
  const cursor    = $('cursor');
  const cursorDot = $('cursorDot');
  let mx = 0, my = 0, cx = 0, cy = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    // Dot follows immediately
    cursorDot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
  }, { passive: true });

  function animateCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%))`;
    rafId = requestAnimationFrame(animateCursor);
  }
  rafId = requestAnimationFrame(animateCursor);

  document.querySelectorAll('a, button, .card, .visual-box').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'),    { passive: true });
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'), { passive: true });
  });
}

/* ---- Hamburger ---- */
const ham      = $('hamburger');
const navLinks = $('navLinks');
ham.addEventListener('click', () => {
  const open = ham.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  ham.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  ham.classList.remove('open');
  navLinks.classList.remove('open');
  ham.setAttribute('aria-expanded', 'false');
}, { passive: true }));

/* ---- Smooth Scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ---- Navbar darken on scroll (throttled) ---- */
const nav = $('nav');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      nav.style.background = window.scrollY > 20
        ? 'rgba(7,7,15,0.97)'
        : 'rgba(7,7,15,0.8)';
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ---- Scroll Reveal ---- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = +(entry.target.dataset.delay || 0);
    if (delay) {
      setTimeout(() => entry.target.classList.add('visible'), delay);
    } else {
      entry.target.classList.add('visible');
    }
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ---- Animated Counters ---- */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = +el.dataset.target;
    if (prefersReducedMotion) { el.textContent = target; counterObs.unobserve(el); return; }
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { el.textContent = target; clearInterval(timer); }
      else { el.textContent = Math.floor(start); }
    }, 30);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(c => counterObs.observe(c));

/* ---- Floating Particles (skip if reduced motion) ---- */
if (!prefersReducedMotion) {
  const container = $('particles');
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 12; i++) {   // reduced from 18 → 12
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 2.5 + 1.5;
    p.style.cssText =
      `width:${size}px;height:${size}px;` +
      `left:${Math.random() * 100}%;` +
      `top:${50 + Math.random() * 50}%;` +
      `animation-duration:${7 + Math.random() * 8}s;` +
      `animation-delay:${Math.random() * 7}s`;
    frag.appendChild(p);
  }
  container.appendChild(frag);
}
