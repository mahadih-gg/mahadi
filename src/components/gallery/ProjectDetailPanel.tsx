"use client";

import { Button } from "@/components/ui/button";
import { getProjectCategory } from "@/data/projects.data";
import { easePower3Out } from "@/lib/motion-easing";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project.type";
import { AnimatePresence, motion } from "motion/react";
import { FaGithub } from "react-icons/fa6";
import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";

type ProjectDetailPanelProps = {
  project: Project | null;
  side: "left" | "right";
  reduceMotion?: boolean;
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easePower3Out },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easePower3Out },
  },
};

function DetailContent({
  project,
  align,
  reduceMotion,
}: {
  project: Project;
  align: "left" | "right" | "center";
  reduceMotion: boolean;
}) {
  const v = reduceMotion ? undefined : "visible";
  const h = reduceMotion ? undefined : "hidden";

  return (
    <motion.div
      key={project.slug}
      variants={reduceMotion ? undefined : containerVariants}
      initial={h}
      animate={v}
      exit={h}
      className="pointer-events-auto"
    >
      <motion.span
        variants={reduceMotion ? undefined : itemVariants}
        className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs tracking-[0.18em] text-primary uppercase"
      >
        {getProjectCategory(project)}
      </motion.span>

      <motion.h3
        variants={reduceMotion ? undefined : itemVariants}
        className="mt-5 font-secondary text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
      >
        {project.title}
      </motion.h3>

      <motion.p
        variants={reduceMotion ? undefined : itemVariants}
        className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base"
      >
        {project.description}
      </motion.p>

      <motion.ul
        variants={reduceMotion ? undefined : containerVariants}
        className={cn(
          "mt-6 flex flex-wrap gap-2",
          align === "right" && "justify-end",
          align === "center" && "justify-center",
        )}
      >
        {(project.techStack ?? project.tags).map((tech) => (
          <motion.li
            key={tech}
            variants={reduceMotion ? undefined : badgeVariants}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
          >
            {tech}
          </motion.li>
        ))}
      </motion.ul>

      <motion.div
        variants={reduceMotion ? undefined : itemVariants}
        className={cn(
          "mt-8 flex flex-wrap items-center gap-4",
          align === "right" && "justify-end",
          align === "center" && "justify-center",
        )}
      >
        <Button asChild>
          <a href={project.visitUrl} target="_blank" rel="noopener noreferrer">
            Live Demo
            <HiOutlineArrowTopRightOnSquare className="size-4" />
          </a>
        </Button>

        {project.githubUrl && (
          <Button asChild variant="outline">
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <FaGithub className="size-4" />
              GitHub
            </a>
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}

/**
 * Fixed overlay (not part of the transformed gallery stage) that reveals the
 * active project's details on the side opposite its artwork. Only ever
 * shows one project's info at a time; every other frame stays image-only.
 * Desktop only — see `MobileProjectDetails` for the small-screen layout.
 */
export default function ProjectDetailPanel({
  project,
  side,
  reduceMotion = false,
}: ProjectDetailPanelProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 hidden items-center md:flex",
        side === "left" ? "justify-start" : "justify-end",
      )}
    >
      <div
        className={cn(
          "w-full max-w-md px-10 lg:max-w-lg lg:px-16",
          side === "right" && "text-right",
        )}
      >
        <AnimatePresence mode="wait">
          {project && (
            <DetailContent
              project={project}
              align={side}
              reduceMotion={reduceMotion}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

type MobileProjectDetailsProps = {
  project: Project | null;
  reduceMotion?: boolean;
};

/** Small-screen fallback: details stack below the focused frame, centered. */
export function MobileProjectDetails({
  project,
  reduceMotion = false,
}: MobileProjectDetailsProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-5 pb-6 md:hidden">
      <div className="pointer-events-auto w-full max-w-sm rounded-3xl border border-white/10 bg-black/50 p-5 text-center backdrop-blur-md">
        <AnimatePresence mode="wait">
          {project && (
            <DetailContent
              project={project}
              align="center"
              reduceMotion={reduceMotion}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
