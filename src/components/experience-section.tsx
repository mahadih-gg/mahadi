"use client";

import { useEffect, useRef } from "react";
import { useInteractiveCursor } from "@/context/interactive-cursor-context";
import { Engine } from "@/lib/depth-gallery/Experience/Engine";
import { Experience } from "@/lib/depth-gallery/Experience/index";
import { experienceRoles } from "@/lib/depth-gallery/data/galleryData";

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setExperienceInView } = useInteractiveCursor();

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const experience = new Experience(section);
    const engine = new Engine(canvas, experience, section);
    let disposed = false;

    engine.init().catch((error) => {
      console.error("Depth gallery failed to initialize", error);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isActive = Boolean(entry?.isIntersecting);
        setExperienceInView(isActive);
        engine.setScrollActive(isActive);
      },
      { threshold: 0.15 },
    );
    observer.observe(section);

    return () => {
      if (disposed) return;
      disposed = true;
      observer.disconnect();
      setExperienceInView(false);
      engine.dispose();
    };
  }, [setExperienceInView]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="depth-gallery"
      aria-label="Work experience"
    >
      <canvas ref={canvasRef} className="webgl" aria-hidden />

      <header className="frame">
        <h2 className="frame__title">Experience</h2>
        <p className="frame__credit">
          Scroll to move through roles · mood-driven backgrounds · velocity
          motion
        </p>
      </header>

      <div className="depth-gallery__sr-only">
        <ul>
          {experienceRoles.map((role) => (
            <li key={role.company}>
              <h3>
                {role.title} at {role.company}
              </h3>
              <p>{role.period}</p>
              <ul>
                {role.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
