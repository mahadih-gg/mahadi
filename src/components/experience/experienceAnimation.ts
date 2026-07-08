import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type ExperienceAnimationElements = {
  /** Full-page overlay that holds the SVG */
  container: HTMLElement;
  /** Hero `<section>` — its bottom edge marks the top of the Projects
   * gallery (and where the line's draw animation starts), so it's used
   * instead of the gallery section itself, which gets pinned (`position:
   * fixed`) while active — its own live rect can't be trusted as a stable
   * document-position reference once scrolled into or past its pin range. */
  heroEl: HTMLElement | null;
  /** Experience `<section>` — scroll range for the path draw, independent of whatever precedes it on the page */
  sectionEl: HTMLElement;
  /** Timeline track — node anchors for path routing */
  track: HTMLElement;
  path: SVGPathElement;
  /** Orb that travels along the drawn portion of the path */
  glow: HTMLElement | null;
};

type Point = { x: number; y: number };

type PathBuildResult = {
  /** Total length of the drawn curve */
  length: number;
  /** Cumulative length at each real company node, in anchor order */
  nodeLengths: number[];
};

/** Center of every `[data-exp-node]`, measured relative to the page line container. */
function measureNodeAnchors(containerRect: DOMRect): Point[] {
  const nodes = document.querySelectorAll<HTMLElement>("[data-exp-node]");

  return Array.from(nodes, (node) => {
    const rect = node.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top,
    };
  });
}

/**
 * Where the line enters the page from above — it should begin exactly at the
 * bottom edge of the Hero section (the Hero/About boundary), on the
 * top-right. The horizontal entry point comes from the `[data-line-start]`
 * marker near the top-right of the About section; the vertical start comes
 * from Hero's real bottom edge so the curve springs out right where Hero
 * ends. That distance and offset from the first timeline node is what gives
 * the lead-in its big S-sweep through About before it straightens into the
 * timeline. Falls back to the marker's own Y (then a fixed lead-in above the
 * first node) if Hero isn't found.
 */
function measureLeadIn(
  containerRect: DOMRect,
  heroEl: HTMLElement | null,
  firstAnchor: Point,
): Point {
  const marker = document.querySelector<HTMLElement>("[data-line-start]");
  const markerRect = marker?.getBoundingClientRect();
  const x = markerRect
    ? markerRect.left + markerRect.width / 2 - containerRect.left
    : firstAnchor.x;

  if (heroEl) {
    const rect = heroEl.getBoundingClientRect();
    return { x, y: rect.bottom - containerRect.top };
  }
  if (markerRect) {
    return { x, y: markerRect.top + markerRect.height / 2 - containerRect.top };
  }
  return { x: firstAnchor.x, y: Math.max(0, firstAnchor.y - 600) };
}

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * Builds the path progressively, writing each intermediate `d` onto the
 * live `path` element so `getTotalLength()` can be used to record the
 * cumulative length at every node — needed to know exactly when the
 * traveling glow "crosses" a company on scroll.
 */
function measureSegments(
  path: SVGPathElement,
  d: string,
  segmentEnds: string[],
): PathBuildResult {
  const nodeLengths = segmentEnds.map((partial) => {
    path.setAttribute("d", partial);
    return path.getTotalLength();
  });

  path.setAttribute("d", d);
  return {
    length: nodeLengths[nodeLengths.length - 1] ?? 0,
    nodeLengths,
  };
}

/**
 * Wide S-sweep for desktop, where the nodes alternate between the left and
 * right edges of the track. Every control point sits directly above/below
 * its endpoint, so the path passes through each node with a vertical
 * tangent — the curve wraps around the node at the apex of each bend and
 * sweeps across the full section width between items. The lead-in segment
 * (above the first node) shares the same tangent style, so it's a plumb
 * vertical thread rather than a wide swing.
 */
function drawSweepPath(
  path: SVGPathElement,
  anchors: Point[],
  leadIn: Point,
): PathBuildResult {
  const points = [leadIn, ...anchors];
  let d = `M ${round(points[0].x)} ${round(points[0].y)}`;
  const segmentEnds: string[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    const reach = (to.y - from.y) * 0.5;

    d +=
      ` C ${round(from.x)} ${round(from.y + reach)},` +
      ` ${round(to.x)} ${round(to.y - reach)},` +
      ` ${round(to.x)} ${round(to.y)}`;
    segmentEnds.push(d);
  }

  return measureSegments(path, d, segmentEnds);
}

