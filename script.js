// Enhanced German Words Practice Script
// Features: Multiple practice modes, Online API integration, Spaced Repetition System

let vocab = window.GERMAN_WORDS || [];
let filtered = [];
let current = null;
let direction = "de-to-en";
let practiceMode = "input";
let sourceType = "local";
let correctCount = 0;
let totalCount = 0;
let streakCount = 0;
let usedWords = [];
let matchingPairs = [];
let selectedCard = null;
let matchedCount = 0;

let srsData = JSON.parse(localStorage.getItem('germanSRS')) || {};

const categorySelect = document.getElementById("category-select");
const directionSelect = document.getElementById("direction-select");
const modeSelect = document.getElementById("mode-select");
const sourceSelect = document.getElementById("source-select");
const startBtn = document.getElementById("start-btn");
const showProgressBtn = document.getElementById("show-progress-btn");
const hideProgressBtn = document.getElementById("hide-progress-btn");
const promptEl = document.getElementById("prompt");
const answerInput = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-btn");
const feedbackEl = document.getElementById("feedback");
const practiceSection = document.getElementById("practice-section");
const progressSection = document.getElementById("progress-section");
const correctCountEl = document.getElementById("correct-count");
const totalCountEl = document.getElementById("total-count");
const accuracyEl = document.getElementById("accuracy");
const streakCountEl = document.getElementById("streak-count");
const onlineStatusEl = document.getElementById("online-status");
const resetProgressBtn = document.getElementById("reset-progress-btn");
const inputModeSection = document.getElementById("input-mode");
const multipleChoiceModeSection = document.getElementById("multiple-choice-mode");
const matchingModeSection = document.getElementById("matching-mode");
const srsInfoEl = document.getElementById("srs-info");
const contextExampleEl = document.getElementById("context-example");
const mcContextExampleEl = document.getElementById("mc-context-example");

function init() {
  populateCategories();
  loadSRSData();
  updateProgressDisplay();
  
  startBtn.addEventListener("click", handleStart);
  submitBtn.addEventListener("click", handleSubmit);
  answerInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") submitBtn.click();
  });
  
  modeSelect.addEventListener("change", () => { practiceMode = modeSelect.value; });
  sourceSelect.addEventListener("change", () => { sourceType = sourceSelect.value; });
  resetProgressBtn.addEventListener("click", resetProgress);
  showProgressBtn.addEventListener("click", showProgressSection);
  hideProgressBtn.addEventListener("click", hideProgressSection);
}

function showProgressSection() {
  practiceSection.classList.add("hidden");
  progressSection.classList.remove("hidden");
  updateProgressDisplay();
}

function hideProgressSection() {
  progressSection.classList.add("hidden");
  practiceSection.classList.remove("hidden");
}

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
  streakCountEl.textContent = streakCount;
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  accuracyEl.textContent = accuracy + "%";
  saveSRSData();
}

function loadSRSData() { srsData = JSON.parse(localStorage.getItem('germanSRS')) || {}; }
function saveSRSData() { localStorage.setItem('germanSRS', JSON.stringify(srsData)); }

function getSRSWeight(word) {
  const key = `${word.word_de}_${word.word_en}`;
  const data = srsData[key];
  if (!data) return 1;
  const successRate = data.correct / data.total;
  return 1 + (1 - successRate) * 3;
}

function updateSRS(word, isCorrect) {
  const key = `${word.word_de}_${word.word_en}`;
  if (!srsData[key]) srsData[key] = { correct: 0, total: 0, lastPracticed: null };
  srsData[key].total++;
  if (isCorrect) srsData[key].correct++;
  srsData[key].lastPracticed = new Date().toISOString();
  saveSRSData();
}

function selectWordWithSRS() {
  if (usedWords.length >= filtered.length) usedWords = [];
  const available = filtered.filter(w => !usedWords.includes(w));
  if (available.length === 0) return null;
  
  const weights = available.map(w => getSRSWeight(w));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  
  let random = Math.random() * totalWeight;
  for (let i = 0; i < available.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      current = available[i];
      usedWords.push(current);
      return current;
    }
  }
  
  current = available[0];
  usedWords.push(current);
  return current;
}

