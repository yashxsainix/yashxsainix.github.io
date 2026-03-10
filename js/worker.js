globalThis.onmessage = (e) => {
  const { file } = e.data;
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: (results) => {
      const rows = results.data;
      if (!rows || rows.length === 0) {
        postMessage({ summary: { rowCount: 0, columns: [] } });
        return;
      }
      const columns = Object.keys(rows[0]);
      const summary = {
        rowCount: rows.length,
        columns: []
      };
      columns.forEach((col) => {
        const values = rows.map((r) => r[col]).filter((v) => v !== null && v !== undefined && v !== '');
        const missing = rows.length - values.length;
        const mean = values.reduce((a, b) => a + Number(b), 0) / (values.length || 1);
        // IQR for outlier detection
        const sorted = values.slice().sort((a,b) => a - b);
        const q1 = sorted[Math.floor(sorted.length / 4)];
        const q3 = sorted[Math.floor((sorted.length * 3) / 4)];
        const iqr = q3 - q1;
        const lower = q1 - 1.5 * iqr;
        const upper = q3 + 1.5 * iqr;
        const outliers = values.filter((v) => v < lower || v > upper).length;
        summary.columns.push({ name: col, missing, mean, outliers });
      });
      postMessage({ summary });
    }
  });
};
