export function formatDecimal(n: number, digits = 2) {
  return (Math.round(n * 100) / 100).toFixed(digits);
}

export function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}