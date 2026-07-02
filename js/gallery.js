/* =============================================
   COFFEE HUB BARDOLI — Gallery & Lightbox
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  /* --- Category Filter --- */
  const filterBtns = document.querySelectorAll('.gallery-filter .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      galleryItems.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  /* --- Lightbox --- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  if (!lightbox || !lightboxImg) return;

  let currentIndex = 0;
  let visibleItems = [];

  function getVisibleItems() {
    return Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }

  function openLightbox(index) {
    visibleItems = getVisibleItems();
    currentIndex = index;
    const item = visibleItems[currentIndex];
    if (!item) return;
    const img = item.querySelector('img');
    lightboxImg.src = img?.src || img?.dataset?.src || '';
    lightboxImg.alt = img?.alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    visibleItems = getVisibleItems();
    currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
    const item = visibleItems[currentIndex];
    const img = item?.querySelector('img');
    if (!img || !lightboxImg) return;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = img.src || img.dataset?.src || '';
      lightboxImg.style.opacity = '1';
    }, 150);
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      visibleItems = getVisibleItems();
      const visIdx = visibleItems.indexOf(item);
      openLightbox(visIdx >= 0 ? visIdx : 0);
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lightboxPrev?.addEventListener('click', () => navigate(-1));
  lightboxNext?.addEventListener('click', () => navigate(1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  lightboxImg.style.transition = 'opacity 0.15s';
});
