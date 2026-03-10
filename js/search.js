/*
  search.js – Client‑side Search with Lunr.js

  This module builds a search index from a list of projects and content
  sections and provides a simple search UI via a modal. The search
  functionality uses Lunr.js, which must be loaded in the page via CDN.
  When the user submits a search query, matching results are displayed
  dynamically. The modal can be closed with the Escape key.
*/

export function initSearch(projects) {
  // Wait for Lunr script to load
  if (typeof lunr === 'undefined') {
    console.error('Lunr.js is not loaded');
    return;
  }
  // Build search index
  const idx = lunr(function () {
    this.ref('id');
    this.field('title');
    this.field('description');
    this.field('tags');
    projects.forEach((proj, i) => {
      this.add({ id: i.toString(), ...proj });
    });
  });
  const modal = document.getElementById('searchModal');
  const input = document.getElementById('searchInput');
  const resultsEl = document.getElementById('searchResults');
  const closeBtn = modal.querySelector('.close-btn');
  function openModal() {
    modal.classList.add('show');
    input.value = '';
    resultsEl.innerHTML = '';
    input.focus();
  }
  function closeModal() {
    modal.classList.remove('show');
  }
  // Search handler
  function performSearch(q) {
    resultsEl.innerHTML = '';
    if (!q) return;
    const results = idx.search(q);
    if (results.length === 0) {
      resultsEl.innerHTML = '<p>No results found.</p>';
      return;
    }
    results.forEach(res => {
      const item = projects[parseInt(res.ref)];
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.innerHTML = `<strong>${item.title}</strong><p>${item.description.substring(0, 100)}...</p>`;
      div.addEventListener('click', () => {
        // Scroll to the project card
        const card = document.querySelector(`[data-proj-id="${res.ref}"]`);
        if (card) {
          closeModal();
          card.scrollIntoView({ behavior: 'smooth' });
          card.classList.add('highlight');
          setTimeout(() => card.classList.remove('highlight'), 1000);
        }
      });
      resultsEl.appendChild(div);
    });
  }
  // Event listeners
  document.getElementById('searchBtn').addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
  input.addEventListener('input', e => performSearch(e.target.value));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
  });
}