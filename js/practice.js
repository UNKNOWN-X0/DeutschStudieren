async function handleStart() {
  clearTimeout(answerTimer);
  clearTimeout(matchingTimer);
  selectedCard = null;
  matchingBusy = false;
  answerLocked = false;
  submitBtn.disabled = false;
  direction = directionSelect.value;
  practiceMode = modeSelect.value;
  sourceType = sourceSelect.value;

  // Hide progress section when starting practice
  progressSection.classList.add("hidden");
  practiceSection.classList.remove("hidden");

  if (sourceType === "online") {
    const topic = topicInput.value.trim();
    if (!topic) {
      feedbackEl.textContent =
        "Please type a topic to fetch words online (e.g. 'cooking', 'space')!";
      feedbackEl.className = "incorrect";
      practiceSection.classList.add("hidden");
      return;
    }
    filtered = await fetchOnlineVocabulary(topic);
  } else {
    const category = categorySelect.value.toLowerCase();
    filtered = vocab.filter((w) => w.category.toLowerCase() === category);
  }

  if (!filtered.length) {
    feedbackEl.textContent =
      "No words found! Try a different category or topic.";
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
  else if (mode === "multiple-choice")
    multipleChoiceModeSection.classList.remove("hidden");
  else if (mode === "matching") matchingModeSection.classList.remove("hidden");
}

function newWord() {
  clearTimeout(answerTimer);
  answerLocked = false;
  submitBtn.disabled = false;
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
    promptEl.textContent =
      current.word_de +
      (current.forms && current.forms.plural
        ? ` (Pl: ${current.forms.plural})`
        : "");
  } else {
    promptEl.textContent = current.word_en;
  }

  // Show example sentence if available
  if (current.example_de && current.example_en) {
    contextExampleEl.textContent = `Example: "${current.example_de}" — "${current.example_en}"`;
    contextExampleEl.classList.remove("hidden");
  }
}
