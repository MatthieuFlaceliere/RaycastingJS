import { PI, PI2, PI3 } from "./constant";
import { dist } from "./math";

function calculateHorizontalIntersection(player: any, ra: number, mapSize: number, mapX: number, mapY: number, worldMap: number[]): { hx: number, hy: number, distH: number } {
  let rx: number, ry: number, xo: number, yo: number;
  let distH = 100000, hx = player.x, hy = player.y;
  let dof = 0;

  const aTan = -1 / Math.tan(ra); // Inverse tangent to calculate horizontal slope

  // Facing up or down?
  if (ra > PI) {
      ry = Math.floor(player.y / mapSize) * mapSize - 0.0001; // Start from the nearest grid line above
      rx = (player.y - ry) * aTan + player.x;
      yo = -mapSize;
      xo = -yo * aTan;
  } else if (ra < PI) {
      ry = Math.floor(player.y / mapSize) * mapSize + mapSize; // Start from the nearest grid line below
      rx = (player.y - ry) * aTan + player.x;
      yo = mapSize;
      xo = -yo * aTan;
  } else {
      return { hx, hy, distH }; // Ray is perfectly horizontal, no intersections
  }

  // March forward until we hit a wall or go out of bounds
  while (dof < 8) {
      const mx = Math.floor(rx / mapSize);
      const my = Math.floor(ry / mapSize);
      const mp = my * mapX + mx;

      if (mp < mapX * mapY && worldMap[mp] === 1) { // Check for wall hit
          hx = rx;
          hy = ry;
          distH = dist(hx, hy, player.x, player.y);
          break;
      }

      // Move ray one step further
      rx += xo;
      ry += yo;
      dof += 1;
  }

  return { hx, hy, distH };
}

function calculateVerticalIntersection(player: any, ra: number, mapSize: number, mapX: number, mapY: number, worldMap: number[]): { vx: number, vy: number, distV: number } {
  let rx: number, ry: number, xo: number, yo: number;
  let distV = 100000, vx = player.x, vy = player.y;
  let dof = 0;

  const nTan = -Math.tan(ra); // Tangent to calculate vertical slope

  // Facing left or right?
  if (ra > PI2 && ra < PI3) {
      rx = Math.floor(player.x / mapSize) * mapSize - 0.0001; // Start from the nearest grid line on the left
      ry = (player.x - rx) * nTan + player.y;
      xo = -mapSize;
      yo = -xo * nTan;
  } else if (ra < PI2 || ra > PI3) {
      rx = Math.floor(player.x / mapSize) * mapSize + mapSize; // Start from the nearest grid line on the right
      ry = (player.x - rx) * nTan + player.y;
      xo = mapSize;
      yo = -xo * nTan;
  } else {
      return { vx, vy, distV }; // Ray is perfectly vertical, no intersections
  }

  // March forward until we hit a wall or go out of bounds
  while (dof < 8) {
      const mx = Math.floor(rx / mapSize);
      const my = Math.floor(ry / mapSize);
      const mp = my * mapX + mx;

      if (mp < mapX * mapY && worldMap[mp] === 1) { // Check for wall hit
          vx = rx;
          vy = ry;
          distV = dist(vx, vy, player.x, player.y);
          break;
      }

      // Move ray one step further
      rx += xo;
      ry += yo;
      dof += 1;
  }

  return { vx, vy, distV };
}

function normalizeAngle(angle: number): number {
  if (angle < 0) angle += 2 * PI;
  if (angle > 2 * PI) angle -= 2 * PI;
  return angle;
}

function getCorrectedDistance(playerAngle: number, rayAngle: number, distWall: number): number {
  let angleDifference = playerAngle - rayAngle;
  angleDifference = normalizeAngle(angleDifference); // Normalize the angle difference
  return distWall * Math.cos(angleDifference); // Correct the fisheye effect
}

function drawWall(ctx: CanvasRenderingContext2D, columnIndex: number, correctedDistWall: number, mapSize: number, color = 'red') {
  let lineHeight = (mapSize * 320) / correctedDistWall;
  lineHeight = Math.min(lineHeight, 320); // Cap line height to avoid overflow

  const lineOffset = 160 - (lineHeight / 2);
  const xOffset = 8 * mapSize + 8;

  ctx.fillStyle = color;
  ctx.fillRect(xOffset + 8 * columnIndex, lineOffset, 8, lineHeight);
}

export { calculateHorizontalIntersection, calculateVerticalIntersection, drawWall, getCorrectedDistance, normalizeAngle };