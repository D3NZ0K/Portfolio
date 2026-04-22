// ===== NAV =====
const burger = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');
if (burger) {
  burger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// Active link
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// ===== BACK TO TOP =====
const backTop = document.querySelector('.back-top');
window.addEventListener('scroll', () => {
  backTop?.classList.toggle('visible', window.scrollY > 400);
});
backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== LAZY LOAD IMAGES =====
const lazyImages = document.querySelectorAll('img[data-src]');
const imgObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const img = entry.target;
    img.src = img.dataset.src;
    img.onload = () => {
      img.classList.add('loaded');
      img.closest('.media-wrap')?.classList.add('loaded');
    };
    obs.unobserve(img);
  });
}, { rootMargin: '200px' });

lazyImages.forEach(img => imgObserver.observe(img));

// ===== LAZY LOAD VIDEOS (GIFs remplacés par vidéos) =====
const lazyVideos = document.querySelectorAll('video[data-src]');
const vidObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const video = entry.target;
    video.src = video.dataset.src;
    video.load();
    video.addEventListener('canplay', () => {
      video.classList.add('loaded');
      video.closest('.media-wrap')?.classList.add('loaded');
    }, { once: true });
    obs.unobserve(video);
  });
}, { rootMargin: '300px' });

lazyVideos.forEach(v => vidObserver.observe(v));

// ===== REVEAL ON SCROLL =====
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObs.observe(el));

// ===== PROJECT CARD HOVER (tilt léger) =====
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
