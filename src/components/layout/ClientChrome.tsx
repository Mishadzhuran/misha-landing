"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ComponentType } from "react";

export const PageLoader = dynamic(
  () => import("@/components/layout/PageLoader").then((m) => m.PageLoader),
  { ssr: false },
);

/** Only load cursor chunk on fine pointers — phones never download it */
export function CustomCursor() {
  const [Cursor, setCursor] = useState<null | ComponentType>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    let alive = true;
    import("@/components/layout/CustomCursor").then((m) => {
      if (alive) setCursor(() => m.CustomCursor);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!Cursor) return null;
  return <Cursor />;
}
