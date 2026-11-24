"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  useGLTF,
} from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";

const FOLDER_URL = "/models/folder.glb";

/* -------------------------------------------------------------------------- */
/*  Timeline                                                                  */
/* -------------------------------------------------------------------------- */

const LOOP = 9.8;
const T = {
  drops: [0.6, 1.2, 1.8, 2.4],
  closeStart: 3.7,
  closeEnd: 6.0,
  reopenStart: 7.3,
  reopenEnd: 9.3,
  sheetsFadeOut: [4.9, 5.9],
  sheetsFadeIn: [8.7, 9.6],
} as const;

const CLIP_OPEN = 0.154;
// Fully flush would be 0.775. Stop a hair short so the flap never sits
// coplanar with the back panel: its top edge lifts off, the seam and both
// cover thicknesses stay readable.
const CLIP_CLOSED = 0.715;

// Soft, nearly critically damped: papers glide in and settle, no snap.
const SPRING_W = 4.4;
const SPRING_Z = 0.9;
const SPRING_OVERSHOOT = Math.exp(
  (-Math.PI * SPRING_Z) / Math.sqrt(1 - SPRING_Z * SPRING_Z),
);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const x = clamp01(v);
  return x * x * (3 - 2 * x);
};
const smoother = (v: number) => {
  const x = clamp01(v);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
const lerp = THREE.MathUtils.lerp;

function spring(tau: number) {
  if (tau <= 0) return 0;
  const wd = SPRING_W * Math.sqrt(1 - SPRING_Z * SPRING_Z);
  const decay = Math.exp(-SPRING_Z * SPRING_W * tau);
  return (
    1 -
    decay *
      (Math.cos(wd * tau) +
        ((SPRING_Z * SPRING_W) / wd) * Math.sin(wd * tau))
  );
}

function folderClipFraction(t: number) {
  if (t < T.closeStart) return CLIP_OPEN;
  if (t < T.closeEnd) {
    const p = (t - T.closeStart) / (T.closeEnd - T.closeStart);
    return lerp(CLIP_OPEN, CLIP_CLOSED, smoother(p));
  }
  if (t < T.reopenStart) return CLIP_CLOSED;
  // Ease from CLIP_CLOSED → CLIP_OPEN. (Previously this started at 0, which
  // slammed the flap past open every loop and felt like a jump.)
  const p = smoother((t - T.reopenStart) / (T.reopenEnd - T.reopenStart));
  return lerp(CLIP_CLOSED, CLIP_OPEN, p);
}

/* -------------------------------------------------------------------------- */
/*  Papers                                                                    */
/* -------------------------------------------------------------------------- */

// Papers stay readable but slightly smaller so the scaled-up folder dominates.
const SHEET_W = 2.2;
const SHEET_H = 1.55;
const SHEET_REST_Y = 1.05;
const SHEET_CORNER_R = 0.2;
const SEG_X = 10;
const SEG_Y = 14;

type SheetSpec = {
  paper: string;
  ink: string;
  restZ: number;
  hoverDy: number;
  hoverDx: number;
  hoverDz: number;
  hoverRz: number;
  seed: number;
};

const SHEETS: SheetSpec[] = [
  {
    paper: "#d8bc96",
    ink: "#8d6c45",
    restZ: 0.1,
    hoverDy: 0.75,
    hoverDx: -0.12,
    hoverDz: 0.38,
    hoverRz: 0.07,
    seed: 3,
  },
  {
    paper: "#f6f1e6",
    ink: "#6c6a64",
    restZ: 0.18,
    hoverDy: 0.92,
    hoverDx: 0.1,
    hoverDz: 0.48,
    hoverRz: -0.05,
    seed: 11,
  },
  {
    paper: "#efe5d2",
    ink: "#6f665a",
    restZ: 0.26,
    hoverDy: 1.08,
    hoverDx: -0.06,
    hoverDz: 0.56,
    hoverRz: 0.04,
    seed: 7,
  },
  {
    paper: "#fbfaf7",
    ink: "#74747a",
    restZ: 0.34,
    hoverDy: 1.22,
    hoverDx: 0.09,
    hoverDz: 0.64,
    hoverRz: -0.07,
    seed: 19,
  },
];

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makePaperTexture(paper: string, ink: string, seed: number) {
  // Rounded-sheet silhouette lives in the texture alpha; the geometry stays a
  // plain rectangle so the corners can never be pinched or sliced by vertices.
  const w = 512;
  const h = Math.round((512 * SHEET_H) / SHEET_W);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const corner = Math.round((SHEET_CORNER_R / SHEET_W) * w);
  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  ctx.moveTo(corner, 0);
  ctx.arcTo(w, 0, w, h, corner);
  ctx.arcTo(w, h, 0, h, corner);
  ctx.arcTo(0, h, 0, 0, corner);
  ctx.arcTo(0, 0, w, 0, corner);
  ctx.closePath();
  ctx.fillStyle = paper;
  ctx.fill();
  ctx.save();
  ctx.clip();
  const r = rng(seed);
  for (let i = 0; i < 1600; i++) {
    ctx.fillStyle = `rgba(0,0,0,${0.015 + r() * 0.03})`;
    ctx.fillRect(r() * w, r() * h, 2, 2);
  }
  // faint edge shading so each sheet reads as a slab, not a flat decal
  const edge = ctx.createLinearGradient(0, 0, 0, h);
  edge.addColorStop(0, "rgba(0,0,0,0.05)");
  edge.addColorStop(0.5, "rgba(0,0,0,0)");
  edge.addColorStop(1, "rgba(0,0,0,0.07)");
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.55;
  ctx.fillRect(44, 52, 168 + r() * 60, 22);
  ctx.globalAlpha = 0.24;
  for (let i = 0; i < 9; i++) {
    const width = i % 4 === 3 ? 180 + r() * 80 : 392 + r() * 44 - 22;
    ctx.fillRect(44, 112 + i * 28, width, 10);
  }
  ctx.restore();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  return tex;
}

type Sheet = {
  mesh: THREE.Mesh;
  geo: THREE.PlaneGeometry;
  base: Float32Array;
  solid: THREE.MeshStandardMaterial;
  tex: THREE.CanvasTexture;
};

function buildSheets(): Sheet[] {
  return SHEETS.map((s, i) => {
    const geo = new THREE.PlaneGeometry(SHEET_W, SHEET_H, SEG_X, SEG_Y);
    const tex = makePaperTexture(s.paper, s.ink, s.seed);
    const common = {
      map: tex,
      roughness: 0.9,
      metalness: 0,
      side: THREE.FrontSide,
      // Keep stacked sheets from z-fighting when they settle.
      polygonOffset: true,
      polygonOffsetFactor: -1 - i,
      polygonOffsetUnits: -1 - i,
    } as const;
    // Opaque + alpha-to-coverage only — never transparent, so a front sheet
    // can't reveal the ones behind it while landing or fading.
    const solid = new THREE.MeshStandardMaterial({
      ...common,
      alphaTest: 0.5,
      alphaToCoverage: true,
      depthWrite: true,
      depthTest: true,
      transparent: false,
    });
    const mesh = new THREE.Mesh(geo, solid);
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.renderOrder = i;
    return {
      mesh,
      geo,
      base: (geo.attributes.position.array as Float32Array).slice(),
      solid,
      tex,
    };
  });
}

function poseSheet(sheet: Sheet, i: number, t: number, still: boolean) {
  const spec = SHEETS[i];
  const tau = t - T.drops[i];
  const h = 1 / 120;
  const inFlight = t < T.reopenStart;

  // Clamp the spring so overshoot never drives a sheet through the stack.
  const raw = inFlight ? spring(tau) : 0;
  const x = clamp01(raw);
  const v = inFlight
    ? (clamp01(spring(tau + h)) - clamp01(spring(tau - h))) / (2 * h)
    : 0;

  // Anticipation only while the sheet is waiting to drop; it is 0 again
  // by the time the loop wraps so t=LOOP and t=0 match exactly.
  const antic =
    still || t >= T.reopenStart ? 0 : smooth((tau + 0.6) / 0.6);
  const hoverAmt = 1 - x;

  const w = (Math.PI * 2) / LOOP;
  const bob = still ? 0 : Math.sin(t * w * 2 + i * 1.4) * 0.024 * hoverAmt;
  const sway = still ? 0 : Math.sin(t * w * 1 + i * 2.1) * 0.016 * hoverAmt;

  const speed = clamp01(Math.abs(v) / (SPRING_W * 0.5));
  const impact = Math.max(0, raw - 1) / SPRING_OVERSHOOT;

  const sy = 1 + 0.06 * speed - 0.04 * impact;
  const sx = 1 - (sy - 1) * 0.5;

  sheet.mesh.position.set(
    spec.hoverDx * hoverAmt,
    SHEET_REST_Y + (spec.hoverDy + 0.06 * antic) * hoverAmt + bob,
    spec.restZ + spec.hoverDz * hoverAmt,
  );
  sheet.mesh.rotation.set(-0.28 * hoverAmt, 0, spec.hoverRz * hoverAmt + sway);
  sheet.mesh.scale.set(sx, sy, 1);

  const belly = 0.08 * speed + 0.08 * impact;
  const ripple = 0.015 * speed;
  const pos = sheet.geo.attributes.position;
  const arr = pos.array as Float32Array;
  for (let k = 0; k < arr.length; k += 3) {
    const ny = (sheet.base[k + 1] / SHEET_H) * 2;
    const nx = (sheet.base[k] / SHEET_W) * 2;
    arr[k + 2] =
      belly * (1 - ny * ny) * (1 - 0.35 * nx * nx) +
      ripple * Math.sin(ny * 3.4 - tau * 8);
  }
  pos.needsUpdate = true;
  sheet.geo.computeVertexNormals();

  // Hide behind the closing flap by sliding into the pocket + visibility —
  // never transparent, so you can't see earlier sheets through the front one.
  let hide = 0;
  if (t >= T.sheetsFadeIn[0] - 0.01 && t >= T.reopenStart) {
    hide =
      1 -
      smooth(
        (t - T.sheetsFadeIn[0]) / (T.sheetsFadeIn[1] - T.sheetsFadeIn[0]),
      );
  } else if (t >= T.sheetsFadeOut[0]) {
    hide = smooth(
      (t - T.sheetsFadeOut[0]) / (T.sheetsFadeOut[1] - T.sheetsFadeOut[0]),
    );
  }
  if (hide > 0) {
    sheet.mesh.position.z -= hide * 0.12;
    sheet.mesh.position.y -= hide * 0.08;
    sheet.mesh.scale.multiplyScalar(1 - 0.12 * hide);
  }
  sheet.mesh.material = sheet.solid;
  sheet.mesh.visible = hide < 0.97;
}

/* -------------------------------------------------------------------------- */
/*  Camera                                                                    */
/* -------------------------------------------------------------------------- */

const FOV = 30;
const TAN_HALF = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
const _dir = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3();
const _c = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

function orbitDir(az: number, el: number, out: THREE.Vector3) {
  return out.set(
    Math.sin(az) * Math.cos(el),
    Math.sin(el),
    Math.cos(az) * Math.cos(el),
  );
}

function fitDistancePoints(
  pts: THREE.Vector3[],
  n: number,
  target: THREE.Vector3,
  az: number,
  el: number,
  aspect: number,
) {
  orbitDir(az, el, _dir);
  _right.crossVectors(UP, _dir).normalize();
  _up.crossVectors(_dir, _right).normalize();
  let d = 0;
  for (let i = 0; i < n; i++) {
    _c.copy(pts[i]).sub(target);
    const px = Math.abs(_c.dot(_right));
    const py = Math.abs(_c.dot(_up));
    const toward = _c.dot(_dir);
    d = Math.max(d, Math.max(py / TAN_HALF, px / (TAN_HALF * aspect)) + toward);
  }
  return d;
}

const _target = new THREE.Vector3();
const _rig = new THREE.Matrix4();
const _pt = new THREE.Vector3();
const _fMin = new THREE.Vector3();
const _fMax = new THREE.Vector3();
const _bMin = new THREE.Vector3();
const _bMax = new THREE.Vector3();
const _tgt = new THREE.Vector3();
const _fc = new THREE.Vector3();
const _fm = new THREE.Matrix4();
const _sm = new THREE.Matrix4();
const FRAME_PAD = 0.14; // world-unit pad for tilt, bob, squash/stretch, belly
const FRAME_LIFT = 0.09; // fraction of camera distance the scene is raised
const FIT_MARGIN = 1.12; // extra pull-back so nothing touches the canvas edge

/* -------------------------------------------------------------------------- */
/*  Scene: folder.glb (soft-cornered), painted blue                         */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  Soft folder geometry                                                      */
/*                                                                            */
/*  folder.glb is a 124-triangle box-ish mesh. To round it without touching   */
/*  its silhouette or skin weights we (1) slice every triangle on a lattice   */
/*  of x / y planes (watertight, attributes interpolated), (2) pull only the  */
/*  outline *corners* onto circular fillets in the rest pose (a clamp-to-arc  */
/*  that is the identity everywhere else), and (3) re-smooth normals so edges */
/*  catch light. The tab, hinge, flap and pocket are untouched.               */
/* -------------------------------------------------------------------------- */

type V4 = [number, number, number, number]; // x, y, z, weight of bone 1
type N3 = [number, number, number];
type Tri = [V4, V4, V4, N3, N3[]?]; // + source face normal (+ original vertex normals while untouched)

const SLICE = 0.028;
const TOP_Y = 1.6; // top strip: fillets + lattice only above this
const EPS = 1e-6;

function lattice(ranges: [number, number][], step: number) {
  const out: number[] = [];
  for (const [a, b] of ranges) {
    for (let v = Math.ceil(a / step) * step; v <= b + 1e-9; v += step) {
      out.push(Math.round(v * 1e5) / 1e5);
    }
  }
  return [...new Set(out)].sort((p, q) => p - q);
}

const PLANES_X = lattice(
  [
    [-1.45, -0.85],
    [-0.02, 1.45],
  ],
  SLICE,
);
const PLANES_Z = lattice([[0.06, 0.28]], 0.01);
const PLANES_Y = lattice(
  [
    [TOP_Y, 2.36],
  ],
  SLICE,
);

function lowerBound(a: number[], x: number) {
  let lo = 0;
  let hi = a.length;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    if (a[m] < x) lo = m + 1;
    else hi = m;
  }
  return lo;
}

