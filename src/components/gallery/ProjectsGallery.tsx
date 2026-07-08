"use client";

import { projects } from "@/data/projects.data";
import { getFocusSide } from "@/lib/gallery/layout";
import { useGalleryParallax } from "@/lib/gallery/useGalleryParallax";
import { useGalleryScroll } from "@/lib/gallery/useGalleryScroll";
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import GalleryStage from "./GalleryStage";
import ProjectDetailPanel, { MobileProjectDetails } from "./ProjectDetailPanel";
import SpotlightGlow from "./SpotlightGlow";
import StaticGalleryFallback from "./StaticGalleryFallback";

function useViewportSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    let frame = 0;

    const measure = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const onResize = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("resize", onResize);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return size;
}

function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(false);

  useLayoutEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * "Walking through a gallery" projects section. Projects sit at permanent,
 * organic positions; scrolling pins the section and glides a virtual
 * camera between them, one at a time, until every project has been seen.
 */
export default function ProjectsGallery() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);

  const viewport = useViewportSize();
  const reducedMotion = useReducedMotionPreference();
  const isReady = viewport.width > 0 && viewport.height > 0;

  const { activeIndex } = useGalleryScroll({
    sectionRef,
    stageRef,
    frameRefs,
    projectCount: projects.length,
    viewport,
    enabled: !reducedMotion && isReady,
  });

  useGalleryParallax({
    frameRefs,
    activeIndex,
    enabled: !reducedMotion,
  });

  const activeProject = activeIndex >= 0 ? projects[activeIndex] : null;
  const focusSide = useMemo(
    () => getFocusSide(activeIndex >= 0 ? activeIndex : 0),
    [activeIndex],
  );
  const detailSide = focusSide === "left" ? "right" : "left";

  const registerFrameRef = useMemo(
    () => (index: number) => (el: HTMLDivElement | null) => {
      frameRefs.current[index] = el;
    },
    [],
  );

  if (reducedMotion) {
    return <StaticGalleryFallback projects={projects} />;
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-label="Projects gallery"
      className="gallery-section relative h-screen w-full overflow-hidden isolate"
    >
      <div className="gallery-vignette" />
      <div className="gallery-grain" />

      <SpotlightGlow side="left" visible={activeIndex >= 0 && focusSide === "left"} />
      <SpotlightGlow side="right" visible={activeIndex >= 0 && focusSide === "right"} />

      {isReady && (
        <GalleryStage
          projects={projects}
          viewport={viewport}
          stageRef={stageRef}
          registerFrameRef={registerFrameRef}
        />
      )}

      <ProjectDetailPanel project={activeProject} side={detailSide} />
      <MobileProjectDetails project={activeProject} />

      <div className="pointer-events-none absolute inset-x-0 top-8 flex justify-center md:top-12">
        <span
          className="text-xs tracking-[0.3em] text-white/40 uppercase transition-opacity duration-500"
          style={{ opacity: activeIndex < 0 ? 1 : 0 }}
        >
          Scroll to enter the gallery
        </span>
      </div>
    </section>
  );
}
