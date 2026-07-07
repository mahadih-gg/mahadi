"use client";

import gsap from "gsap";
import { type RefObject, useEffect, useRef } from "react";

/** Maximum parallax travel for the active frame, in px. Kept subtle/premium. */
const MAX_OFFSET = 10;

type UseGalleryParallaxOptions = {
  frameRefs: RefObject<(HTMLDivElement | null)[]>;
  activeIndex: number;
  enabled: boolean;
};

/** Applies a very subtle pointer-follow parallax to the active frame only. */
export function useGalleryParallax({
  frameRefs,
  activeIndex,
  enabled,
}: UseGalleryParallaxOptions): void {
  const prevIndexRef = useRef(-1);

  useEffect(() => {
    const previousFrame = frameRefs.current?.[prevIndexRef.current];
    if (previousFrame && prevIndexRef.current !== activeIndex) {
      gsap.to(previousFrame, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
    }
    prevIndexRef.current = activeIndex;

    if (!enabled || activeIndex < 0) return;

    const frame = frameRefs.current?.[activeIndex];
    if (!frame) return;

    const moveX = gsap.quickTo(frame, "x", { duration: 0.6, ease: "power3.out" });
    const moveY = gsap.quickTo(frame, "y", { duration: 0.6, ease: "power3.out" });

    const handlePointerMove = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      moveX(nx * MAX_OFFSET);
      moveY(ny * MAX_OFFSET);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [enabled, activeIndex, frameRefs]);
}
