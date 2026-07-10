/**
 * Depth states for a gallery frame. Every state shares the same shadow
 * "shape" (two comma-separated layers, same units/format) so GSAP can
 * interpolate the `boxShadow` string smoothly between states.
 */
export type FrameStateName = "active" | "near" | "far" | "overview";

export type FrameStateValues = {
  scale: number;
  opacity: number;
  filter: string;
  boxShadow: string;
};

const FRAME_STATE: Record<FrameStateName, FrameStateValues> = {
  active: {
    scale: 1.1,
    opacity: 1,
    filter: "blur(0px) brightness(1.08)",
    boxShadow:
      "0 45px 100px -24px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
  },
  near: {
    scale: 0.86,
    opacity: 0.5,
    filter: "blur(8.5px) brightness(0.52)",
    boxShadow:
      "0 24px 60px -20px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.045)",
  },
  far: {
    scale: 0.7,
    opacity: 0.26,
    filter: "blur(9px) brightness(0.5)",
    boxShadow:
      "0 14px 34px -18px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)",
  },
  overview: {
    scale: 0.92,
    opacity: 1,
    filter: "blur(0px) brightness(1)",
    boxShadow:
      "0 20px 50px -18px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.055)",
  },
};

export function frameStateFor(name: FrameStateName): FrameStateValues {
  return FRAME_STATE[name];
}

export function depthStateFor(
  frameIndex: number,
  activeIndex: number,
): FrameStateName {
  if (activeIndex < 0) return "overview";
  if (frameIndex === activeIndex) return "active";
  if (Math.abs(frameIndex - activeIndex) === 1) return "near";
  return "far";
}

/**
 * States for the section heading that sits pinned at the center of the
 * gallery, behind the frames. It never gets a position/translate tween —
 * only these depth-style properties — so it visually recedes exactly like
 * a far/blurred frame once a project is focused, then returns to full
 * clarity once the camera pulls back to the overview.
 */
export type HeadingStateName = "default" | "blurred";

export type HeadingStateValues = {
  opacity: number;
  filter: string;
  scale: number;
};

const HEADING_STATE: Record<HeadingStateName, HeadingStateValues> = {
  default: {
    opacity: 1,
    filter: "blur(0px) brightness(1)",
    scale: 1,
  },
  blurred: {
    opacity: 0.16,
    filter: "blur(9px) brightness(0.45)",
    scale: 0.94,
  },
};

export function headingStateFor(name: HeadingStateName): HeadingStateValues {
  return HEADING_STATE[name];
}
