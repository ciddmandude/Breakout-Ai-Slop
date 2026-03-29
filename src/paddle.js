class Paddle {
  /**
   * @param {string} color  '#rrggbb' tint for the sprite (updated per level)
   */
  constructor(color = '#ffffff') {
    this.w      = PADDLE_WIDTH;
    this.h      = PADDLE_HEIGHT;
    this.x      = (CANVAS_WIDTH - this.w) / 2;
    this.y      = CANVAS_HEIGHT - PADDLE_BOTTOM_MARGIN - this.h;
    this.color  = color;

    this._keys   = { left: false, right: false };
    this._mouseX = null;   // null = not yet moved; mouse takes priority when set
  }

  // Attach keyboard and mouse listeners. Call once at game start.
  bindInput() {
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') { this._keys.left  = true;  this._mouseX = null; }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { this._keys.right = true;  this._mouseX = null; }
    });

    document.addEventListener('keyup', e => {
      if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') this._keys.left  = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this._keys.right = false;
    });

    canvas.addEventListener('mousemove', e => {
      const rect   = canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      this._mouseX = (e.clientX - rect.left) * scaleX - this.w / 2;
      this._clamp();
    });

    canvas.addEventListener('mouseleave', () => { this._mouseX = null; });
  }

  update() {
    if (this._mouseX !== null) {
      this.x = this._mouseX;
    } else {
      if (this._keys.left)  this.x -= PADDLE_SPEED;
      if (this._keys.right) this.x += PADDLE_SPEED;
    }
    this._clamp();
  }

  _clamp() {
    this.x = Math.max(0, Math.min(CANVAS_WIDTH - this.w, this.x));
  }

  draw() {
    if (assets.sprites.paddle) {
      drawTinted(assets.sprites.paddle, this.color, Math.round(this.x), this.y, this.w, this.h);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(Math.round(this.x), this.y, this.w, this.h);
    }
  }
}