function mixV(a: V4, b: V4, t: number): V4 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
    a[3] + (b[3] - a[3]) * t,
  ];
}

function pushFan(poly: V4[], out: Tri[], n: N3) {
  for (let i = 1; i < poly.length - 1; i++) {
    const a = poly[0];
    const b = poly[i];
    const c = poly[i + 1];
    const ux = b[0] - a[0];
    const uy = b[1] - a[1];
    const uz = b[2] - a[2];
    const vx = c[0] - a[0];
    const vy = c[1] - a[1];
    const vz = c[2] - a[2];
    const cx = uy * vz - uz * vy;
    const cy = uz * vx - ux * vz;
    const cz = ux * vy - uy * vx;
    if (cx * cx + cy * cy + cz * cz > 1e-14) out.push([a, b, c, n]);
  }
}

function sliceTri(tri: Tri, axis: 0 | 1 | 2, planes: number[], out: Tri[]) {
  const lo = Math.min(tri[0][axis], tri[1][axis], tri[2][axis]);
  const hi = Math.max(tri[0][axis], tri[1][axis], tri[2][axis]);
  const i = lowerBound(planes, lo + EPS);
  if (i >= planes.length || planes[i] >= hi - EPS) {
    out.push(tri);
    return;
  }
  const c = planes[i];
  const pos: V4[] = [];
  const neg: V4[] = [];
  for (let k = 0; k < 3; k++) {
    const cur = tri[k] as V4;
    const nxt = tri[(k + 1) % 3] as V4;
    const dc = cur[axis] - c;
    const dn = nxt[axis] - c;
    if (dc >= 0) pos.push(cur);
    if (dc <= 0) neg.push(cur);
    if ((dc > 0 && dn < 0) || (dc < 0 && dn > 0)) {
      const m = mixV(cur, nxt, dc / (dc - dn));
      m[axis] = c;
      pos.push(m);
      neg.push(m);
    }
  }
  const pieces: Tri[] = [];
  pushFan(pos, pieces, tri[3]);
  pushFan(neg, pieces, tri[3]);
  for (const p of pieces) sliceTri(p, axis, planes, out);
}

