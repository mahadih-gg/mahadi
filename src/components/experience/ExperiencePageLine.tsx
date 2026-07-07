"use client";

import ExperiencePath from "@/components/experience/ExperiencePath";
import {
  createExperienceAnimation,
  renderStaticExperiencePath,
} from "@/components/experience/experienceAnimation";
import { usePreloader } from "@/context/preloader-context";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Full-page SVG line overlay: path draws from the document top on scroll.
 * Sits at z-0 on `<main>` so the hero fog (z-1) renders on top.
 */
export default function ExperiencePageLine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { isComplete: isPreloaderComplete } = usePreloader();

  useLayoutEffect(() => {
    const container = containerRef.current;
    const path = pathRef.current;
    // Scoped to the Experience section itself (not the outer <main>) so the
    // draw animation's scroll range is unaffected by whatever else is on
    // the page before it (e.g. the pinned Projects Gallery).
    const sectionEl = document.getElementById("experience");
    const track = document.querySelector<HTMLElement>("[data-exp-track]");
    if (!container || !path || !sectionEl || !track) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    return reducedMotion
      ? renderStaticExperiencePath({ container, track, path })
      : createExperienceAnimation({ container, sectionEl, track, path });
  }, []);

  useEffect(() => {
    if (!isPreloaderComplete) return;
    ScrollTrigger.refresh();
  }, [isPreloaderComplete]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden
    >
      <ExperiencePath pathRef={pathRef} />
    </div>
  );
}
