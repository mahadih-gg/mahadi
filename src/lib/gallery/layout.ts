/**
 * Deterministic, "salon wall" gallery layout.
 *
 * Every project gets a fixed slot — a center offset from the viewport
 * middle and a slight rotation. Positions never depend on scroll state;
 * only the camera (stage transform) moves.
 *
 * Unlike a loose scattershot, slots are arranged as an organized grid
 * (rows/columns) so the exhibition reads as intentional, while each frame
 * still leans at its own small angle for a hand-hung, gallery-wall feel.
 *
 * The horizontal offset (`xVW`) is a % of viewport *width*; the vertical
 * offset (`yVH`) is a % of viewport *height*. Splitting the axes this way
 * (rather than deriving both from width) keeps the whole arrangement
 * inside the viewport — and therefore free of the left/right/bottom
 * overflow or dead space that a single width-based axis produces once the
 * aspect ratio drifts from what the layout was tuned for.
 *
 * `getOverviewStageScale` then computes, from the *actual* viewport size,
 * exactly how much to zoom the whole stage out so every frame comfortably
 * fits on screen with a consistent margin — so the gallery always "fits
 * the screen" instead of relying on a fixed guess that only works for one
 * aspect ratio.
 */

export type GallerySlot = {
  /** Horizontal center offset from viewport middle, in % of viewport width. */
  xVW: number;
  /** Vertical center offset from viewport middle, in % of viewport height. */
  yVH: number;
  /** Resting rotation, in degrees. */
  rotate: number;
};

export type ProjectFrameBox = {
  /** Frame center X, in px, relative to the stage/viewport center. */
  x: number;
  /** Frame center Y, in px, relative to the stage/viewport center. */
  y: number;
  width: number;
  height: number;
  rotate: number;
};

/** Every frame's width, as a % of viewport width — identical for all projects. */
const FRAME_WIDTH_VW = 30;
/** Every frame's height/width ratio — identical for all projects. */
const FRAME_RATIO = 0.66;

/** Below this viewport width, layout switches to a single stacked column
 * (see `MOBILE_SLOTS`) with a much wider frame, since a multi-column grid
 * has no room to breathe on a narrow phone screen. */
export const MOBILE_BREAKPOINT = 768;
const MOBILE_FRAME_WIDTH_VW = 74;
/** Top inset for the focused frame on mobile (below the site header). */
const MOBILE_FOCUS_TOP_VH = 11;

export function isMobileViewport(viewportWidth: number): boolean {
  return viewportWidth < MOBILE_BREAKPOINT;
}

/** Top padding for the pinned gallery heading on mobile (matches header inset). */
export function getMobileHeadingTopInsetVh(): number {
  return MOBILE_FOCUS_TOP_VH;
}

/**
 * Desktop: a tidy 2×2 grid — organized at a glance, but each frame sits at
 * its own small angle so it still reads as a curated gallery wall rather
 * than a rigid spreadsheet.
 */
const DESKTOP_SLOTS: GallerySlot[] = [
  { xVW: -27, yVH: -25, rotate: -3.5 },
  { xVW: 27, yVH: -23, rotate: 3 },
  { xVW: -26, yVH: 25, rotate: 2.4 },
  { xVW: 27, yVH: 27, rotate: -2.8 },
];

/** Mobile: single centered column, stacked below the section heading. */
const MOBILE_SLOTS: GallerySlot[] = [
  { xVW: 0, yVH: -14, rotate: -3 },
  { xVW: 0, yVH: 8, rotate: 2.6 },
  { xVW: 0, yVH: 30, rotate: 2 },
  { xVW: 0, yVH: 52, rotate: -2.4 },
];

const GOLDEN_ANGLE = 137.508;

/** Generates further-out, still-organized slots once the curated list runs out. */
function generateSlot(index: number, isMobile: boolean): GallerySlot {
  const slots = isMobile ? MOBILE_SLOTS : DESKTOP_SLOTS;
  const ring = Math.floor(index / slots.length) + 1;
  const angleDeg = index * GOLDEN_ANGLE;
  const angle = (angleDeg * Math.PI) / 180;
  const radius = 30 + ring * 20;

  return {
    xVW: Math.cos(angle) * radius,
    yVH: Math.sin(angle) * radius,
    rotate: (((index * 3) % 5) - 2) * 1.4,
  };
}

export function getProjectSlot(index: number, isMobile = false): GallerySlot {
  const slots = isMobile ? MOBILE_SLOTS : DESKTOP_SLOTS;
  return slots[index] ?? generateSlot(index, isMobile);
}

/**
 * Resolves a slot into an absolute pixel box centered on the current
 * viewport, given the viewport dimensions. Recompute on resize.
 */
export function getProjectFrameBox(
  index: number,
  viewportWidth: number,
  viewportHeight: number,
): ProjectFrameBox {
  const isMobile = viewportWidth < MOBILE_BREAKPOINT;
  const slot = getProjectSlot(index, isMobile);
  const frameWidthVW = isMobile ? MOBILE_FRAME_WIDTH_VW : FRAME_WIDTH_VW;
  const width = (frameWidthVW / 100) * viewportWidth;

  return {
    x: (slot.xVW / 100) * viewportWidth,
    y: (slot.yVH / 100) * viewportHeight,
    width,
    height: width * FRAME_RATIO,
    rotate: slot.rotate,
  };
}

