class Ball {
  /**
   * @param {number} x      initial centre-x
   * @param {number} y      initial centre-y
   * @param {string} color  '#rrggbb' tint applied at draw time (default white)
   */
  constructor(x, y, color = '#ffffff') {
    this.w        = BALL_SIZE;
    this.h        = BALL_SIZE;
    this.x        = x - this.w / 2;
    this.y        = y - this.h;
    this.vx       = 0;
    this.vy       = 0;
    this.color    = color;
    this.attached = true;   // sitting on the paddle before first launch
  }

  // Snap the ball to the centre-top of the paddle (called every frame while attached).
  attachTo(paddle) {
    this.x = paddle.x + paddle.w / 2 - this.w / 2;
    this.y = paddle.y - this.h;
  }

  // Detach and fire upward with a slight random spread.
  launch(speed = BALL_SPEED) {
    if (!this.attached) return;
    this.attached = false;
    const spread = (Math.random() - 0.5) * (Math.PI / 4); // ±22.5°
    this.vx =  speed * Math.sin(spread);
    this.vy = -speed * Math.cos(spread);
  }

  // Move one frame and resolve wall / ceiling / paddle collisions.
  update(paddle) {
    if (this.attached) {
      this.attachTo(paddle);
      return;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Left wall
    if (this.x < 0) {
      this.x = 0;
      this.vx = Math.abs(this.vx);
      assets.play('ballHitWall');
    }

    // Right wall
    if (this.x + this.w > CANVAS_WIDTH) {
      this.x = CANVAS_WIDTH - this.w;
      this.vx = -Math.abs(this.vx);
      assets.play('ballHitWall');
    }

    // Ceiling (below the HUD strip)
    if (this.y < HUD_HEIGHT) {
      this.y = HUD_HEIGHT;
      this.vy = Math.abs(this.vy);
      assets.play('ballHitWall');
    }

    // Paddle — only test when ball is moving downward
    if (this.vy > 0) {
      const ballBottom = this.y + this.h;
      const ballLeft   = this.x;
      const ballRight  = this.x + this.w;

      const inXRange   = ballRight > paddle.x && ballLeft < paddle.x + paddle.w;
      const hitSurface = ballBottom >= paddle.y && ballBottom <= paddle.y + paddle.h + Math.abs(this.vy);

      if (inXRange && hitSurface) {
        this.y = paddle.y - this.h;

        const hitNorm  = ((this.x + this.w / 2) - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
        const maxAngle = Math.PI / 3;   // 60° from vertical
        const angle    = hitNorm * maxAngle;
        const speed    = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

        this.vx = speed * Math.sin(angle);
        this.vy = -speed * Math.cos(angle);   // always upward

        assets.play('ballHitPaddle');
      }
    }
  }

  isLost() {
    return this.y > CANVAS_HEIGHT;
  }

  draw() {
    if (assets.sprites.ball) {
      drawTinted(assets.sprites.ball, this.color, Math.round(this.x), Math.round(this.y), this.w, this.h);
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