type Fillet = {
  cx: number;
  cy: number;
  r: number;
  u1x: number;
  u1y: number;
  u2x: number;
  u2y: number;
  det: number;
  layer: "any" | "back" | "front";
};

// Fillet of radius r at polygon corner V between unit edge directions a and b.
function fillet(
  vx: number,
  vy: number,
  a: [number, number],
  b: [number, number],
  r: number,
  layer: Fillet["layer"] = "any",
): Fillet {
  const half = Math.acos(a[0] * b[0] + a[1] * b[1]) / 2;
  const t = r / Math.tan(half);
  const dist = r / Math.sin(half);
  const bx = a[0] + b[0];
  const by = a[1] + b[1];
  const bl = Math.hypot(bx, by);
  const cx = vx + (bx / bl) * dist;
  const cy = vy + (by / bl) * dist;
  const u1x = (vx + a[0] * t - cx) / r;
  const u1y = (vy + a[1] * t - cy) / r;
  const u2x = (vx + b[0] * t - cx) / r;
  const u2y = (vy + b[1] * t - cy) / r;
  return { cx, cy, r, u1x, u1y, u2x, u2y, det: u1x * u2y - u1y * u2x, layer };
}

// Outline corners of folder.glb in its rest pose (x, y), per layer.
const R_TOP = 0.34;
const R_TAB = 0.32;
const FILLETS: Fillet[] = [
  // top-left, back panel + front cover
  fillet(-1.4, 2.08, [1, 0], [0, -1], R_TOP),
  // top-right of the front cover
  fillet(1.4, 2.07, [-1, 0], [0, -1], R_TOP, "front"),
  // top-right of the back panel, where it runs into the tab slope
  fillet(1.4, 2.032, [0, -1], [-0.781, 0.625], R_TOP, "back"),
  // tab top corners
  fillet(1.09, 2.28, [-1, 0], [0.781, -0.625], R_TAB, "back"),
  fillet(0.26, 2.28, [1, 0], [-0.768, -0.64], R_TAB, "back"),
];

