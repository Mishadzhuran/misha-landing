import { CHAPTER_COUNT } from "@/lib/journeyMotion";

/** Red hologram silhouettes. one mark per stage (+ brand) */
export type HoloStage = {
  label: string;
  draw: (ctx: CanvasRenderingContext2D, s: number) => void;
};

function round(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/** Brand. bold APPIGON wordmark */
function drawAppigon(ctx: CanvasRenderingContext2D, s: number) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `800 ${s * 0.28}px -apple-system, system-ui, sans-serif`;
  ctx.fillText("APPIGON", 0, s * 0.02);
  // accent bar under wordmark
  round(ctx, -s * 0.22, s * 0.22, s * 0.44, s * 0.035, s * 0.02);
  ctx.fill();
}

/** Build. phone silhouette */
function drawBuild(ctx: CanvasRenderingContext2D, s: number) {
  const w = s * 0.48;
  const h = s * 0.92;
  round(ctx, -w / 2, -h / 2, w, h, s * 0.09);
  ctx.fill();
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  round(ctx, -w * 0.36, -h * 0.38, w * 0.72, h * 0.7, s * 0.05);
  ctx.fill();
  // dynamic island
  round(ctx, -s * 0.1, -h * 0.42, s * 0.2, s * 0.05, s * 0.025);
  ctx.fill();
  ctx.restore();
}

/** Landing. browser window */
function drawLanding(ctx: CanvasRenderingContext2D, s: number) {
  const w = s * 1.05;
  const h = s * 0.78;
  round(ctx, -w / 2, -h / 2, w, h, s * 0.07);
  ctx.fill();
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  // top chrome
  round(ctx, -w / 2 + s * 0.05, -h / 2 + s * 0.05, w - s * 0.1, s * 0.12, s * 0.03);
  ctx.fill();
  // hero block
  round(ctx, -w * 0.38, -h * 0.12, w * 0.76, s * 0.22, s * 0.03);
  ctx.fill();
  // lines
  for (let i = 0; i < 2; i++) {
    round(ctx, -w * 0.3, h * 0.18 + i * s * 0.1, w * 0.6 * (1 - i * 0.15), s * 0.045, s * 0.02);
    ctx.fill();
  }
  ctx.restore();
}

