// ---------------------------------------------------------------------------
// Asset manifest
// ---------------------------------------------------------------------------

const SPRITE_KEYS = {
  ball:     'Ball.png',
  paddle:   'Paddle.png',
  capsule:  'Capsule.png',
  block100: 'Block_100%.png',
  block80:  'Block_80%.png',
  block60:  'Block_60%.png',
  block40:  'Block_40%.png',
  block20:  'Block_20%.png',
};

const SOUND_KEYS = {
  ballHitBlock:   'Ball_Hit_Block.wav',
  ballHitPaddle:  'Ball_Hit_Paddle.wav',
  ballHitWall:    'Ball_Hit_Wall.wav',
  brickBreak:     'Brick_Break.wav',
  gameOver:       'Game_Over.wav',
  levelClear:     'Level_Clear.wav',
  lifeLost:       'Life_Lost.wav',
  powerUpCollect: 'Power_Up_Collect.wav',
  powerUpSpawn:   'Power_Up_Spawn.wav',
};

// ---------------------------------------------------------------------------
// AssetLoader
// ---------------------------------------------------------------------------

class AssetLoader {
  constructor() {
    /** @type {Object.<string, HTMLImageElement>} */
    this.sprites = {};
    /** @type {Object.<string, HTMLAudioElement>} */
    this.sounds  = {};
    this.errors  = [];
    this.loaded  = false;
  }

  loadAll() {
    const spritePromises = Object.entries(SPRITE_KEYS).map(([key, file]) => {
      const path = SPRITES_PATH + encodeURIComponent(file);
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => { this.sprites[key] = img; resolve(); };
        img.onerror = () => {
          const msg = `Sprite failed to load: ${path}`;
          this.errors.push(msg);
          console.error(msg);
          resolve();
        };
        img.src = path;
      });
    });

    const soundPromises = Object.entries(SOUND_KEYS).map(([key, file]) => {
      const path = SOUNDS_PATH + encodeURIComponent(file);
      return new Promise((resolve) => {
        const audio = new Audio();
        audio.addEventListener('error', () => {
          const msg = `Sound failed to load: ${path}`;
          this.errors.push(msg);
          console.error(msg);
          resolve();
        }, { once: true });
        audio.preload    = 'auto';
        audio.src        = path;
        this.sounds[key] = audio;
        setTimeout(resolve, 100);
      });
    });

    return Promise.all([...spritePromises, ...soundPromises]).then(() => {
      this.loaded = true;
      if (this.errors.length > 0) {
        console.warn(`Asset loading finished with ${this.errors.length} error(s):`, this.errors);
      } else {
        console.log('All assets loaded successfully.');
      }
    });
  }

  play(key) {
    const audio = this.sounds[key];
    if (!audio) return;
    const clone = audio.cloneNode();
    clone.play().catch(() => {});
  }
}

const assets = new AssetLoader();
