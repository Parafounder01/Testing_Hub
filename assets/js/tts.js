// ============================================
// FILE: assets/js/tts.js
// Text to Speech using Web Speech API with Tanglish Support
// ============================================

const TTS = {

  synth: window.speechSynthesis,
  utterance: null,
  isPlaying: false,
  currentRate: 0.8,
  currentLang: 'en-IN', // Default: English India
  tanglishMode: false,

  // Initialize TTS with Tanglish support
  init: function() {
    this.currentRate = parseFloat(localStorage.getItem('audio-speed')) || 0.8;
    this.currentLang = localStorage.getItem('tts-language') || 'en-IN';
    this.tanglishMode = localStorage.getItem('tanglish-mode') === 'true';
    this.setupControls();
    this.detectTamilContent(); // Auto-detect Tamil content
  },

  // Detect Tamil content & switch to Tanglish mode
  detectTamilContent: function() {
    const content = document.querySelector('.chapter-content') || document.querySelector('main');
    if (content && content.innerText.match(/[\u0B80-\u0BFF]/)) {
      this.currentLang = 'ta-IN'; // Switch to Tamil India
      this.tanglishMode = true;
      console.log("🔊 Tamil content detected - Switching to Tanglish mode");
    }
  },

  // Speak text with Tanglish support
  speak: function(text, lang = this.currentLang) {
    if (this.isPlaying) {
      this.stop();
      return;
    }

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = lang;
    this.utterance.rate = this.currentRate;
    this.utterance.pitch = 1;

    // Tamil pronunciation fixes for technical terms
    if (lang === 'ta-IN' || this.tanglishMode) {
      this.utterance.text = this.fixTamilTechTerms(text);
    }

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

  // Fix Tamil pronunciation of technical terms
  fixTamilTechTerms: function(text) {
    const fixes = {
      'microwave': 'மைக்ரோவேவ்',
      'transistor': 'ட்ரான்சிஸ்டர்',
      'diode': 'டையோட்',
      'circuit': 'சர்க்யூட்',
      'amplifier': 'ஆம்பிளையர்',
      'oscillator': 'ஆஸிலேட்டர்',
      'voltage': 'வோல்டேஜ்',
      'current': 'கரண்ட்',
      'resistor': 'ரெசிஸ்டர்',
      'capacitor': 'கொப்பாசிடர்',
      'inductor': 'இன்டக்டர்',
      'frequency': 'ஃிரீகுவென்சி',
      'wavelength': 'அலைவேவ் லென்த்',
      'impedance': 'இம்பிடன்ஸ்'
    };
    let fixedText = text;
    for (let [en, ta] of Object.entries(fixes)) {
      fixedText = fixedText.replace(new RegExp(en, 'gi'), ta);
    }
    return fixedText;
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

  // Toggle Tanglish mode
  toggleTanglish: function() {
    this.tanglishMode = !this.tanglishMode;
    this.currentLang = this.tanglishMode ? 'ta-IN' : 'en-IN';
    localStorage.setItem('tts-language', this.currentLang);
    localStorage.setItem('tanglish-mode', this.tanglishMode);
    alert(`🔊 TTS Language: ${this.currentLang} (${this.tanglishMode ? 'Tanglish Mode' : 'English Mode'})`);
  },

  // Setup TTS controls
  setupControls: function() {
    const speedSlider = document.getElementById('audio-speed');
    const speedValue = document.getElementById('speed-value');
    const tanglishBtn = document.getElementById('tanglish-btn');

    if (speedSlider) {
      speedSlider.value = this.currentRate;
      if (speedValue) speedValue.textContent = this.currentRate;
      speedSlider.addEventListener('input', (e) => {
        this.setRate(parseFloat(e.target.value));
        if (speedValue) speedValue.textContent = e.target.value;
      });
    }

    if (tanglishBtn) {
      tanglishBtn.addEventListener('click', () => this.toggleTanglish());
      tanglishBtn.textContent = this.tanglishMode ? '🔊 Tanglish ON' : '🔊 Tanglish OFF';
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
      btn.textContent = `▶ Play (${this.tanglishMode ? 'Tanglish' : 'English'})`;
      btn.setAttribute('aria-label', `Play text with ${this.tanglishMode ? 'Tanglish' : 'English'} support`);
    }
  },

  // Read page with auto-detection
  readPage: function() {
    const content = document.querySelector('.chapter-content') || document.querySelector('main');
    if (content) {
      this.detectTamilContent(); // Auto-detect before speaking
      this.speak(content.innerText);
    }
  }

};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => TTS.init());
