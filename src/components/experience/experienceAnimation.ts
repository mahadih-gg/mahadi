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
  /** Cumulative length at each About-highlight dot, in document order */
  waypointLengths: number[];
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
 * Where the line enters the page from above — it begins at the bottom edge
 * of the Hero section (Hero/About boundary), on the top-right. The
 * horizontal entry point comes from the `[data-line-start]` marker near the
 * top-right of About; the vertical start comes from Hero's bottom edge so
 * the curve springs out right where Hero ends and sweeps down through the
 * highlight dots before bowing toward Experience.
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

/**
 * Apex of the About → Experience connector — a wide outward bow that frames
 * the Experience heading before the path rejoins the first timeline node.
 */
function measureBulgeApex(
  containerRect: DOMRect,
  firstAnchor: Point,
  lastWaypoint: Point | null,
): Point | null {
  const experienceEl = document.getElementById("experience");
  const headerBlock = experienceEl?.firstElementChild as HTMLElement | null;
  const headerRect = headerBlock?.getBoundingClientRect();
  const railX = lastWaypoint?.x ?? firstAnchor.x;
  const y = headerRect
    ? headerRect.top + headerRect.height / 2 - containerRect.top
    : firstAnchor.y - 120;
  const minBow = Math.max(200, containerRect.width * 0.34);
  const x = Math.min(
    containerRect.width * 0.78,
    Math.max(railX + minBow, containerRect.width * 0.58),
  );

  return { x, y };
}

type DotGlowElements = {
  wrap: HTMLElement;
  layers: HTMLElement[];
  /** Expanding shuttle rings that pulse outward on touch. */
  shuttles: HTMLElement[];
  core: HTMLElement;
};

type WaypointMeasurement = {
  points: Point[];
  /** The dot elements themselves, in the same order as `points`. */
  dotEls: HTMLElement[];
  /** Bloom layers + wrap for each dot, same order as `points`. */
  dotGlow: DotGlowElements[];
};

function measureWaypoints(containerRect: DOMRect): WaypointMeasurement {
  const dots = document.querySelectorAll<HTMLElement>("[data-line-dot]");
  const dotEls = Array.from(dots);
  const points = dotEls.map((dot) => {
    const rect = dot.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top,
    };
  });
  const dotGlow = dotEls.map((dot) => {
    const wrap =
      dot.closest<HTMLElement>("[data-line-dot-wrap]") ?? dot.parentElement!;
    return {
      wrap,
      layers: Array.from(
        wrap.querySelectorAll<HTMLElement>("[data-line-dot-glow]"),
      ),
      shuttles: Array.from(
        wrap.querySelectorAll<HTMLElement>("[data-line-dot-shuttle]"),
      ),
      core: dot,
    };
  });
  return { points, dotEls, dotGlow };
}

/** Dot core size in px — idle vs active (absolute width/height, not scale). */
const DOT_SIZE_IDLE = 6;
const DOT_SIZE_ACTIVE = 11;

/** Resting opacities for the two bloom layers (outer → inner) — kept low
 * so the touch glow reads as a whisper, not a flare. */
const DOT_GLOW_LAYER_OPACITY = [0.07, 0.14] as const;

function setDotActive(core: HTMLElement, active: boolean) {
  if (active) core.setAttribute("data-active", "");
  else core.removeAttribute("data-active");
}

function isDotActive(core: HTMLElement) {
  return core.hasAttribute("data-active");
}

function setDotSize(core: HTMLElement, size: number) {
  gsap.set(core, {
    width: size,
    height: size,
    scale: 1,
    clearProps: "transform",
  });
}

function syncDotVisualInstant(glow: DotGlowElements, lit: boolean) {
  gsap.killTweensOf([glow.wrap, glow.core, ...glow.layers, ...glow.shuttles]);
  setDotActive(glow.core, lit);
  setDotSize(glow.core, lit ? DOT_SIZE_ACTIVE : DOT_SIZE_IDLE);
  if (lit) {
    gsap.set(glow.layers, {
      opacity: (i: number) => DOT_GLOW_LAYER_OPACITY[i] ?? 0.1,
      scale: 1,
    });
  } else {
    gsap.set(glow.layers, { opacity: 0, scale: 0.92 });
  }
  gsap.set(glow.shuttles, { scale: 1, opacity: 0 });
}