/**
 * Mobile fallback: all nodes share the left rail, so the segments bow
 * gently to alternating sides instead of sweeping across the screen.
 */
function drawBowPath(
  path: SVGPathElement,
  anchors: Point[],
  leadIn: Point,
): PathBuildResult {
  const amplitude = Math.max(12, Math.min(26, anchors[0].x - 8));
  const points = [leadIn, ...anchors];
  let d = `M ${round(points[0].x)} ${round(points[0].y)}`;
  const segmentEnds: string[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    const bow = amplitude * (i % 2 === 0 ? 1 : -1);
    const dy = to.y - from.y;

    d +=
      ` C ${round(from.x + bow)} ${round(from.y + dy / 3)},` +
      ` ${round(to.x + bow)} ${round(from.y + (2 * dy) / 3)},` +
      ` ${round(to.x)} ${round(to.y)}`;
    segmentEnds.push(d);
  }

  return measureSegments(path, d, segmentEnds);
}

/** Draws one continuous path of cubic bezier segments through the anchors. */
function drawPath(
  path: SVGPathElement,
  anchors: Point[],
  leadIn: Point,
  trackWidth: number,
): PathBuildResult {
  return trackWidth < 640
    ? drawBowPath(path, anchors, leadIn)
    : drawSweepPath(path, anchors, leadIn);
}

function applyPathDash(path: SVGPathElement, length: number, offset: number) {
  path.style.strokeDasharray = String(length);
  path.style.strokeDashoffset = String(offset);
}

/**
 * Top edge of the first timeline card (the first `<li>` in the track) —
 * where the glow orb should first become visible, rather than as soon as
 * the Experience section (heading included) starts. Falls back to the
 * track itself if no card is found.
 */
function measureFirstCardTop(containerRect: DOMRect, track: HTMLElement): number {
  const firstCard = track.querySelector<HTMLElement>("li");
  const rect = (firstCard ?? track).getBoundingClientRect();
  return rect.top - containerRect.top;
}

/**
 * Length along the path at which it crosses a given y (binary search, since
 * `getPointAtLength` has no inverse). Assumes y is non-decreasing along the
 * path, which holds for this line — it only ever travels downward. Used to
 * find where the lead-in curve crosses from the About section into the
 * Experience section, so the glow orb can stay hidden until then.
 */
function findLengthAtY(
  path: SVGPathElement,
  targetY: number,
  totalLength: number,
): number {
  if (totalLength <= 0) return 0;
  let lo = 0;
  let hi = totalLength;
  for (let i = 0; i < 25; i++) {
    const mid = (lo + hi) / 2;
    if (path.getPointAtLength(mid).y < targetY) lo = mid;
    else hi = mid;
  }
  return lo;
}

/**
 * Reduced-motion fallback: draw the static, fully-visible path (no glow,
 * no scroll-driven reveal). Returns a cleanup function.
 */
export function renderStaticExperiencePath({
  container,
  heroEl,
  track,
  path,
}: Pick<
  ExperienceAnimationElements,
  "container" | "heroEl" | "track" | "path"
>): () => void {
  const draw = () => {
    const containerRect = container.getBoundingClientRect();
    const anchors = measureNodeAnchors(containerRect);
    if (!anchors.length) return;
    const leadIn = measureLeadIn(containerRect, heroEl, anchors[0]);
    drawPath(path, anchors, leadIn, track.clientWidth);
    path.style.strokeDasharray = "none";
    path.style.strokeDashoffset = "0";
  };

  draw();

  const observer = new ResizeObserver(draw);
  observer.observe(container);

  return () => observer.disconnect();
}

/**
 * Scroll experience: the line starts drawing as soon as the Projects
 * gallery begins its (pinned) scroll and keeps drawing through the
 * Experience timeline, with a glow orb traveling at the tip of the drawn
 * portion and pulsing every time it crosses a company node. Returns a
 * cleanup function.
 */
