import "./style.css";
import {mapSize, mapX, mapY, worldMap} from "./world";
import {setCanvasBackground, clearCanvas, displayFPS, drawLine} from "./utils/canvas";
import { calculateHorizontalIntersection, calculateVerticalIntersection, drawWall, getCorrectedDistance, normalizeAngle } from "./utils/raycast";
import { DR, PI, SCREEN_HEIGHT, SCREEN_WIDTH } from "./utils/constant";

const player = {
  x: 0,
  y: 0,
  angle: 0,
  deltaX: 0,
  deltaY: 0,
};

const keys: { [key: string]: boolean } = {};

function main() {
  const screen = document.querySelector<HTMLCanvasElement>("#screen");

  if (!screen) throw new Error("Failed to find screen element");
  
  // set initial values for player
  player.x = 200;
  player.y = 200;
  player.deltaX = Math.cos(player.angle) * 3;
  player.deltaY = Math.sin(player.angle) * 3;
  init(screen);
}
main();

function init(screen: HTMLCanvasElement) {
  screen.width = SCREEN_WIDTH;
  screen.height = SCREEN_HEIGHT;

  const ctx = screen.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get 2d context from canvas");
  }

  setCanvasBackground(ctx, 'grey');

  requestAnimationFrame((ts) => gameLoop(ts, ctx));
}

function gameLoop(timeStamp: number, ctx: CanvasRenderingContext2D) {
  clearCanvas(ctx);
  setCanvasBackground(ctx, 'grey');

  window.addEventListener("keydown", (event) => {
    keys[event.key] = true;
  });

  window.addEventListener("keyup", (event) => {
    keys[event.key] = false;
  });

  keyboardHandler();

  drawMap(ctx, 0, 0);

  drawFloor(ctx, "#7e3464", mapSize * mapX + 8, 160, 60 * 8, SCREEN_HEIGHT - 352);
  
  drawRays3D(ctx, player);

  drawPlayer(ctx, player);

  displayFPS(ctx, timeStamp, 2);
  requestAnimationFrame((ts) => gameLoop(ts, ctx));
}

function keyboardHandler() {
  if (keys['q']) {
    player.angle -= 0.05;
    if (player.angle < 0) player.angle += 2 * PI;
    player.deltaX = Math.cos(player.angle) * 3;
    player.deltaY = Math.sin(player.angle) * 3;
  }
  if (keys['d']) {
    player.angle += 0.05;
    if (player.angle > 2 * PI) player.angle -= 2 * PI;
    player.deltaX = Math.cos(player.angle) * 3;
    player.deltaY = Math.sin(player.angle) * 3;
  }
  if (keys['z']) {
    player.y += player.deltaY;
    player.x += player.deltaX;
  }
  if (keys['s']) {
    player.y -= player.deltaY;
    player.x -= player.deltaX;
  }
}

function drawFloor(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, width: number, height: number) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawPlayer(ctx: CanvasRenderingContext2D, player: any, color = 'red') {
  ctx.fillStyle = color;
  ctx.fillRect(player.x - 4, player.y - 4, 8, 8);
  
  drawLine(
    ctx,
    player.x,
    player.y,
    player.x + player.deltaX * 5,
    player.y + player.deltaY * 5,
    2,
    color
  );
}

function drawMap(ctx: CanvasRenderingContext2D, x: number, y: number) {
  for (let i = 0; i < mapX; i++) {
    for (let j = 0; j < mapY; j++) {
      if (worldMap[j * mapX + i] === 1) ctx.fillStyle = 'black'
      else ctx.fillStyle = 'white';
      
      ctx.fillRect(x + i * mapSize + 1, y + j * mapSize + 1, mapSize - 1, mapSize - 1);
    }
  }
}

function drawRays3D(ctx: CanvasRenderingContext2D, player: any) {
  let rayAngle = normalizeAngle(player.angle - DR * 30); // Initial ray angle

    for (let r = 0; r < 60; r++) {
        // Get intersections and the shortest distance to a wall
        const { hx, hy, distH } = calculateHorizontalIntersection(player, rayAngle, mapSize, mapX, mapY, worldMap);
        const { vx, vy, distV } = calculateVerticalIntersection(player, rayAngle, mapSize, mapX, mapY, worldMap);

        const finalX = distH < distV ? hx : vx;
        const finalY = distH < distV ? hy : vy;
        const distWall = distH < distV ? distH : distV;
        const color = distH < distV ? '#7d34eb' : '#7e34d2';

        // Draw ray to wall
        drawLine(ctx, player.x, player.y, finalX, finalY, 1, 'green');

        // Calculate corrected distance and draw the wall slice
        const correctedDistWall = getCorrectedDistance(player.angle, rayAngle, distWall);
        drawWall(ctx, r, correctedDistWall, mapSize, color);

        // Increment and normalize the ray angle for the next column
        rayAngle = normalizeAngle(rayAngle + DR);
    }
}
