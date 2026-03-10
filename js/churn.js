/*
  churn.js – In‑browser Churn Prediction Demo

  This module demonstrates a simple binary classification model using
  TensorFlow.js. The model is a pre‑trained logistic regression that takes
  three input features: `sessions`, `daysInactive` and `supportTickets`. It
  outputs a probability of churn, which is then mapped to a qualitative
  description. The weights are arbitrarily chosen for demo purposes. On
  submit, the form results are processed and the prediction is shown.
*/

import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.9.0/dist/tf.min.js';

export function initChurnDemo() {
  const form = document.getElementById('churnForm');
  const resultEl = document.getElementById('churnResult');
  if (!form) return;
  // Predefined weights and bias for logistic regression
  const weights = tf.tensor([[-0.02], [0.05], [0.1]]); // sessions, daysInactive, tickets
  const bias = tf.tensor([0.0]);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const sessions = parseFloat(form.sessions.value) || 0;
    const daysInactive = parseFloat(form.daysInactive.value) || 0;
    const tickets = parseFloat(form.tickets.value) || 0;
    // Normalize features (rough scaling)
    const x = tf.tensor([[sessions / 10, daysInactive / 30, tickets / 5]]);
    const z = x.matMul(weights).add(bias);
    const pred = tf.sigmoid(z).dataSync()[0];
    let label;
    if (pred > 0.7) label = 'High';
    else if (pred > 0.4) label = 'Medium';
    else label = 'Low';
    resultEl.innerHTML = `<p>Churn Probability: ${(pred * 100).toFixed(1)}%</p><p>Risk Level: <strong>${label}</strong></p>`;
  });
}