/*
  nebula.js – Data Nebula Visualization

  This module renders an animated nebula on the canvas with id 'nebulaCanvas'.
  It uses a simple particle system where particles orbit around the center
  following sine and cosine waves, giving the illusion of swirling clouds of
  data. The colours gradually shift using Perlin noise approximated by
  continuously changing hue values. The animation is light enough to run
  smoothly on mobile devices and does not depend on any external libraries.
*/

export function initNebula() {
  const canvas = document.getElementById('nebulaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const particles = [];
  const count = 200;
  for (let i = 0; i < count; i++) {
    particles.push(createParticle(i));
  }

  function createParticle(i) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 0.4 + 0.2; // relative radius
    return {
      radius,
      angle,
      speed: 0.0005 + Math.random() * 0.0015,
      size: 1 + Math.random() * 2,
    };
  }

  let hueShift = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    hueShift = (hueShift + 0.15) % 360;
    particles.forEach(p => {
      p.angle += p.speed;
      const r = p.radius * Math.min(cx, cy);
      const x = cx + Math.cos(p.angle * 2) * r;
      const y = cy + Math.sin(p.angle * 3) * r;
      const hue = (hueShift + p.angle * 180 / Math.PI) % 360;
      ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.1)`;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}