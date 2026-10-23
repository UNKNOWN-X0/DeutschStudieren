function handleSubmit() {
  if (!current || answerLocked) return;
  answerLocked = true;
  submitBtn.disabled = true;
  const user = answerInput.value.trim().toLowerCase();

  let correctAnswers = [];
  if (direction === "de-to-en") {
    correctAnswers.push(current.word_en.toLowerCase());
    if (current.word_en_plural)
      correctAnswers.push(current.word_en_plural.toLowerCase());
  } else {
    correctAnswers.push(current.word_de.toLowerCase());
    if (current.forms && current.forms.plural)
      correctAnswers.push(current.forms.plural.toLowerCase());
  }

  correctAnswers = [
    ...new Set(
      correctAnswers.flatMap((answer) =>
        [answer, ...answer.split("/")]
          .map((part) => part.trim())
          .filter(Boolean),
      ),
    ),
  ];

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
  answerTimer = setTimeout(newWord, 1500);
}

function updateProgressDisplay() {
  const statsDiv = document.getElementById("progress-stats");
  const practicedWords = Object.keys(srsData).length;
  const masteredWords = Object.values(srsData).filter((d) => {
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
  if (
    confirm(
      "Are you sure you want to reset all progress? This cannot be undone.",
    )
  ) {
    localStorage.removeItem("germanSRS");
    srsData = {};
    updateProgressDisplay();
    feedbackEl.textContent = "Progress reset successfully!";
    feedbackEl.className = "correct";
  }
}

init();
