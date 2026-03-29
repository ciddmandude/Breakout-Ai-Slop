/**
 * AABB collision between the ball and a block.
 *
 * Determines which face of the block was hit by comparing the penetration
 * depth on each axis — the axis with the smaller overlap is the one the
 * ball crossed last, so that is the face that gets the reflection.
 *
 * Mutates ball.vx / ball.vy and repositions the ball flush against the
 * block face so it does not clip through.
 *
 * @param {Ball}  ball
 * @param {Block} block
 * @returns {boolean} true if a collision occurred
 */
function ballBlockCollision(ball, block) {
  if (
    ball.x + ball.w <= block.x ||
    ball.x          >= block.x + block.w ||
    ball.y + ball.h <= block.y ||
    ball.y          >= block.y + block.h
  ) {
    return false;
  }

  const overlapLeft   = (ball.x + ball.w) - block.x;
  const overlapRight  = (block.x + block.w) - ball.x;
  const overlapTop    = (ball.y + ball.h) - block.y;
  const overlapBottom = (block.y + block.h) - ball.y;

  const minX = Math.min(overlapLeft, overlapRight);
  const minY = Math.min(overlapTop,  overlapBottom);

  if (minX < minY) {
    if (overlapLeft < overlapRight) {
      ball.vx = -Math.abs(ball.vx);
      ball.x  = block.x - ball.w;
    } else {
      ball.vx = Math.abs(ball.vx);
      ball.x  = block.x + block.w;
    }
  } else {
    if (overlapTop < overlapBottom) {
      ball.vy = -Math.abs(ball.vy);
      ball.y  = block.y - ball.h;
    } else {
      ball.vy = Math.abs(ball.vy);
      ball.y  = block.y + block.h;
    }
  }

  return true;
}
