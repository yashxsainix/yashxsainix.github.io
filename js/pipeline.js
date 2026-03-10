/*
  pipeline.js – ETL Pipeline Builder Game

  This module uses Interact.js to create a simple drag‑and‑drop game where
  users build a data pipeline by dragging nodes (source, transform, load)
  into a workspace. Each successful drop increments a score and highlights
  the assembled pipeline. This gamified demo illustrates the user's
  understanding of ETL workflows and adds an engaging interactive element.
*/

export function initPipelineGame() {
  // Check if Interact.js is loaded
  if (typeof interact === 'undefined') {
    console.error('Interact.js not loaded');
    return;
  }
  const scoreEl = document.getElementById('pipelineScore');
  const workspace = document.getElementById('pipelineWorkspace');
  if (!workspace) return;
  let score = 0;
  function updateScore() {
    scoreEl.textContent = `Score: ${score}`;
  }
  updateScore();
  // Draggable nodes
  interact('.pipeline-node').draggable({
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({ restriction: 'parent', endOnly: true }),
    ],
    autoScroll: true,
    listeners: {
      move(event) {
        const target = event.target;
        // Keep the dragged position in the dataset
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        // Translate the element
        target.style.transform = `translate(${x}px, ${y}px)`;
        // Update position attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },
    },
  });
  // Dropzone on workspace
  interact('#pipelineWorkspace').dropzone({
    accept: '.pipeline-node',
    overlap: 0.5,
    ondrop(event) {
      score += 10;
      updateScore();
      // Reset node position and optionally remove
      const node = event.relatedTarget;
      node.style.opacity = '0.5';
      node.classList.add('dropped');
    },
  });
}