# Yash Saini – Cosmic Data Portfolio

This repository contains a fully client‑side portfolio site for **Yash Saini**, a data analyst and BI engineer. The goal of this project is to push the boundaries of a traditional portfolio by blending data storytelling with sci‑fi inspired visuals and interactive demos. It is built to run on GitHub Pages with no server‑side code.

## Features

* **Adaptive Starfield and Nebula Backgrounds** – animated canvases that create a cosmic ambience. Colours change throughout the day.
* **Sticky Navigation with Search and Voice** – quick access to sections, full‑text search powered by Lunr.js and voice commands for hands‑free navigation.
* **Wormhole Navigator** – a fun button that teleports you to random sections, seeded by device entropy.
* **Dynamic Projects** – project data lives in `data/projects.json` and is rendered on page load. Easily add or modify projects without editing HTML.
* **Interactive Demos** – try a client‑side churn predictor (TensorFlow.js), upload a CSV to scan for data quality issues (PapaParse + Web Worker), and build an ETL pipeline with drag‑and‑drop (Interact.js).
* **PWA Offline Support** – service worker caches the site shell for offline viewing.
* **Responsive Design** – crafted with CSS Grid and Flexbox to look sharp across devices. A small CSS footprint keeps performance high.

## Running Locally

1. Clone the repository or download the zipped folder.
2. Serve the files with any static HTTP server (e.g. Python `http.server`):

   ```bash
   cd portfolio_transcend
   python3 -m http.server 8000
   ```

3. Open `http://localhost:8000` in your browser.

## Deployment

To deploy on GitHub Pages:

1. Create a new repository named `yashxsainix.github.io` (or use your existing one).
2. Copy the contents of this folder (not the folder itself) into the repository root.
3. Commit and push the changes. GitHub Pages will automatically publish the site.

## Customising

* **Add Projects** – edit `data/projects.json` and update the array with your own project metadata.
* **Colours & Fonts** – adjust the CSS variables in `css/styles.css` to refine the theme.
* **Demos** – modify or extend `js/churn.js`, `js/health.js`, and `js/pipeline.js` to showcase your own data solutions.

## Licence

This project is open source under the MIT licence.