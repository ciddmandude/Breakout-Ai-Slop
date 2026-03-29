// Canvas
const CANVAS_WIDTH  = 526;
const CANVAS_HEIGHT = 800;
const TARGET_FPS    = 60;

// HUD strip at the top of the canvas
const HUD_HEIGHT = 48;

// Default game settings
const DEFAULT_LIVES = 3;
const TOTAL_LEVELS  = 5;

// Paddle
const PADDLE_WIDTH         = 100;
const PADDLE_HEIGHT        = 18;
const PADDLE_BOTTOM_MARGIN = 48;
const PADDLE_SPEED         = 7;

// Ball — default speed used as fallback; actual speed comes from level JSON
const BALL_SIZE  = 16;
const BALL_SPEED = 4;

// Block grid layout (position/size — column count comes from level JSON)
const BLOCK_W        = 30;
const BLOCK_H        = 30;
const BLOCK_GAP_X    = 2;
const BLOCK_GAP_Y    = 2;
const BLOCK_OFFSET_Y = HUD_HEIGHT + 24;

// Capsule power-up
const CAPSULE_FALL_SPEED = 2.5;    // px per frame (speed is constant; drop chance is per level)
const CAPSULE_HEIGHT     = 14;     // render height; width derived from sprite aspect ratio

// Asset base paths — relative to index.html
const SPRITES_PATH = 'Sprites%20Small/';
const SOUNDS_PATH  = 'Sound%20Effects/';
