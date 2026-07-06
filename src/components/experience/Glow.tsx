import type { RefObject } from "react";

type GlowProps = {
  glowRef: RefObject<HTMLDivElement | null>;
};

/**
 * The glowing orb that travels along the SVG path (via MotionPathPlugin).
 *
 * Three stacked layers create the bloom:
 *  - outer glow: large, blur 35px
 *  - middle glow: medium, blur 15px
 *  - solid white center
 *
 * The `data-exp-glow-layer` layers get an intensity boost whenever the orb
 * crosses a company node.
 */
export default function Glow({ glowRef }: GlowProps) {
  return (
    <div
      ref={glowRef}
      className="pointer-events-none absolute top-0 left-0 z-[5] size-5 will-change-transform"
      aria-hidden
    >
      <span
        data-exp-glow-layer
        className="absolute -inset-5 rounded-full bg-white opacity-70 blur-[35px]"
      />
      <span
        data-exp-glow-layer
        className="absolute -inset-1 rounded-full bg-white opacity-70 blur-[15px]"
      />
      <span className="absolute inset-1 rounded-full bg-white" />
    </div>
  );
}
