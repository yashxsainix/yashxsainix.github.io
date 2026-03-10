/*
  starfield.js – Cosmic Starfield Background

  This module draws a starfield on a canvas element with id 'starfieldCanvas'.
  The star colours smoothly change based on the time of day (morning, afternoon,
  evening) using the browser's current time. Each star drifts slowly across
  the canvas to create a sense of depth. The animation runs on every frame
  using requestAnimationFrame. The canvas automatically resizes when the
  window size changes.
*/

export function initStarfield() {
  const canvas = document.getElementById('starfieldCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Resize canvas to fill window
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Generate star objects
  const starCount = Math.floor((window.innerWidth + window.innerHeight) / 10);
  const stars = [];
  for (let i = 0; i < starCount; i++) {
    stars.push(createStar());
  }

  function createStar() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.3,
      speedX: (Math.random() - 0.5) * 0.05,
      speedY: (Math.random() - 0.5) * 0.05,
    };
  }

  // Determine star colour based on time of day
  function getStarColor() {
    const hour = new Date().getHours();
    if (hour < 6 || hour >= 20) {
      // Night
      return 'rgba(0, 255, 136, 0.8)';
    } else if (hour < 12) {
      // Morning – more cyan
      return 'rgba(0, 212, 255, 0.8)';
    } else if (hour < 17) {
      // Afternoon – mix of green and cyan
      return 'rgba(0, 255, 180, 0.8)';
    }
    // Evening
    return 'rgba(0, 255, 136, 0.8)';
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const colour = getStarColor();
    stars.forEach(star => {
      ctx.fillStyle = colour;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
      // Move star
      star.x += star.speedX;
      star.y += star.speedY;
      // Wrap around edges
      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;
    });
    requestAnimationFrame(animate);
  }
  animate();
}