// Hamburger toggle
const ham = document.getElementById('hamburger');
const links = document.getElementById('navLinks');

ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  links.classList.toggle('open');
});

links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  ham.classList.remove('open');
  links.classList.remove('open');
}));

// Scroll reveal
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Copy prompt
function copyPrompt() {
  const text = document.getElementById('promptText').innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    const orig = btn.innerHTML;
    btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
    btn.style.cssText = 'border-color:var(--cyan);color:var(--cyan)';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.cssText = '';
    }, 2000);
  });
}
