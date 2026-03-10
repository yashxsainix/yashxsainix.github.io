/*
  app.js – Main Application Logic

  This file ties together all modules: starfield and nebula backgrounds,
  navigation search, voice commands, wormhole navigation, churn demo, data
  health scanner, pipeline game, and project rendering. It fetches project
  metadata from a JSON file and populates the projects section dynamically.
  It also registers a service worker for PWA support.
*/

import { initStarfield } from './starfield.js';
import { initNebula } from './nebula.js';
import { initSearch } from './search.js';
import { initVoice } from './voice.js';
import { initWormhole } from './wormhole.js';
import { initChurnDemo } from './churn.js';
import { initHealthScanner } from './health.js';
import { initPipelineGame } from './pipeline.js';

// Render projects from JSON
async function renderProjects() {
  const res = await fetch('data/projects.json');
  const projects = await res.json();
  const container = document.getElementById('projectsContainer');
  projects.forEach((proj, idx) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.projId = idx.toString();
    card.innerHTML = `
      <div class="content">
        <div class="title">${proj.title}</div>
        <div class="description">${proj.description}</div>
        <div class="tags">${proj.tags.map(t => `<span>${t}</span>`).join('')}</div>
        <a href="${proj.link}" class="more-link" target="_blank">View on GitHub →</a>
      </div>
    `;
    container.appendChild(card);
  });
  // Initialise search now that projects are loaded
  initSearch(projects);
}

// Register service worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.warn('Service worker registration failed', err));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initNebula();
  renderProjects();
  initVoice();
  initWormhole();
  initChurnDemo();
  initHealthScanner();
  initPipelineGame();
  registerServiceWorker();
});