# 🇩🇪 German Words Practice - Enhanced Edition

An interactive web application for learning German vocabulary with multiple practice modes, spaced repetition, and online vocabulary integration.

## ✨ New Features (Latest Update)

### 🎮 Multiple Practice Modes
1. **Type Answer** - Classic input mode with instant feedback and example sentences
2. **Multiple Choice** - Choose from 4 options, great for quick practice with context examples
3. **Matching Pairs** - Memory-style game matching German-English pairs

### 🧠 Spaced Repetition System (SRS)
- Tracks your performance on each word
- Words you struggle with appear more frequently
- Progress saved automatically in browser localStorage
- Mastered words (80%+ accuracy) tracked separately
- SRS info box shows active status during practice

### 🌐 Online Vocabulary Integration
- Fetch additional words from MyMemory Translation API
- Fallback to local database if APIs unavailable
- Merges online and local vocabulary seamlessly
- Real-time fetching with status indicators

### 📊 Enhanced Progress Tracking
- Streak counter for consecutive correct answers
- Words practiced count
- Words mastered (80%+ accuracy over 5+ attempts)
- Reset progress option
- View Progress button to see stats anytime

### 📚 Context Examples
- Example sentences displayed when available
- Shows both German and English versions
- Helps understand word usage in context

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

### API Integration
Currently integrated:
- **MyMemory Translation API** - Fetches German-English translations (free, no key required)
- Fallback to local database if API unavailable
- Easy to add more sources

## 🎨 Design Features

- Glassmorphism UI with German flag colors (black, red, gold)
- Animated backgrounds and transitions
- Responsive design for all screen sizes
- Visual feedback for correct/incorrect answers
- Loading indicators for online fetching

## 📈 Future Enhancements

Ready to implement:
- [ ] Audio pronunciation (Web Speech API)
- [ ] More example sentences in local vocabulary
- [ ] Verb conjugation practice
- [ ] Daily goals and achievements
- [ ] Export/import progress data
- [ ] Dark/light theme toggle
- [ ] Additional question types (sentence translation, listening)

## 🌍 Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Mobile-responsive for iOS and Android devices.

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Free to use for personal and commercial purposes
- ✅ Free to modify and distribute
- ✅ No warranty provided
- ✅ Must include original copyright notice

---

**Made by Focus (Gen.11)** 🇩🇪

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Add Vocabulary**: Contribute new words with example sentences
2. **Fix Bugs**: Report or fix issues in the code
3. **New Features**: Implement suggested enhancements from the roadmap
4. **Improve UI/UX**: Enhance the user interface and experience
5. **API Integrations**: Add more translation API sources

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues & Roadmap

### Current Limitations
- Online API may have rate limits (MyMemory: ~1000 requests/day)
- No cloud sync (progress stored locally only)
- Limited example sentences in local database

### Upcoming Features (Roadmap)
- [ ] **Audio Pronunciation** - Web Speech API integration
- [ ] **Sentence Translation Mode** - Translate full sentences
- [ ] **Listening Practice** - Audio-based questions
- [ ] **Verb Conjugation Trainer** - Practice German verb forms
- [ ] **Spaced Repetition 2.0** - Time-based scheduling (Anki-style)
- [ ] **Progress Cloud Sync** - Optional account system
- [ ] **Dark/Light Theme** - User preference toggle
- [ ] **PWA Support** - Installable offline app
- [ ] **Achievements System** - Badges and daily challenges
- [ ] **Analytics Dashboard** - Learning insights and weak areas
- [ ] **Idioms & Phrases** - Common German expressions
- [ ] **Regional Dialects** - Austrian and Swiss German variants

## 📚 Learning Resources

Complement your practice with these resources:
- **Dict.cc** - Comprehensive German-English dictionary
- **Leo.org** - Detailed vocabulary with examples
- **Duolingo** - Gamified language learning
- **Deutsche Welle** - Free German courses
- **Goethe Institut** - Official German learning materials

## ☕ Support

If you find this app helpful, consider:
- Starring the repository ⭐
- Sharing with fellow learners
- Contributing vocabulary or code improvements
- Providing feedback on features

---

**Happy Learning! Viel Erfolg!** 🎉🇩🇪
