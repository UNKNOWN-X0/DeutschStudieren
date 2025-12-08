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
  // Reset dropdown and add "All" as the first option
  categorySelect.innerHTML = '<option value="all">All</option>';

  // Get unique categories from vocab
  const categories = [...new Set(vocab.map(w => w.category))].sort();

  // Add each category to the dropdown
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
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

startBtn.addEventListener("click", () => {
  const category = categorySelect.value;
  direction = directionSelect.value;

  // If "All" is selected, use all words
  if (category === "all") {
    filtered = vocab.slice(); // copy all words
  } else {
    filtered = vocab.filter(w => w.category === category);
  }

  if (!filtered.length) {
    alert("No words found in this category!");
    return;
  }

  practiceSection.classList.remove("hidden");
  newWord();
});

// Initialize
populateCategories();
