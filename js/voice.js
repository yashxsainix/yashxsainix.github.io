// Voice search using Web Speech API
export function initVoice() {
  const micBtn = document.getElementById('micBtn');
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    micBtn.style.display = 'none';
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  micBtn.addEventListener('click', () => {
    recognition.start();
    if (navigator.vibrate) navigator.vibrate(50);
  });

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    // Map voice commands to section IDs
    const mapping = {
      home: 'hero',
      projects: 'projects',
      demos: 'demos',
      skills: 'skills',
      contact: 'contact'
    };
    Object.keys(mapping).forEach((key) => {
      if (command.includes(key)) {
        document.getElementById(mapping[key]).scrollIntoView({ behavior: 'smooth' });
      }
    });
  };
  recognition.onerror = () => {
    console.log('Voice recognition error');
  };
}
