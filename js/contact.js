/* =============================================
   COFFEE HUB BARDOLI — Contact Form
   ============================================= */

document.getElementById('contact-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  showToast('Message sent! We will get back to you within 24 hours.');
  this.reset();
});
