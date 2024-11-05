import "./style.css";
import {mapSize, mapX, mapY, worldMap} from "./world";
import {setCanvasBackground, clearCanvas, displayFPS, drawLine} from "./utils/canvas";
import { dist } from "./utils/math";

const SCREEN_WIDTH = 1024;
const SCREEN_HEIGHT = 512;

const player = {
  x: 0,
  y: 0,
  angle: 0,
  deltaX: 0,
  deltaY: 0,
};

function main() {
  const screen = document.querySelector<HTMLCanvasElement>("#screen");

  if (!screen) throw new Error("Failed to find screen element");
  
  // set initial values for player
  player.x = 200;
  player.y = 200;
  player.deltaX = Math.cos(player.angle) * 5;
  player.deltaY = Math.sin(player.angle) * 5;
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

function benchmark(func, iterations = 1000) {
  const t0 = performance.now();
  for (let i = 0; i < iterations; i++) {
    func();
  }
  const t1 = performance.now();
  return (t1 - t0) / iterations;
}

function gameLoop(timeStamp: number, ctx: CanvasRenderingContext2D) {
  clearCanvas(ctx);
  setCanvasBackground(ctx, 'grey');

  document.addEventListener('keydown', keyboardHandler);

  drawMap(ctx, 0, 0);
  
  // drawRays3D(ctx, player);
  const time = benchmark(() => drawRays3D_0(ctx, player));
  const time2 = benchmark(() => drawRays3D_1(ctx, player));
  const percent = (time - time2) / Math.abs(time2) * 100;
  console.log(`${time.toFixed(5)} ms - ${time2.toFixed(5)} ms - ${percent.toFixed(2)}%`);

  drawPlayer(ctx, player);

  displayFPS(ctx, timeStamp, 2);
  requestAnimationFrame((ts) => gameLoop(ts, ctx));
}

function keyboardHandler(event: KeyboardEvent,) {
  if (event.key === 'q') {
    player.angle -= 0.1;
    if (player.angle < 0) player.angle += 2 * Math.PI
    player.deltaX = Math.cos(player.angle) * 5;
    player.deltaY = Math.sin(player.angle) * 5;
  }
  if (event.key === 'd') {
    player.angle += 0.1;
    if (player.angle > 2 * Math.PI) player.angle -= 2 * Math.PI
    player.deltaX = Math.cos(player.angle) * 5;
    player.deltaY = Math.sin(player.angle) * 5;
  }
  if (event.key === 'z') {
    player.y += player.deltaY;
    player.x += player.deltaX;
  }
  if (event.key === 's') {
    player.y -= player.deltaY;
    player.x -= player.deltaX;
  }
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

function drawRays3D_0(ctx: CanvasRenderingContext2D, player: any) {
  let x = player.x;
  let y = player.y;
  let dx = Math.cos(player.angle);
  let dy = Math.sin(player.angle);

  // Increment x and y until we hit a wall
  let i = 0;
  while (worldMap[Math.floor(y / mapSize) * mapX + Math.floor(x / mapSize)] === 0) {
      x += dx * 0.1;
      y += dy * 0.1;
      i++;
      if (i > 4000) break;  // Prevent infinite loops
  }

  drawLine(ctx, player.x, player.y, x, y, 1, 'blue');
}

function drawRays3D_1(ctx: CanvasRenderingContext2D, player: any) {
  let r: number, mx: number, my: number, mp: number, dof: number;
  let rx = 0, ry = 0, ra: number, xo = 0, yo = 0;

  ra = player.angle;

  for (r = 0; r < 1; r++) {
      let distH = 100000, hx=player.x, hy=player.y;

      // --- Check Horizontal Line ---
      dof = 0; // depth of field
      const aTan = -1 / Math.tan(ra); // Arctan 

      if (ra > Math.PI) {
          ry = (Math.floor(player.y / mapSize) * mapSize) - 0.0001; // -0.0001 to avoid rounding errors
          rx = (player.y - ry) * aTan + player.x;
          yo = -64;
          xo = -yo * aTan;
      } 
      else if (ra < Math.PI) {
          ry = (Math.floor(player.y / mapSize) * mapSize) + mapSize; // +mapSize take the next square
          rx = (player.y - ry) * aTan + player.x;
          yo = 64;
          xo = -yo * aTan;          
      }
      if (ra === 0 || ra === Math.PI) {
          rx = player.x;
          ry = player.y;
          dof = 8;
      }

      while (dof < 8) {
          mx = Math.floor(rx / mapSize);
          my = Math.floor(ry / mapSize);
          mp = my * mapX + mx;

          if (mp<mapX*mapY && worldMap[mp] === 1) { 
            hx = rx;
            hy = ry;
            distH = dist(hx, hy, player.x, player.y);
            break;
          }

          rx += xo;
          ry += yo;
          dof += 1;
      }


      let distV = 100000, vx=player.x, vy=player.y;
      // --- Check Vertical Line ---
      dof = 0; // depth of field
      const nTan = -Math.tan(ra);
      if (ra > Math.PI / 2 && ra < 3 * Math.PI / 2) {
          rx = (Math.floor(player.x / mapSize) * mapSize) - 0.0001; // -0.0001 to avoid rounding errors
          ry = (player.x - rx) * nTan + player.y;
          xo = -64;
          yo = -xo * nTan;
      }
      else if (ra < Math.PI / 2 || ra > 3 * Math.PI / 2) {
          rx = (Math.floor(player.x / mapSize) * mapSize) + mapSize; // +mapSize take the next square
          ry = (player.x - rx) * nTan + player.y;
          xo = 64;
          yo = -xo * nTan;
      }
      if (ra === Math.PI / 2 || ra === 3 * Math.PI / 2) {
          rx = player.x;
          ry = player.y;
          dof = 8;
      }

      while (dof < 8) {
          mx = Math.floor(rx / mapSize);
          my = Math.floor(ry / mapSize);
          mp = my * mapX + mx;

          if (mp<mapX*mapY && worldMap[mp] === 1) { 
            vx = rx;
            vy = ry;
            distV = dist(vx, vy, player.x, player.y);
            break;
          }

          rx += xo;
          ry += yo;
          dof += 1;
      }

      if (distH < distV) {
          rx = hx;
          ry = hy;
      } else {
          rx = vx;
          ry = vy;
      }

      drawLine(ctx, player.x, player.y, rx, ry, 1, 'orange');
  }
}
