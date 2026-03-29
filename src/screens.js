// ---------------------------------------------------------------------------
// Screens — Start, Game Over, Victory
// Depends on: constants.js, main.js (ctx, CANVAS_WIDTH/HEIGHT)
// ---------------------------------------------------------------------------

const HIGH_SCORE_KEY = 'breakout-highscore';

function getHighScore() {
  return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
}

function saveHighScore(score) {
  if (score > getHighScore()) {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
  }
}

// ---------------------------------------------------------------------------

function drawStartScreen() {
  const hs = getHighScore();

  ctx.fillStyle = '#08081a';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font      = 'bold 56px monospace';
  ctx.fillText('BREAKOUT', CANVAS_WIDTH / 2, 150);

  ctx.fillStyle = '#e94560';
  ctx.font      = '15px monospace';
  ctx.fillText('AI SLOP EDITION', CANVAS_WIDTH / 2, 190);

  // Divider
  ctx.strokeStyle = '#e94560';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH / 2 - 120, 215);
  ctx.lineTo(CANVAS_WIDTH / 2 + 120, 215);
  ctx.stroke();

  // High score
  ctx.fillStyle = '#aaaacc';
  ctx.font      = '12px monospace';
  ctx.fillText('HIGH SCORE', CANVAS_WIDTH / 2, 250);
  ctx.fillStyle = hs > 0 ? '#ffd700' : '#555577';
  ctx.font      = 'bold 26px monospace';
  ctx.fillText(hs > 0 ? hs : '---', CANVAS_WIDTH / 2, 282);

  // Prompt
  ctx.fillStyle = '#ffffffbb';
  ctx.font      = '15px monospace';
  ctx.fillText('Press SPACE or click to start', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 70);
}

// ---------------------------------------------------------------------------

function drawGameOverScreen(score) {
  const hs      = getHighScore();
  const isNewHs = score > 0 && score >= hs;

  // Dark overlay over the frozen game field
  ctx.fillStyle = 'rgba(0,0,0,0.78)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.textAlign = 'center';

  ctx.fillStyle = '#e94560';
  ctx.font      = 'bold 44px monospace';
  ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, 195);

  // Score
  ctx.fillStyle = '#aaaacc';
  ctx.font      = '12px monospace';
  ctx.fillText('SCORE', CANVAS_WIDTH / 2, 260);
  ctx.fillStyle = '#ffffff';
  ctx.font      = 'bold 30px monospace';
  ctx.fillText(score, CANVAS_WIDTH / 2, 293);

  // High score
  ctx.fillStyle = '#aaaacc';
  ctx.font      = '12px monospace';
  ctx.fillText('HIGH SCORE', CANVAS_WIDTH / 2, 335);
  ctx.fillStyle = isNewHs ? '#ffd700' : '#ffffff';
  ctx.font      = 'bold 26px monospace';
  ctx.fillText(hs, CANVAS_WIDTH / 2, 366);

  if (isNewHs) {
    ctx.fillStyle = '#ffd700';
    ctx.font      = '13px monospace';
    ctx.fillText('NEW HIGH SCORE!', CANVAS_WIDTH / 2, 393);
  }

  ctx.fillStyle = '#ffffffbb';
  ctx.font      = '15px monospace';
  ctx.fillText('Press SPACE or click to return to menu', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 70);
}

// ---------------------------------------------------------------------------

function drawVictoryScreen(score) {
  const hs      = getHighScore();
  const isNewHs = score > 0 && score >= hs;

  ctx.fillStyle = 'rgba(0,0,0,0.82)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.textAlign = 'center';

  ctx.fillStyle = '#ffd700';
  ctx.font      = 'bold 44px monospace';
  ctx.fillText('YOU WIN!', CANVAS_WIDTH / 2, 175);

  ctx.fillStyle = '#e5e4e2';
  ctx.font      = '15px monospace';
  ctx.fillText('All 10 levels cleared!', CANVAS_WIDTH / 2, 210);

  // Divider
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH / 2 - 140, 232);
  ctx.lineTo(CANVAS_WIDTH / 2 + 140, 232);
  ctx.stroke();

  // Score
  ctx.fillStyle = '#aaaacc';
  ctx.font      = '12px monospace';
  ctx.fillText('FINAL SCORE', CANVAS_WIDTH / 2, 268);
  ctx.fillStyle = '#ffffff';
  ctx.font      = 'bold 30px monospace';
  ctx.fillText(score, CANVAS_WIDTH / 2, 301);

  // High score
  ctx.fillStyle = '#aaaacc';
  ctx.font      = '12px monospace';
  ctx.fillText('HIGH SCORE', CANVAS_WIDTH / 2, 342);
  ctx.fillStyle = isNewHs ? '#ffd700' : '#ffffff';
  ctx.font      = 'bold 26px monospace';
  ctx.fillText(hs, CANVAS_WIDTH / 2, 373);

  if (isNewHs) {
    ctx.fillStyle = '#ffd700';
    ctx.font      = '13px monospace';
    ctx.fillText('NEW HIGH SCORE!', CANVAS_WIDTH / 2, 400);
  }

  ctx.fillStyle = '#ffffffbb';
  ctx.font      = '15px monospace';
  ctx.fillText('Press SPACE or click to play again', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 70);
}
