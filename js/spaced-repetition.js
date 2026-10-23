function loadSRSData() {
  srsData = JSON.parse(localStorage.getItem("germanSRS")) || {};
}
function saveSRSData() {
  localStorage.setItem("germanSRS", JSON.stringify(srsData));
}

function getSRSWeight(word) {
  const key = `${word.word_de}_${word.word_en}`;
  const data = srsData[key];
  if (!data) return 1;
  const successRate = data.correct / data.total;
  return 1 + (1 - successRate) * 3;
}

function updateSRS(word, isCorrect) {
  const key = `${word.word_de}_${word.word_en}`;
  if (!srsData[key])
    srsData[key] = { correct: 0, total: 0, lastPracticed: null };
  srsData[key].total++;
  if (isCorrect) srsData[key].correct++;
  srsData[key].lastPracticed = new Date().toISOString();
  saveSRSData();
}

function selectWordWithSRS() {
  if (usedWords.length >= filtered.length) usedWords = [];
  const available = filtered.filter((w) => !usedWords.includes(w));
  if (available.length === 0) return null;

  const weights = available.map((w) => getSRSWeight(w));
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