async function fetchOnlineVocabulary(category) {
  showOnlineStatus(true, "Fetching from online sources...");
  
  try {
    const apiPromises = [fetchFromDictCC(category), fetchFromFreeDictionaryAPI(category)];
    const results = await Promise.allSettled(apiPromises);
    const onlineWords = [];
    
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value) onlineWords.push(...result.value);
    });
    
    const localWords = vocab.filter(w => w.category.toLowerCase() === category.toLowerCase());
    const merged = mergeVocabulary(localWords, onlineWords);
    
    showOnlineStatus(false, `Added ${onlineWords.length} online words!`);
    setTimeout(() => showOnlineStatus(false, ""), 3000);
    return merged;
  } catch (error) {
    console.error("Error fetching online vocabulary:", error);
    showOnlineStatus(false, "Using local database only");
    setTimeout(() => showOnlineStatus(false, ""), 3000);
    return vocab.filter(w => w.category.toLowerCase() === category.toLowerCase());
  }
}

async function fetchFromDictCC(searchTerm) {
  // Using MyMemory Translation API (dict.cc API is not publicly available)
  // API endpoint: https://api.mymemory.translated.net/get?q={term}&langpair=de|en
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(searchTerm)}&langpair=de|en`);
    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    const words = [];
    
    if (data && data.responseData && data.responseData.matches) {
      const matches = data.responseData.matches.slice(0, 15);
      
      for (const match of matches) {
        const deWord = match.segment;
        const enWord = match.translation;
        
        if (deWord && enWord && deWord.trim() && enWord.trim()) {
          // Skip if the word contains HTML or special characters
          if (deWord.includes('<') || enWord.includes('<')) continue;
          
          words.push({
            word_de: deWord.trim(),
            word_en: enWord.trim(),
            word_en_plural: null,
            forms: { plural: null },
            category: searchTerm.toLowerCase(),
            example_de: '',
            example_en: ''
          });
        }
      }
    }
    
    return words;
  } catch (error) {
    console.error('Error fetching from MyMemory API:', error);
    return [];
  }
}

async function fetchFromFreeDictionaryAPI(category) {
  // Fallback API for English definitions (not German-English pairs)
  // This is limited but can provide English context
  return [];
}

function mergeVocabulary(local, online) {
  const map = new Map();
  local.forEach(w => map.set(`${w.word_de}_${w.word_en}`, w));
  online.forEach(w => {
    const key = `${w.word_de}_${w.word_en}`;
    if (!map.has(key)) map.set(key, w);
  });
  return Array.from(map.values());
}

function showOnlineStatus(showing, text) {
  if (showing) {
    onlineStatusEl.classList.remove("hidden");
    onlineStatusEl.querySelector(".status-text").textContent = text;
    onlineStatusEl.querySelector(".status-indicator").classList.add("loading");
  } else {
    if (text) onlineStatusEl.querySelector(".status-text").textContent = text;
    if (!text) onlineStatusEl.classList.add("hidden");
  }
}

async function handleStart() {
  const category = categorySelect.value.toLowerCase();
  direction = directionSelect.value;
  practiceMode = modeSelect.value;
  sourceType = sourceSelect.value;
  
  // Hide progress section when starting practice
  progressSection.classList.add("hidden");
  practiceSection.classList.remove("hidden");
  
  if (sourceType === "online") {
    filtered = await fetchOnlineVocabulary(category);
  } else {
    filtered = vocab.filter(w => w.category.toLowerCase() === category);
  }
  
  if (!filtered.length) {
    feedbackEl.textContent = "No words found in this category!";
    feedbackEl.className = "incorrect";
    return;
  }
  
  correctCount = 0;
  totalCount = 0;
  streakCount = 0;
  usedWords = [];
  matchedCount = 0;
  updateStats();
  
  // Show SRS info box
  srsInfoEl.classList.remove("hidden");
  
  showModeSection(practiceMode);
  
  if (practiceMode === "matching") {
    setupMatchingGame();
  } else {
    newWord();
  }
}

function showModeSection(mode) {
  inputModeSection.classList.add("hidden");
  multipleChoiceModeSection.classList.add("hidden");
  matchingModeSection.classList.add("hidden");
  
  if (mode === "input") inputModeSection.classList.remove("hidden");
  else if (mode === "multiple-choice") multipleChoiceModeSection.classList.remove("hidden");
  else if (mode === "matching") matchingModeSection.classList.remove("hidden");
}

function newWord() {
  const word = selectWordWithSRS();
  if (!word) return;
  current = word;
  
  if (practiceMode === "input") setupInputQuestion();
  else if (practiceMode === "multiple-choice") setupMultipleChoiceQuestion();
  
  answerInput.value = "";
  answerInput.focus();
  feedbackEl.textContent = "";
  feedbackEl.className = "";
}

function setupInputQuestion() {
  // Hide context examples initially
  contextExampleEl.classList.add("hidden");
  contextExampleEl.textContent = "";
  
  if (direction === "de-to-en") {
    promptEl.textContent = current.word_de + (current.forms && current.forms.plural ? ` (Pl: ${current.forms.plural})` : "");
  } else {
    promptEl.textContent = current.word_en;
  }
  
  // Show example sentence if available
  if (current.example_de && current.example_en) {
    contextExampleEl.textContent = `Example: "${current.example_de}" — "${current.example_en}"`;
    contextExampleEl.classList.remove("hidden");
  }
}

function setupMultipleChoiceQuestion() {
  // Hide context examples initially
  mcContextExampleEl.classList.add("hidden");
  mcContextExampleEl.textContent = "";
  
  if (direction === "de-to-en") {
    document.getElementById("mc-prompt").textContent = current.word_de + (current.forms && current.forms.plural ? ` (Pl: ${current.forms.plural})` : "");
  } else {
    document.getElementById("mc-prompt").textContent = current.word_en;
  }
  
  // Show example sentence if available
  if (current.example_de && current.example_en) {
    mcContextExampleEl.textContent = `Example: "${current.example_de}" — "${current.example_en}"`;
    mcContextExampleEl.classList.remove("hidden");
  }
  
  const correctAnswer = direction === "de-to-en" ? current.word_en : current.word_de;
  const options = generateMultipleChoiceOptions(correctAnswer, direction);
  
  const optionsContainer = document.getElementById("mc-options");
  optionsContainer.innerHTML = "";
  
  options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "mc-option";
    btn.textContent = option;
    btn.addEventListener("click", () => handleMultipleChoiceAnswer(option, correctAnswer));
    optionsContainer.appendChild(btn);
  });
}

function generateMultipleChoiceOptions(correctAnswer, dir) {
  const options = [correctAnswer];
  const wrongAnswers = filtered
    .filter(w => {
      const answer = dir === "de-to-en" ? w.word_en : w.word_de;
      return answer !== correctAnswer && answer !== null;
    })
    .map(w => dir === "de-to-en" ? w.word_en : w.word_de)
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  options.push(...wrongAnswers);
  return options.sort(() => Math.random() - 0.5);
}

function handleMultipleChoiceAnswer(selected, correct) {
  totalCount++;
  const isCorrect = selected.toLowerCase() === correct.toLowerCase();
  
  if (isCorrect) {
    correctCount++;
    streakCount++;
    feedbackEl.textContent = "🎉 Correct!";
    feedbackEl.className = "correct";
    updateSRS(current, true);
  } else {
    streakCount = 0;
    feedbackEl.textContent = `❌ Incorrect. Correct answer: ${correct}`;
    feedbackEl.className = "incorrect";
    updateSRS(current, false);
  }
  
  updateStats();
  
  const buttons = document.querySelectorAll(".mc-option");
  buttons.forEach(btn => btn.disabled = true);
  
  setTimeout(() => {
    buttons.forEach(btn => btn.disabled = false);
    newWord();
  }, 1500);
}

function setupMatchingGame() {
  const grid = document.getElementById("matching-grid");
  grid.innerHTML = "";
  matchedCount = 0;
  
  const pairs = [];
  const available = filtered.filter(w => w.word_en && w.word_de);
  
  for (let i = 0; i < Math.min(8, available.length); i++) {
    const word = available[Math.floor(Math.random() * available.length)];
    if (!pairs.find(p => p.word_de === word.word_de)) pairs.push(word);
  }
  
  matchingPairs = pairs;
  
  const cards = [];
  pairs.forEach((pair, index) => {
    cards.push({ id: `de-${index}`, word: pair.word_de, pairId: index, lang: 'de' });
    cards.push({ id: `en-${index}`, word: pair.word_en, pairId: index, lang: 'en' });
  });
  
  cards.sort(() => Math.random() - 0.5);
  
  cards.forEach(card => {
    const cardEl = document.createElement("div");
    cardEl.className = "matching-card";
    cardEl.dataset.id = card.id;
    cardEl.dataset.pairId = card.pairId;
    cardEl.textContent = card.word;
    cardEl.addEventListener("click", () => handleCardClick(cardEl));
    grid.appendChild(cardEl);
  });
}

function handleCardClick(cardEl) {
  if (cardEl.classList.contains("matched") || cardEl.classList.contains("selected")) return;
  
  cardEl.classList.add("selected");
  
  if (!selectedCard) {
    selectedCard = cardEl;
  } else {
    const pairId1 = selectedCard.dataset.pairId;
    const pairId2 = cardEl.dataset.pairId;
    
    if (pairId1 === pairId2) {
      selectedCard.classList.add("matched");
      cardEl.classList.add("matched");
      selectedCard.classList.remove("selected");
      cardEl.classList.remove("selected");
      matchedCount++;
      selectedCard = null;
      
      if (matchedCount === matchingPairs.length) {
        feedbackEl.textContent = "🎉 All pairs matched! Starting new round...";
        feedbackEl.className = "correct";
        setTimeout(setupMatchingGame, 2000);
      }
    } else {
      setTimeout(() => {
        selectedCard.classList.remove("selected");
        cardEl.classList.remove("selected");
        selectedCard = null;
      }, 1000);
    }
  }
}

function handleSubmit() {
  const user = answerInput.value.trim().toLowerCase();
  
  let correctAnswers = [];
  if (direction === "de-to-en") {
    correctAnswers.push(current.word_en.toLowerCase());
    if (current.word_en_plural) correctAnswers.push(current.word_en_plural.toLowerCase());
  } else {
    correctAnswers.push(current.word_de.toLowerCase());
    if (current.forms && current.forms.plural) correctAnswers.push(current.forms.plural.toLowerCase());
  }
  
  totalCount++;
  
  if (correctAnswers.includes(user)) {
    correctCount++;
    streakCount++;
    feedbackEl.textContent = "🎉 Correct!";
    feedbackEl.className = "correct";
    updateSRS(current, true);
  } else {
    streakCount = 0;
    const correctDisplay = correctAnswers.join(" or ");
    feedbackEl.textContent = `❌ Incorrect. Correct answer: ${correctDisplay}`;
    feedbackEl.className = "incorrect";
    updateSRS(current, false);
  }
  
  updateStats();
  setTimeout(newWord, 1500);
}

function updateProgressDisplay() {
  const statsDiv = document.getElementById("progress-stats");
  const practicedWords = Object.keys(srsData).length;
  const masteredWords = Object.values(srsData).filter(d => {
    const rate = d.correct / d.total;
    return d.total >= 5 && rate >= 0.8;
  }).length;
  
  statsDiv.innerHTML = `
    <div class="progress-stat">
      <span class="stat-label">Words Practiced</span>
      <span class="stat-value">${practicedWords}</span>
    </div>
    <div class="progress-stat">
      <span class="stat-label">Words Mastered (80%+ accuracy)</span>
      <span class="stat-value">${masteredWords}</span>
    </div>
  `;
}

function resetProgress() {
  if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
    localStorage.removeItem('germanSRS');
    srsData = {};
    updateProgressDisplay();
    feedbackEl.textContent = "Progress reset successfully!";
    feedbackEl.className = "correct";
  }
}

init();
