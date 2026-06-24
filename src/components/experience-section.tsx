"use client";

import { useInteractiveCursor } from "@/context/interactive-cursor-context";
import { Engine } from "@/lib/depth-gallery/Experience/Engine";
import { Experience } from "@/lib/depth-gallery/Experience/index";
import { experienceRoles } from "@/lib/depth-gallery/data/galleryData";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

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
    let gsapContext: gsap.Context | null = null;

    const setPinnedActive = (isActive: boolean) => {
      setExperienceInView(isActive);
      engine.setScrollActive(isActive);
      section.classList.toggle("depth-gallery--active", isActive);
    };

    const setResting = (isResting: boolean) => {
      section.classList.toggle("depth-gallery--resting", isResting);

      if (isResting) {
        engine.setScrollProgress(1);
      }
    };

    const onResize = () => {
      engine.resize();
      ScrollTrigger.refresh();
    };

    const setup = async () => {
      try {
        await engine.init();
        if (disposed) return;

        engine.setScrollDriveMode("scroll");
        engine.primeAtStart();
        section.style.backgroundColor = "transparent";
        section.classList.add("depth-gallery--primed");

        const scrollDistance = engine.getScrollTrackDistancePx();

        gsapContext = gsap.context(() => {
          ScrollTrigger.create({
            id: "experience-pin",
            trigger: section,
            start: "top top",
            end: `+=${scrollDistance}`,
            pin: true,
            pinSpacing: true,
            scrub: true,
            onEnter: (self) => {
              setResting(false);
              engine.setScrollProgress(self.progress);
              setPinnedActive(true);
            },
            onEnterBack: (self) => {
              setResting(false);
              engine.setScrollProgress(self.progress);
              setPinnedActive(true);
            },
            onUpdate: (self) => {
              engine.setScrollProgress(self.progress);
            },
            onLeave: () => {
              setPinnedActive(false);
              setResting(true);
            },
            onLeaveBack: () => {
              setPinnedActive(false);
              setResting(false);
            },
          });

          ScrollTrigger.refresh();

          const trigger = ScrollTrigger.getById("experience-pin");
          if (trigger?.isActive) {
            engine.setScrollProgress(trigger.progress);
            setPinnedActive(true);
          } else if (trigger && trigger.progress >= 1) {
            setResting(true);
          }
        }, section);

        window.addEventListener("resize", onResize);
      } catch (error) {
        console.error("Depth gallery failed to initialize", error);
      }
    };

    setup();

    return () => {
      if (disposed) return;
      disposed = true;
      window.removeEventListener("resize", onResize);
      gsapContext?.revert();
      section.classList.remove(
        "depth-gallery--active",
        "depth-gallery--resting",
        "depth-gallery--primed",
      );
      section.style.backgroundColor = "";
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
