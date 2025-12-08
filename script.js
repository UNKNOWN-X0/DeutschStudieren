const categorySelect = document.getElementById("categorySelect");
const showMode = document.getElementById("showMode");
const startBtn = document.getElementById("startBtn");
const practice = document.getElementById("practice");
const prompt = document.getElementById("prompt");
const answerInput = document.getElementById("answerInput");
const checkBtn = document.getElementById("checkBtn");
const feedback = document.getElementById("feedback");

let filteredWords = [];
let currentWord = null;

// Load categories into the dropdown
(function loadCategories() {
    const cats = [...new Set(WORDS.map(w => w.category))];
    cats.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        categorySelect.appendChild(opt);
    });
})();

startBtn.addEventListener("click", () => {
    const selected = categorySelect.value;

    filteredWords = selected === "all"
        ? WORDS
        : WORDS.filter(w => w.category === selected);

    if (filteredWords.length === 0) {
        alert("No words in this category.");
        return;
    }

    practice.classList.remove("hidden");
    newPracticeRound();
});

function newPracticeRound() {
    currentWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    answerInput.value = "";
    feedback.textContent = "";

    if (showMode.value === "de") {
        prompt.textContent = `${currentWord.word_de} (${currentWord.forms})`;
    } else {
        prompt.textContent = currentWord.word_en;
    }
}

checkBtn.addEventListener("click", () => {
    const ans = answerInput.value.trim().toLowerCase();

    let correct =
        (showMode.value === "de" && ans === currentWord.word_en.toLowerCase()) ||
        (showMode.value === "en" && ans === currentWord.word_de.toLowerCase());

    feedback.textContent = correct
        ? "✔ Correct!"
        : `✘ Wrong. Answer: ${showMode.value === "de" ? currentWord.word_en : currentWord.word_de}`;

    setTimeout(newPracticeRound, 1500);
});