/** Shuttle rings and smooth absolute size grow on touch. */
function playDotGlowIn({ wrap, layers, shuttles, core }: DotGlowElements) {
  gsap.killTweensOf([wrap, core, ...layers, ...shuttles]);

  const alreadyActive = isDotActive(core);
  setDotActive(core, true);

  if (alreadyActive) {
    setDotSize(core, DOT_SIZE_ACTIVE);
    gsap.set(layers, {
      opacity: (i: number) => DOT_GLOW_LAYER_OPACITY[i] ?? 0.1,
      scale: 1,
    });
    return;
  }

  setDotSize(core, DOT_SIZE_IDLE);

  const tl = gsap.timeline({
    defaults: { overwrite: "auto" },
  });

  tl.to(core, {
    width: DOT_SIZE_ACTIVE,
    height: DOT_SIZE_ACTIVE,
    duration: 0.48,
    ease: "power2.inOut",
  });

  shuttles.forEach((shuttle, i) => {
    tl.fromTo(
      shuttle,
      { scale: 0.75, opacity: 0.5 },
      { scale: 3.2, opacity: 0, duration: 0.75, ease: "power2.out" },
      0.04 + i * 0.11,
    );
  });

  tl.fromTo(
    layers,
    { opacity: 0, scale: 0.92 },
    {
      opacity: (i: number) => DOT_GLOW_LAYER_OPACITY[i] ?? 0.1,
      scale: 1,
      duration: 0.48,
      stagger: 0.05,
      ease: "power2.out",
    },
    0.06,
  );
}

/** Soft settle when the line retreats past a highlight dot. */
function playDotGlowOut({ wrap, layers, shuttles, core }: DotGlowElements) {
  gsap.killTweensOf([wrap, core, ...layers, ...shuttles]);

  setDotActive(core, false);

  gsap.to(layers, {
    opacity: 0,
    scale: 0.92,
    duration: 0.32,
    stagger: { each: 0.04, from: "end" },
    ease: "power2.inOut",
    overwrite: "auto",
  });
  gsap.set(shuttles, { scale: 1, opacity: 0 });
  gsap.to(core, {
    width: DOT_SIZE_IDLE,
    height: DOT_SIZE_IDLE,
    duration: 0.4,
    ease: "power2.inOut",
    overwrite: "auto",
  });
}

/** Viewport fraction (0–1) at which the About section top triggers the
 * line to start drawing — middle of the 50–60% band the design calls for. */
const DRAW_START_VIEWPORT_FRACTION = 0.55;

/**
 * Scroll position (document Y) at which `el`'s vertical center lines up
 * with the viewport's vertical center (i.e. "50% of the viewport").
 */
function scrollYAtViewportCenter(el: HTMLElement): number {
  return scrollYAtViewportFraction(el, 0.5, "center");
}

/**
 * Scroll position at which a point on `el` (top or center) lines up with
 * `viewportFraction` of the viewport height — e.g. 0.55 means the anchor
 * sits 55% down from the top of the screen.
 */
function scrollYAtViewportFraction(
  el: HTMLElement,
  viewportFraction: number,
  anchor: "top" | "center" = "top",
): number {
  const rect = el.getBoundingClientRect();
  const docTop = rect.top + window.scrollY;
  const anchorY =
    anchor === "center" ? docTop + rect.height / 2 : docTop;
  return anchorY - window.innerHeight * viewportFraction;
}

type CalibrationPoint = { scrollY: number; length: number };

/**
 * Calibration curve mapping scroll position to drawn path length: when the
 * About section's top hits the 50–60% viewport band, `{start, 0}`, then
 * one point per highlight dot — at the scroll position where that
 * highlight's vertical center crosses the viewport's center, the drawn tip
 * should sit exactly on that dot's length — then `{end, pathLength}`.
 * `lengthForScrollY` interpolates linearly between consecutive points, so
 * every dot lights up right as its own highlight reaches mid-viewport,
 * rather than everything bunching up right after the first one.
 */
function buildCalibrationPoints(
  start: number,
  end: number,
  dotEls: HTMLElement[],
  dotLengths: number[],
  pathLength: number,
): CalibrationPoint[] {
  const points: CalibrationPoint[] = [{ scrollY: start, length: 0 }];

  dotEls.forEach((dotEl, i) => {
    const item = dotEl.closest<HTMLElement>("li");
    if (!item) return;
    const scrollY = scrollYAtViewportCenter(item);
    const last = points[points.length - 1];
    if (scrollY <= last.scrollY || scrollY >= end) return;
    points.push({ scrollY, length: dotLengths[i] });
  });

  points.push({ scrollY: end, length: pathLength });
  return points;
}

