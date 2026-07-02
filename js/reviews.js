/* =============================================
   COFFEE HUB BARDOLI — Reviews & Slider
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  /* --- Slider --- */
  const track = document.getElementById('slider-track');
  const slides = track?.querySelectorAll('.slider-slide');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dotsWrap = document.getElementById('slider-dots');

  if (track && slides?.length) {
    let current = 0;
    let autoPlay;

    /* Create dots */
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Review ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap?.appendChild(dot);
    });

    function updateDots() {
      dotsWrap?.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      updateDots();
    }

    prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    function resetAuto() { clearInterval(autoPlay); autoPlay = setInterval(() => goTo(current + 1), 5000); }
    resetAuto();

    /* Swipe support */
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); resetAuto(); }
    });
  }

  /* --- Review Submission Form --- */
  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = reviewForm.querySelector('[name="reviewer-name"]')?.value?.trim();
      const text = reviewForm.querySelector('[name="review-text"]')?.value?.trim();
      const ratingInput = reviewForm.querySelector('[name="rating"]:checked');

      if (!name) { showToast('Please enter your name.', 'error'); return; }
      if (!ratingInput) { showToast('Please select a star rating.', 'error'); return; }
      if (!text || text.length < 10) { showToast('Please write at least 10 characters.', 'error'); return; }

      showToast('Thank you! Your review has been submitted.');
      reviewForm.reset();
    });
  }
});

