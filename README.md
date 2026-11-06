# Ethan Wright — Portfolio

My personal portfolio site for COSC 301, live at **https://ewright407.github.io**.

It's a single-page site with these sections: About (with photo), Interests, Projects, Experience & Education (with Skills), and Contact. The sticky top navigation scrolls to each section and highlights whichever one you're reading.

## Features
- Built from scratch: no portfolio template, theme or static-site generator
- Responsive layout that collapses to one column with a hamburger menu on phones, with no horizontal scrolling
- Animated hero background: wavy vertical lines drawn on a `<canvas>` behind the About section, with two slow ripples that drift across it (a still frame for reduced-motion users)
- Dark mode toggle that follows your system setting on the first visit and remembers your choice after that
- Accessible: alt text on images, a skip-to-content link, visible keyboard focus, and text colors that meet WCAG AA contrast (4.5:1 or higher) in both themes
- Respects `prefers-reduced-motion`

## Tools & libraries
- HTML5, CSS3 (custom properties, Grid, Flexbox) and vanilla JavaScript
- [IBM Plex Sans & IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Sans) via Google Fonts
- Hosted on GitHub Pages

## Files
| File | Purpose |
|---|---|
| `index.html` | Page structure and content |
| `style.css` | All styling, theme colors and responsive rules |
| `script.js` | Dark mode, mobile menu, active-section highlighting |
| `images/` | Profile photo |

## Credits
- Contrast checked with the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Active-nav highlighting uses the browser's built-in `IntersectionObserver` API ([MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API))
- The animated line background was inspired by [wodniack.dev](https://wodniack.dev/); the code is my own
- Layout ideas came from reviewing other portfolio sites; no code was copied from them
