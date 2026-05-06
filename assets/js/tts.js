// Professor EasyBot - Text to Speech (TTS) Module
// From prompt_setting.md - Web Speech API

let currentSpeech = null;
let lastSpokenText = '';
let isPaused = false;

// Initialize speech synthesis
function speakText(text) {
  // Stop any current speech
  window.speechSynthesis.cancel();
  
  if (!text || text.trim() === '') {
    console.log('No text to speak');
    return;
  }
  
  // Store last spoken text for repeat function
  lastSpokenText = text;
  
  // Create speech utterance
  const speech = new SpeechSynthesisUtterance(text);
  speech.rate = 0.8;   // Slow speed for slow learner
  speech.pitch = 1;
  speech.lang = 'en-IN'; // Indian English
  speech.volume = 1;
  
  // Store reference
  currentSpeech = speech;
  isPaused = false;
  
  // Speak
  window.speechSynthesis.speak(speech);
  
  // Update button states
  updateAudioButtons('speaking');
  
  // When done
  speech.onend = function() {
    updateAudioButtons('stopped');
  };
  
  speech.onerror = function(event) {
    console.log('Speech error:', event.error);
    updateAudioButtons('stopped');
  };
}

// Listen button - speak the main content of the page
function listenToContent() {
  const contentDiv = document.getElementById('chapter-content');
  if (!contentDiv) {
    console.log('No chapter-content found');
    return;
  }
  
  const text = contentDiv.innerText || contentDiv.textContent;
  speakText(text);
}

// Pause button
function pauseAudio() {
  if (window.speechSynthesis.speaking && !isPaused) {
    window.speechSynthesis.pause();
    isPaused = true;
    updateAudioButtons('paused');
  } else if (isPaused) {
    window.speechSynthesis.resume();
    isPaused = false;
    updateAudioButtons('speaking');
  }
}

// Repeat button - repeat last point
function repeatAudio() {
  if (lastSpokenText) {
    speakText(lastSpokenText);
  } else {
    listenToContent();
  }
}

// Show/Hide notes
function toggleNotes() {
  const notesDiv = document.getElementById('notes');
  if (notesDiv) {
    notesDiv.classList.toggle('show');
    const btn = document.getElementById('notes-btn');
    if (btn) {
      if (notesDiv.classList.contains('show')) {
        btn.textContent = '📝 HIDE NOTES';
      } else {
        btn.textContent = '📝 NOTES';
      }
    }
  }
}

// Update button states
function updateAudioButtons(state) {
  const listenBtn = document.getElementById('listen-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const repeatBtn = document.getElementById('repeat-btn');
  
  if (listenBtn) {
    if (state === 'speaking') {
      listenBtn.textContent = '🔊 SPEAKING...';
      listenBtn.disabled = true;
    } else {
      listenBtn.textContent = '🔊 LISTEN';
      listenBtn.disabled = false;
    }
  }
  
  if (pauseBtn) {
    if (state === 'speaking') {
      pauseBtn.textContent = '⏸️ PAUSE';
    } else if (state === 'paused') {
      pauseBtn.textContent = '▶️ RESUME';
    } else {
      pauseBtn.textContent = '⏸️ PAUSE';
    }
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Check if browser supports speech synthesis
  if (!window.speechSynthesis) {
    alert('Sorry, your browser does not support Text-to-Speech. Try Chrome or Edge.');
    return;
  }
  
  // Attach button events
  const listenBtn = document.getElementById('listen-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const repeatBtn = document.getElementById('repeat-btn');
  const notesBtn = document.getElementById('notes-btn');
  
  if (listenBtn) {
    listenBtn.addEventListener('click', listenToContent);
  }
  
  if (pauseBtn) {
    pauseBtn.addEventListener('click', pauseAudio);
  }
  
  if (repeatBtn) {
    repeatBtn.addEventListener('click', repeatAudio);
  }
  
  if (notesBtn) {
    notesBtn.addEventListener('click', toggleNotes);
  }
  
  // Stop speech when leaving page
  window.addEventListener('beforeunload', function() {
    window.speechSynthesis.cancel();
  });
});
