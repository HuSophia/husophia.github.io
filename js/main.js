/* ════════════════════════════════════════════
   main.js — Site interactions
   ════════════════════════════════════════════ */

/* ── Blog modal ── */
function openPost(id) {
  const post = POSTS[id];
  if (!post) return;
  document.getElementById('modal-date').textContent  = post.date;
  document.getElementById('modal-title').textContent = post.title;
  document.getElementById('modal-body').innerHTML    = post.body;

  const modal = document.getElementById('blog-modal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // make post bookmarkable / shareable
  history.pushState({ post: id }, '', '#post-' + id);
}

function closePost() {
  document.getElementById('blog-modal').classList.remove('open');
  document.body.style.overflow = '';
  history.pushState(
    {},
    '',
    window.location.pathname + window.location.hash.replace(/#post-\w+/, '')
  );
}

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePost();
});

// Close on browser back button
window.addEventListener('popstate', e => {
  if (!e.state?.post) closePost();
});

// Auto-open post if URL hash is present on load
window.addEventListener('DOMContentLoaded', () => {
  const match = location.hash.match(/^#post-(\w+)$/);
  if (match) openPost(match[1]);
});

/* ── Flip project cards ── */
function toggleFlip(card) {
  card.classList.toggle('flipped');
}

/* ── Theme toggle ── */
const themeToggle = document.getElementById('themeToggle');
const htmlEl      = document.documentElement;

// Persist theme across page loads
const savedTheme = localStorage.getItem('theme') || 'autumn';
htmlEl.dataset.theme  = savedTheme;
themeToggle.checked   = savedTheme === 'lilac';

themeToggle.addEventListener('change', () => {
  const theme = themeToggle.checked ? 'lilac' : 'autumn';
  htmlEl.dataset.theme = theme;
  localStorage.setItem('theme', theme);
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('#nav a');

function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY + 160 >= sec.offsetTop) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* ── Scroll fade-in ── */
const fadeEls = document.querySelectorAll('.fade-up');
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => fadeObserver.observe(el));