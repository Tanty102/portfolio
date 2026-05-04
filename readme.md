# ✦ Nguyễn Tấn Tỵ — Portfolio

> Personal portfolio website built with vanilla HTML, CSS & JavaScript.

## 🌐 Live Demo

_Coming soon_

## ✨ Features

- 🎨 **Futuristic neon design** — Dark/light theme with glassmorphism effects
- 🌍 **Multilingual** — Vietnamese, English, Japanese
- 📱 **Fully responsive** — Mobile-first approach
- ⚡ **Performance-optimized** — Lazy loading, reduced animations on low-end devices
- 🎭 **Smooth animations** — GSAP ScrollTrigger, parallax, particles
- 🔠 **Typing effect** — Dynamic role typing in hero section
- 📂 **Project gallery** — Filterable grid with modal detail view
- 📅 **Timeline** — Interactive experience timeline
- 🎓 **Education** — Verified academic credentials
- 📬 **Contact form** — With real-time validation
- 🥚 **Easter eggs** — Konami code, rainbow mode

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| Structure | HTML5, Semantic markup |
| Styling | Vanilla CSS, CSS Custom Properties, Glassmorphism |
| Logic | Vanilla JavaScript (ES6+) |
| Animation | GSAP 3, ScrollTrigger, CSS Animations |
| Fonts | Google Fonts (Inter, Space Grotesk, JetBrains Mono) |

## 📂 Project Structure

```
Portfolio/
├── index.html              # Main HTML
├── css/
│   ├── variables.css       # Design tokens
│   ├── base.css            # Reset & typography
│   ├── animations.css      # Keyframe animations
│   ├── components.css      # Reusable components
│   ├── sections.css        # Section-specific styles
│   └── responsive.css      # Media queries
├── js/
│   ├── app.js              # Entry point
│   ├── i18n.js             # Internationalization
│   ├── particles.js        # Particle canvas
│   ├── cursor.js           # Custom cursor
│   ├── navbar.js           # Navigation
│   ├── theme.js            # Dark/light toggle
│   ├── animations.js       # GSAP scroll animations
│   ├── tilt.js             # 3D tilt effect
│   ├── magnetic.js         # Magnetic buttons
│   ├── skills.js           # Skills grid
│   ├── projects.js         # Projects + modal
│   ├── timeline.js         # Experience timeline
│   ├── form.js             # Contact form
│   ├── scroll-top.js       # Scroll to top
│   └── easter-eggs.js      # Hidden interactions
├── data/
│   ├── skills.json         # Skills data
│   ├── projects.json       # Projects data
│   ├── experience.json     # Work experience
│   └── i18n/               # Translation files
│       ├── vi.json
│       ├── en.json
│       └── ja.json
└── assets/
    └── images/             # Project screenshots
```

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/portfolio.git

# Open with a local server (required for fetch API)
# Option 1: VS Code Live Server extension
# Option 2: Python
python -m http.server 8000

# Option 3: Node.js
npx serve .
```

> ⚠️ Opening `index.html` directly via `file://` will cause CORS issues with JSON data loading. Always use a local HTTP server.

## 📄 License

© 2026 Nguyễn Tấn Tỵ. All rights reserved.
