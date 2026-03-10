// Search index using Lunr.js
export function initSearch() {
  const modal = document.getElementById('searchModal');
  const input = document.getElementById('searchInput');
  const resultsEl = document.getElementById('searchResults');
  let idx;
  let docs;

  fetch('data/projects.json')
    .then((res) => res.json())
    .then((projects) => {
      // Build documents array: sections and projects
      docs = [
        { id: 'hero', title: 'Home', content: 'Welcome to my data‑driven multiverse' },
        { id: 'projects', title: 'Projects', content: 'Selected projects' },
        { id: 'demos', title: 'Demos', content: 'Interactive demos' },
        { id: 'skills', title: 'Skills', content: 'Skills and experience' },
        { id: 'contact', title: 'Contact', content: 'Contact information' },
        ...projects.map((p, i) => ({ id: 'proj-' + i, title: p.name, content: p.description }))
      ];
      idx = lunr(function () {
      // eslint-disable-next-line no-invalid-this
        this.ref('id');
        this.field('title');
        this.field('content');
        docs.forEach((doc) => this.add(doc));
      });
    });

  function openSearch() {
    modal.setAttribute('aria-hidden', 'false');
    input.value = '';
    resultsEl.innerHTML = '';
    input.focus();
  }
  function closeSearch() {
    modal.setAttribute('aria-hidden', 'true');
  }
  document.getElementById('searchBtn').addEventListener('click', openSearch);
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeSearch();
  });
  input.addEventListener('input', () => {
    const query = input.value;
    resultsEl.innerHTML = '';
    if (!idx || !query) return;
    const res = idx.search(query);
    res.forEach((r) => {
      const item = docs.find((d) => d.id === r.ref);
      const li = document.createElement('li');
      li.textContent = item.title;
      li.addEventListener('click', () => {
        closeSearch();
        if (item.id.startsWith('proj-')) {
          // scroll to project list and highlight
          document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        } else {
          document.getElementById(item.id).scrollIntoView({ behavior: 'smooth' });
        }
      });
      resultsEl.appendChild(li);
    });
  });
}
