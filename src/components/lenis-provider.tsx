"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";
import { type ReactNode, useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Drives smooth scrolling for the whole site via Lenis, wired into GSAP's
 * ticker so every scroll-driven animation (ScrollTrigger pins, the
 * Experience SVG line, etc.) stays perfectly in sync with the smoothed
 * scroll position instead of racing against it on a separate rAF loop.
 */
export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  // ScrollTrigger normally recalculates off the native 'scroll' event; tying
  // it directly to Lenis's own scroll tick keeps pinned sections and
  // scrubbed tweens from lagging a frame behind the smoothed scroll.
  useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    // Lenis already smooths the scroll itself, so GSAP's own lag-smoothing
    // would only fight it — disabling it avoids a jarring "catch-up" jump
    // after any stall (tab switch, heavy paint, etc).
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false }}>
      {children}
    </ReactLenis>
  );
}
