"use client";

import {
  galleryCardChromeClassName,
  galleryCardLayoutId,
} from "@/lib/gallery/cardChrome";
import { frameStateFor } from "@/lib/gallery/frameStates";
import type { ProjectFrameBox } from "@/lib/gallery/layout";
import { easePower3Out } from "@/lib/motion-easing";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project.type";
import { motion } from "motion/react";
import Image from "next/image";

type ProjectFrameProps = {
  project: Project;
  index: number;
  box: ProjectFrameBox;
  registerRef: (el: HTMLDivElement | null) => void;
  isPinned: boolean;
  reduceMotion?: boolean;
};

/**
 * A single framed artwork. Position is permanent (set once from `box`);
 * only the inner animated element's scale/opacity/filter/shadow are ever
 * touched, and only by the gallery scroll timeline / parallax hooks.
 */
export default function ProjectFrame({
  project,
  index,
  box,
  registerRef,
  isPinned,
  reduceMotion = false,
}: ProjectFrameProps) {
  const initial = frameStateFor("overview");
  const layoutId = reduceMotion ? undefined : galleryCardLayoutId(project.slug);

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
        className="relative h-full w-full rounded-2xl md:rounded-3xl"
        style={{
          transformOrigin: "center center",
          transform: `scale(${initial.scale}) rotate(${box.rotate}deg)`,
          opacity: initial.opacity,
          filter: initial.filter,
          boxShadow: initial.boxShadow,
          willChange: "transform, opacity, filter",
        }}
      >
        {!isPinned ? (
          <motion.div
            layoutId={layoutId}
            transition={{ layout: { duration: 0.55, ease: easePower3Out } }}
            className={cn(galleryCardChromeClassName, "absolute inset-0 h-full")}
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
            </div>
          </motion.div>
        ) : (
          <div
            className={cn(
              galleryCardChromeClassName,
              "absolute inset-0 h-full opacity-0",
            )}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
