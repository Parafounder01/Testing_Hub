// Professor EasyBot - Main App Module
// Navigation, progress tracking, LocalStorage

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  updateOverallProgress();
  setupNavigation();
});

// Update overall progress from LocalStorage
function updateOverallProgress() {
  const progress = getOverallProgress();
  const progressFill = document.getElementById('overall-progress');
  const progressText = document.getElementById('progress-text');
  
  if (progressFill) {
    const percent = (progress.completed / progress.total) * 100;
    progressFill.style.width = percent + '%';
  }
  
  if (progressText) {
    progressText.textContent = `${progress.completed} out of ${progress.total} chapters completed`;
  }
}

// Get overall progress from LocalStorage
function getOverallProgress() {
  let completed = 0;
  let total = 15; // 3 subjects × 5 chapters
  
  for (let s = 1; s <= 3; s++) {
    for (let c = 1; c <= 5; c++) {
      const key = `quiz-s${s}-chap${c}`;
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.passed) completed++;
      }
    }
  }
  
  return { completed: completed, total: total };
}

// Setup navigation links
function setupNavigation() {
  // Add active state to current subject/chapter
  const path = window.location.pathname;
  
  // Highlight current subject card
  if (path.includes('subject1')) {
    const card = document.getElementById('subject1-card');
    if (card) card.style.borderWidth = '4px';
  } else if (path.includes('subject2')) {
    const card = document.getElementById('subject2-card');
    if (card) card.style.borderWidth = '4px';
  } else if (path.includes('subject3')) {
    const card = document.getElementById('subject3-card');
    if (card) card.style.borderWidth = '4px';
  }
}

// Mark chapter as viewed
function markChapterViewed(subject, chapter) {
  const key = `viewed-s${subject}-chap${chapter}`;
  localStorage.setItem(key, JSON.stringify({
    viewed: true,
    date: new Date().toISOString()
  }));
}

// Check if chapter is completed
function isChapterCompleted(subject, chapter) {
  const key = `quiz-s${subject}-chap${chapter}`;
  const data = localStorage.getItem(key);
  if (data) {
    const parsed = JSON.parse(data);
    return parsed.passed === true;
  }
  return false;
}

// Get next chapter URL
function getNextChapterUrl(currentSubject, currentChapter) {
  if (currentChapter < 5) {
    return `../subject${currentSubject}/chap${currentChapter + 1}.html`;
  } else if (currentSubject < 3) {
    return `../subject${currentSubject + 1}/chap1.html`;
  } else {
    return '../index.html';
  }
}

// Get previous chapter URL
function getPrevChapterUrl(currentSubject, currentChapter) {
  if (currentChapter > 1) {
    return `../subject${currentSubject}/chap${currentChapter - 1}.html`;
  } else if (currentSubject > 1) {
    return `../subject${currentSubject - 1}/chap5.html`;
  } else {
    return '../index.html';
  }
}

// Confirm before leaving quiz
function confirmLeaveQuiz() {
  const progress = JSON.parse(localStorage.getItem('current-quiz-progress') || '{"answered":0}');
  if (progress.answered > 0 && progress.answered < progress.total) {
    return confirm('You have not finished the quiz. Are you sure you want to leave?');
  }
  return true;
}

// Toggle dark mode (optional feature)
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('dark-mode', isDark ? 'true' : 'false');
}

// Initialize dark mode from storage
function initDarkMode() {
  const saved = localStorage.getItem('dark-mode');
  if (saved === 'true') {
    document.body.classList.add('dark-mode');
  }
}

// Call on load
initDarkMode();
