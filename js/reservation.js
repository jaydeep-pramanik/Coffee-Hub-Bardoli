/* =============================================
   COFFEE HUB BARDOLI — Reservation Form
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservation-form');
  if (!form) return;

  /* Validation rules */
  const rules = {
    name: { required: true, minLen: 2, label: 'Full name' },
    phone: { required: true, pattern: /^[+]?[\d\s\-]{7,15}$/, label: 'Phone number' },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: 'Email' },
    guests: { required: true, label: 'Number of guests' },
    date: { required: true, label: 'Date', futureDate: true },
    time: { required: true, label: 'Time' },
  };

  function getField(name) { return form.querySelector(`[name="${name}"]`); }
  function getError(name) { return form.querySelector(`#error-${name}`); }

  function setError(name, msg) {
    const field = getField(name);
    const err = getError(name);
    field?.classList.toggle('error', !!msg);
    if (err) err.textContent = msg || '';
  }

  function validateField(name) {
    const rule = rules[name];
    if (!rule) return true;
    const field = getField(name);
    const value = field?.value?.trim() || '';

    if (rule.required && !value) { setError(name, `${rule.label} is required.`); return false; }
    if (rule.minLen && value.length < rule.minLen) { setError(name, `${rule.label} must be at least ${rule.minLen} characters.`); return false; }
    if (rule.pattern && !rule.pattern.test(value)) { setError(name, `Please enter a valid ${rule.label.toLowerCase()}.`); return false; }
    if (rule.futureDate) {
      const selected = new Date(value);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (selected < today) { setError(name, 'Please select today or a future date.'); return false; }
    }
    setError(name, '');
    return true;
  }

  /* Set min date to today */
  const dateInput = getField('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  /* Live validation */
  Object.keys(rules).forEach(name => {
    getField(name)?.addEventListener('blur', () => validateField(name));
    getField(name)?.addEventListener('input', () => {
      if (getError(name)?.textContent) validateField(name);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = Object.keys(rules).map(validateField).every(Boolean);
    if (!valid) return;
    const btn = form.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Booking...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.disabled = false;
      form.reset();
      showToast('Your table has been reserved! We will confirm via SMS.');
      document.getElementById('success-modal')?.classList.add('open');
    }, 1200);
  });

  /* Success modal close */
  document.getElementById('modal-close')?.addEventListener('click', () => {
    document.getElementById('success-modal')?.classList.remove('open');
  });
});
