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
    opacity: 0.8,
    filter: "blur(2.5px) brightness(0.86)",
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
