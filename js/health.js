/*
  health.js – Data Health Scanner

  This module provides a client‑side data quality check for CSV files. It uses
  PapaParse (loaded via CDN in the HTML) to parse the uploaded CSV and offloads
  the statistical analysis to a Web Worker (`worker.js`) to avoid blocking
  the UI. The analysis computes basic summary statistics and detects
  outliers using the Z‑score method. Results are rendered in a simple table.
*/

export function initHealthScanner() {
  const input = document.getElementById('csvInput');
  const table = document.getElementById('healthTable');
  const summaryEl = document.getElementById('healthSummary');
  if (!input) return;
  const worker = new Worker('js/worker.js');
  worker.addEventListener('message', (e) => {
    const { summary, outliers } = e.data;
    // Display summary
    summaryEl.innerHTML = '';
    for (const key in summary) {
      const p = document.createElement('p');
      const { mean, min, max } = summary[key];
      p.textContent = `${key}: mean=${mean.toFixed(2)}, min=${min.toFixed(2)}, max=${max.toFixed(2)}`;
      summaryEl.appendChild(p);
    }
    // Display outliers
    table.innerHTML = '';
    if (outliers.length === 0) {
      table.innerHTML = '<tr><td colspan="2">No outliers detected.</td></tr>';
      return;
    }
    outliers.forEach(item => {
      const row = document.createElement('tr');
      const cell1 = document.createElement('td');
      cell1.textContent = item.column;
      const cell2 = document.createElement('td');
      cell2.textContent = item.value;
      row.appendChild(cell1);
      row.appendChild(cell2);
      table.appendChild(row);
    });
  });
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: function (results) {
        worker.postMessage(results.data);
      },
    });
  });
}