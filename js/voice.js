/*
  voice.js – Voice Navigation with Web Speech API

  This module enables basic voice control for navigation using the browser's
  SpeechRecognition interface. When invoked, it listens for keywords like
  "projects", "case study", "work experience" etc. and scrolls smoothly to
  the corresponding section. It also supports a generic search command
  beginning with the word "search" to open the search modal. Voice
  recognition works in Chrome and some variants; fallback gracefully on
  unsupported browsers.
*/

export function initVoice() {
  const startBtn = document.getElementById('voiceBtn');
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    // Hide button if not supported
    startBtn.style.display = 'none';
    return;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let listening = false;

  function startListening() {
    if (listening) {
      recognition.stop();
      listening = false;
      startBtn.classList.remove('active');
    } else {
      recognition.start();
      listening = true;
      startBtn.classList.add('active');
    }
  }

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript.toLowerCase();
    console.log('Voice command:', transcript);
    recognition.stop();
    listening = false;
    startBtn.classList.remove('active');
    handleCommand(transcript);
  };
  recognition.onerror = function () {
    listening = false;
    startBtn.classList.remove('active');
  };
  startBtn.addEventListener('click', startListening);

  function handleCommand(cmd) {
    // search command
    if (cmd.startsWith('search')) {
      const query = cmd.replace('search', '').trim();
      document.getElementById('searchBtn').click();
      setTimeout(() => {
        document.getElementById('searchInput').value = query;
        const ev = new Event('input');
        document.getElementById('searchInput').dispatchEvent(ev);
      }, 300);
      return;
    }
    const sections = {
      projects: '#projects',
      project: '#projects',
      case: '#case',
      study: '#case',
      experience: '#experience',
      work: '#experience',
      skills: '#skills',
      education: '#education',
      contact: '#contact',
    };
    for (const key in sections) {
      if (cmd.includes(key)) {
        const target = document.querySelector(sections[key]);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
    }
    // fallback: search entire page if unknown command
  }
}