/* =============================================
   COFFEE HUB BARDOLI — Menu Filter & Search
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.menu-card');
  const searchInput = document.getElementById('menu-search');
  const emptyState = document.getElementById('menu-empty');
  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visible = 0;
    cards.forEach(card => {
      const category = card.dataset.category || '';
      const name = (card.querySelector('.menu-card-name')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.menu-card-desc')?.textContent || '').toLowerCase();
      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = !searchQuery || name.includes(searchQuery) || desc.includes(searchQuery);
      const show = matchesCategory && matchesSearch;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (emptyState) emptyState.style.display = visible === 0 ? 'block' : 'none';
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      applyFilters();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    applyFilters();
  });
});
