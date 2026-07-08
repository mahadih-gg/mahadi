import type { RefObject } from "react";

type ExperiencePathProps = {
  pathRef: RefObject<SVGPathElement | null>;
};

/**
 * Full-bleed SVG overlay for the career timeline.
 *
 * The path has no hardcoded geometry — its `d` attribute is generated at
 * runtime from the measured node positions (see experienceAnimation.ts),
 * so the curve stays pixel-aligned with the cards on every viewport size.
 */
export default function ExperiencePath({ pathRef }: ExperiencePathProps) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      fill="none"
      aria-hidden
    >
      <path
        ref={pathRef}
        stroke="white"
        strokeOpacity={0.16}
        strokeWidth={5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.25))" }}
      />
    </svg>
  );
}