/** Piecewise-linear lookup of drawn length for a given scroll position. */
function lengthForScrollY(points: CalibrationPoint[], scrollY: number): number {
  if (scrollY <= points[0].scrollY) return points[0].length;
  for (let i = 1; i < points.length; i++) {
    if (scrollY <= points[i].scrollY) {
      const prev = points[i - 1];
      const curr = points[i];
      const span = curr.scrollY - prev.scrollY;
      const t = span > 0 ? (scrollY - prev.scrollY) / span : 1;
      return prev.length + (curr.length - prev.length) * Math.min(1, Math.max(0, t));
    }
  }
  return points[points.length - 1].length;
}

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * Assembles the full point chain for the path — lead-in, the highlight-dot
 * waypoints, then every real timeline node — alongside a parallel flag
 * marking which points are real anchors. Only real anchors get an entry in
 * `nodeLengths` (used for glow-crossing/pulse logic), so the waypoints can
 * reshape the curve without being mistaken for a company node.
 */
function buildPointChain(
  anchors: Point[],
  leadIn: Point,
  waypoints: Point[],
  bulgeApex: Point | null,
): { points: Point[]; isAnchor: boolean[] } {
  const points: Point[] = [leadIn, ...waypoints];
  const isAnchor: boolean[] = [false, ...waypoints.map(() => false)];
  if (bulgeApex && waypoints.length > 0) {
    points.push(bulgeApex);
    isAnchor.push(false);
  }
  for (const anchor of anchors) {
    points.push(anchor);
    isAnchor.push(true);
  }
  return { points, isAnchor };
}

/**
 * Builds the path progressively, writing each intermediate `d` onto the
 * live `path` element so `getTotalLength()` can be used to record the
 * cumulative length at every point along the chain — needed to know
 * exactly when the traveling glow "crosses" a company node, or when the
 * drawn tip reaches an About-highlight dot. `segmentEnds` has one entry per
 * point after the lead-in (real anchors and waypoints alike); `isAnchor`
 * (same length) splits the resulting lengths into `nodeLengths` (real
 * company nodes) and `waypointLengths` (highlight dots).
 */