function roundCorner(v: V4) {
  const layer = v[2] < 0.1 ? "back" : "front";
  for (const f of FILLETS) {
    if (f.layer !== "any" && f.layer !== layer) continue;
    const qx = v[0] - f.cx;
    const qy = v[1] - f.cy;
    const len = Math.hypot(qx, qy);
    if (len <= f.r) continue;
    const al = (qx * f.u2y - qy * f.u2x) / f.det;
    const be = (f.u1x * qy - f.u1y * qx) / f.det;
    if (al >= -1e-9 && be >= -1e-9) {
      v[0] = f.cx + (qx / len) * f.r;
      v[1] = f.cy + (qy / len) * f.r;
      return;
    }
  }
}

function buildSoftFolderGeometry(src: THREE.BufferGeometry, creaseDeg: number) {
  const pos = src.attributes.position;
  const sj = src.attributes.skinIndex;
  const sw = src.attributes.skinWeight;
  const idx = src.index;
  if (!pos || !sj || !sw || !idx) return null;

  const verts: V4[] = [];
  for (let i = 0; i < pos.count; i++) {
    let w1 = 0;
    for (let k = 0; k < 4; k++) {
      if (sj.getComponent(i, k) === 1) w1 += sw.getComponent(i, k);
    }
    // folder.glb quirk: on the hinge lip the centre-line vertices are 100%
    // flap while the ones beside them (same height/depth) are 50/50. That
    // bends the lip differently left and right of centre; make it uniform.
    if (
      Math.abs(pos.getX(i)) < 0.1 &&
      pos.getY(i) > 0.05 &&
      pos.getY(i) < 0.35 &&
      pos.getZ(i) > 0.1 &&
      pos.getZ(i) < 0.14 &&
      w1 > 0.75
    ) {
      w1 = 0.5;
    }
    verts.push([pos.getX(i), pos.getY(i), pos.getZ(i), w1]);
  }

  let tris: Tri[] = [];
  for (let i = 0; i < idx.count; i += 3) {
    const a = verts[idx.getX(i)];
    const b = verts[idx.getX(i + 1)];
    const c = verts[idx.getX(i + 2)];
    const ux = b[0] - a[0];
    const uy = b[1] - a[1];
    const uz = b[2] - a[2];
    const vx = c[0] - a[0];
    const vy = c[1] - a[1];
    const vz = c[2] - a[2];
    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;
    const nl = Math.hypot(nx, ny, nz) || 1;
    const on = src.attributes.normal;
    const orig: N3[] | undefined = on
      ? [0, 1, 2].map(
          (q) =>
            [
              on.getX(idx.getX(i + q)),
              on.getY(idx.getX(i + q)),
              on.getZ(idx.getX(i + q)),
            ] as N3,
        )
      : undefined;
    tris.push([a, b, c, [nx / nl, ny / nl, nz / nl], orig]);
  }
  for (const [axis, planes] of [
    [1, PLANES_Y],
    [0, PLANES_X],
  ] as [0 | 1, number[]][]) {
    const next: Tri[] = [];
    for (const t of tris) {
      const ymin = Math.min(t[0][1], t[1][1], t[2][1]);
      // Lattice only the top corner strip. Everything below (hinge, flap, base
      // rim) stays the original triangles, so skinning never sees interpolated
      // hinge weights and the open flap can't get jagged cuts or seams.
      if (axis === 0 && ymin < TOP_Y - 0.01) {
        next.push(t);
      } else sliceTri(t, axis, planes, next);
    }
    tris = next;
  }

  // The hinge lip bends: cut it into thin rows along z so the blended skin
  // curves it smoothly (every row is x-invariant, so no diagonal facets or
  // centre seam). Only the short lip triangles with mixed weights are touched.
  {
    const next: Tri[] = [];
    for (const t of tris) {
      const ymax = Math.max(t[0][1], t[1][1], t[2][1]);
      const wmin = Math.min(t[0][3], t[1][3], t[2][3]);
      const wmax = Math.max(t[0][3], t[1][3], t[2][3]);
      if (ymax < 0.35 && wmax - wmin > 0.01) sliceTri(t, 2, PLANES_Z, next);
      else next.push(t);
    }
    tris = next;
  }

  // Corner clamp. Vertices are copied first so shared edges move identically.
  const key = (v: V4) =>
    `${Math.round(v[0] * 1e4)},${Math.round(v[1] * 1e4)},${Math.round(v[2] * 1e4)}`;
  const moved = new Map<string, [number, number]>();
  for (const t of tris) {
    for (let k = 0; k < 3; k++) {
      const v = t[k] as V4;
      const kk = key(v);
      let m = moved.get(kk);
      if (!m) {
        const c: V4 = [v[0], v[1], v[2], v[3]];
        roundCorner(c);
        m = [c[0], c[1]];
        moved.set(kk, m);
      }
      t[k] = [m[0], m[1], v[2], v[3]];
    }
  }

  const n = tris.length * 3;
  const position = new Float32Array(n * 3);
  const skinIndex = new Uint16Array(n * 4);
  const skinWeight = new Float32Array(n * 4);
  const faceN = new Float32Array(tris.length * 3);
  tris.forEach((t, f) => {
    for (let k = 0; k < 3; k++) {
      const o = f * 9 + k * 3;
      const tv = t[k] as V4;
      position[o] = tv[0];
      position[o + 1] = tv[1];
      position[o + 2] = tv[2];
      const s = (f * 3 + k) * 4;
      // Up top every vertex belongs fully to one bone; snap so sliced points
      // follow the rigid plate. The hinge lip keeps its blended weights.
      const w1 = tv[1] > 1.4 ? (tv[3] > 0.5 ? 1 : 0) : Math.min(1, Math.max(0, tv[3]));
      skinIndex[s] = 0;
      skinIndex[s + 1] = 1;
      skinWeight[s] = 1 - w1;
      skinWeight[s + 1] = w1;
    }
    const a = t[0];
    const b = t[1];
    const c = t[2];
    const ux = b[0] - a[0];
    const uy = b[1] - a[1];
    const uz = b[2] - a[2];
    const vx = c[0] - a[0];
    const vy = c[1] - a[1];
    const vz = c[2] - a[2];
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz);
    if (l > 2e-4) {
      nx /= l;
      ny /= l;
      nz /= l;
    } else {
      // sliver: geometric normal is noise, inherit the source face's
      [nx, ny, nz] = t[3];
    }
    faceN[f * 3] = nx;
    faceN[f * 3 + 1] = ny;
    faceN[f * 3 + 2] = nz;
  });

  // Crease-angle smoothing: average the normals of faces that meet at a point
  // and sit within `creaseDeg` of this face. Keeps big flat panels flat while
  // rolling the thin edges.
  const cos = Math.cos(THREE.MathUtils.degToRad(creaseDeg));
  const groups = new Map<string, number[]>();
  for (let i = 0; i < n; i++) {
    const kk = `${Math.round(position[i * 3] * 4e3)},${Math.round(position[i * 3 + 1] * 4e3)},${Math.round(position[i * 3 + 2] * 4e3)}`;
    const g = groups.get(kk);
    if (g) g.push(i);
    else groups.set(kk, [i]);
  }
  const normal = new Float32Array(n * 3);
  for (const g of groups.values()) {
    for (const i of g) {
      const f = (i / 3) | 0;
      let sx = 0;
      let sy = 0;
      let sz = 0;
      for (const j of g) {
        const h = (j / 3) | 0;
        const d =
          faceN[f * 3] * faceN[h * 3] +
          faceN[f * 3 + 1] * faceN[h * 3 + 1] +
          faceN[f * 3 + 2] * faceN[h * 3 + 2];
        if (d >= cos) {
          sx += faceN[h * 3];
          sy += faceN[h * 3 + 1];
          sz += faceN[h * 3 + 2];
        }
      }
      const l = Math.hypot(sx, sy, sz) || 1;
      // Smooth only in the rounded top strip; the rest keeps face normals.
      const y = position[i * 3 + 1];
      const m = smooth((y - TOP_Y) / 0.18);
      const bx = faceN[f * 3] + (sx / l - faceN[f * 3]) * m;
      const by = faceN[f * 3 + 1] + (sy / l - faceN[f * 3 + 1]) * m;
      const bz = faceN[f * 3 + 2] + (sz / l - faceN[f * 3 + 2]) * m;
      const bl = Math.hypot(bx, by, bz) || 1;
      normal[i * 3] = bx / bl;
      normal[i * 3 + 1] = by / bl;
      normal[i * 3 + 2] = bz / bl;
    }
  }

  // Everything below the rounded strip is shaded with true per-face normals.
  // The authored normals in folder.glb disagree across the hinge lip and flap,
  // which showed up as a centre seam plus diagonal facets; flat faces on these
  // planar slabs are clean and continuous.
  tris.forEach((t, f) => {
    const ymax = Math.max(t[0][1], t[1][1], t[2][1]);
    if (ymax > TOP_Y + 0.005) return;
    for (let k = 0; k < 3; k++) {
      const q = f * 9 + k * 3;
      normal[q] = faceN[f * 3];
      normal[q + 1] = faceN[f * 3 + 1];
      normal[q + 2] = faceN[f * 3 + 2];
    }
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geo.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
  geo.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(skinIndex, 4));
  geo.setAttribute("skinWeight", new THREE.Float32BufferAttribute(skinWeight, 4));
  geo.computeBoundingSphere();
  return geo;
}

