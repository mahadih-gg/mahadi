import { frameStateFor } from "@/lib/gallery/frameStates";
import type { ProjectFrameBox } from "@/lib/gallery/layout";
import type { Project } from "@/types/project.type";
import Image from "next/image";

type ProjectFrameProps = {
  project: Project;
  index: number;
  box: ProjectFrameBox;
  registerRef: (el: HTMLDivElement | null) => void;
};

/**
 * A single framed artwork. Position is permanent (set once from `box`);
 * only the inner animated element's scale/opacity/filter/shadow are ever
 * touched, and only by the gallery scroll timeline / parallax hooks.
 * Image-only — no title, description, or buttons live here.
 */
export default function ProjectFrame({
  project,
  index,
  box,
  registerRef,
}: ProjectFrameProps) {
  const initial = frameStateFor("overview");

  return (
    <div
      className="absolute"
      style={{
        left: `calc(50% + ${box.x}px)`,
        top: `calc(50% + ${box.y}px)`,
        width: box.width,
        height: box.height,
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden={false}
    >
      <div
        ref={registerRef}
        className="gallery-frame relative h-full w-full rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-2 md:rounded-3xl md:p-3"
        style={{
          transformOrigin: "center center",
          transform: `scale(${initial.scale}) rotate(${box.rotate}deg)`,
          opacity: initial.opacity,
          filter: initial.filter,
          boxShadow: initial.boxShadow,
          willChange: "transform, opacity, filter",
        }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-black/40 md:rounded-2xl">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 75vw, 38vw"
            className="scale-110 object-cover"
            priority={index < 2}
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
        </div>
      </div>
    </div>
  );
}
