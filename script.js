// Words will be loaded from words.js

// Main script
let vocab = window.GERMAN_WORDS || [];
let filtered = [];
let current = null;
let direction = "de-to-en";
let correctCount = 0;
let totalCount = 0;
let usedWords = [];

const categorySelect = document.getElementById("category-select");
const directionSelect = document.getElementById("direction-select");
const startBtn = document.getElementById("start-btn");
const promptEl = document.getElementById("prompt");
const answerInput = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-btn");
const feedbackEl = document.getElementById("feedback");
const practiceSection = document.querySelector(".practice");
const correctCountEl = document.getElementById("correct-count");
const totalCountEl = document.getElementById("total-count");
const accuracyEl = document.getElementById("accuracy");

function populateCategories() {
  const categories = [...new Set(vocab.map(w => w.category))].sort();
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categorySelect.appendChild(opt);
  });
}

function updateStats() {
  correctCountEl.textContent = correctCount;
  totalCountEl.textContent = totalCount;
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  accuracyEl.textContent = accuracy + "%";
}

function newWord() {
  // Reset used words if we've gone through all of them
  if (usedWords.length >= filtered.length) {
    usedWords = [];
  }
  
  // Get unused words
  const available = filtered.filter(w => !usedWords.includes(w));
  current = available[Math.floor(Math.random() * available.length)];
  usedWords.push(current);

  if (direction === "de-to-en") {
    promptEl.textContent = current.word_de + 
      (current.forms.plural ? ` (Pl: ${current.forms.plural})` : "");
  } else {
    promptEl.textContent = current.word_en;
  }

  answerInput.value = "";
  answerInput.focus();
  feedbackEl.textContent = "";
  feedbackEl.className = "";
}

submitBtn.addEventListener("click", () => {
  const user = answerInput.value.trim().toLowerCase();

  let correctAnswers = [];
  if (direction === "de-to-en") {
    // Accept both singular English and plural forms
    correctAnswers.push(current.word_en.toLowerCase());
    if (current.word_en_plural) {
      correctAnswers.push(current.word_en_plural.toLowerCase());
    }
  } else {
    // Accept both singular and plural German forms
    correctAnswers.push(current.word_de.toLowerCase());
    if (current.forms.plural) {
      correctAnswers.push(current.forms.plural.toLowerCase());
    }
  }

  totalCount++;
  
  if (correctAnswers.includes(user)) {
    correctCount++;
    feedbackEl.textContent = "🎉 Correct!";
    feedbackEl.className = "correct";
  } else {
    const correctDisplay = correctAnswers.join(" or ");
    feedbackEl.textContent = `❌ Incorrect. Correct answer: ${correctDisplay}`;
    feedbackEl.className = "incorrect";
  }

  updateStats();
  setTimeout(newWord, 1500);
});

answerInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    submitBtn.click();
  }
});

startBtn.addEventListener("click", () => {
  const category = categorySelect.value.toLowerCase();
  direction = directionSelect.value;

  filtered = vocab.filter(w => w.category === category);
  if (!filtered.length) return;

  correctCount = 0;
  totalCount = 0;
  usedWords = [];
  updateStats();

  practiceSection.classList.remove("hidden");
  newWord();
});

populateCategories();
