import { drawHoloIcon } from "@/lib/holoIcons";
import { clamp01 } from "@/lib/journeyMotion";

export type ScreenReveal = {
  chapterIndex: number;
  holoIndex?: number;
  morph: number;
  title: number;
  line: number;
  body: number;
  bullets: number[];
  detail: number;
  holo?: number;
  power?: number;
  time?: number;
};

/** Half-res screen texture. sharp enough on phone mesh, ~4× cheaper to paint */
export const SCREEN_W = 540;
export const SCREEN_H = 1168;
const RED = "#ef1a12";
const HOLO_BOX = 360;

function roundRect(
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

function holoFlicker(t: number): number {
  const breathe = 0.88 + Math.sin(t * 3.4) * 0.07 + Math.sin(t * 11.2) * 0.03;
  const blink =
    Math.sin(t * 2.6) > 0.96 ? 0.42 : Math.sin(t * 7.8) > 0.985 ? 0.62 : 1;
  return clamp01(breathe * blink);
}

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

let holoBuf: HTMLCanvasElement | null = null;
function getHoloBuf() {
  if (typeof document === "undefined") return null;
  if (!holoBuf) {
    holoBuf = document.createElement("canvas");
    holoBuf.width = HOLO_BOX;
    holoBuf.height = HOLO_BOX;
  }
  return holoBuf;
}

/** Crisp red hologram. glitch confined to the mark (no getImageData) */
export function paintPhoneScreen(
  ctx: CanvasRenderingContext2D,
  state: ScreenReveal
) {
  const t = state.time ?? 0;
  const power = clamp01(state.power ?? 1);
  const holo = clamp01(state.holo ?? 1) * power;
  const flicker = holoFlicker(t);
  const holoIndex = state.holoIndex ?? state.chapterIndex;
  const cx = SCREEN_W / 2;
  const cy = SCREEN_H * 0.45;
  const iconSize = holoIndex < 0 ? 200 : 190;
  const breath = 1 + Math.sin(t * 2.1) * 0.018;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  if (power < 0.02) return;

  if (holo > 0.02) {
    ctx.save();
    ctx.globalAlpha = 0.42 * holo * flicker;
    const bloom = ctx.createRadialGradient(cx, cy, 6, cx, cy, 180);
    bloom.addColorStop(0, "rgba(239,26,18,0.55)");
    bloom.addColorStop(0.45, "rgba(239,26,18,0.12)");
    bloom.addColorStop(1, "rgba(239,26,18,0)");
    ctx.fillStyle = bloom;
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    ctx.restore();
  }

  ctx.fillStyle = "#050505";
  roundRect(ctx, SCREEN_W / 2 - 62, 14, 124, 26, 13);
  ctx.fill();

  if (holo < 0.02) return;

  const buf = getHoloBuf();
  if (!buf) {
    ctx.save();
    ctx.globalAlpha = holo * flicker;
    ctx.shadowColor = "rgba(239,26,18,1)";
    ctx.shadowBlur = 22;
    drawHoloIcon(ctx, holoIndex, cx, cy, iconSize * breath, RED);
    ctx.restore();
    return;
  }

  const bctx = buf.getContext("2d");
  if (!bctx) return;
  const mid = HOLO_BOX / 2;
  bctx.clearRect(0, 0, HOLO_BOX, HOLO_BOX);

  const glitchOn = Math.sin(t * 4.6) > 0.82;
  const gx = glitchOn ? (hash(t * 33) - 0.5) * 7 : 0;
  const gy = glitchOn ? (hash(t * 51) - 0.5) * 4 : 0;

  // One soft ghost + main mark
  bctx.save();
  bctx.globalAlpha = flicker * 0.18;
  bctx.shadowColor = "rgba(255,70,50,0.55)";
  bctx.shadowBlur = 10;
  drawHoloIcon(
    bctx,
    holoIndex,
    mid - 3 + gx * 0.4,
    mid + 2,
    iconSize * breath * 0.97,
    "#ff5a45"
  );
  bctx.restore();

  bctx.save();
  bctx.globalAlpha = flicker;
  bctx.shadowColor = "rgba(239,26,18,1)";
  bctx.shadowBlur = 18 + Math.sin(t * 4.2) * 5;
  drawHoloIcon(
    bctx,
    holoIndex,
    mid + gx * 0.25,
    mid + gy * 0.25,
    iconSize * breath,
    RED
  );
  bctx.restore();

  // Cheap scanlines. no getImageData
  bctx.save();
  bctx.globalCompositeOperation = "source-atop";
  bctx.globalAlpha = 0.1 * flicker;
  bctx.fillStyle = RED;
  for (let y = 0; y < HOLO_BOX; y += 10) {
    bctx.fillRect(Math.sin(y * 0.1 + t * 5) * 1.2, y, HOLO_BOX, 1);
  }
  if (glitchOn) {
    const sliceY = mid + (hash(Math.floor(t * 6)) - 0.5) * 60;
    bctx.globalAlpha = 0.28 * flicker;
    bctx.fillRect(16, sliceY, HOLO_BOX - 32, 1.5);
  }
  bctx.restore();

  ctx.save();
  ctx.globalAlpha = holo;
  ctx.shadowColor = "rgba(239,26,18,0.8)";
  ctx.shadowBlur = 18;
  ctx.drawImage(buf, cx - mid, cy - mid);
  ctx.restore();
}
