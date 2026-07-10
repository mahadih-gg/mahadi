"use client";

import { Button } from "@/components/ui/button";
import { getProjectCategory } from "@/data/projects.data";
import {
  galleryCardChromeClassName,
  galleryCardLayoutId,
} from "@/lib/gallery/cardChrome";
import { easePower3Out } from "@/lib/motion-easing";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project.type";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaGithub } from "react-icons/fa6";
import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";

type ProjectDetailsOverlayProps = {
  project: Project | null;
  onClose: () => void;
  reduceMotion?: boolean;
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easePower3Out },
  },
};

function ProjectSections({
  project,
  reduceMotion,
}: {
  project: Project;
  reduceMotion: boolean;
}) {
  const v = reduceMotion ? undefined : "visible";
  const h = reduceMotion ? undefined : "hidden";

  return (
    <>
      {project.sections.map((section) => (
        <motion.section
          key={section.title}
          variants={reduceMotion ? undefined : itemVariants}
          initial={h}
          animate={v}
          className="mt-12 md:mt-16"
        >
          <h4 className="font-secondary text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            {section.title}
          </h4>

          <div className="mt-4 space-y-4">
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-sm leading-relaxed text-muted-foreground md:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {section.features && section.features.length > 0 && (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {section.features.map((feature) => (
                <li
                  key={feature.title}
                  className="rounded-2xl border border-foreground/10 bg-foreground/5 p-4 backdrop-blur-sm"
                >
                  <p className="text-sm font-medium text-foreground">
                    {feature.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {section.showcase && project.showcaseImages.length > 0 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.showcaseImages.map((src) => (
                <div
                  key={src}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black/40 ring-1 ring-inset ring-white/10"
                >
                  <Image
                    src={src}
                    alt={`${project.title} showcase`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </motion.section>
      ))}
    </>
  );
}

export default function ProjectDetailsOverlay({
  project,
  onClose,
  reduceMotion = false,
}: ProjectDetailsOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!project) return;

    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="popLayout">
      {project && (
        <motion.div
          key={project.slug}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`project-details-title-${project.slug}`}
          className="fixed inset-0 z-[300]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0 bg-background/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.3 }}
            aria-hidden="true"
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-background/60 backdrop-blur-md md:top-6 md:right-8"
            aria-label="Close project details"
            onClick={onClose}
          >
            <X className="size-5" />
          </Button>

          <div
            ref={scrollRef}
            data-lenis-prevent
            className="gallery-details-scroll absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-y-contain"
            onWheel={(event) => event.stopPropagation()}
          >
            <div className="mx-auto w-full max-w-6xl px-6 pt-16 pb-24 md:px-10 md:pt-20">
              <h3
                id={`project-details-title-${project.slug}`}
                className="sr-only"
              >
                {project.title} details
              </h3>

              <motion.div
                variants={reduceMotion ? undefined : containerVariants}
                initial={reduceMotion ? undefined : "hidden"}
                animate={reduceMotion ? undefined : "visible"}
                className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
              >
                <div>
                  <motion.span
                    variants={reduceMotion ? undefined : itemVariants}
                    className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs tracking-[0.18em] text-primary uppercase"
                  >
                    {getProjectCategory(project)}
                  </motion.span>

                  <motion.h3
                    variants={reduceMotion ? undefined : itemVariants}
                    className="mt-5 font-secondary text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl"
                  >
                    {project.title}
                  </motion.h3>

                  <motion.p
                    variants={reduceMotion ? undefined : itemVariants}
                    className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base lg:text-lg"
                  >
                    {project.heroDescription}
                  </motion.p>

                  <motion.ul
                    variants={reduceMotion ? undefined : containerVariants}
                    className="mt-6 flex flex-wrap gap-2"
                  >
                    {(project.techStack ?? project.tags).map((tech) => (
                      <motion.li
                        key={tech}
                        variants={reduceMotion ? undefined : itemVariants}
                        className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs text-foreground/90 backdrop-blur-lg"
                      >
                        {tech}
                      </motion.li>
                    ))}
                  </motion.ul>

                  <motion.div
                    variants={reduceMotion ? undefined : itemVariants}
                    className="mt-8 flex flex-wrap items-center gap-4"
                  >
                    <Button asChild>
                      <a
                        href={project.visitUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live Demo
                        <HiOutlineArrowTopRightOnSquare className="size-4" />
                      </a>
                    </Button>

                    {project.githubUrl && (
                      <Button asChild variant="outline">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaGithub className="size-4" />
                          GitHub
                        </a>
                      </Button>
                    )}
                  </motion.div>
                </div>

                <motion.div
                  layoutId={
                    reduceMotion ? undefined : galleryCardLayoutId(project.slug)
                  }
                  transition={{ layout: { duration: 0.55, ease: easePower3Out } }}
                  className={cn(galleryCardChromeClassName, "aspect-[4/3]")}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-xl bg-black/40 md:rounded-2xl">
                    <Image
                      src={project.heroImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 45vw"
                      className="scale-110 object-cover"
                      priority
                    />
                  </div>
                </motion.div>
              </motion.div>

              <ProjectSections project={project} reduceMotion={reduceMotion} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
