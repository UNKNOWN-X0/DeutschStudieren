function setupMultipleChoiceQuestion() {
  // Hide context examples initially
  mcContextExampleEl.classList.add("hidden");
  mcContextExampleEl.textContent = "";

  if (direction === "de-to-en") {
    document.getElementById("mc-prompt").textContent =
      current.word_de +
      (current.forms && current.forms.plural
        ? ` (Pl: ${current.forms.plural})`
        : "");
  } else {
    document.getElementById("mc-prompt").textContent = current.word_en;
  }

  // Show example sentence if available
  if (current.example_de && current.example_en) {
    mcContextExampleEl.textContent = `Example: "${current.example_de}" — "${current.example_en}"`;
    mcContextExampleEl.classList.remove("hidden");
  }

  const correctAnswer =
    direction === "de-to-en" ? current.word_en : current.word_de;
  const options = generateMultipleChoiceOptions(correctAnswer, direction);

  const optionsContainer = document.getElementById("mc-options");
  optionsContainer.innerHTML = "";

  options.forEach((option) => {
    const btn = document.createElement("button");
    btn.className = "mc-option";
    btn.textContent = option;
    btn.addEventListener("click", () =>
      handleMultipleChoiceAnswer(option, correctAnswer),
    );
    optionsContainer.appendChild(btn);
  });
}

function generateMultipleChoiceOptions(correctAnswer, dir) {
  const options = [correctAnswer];
  const wrongAnswers = filtered
    .filter((w) => {
      const answer = dir === "de-to-en" ? w.word_en : w.word_de;
      return answer !== correctAnswer && answer !== null;
    })
    .map((w) => (dir === "de-to-en" ? w.word_en : w.word_de))
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  options.push(...wrongAnswers);
  return options.sort(() => Math.random() - 0.5);
}

function handleMultipleChoiceAnswer(selected, correct) {
  if (!current || answerLocked) return;
  answerLocked = true;
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
  buttons.forEach((btn) => (btn.disabled = true));

  answerTimer = setTimeout(() => {
    buttons.forEach((btn) => (btn.disabled = false));
    newWord();
  }, 1500);
}
