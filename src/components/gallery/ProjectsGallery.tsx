"use client";

import { projects } from "@/data/projects.data";
import {
  getDetailPanelLayout,
  getFocusSide,
  getMobileHeadingTopInsetVh,
  isMobileViewport,
} from "@/lib/gallery/layout";
import { useGalleryParallax } from "@/lib/gallery/useGalleryParallax";
import { useGalleryScroll } from "@/lib/gallery/useGalleryScroll";
import { useLenis } from "lenis/react";
import { LayoutGroup } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import GalleryStage from "./GalleryStage";
import ProjectDetailPanel, { MobileProjectDetails } from "./ProjectDetailPanel";
import ProjectDetailsOverlay from "./ProjectDetailsOverlay";
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
  const headingRef = useRef<HTMLDivElement | null>(null);

  const viewport = useViewportSize();
  const reducedMotion = useReducedMotionPreference();
  const isReady = viewport.width > 0 && viewport.height > 0;
  const lenis = useLenis();
  const [pinnedIndex, setPinnedIndex] = useState<number | null>(null);

  const handleCloseDetails = useCallback(() => {
    setPinnedIndex(null);
  }, []);

  useEffect(() => {
    if (pinnedIndex === null) {
      lenis?.start();
      return;
    }

    lenis?.stop();

    return () => {
      lenis?.start();
    };
  }, [pinnedIndex, lenis]);

  const { activeIndex } = useGalleryScroll({
    sectionRef,
    stageRef,
    frameRefs,
    headingRef,
    projectCount: projects.length,
    viewport,
    enabled: !reducedMotion && isReady,
  });

  useGalleryParallax({
    frameRefs,
    activeIndex,
    enabled: !reducedMotion,
  });

  const handleOpenDetails = useCallback(() => {
    if (activeIndex >= 0) setPinnedIndex(activeIndex);
  }, [activeIndex]);

  const activeProject =
    activeIndex >= 0 && pinnedIndex === null ? projects[activeIndex] : null;
  const focusSide = useMemo(
    () => getFocusSide(activeIndex >= 0 ? activeIndex : 0),
    [activeIndex],
  );
  const detailLayout = useMemo(
    () =>
      activeIndex >= 0 && isReady
        ? getDetailPanelLayout(activeIndex, viewport.width, viewport.height)
        : null,
    [activeIndex, isReady, viewport.width, viewport.height],
  );

  const registerFrameRef = useMemo(
    () => (index: number) => (el: HTMLDivElement | null) => {
      frameRefs.current[index] = el;
    },
    [],
  );

  const headingTopInset = isReady && isMobileViewport(viewport.width)
    ? getMobileHeadingTopInsetVh()
    : 0;

  if (reducedMotion) {
    return <StaticGalleryFallback projects={projects} />;
  }

  return (
    <LayoutGroup id="projects-gallery">
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

        <div
          ref={headingRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center gap-2 md:inset-0 md:z-0 md:justify-center md:gap-3"
          style={
            headingTopInset > 0
              ? { paddingTop: `${headingTopInset}vh` }
              : undefined
          }
        >
          <span className="text-xs tracking-[0.3em] text-primary uppercase">
            Selected Work
          </span>
          <h2 className="font-secondary text-[clamp(2.25rem,11vw,6rem)] font-bold uppercase tracking-tight text-foreground md:text-[clamp(2.75rem,7vw,6rem)]">
            Projects
          </h2>
        </div>

        {isReady && (
          <GalleryStage
            projects={projects}
            viewport={viewport}
            stageRef={stageRef}
            registerFrameRef={registerFrameRef}
            pinnedIndex={pinnedIndex}
            reduceMotion={reducedMotion}
          />
        )}

        <ProjectDetailPanel
          project={activeProject}
          layout={detailLayout}
          onOpenDetails={handleOpenDetails}
        />
        <MobileProjectDetails
          project={activeProject}
          onOpenDetails={handleOpenDetails}
        />
      </section>

      <ProjectDetailsOverlay
        project={pinnedIndex !== null ? projects[pinnedIndex] : null}
        onClose={handleCloseDetails}
        reduceMotion={reducedMotion}
      />
    </LayoutGroup>
  );
}
