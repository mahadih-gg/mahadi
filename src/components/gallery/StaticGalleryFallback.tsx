import { Button } from "@/components/ui/button";
import { getProjectCategory } from "@/data/projects.data";
import { getFocusSide } from "@/lib/gallery/layout";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project.type";
import Image from "next/image";
import { FaGithub } from "react-icons/fa6";
import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";

type StaticGalleryFallbackProps = {
  projects: Project[];
};

/**
 * `prefers-reduced-motion` fallback: no pinning, no camera movement — just
 * a simple, calm, fully static exhibition list with the same alternating
 * image/details layout, so the content is equally accessible.
 */
export default function StaticGalleryFallback({
  projects,
}: StaticGalleryFallbackProps) {
  return (
    <div className="gallery-section relative overflow-hidden py-24 md:py-32">
      <div className="gallery-vignette" />
      <div className="gallery-grain" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 md:px-10">
        {projects.map((project, index) => {
          const side = getFocusSide(index);

          return (
            <article
              key={project.slug}
              className={cn(
                "flex flex-col items-center gap-10 md:gap-16",
                side === "right" ? "md:flex-row-reverse" : "md:flex-row",
              )}
            >
              <div className="w-full max-w-lg shrink-0 md:w-1/2">
                <div className="gallery-frame relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-3 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.6)]">
                  <div className="relative h-full w-full overflow-hidden rounded-xl bg-black/40">
                    <Image
                      src={project.heroImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 45vw"
                      className="scale-110 object-cover"
                    />
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "w-full max-w-lg md:w-1/2",
                  side === "right" && "md:text-right",
                )}
              >
                <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs tracking-[0.18em] text-primary uppercase">
                  {getProjectCategory(project)}
                </span>

                <h3 className="mt-5 font-secondary text-3xl font-bold tracking-tight text-white md:text-4xl">
                  {project.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {project.description}
                </p>

                <ul
                  className={cn(
                    "mt-6 flex flex-wrap gap-2",
                    side === "right" && "md:justify-end",
                  )}
                >
                  {(project.techStack ?? project.tags).map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>

                <div
                  className={cn(
                    "mt-8 flex flex-wrap items-center gap-4",
                    side === "right" && "md:justify-end",
                  )}
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
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
