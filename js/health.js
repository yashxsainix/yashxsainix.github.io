// Data health scanner controller
export function initHealth() {
  const fileInput = document.getElementById('csvFile');
  const resultsEl = document.getElementById('health-results');
  let worker;

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    if (worker) worker.terminate();
    worker = new Worker('js/worker.js');
    worker.postMessage({ file });
    worker.onmessage = (e) => {
      const { summary } = e.data;
      resultsEl.innerHTML = `<p>Rows: ${summary.rowCount}</p>`;
      // Display missing values and stats
      const table = document.createElement('table');
      table.innerHTML = `<tr><th>Column</th><th>Missing</th><th>Mean</th><th>Outliers</th></tr>`;
      summary.columns.forEach((col) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${col.name}</td><td>${col.missing}</td><td>${col.mean.toFixed(2)}</td><td>${col.outliers}</td>`;
        table.appendChild(tr);
      });
      resultsEl.appendChild(table);
      worker.terminate();
    };
  });
}
