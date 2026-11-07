"use client";

/* eslint-disable react-hooks/immutability -- R3F/Three scene graph is mutated every frame */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  IPhoneModel,
  preloadPhoneModel,
} from "@/components/three/IPhoneModel";
import {
  JourneySnapshot,
  OUTRO_START,
  lerp,
} from "@/lib/journeyMotion";

const SPACE = "#050508";

/** In-memory studio env. reflections without downloading HDR */
function SoftEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const envScene = new RoomEnvironment();
    const rt = pmrem.fromScene(envScene, 0.08);
    scene.environment = rt.texture;
    scene.environmentIntensity = 0.9;

    return () => {
      scene.environment = null;
      rt.dispose();
      pmrem.dispose();
      envScene.clear();
    };
  }, [gl, scene]);

  return null;
}

function makeRadialTexture(
  size: number,
  stops: [number, string][]
): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  for (const [t, color] of stops) g.addColorStop(t, color);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 2;
  return tex;
}

function SoftContactShadow() {
  const tex = useMemo(
    () =>
      makeRadialTexture(128, [
        [0, "rgba(0,0,0,0.7)"],
        [0.4, "rgba(0,0,0,0.28)"],
        [0.75, "rgba(0,0,0,0.06)"],
        [1, "rgba(0,0,0,0)"],
      ]),
    []
  );

  if (!tex) return null;

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2.528, 0]}
      renderOrder={-1}
    >
      <planeGeometry args={[5.5, 5.5]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Outro stage: no pedestal disc. rings float on the space background.
 * Soft ease-in so the land transition feels continuous with the scroll.
 */
function OutroGround({
  snapshotRef,
}: {
  snapshotRef: React.MutableRefObject<JourneySnapshot>;
}) {
  const group = useRef<THREE.Group>(null);

  const glowTex = useMemo(
    () =>
      makeRadialTexture(128, [
        [0, "rgba(239,26,18,0)"],
        [0.5, "rgba(239,26,18,0.02)"],
        [0.72, "rgba(239,26,18,0.22)"],
        [0.88, "rgba(255,50,40,0.12)"],
        [1, "rgba(239,26,18,0)"],
      ]),
    []
  );

  const mats = useMemo(() => {
    const mk = (
      color: string,
      opts: Partial<THREE.MeshBasicMaterialParameters> = {}
    ) =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
        ...opts,
      });

    return {
      wash: new THREE.MeshBasicMaterial({
        map: glowTex ?? undefined,
        color: "#ffffff",
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
      rimCore: mk("#ef1a12"),
      rimInner: mk("#ff5a45"),
      rimOuter: mk("#ef1a12"),
      rimBloom: mk("#ff2a1a", { blending: THREE.AdditiveBlending }),
      torus: mk("#ef1a12"),
    };
  }, [glowTex]);

  useFrame(() => {
    const outro = snapshotRef.current.outro;
    // Smoothstep so rings ease in with the phone land. no pop
    const show = outro * outro * (3 - 2 * outro);

    mats.wash.opacity = show * 0.55;
    mats.rimCore.opacity = show * 0.92;
    mats.rimInner.opacity = show * 0.4;
    mats.rimOuter.opacity = show * 0.5;
    mats.rimBloom.opacity = show * 0.22;
    mats.torus.opacity = show * 0.85;

    if (group.current) group.current.visible = show > 0.015;
  });

  const y = -2.55;

  return (
    <group ref={group} visible={false}>
      {/* Soft red wash only. no grey disc, blends into space bg */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, y + 0.01, 0]}
        material={mats.wash}
      >
        <circleGeometry args={[3.8, 64]} />
      </mesh>

      <SoftContactShadow />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, y + 0.024, 0]}
        material={mats.rimInner}
      >
        <ringGeometry args={[2.48, 2.54, 96]} />
      </mesh>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, y + 0.026, 0]}
        material={mats.rimBloom}
      >
        <ringGeometry args={[2.58, 3.28, 96]} />
      </mesh>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, y + 0.028, 0]}
        material={mats.rimOuter}
      >
        <ringGeometry args={[3.08, 3.2, 96]} />
      </mesh>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, y + 0.032, 0]}
        material={mats.rimCore}
      >
        <ringGeometry args={[2.74, 2.9, 96]} />
      </mesh>

      {/* Thin raised rim. slight 3D without a platform slab */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, y + 0.048, 0]}
        material={mats.torus}
      >
        <torusGeometry args={[2.82, 0.018, 8, 96]} />
      </mesh>
    </group>
  );
}

