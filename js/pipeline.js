// Gamified ETL pipeline builder
export function initPipeline() {
  const container = document.getElementById('pipeline-steps');
  const feedback = document.getElementById('pipeline-feedback');
  const steps = ['Extract','Transform','Load','Model','Visualize'];
  // Create draggable elements
  steps.forEach((step) => {
    const div = document.createElement('div');
    div.classList.add('step');
    div.textContent = step;
    container.appendChild(div);
  });
  // Make steps draggable
  interact('.step').draggable({
    listeners: {
      move (event) {
        event.target.style.transform = `translate(${event.dx}px, ${event.dy}px)`;
      },
      end () {
        // Reset position after drag
        this.target.style.transform = 'translate(0,0)';
      }
    }
  });
  // Sortable via drop zone
  interact('#pipeline-steps').dropzone({
    accept: '.step',
    ondrop (event) {
      const zone = event.target;
      zone.appendChild(event.relatedTarget);
    }
  });
  document.getElementById('submit-pipeline').addEventListener('click', () => {
    const placed = Array.from(container.children).map((c) => c.textContent);
    const correct = steps.join(',') === placed.join(',');
    feedback.textContent = correct ? 'Perfect pipeline! ⭐️' : 'Try again – remember ETL comes before modelling!';
  });
}
