# KidsQuids

A colorful mouse learning game for children aged 3-6 years.

**[Play Now](https://crandler.github.io/KidsQuids/)**

## Features

- **4 Game Modes:**
  - Click Fun - Click on shapes
  - Shape Catcher - Catch moving shapes
  - Puzzle Slider - Drag & drop shapes to targets
  - Double Pop - Double-click to pop shapes

- **3 Difficulty Levels:**
  - Starter (3-4 years)
  - Explorer (4-5 years)
  - Champion (5-6 years)

- **Progression System:**
  - Stars and coins rewards
  - Unlockable game modes
  - Unlockable color themes
  - Progress saved locally

- **Child-Friendly Design:**
  - Bright, cheerful colors
  - Cute animated shapes with faces
  - Positive feedback sounds
  - No frustration mechanics

- **Internationalization:**
  - German (DE)
  - English (EN)

## Tech Stack

- HTML5 Canvas
- Vanilla JavaScript (ES6+)
- CSS3 with animations
- Web Audio API for sounds
- LocalStorage for progress

## Getting Started

Simply open `index.html` in a modern web browser. No build step or server required.

```bash
# Or use a local server for development
npx serve .
# Then open http://localhost:3000
```

## Project Structure

```
KidsQuids/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles
├── js/
│   ├── game.js         # Main game logic
│   ├── shapes.js       # Shape classes and rendering
│   ├── levels.js       # Level configurations
│   ├── sounds.js       # Sound manager (Web Audio API)
│   ├── storage.js      # Progress persistence
│   └── i18n.js         # Internationalization
├── assets/
│   └── sounds/         # Sound files (currently using Web Audio API)
└── README.md
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Version History

### v1.0.0 (2025-11-26)
- Initial release
- 4 game modes: Click, Catch, Drag, Double-click
- 3 difficulty levels with progression
- i18n support (DE/EN)
- 4 color themes (1 unlocked, 3 unlockable)
- Sound effects via Web Audio API
- Local storage for game progress

---

Made with love for Lia & Tim
