// Enhanced German Words Practice Script
// Features: Multiple practice modes, Online vocabulary fetching (any topic), Spaced Repetition System

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
const categoryGroup = document.getElementById("category-group");
const topicInputGroup = document.getElementById("topic-input-group");
const topicInput = document.getElementById("topic-input");
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
const practiceSection = document.querySelector(".practice");
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
  toggleSourceInputs();
  
  startBtn.addEventListener("click", handleStart);
  submitBtn.addEventListener("click", handleSubmit);
  answerInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") submitBtn.click();
  });
  topicInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") startBtn.click();
  });
  
  modeSelect.addEventListener("change", () => { practiceMode = modeSelect.value; });
  sourceSelect.addEventListener("change", () => {
    sourceType = sourceSelect.value;
    toggleSourceInputs();
  });
  resetProgressBtn.addEventListener("click", resetProgress);
  showProgressBtn.addEventListener("click", showProgressSection);
  hideProgressBtn.addEventListener("click", hideProgressSection);
}

// Show the category dropdown for local mode, or the free-text topic box for online mode.
// Online mode no longer depends on the local word list at all.
function toggleSourceInputs() {
  if (sourceSelect.value === "online") {
    categoryGroup.classList.add("hidden");
    topicInputGroup.classList.remove("hidden");
  } else {
    categoryGroup.classList.remove("hidden");
    topicInputGroup.classList.add("hidden");
  }
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

// ---------------------------------------------------------------------------
// ONLINE VOCABULARY FETCHING
//
// This no longer depends on the local words.js database at all. Given any
// topic string, we:
//   1. Ask Datamuse for a batch of English words that are semantically
//      related to the topic ("means like" query).
//   2. Translate each of those English words into German via MyMemory.
//   3. Build a vocabulary list purely from those results.
// ---------------------------------------------------------------------------

async function fetchOnlineVocabulary(topic) {
  showOnlineStatus(true, `Finding words related to "${topic}"...`);

  try {
    const relatedWords = await fetchRelatedWords(topic);

    if (!relatedWords.length) {
      showOnlineStatus(false, "No related words found. Try a different topic.");
      setTimeout(() => showOnlineStatus(false, ""), 3000);
      return [];
    }

    showOnlineStatus(true, `Translating ${relatedWords.length} words to German...`);
    const translated = await translateWordsToGerman(relatedWords, topic);

    if (!translated.length) {
      showOnlineStatus(false, "Couldn't translate any words. Try a different topic.");
      setTimeout(() => showOnlineStatus(false, ""), 3000);
      return [];
    }

    showOnlineStatus(true, `Loaded ${translated.length} words for "${topic}"!`);
    setTimeout(() => showOnlineStatus(false, ""), 2500);
    return translated;
  } catch (error) {
    console.error("Error fetching online vocabulary:", error);
    showOnlineStatus(false, "Couldn't fetch words online. Please check your connection and try again.");
    setTimeout(() => showOnlineStatus(false, ""), 3000);
    return [];
  }
}

// Get English words related to a topic using the free Datamuse API.
// Docs: https://www.datamuse.com/api/
async function fetchRelatedWords(topic) {
  const cleanTopic = topic.trim().toLowerCase();
  if (!cleanTopic) return [];

  try {
    // "ml" = "means like" -> semantically related words
    const response = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(cleanTopic)}&max=25`);
    if (!response.ok) throw new Error("Datamuse request failed");

    const data = await response.json();

    const relatedOnly = (Array.isArray(data) ? data : [])
      .map(entry => entry.word)
      .filter(w => typeof w === "string" && /^[a-zA-Z][a-zA-Z\s-]*$/.test(w))
      .filter(w => w.toLowerCase() !== cleanTopic)
      .slice(0, 19);

    // Always include the topic word itself, plus its related words
    const words = [cleanTopic, ...relatedOnly];

    // De-duplicate while preserving order
    return [...new Set(words.map(w => w.toLowerCase()))];
  } catch (error) {
    console.error("Error fetching related words from Datamuse:", error);
    // Fall back to just the topic word so the user still gets *something*
    return [cleanTopic];
  }
}

// Translate a list of English words into German using MyMemory, running a
// small pool of requests concurrently so it's fast without hammering the API.
async function translateWordsToGerman(words, category) {
  const results = [];
  const concurrency = 5;
  let index = 0;

  async function worker() {
    while (index < words.length) {
      const currentIndex = index++;
      const word = words[currentIndex];
      const translation = await translateSingleWord(word);
      if (translation) {
        results.push({
          word_de: translation,
          forms: { plural: null },
          word_en: word,
          word_en_plural: null,
          category: category.trim().toLowerCase(),
          example_de: "",
          example_en: ""
        });
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, words.length) }, worker);
  await Promise.all(workers);

  // De-duplicate by German word (case-insensitive)
  const seen = new Set();
  return results.filter(w => {
    const key = w.word_de.toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function translateSingleWord(word) {
  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|de`);
    if (!response.ok) return null;

    const data = await response.json();
    const translated = data?.responseData?.translatedText;

    if (!translated) return null;
    if (translated.includes("<")) return null; // skip anything with HTML in it
    if (/no\s+translation|invalid|error/i.test(translated)) return null;

    return translated.trim();
  } catch (error) {
    console.error(`Error translating "${word}":`, error);
    return null;
  }
}

function showOnlineStatus(showing, text) {
  if (showing) {
    onlineStatusEl.classList.remove("hidden");
    onlineStatusEl.querySelector(".status-text").textContent = text;
    onlineStatusEl.querySelector(".status-indicator").classList.add("loading");
  } else {
    onlineStatusEl.querySelector(".status-indicator").classList.remove("loading");
    if (text) {
      onlineStatusEl.querySelector(".status-text").textContent = text;
      onlineStatusEl.classList.remove("hidden");
    } else {
      onlineStatusEl.classList.add("hidden");
    }
  }
}

// ---------------------------------------------------------------------------

async function handleStart() {
  direction = directionSelect.value;
  practiceMode = modeSelect.value;
  sourceType = sourceSelect.value;
  
  // Hide progress section when starting practice
  progressSection.classList.add("hidden");
  practiceSection.classList.remove("hidden");
  
  if (sourceType === "online") {
    const topic = topicInput.value.trim();
    if (!topic) {
      feedbackEl.textContent = "Please type a topic to fetch words online (e.g. 'cooking', 'space')!";
      feedbackEl.className = "incorrect";
      practiceSection.classList.add("hidden");
      return;
    }
    filtered = await fetchOnlineVocabulary(topic);
  } else {
    const category = categorySelect.value.toLowerCase();
    filtered = vocab.filter(w => w.category.toLowerCase() === category);
  }
  
  if (!filtered.length) {
    feedbackEl.textContent = "No words found! Try a different category or topic.";
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