export function createExperienceAnimation({
  container,
  heroEl,
  sectionEl,
  track,
  path,
  glow,
}: ExperienceAnimationElements): () => void {
  let pathLength = 0;
  let nodeLengths: number[] = [];
  /** Length at which the path crosses into the Experience section — the
   * glow orb stays hidden before this point, so it doesn't show while the
   * line is still sweeping through About. */
  let glowRevealLength = 0;
  /** Whether the glow is currently faded in — tracked so the opacity tween
   * only fires on the enter/exit transition, not every scroll tick. */
  let glowVisible = false;
  let lastCrossedIndex = -1;
  let rafId = 0;

  const buildPath = () => {
    const containerRect = container.getBoundingClientRect();
    const anchors = measureNodeAnchors(containerRect);
    if (!anchors.length) return false;

    const leadIn = measureLeadIn(containerRect, heroEl, anchors[0]);
    const result = drawPath(path, anchors, leadIn, track.clientWidth);
    pathLength = result.length;
    nodeLengths = result.nodeLengths;
    lastCrossedIndex = -1;

    const firstCardTopY = measureFirstCardTop(containerRect, track);
    glowRevealLength = findLengthAtY(path, firstCardTopY, pathLength);

    applyPathDash(path, pathLength, pathLength);
    return true;
  };

  const pulseGlow = () => {
    if (!glow) return;
    const layers = glow.querySelectorAll<HTMLElement>("[data-exp-glow-layer]");
    if (!layers.length) return;
    gsap.fromTo(
      layers,
      { scale: 1 },
      {
        scale: 1.7,
        duration: 0.22,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        overwrite: true,
      },
    );
  };

  const applyProgress = (progress: number) => {
    if (!pathLength) return;
    const currentLength = pathLength * progress;
    path.style.strokeDashoffset = String(
      Math.max(0, pathLength - currentLength),
    );

    if (!glow) return;

    // Position tracks the drawn tip unconditionally — even while hidden or
    // mid-fade — so the orb never freezes mid-air and "detaches" from the
    // retracting line when scrolling back up. Only opacity is gated.
    const point = path.getPointAtLength(
      Math.max(0, Math.min(currentLength, pathLength)),
    );
    gsap.set(glow, {
      x: point.x,
      y: point.y,
      xPercent: -50,
      yPercent: -50,
    });

    const revealed = currentLength > Math.max(0.5, glowRevealLength);
    if (revealed !== glowVisible) {
      glowVisible = revealed;
      gsap.to(glow, {
        opacity: revealed ? 1 : 0,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
      });
    }

    if (!revealed) {
      lastCrossedIndex = -1;
      return;
    }

    const crossedIndex = nodeLengths.reduce(
      (count, nodeLength) => (currentLength >= nodeLength ? count + 1 : count),
      -1,
    );
    if (crossedIndex !== lastCrossedIndex) {
      lastCrossedIndex = crossedIndex;
      if (crossedIndex >= 0) pulseGlow();
    }
  };

  // The draw range spans from the top of the Projects gallery down to the
  // bottom of the Experience track — crossing the gallery's pinned scroll
  // distance. Two things make GSAP's usual `trigger`/`endTrigger` string
  // math unsuitable here: its cross-pin distance calculation falls short
  // of the real gap, and the Projects section itself is `position: fixed`
  // while pinned, so its own live rect isn't a stable document-position
  // reference once scrolled into (or past) its pin range. Using Hero's
  // bottom edge (never pinned/transformed) for the start boundary, and the
  // Experience track's bottom for the end, keeps this reliable at any
  // scroll position via plain `getBoundingClientRect()` + `scrollY`.
  const docBottom = (el: HTMLElement) =>
    el.getBoundingClientRect().bottom + window.scrollY;

  const update = () => {
    rafId = 0;
    const start = docBottom(heroEl ?? sectionEl);
    const end = Math.max(start + 1, docBottom(track) - window.innerHeight);
    const progress = Math.min(
      1,
      Math.max(0, (window.scrollY - start) / (end - start)),
    );
    applyProgress(progress);
  };

  const requestUpdate = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(update);
  };

  const onRefresh = () => {
    buildPath();
    update();
  };

  if (!buildPath()) return () => { };
  if (glow) gsap.set(glow, { opacity: 0 });
  update();

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  ScrollTrigger.addEventListener("refresh", onRefresh);

  const observer = new ResizeObserver(() => ScrollTrigger.refresh());
  observer.observe(container);

  return () => {
    if (rafId) window.cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", requestUpdate);
    ScrollTrigger.removeEventListener("refresh", onRefresh);
    observer.disconnect();
    if (glow) gsap.killTweensOf(glow.querySelectorAll("[data-exp-glow-layer]"));
  };
}
