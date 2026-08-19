# 🇩🇪 German Words Practice - Enhanced Edition

An interactive web application for learning German vocabulary with multiple practice modes, spaced repetition, and online vocabulary integration.

## ✨ New Features (Latest Update)

### 🎮 Multiple Practice Modes
1. **Type Answer (One-to-One)** - Classic input mode with instant feedback
2. **Multiple Choice** - Choose from 4 options, great for quick practice
3. **Matching Pairs** - Memory-style game matching German-English pairs

### 🧠 Spaced Repetition System (SRS)
- Tracks your performance on each word
- Words you struggle with appear more frequently
- Progress saved automatically in browser localStorage
- Mastered words (80%+ accuracy) tracked separately

### 🌐 Online Vocabulary Integration
- Option to fetch additional words from online APIs
- Fallback to local database if APIs unavailable
- Merges online and local vocabulary seamlessly
- Currently supports placeholder API integration (ready for real API keys)

### 📊 Enhanced Progress Tracking
- Streak counter for consecutive correct answers
- Words practiced count
- Words mastered (80%+ accuracy over 5+ attempts)
- Reset progress option

## 🚀 Getting Started

1. Open `index.html` in any modern web browser
2. Select a category from the dropdown
3. Choose your practice direction (German→English or English→German)
4. Pick a practice mode
5. Choose vocabulary source (Local or Online)
6. Click "Start Practice"

## 📁 File Structure

```
/workspace
├── index.html          # Main HTML structure with new UI components
├── styles.css          # Enhanced styling for all game modes
├── script.js           # Complete rewrite with SRS and multiple modes
├── words.js            # 1,663+ German vocabulary words
└── README.md           # This file
```

## 🎯 How to Use Each Mode

### Type Answer Mode
- See a word in one language
- Type the translation
- Get instant feedback with correct answer shown
- Press Enter or click Submit

### Multiple Choice Mode
- See a word with 4 possible translations
- Click the correct option
- Visual feedback on selection
- Automatic progression to next word

### Matching Pairs Mode
- 8 German-English pairs displayed as cards (16 total)
- Click two cards to find matches
- Matched pairs stay highlighted
- Complete all pairs to start a new round

## 🔧 Technical Details

### Spaced Repetition Algorithm
```javascript
weight = 1 + (1 - successRate) * 3
// successRate = correctAnswers / totalAttempts
// Weight ranges from 1 (100% accuracy) to 4 (0% accuracy)
```

### Local Storage Keys
- `germanSRS` - Stores word performance data

### API Integration Points
The code includes placeholders for:
- Dict.cc API
- Free Dictionary API
- Easy to add more sources

## 🎨 Design Features

- Glassmorphism UI with German flag colors (black, red, gold)
- Animated backgrounds and transitions
- Responsive design for all screen sizes
- Visual feedback for correct/incorrect answers
- Loading indicators for online fetching

## 📈 Future Enhancements

Ready to implement:
- [ ] Real API integrations (Dict.cc, Leo.org)
- [ ] Audio pronunciation (Web Speech API)
- [ ] Sentence context examples
- [ ] Verb conjugation practice
- [ ] Daily goals and achievements
- [ ] Export/import progress data
- [ ] Dark/light theme toggle

## 🌍 Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Mobile-responsive for iOS and Android devices.

## 📝 License

Open source - feel free to modify and extend!

---

**Made by Focus (Gen.11)** 🇩🇪
