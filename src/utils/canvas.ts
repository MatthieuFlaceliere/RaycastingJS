import { formatDecimal } from "./math";

function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, width: number, color: string) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function setCanvasBackground(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

let lastTimeStamp = 0;
function displayFPS(ctx: CanvasRenderingContext2D, timeStamp: number, digits = 2) {
  let fps = 1000 / (timeStamp - lastTimeStamp);
  lastTimeStamp = timeStamp;

  const style = ctx.fillStyle;
  ctx.fillStyle = 'white';
  ctx.fillText(`FPS: ${formatDecimal(fps, digits)}`, 10, 20);
  ctx.fillStyle = style;
}

export { drawLine, setCanvasBackground, clearCanvas, displayFPS };
