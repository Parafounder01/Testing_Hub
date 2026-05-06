// ============================================
// FILE: assets/js/tts.js
// Text to Speech using Web Speech API
// ============================================

const TTS = {

  synth: window.speechSynthesis,
  utterance: null,
  isPlaying: false,
  currentRate: 0.8,

  // Initialize TTS
  init: function() {
    this.currentRate = parseFloat(localStorage.getItem('audio-speed')) || 0.8;
    this.setupControls();
  },

  // Speak text
  speak: function(text, lang = 'en-IN') {
    if (this.isPlaying) {
      this.stop();
      return;
    }

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = lang;
    this.utterance.rate = this.currentRate;
    this.utterance.pitch = 1;

    this.utterance.onstart = () => {
      this.isPlaying = true;
      this.updateButton('playing');
    };

    this.utterance.onend = () => {
      this.isPlaying = false;
      this.updateButton('stopped');
    };

    this.utterance.onerror = (e) => {
      console.error('TTS Error:', e);
      this.isPlaying = false;
      this.updateButton('stopped');
    };

    this.synth.speak(this.utterance);
  },

  // Stop speaking
  stop: function() {
    this.synth.cancel();
    this.isPlaying = false;
    this.updateButton('stopped');
  },

  // Pause/Resume (not supported in all browsers)
  pause: function() {
    if (this.synth.paused) {
      this.synth.resume();
    } else {
      this.synth.pause();
    }
  },

  // Set speech rate
  setRate: function(rate) {
    this.currentRate = rate;
    localStorage.setItem('audio-speed', rate);
    if (this.utterance && this.isPlaying) {
      this.stop();
      this.speak(this.utterance.text);
    }
  },

  // Setup TTS controls on page
  setupControls: function() {
    const speedSlider = document.getElementById('audio-speed');
    const speedValue = document.getElementById('speed-value');
    if (speedSlider) {
      speedSlider.value = this.currentRate;
      if (speedValue) speedValue.textContent = this.currentRate;
      speedSlider.addEventListener('input', (e) => {
        this.setRate(parseFloat(e.target.value));
        if (speedValue) speedValue.textContent = e.target.value;
      });
    }
  },

  // Update play button state
  updateButton: function(state) {
    const btn = document.getElementById('tts-play-btn');
    if (!btn) return;
    if (state === 'playing') {
      btn.textContent = '⏹ Stop';
      btn.setAttribute('aria-label', 'Stop reading');
    } else {
      btn.textContent = '▶ Play';
      btn.setAttribute('aria-label', 'Play text');
    }
  },

  // Read selected text or full content
  readPage: function() {
    const content = document.querySelector('.chapter-content') || document.querySelector('main');
    if (content) {
      this.speak(content.innerText);
    }
  }

};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => TTS.init());
