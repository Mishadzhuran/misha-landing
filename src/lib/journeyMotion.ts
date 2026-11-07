import { scrollChapters } from "@/data/site";

export const INTRO_END = 0.1;
export const OUTRO_START = 0.88;
export const CHAPTER_COUNT = scrollChapters.length;

/** Local progress inside a chapter where full copy + hologram are settled */
export const HOLD_LOCAL = 0.78;

/**
 * Per chapter: shorter turn, longer settled hold (less “hanging” mid-air).
 */
export const STAGE = {
  spinEnd: 0.32,
  titleStart: 0.34,
  titleEnd: 0.48,
  bulletsStart: 0.46,
  bulletStagger: 0.035,
  pauseStart: 0.7,
  collapseStart: 1,
} as const;

export type TextLayout = {
  side: "left" | "right";
  vertical: "top" | "mid" | "bottom";
  align: "left" | "right" | "center";
};

export const CHAPTER_LAYOUTS: TextLayout[] = [
  { side: "left", vertical: "top", align: "left" },
  { side: "right", vertical: "mid", align: "right" },
  { side: "left", vertical: "mid", align: "left" },
  { side: "right", vertical: "top", align: "right" },
  { side: "left", vertical: "bottom", align: "left" },
  { side: "right", vertical: "bottom", align: "right" },
];

/**
 * Hold poses. more distinct angles per stage (still readable face-on).
 */
export const REST_POSES = [
  { x: 0.52, yaw: Math.PI + 0.2, pitch: 0.06, roll: -0.2 },
  { x: -0.52, yaw: Math.PI - 0.22, pitch: 0.04, roll: 0.22 },
  { x: 0.46, yaw: Math.PI + 0.16, pitch: 0.08, roll: -0.14 },
  { x: -0.5, yaw: Math.PI - 0.18, pitch: 0.03, roll: 0.18 },
  { x: 0.56, yaw: Math.PI + 0.24, pitch: 0.05, roll: -0.24 },
  { x: -0.44, yaw: Math.PI - 0.14, pitch: 0.07, roll: 0.16 },
] as const;

/**
 * Per-stage turn flavor. moderate side peek + unique bank/depth.
 * yawPeek ≈ radians of extra side reveal mid-turn (settles face-on).
 */
export const TURN_STYLE = [
  { yawPeek: 0.38, pitch: 0.16, roll: -0.22, lift: 0.05, depth: 0.22, swingX: 0.1 },
  { yawPeek: -0.42, pitch: 0.1, roll: 0.28, lift: 0.04, depth: 0.18, swingX: 0.12 },
  { yawPeek: 0.48, pitch: 0.24, roll: -0.16, lift: 0.07, depth: 0.3, swingX: 0.08 },
  { yawPeek: -0.36, pitch: -0.12, roll: 0.24, lift: 0.05, depth: 0.2, swingX: 0.11 },
  { yawPeek: 0.44, pitch: 0.18, roll: -0.3, lift: 0.06, depth: 0.26, swingX: 0.13 },
  { yawPeek: -0.4, pitch: 0.14, roll: 0.2, lift: 0.045, depth: 0.24, swingX: 0.09 },
] as const;