function FolderScene({ reduce }: { reduce: boolean }) {
  const { scene, animations } = useGLTF(FOLDER_URL);

  // Same folder.glb + soft corner fillets (top/tab/bottom only). Mid-hinge
  // triangles stay original so the shell stays solid with no hairline gaps.
  const folder = useMemo(() => {
    const obj = cloneSkinned(scene);
    const clay = new THREE.MeshStandardMaterial({
      color: "#3B82F6",
      roughness: 0.8,
      metalness: 0,
      side: THREE.DoubleSide,
      flatShading: false,
      depthWrite: true,
      depthTest: true,
      transparent: false,
      opacity: 1,
    });
    let skinned: THREE.SkinnedMesh | null = null;
    obj.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = clay;
      mesh.frustumCulled = false;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.renderOrder = 0;
      if ((mesh as THREE.SkinnedMesh).isSkinnedMesh) {
        skinned = mesh as THREE.SkinnedMesh;
      }
    });
    const sk = skinned as THREE.SkinnedMesh | null;

    let fit: THREE.SkinnedMesh | null = null;
    let soft: THREE.BufferGeometry | null = null;
    if (sk) {
      fit = new THREE.SkinnedMesh(sk.geometry, clay);
      fit.bind(sk.skeleton, sk.bindMatrix);
      soft = buildSoftFolderGeometry(sk.geometry, 95);
      if (soft) sk.geometry = soft;
    }
    return { obj, clay, skinned: sk, fit, soft };
  }, [scene]);

  const skeleton = folder.skinned?.skeleton ?? null;

  const mixer = useMemo(
    () => new THREE.AnimationMixer(folder.obj),
    [folder.obj],
  );
  const openAction = useMemo(() => {
    const clip =
      animations.find((a) => a.name === "opening") ?? animations[0] ?? null;
    if (!clip) return null;
    const action = mixer.clipAction(clip);
    action.enabled = true;
    action.setEffectiveWeight(1);
    action.play();
    action.paused = true;
    return action;
  }, [mixer, animations]);

  const sheets = useMemo(() => buildSheets(), []);
  const camPts = useMemo(() => {
    const nv = folder.fit?.geometry.attributes.position.count ?? 0;
    return Array.from(
      { length: nv + SHEETS.length * 8 },
      () => new THREE.Vector3(),
    );
  }, [folder]);

  // Measure the real animation extents once (folder open/closed + papers at
  // their highest hover pose) so the camera frames the whole thing.
  const frame = useMemo(() => {
    const empty = {
      full: new THREE.Box3(
        new THREE.Vector3(-1.6, -0.1, -0.3),
        new THREE.Vector3(1.6, 3.2, 1.5),
      ),
      closed: new THREE.Box3(
        new THREE.Vector3(-1.5, -0.1, -0.2),
        new THREE.Vector3(1.5, 2.4, 0.5),
      ),
      floorY: -0.05,
    };
    if (!openAction || !folder.fit || !skeleton) return empty;

    const duration = openAction.getClip().duration;
    const measure = (frac: number) => {
      openAction.time = duration * frac;
      openAction.paused = true;
      mixer.update(0.0001);
      folder.obj.updateMatrixWorld(true);
      skeleton.update();
      folder.fit!.computeBoundingBox();
      return folder.fit!.boundingBox!.clone();
    };
    const rigAt = () => {
      folder.obj.updateMatrixWorld(true);
      return new THREE.Matrix4()
        .copy(folder.obj.matrixWorld)
        .invert()
        .multiply(skeleton.bones[0].matrixWorld)
        .multiply(skeleton.boneInverses[0]);
    };
    const sheetBox = (rigM: THREE.Matrix4, t: number) => {
      const box = new THREE.Box3();
      sheets.forEach((s, i) => {
        poseSheet(s, i, t, false);
        s.mesh.visible = true;
        s.mesh.updateMatrix();
        for (const sx of [-1, 1]) {
          for (const sy of [-1, 1]) {
            for (const sz of [-0.25, 0.25]) {
              _pt
                .set((sx * SHEET_W) / 2, (sy * SHEET_H) / 2, sz)
                .applyMatrix4(s.mesh.matrix)
                .applyMatrix4(rigM);
              box.expandByPoint(_pt);
            }
          }
        }
      });
      return box;
    };

    const openBox = measure(CLIP_OPEN);
    const rigOpen = rigAt();
    // Sample the whole flight so the highest hover / anticipation is counted.
    const papers = new THREE.Box3();
    for (let k = 0; k <= 12; k++) {
      papers.union(sheetBox(rigOpen, T.drops[0] - 0.35 + k * 0.18));
    }
    const closedBox = measure(CLIP_CLOSED);
    const rigClosed = rigAt();
    const closedPapers = sheetBox(rigClosed, T.closeEnd - 0.05);
    const closed = closedBox.clone().union(closedPapers);
    const full = openBox.clone().union(papers).union(closedBox);
    full.expandByScalar(FRAME_PAD);
    closed.expandByScalar(FRAME_PAD);
    return {
      full,
      closed,
      floorY: Math.min(openBox.min.y, closedBox.min.y) - 0.015,
    };
  }, [openAction, folder, skeleton, mixer, sheets]);

  useEffect(() => {
    return () => {
      mixer.stopAllAction();
      folder.clay.dispose();
      folder.soft?.dispose();
      sheets.forEach((s) => {
        s.geo.dispose();
        s.solid.dispose();
        s.tex.dispose();
      });
    };
  }, [folder, sheets, mixer]);

  const root = useRef<THREE.Group>(null);
  const folderGroup = useRef<THREE.Group>(null);
  const rig = useRef<THREE.Group>(null);
  const clock = useRef(0.15);
  const smTarget = useRef(new THREE.Vector3());
  const smDist = useRef(10);
  const camInit = useRef(false);

  useFrame((state, delta) => {
    if (!openAction || !root.current || !folderGroup.current || !rig.current) {
      return;
    }

    const still = reduce;
    (window as unknown as { __st?: unknown }).__st = state; // DEBUGTMP
    const dbg = (window as unknown as { __ft?: number }).__ft; // DEBUGTMP
    if (typeof dbg === "number") clock.current = dbg; // DEBUGTMP
    else if (!still) clock.current = (clock.current + Math.min(delta, 0.05)) % LOOP;
    const t = still ? T.closeEnd + 0.6 : clock.current;

    const duration = openAction.getClip().duration;
    const frac = folderClipFraction(t);
    openAction.time = THREE.MathUtils.clamp(duration * frac, 0, duration);
    openAction.paused = true;
    mixer.update(0.0001);

    const sinceClosed = t - T.closeEnd;
    const settle =
      sinceClosed > 0 && t < T.reopenStart
        ? Math.exp(-2.4 * sinceClosed) * Math.sin(3.6 * sinceClosed)
        : 0;
    folderGroup.current.scale.set(1 + 0.004 * settle, 1 - 0.007 * settle, 1);

    const floatIn =
      smooth(sinceClosed / 2.0) * (1 - smooth((t - T.reopenStart) / 1.6));
    const floatY = still
      ? 0
      : Math.sin(Math.max(0, sinceClosed) * 1.7) * 0.03 * floatIn;
    root.current.position.y = floatY;
    root.current.rotation.set(
      -0.05,
      still
        ? 0.08
        : 0.08 + Math.sin(Math.max(0, sinceClosed) * 1.1) * 0.03 * floatIn,
      0,
    );

    folder.obj.updateWorldMatrix(true, true);
    if (skeleton) {
      _rig
        .copy(folder.obj.matrixWorld)
        .invert()
        .multiply(skeleton.bones[0].matrixWorld)
        .multiply(skeleton.boneInverses[0]);
      rig.current.matrix.copy(folderGroup.current.matrix).multiply(_rig);
      rig.current.matrixWorldNeedsUpdate = true;
    }

    sheets.forEach((s, i) => poseSheet(s, i, still ? T.closeEnd + 1 : t, still));

    // ---- Camera framing -------------------------------------------------
    // Fit the camera to the points that are actually on screen this frame:
    // every skinned folder vertex (open flap included) plus every paper
    // corner. The camera target eases toward their centre, the distance is
    // computed against the *eased* target, and it may only shrink gradually,
    // so no frame ever crops a vertex.
    root.current.updateMatrix();
    folderGroup.current.updateMatrix();
    rig.current.matrix.copy(folderGroup.current.matrix).multiply(_rig);
    _fm.multiplyMatrices(root.current.matrix, folderGroup.current.matrix);
    _sm.multiplyMatrices(root.current.matrix, rig.current.matrix);

    const pts = camPts;
    let n = 0;
    _fMin.set(Infinity, Infinity, Infinity);
    _fMax.set(-Infinity, -Infinity, -Infinity);
    if (folder.fit && skeleton) {
      skeleton.update();
      const count = folder.fit.geometry.attributes.position.count;
      for (let i = 0; i < count; i++) {
        folder.fit.getVertexPosition(i, _pt);
        _pt.applyMatrix4(_fm);
        pts[n++].copy(_pt);
        _fMin.min(_pt);
        _fMax.max(_pt);
      }
    }
    _fc.addVectors(_fMin, _fMax).multiplyScalar(0.5);
    // Papers count while on screen; they ramp in just before fading back in
    // so the camera is already wide when they appear.
    const sheetsW = still
      ? 0
      : t < 7
        ? 1 -
          smooth(
            (t - T.sheetsFadeOut[0]) /
              (T.sheetsFadeOut[1] - T.sheetsFadeOut[0]),
          )
        : smooth((t - (T.sheetsFadeIn[0] - 1.4)) / 1.6);
    sheets.forEach((sh) => {
      sh.mesh.updateMatrix();
      for (const sx of [-1, 1]) {
        for (const sy of [-1, 1]) {
          for (const sz of [-0.2, 0.2]) {
            _pt
              .set((sx * SHEET_W) / 2, (sy * SHEET_H) / 2, sz)
              .applyMatrix4(sh.mesh.matrix)
              .applyMatrix4(_sm);
            pts[n++].lerpVectors(_fc, _pt, sheetsW);
          }
        }
      }
    });
    _bMin.set(Infinity, Infinity, Infinity);
    _bMax.set(-Infinity, -Infinity, -Infinity);
    for (let i = 0; i < n; i++) {
      _bMin.min(pts[i]);
      _bMax.max(pts[i]);
    }
    _tgt.addVectors(_bMin, _bMax).multiplyScalar(0.5);

    const dt = Math.min(delta, 0.05);
    const k = 1 - Math.exp(-dt * 1.4);
    const kUp = 1 - Math.exp(-dt * 3);
    if (!camInit.current || still) {
      smTarget.current.copy(_tgt);
    } else {
      smTarget.current.lerp(_tgt, k);
    }
    _target.copy(smTarget.current);

    const reopenCam = smooth((t - (T.reopenStart - 0.9)) / 2.8);
    const orbitP = still ? 1 : smooth((t - 0.3) / 6.4) * (1 - reopenCam);
    const az = lerp(-0.24, 0.4, orbitP);
    const el = lerp(
      0.3,
      0.18,
      still ? 1 : smooth((t - 0.8) / 5.8) * (1 - reopenCam),
    );
    const aspect = state.size.width / Math.max(1, state.size.height);

    // Sit the composition higher in the frame: aim a little below the
    // content centre (along the camera's up axis). The fit below uses this
    // lowered aim point, so the full silhouette still stays inside the frame.
    orbitDir(az, el, _dir);
    _right.crossVectors(UP, _dir).normalize();
    _up.crossVectors(_dir, _right).normalize();
    _target.addScaledVector(_up, -FRAME_LIFT * smDist.current);

    const raw = fitDistancePoints(pts, n, _target, az, el, aspect) * FIT_MARGIN;
    if (!camInit.current || still) {
      smDist.current = raw;
      camInit.current = true;
    } else {
      // ease both ways; the floor (raw * 0.96) sits inside FIT_MARGIN so a
      // fast-growing pose can never crop even while the ease catches up.
      const eased = lerp(smDist.current, raw, raw > smDist.current ? kUp : k);
      smDist.current = Math.max(raw * 0.96, eased);
    }
    const dist = smDist.current;

    orbitDir(az, el, _dir);
    state.camera.position.copy(_target).addScaledVector(_dir, dist);
    state.camera.lookAt(_target);
  });

  return (
    <>
      <group ref={root}>
        <group ref={folderGroup}>
          <primitive object={folder.obj} />
        </group>
        <group ref={rig} matrixAutoUpdate={false}>
          {sheets.map((s, i) => (
            <primitive key={i} object={s.mesh} />
          ))}
        </group>
      </group>
    </>
  );
}