/** Upper bound on how "zoomed out" the overview ever gets — the actual
 * value is the smaller of this and whatever `getOverviewStageScale`
 * computes is needed to keep every frame on screen. Kept close to 1 so the
 * resting view reads as "up close", not distant. */
const OVERVIEW_STAGE_SCALE_BASE = 0.96;
/** Fraction of the viewport the whole arrangement is allowed to span, so a
 * consistent breathing margin remains on every side at any aspect ratio. */
const OVERVIEW_SAFE_WIDTH_RATIO = 0.95;
const OVERVIEW_SAFE_HEIGHT_RATIO = 0.88;

/**
 * How much to scale the whole stage down for the resting "overview" state,
 * computed from the real viewport so every frame's full bounding box
 * (including its own overview scale) stays inside a safe on-screen area —
 * fitting the screen edge-to-edge-with-margin instead of leaving a fixed,
 * aspect-ratio-dependent gap (or overflowing) on some screens.
 */
export function getOverviewStageScale(
  viewportWidth: number,
  viewportHeight: number,
  projectCount: number,
): number {
  if (viewportWidth <= 0 || viewportHeight <= 0 || projectCount <= 0) {
    return OVERVIEW_STAGE_SCALE_BASE;
  }

  let halfWidth = 0;
  let halfHeight = 0;

  for (let i = 0; i < projectCount; i++) {
    const box = getProjectFrameBox(i, viewportWidth, viewportHeight);
    halfWidth = Math.max(halfWidth, Math.abs(box.x) + box.width / 2);
    halfHeight = Math.max(halfHeight, Math.abs(box.y) + box.height / 2);
  }

  if (halfWidth === 0 || halfHeight === 0) return OVERVIEW_STAGE_SCALE_BASE;

  const widthFit = (viewportWidth * OVERVIEW_SAFE_WIDTH_RATIO) / (halfWidth * 2);
  const heightFit = (viewportHeight * OVERVIEW_SAFE_HEIGHT_RATIO) / (halfHeight * 2);

  return Math.min(OVERVIEW_STAGE_SCALE_BASE, widthFit, heightFit);
}

/** Alternates the split-panel side per project so image/info swap automatically. */
export function getFocusSide(index: number): "left" | "right" {
  return index % 2 === 0 ? "left" : "right";
}

/** Horizontal gap between the active frame edge and the detail panel. */
const DETAIL_PANEL_GAP_VW = 4;
/** Minimum inset from the viewport edge for the detail panel. */
const DETAIL_PANEL_EDGE_MARGIN_VW = 5;

export type DetailPanelLayout = {
  side: "left" | "right";
  style: {
    left: number;
    right: number;
  };
  textAlign: "left" | "right";
};

/**
 * Positions the detail panel relative to the active project's focused frame so
 * every project shares the same gap between image and description.
 */
export function getDetailPanelLayout(
  index: number,
  viewportWidth: number,
  viewportHeight: number,
): DetailPanelLayout {
  const box = getProjectFrameBox(index, viewportWidth, viewportHeight);
  const target = getFocusTarget(index, viewportWidth, viewportHeight);
  const focusSide = getFocusSide(index);
  const activeScale = 1.1;
  const halfWidth = (box.width * activeScale) / 2;
  const gap = (DETAIL_PANEL_GAP_VW / 100) * viewportWidth;
  const edgeMargin = (DETAIL_PANEL_EDGE_MARGIN_VW / 100) * viewportWidth;

  if (focusSide === "left") {
    return {
      side: "right",
      style: {
        left: target.x + halfWidth + gap,
        right: edgeMargin,
      },
      textAlign: "left",
    };
  }

  return {
    side: "left",
    style: {
      left: edgeMargin,
      right: viewportWidth - (target.x - halfWidth - gap),
    },
    textAlign: "right",
  };
}

/** Viewport-space point the camera should center a project on when focused. */
export function getFocusTarget(
  index: number,
  viewportWidth: number,
  viewportHeight: number,
): { x: number; y: number } {
  if (isMobileViewport(viewportWidth)) {
    const box = getProjectFrameBox(index, viewportWidth, viewportHeight);
    const activeScale = 1.1;
    const topInset = (MOBILE_FOCUS_TOP_VH / 100) * viewportHeight;

    return {
      x: viewportWidth * 0.5,
      y: topInset + (box.height * activeScale) / 2,
    };
  }

  const side = getFocusSide(index);
  return {
    x: viewportWidth * (side === "left" ? 0.3 : 0.7),
    y: viewportHeight * 0.5,
  };
}

/**
 * Camera translation (stage transform) that puts a project's fixed frame
 * at its focus target on screen.
 */
export function getCameraOffsetForProject(
  index: number,
  viewportWidth: number,
  viewportHeight: number,
): { x: number; y: number } {
  const box = getProjectFrameBox(index, viewportWidth, viewportHeight);
  const target = getFocusTarget(index, viewportWidth, viewportHeight);

  return {
    x: target.x - (viewportWidth / 2 + box.x),
    y: target.y - (viewportHeight / 2 + box.y),
  };
}
