let vocab = window.GERMAN_WORDS || [];
let filtered = [];
let current = null;
let direction = "de-to-en";

const categorySelect = document.getElementById("category-select");
const directionSelect = document.getElementById("direction-select");
const startBtn = document.getElementById("start-btn");
const promptEl = document.getElementById("prompt");
const answerInput = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-btn");
const feedbackEl = document.getElementById("feedback");
const practiceSection = document.querySelector(".practice");

// Load categories
function populateCategories() {
  const categories = [...new Set(vocab.map(w => w.category))].sort();
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
}

function newWord() {
  current = filtered[Math.floor(Math.random() * filtered.length)];

  if (direction === "de-to-en") {
    promptEl.textContent = current.word_de + 
      (current.forms.plural ? ` (Pl: ${current.forms.plural})` : "");
  } else {
    promptEl.textContent = current.word_en;
  }

  answerInput.value = "";
  answerInput.focus();
  feedbackEl.textContent = "";
}

submitBtn.addEventListener("click", () => {
  const user = answerInput.value.trim().toLowerCase();

  let correct;
  if (direction === "de-to-en") {
    correct = current.word_en.toLowerCase();
  } else {
    correct = current.word_de.toLowerCase();
  }

  if (user === correct) {
    feedbackEl.textContent = "Correct.";
    feedbackEl.style.color = "#ffce00";
  } else {
    feedbackEl.textContent = `Incorrect. Correct answer: ${correct}`;
    feedbackEl.style.color = "#d00";
  }

  setTimeout(newWord, 1200);
});

startBtn.addEventListener("click", () => {
  const category = categorySelect.value;
  direction = directionSelect.value;

  filtered = vocab.filter(w => w.category === category);
  if (!filtered.length) return;

  practiceSection.classList.remove("hidden");
  newWord();
});

// Initialize
populateCategories();
