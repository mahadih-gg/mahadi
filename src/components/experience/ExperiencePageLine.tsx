"use client";

import ExperiencePath from "@/components/experience/ExperiencePath";
import Glow from "@/components/experience/Glow";
import {
  createExperienceAnimation,
  renderStaticExperiencePath,
} from "@/components/experience/experienceAnimation";
import { usePreloader } from "@/context/preloader-context";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Full-page SVG line overlay: the path draws from the top of the Projects
 * gallery down through the Experience timeline as the page scrolls. Sits
 * above section content (z-40) so it reads over the gallery's opaque
 * backdrop as well as the Experience cards.
 */
export default function ExperiencePageLine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { isComplete: isPreloaderComplete } = usePreloader();

  useLayoutEffect(() => {
    const container = containerRef.current;
    const path = pathRef.current;
    const glow = glowRef.current;
    const sectionEl = document.getElementById("experience");
    const heroEl = document.querySelector<HTMLElement>('[aria-label="Hero"]');
    const track = document.querySelector<HTMLElement>("[data-exp-track]");
    if (!container || !path || !sectionEl || !track) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    return reducedMotion
      ? renderStaticExperiencePath({ container, heroEl, track, path })
      : createExperienceAnimation({
        container,
        heroEl,
        sectionEl,
        track,
        path,
        glow,
      });
  }, []);

  useEffect(() => {
    if (!isPreloaderComplete) return;
    ScrollTrigger.refresh();
  }, [isPreloaderComplete]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-40"
      aria-hidden
    >
      <ExperiencePath pathRef={pathRef} />
      <Glow glowRef={glowRef} />
    </div>
  );
}
