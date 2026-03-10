import { initStarfield } from './starfield.js';
import { initSearch } from './search.js';
import { initVoice } from './voice.js';
import { initChurn } from './churn.js';
import { initHealth } from './health.js';
import { initPipeline } from './pipeline.js';

// Register the service worker for offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch((err) => console.error(err));
}

window.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initSearch();
  initVoice();
  initChurn();
  initHealth();
  initPipeline();

  // Load projects and render cards
  fetch('data/projects.json').then((res) => res.json()).then(renderProjects);
});

function renderProjects(projects) {
  const list = document.getElementById('project-list');
  const rec = document.getElementById('recommendations');
  projects.forEach((p) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<h4>${p.name}</h4><p>${p.description}</p><p><strong>Impact:</strong> ${p.impact}</p>`;
    list.appendChild(card);
  });
  // Personalisation: compute recommended projects
  const interactions = JSON.parse(localStorage.getItem('interactions') || '{}');
  const userVector = {};
  Object.keys(interactions).forEach((tag) => {
    userVector[tag] = interactions[tag];
  });
  // compute cosine similarity
  function cosine(u, v) {
    let dot = 0, du = 0, dv = 0;
    Object.keys(v).forEach((t) => {
      const a = u[t] || 0;
      const b = v[t] || 0;
      dot += a * b;
      du += a * a;
      dv += b * b;
    });
    return dot / (Math.sqrt(du) * Math.sqrt(dv) || 1);
  }
  const scores = projects.map((p) => ({ p, score: cosine(userVector, p.tags.reduce((obj,t) => { obj[t] = 1; return obj; }, {})) }));
  scores.sort((a,b) => b.score - a.score);
  const recs = scores.slice(0,3).map((s) => s.p);
  rec.innerHTML = '<h4>You might also like</h4>';
  recs.forEach((p) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `<h5>${p.name}</h5><p>${p.description}</p>`;
    rec.appendChild(div);
  });
}
