// ---------------------------------------------------------------------------
// Canvas setup  (must run before any class that references ctx / canvas)
// ---------------------------------------------------------------------------

const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');

canvas.width  = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// ---------------------------------------------------------------------------
// Tint helper
// ---------------------------------------------------------------------------

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let hDeg = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hDeg = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: hDeg = ((b - r) / d + 2) / 6; break;
      case b: hDeg = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: hDeg * 360, s: s * 100, l: l * 100 };
}

function drawTinted(img, color, x, y, w, h) {
  const hsl          = hexToHsl(color);
  const hueRotation  = hsl.h - 35;
  const saturation   = (hsl.s / 70) * 4;
  const brightness   = hsl.l / 50;

  ctx.save();
  ctx.filter = `sepia(1) hue-rotate(${hueRotation}deg) saturate(${saturation}) brightness(${brightness})`;
  ctx.drawImage(img, x, y, w, h);
  ctx.filter = 'none';
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Boot — NOTE: this milestone requires the page to be served over HTTP.
// Use VS Code Live Server, `python -m http.server`, or any local web server.
// fetch() is blocked on file:// URLs in modern browsers.
// ---------------------------------------------------------------------------

assets.loadAll().then(() => {
  const game = new Game();
  game.start();
});
