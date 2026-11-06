// ---------- Dark mode toggle ----------
const root = document.documentElement;
const themeBtn = document.querySelector(".theme-toggle");

function setThemeLabel() {
  const dark = root.dataset.theme === "dark";
  themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
}

// First visit: follow the operating system setting.
if (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches) {
  root.dataset.theme = "dark";
}
setThemeLabel();

themeBtn.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  setThemeLabel();
});

// ---------- Mobile menu ----------
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
});

// Close the menu after choosing a section.
navLinks.querySelectorAll("a").forEach(link =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// ---------- Highlight the current section in the nav ----------
const sections = document.querySelectorAll("main section[id]");
const navAnchors = navLinks.querySelectorAll('a[href^="#"]');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(a =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
    );
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach(s => observer.observe(s));

// ---------- Flowing line background ----------
// Vertical lines that are never quite straight: each one is bent by a few
// slow, overlapping sine waves. On top of that, a ripple band drifts
// diagonally across the screen every so often, bunching the lines up as it passes.
(function flowingLines() {
  const canvas = document.getElementById("ripple-bg");
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const GAP = 14;            // px between lines
  const STEP = 8;            // px between points along a line
  const PASS_MS = 26000;     // time for one ripple to cross the screen

  let w, h, color;
  const fronts = [0, 0];     // where each ripple band is this frame

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const box = canvas.parentElement.getBoundingClientRect();
    w = box.width; h = box.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(performance.now());
  }

  function readColor() {
    color = getComputedStyle(document.documentElement).getPropertyValue("--line").trim();
  }

  // How far (in px) to push the line that starts at x0, at height y, at time t.
  function offset(x0, y, t) {
    // Base waviness: always moving a little, so lines are never straight.
    let dx = 7 * Math.sin(y * 0.0045 + x0 * 0.004 + t * 0.00022)
           + 4 * Math.sin(y * 0.012 - x0 * 0.007 - t * 0.00031)
           + 2 * Math.sin(y * 0.03 + x0 * 0.02 + t * 0.0005);

    // The two travelling ripple bands. Points far from a band are skipped,
    // which keeps each frame cheap.
    const along = x0 * 0.8 + y * 0.6;
    for (let k = 0; k < 2; k++) {
      const d = along - fronts[k];                 // distance from the band's centre
      if (d > 450 || d < -450) continue;
      const band = Math.exp(-(d * d) / 45000);     // 45000 = 2 * 150²
      dx += band * 36 * Math.sin(d * 0.022);
    }
    return dx;
  }

  function draw(t) {
    // Two ripples, half a lap apart, so one or two are always on screen.
    const span = w * 0.8 + h * 0.6 + 600;
    for (let k = 0; k < 2; k++) fronts[k] = ((t / PASS_MS + k / 2) % 1) * span - 300;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x0 = -GAP * 3; x0 < w + GAP * 3; x0 += GAP) {
      for (let y = -STEP; y <= h + STEP; y += STEP) {
        const px = x0 + offset(x0, y, t);
        y === -STEP ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
      }
    }
    ctx.stroke();
  }

  // Only animate while the top section is on screen.
  let visible = true, running = false;
  function loop(t) {
    if (!visible) { running = false; return; }
    draw(t);                     // every frame, at the screen's full refresh rate
    requestAnimationFrame(loop);
  }
  function start() {
    if (!running && !reduceMotion) { running = true; requestAnimationFrame(loop); }
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
  }).observe(canvas.parentElement);

  // Redraw in the new color when the theme changes.
  new MutationObserver(() => { readColor(); draw(performance.now()); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  readColor();
  new ResizeObserver(resize).observe(canvas.parentElement);
  resize();
  start();   // reduced motion: start() does nothing, so one still frame is shown
})();

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