export function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function easeInOutQuint(t: number) {
  const x = clamp01(t);
  return x < 0.5
    ? 16 * x * x * x * x * x
    : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

export function chapterFromProgress(p: number): number {
  if (p <= INTRO_END) return 0;
  if (p >= OUTRO_START) return CHAPTER_COUNT - 1;
  const t = (p - INTRO_END) / (OUTRO_START - INTRO_END);
  return Math.min(
    CHAPTER_COUNT - 1,
    Math.floor(t * 0.999999 * CHAPTER_COUNT)
  );
}

export function chapterLocalProgress(p: number): number {
  if (p <= INTRO_END) return 0;
  if (p >= OUTRO_START) return 1;
  const t = (p - INTRO_END) / (OUTRO_START - INTRO_END);
  const raw = t * CHAPTER_COUNT;
  return raw - Math.floor(raw);
}

/** Continuous chapter float 0 → CHAPTER_COUNT across the story span */
export function chapterFloat(p: number): number {
  if (p <= INTRO_END) return 0;
  if (p >= OUTRO_START) return CHAPTER_COUNT;
  const t = (p - INTRO_END) / (OUTRO_START - INTRO_END);
  return t * CHAPTER_COUNT;
}

export function bulletReveal(local: number, index: number): number {
  const start = STAGE.bulletsStart + index * STAGE.bulletStagger;
  return smoothstep(start, start + 0.08, local);
}

export function titleReveal(local: number): number {
  return smoothstep(STAGE.titleStart, STAGE.titleEnd, local);
}

export function holoAmount(local: number): number {
  return lerp(0.75, 1, smoothstep(0, STAGE.spinEnd * 0.7, local));
}

export function faceAmount(local: number): number {
  return smoothstep(STAGE.spinEnd * 0.55, STAGE.spinEnd + 0.08, local);
}

export function stageZoom(local: number): number {
  // Strong face-on punch-in after the orbit
  return smoothstep(STAGE.spinEnd, STAGE.titleEnd + 0.08, local);
}

export function outroAmount(p: number): number {
  return smoothstep(OUTRO_START, 1, p);
}

/** Progress values where intro / each stage hold / outro land */
export function journeySnapProgresses(): number[] {
  const span = (OUTRO_START - INTRO_END) / CHAPTER_COUNT;
  const points = [0.04];
  for (let i = 0; i < CHAPTER_COUNT; i++) {
    points.push(INTRO_END + (i + HOLD_LOCAL) * span);
  }
  points.push(0.985);
  return points;
}

/**
 * Snap target for a scroll progress.
 * @param direction >0 down/forward, <0 up/back, 0 = nearest
 */
export function snapJourneyProgress(p: number, direction = 0): number {
  const span = (OUTRO_START - INTRO_END) / CHAPTER_COUNT;
  const pts = journeySnapProgresses();

  // Mid-turn: always finish to a settled hold (never leave the phone hanging)
  if (p > INTRO_END + 0.01 && p < OUTRO_START - 0.01) {
    const t = (p - INTRO_END) / (OUTRO_START - INTRO_END);
    const cf = t * CHAPTER_COUNT;
    const i = Math.min(CHAPTER_COUNT - 1, Math.floor(cf));
    const local = cf - Math.floor(cf);
    if (local < STAGE.spinEnd + 0.04) {
      if (direction < 0 && i > 0) {
        return INTRO_END + (i - 1 + HOLD_LOCAL) * span;
      }
      if (direction < 0 && i === 0) return pts[0] ?? 0.04;
      return INTRO_END + (i + HOLD_LOCAL) * span;
    }
  }

  if (direction > 0) {
    for (const pt of pts) {
      if (pt >= p - 0.004) return pt;
    }
    return pts[pts.length - 1] ?? 1;
  }
  if (direction < 0) {
    for (let i = pts.length - 1; i >= 0; i--) {
      const pt = pts[i] ?? 0;
      if (pt <= p + 0.004) return pt;
    }
    return pts[0] ?? 0;
  }

  let best = pts[0] ?? 0;
  let bestD = Math.abs(p - best);
  for (const pt of pts) {
    const d = Math.abs(p - pt);
    if (d < bestD) {
      best = pt;
      bestD = d;
    }
  }
  return best;
}

export type PhonePose = {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  roll: number;
  /** Absolute visual scale (already includes intro→stage sizing) */
  scale: number;
  camZ: number;
};

type RestLike = { x: number; yaw: number; pitch: number; roll: number };

const INTRO_REST: RestLike = {
  x: 0.1,
  yaw: Math.PI + 0.06,
  pitch: 0.04,
  roll: -0.1,
};

function restPose(i: number): RestLike {
  if (i < 0) return INTRO_REST;
  return REST_POSES[Math.min(i, REST_POSES.length - 1)] ?? REST_POSES[0];
}

function shortestYaw(from: number, to: number) {
  let d = to - from;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

/**
 * One-way base turn A→B, plus a moderate side peek that settles face-on.
 * Each stage's yawPeek / bank / depth makes the move feel different.
 */
function mixRest(
  a: RestLike,
  b: RestLike,
  t: number,
  style: (typeof TURN_STYLE)[number]
): Omit<PhonePose, "scale" | "camZ"> {
  const e = easeInOutQuint(t);
  const peek = Math.sin(e * Math.PI);

  return {
    x: lerp(a.x, b.x, e) + peek * style.swingX * Math.sign(style.yawPeek || 1),
    y: 0.2 + peek * style.lift,
    z: 0.04 + peek * style.depth,
    yaw: a.yaw + e * shortestYaw(a.yaw, b.yaw) + peek * style.yawPeek,
    pitch: lerp(a.pitch, b.pitch, e) + peek * style.pitch,
    roll: lerp(a.roll, b.roll, e) + peek * style.roll,
  };
}

/**
 * Fully continuous pose from scroll progress.
 * One curve. no chapter-boundary restarts that fight each other.
 */
export function phonePoseFromProgress(p: number): PhonePose {
  const outro = outroAmount(p);
  const introScale = 18.5;
  const stageScale = 15.5;
  const farCam = 12.4;
  const nearCam = 10.8;

  // --- Intro ---
  if (p <= INTRO_END) {
    const t = smoothstep(0, INTRO_END, p);
    return {
      x: INTRO_REST.x,
      y: 0.22,
      z: 0.05,
      yaw: INTRO_REST.yaw,
      pitch: INTRO_REST.pitch,
      roll: INTRO_REST.roll,
      scale: lerp(introScale * 0.92, introScale, t),
      camZ: lerp(farCam, nearCam, t),
    };
  }

  // --- Outro: sink face-down with room under the stage ---
  if (p >= OUTRO_START) {
    const last = restPose(CHAPTER_COUNT - 1);
    const e = easeInOutQuint(outro);
    return {
      x: lerp(last.x, 0.03, easeInOutQuint(smoothstep(0, 0.75, outro))),
      y: lerp(0.2, -2.05, easeInOutQuint(smoothstep(0.08, 1, outro))),
      z: lerp(0.04, 0.1, e),
      yaw: lerp(last.yaw, Math.PI, easeInOutQuint(smoothstep(0, 0.7, outro))),
      pitch: lerp(
        last.pitch,
        Math.PI / 2,
        easeInOutQuint(smoothstep(0.05, 0.95, outro))
      ),
      roll: lerp(last.roll, 0, easeInOutQuint(smoothstep(0, 0.55, outro))),
      scale: lerp(stageScale, stageScale * 0.78, e),
      camZ: lerp(nearCam, farCam + 1.6, e),
    };
  }

  // --- Chapters: continuous float index ---
  const cf = chapterFloat(p);
  // Bridge intro → chapter 0 across the first turn window
  const i = Math.min(CHAPTER_COUNT - 1, Math.floor(cf));
  const f = cf - Math.floor(cf); // 0..1 within current chapter slot
  // When cf == CHAPTER_COUNT exactly (at OUTRO_START), handled above

  const from = restPose(i - 1); // i=0 → INTRO_REST
  const to = restPose(i);
  const style = TURN_STYLE[i] ?? TURN_STYLE[0];

  const turnT = STAGE.spinEnd;
  let body: Omit<PhonePose, "scale" | "camZ">;
  let camZ: number;
  let scale: number;

  const scaleBlend = smoothstep(0, 1.15, cf);
  const baseScale = lerp(introScale, stageScale, scaleBlend);

  if (f < turnT) {
    const te = f / turnT;
    body = mixRest(from, to, te, style);
    const orbit = Math.sin(easeInOutQuint(te) * Math.PI);
    camZ = lerp(nearCam, farCam + 0.55, 0.12 + orbit * 0.35);
    scale = baseScale * (1 - orbit * 0.015);
  } else {
    body = {
      x: to.x,
      y: 0.2,
      z: 0.04,
      yaw: to.yaw,
      pitch: to.pitch,
      roll: to.roll,
    };
    const z = stageZoom(f);
    camZ = lerp(farCam + 0.3, nearCam - 1.5, z);
    scale = baseScale * (1 + z * 0.48);
  }

  return {
    ...body,
    scale,
    camZ,
  };
}

export type JourneySnapshot = {
  progress: number;
  chapter: number;
  holoIndex: number;
  local: number;
  title: number;
  line: number;
  body: number;
  bullets: number[];
  zoom: number;
  holo: number;
  face: number;
  outro: number;
  power: number;
  pose: PhonePose;
};

export function snapshotJourney(p: number): JourneySnapshot {
  const outro = outroAmount(p);
  const inIntro = p <= INTRO_END;
  const inOutro = p >= OUTRO_START;
  const chapter = chapterFromProgress(p);
  const local = inIntro ? 1 : chapterLocalProgress(p);
  const points = scrollChapters[chapter]?.points ?? [];
  const chapterGate =
    inIntro || inOutro
      ? 0
      : smoothstep(INTRO_END, INTRO_END + 0.015, p) *
        (1 - smoothstep(OUTRO_START - 0.015, OUTRO_START, p));

  const face = inIntro
    ? 1
    : inOutro
      ? 1 - smoothstep(0, 0.35, outro)
      : faceAmount(local);

  const textGate =
    chapterGate *
    (inIntro || inOutro
      ? 0
      : smoothstep(STAGE.spinEnd + 0.02, STAGE.spinEnd + 0.12, local));

  const holo = inIntro
    ? 1
    : inOutro
      ? 1 - smoothstep(0, 0.28, outro)
      : holoAmount(local);

  return {
    progress: p,
    chapter,
    holoIndex: inIntro ? -1 : chapter,
    local,
    title: titleReveal(local) * textGate,
    line:
      smoothstep(STAGE.titleEnd - 0.04, STAGE.titleEnd + 0.06, local) *
      textGate,
    body:
      smoothstep(STAGE.titleEnd, STAGE.bulletsStart + 0.04, local) * textGate,
    bullets: points.map((_, i) => bulletReveal(local, i) * textGate),
    zoom: inIntro ? 0.6 : inOutro ? 0 : stageZoom(local) * chapterGate,
    holo,
    face,
    outro,
    power: inOutro ? 1 - smoothstep(0, 0.3, outro) : 1,
    pose: phonePoseFromProgress(p),
  };
}
