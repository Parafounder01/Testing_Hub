// Professor EasyBot - Quiz Module
// Handles 3 MCQ per chapter with LocalStorage progress

let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;
let quizSubject = '';
let quizChapter = '';

// Load quiz for a specific subject and chapter
function loadQuiz(subject, chapter, questions) {
  quizSubject = subject;
  quizChapter = chapter;
  currentQuiz = questions;
  currentQuestionIndex = 0;
  score = 0;
  
  displayQuestion();
  updateProgress();
}

// Display current question
function displayQuestion() {
  if (currentQuestionIndex >= currentQuiz.length) {
    showQuizResult();
    return;
  }
  
  const q = currentQuiz[currentQuestionIndex];
  const container = document.getElementById('quiz-container');
  
  if (!container) {
    console.log('Quiz container not found');
    return;
  }
  
  let html = `
    <div class="quiz-question">
      <h3>Question ${currentQuestionIndex + 1} of ${currentQuiz.length}</h3>
      <p style="font-size: 22px; margin: 16px 0;">${q.question}</p>
      <ul class="quiz-options" id="options-list">
  `;
  
  q.options.forEach((option, index) => {
    html += `
      <li>
        <button class="quiz-option" onclick="selectOption(${index})" id="option-${index}">
          ${String.fromCharCode(65 + index)}) ${option}
        </button>
      </li>
    `;
  });
  
  html += `
      </ul>
      <div id="explanation" style="display:none; margin-top:16px; padding:16px; background:#E3F2FD; border-radius:8px;"></div>
      <button class="btn" onclick="nextQuestion()" id="next-btn" style="display:none; margin-top:16px;">Next Question</button>
    </div>
  `;
  
  container.innerHTML = html;
  updateProgress();
}

// Select an option
function selectOption(index) {
  const q = currentQuiz[currentQuestionIndex];
  const optionBtn = document.getElementById(`option-${index}`);
  const explanationDiv = document.getElementById('explanation');
  const nextBtn = document.getElementById('next-btn');
  
  // Disable all options
  q.options.forEach((_, i) => {
    const btn = document.getElementById(`option-${i}`);
    if (btn) {
      btn.disabled = true;
      btn.style.cursor = 'default';
    }
  });
  
  // Mark correct/incorrect
  if (index === q.correct) {
    optionBtn.classList.add('correct');
    score++;
  } else {
    optionBtn.classList.add('incorrect');
    // Show correct answer
    const correctBtn = document.getElementById(`option-${q.correct}`);
    if (correctBtn) {
      correctBtn.classList.add('correct');
    }
  }
  
  // Show explanation
  if (explanationDiv) {
    explanationDiv.innerHTML = `<strong>Explanation:</strong> ${q.explanation}`;
    explanationDiv.style.display = 'block';
  }
  
  // Show next button
  if (nextBtn) {
    nextBtn.style.display = 'inline-block';
  }
}

// Next question
function nextQuestion() {
  currentQuestionIndex++;
  displayQuestion();
}

// Show quiz result
function showQuizResult() {
  const container = document.getElementById('quiz-container');
  const total = currentQuiz.length;
  const percentage = Math.round((score / total) * 100);
  
  let resultText = '';
  let resultColor = '';
  
  if (percentage >= 60) {
    resultText = '✅ Great job! You passed!';
    resultColor = 'var(--success)';
    // Save progress to LocalStorage
    saveQuizProgress(true);
  } else {
    resultText = '📚 Let\'s study more and try again!';
    resultColor = 'var(--highlight)';
    saveQuizProgress(false);
  }
  
  container.innerHTML = `
    <div class="quiz-question" style="text-align:center;">
      <h2>Quiz Complete!</h2>
      <p style="font-size: 28px; color: ${resultColor}; margin: 20px 0;">${resultText}</p>
      <p style="font-size: 24px;">Your Score: ${score} out of ${total} (${percentage}%)</p>
      <button class="btn" onclick="location.reload()" style="margin: 12px;">Try Again</button>
      <a href="${getChapterUrl()}" class="btn" style="margin: 12px;">Back to Chapter</a>
    </div>
  `;
}

// Save quiz progress to LocalStorage
function saveQuizProgress(passed) {
  const key = `quiz-${quizSubject}-${quizChapter}`;
  const data = {
    passed: passed,
    score: score,
    total: currentQuiz.length,
    date: new Date().toISOString()
  };
  localStorage.setItem(key, JSON.stringify(data));
  updateOverallProgress();
}

// Update progress display
function updateProgress() {
  const progressFill = document.getElementById('quiz-progress');
  if (progressFill) {
    const percent = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;
    progressFill.style.width = percent + '%';
  }
}

// Get chapter URL to go back
function getChapterUrl() {
  if (quizSubject && quizChapter) {
    return `../subject${quizSubject}/chap${quizChapter}.html`;
  }
  return '../index.html';
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

// Update overall progress display
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

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', function() {
  updateOverallProgress();
});
