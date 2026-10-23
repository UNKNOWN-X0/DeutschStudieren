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

    showOnlineStatus(
      true,
      `Translating ${relatedWords.length} words to German...`,
    );
    const translated = await translateWordsToGerman(relatedWords, topic);

    if (!translated.length) {
      showOnlineStatus(
        false,
        "Couldn't translate any words. Try a different topic.",
      );
      setTimeout(() => showOnlineStatus(false, ""), 3000);
      return [];
    }

    showOnlineStatus(true, `Loaded ${translated.length} words for "${topic}"!`);
    setTimeout(() => showOnlineStatus(false, ""), 2500);
    return translated;
  } catch (error) {
    console.error("Error fetching online vocabulary:", error);
    showOnlineStatus(
      false,
      "Couldn't fetch words online. Please check your connection and try again.",
    );
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
    const response = await fetch(
      `https://api.datamuse.com/words?ml=${encodeURIComponent(cleanTopic)}&max=25`,
    );
    if (!response.ok) throw new Error("Datamuse request failed");

    const data = await response.json();

    const relatedOnly = (Array.isArray(data) ? data : [])
      .map((entry) => entry.word)
      .filter((w) => typeof w === "string" && /^[a-zA-Z][a-zA-Z\s-]*$/.test(w))
      .filter((w) => w.toLowerCase() !== cleanTopic)
      .slice(0, 19);

    // Always include the topic word itself, plus its related words
    const words = [cleanTopic, ...relatedOnly];

    // De-duplicate while preserving order
    return [...new Set(words.map((w) => w.toLowerCase()))];
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
          example_en: "",
        });
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, words.length) },
    worker,
  );
  await Promise.all(workers);

  // De-duplicate by German word (case-insensitive)
  const seen = new Set();
  return results.filter((w) => {
    const key = w.word_de.toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function translateSingleWord(word) {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|de`,
    );
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
    onlineStatusEl
      .querySelector(".status-indicator")
      .classList.remove("loading");
    if (text) {
      onlineStatusEl.querySelector(".status-text").textContent = text;
      onlineStatusEl.classList.remove("hidden");
    } else {
      onlineStatusEl.classList.add("hidden");
    }
  }
}

// ---------------------------------------------------------------------------

