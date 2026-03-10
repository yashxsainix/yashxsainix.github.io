/*
  wormhole.js – Quantum Wormhole Navigator

  Clicking the wormhole button transports the user to a random section of the
  site. To prevent disorientation, it avoids sending the user to the same
  section twice in a row by storing the previous section in localStorage.
*/

export function initWormhole() {
  const btn = document.getElementById('wormholeBtn');
  if (!btn) return;
  const targets = ['#hero', '#projects', '#case', '#experience', '#skills', '#education', '#contact'];
  btn.addEventListener('click', () => {
    let last = localStorage.getItem('wormholeLast');
    let target;
    do {
      target = targets[Math.floor(Math.random() * targets.length)];
    } while (target === last && targets.length > 1);
    localStorage.setItem('wormholeLast', target);
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  });
}