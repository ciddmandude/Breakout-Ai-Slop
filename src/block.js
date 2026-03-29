class Block {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} maxHealth  any positive integer
   * @param {string} color      '#rrggbb' tint applied at draw time
   */
  constructor(x, y, maxHealth, color) {
    this.x             = x;
    this.y             = y;
    this.w             = BLOCK_W;
    this.h             = BLOCK_H;
    this.maxHealth     = maxHealth;
    this.currentHealth = maxHealth;
    this.color         = color;
    this.alive         = true;
  }

  // Returns the sprite key that matches the current health percentage,
  // rounded up to the nearest 20 (always one of 20/40/60/80/100).
  _spriteKey() {
    const step = Math.ceil((this.currentHealth / this.maxHealth) * 5) * 20;
    return `block${Math.min(Math.max(step, 20), 100)}`;
  }

  // Reduce health by 1. Returns true if the block was just destroyed.
  hit() {
    this.currentHealth--;
    if (this.currentHealth <= 0) {
      this.alive = false;
      return true;
    }
    return false;
  }

  draw() {
    if (!this.alive) return;
    const sprite = assets.sprites[this._spriteKey()];
    if (sprite) {
      drawTinted(sprite, this.color, this.x, this.y, this.w, this.h);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
  }
}
