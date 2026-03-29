class Capsule {
  /**
   * @param {number} cx     horizontal centre of the block that dropped this capsule
   * @param {number} cy     vertical centre of the block
   * @param {string} color  '#rrggbb' tint (from level colorScheme.capsule)
   */
  constructor(cx, cy, color = '#ffdd57') {
    const img  = assets.sprites.capsule;
    this.h     = CAPSULE_HEIGHT;
    this.w     = img
      ? Math.round(this.h * (img.naturalWidth / img.naturalHeight))
      : Math.round(this.h * 0.45);
    this.x     = cx - this.w / 2;
    this.y     = cy;
    this.vy    = CAPSULE_FALL_SPEED;
    this.color = color;
    this._gone = false;
  }

  update() {
    this.y += this.vy;
  }

  collect() {
    this._gone = true;
  }

  isGone() {
    return this._gone || this.y > CANVAS_HEIGHT;
  }

  draw() {
    const img = assets.sprites.capsule;
    if (img) {
      drawTinted(img, this.color, Math.round(this.x), Math.round(this.y), this.w, this.h);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(Math.round(this.x), Math.round(this.y), this.w, this.h);
    }
  }
}