/** App Store. proper Apple logo silhouette */
function drawApple(ctx: CanvasRenderingContext2D, s: number) {
  // Simple Icons / classic Apple path (viewBox 0 0 24 24)
  ctx.save();
  const scale = s / 14;
  ctx.translate(0, s * 0.05);
  ctx.scale(scale, scale);
  ctx.translate(-12, -12);

  ctx.beginPath();
  // Body
  ctx.moveTo(18.71, 19.5);
  ctx.bezierCurveTo(17.88, 20.74, 17, 21.95, 15.66, 21.97);
  ctx.bezierCurveTo(14.32, 22, 13.89, 21.18, 12.37, 21.18);
  ctx.bezierCurveTo(10.84, 21.18, 10.37, 21.95, 9.1, 22);
  ctx.bezierCurveTo(7.79, 22.05, 6.8, 20.68, 5.96, 19.47);
  ctx.bezierCurveTo(4.25, 17, 2.94, 12.45, 4.7, 9.39);
  ctx.bezierCurveTo(5.57, 7.87, 7.13, 6.91, 8.82, 6.88);
  ctx.bezierCurveTo(10.1, 6.86, 11.32, 7.75, 12.11, 7.75);
  ctx.bezierCurveTo(12.89, 7.75, 14.37, 6.68, 15.92, 6.84);
  ctx.bezierCurveTo(16.57, 6.87, 18.39, 7.1, 19.56, 8.82);
  ctx.bezierCurveTo(19.47, 8.88, 17.39, 10.1, 17.41, 12.63);
  ctx.bezierCurveTo(17.44, 15.65, 20.06, 16.66, 20.09, 16.67);
  ctx.bezierCurveTo(20.06, 16.74, 19.67, 18.11, 18.71, 19.5);
  ctx.closePath();
  ctx.fill();

  // Leaf
  ctx.beginPath();
  ctx.moveTo(13, 3.5);
  ctx.bezierCurveTo(13.73, 2.67, 14.22, 1.5, 14.09, 0.34);
  ctx.bezierCurveTo(13.04, 0.39, 11.78, 1.04, 11.03, 1.92);
  ctx.bezierCurveTo(10.36, 2.7, 9.77, 3.95, 9.93, 5.14);
  ctx.bezierCurveTo(11.09, 5.23, 12.28, 4.55, 13, 3.5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Android. robot */
function drawAndroid(ctx: CanvasRenderingContext2D, s: number) {
  ctx.lineWidth = s * 0.045;
  ctx.lineCap = "round";
  ctx.strokeStyle = ctx.fillStyle as string;
  ctx.beginPath();
  ctx.moveTo(-s * 0.2, -s * 0.32);
  ctx.lineTo(-s * 0.36, -s * 0.58);
  ctx.moveTo(s * 0.2, -s * 0.32);
  ctx.lineTo(s * 0.36, -s * 0.58);
  ctx.stroke();

  // head dome
  ctx.beginPath();
  ctx.arc(0, -s * 0.05, s * 0.42, Math.PI, 0);
  ctx.lineTo(s * 0.42, s * 0.18);
  ctx.lineTo(-s * 0.42, s * 0.18);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(-s * 0.16, -s * 0.08, s * 0.07, 0, Math.PI * 2);
  ctx.arc(s * 0.16, -s * 0.08, s * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  round(ctx, -s * 0.4, s * 0.22, s * 0.8, s * 0.36, s * 0.08);
  ctx.fill();
}

/** Release. rocket */
function drawRelease(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.7);
  ctx.quadraticCurveTo(s * 0.32, -s * 0.1, s * 0.2, s * 0.32);
  ctx.lineTo(s * 0.4, s * 0.52);
  ctx.lineTo(s * 0.12, s * 0.4);
  ctx.lineTo(0, s * 0.52);
  ctx.lineTo(-s * 0.12, s * 0.4);
  ctx.lineTo(-s * 0.4, s * 0.52);
  ctx.lineTo(-s * 0.2, s * 0.32);
  ctx.quadraticCurveTo(-s * 0.32, -s * 0.1, 0, -s * 0.7);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(0, -s * 0.1, s * 0.09, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.moveTo(-s * 0.1, s * 0.52);
  ctx.lineTo(0, s * 0.78);
  ctx.lineTo(s * 0.1, s * 0.52);
  ctx.closePath();
  ctx.fill();
}

/** Support. shield */
function drawSupport(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.68);
  ctx.lineTo(s * 0.5, -s * 0.4);
  ctx.lineTo(s * 0.46, s * 0.08);
  ctx.bezierCurveTo(s * 0.4, s * 0.42, s * 0.18, s * 0.62, 0, s * 0.74);
  ctx.bezierCurveTo(-s * 0.18, s * 0.62, -s * 0.4, s * 0.42, -s * 0.46, s * 0.08);
  ctx.lineTo(-s * 0.5, -s * 0.4);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = s * 0.065;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(-s * 0.28, 0.02 * s);
  ctx.lineTo(-s * 0.1, 0.02 * s);
  ctx.lineTo(0, -s * 0.16);
  ctx.lineTo(s * 0.12, s * 0.2);
  ctx.lineTo(s * 0.22, 0.02 * s);
  ctx.lineTo(s * 0.32, 0.02 * s);
  ctx.stroke();
  ctx.restore();
}

export const HOLO_STAGES: HoloStage[] = [
  { label: "BUILD", draw: drawBuild },
  { label: "LAND", draw: drawLanding },
  { label: "STORE", draw: drawApple },
  { label: "PLAY", draw: drawAndroid },
  { label: "RELEASE", draw: drawRelease },
  { label: "SUPPORT", draw: drawSupport },
];

let iconCanvas: HTMLCanvasElement | null = null;

function getIconCanvas() {
  if (typeof document === "undefined") return null;
  if (!iconCanvas) {
    iconCanvas = document.createElement("canvas");
    iconCanvas.width = 512;
    iconCanvas.height = 512;
  }
  return iconCanvas;
}

/**
 * holoIndex: -1 = APPIGON brand, 0..5 = stage marks
 */
export function drawHoloIcon(
  ctx: CanvasRenderingContext2D,
  holoIndex: number,
  cx: number,
  cy: number,
  size: number,
  color: string
) {
  const draw =
    holoIndex < 0
      ? drawAppigon
      : (HOLO_STAGES[holoIndex % CHAPTER_COUNT] ?? HOLO_STAGES[0]).draw;

  const off = getIconCanvas();
  if (!off) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    draw(ctx, size);
    ctx.restore();
    return;
  }

  const octx = off.getContext("2d");
  if (!octx) return;
  octx.clearRect(0, 0, off.width, off.height);
  octx.save();
  octx.translate(off.width / 2, off.height / 2);
  octx.fillStyle = color;
  octx.strokeStyle = color;
  draw(octx, size);
  octx.restore();

  ctx.drawImage(off, cx - off.width / 2, cy - off.height / 2);
}
