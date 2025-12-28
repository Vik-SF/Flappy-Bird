# 🐦 Flappy Bird

A fun, addictive HTML5 game where you guide a cute bird through obstacles! Tap or hold to fly, avoid obstacles, and beat your high score.

![Flappy Bird](https://img.shields.io/badge/Status-Playable-brightgreen) ![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎮 How to Play

### Objective
Fly as far as you can without hitting obstacles! Pass through gaps to score points.

### Controls
- **🖱️ Mouse**: Click or hold anywhere to flap
- **⌨️ Keyboard**: Press or hold Spacebar to flap
- **📱 Touch**: Tap or hold on screen to flap (iPad/Mobile)

**Pro Tip**: Hold down to continuously flap for easier control!

## ✨ Features

### 🐦 Cute Cartoon Bird
- Adorable yellow bird with animated wings
- Smooth rotation based on flight velocity
- Full animations: idle, flapping, diving, and crash
- Expressive eyes and rosy cheeks

### 🌈 Dynamic Backgrounds
The background automatically changes every 20 seconds:
- ☀️ **Daytime** - Bright blue sky with floating clouds and sun
- 🌙 **Nighttime** - Dark sky with moon and twinkling stars
- 🏙️ **City Sunset** - Beautiful gradient with parallax scrolling buildings

### 🚧 Three Types of Obstacles
- **🟢 Classic Pipes** - Navigate through top and bottom pipes
- **🔴 Moving Obstacles** - Blocks that move up and down
- **🟣 Rotating Blades** - Spinning obstacles to dodge

Each obstacle type is randomly selected to keep gameplay fresh and challenging!

### 📊 Triple Scoring System
Track your performance three ways:
- **Score** - Points earned for each obstacle passed
- **Distance** - Total meters traveled
- **Time** - Seconds survived

### ⚡ Progressive Difficulty
- Game starts easy and gradually gets harder
- Speed increases as you score more points
- Obstacles maintain consistent spacing (350px minimum)
- Pipe gaps are generous (200px) for fair gameplay

### 🏆 High Score Tracking
- Your best score is saved in browser storage
- Compete against yourself to beat your record
- Stats displayed on game over screen

### 🎵 Sound Effects & Music
- **Flap sound** - Satisfying feedback when you tap
- **Score sound** - Rewarding "ding" for each obstacle cleared
- **Crash sound** - Game over impact effect
- **Background music** - Ambient space-like drone for atmosphere

### 📱 Mobile Optimized
- Fully responsive design
- Touch controls work perfectly on iPad and mobile devices
- Prevents pull-to-refresh interference
- Optimized for both portrait and landscape orientations
- No scrolling or unwanted selections

### 💥 Visual Polish
- Particle explosion effects on crash
- Smooth animations and transitions
- Shadow effects for depth
- Professional UI with rounded corners

## 🚀 Getting Started

### Option 1: Open Directly
Simply open `index.html` in any modern web browser:
```bash
open index.html
```

### Option 2: Local Server (Recommended)
For best results, run with a local server:

**Using Python 3:**
```bash
python3 -m http.server 8888
```

**Using Node.js (http-server):**
```bash
npx http-server -p 8888
```

Then visit: `http://localhost:8888`

## 📁 File Structure

```
The New Game/
│
├── index.html          # Main HTML structure
├── style.css           # All styling and responsive design
├── game.js             # Complete game logic and physics
└── README.md           # This file
```

## 🎯 Game Mechanics

### Physics
- **Gravity**: 0.4 (gentle falling)
- **Flap Power**: -8 (smooth upward boost)
- **Bird Radius**: 20px collision detection
- **Obstacle Speed**: 1.5x (increases with difficulty)

### Difficulty Scaling
- Difficulty increases by 0.01 per point scored
- Affects obstacle speed and spawn rate
- Pipe gaps slightly decrease at higher difficulties
- Minimum obstacle spacing always maintained

### Collision Detection
- Precise collision for pipes (rectangle vs circle)
- Moving obstacles use rectangle collision
- Rotating blades use angle-based blade detection
- Generous hitboxes for fair gameplay

## 🛠️ Technical Details

### Technologies
- **Pure HTML5** - No frameworks required
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Clean, modular code
- **Canvas API** - Hardware-accelerated rendering
- **Web Audio API** - Procedural sound generation
- **LocalStorage** - High score persistence

### Browser Support
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari (desktop & iOS)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- Runs at smooth 60 FPS
- Efficient canvas rendering
- No external dependencies
- Small file size (~25KB total)

## 🎨 Customization

Want to modify the game? Here are some easy tweaks:

### Make it Easier/Harder
In `game.js`, adjust:
```javascript
// Line ~71-72: Bird physics
this.gravity = 0.4;     // Lower = easier, Higher = harder
this.flapPower = -8;    // More negative = stronger flap

// Line ~183: Pipe gap size
this.gap = 200;         // Bigger = easier
```

### Change Obstacle Spacing
```javascript
// Line ~349
const MIN_OBSTACLE_DISTANCE = 350; // Increase for more space
```

### Adjust Difficulty Progression
```javascript
// Line ~656
game.difficulty = 1 + game.score * 0.01; // Lower multiplier = slower increase
```

## 🏅 Tips & Strategies

1. **Hold Don't Tap** - Holding makes it easier to control height
2. **Stay Centered** - Keep the bird in the middle of the screen
3. **Anticipate Movement** - Moving obstacles have predictable patterns
4. **Watch Rotating Blades** - Wait for a clear opening
5. **Don't Rush** - Obstacles are well-spaced, take your time
6. **Practice** - Your high score will improve with each attempt!

## 🐛 Known Issues

None currently! If you find any bugs, please report them.

## 📝 Future Enhancements

Potential features for future versions:
- Different bird skins/colors
- Power-ups (shields, slow-motion)
- Leaderboard system
- Achievements
- More background themes
- Custom obstacle editor
- Multiplayer mode

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

Created with love for casual gaming enthusiasts!

**Enjoy the game and happy flying!** 🐦✨

---

**Current Version**: 1.0  
**Last Updated**: December 2025

