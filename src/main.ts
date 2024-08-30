import "./style.css";
import {worldMap} from "./world";

const SCREEN_WIDTH = 1000;
const SCREEN_HEIGHT = 800;

function init(screen: HTMLCanvasElement) {
  screen.width = SCREEN_WIDTH;
  screen.height = SCREEN_HEIGHT;

  const ctx = screen.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get 2d context from canvas");
  }

  let playerX = 22, playerY = 12; // player start position
  let dirX = -1, dirY = 0; // initial direction vector
  let planeX = 0, planeY = 0.75; // the 2d raycaster version of camera plane

  let time = 0; // time of current frame
  let oldTime = 0; // time of previous frame

  //while (true) {
    for (let x = 0; x < SCREEN_WIDTH; x++) {
      let cameraX = 2 * x / SCREEN_WIDTH - 1; // x-coordinate in camera space
      let rayDirX = dirX + planeX * cameraX;
      let rayDirY = dirY + planeY * cameraX;

      let mapX = Math.floor(playerX);
      let mapY = Math.floor(playerY);

      let sideDistX = 0;
      let sideDistY = 0;

      let deltaDistX = rayDirX === 0 ? 0 : Math.abs(1 / rayDirX);
      let deltaDistY = rayDirY === 0 ? 0 : Math.abs(1 / rayDirY);
      let perpWallDist = 0;

      let stepX = 0;
      let stepY = 0;

      let hit = 0; // was there a wall hit?
      let side = 0; // was a NS or a EW wall hit?

      if (rayDirX < 0) {
        stepX = -1;
        sideDistX = (playerX - mapX) * deltaDistX;
      } else {
        stepX = 1;
        sideDistX = (mapX + 1.0 - playerX) * deltaDistX;
      }
      if (rayDirY < 0) {
        stepY = -1;
        sideDistY = (playerY - mapY) * deltaDistY;
      } else {
        stepY = 1;
        sideDistY = (mapY + 1.0 - playerY) * deltaDistY;
      }

      // perform DDA
      while (hit === 0) {
        // jump to next map square, OR in x-direction, OR in y-direction
        if (sideDistX < sideDistY) {
          sideDistX += deltaDistX;
          mapX += stepX;
          side = 0;
        } else {
          sideDistY += deltaDistY;
          mapY += stepY;
          side = 1;
        }
        // Check if ray has hit a wall
        if (worldMap[mapX][mapY] > 0) {
          hit = 1;
        }
      }

      // Calculate distance projected on camera direction (Euclidean distance will give fisheye effect!)
      if (side === 0) {
        perpWallDist = (mapX - playerX + (1 - stepX) / 2) / rayDirX;
      } else {
        perpWallDist = (mapY - playerY + (1 - stepY) / 2) / rayDirY;
      }

      // Calculate height of line to draw on screen
      let lineHeight = Math.floor(SCREEN_HEIGHT / perpWallDist);

      // calculate lowest and highest pixel to fill in current stripe
      let drawStart = -lineHeight / 2 + SCREEN_HEIGHT / 2;
      if (drawStart < 0) {
        drawStart = 0;
      }
      let drawEnd = lineHeight / 2 + SCREEN_HEIGHT / 2;
      if (drawEnd >= SCREEN_HEIGHT) {
        drawEnd = SCREEN_HEIGHT - 1;
      }

      // choose wall color
      let color = 0;
      switch (worldMap[mapX][mapY]) {
        case 1:
          color = 0xff0000; // red
          break;
        case 2:
          color = 0x00ff00; // green
          break;
        case 3:
          color = 0x0000ff; // blue
          break;
        case 4:
          color = 0xffff00; // yellow
          break;
        default:
          color = 0xffffff; // white
          break;
      }

      // give x and y sides different brightness
      if (side === 1) {
        color = (color >> 1) & 8355711; // make a bit darker
      }

      // draw the pixels of the stripe as a vertical line
      ctx.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
      ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);

    }
  
  //}
}

const screen = document.querySelector<HTMLCanvasElement>("#screen");

if (screen) {
  init(screen);
}
