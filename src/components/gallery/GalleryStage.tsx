import { getProjectFrameBox } from "@/lib/gallery/layout";
import type { Project } from "@/types/project.type";
import type { RefObject } from "react";
import ProjectFrame from "./ProjectFrame";

type Viewport = { width: number; height: number };

type GalleryStageProps = {
  projects: Project[];
  viewport: Viewport;
  stageRef: RefObject<HTMLDivElement | null>;
  registerFrameRef: (index: number) => (el: HTMLDivElement | null) => void;
};

/**
 * The large virtual canvas holding every framed artwork at its permanent
 * position. This element itself is the "camera" — the scroll hook
 * translates/scales `stageRef`, never the individual frames' positions.
 */
export default function GalleryStage({
  projects,
  viewport,
  stageRef,
  registerFrameRef,
}: GalleryStageProps) {
  return (
    <div
      ref={stageRef}
      className="absolute inset-0"
      style={{ willChange: "transform" }}
    >
      {projects.map((project, index) => (
        <ProjectFrame
          key={project.slug}
          project={project}
          index={index}
          box={getProjectFrameBox(index, viewport.width, viewport.height)}
          registerRef={registerFrameRef(index)}
        />
      ))}
    </div>
  );
}
