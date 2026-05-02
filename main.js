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

// ===== LAZY LOAD VIDEOS =====
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

// ===== GIF/image on hover for project cards =====
document.querySelectorAll('.project-card').forEach(card => {
  const gif = card.querySelector('.card-video');
  const still = card.querySelector('.card-still');
  if (!gif || !still) return;
  still.style.opacity = '1';
  still.style.zIndex = '2';
  gif.style.opacity = '0';
  gif.style.zIndex = '1';
  gif.style.position = 'absolute';
  gif.style.inset = '0';
  gif.style.width = '100%';
  gif.style.height = '100%';
  gif.style.objectFit = 'cover';
  card.addEventListener('mouseenter', () => {
    gif.style.opacity = '1';
    gif.style.zIndex = '3';
    still.style.opacity = '0';
  });
  card.addEventListener('mouseleave', () => {
    gif.style.opacity = '0';
    gif.style.zIndex = '1';
    still.style.opacity = '1';
  });
});

// ===== GIF on hover =====
document.querySelectorAll('.hover-gif').forEach(img => {
  const gif = img.dataset.src;
  const still = img.dataset.static;
  img.src = still;
  img.removeAttribute('data-src');
  img.classList.add('loaded');
  img.addEventListener('mouseenter', () => img.src = gif);
  img.addEventListener('mouseleave', () => img.src = still);
});

// ===== Force hero video autoplay =====
const heroVideo = document.getElementById('hero-video');
if (heroVideo) {
  heroVideo.play().catch(() => {
    heroVideo.muted = true;
    heroVideo.play();
  });
}

// ===== LIGHTBOX =====
const lightboxOverlay = document.createElement('div');
lightboxOverlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.92); z-index:2000; display:flex; align-items:center; justify-content:center; opacity:0; pointer-events:none; transition:opacity 0.3s; cursor:zoom-out; padding:40px;';
document.body.appendChild(lightboxOverlay);

const lightboxImg = document.createElement('img');
lightboxImg.style.cssText = 'max-width:100%; max-height:90vh; object-fit:contain; transform:scale(0.95); transition:transform 0.3s; cursor:zoom-out;';
lightboxOverlay.appendChild(lightboxImg);

let lightboxOpen = false;

function openLightbox(src) {
  lightboxImg.src = src;
  lightboxOverlay.style.opacity = '1';
  lightboxOverlay.style.pointerEvents = 'all';
  lightboxImg.style.transform = 'scale(1)';
  document.body.style.overflow = 'hidden';
  lightboxOpen = true;
}

function closeLightbox() {
  lightboxOverlay.style.opacity = '0';
  lightboxOverlay.style.pointerEvents = 'none';
  lightboxImg.style.transform = 'scale(0.95)';
  document.body.style.overflow = '';
  lightboxOpen = false;
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

document.addEventListener('click', (e) => {
  if (lightboxOpen) {
    e.stopPropagation();
    closeLightbox();
    return;
  }
  const img = e.target.closest('img');
  if (!img) return;
  if (img.closest('nav')) return;
  if (img.classList.contains('card-still')) return;
  if (img.classList.contains('card-gif')) return;
  if (img.closest('.hero-bg')) return;
  if (img.closest('.proj-hero-media')) return;
  if (img.closest('.archive-thumb')) return;
  if (img.closest('.related-card')) return;
  const src = img.src;
  if (src && !src.includes('placehold.co')) openLightbox(src);
});
