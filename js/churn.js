// Churn prediction demo
export function initChurn() {
  const form = document.getElementById('churn-form');
  const ctx = document.getElementById('churnChart').getContext('2d');
  let chart;
  // Logistic regression weights (example values)
  const weights = {
    bias: -3.5,
    tenure: -0.02,
    monthly: 0.03,
    contract: -0.5
  };
  function predict(tenure, monthly, contract) {
    const z = weights.bias + weights.tenure * tenure + weights.monthly * monthly + weights.contract * contract;
    return 1 / (1 + Math.exp(-z));
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const tenure = parseFloat(document.getElementById('tenure').value);
    const monthly = parseFloat(document.getElementById('monthly').value);
    const contract = parseInt(document.getElementById('contract').value);
    const p = predict(tenure, monthly, contract);
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Churn probability','Retention probability'],
        datasets: [{
          data: [p, 1 - p],
          backgroundColor: ['#ff6b35','#00ff88'],
          borderWidth: 1
        }]
      },
      options: { plugins: { legend: { position: 'bottom' } } }
    });
  });
}
