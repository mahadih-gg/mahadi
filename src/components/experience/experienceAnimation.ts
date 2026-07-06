import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type ExperienceAnimationElements = {
  /** Full-page overlay that holds the SVG */
  container: HTMLElement;
  /** `<main>` — scroll range for the path draw */
  main: HTMLElement;
  /** Timeline track — node anchors for path routing */
  track: HTMLElement;
  path: SVGPathElement;
};

type Point = { x: number; y: number };

/** Center of every `[data-exp-node]`, measured relative to the page line container. */
function measureNodeAnchors(container: HTMLElement): Point[] {
  const containerRect = container.getBoundingClientRect();
  const nodes = document.querySelectorAll<HTMLElement>("[data-exp-node]");

  return Array.from(nodes, (node) => {
    const rect = node.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top,
    };
  });
}

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * Wide S-sweep for desktop, where the nodes alternate between the left and
 * right edges of the track. Every control point sits directly above/below
 * its endpoint, so the path passes through each node with a vertical
 * tangent — the curve wraps around the node at the apex of each bend and
 * sweeps across the full section width between items.
 */
function buildSweepPathD(anchors: Point[], trackWidth: number): string {
  const start: Point = {
    x: anchors[1]?.x ?? trackWidth * 0.85,
    y: 0,
  };
  const points = [start, ...anchors];

  let d = `M ${round(start.x)} ${round(start.y)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    const reach = (to.y - from.y) * 0.5;

    d +=
      ` C ${round(from.x)} ${round(from.y + reach)},` +
      ` ${round(to.x)} ${round(to.y - reach)},` +
      ` ${round(to.x)} ${round(to.y)}`;
  }

  return d;
}

/**
 * Mobile fallback: all nodes share the left rail, so the segments bow
 * gently to alternating sides instead of sweeping across the screen.
 */
function buildBowPathD(anchors: Point[]): string {
  const amplitude = Math.max(12, Math.min(26, anchors[0].x - 8));
  const start: Point = {
    x: anchors[0].x,
    y: 0,
  };
  const points = [start, ...anchors];

  let d = `M ${round(start.x)} ${round(start.y)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    const bow = amplitude * (i % 2 === 0 ? 1 : -1);
    const dy = to.y - from.y;

    d +=
      ` C ${round(from.x + bow)} ${round(from.y + dy / 3)},` +
      ` ${round(to.x + bow)} ${round(from.y + (2 * dy) / 3)},` +
      ` ${round(to.x)} ${round(to.y)}`;
  }

  return d;
}

/** Builds one continuous path of cubic bezier segments through the anchors. */
function buildPathD(anchors: Point[], trackWidth: number): string {
  return trackWidth < 640
    ? buildBowPathD(anchors)
    : buildSweepPathD(anchors, trackWidth);
}

function applyPathDash(path: SVGPathElement, length: number, offset: number) {
  path.style.strokeDasharray = String(length);
  path.style.strokeDashoffset = String(offset);
}

/**
 * Reduced-motion fallback: draw the static path. Returns a cleanup function.
 */
export function renderStaticExperiencePath({
  container,
  track,
  path,
}: Pick<
  ExperienceAnimationElements,
  "container" | "track" | "path"
>): () => void {
  const draw = () => {
    const anchors = measureNodeAnchors(container);
    if (anchors.length) {
      path.setAttribute("d", buildPathD(anchors, track.clientWidth));
      path.style.strokeDasharray = "none";
      path.style.strokeDashoffset = "0";
    }
  };

  draw();

  const observer = new ResizeObserver(draw);
  observer.observe(container);

  return () => observer.disconnect();
}

/**
 * Scroll experience: path draws from page top on scroll. Company details stay
 * static with no reveal or glow. Returns a cleanup function.
 */
export function createExperienceAnimation({
  container,
  main,
  track,
  path,
}: ExperienceAnimationElements): () => void {
  let resizeTimer: number | undefined;
  let observer: ResizeObserver | null = null;

  const ctx = gsap.context(() => {
    let pathLength = 0;

    const buildPath = () => {
      const anchors = measureNodeAnchors(container);
      if (!anchors.length) return false;
      path.setAttribute("d", buildPathD(anchors, track.clientWidth));
      pathLength = path.getTotalLength();
      applyPathDash(path, pathLength, pathLength);
      return true;
    };

    if (!buildPath()) return;

    const drawTimeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: main,
        start: "top top",
        endTrigger: track,
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    drawTimeline.fromTo(
      path,
      { strokeDashoffset: pathLength },
      { strokeDashoffset: 0, duration: 1 },
      0,
    );

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!buildPath()) return;
        drawTimeline.invalidate();
        ScrollTrigger.refresh();
      }, 150);
    };

    observer = new ResizeObserver(onResize);
    observer.observe(container);
  }, main);

  return () => {
    observer?.disconnect();
    window.clearTimeout(resizeTimer);
    ctx.revert();
  };
}
