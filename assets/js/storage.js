// ============================================
// FILE: assets/js/storage.js
// ============================================

const APP_STORAGE = {

  // ✅ SAVE Student Progress
  saveProgress: function(subject, chapter, percent) {
    const data = {
      subject: subject,
      chapter: chapter,
      percent: percent,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    };
    localStorage.setItem(
      `progress_${subject}_chap${chapter}`,
      JSON.stringify(data)
    );
    console.log("✅ Progress Saved!");
  },

  // ✅ LOAD Student Progress
  loadProgress: function(subject, chapter) {
    const saved = localStorage.getItem(
      `progress_${subject}_chap${chapter}`
    );
    return saved ? JSON.parse(saved) : null;
  },

  // ✅ SAVE Student Notes
  saveNote: function(subject, chapter, noteText) {
    const note = {
      text: noteText,
      subject: subject,
      chapter: chapter,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(
      `note_${subject}_chap${chapter}`,
      JSON.stringify(note)
    );
    alert("📝 Note Saved Successfully!");
  },

  // ✅ LOAD Notes
  loadNote: function(subject, chapter) {
    const note = localStorage.getItem(
      `note_${subject}_chap${chapter}`
    );
    return note ? JSON.parse(note) : "";
  },

  // ✅ SAVE Quiz Score
  saveQuizScore: function(subject, chapter, score, total) {
    const result = {
      score: score,
      total: total,
      percent: Math.round((score/total)*100),
      passed: score >= (total * 0.6),
      date: new Date().toLocaleDateString()
    };
    localStorage.setItem(
      `quiz_${subject}_chap${chapter}`,
      JSON.stringify(result)
    );
  },

  // ✅ SAVE App Settings
  saveSettings: function(settings) {
    localStorage.setItem(
      'app_settings',
      JSON.stringify(settings)
    );
  },

  // ✅ LOAD App Settings
  loadSettings: function() {
    const defaults = {
      fontSize: "20px",
      theme: "light",
      speechRate: 0.8,
      language: "en-IN",
      font: "OpenDyslexic"
    };
    const saved = localStorage.getItem('app_settings');
    return saved ? JSON.parse(saved) : defaults;
  },

  // ✅ CLEAR All Data (Reset App)
  clearAll: function() {
    if(confirm("⚠️ Clear ALL data? This cannot be undone!")) {
      localStorage.clear();
      alert("🗑️ All data cleared!");
      location.reload();
    }
  },

  // ✅ EXPORT All Data (Download as JSON)
  exportData: function() {
    const allData = {};
    for(let key in localStorage) {
      if(localStorage.hasOwnProperty(key)) {
        allData[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob(
      [JSON.stringify(allData, null, 2)],
      {type: 'application/json'}
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amie-ece-progress-backup.json';
    a.click();
    alert("📥 Data Exported Successfully!");
  },

  // ✅ IMPORT Data (Upload JSON)
  importData: function(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const data = JSON.parse(e.target.result);
      for(let key in data) {
        localStorage.setItem(key, data[key]);
      }
      alert("📤 Data Imported Successfully!");
      location.reload();
    };
    reader.readAsText(file);
  }

};
