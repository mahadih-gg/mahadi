type SpotlightGlowProps = {
  side: "left" | "right";
  visible: boolean;
};

/** Soft museum-spotlight glow behind the focused artwork. */
export default function SpotlightGlow({ side, visible }: SpotlightGlowProps) {
  return (
    <div
      className="gallery-spotlight"
      style={{
        left: side === "left" ? "30%" : "70%",
        opacity: visible ? 1 : 0,
      }}
      aria-hidden
    />
  );
}