function ScrollRig({
  snapshotRef,
}: {
  snapshotRef: React.MutableRefObject<JourneySnapshot>;
}) {
  const phone = useRef<THREE.Group>(null);
  const topFill = useRef<THREE.DirectionalLight>(null);
  const ringGlow = useRef<THREE.PointLight>(null);
  const { camera, gl } = useThree();
  const look = useRef(new THREE.Vector3(0.1, 0.15, 0));

  const sx = useRef(0.1);
  const sy = useRef(0.22);
  const sz = useRef(0.05);
  const ry = useRef(Math.PI + 0.06);
  const rx = useRef(0.04);
  const rz = useRef(-0.1);
  const sc = useRef(18);
  const camZ = useRef(11);

  useEffect(() => {
    gl.setClearColor(0x000000, 0);
  }, [gl]);

  useFrame((_, dt) => {
    const snap = snapshotRef.current;
    const pose = snap.pose;
    const inOutro = snap.progress >= OUTRO_START;
    const a = 1 - Math.exp(-dt * 12);

    sx.current = lerp(sx.current, pose.x, a);
    sy.current = lerp(sy.current, pose.y, a);
    sz.current = lerp(sz.current, pose.z, a);
    ry.current = lerp(ry.current, pose.yaw, a);
    rx.current = lerp(rx.current, pose.pitch, a);
    rz.current = lerp(rz.current, pose.roll, a);
    sc.current = lerp(sc.current, pose.scale, a);
    camZ.current = lerp(camZ.current, pose.camZ, a);

    if (phone.current) {
      phone.current.scale.setScalar(sc.current);
      phone.current.position.set(sx.current, sy.current, sz.current);
      phone.current.rotation.set(rx.current, ry.current, rz.current);
    }

    const o = snap.outro;
    const oEase = o * o * (3 - 2 * o);
    if (topFill.current) {
      topFill.current.intensity = lerp(0.3, 1.65, oEase);
      topFill.current.position.set(sx.current + 0.35, 7, sz.current + 0.5);
      topFill.current.target.position.set(sx.current, sy.current, sz.current);
      topFill.current.target.updateMatrixWorld();
    }
    if (ringGlow.current) {
      // Soft under-glow only. no hard hot-spot orb
      ringGlow.current.intensity = lerp(0, 0.85, oEase);
      ringGlow.current.position.set(sx.current, -2.2, sz.current);
    }

    camera.position.x = lerp(camera.position.x, -sx.current * 0.1, a);
    camera.position.y = lerp(
      camera.position.y,
      // Pull framing up so rings sit mid-frame with space above the marquee
      inOutro ? lerp(0.32, 1.85, snap.outro) : 0.28,
      a
    );
    camera.position.z = camZ.current;
    look.current.set(
      sx.current * 0.25,
      inOutro ? lerp(0.16, -0.15, snap.outro) : 0.16,
      0
    );
    camera.lookAt(look.current);
  });

  return (
    <>
      <directionalLight
        ref={topFill}
        intensity={0.35}
        color="#ffffff"
        position={[0.35, 7, 0.5]}
      >
        <object3D attach="target" position={[0, 0, 0]} />
      </directionalLight>
      <pointLight
        ref={ringGlow}
        intensity={0}
        color="#ff5a45"
        distance={12}
        decay={2}
      />
      <OutroGround snapshotRef={snapshotRef} />
      <group ref={phone}>
        <IPhoneModel snapshotRef={snapshotRef} />
      </group>
    </>
  );
}

export function PhoneJourneyCanvas({
  snapshotRef,
  active = true,
}: {
  snapshotRef: React.MutableRefObject<JourneySnapshot>;
  active?: boolean;
}) {
  useEffect(() => {
    preloadPhoneModel();
  }, []);

  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0.28, 11], fov: 30, near: 0.1, far: 60 }}
        dpr={[1, 1.25]}
        frameloop={active ? "always" : "never"}
        performance={{ min: 0.45, max: 1, debounce: 200 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.02;
          gl.domElement.style.pointerEvents = "none";
        }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={[SPACE, 16, 40]} />
          <SoftEnvironment />
          <ambientLight intensity={0.28} />
          <hemisphereLight args={["#8a8a98", "#050508", 0.26]} />
          <directionalLight
            position={[5, 8, 4]}
            intensity={1.75}
            color="#ffffff"
          />
          <directionalLight
            position={[-4, 3, -3]}
            intensity={0.9}
            color="#ffc2b8"
          />
          <pointLight
            position={[-1.2, 1.4, 2.2]}
            intensity={0.5}
            color="#ef1a12"
          />

          <ScrollRig snapshotRef={snapshotRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
