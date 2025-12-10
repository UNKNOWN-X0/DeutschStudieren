# 🇩🇪 German Words Practice

A beautiful, interactive web application for learning German vocabulary with instant feedback and progress tracking.

![Version](https://img.shields.io/badge/version-3.0.0-green.svg)

## ✨ Features

### Learning Tools
- **Multiple Categories** - Practice vocabulary organized by topics (Food, Animals, Clothes, Family, House, City, Professions, Time, Numbers, Colors, Transportation, Body Parts, Weather, School, Verbs, Adjectives, Prepositions, Pronouns, Questions)
- **Bidirectional Practice** - Switch between German → English and English → German translation modes
- **Flexible Answers** - Both singular and plural forms are accepted as correct
- **Smart Word Rotation** - Intelligent system prevents word repetition until all vocabulary in a category has been practiced
- **Real-time Statistics** - Track correct answers, total attempts, and accuracy percentage
- **Instant Feedback** - Immediate visual confirmation with correct answer display when wrong

### User Experience
- **Modern Animated UI** - Dynamic background patterns, glow effects, and smooth transitions
- **Keyboard Support** - Press Enter to submit answers for faster practice flow
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **German Flag Color Scheme** - Visually appealing design using red, black, and gold
- **Interactive Elements** - Hover effects, ripple animations, and glassmorphism styling

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or server required - runs entirely in the browser

### Installation

1. **Download the files** or clone the repository
2. **Ensure all files are in the same folder:**
```
   project-folder/
   ├── index.html
   ├── styles.css
   ├── script.js
   └── words.js
```
3. **Open `index.html`** in your web browser
4. **Start learning!**

## 📖 How to Use

1. **Select a Category** - Choose from the dropdown menu (e.g., Food, Animals, Clothes)
2. **Choose Direction** - Pick German → English or English → German
3. **Click "Start Practice"** - Begin your vocabulary session
4. **Type Your Answer** - Enter the translation in the input field
5. **Submit** - Press Enter or click the Submit button
6. **Review Feedback** - See if you're correct and learn from mistakes
7. **Track Progress** - Monitor your accuracy in real-time

## 📁 Project Structure
```
├── index.html          # Main HTML structure
├── styles.css          # All visual styling and animations
├── script.js           # Application logic and interactivity
└── words.js            # Vocabulary database
```

### Modular Architecture
Each file serves a specific purpose, making the codebase easy to maintain and extend:
- **HTML** - Semantic structure and content
- **CSS** - Separated styling with modern animations
- **JavaScript** - Core functionality and user interactions
- **Data** - Isolated vocabulary for easy updates

## 🎨 Customization

### Adding New Words
Edit `words.js` and add entries following this format:
```javascript
{
  word_de: "das Brot",
  forms: { plural: "die Brote" },
  word_en: "bread",
  word_en_plural: "breads",
  category: "food"
}
```

### Adding New Categories
Simply add words with a new `category` value - the app automatically detects and displays all categories.

### Styling Changes
All visual customization can be done in `styles.css` without touching the core functionality.

## 📊 Version History

### Version 3.0 (Current)
- Complete visual overhaul with dynamic animations
- Modular file structure (HTML, CSS, JS, Data separated)
- Enhanced interactive elements and glassmorphism design
- Improved performance and maintainability

### Version 2.0
- Smart word rotation system (no repetitive words)
- Flexible answer acceptance (singular and plural forms)
- External vocabulary system (words.js)
- Keyboard support (Enter to submit)

### Version 1.0
- Initial release with core learning features
- Category selection and bidirectional practice
- Instant feedback and progress tracking
- German flag-inspired design

## 🛠️ Technologies Used

- **HTML5** - Structure and semantics
- **CSS3** - Advanced styling, animations, and effects
- **Vanilla JavaScript** - No frameworks or dependencies
- **Local Storage Ready** - Foundation for future progress saving

## 🤝 Contributing

Want to improve German Words Practice? Here are some ways to contribute:
- Add more vocabulary words
- Create new categories
- Improve animations and UI
- Add new features (audio pronunciation, spaced repetition, etc.)
- Report bugs or suggest enhancements

## 📝 License

This project is open source and available for educational purposes.

## 🎯 Future Enhancements

- Audio pronunciation for German words
- Spaced repetition algorithm
- Progress saving across sessions
- Difficulty levels
- Timed challenges
- Achievement system
- Dark/light theme toggle
- Multiple language support

## 👤 Author

Created with ❤️ for German language learners

---

**Happy Learning! Viel Erfolg! 🇩🇪**
