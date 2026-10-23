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
let matchingBusy = false;
let matchingTimer = null;
let answerLocked = false;
let answerTimer = null;

let srsData = JSON.parse(localStorage.getItem("germanSRS")) || {};