// Shadowless lighting — form from colour only, no shadow maps.
const KEY_POS: [number, number, number] = [3.6, 6.2, 3.4];

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.28} />
      <hemisphereLight args={["#dfe8ff", "#14141a", 0.5]} />
      <directionalLight position={KEY_POS} intensity={2.8} />
      <directionalLight
        position={[-4.5, 3.4, -3.5]}
        intensity={1.5}
        color="#b9ccff"
      />
      <directionalLight
        position={[-1.2, 1.4, 5.2]}
        intensity={0.65}
        color="#e8f0ff"
      />
      <Environment frames={1} resolution={64} environmentIntensity={0.4}>
        <Lightformer
          form="rect"
          intensity={2}
          position={[4, 5, 4]}
          scale={[8, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.0}
          position={[-6, 3, -3]}
          scale={[6, 3, 1]}
          color="#c6d6ff"
        />
      </Environment>
    </>
  );
}

export function BriefcaseCanvas({
  className = "",
  reduce = false,
}: {
  className?: string;
  reduce?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className={`relative h-full w-full ${className}`}>
      <Canvas
        camera={{ position: [0, 2.4, 9], fov: FOV, near: 1, far: 80 }}
        dpr={[1, 1.5]}
        frameloop={reduce || !inView ? "demand" : "always"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <Lighting />
        <FolderScene reduce={reduce} />
      </Canvas>
    </div>
  );
}

useGLTF.preload(FOLDER_URL);
