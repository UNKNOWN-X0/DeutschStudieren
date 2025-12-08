# 🇩🇪 German Word Practice

An interactive web application for learning German vocabulary with a beautiful, modern interface inspired by the German flag colors.

## ✨ Features

- **Category-based Learning**: Practice words organized by categories (Food, Animals, Clothes)
- **Bidirectional Practice**: Switch between German → English or English → German
- **Real-time Statistics**: Track your progress with live accuracy metrics
- **Smooth Animations**: Engaging visual feedback for correct and incorrect answers
- **Mobile Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Keyboard Shortcuts**: Press Enter to submit answers quickly

## 🚀 Getting Started

### Prerequisites

No installation required! This is a standalone HTML file that runs directly in your browser.

### Installation

1. Download the `index.html` file
2. Open it in any modern web browser (Chrome, Firefox, Safari, Edge)
3. Start practicing!

## 📖 How to Use

1. **Select a Category**: Choose from Food, Animals, or Clothes
2. **Choose Direction**: 
   - German → English: See German word, type English translation
   - English → German: See English word, type German translation (including articles)
3. **Click "Start Practice"**: Begin your learning session
4. **Type Your Answer**: Enter the translation in the input field
5. **Submit**: Click the button or press Enter
6. **Track Progress**: Watch your statistics update in real-time

## 📝 Adding More Words

You can easily expand the vocabulary by editing the HTML file:

1. Open `index.html` in a text editor
2. Find the section marked `// PASTE YOUR WORDS.JS CONTENT HERE`
3. Add new words following this format:

```javascript
{ 
  word_de: "das Haus", 
  forms: { plural: "die Häuser" }, 
  word_en: "house", 
  category: "places" 
},
```

### Word Format

- **word_de**: The German word with article (der/die/das)
- **forms.plural**: The plural form, or `null` if not applicable
- **word_en**: The English translation
- **category**: Category name (lowercase)

### Creating New Categories

Simply add words with a new category name, and they'll automatically appear in the dropdown menu!

Example categories you could add:
- `verbs` - Common German verbs
- `numbers` - Numbers in German
- `colors` - Color words
- `body` - Body parts
- `home` - Household items
- `weather` - Weather-related terms

## 🎨 Design Features

- **German Flag Colors**: Black, red, and gold theme throughout
- **Glassmorphism**: Modern frosted glass effects
- **Smooth Animations**: 
  - Slide-down header animation
  - Pulse effect on new words
  - Shake animation for incorrect answers
  - Success animation for correct answers
- **Hover Effects**: Interactive feedback on all buttons and inputs

## 📊 Statistics Tracking

The app tracks three key metrics during each practice session:

- **Correct**: Number of correct answers
- **Total**: Total number of attempts
- **Accuracy**: Percentage of correct answers

Statistics reset when you start a new practice session.

## 🌐 Browser Compatibility

Works on all modern browsers:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 📱 Mobile Support

Fully responsive design that adapts to:
- 📱 Smartphones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktop computers

## 🔧 Customization

You can customize the app by editing the CSS in the `<style>` section:

- **Colors**: Modify the gradient colors and theme
- **Fonts**: Change font families and sizes
- **Timing**: Adjust animation durations
- **Layout**: Modify spacing and sizing

## 💡 Tips for Effective Learning

1. **Start with German → English** to build recognition
2. **Switch to English → German** to practice production
3. **Focus on one category** at a time
4. **Practice regularly** for best results
5. **Pay attention to articles** (der/die/das) - they're crucial in German!

## 📄 License

This project is open source and free to use for educational purposes.

## 🤝 Contributing

Feel free to:
- Add more vocabulary words
- Create new categories
- Improve the design
- Fix bugs
- Suggest new features

## 📧 Support

If you encounter any issues or have suggestions, please feel free to reach out or submit feedback.

---

**Happy Learning! Viel Erfolg! 🎓**
