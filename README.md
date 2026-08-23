# Jaskeerat Singh — Portfolio

Personal portfolio site for **Jaskeerat Singh**, ML Engineer based in Jalandhar, Punjab.

🌐 **Live:** [https://JaskeeratSingh03.github.io/](https://JaskeeratSingh03.github.io/)

## Stack

- Plain **HTML5** (single page, no build step)
- Vanilla **CSS3** with theme tokens (light + auto dark mode)
- Vanilla **JavaScript** for nav toggle, smooth scroll, and scroll-reveal animations
- **Google Fonts** (Inter + Space Grotesk)
- Hosted free on **GitHub Pages**

## Project structure

```
.
├── index.html              # All content lives here
├── assets/
│   ├── css/style.css       # Theme + layout + components
│   └── js/main.js          # Tiny enhancement layer
└── README.md
```

## Editing content

| What to change | Where |
| --- | --- |
| Name, tagline, email | `index.html` → `<section id="home">` |
| Projects | `index.html` → `<section id="projects">` |
| Skills | `index.html` → `<section id="skills">` |
| Experience / Education | `index.html` → `<section id="experience">` |
| Theme colors | `assets/css/style.css` → `:root` |

## Deploy

This is a user/organization GitHub Page. After the first push to `main`:

1. Go to **Settings → Pages** on GitHub.
2. Source: **Deploy from a branch**.
3. Branch: `main`, folder: **/ (root)**.
4. Save. The site goes live at `https://JaskeeratSingh03.github.io/` within ~1 minute.

Every subsequent push to `main` redeploys automatically — no build, no CI needed.

## Theme

Purple / white / black, with automatic dark-mode support that follows your OS appearance setting.