function measureSegments(
  path: SVGPathElement,
  d: string,
  segmentEnds: string[],
  isAnchor: boolean[],
): PathBuildResult {
  const lengths = segmentEnds.map((partial) => {
    path.setAttribute("d", partial);
    return path.getTotalLength();
  });

  path.setAttribute("d", d);

  const nodeLengths: number[] = [];
  const waypointLengths: number[] = [];
  lengths.forEach((len, i) => {
    (isAnchor[i] ? nodeLengths : waypointLengths).push(len);
  });

  return {
    length: lengths[lengths.length - 1] ?? 0,
    nodeLengths,
    waypointLengths,
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
  waypoints: Point[],
  bulgeApex: Point | null,
): PathBuildResult {
  const { points, isAnchor } = buildPointChain(
    anchors,
    leadIn,
    waypoints,
    bulgeApex,
  );
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

  return measureSegments(path, d, segmentEnds, isAnchor.slice(1));
}

/**
 * Mobile fallback: all nodes share the left rail, so the segments bow
 * gently to alternating sides instead of sweeping across the screen.
 */
function drawBowPath(
  path: SVGPathElement,
  anchors: Point[],
  leadIn: Point,
  waypoints: Point[],
  bulgeApex: Point | null,
): PathBuildResult {
  const amplitude = Math.max(12, Math.min(26, anchors[0].x - 8));
  const { points, isAnchor } = buildPointChain(
    anchors,
    leadIn,
    waypoints,
    bulgeApex,
  );
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

  return measureSegments(path, d, segmentEnds, isAnchor.slice(1));
}

/** Draws one continuous path of cubic bezier segments through the anchors. */
function drawPath(
  path: SVGPathElement,
  anchors: Point[],
  leadIn: Point,
  waypoints: Point[],
  bulgeApex: Point | null,
  trackWidth: number,
): PathBuildResult {
  return trackWidth < 640
    ? drawBowPath(path, anchors, leadIn, waypoints, bulgeApex)
    : drawSweepPath(path, anchors, leadIn, waypoints, bulgeApex);
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
    const waypoints = measureWaypoints(containerRect);
    const leadIn = measureLeadIn(containerRect, heroEl, anchors[0]);
    const bulgeApex = measureBulgeApex(
      containerRect,
      anchors[0],
      waypoints.points.at(-1) ?? null,
    );
    drawPath(
      path,
      anchors,
      leadIn,
      waypoints.points,
      bulgeApex,
      track.clientWidth,
    );
    path.style.strokeDasharray = "none";
    path.style.strokeDashoffset = "0";
    waypoints.dotGlow.forEach(({ layers, shuttles, core }) => {
      setDotActive(core, true);
      setDotSize(core, DOT_SIZE_ACTIVE);
      gsap.set(shuttles, { scale: 1, opacity: 0 });
      gsap.set(layers, {
        opacity: (i: number) => DOT_GLOW_LAYER_OPACITY[i] ?? 0.1,
        scale: 1,
      });
    });
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
  let dotLengths: number[] = [];
  let dotGlow: DotGlowElements[] = [];
  /** Whether each dot is currently lit — tracked so its glow tween only
   * fires on the touch/untouch transition, not every scroll tick. */
  let dotLit: boolean[] = [];
  /** Scroll-position → drawn-length calibration (see `buildCalibrationPoints`),
   * rebuilt alongside the path so every highlight dot lights up right as its
   * own highlight crosses mid-viewport. */
  let calibPoints: CalibrationPoint[] = [{ scrollY: 0, length: 0 }];
  /** Length at which the path crosses into the Experience section — the
   * glow orb stays hidden before this point, so it doesn't show while the
   * line is still sweeping through About. */
  let glowRevealLength = 0;
  /** Whether the glow is currently faded in — tracked so the opacity tween
   * only fires on the enter/exit transition, not every scroll tick. */
  let glowVisible = false;
  let lastCrossedIndex = -1;
  let rafId = 0;

  // The draw range spans from when the About section's top reaches the
  // 50–60% viewport band down to the bottom of the Experience track.
  // Hero's bottom edge is no longer the start boundary — the line stays
  // hidden until About scrolls into that zone. The Experience track's
  // bottom (minus one viewport) is still the end anchor.
  const docBottom = (el: HTMLElement) =>
    el.getBoundingClientRect().bottom + window.scrollY;

  const measureDrawStart = (): number => {
    const aboutEl = document.getElementById("about");
    if (aboutEl) {
      return scrollYAtViewportFraction(
        aboutEl,
        DRAW_START_VIEWPORT_FRACTION,
        "top",
      );
    }
    return docBottom(heroEl ?? sectionEl);
  };

  const buildPath = () => {
    const containerRect = container.getBoundingClientRect();
    const anchors = measureNodeAnchors(containerRect);
    if (!anchors.length) return false;

    const waypoints = measureWaypoints(containerRect);
    const leadIn = measureLeadIn(containerRect, heroEl, anchors[0]);
    const bulgeApex = measureBulgeApex(
      containerRect,
      anchors[0],
      waypoints.points.at(-1) ?? null,
    );
    const result = drawPath(
      path,
      anchors,
      leadIn,
      waypoints.points,
      bulgeApex,
      track.clientWidth,
    );
    pathLength = result.length;
    nodeLengths = result.nodeLengths;
    dotLengths = result.waypointLengths;
    dotGlow = waypoints.dotGlow;
    dotLit = dotLengths.map(() => false);
    lastCrossedIndex = -1;

    const start = measureDrawStart();
    const end = Math.max(start + 1, docBottom(track) - window.innerHeight);
    calibPoints = buildCalibrationPoints(
      start,
      end,
      waypoints.dotEls,
      dotLengths,
      pathLength,
    );

    const firstCardTopY = measureFirstCardTop(containerRect, track);
    glowRevealLength = findLengthAtY(path, firstCardTopY, pathLength);

    const currentLength = lengthForScrollY(calibPoints, window.scrollY);
    dotLengths.forEach((dotLength, i) => {
      const lit = currentLength >= dotLength;
      dotLit[i] = lit;
      if (dotGlow[i]) syncDotVisualInstant(dotGlow[i], lit);
    });

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

  /** Lights each highlight dot with a cinematic bloom + bump the instant the
   * drawn tip reaches (or retreats past) it. */
  const applyDotGlow = (currentLength: number) => {
    dotLengths.forEach((dotLength, i) => {
      const lit = currentLength >= dotLength;
      if (lit === dotLit[i]) return;
      dotLit[i] = lit;

      const glow = dotGlow[i];
      if (!glow) return;

      if (lit) playDotGlowIn(glow);
      else playDotGlowOut(glow);
    });
  };

  const applyProgress = (currentLength: number) => {
    if (!pathLength) return;
    path.style.strokeDashoffset = String(
      Math.max(0, pathLength - currentLength),
    );

    applyDotGlow(currentLength);

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

  const update = () => {
    rafId = 0;
    applyProgress(lengthForScrollY(calibPoints, window.scrollY));
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
    dotGlow.forEach(({ wrap, layers, shuttles, core }) => {
      gsap.killTweensOf([wrap, core, ...layers, ...shuttles]);
    });
  };
}
