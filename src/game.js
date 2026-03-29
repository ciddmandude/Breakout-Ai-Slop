const STATE_START    = 'start';
const STATE_LOADING  = 'loading';
const STATE_WAITING  = 'waiting';
const STATE_PLAYING  = 'playing';
const STATE_PAUSED   = 'paused';
const STATE_GAMEOVER = 'gameover';
const STATE_VICTORY  = 'victory';

class Game {
  constructor() {
    this.lives             = DEFAULT_LIVES;
    this.score             = 0;
    this.state             = STATE_START;
    this.currentLevel      = 1;
    this.levelData         = null;
    this.ballSpeed         = BALL_SPEED;
    this.capsuleDropChance = 0.2;
    this.paddle            = new Paddle();
    this.balls             = [];
    this.capsules          = [];
    this.blocks            = [];
  }

  // -------------------------------------------------------------------------
  // Startup — called once from main.js after assets are loaded
  // -------------------------------------------------------------------------

  start() {
    this.paddle.bindInput();
    this._debugUnlocked = false;
    this._debugSeq      = [];
    const DEBUG_CODE    = ['0', '0', '7'];

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); this._handlePause(); }
      if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); this._handleAction(); }

      // Track secret code sequence (reset on any non-matching key)
      if (!this._debugUnlocked) {
        const expected = DEBUG_CODE[this._debugSeq.length];
        if (e.key === expected) {
          this._debugSeq.push(e.key);
          if (this._debugSeq.length === DEBUG_CODE.length) {
            this._debugUnlocked = true;
          }
        } else {
          this._debugSeq = e.key === DEBUG_CODE[0] ? [e.key] : [];
        }
      }

      const n = parseInt(e.key);
      if (this._debugUnlocked && this.state === STATE_START && n >= 1 && n <= TOTAL_LEVELS) {
        this.lives        = DEFAULT_LIVES;
        this.score        = 0;
        this.currentLevel = n;
        this._loadAndApplyLevel(n);
      }
    });
    canvas.addEventListener('click', () => this._handleAction());

    requestAnimationFrame(() => this._loop());
    // State starts at STATE_START — no level loaded until the user presses Space
  }

  // -------------------------------------------------------------------------
  // Level management
  // -------------------------------------------------------------------------

  _loadAndApplyLevel(num) {
    this.state = STATE_LOADING;
    loadLevel(num)
      .then(data  => this._applyLevelData(data))
      .catch(err  => console.error('Level load failed:', err));
  }

  _applyLevelData(data) {
    this.levelData         = data;
    this.blocks            = data.blocks;
    this.ballSpeed         = data.ballSpeed;
    this.capsuleDropChance = data.capsuleDropChance;
    this.paddle.color      = data.colorScheme.paddle;
    this._spawnAttachedBall();
    this.state = STATE_WAITING;
  }

  // -------------------------------------------------------------------------
  // Ball / capsule spawning
  // -------------------------------------------------------------------------

  _ballColor() {
    return this.levelData ? this.levelData.colorScheme.ball : '#ffffff';
  }

  _spawnAttachedBall() {
    this.balls    = [new Ball(
      this.paddle.x + this.paddle.w / 2,
      this.paddle.y,
      this._ballColor()
    )];
    this.capsules = [];
  }

  _spawnExtraBall() {
    const ball = new Ball(
      this.paddle.x + this.paddle.w / 2,
      this.paddle.y,
      this._ballColor()
    );
    ball.launch(this.ballSpeed);
    this.balls.push(ball);
  }

  // -------------------------------------------------------------------------
  // Input
  // -------------------------------------------------------------------------

  _handlePause() {
    if (this.state === STATE_PLAYING) {
      this.state = STATE_PAUSED;
    } else if (this.state === STATE_PAUSED) {
      this.state = STATE_PLAYING;
    }
  }

  _handleAction() {
    switch (this.state) {
      case STATE_START:
        // Begin a fresh run
        this.lives        = DEFAULT_LIVES;
        this.score        = 0;
        this.currentLevel = 1;
        this._loadAndApplyLevel(1);
        break;

      case STATE_WAITING:
        this.balls[0].launch(this.ballSpeed);
        this.state = STATE_PLAYING;
        break;

      case STATE_GAMEOVER:
      case STATE_VICTORY:
        this.state = STATE_START;
        break;
    }
  }

  // -------------------------------------------------------------------------
  // Game loop
  // -------------------------------------------------------------------------

  _loop() {
    this._update();
    this._draw();
    requestAnimationFrame(() => this._loop());
  }

  // -------------------------------------------------------------------------
  // Update
  // -------------------------------------------------------------------------

  _update() {
    if (this.state === STATE_START    ||
        this.state === STATE_LOADING  ||
        this.state === STATE_GAMEOVER ||
        this.state === STATE_VICTORY  ||
        this.state === STATE_PAUSED) return;

    this.paddle.update();
    for (const ball of this.balls) ball.update(this.paddle);

    if (this.state !== STATE_PLAYING) return;

    for (const ball of this.balls) {
      this._checkBlockCollisions(ball);
    }

    this._updateCapsules();

    this.balls = this.balls.filter(b => !b.isLost());

    if (this.balls.length === 0) {
      this.lives--;
      assets.play('lifeLost');
      if (this.lives <= 0) {
        assets.play('gameOver');
        saveHighScore(this.score);
        this.state = STATE_GAMEOVER;
      } else {
        this._spawnAttachedBall();
        this.state = STATE_WAITING;
      }
      return;
    }

    // Level cleared
    if (this.blocks.every(b => !b.alive)) {
      assets.play('levelClear');
      if (this.currentLevel === TOTAL_LEVELS) {
        saveHighScore(this.score);
        this.state = STATE_VICTORY;
      } else {
        this.currentLevel++;
        this._loadAndApplyLevel(this.currentLevel);
      }
    }
  }

  _checkBlockCollisions(ball) {
    for (const block of this.blocks) {
      if (!block.alive) continue;
      if (ballBlockCollision(ball, block)) {
        const destroyed = block.hit();
        if (destroyed) {
          assets.play('brickBreak');
          this.score += block.maxHealth * 100;
          this._tryDropCapsule(block);
        } else {
          assets.play('ballHitBlock');
        }
        break;
      }
    }
  }

  _tryDropCapsule(block) {
    if (Math.random() < this.capsuleDropChance) {
      const capsuleColor = this.levelData ? this.levelData.colorScheme.capsule : '#ffdd57';
      this.capsules.push(new Capsule(
        block.x + block.w / 2,
        block.y + block.h / 2,
        capsuleColor
      ));
      assets.play('powerUpSpawn');
    }
  }

  _updateCapsules() {
    for (const capsule of this.capsules) {
      capsule.update();

      if (!capsule.isGone() &&
          capsule.x + capsule.w > this.paddle.x &&
          capsule.x             < this.paddle.x + this.paddle.w &&
          capsule.y + capsule.h >= this.paddle.y &&
          capsule.y             <= this.paddle.y + this.paddle.h) {
        capsule.collect();
        this._spawnExtraBall();
        assets.play('powerUpCollect');
      }
    }
    this.capsules = this.capsules.filter(c => !c.isGone());
  }

  // -------------------------------------------------------------------------
  // Draw
  // -------------------------------------------------------------------------

  _draw() {
    if (this.state === STATE_START) {
      drawStartScreen();
      return;
    }

    // Background
    const bg = this.levelData ? this.levelData.colorScheme.background : '#08081a';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (this.state === STATE_LOADING) {
      this._drawMessage('Loading…');
      return;
    }

    for (const block   of this.blocks)   block.draw();
    for (const capsule of this.capsules) capsule.draw();
    for (const ball    of this.balls)    ball.draw();
    this.paddle.draw();
    this._drawHUD();

    if (this.state === STATE_WAITING) {
      this._drawMessage('Press SPACE or click to launch');
    } else if (this.state === STATE_PAUSED) {
      this._drawPauseOverlay();
    } else if (this.state === STATE_GAMEOVER) {
      drawGameOverScreen(this.score);
    } else if (this.state === STATE_VICTORY) {
      drawVictoryScreen(this.score);
    }
  }

  _drawHUD() {
    const hud = this.levelData ? this.levelData.hud : {
      background: '#0f0f1a', text: '#ffffff', label: '#aaaacc', accent: '#e94560',
    };

    ctx.fillStyle = hud.background;
    ctx.fillRect(0, 0, CANVAS_WIDTH, HUD_HEIGHT);

    // Score
    ctx.fillStyle = hud.label;
    ctx.font      = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('SCORE', 20, 18);
    ctx.fillStyle = hud.text;
    ctx.font      = 'bold 18px monospace';
    ctx.fillText(this.score, 20, 38);

    // Ball count
    if (this.balls.length > 1) {
      ctx.fillStyle = hud.accent;
      ctx.font      = '11px monospace';
      ctx.fillText(`BALLS ×${this.balls.length}`, 130, 30);
    }

    // Level name
    const levelName = this.levelData ? this.levelData.name : '';
    ctx.fillStyle   = hud.accent;
    ctx.font        = 'bold 14px monospace';
    ctx.textAlign   = 'center';
    ctx.fillText(levelName, CANVAS_WIDTH / 2, 30);

    // Lives icons
    ctx.fillStyle = hud.label;
    ctx.font      = '11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('LIVES', CANVAS_WIDTH - 20, 18);
    for (let i = 0; i < this.lives; i++) {
      const ix = CANVAS_WIDTH - 20 - (i + 1) * (BALL_SIZE + 6);
      if (assets.sprites.ball) {
        drawTinted(assets.sprites.ball, this._ballColor(), ix, 24, BALL_SIZE, BALL_SIZE);
      }
    }

    ctx.textAlign = 'left';

    ctx.strokeStyle = hud.accent;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(0, HUD_HEIGHT);
    ctx.lineTo(CANVAS_WIDTH, HUD_HEIGHT);
    ctx.stroke();
  }

  _drawPauseOverlay() {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, HUD_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT - HUD_HEIGHT);
    ctx.fillStyle = '#ffffff';
    ctx.font      = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);
    ctx.font      = '14px monospace';
    ctx.fillStyle = '#ffffffaa';
    ctx.fillText('Press ESC to resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    ctx.restore();
  }

  _drawMessage(text, color = '#ffffffcc') {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font      = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 24);
    ctx.restore();
  }
}
