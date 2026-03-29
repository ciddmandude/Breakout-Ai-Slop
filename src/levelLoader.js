// ---------------------------------------------------------------------------
// Level loader — fetches and parses level_XX.json files.
// Depends on: constants.js (BLOCK_W, BLOCK_H, BLOCK_GAP_X/Y, BLOCK_OFFSET_Y,
//             CANVAS_WIDTH), block.js (Block class)
// ---------------------------------------------------------------------------

/**
 * Turn a raw JSON object (already parsed) into a usable level descriptor.
 *
 * Grid cell values:
 *   0  → empty
 *   1  → block type 1: hp = blockHealth[0], color = blockColors[0]
 *   2  → block type 2: hp = blockHealth[1], color = blockColors[1]
 *   3  → block type 3: hp = blockHealth[2], color = blockColors[2]
 *   4  → block type 4: hp = blockHealth[3], color = blockColors[3]
 */
function _buildLevel(data) {
  const palette     = data.colorScheme.blockColors;
  const blockHealth = data.blockHealth;
  const blocks      = [];
  const grid        = data.grid || [];

  if (grid.length > 0) {
    const numCols = Math.max(...grid.map(row => row.length));
    const totalW  = numCols * (BLOCK_W + BLOCK_GAP_X) - BLOCK_GAP_X;
    const offsetX = (CANVAS_WIDTH - totalW) / 2;

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const type = grid[row][col];
        if (!type) continue;

        const idx   = type - 1;   // 1-based → 0-based
        const hp    = blockHealth[idx];
        const color = palette[Math.min(idx, palette.length - 1)];
        const x     = offsetX + col * (BLOCK_W + BLOCK_GAP_X);
        const y     = BLOCK_OFFSET_Y + row * (BLOCK_H + BLOCK_GAP_Y);
        blocks.push(new Block(x, y, hp, color));
      }
    }
  }

  return {
    level:             data.level,
    name:              data.name,
    colorScheme:       data.colorScheme,
    hud:               data.hud,
    ballSpeed:         data.ballSpeed         ?? BALL_SPEED,
    capsuleDropChance: data.capsuleDropChance ?? 0.2,
    blocks,
  };
}

/**
 * Fetch and parse a level by 1-based number.
 * NOTE: requires the page to be served over HTTP (e.g. VS Code Live Server
 *       or `python -m http.server`) — fetch() is blocked on file:// URLs.
 *
 * @param  {number}  levelNum   1–10
 * @returns {Promise<object>}   resolved level descriptor
 */
async function loadLevel(levelNum) {
  const pad      = String(levelNum).padStart(2, '0');
  const url      = `levels/level_${pad}.json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
  const data = await response.json();
  return _buildLevel(data);
}
