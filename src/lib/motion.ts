/** Shared motion. Emil / Apple web tokens */

export const easeOut = [0.23, 1, 0.32, 1] as const;
export const easeInOut = [0.77, 0, 0.175, 1] as const;
export const easeDrawer = [0.32, 0.72, 0, 1] as const;

/** Critically damped. menus, tabs, UI chrome */
export const springUi = {
  type: "spring" as const,
  duration: 0.45,
  bounce: 0,
};

/** Soft settle. cards, screen morphs */
export const springSoft = {
  type: "spring" as const,
  duration: 0.55,
  bounce: 0.08,
};

/** Snappy press / tab highlight */
export const springSnap = {
  type: "spring" as const,
  duration: 0.35,
  bounce: 0.12,
};

export const enter = {
  duration: 0.45,
  ease: easeOut,
};

export const fadeUp = (reduce?: boolean | null) =>
  reduce
    ? { initial: false as const, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, transform: "translateY(12px) scale(0.98)" },
        animate: { opacity: 1, transform: "translateY(0px) scale(1)" },
      };
