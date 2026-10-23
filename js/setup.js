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

  modeSelect.addEventListener("change", () => {
    practiceMode = modeSelect.value;
  });
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
  const categories = [...new Set(vocab.map((w) => w.category))].sort();
  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categorySelect.appendChild(opt);
  });
}

function updateStats() {
  correctCountEl.textContent = correctCount;
  totalCountEl.textContent = totalCount;
  streakCountEl.textContent = streakCount;
  const accuracy =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  accuracyEl.textContent = accuracy + "%";
  saveSRSData();
}

