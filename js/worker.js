/*
  worker.js – Data Health Worker

  This worker receives an array of objects representing parsed CSV rows. It
  identifies numeric columns, computes summary statistics (mean, min, max,
  standard deviation) and flags outlier values using the Z‑score (>3) rule.
  The results are posted back to the main thread. Using a web worker
  prevents heavy computations from blocking the UI.
*/

self.addEventListener('message', (e) => {
  const data = e.data;
  if (!Array.isArray(data)) return;
  const columns = {};
  // Identify numeric columns
  data.forEach(row => {
    Object.keys(row).forEach(key => {
      const value = row[key];
      if (typeof value === 'number' && !isNaN(value)) {
        if (!columns[key]) columns[key] = [];
        columns[key].push(value);
      }
    });
  });
  const summary = {};
  const outliers = [];
  Object.keys(columns).forEach(col => {
    const values = columns[col];
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    const std = Math.sqrt(variance);
    const min = Math.min(...values);
    const max = Math.max(...values);
    summary[col] = { mean, min, max };
    values.forEach(val => {
      const z = std === 0 ? 0 : (val - mean) / std;
      if (Math.abs(z) > 3) {
        outliers.push({ column: col, value: val });
      }
    });
  });
  self.postMessage({ summary, outliers });
});