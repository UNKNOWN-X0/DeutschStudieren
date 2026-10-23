function setupMatchingGame() {
  clearTimeout(matchingTimer);
  selectedCard = null;
  matchingBusy = false;
  const grid = document.getElementById("matching-grid");
  grid.innerHTML = "";
  matchedCount = 0;

  const available = [
    ...new Map(
      filtered.filter((w) => w.word_en && w.word_de).map((w) => [w.word_de, w]),
    ).values(),
  ];
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }
  const pairs = available.slice(0, 8);

  matchingPairs = pairs;

  const cards = [];
  pairs.forEach((pair, index) => {
    cards.push({
      id: `de-${index}`,
      word: pair.word_de,
      pairId: index,
      lang: "de",
    });
    cards.push({
      id: `en-${index}`,
      word: pair.word_en,
      pairId: index,
      lang: "en",
    });
  });

  cards.sort(() => Math.random() - 0.5);

  cards.forEach((card) => {
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
  if (
    matchingBusy ||
    cardEl.classList.contains("matched") ||
    cardEl.classList.contains("selected")
  )
    return;

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
        matchingTimer = setTimeout(setupMatchingGame, 2000);
      }
    } else {
      matchingBusy = true;
      const firstCard = selectedCard;
      matchingTimer = setTimeout(() => {
        firstCard.classList.remove("selected");
        cardEl.classList.remove("selected");
        selectedCard = null;
        matchingBusy = false;
      }, 1000);
    }
  }
}
