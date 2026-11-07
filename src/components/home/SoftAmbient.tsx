"use client";

import { motion } from "framer-motion";

function Sphere({
  className,
  color,
  delay = 0,
  duration = 16,
}: {
  className?: string;
  color: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      aria-hidden
      className={`absolute rounded-full ${className}`}
      style={{
        background: `
          radial-gradient(circle at 32% 28%, rgba(255,255,255,0.85), transparent 42%),
          radial-gradient(circle at 70% 75%, rgba(0,0,0,0.18), transparent 55%),
          ${color}
        `,
        boxShadow: `
          inset 0 -12px 28px rgba(0,0,0,0.18),
          inset 0 10px 20px rgba(255,255,255,0.35),
          0 24px 48px rgba(0,0,0,0.08)
        `,
      }}
      animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/** Soft Apple-like ambient. glossy spheres + blur orbs, no badge spam */
export function SoftAmbient() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute -left-[12%] top-[-8%] h-[52vmin] w-[52vmin] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(10,132,255,0.2), transparent 68%)",
          filter: "blur(40px)",
        }}
        animate={{ x: [0, 40, 0], y: [0, 28, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[10%] top-[18%] h-[44vmin] w-[44vmin] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(48,209,88,0.16), transparent 68%)",
          filter: "blur(36px)",
        }}
        animate={{ x: [0, -30, 0], y: [0, 36, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-6%] left-[28%] h-[38vmin] w-[38vmin] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,159,10,0.14), transparent 68%)",
          filter: "blur(32px)",
        }}
        animate={{ x: [0, 24, 0], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glossy 3D-like spheres */}
      <Sphere
        className="left-[8%] top-[22%] h-16 w-16 opacity-80 md:h-20 md:w-20"
        color="#0a84ff"
        delay={0.2}
        duration={14}
      />
      <Sphere
        className="right-[10%] top-[28%] h-12 w-12 opacity-70 md:h-14 md:w-14"
        color="#30d158"
        delay={1.1}
        duration={17}
      />
      <Sphere
        className="left-[18%] top-[58%] h-10 w-10 opacity-60"
        color="#ff9f0a"
        delay={0.6}
        duration={15}
      />
      <Sphere
        className="right-[16%] top-[62%] h-14 w-14 opacity-55 md:h-16 md:w-16"
        color="#bf5af2"
        delay={1.8}
        duration={19}
      />
      <Sphere
        className="left-[42%] top-[12%] h-8 w-8 opacity-50"
        color="#64d2ff"
        delay={0.9}
        duration={13}
      />

      <div
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.035) 0.7px, transparent 0.7px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
        }}
      />
    </div>
  );
}
