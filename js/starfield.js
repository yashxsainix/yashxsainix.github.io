// Cosmic star‑field rendering
export function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  const numStars = 200;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // reposition stars
    stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.2 + Math.random() * 0.3,
        size: 0.5 + Math.random() * 1.5
      });
    }
  }

  function getColors() {
    const hour = new Date().getHours();
    // dawn: 6–18 lighten colours; night: dark colours
    return hour >= 6 && hour < 18
      ? ['#00d4ff', '#00ff88']
      : ['#c77dff', '#00ff88'];
  }

  function draw() {
    const [c1, c2] = getColors();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const star of stars) {
      ctx.fillStyle = Math.random() > 0.5 ? c1 : c2;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize();
  draw();
}
