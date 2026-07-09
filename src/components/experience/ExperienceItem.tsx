import { AnimatedHeading } from "@/components/typography/AnimatedHeading";
import type { ExperienceEntry } from "@/data/experienceData";
import { cn } from "@/lib/utils";
import Image from "next/image";

type ExperienceItemProps = {
  item: ExperienceEntry;
  index: number;
};

/**
 * One stop on the career timeline.
 *
 * Desktop: the node sits at the outer edge of the track — left edge for even
 * items, right edge for odd items — with the logo tile and details laid out
 * inline right next to it ([node][logo][text], mirrored on the other side).
 * The SVG path sweeps across the section between the alternating nodes.
 *
 * Mobile: single column — node on the left rail, details to its right, logo
 * folded into the header.
 *
 * Data attributes consumed by experienceAnimation.ts:
 *  - data-exp-node: anchor the SVG path is routed through
 */
export default function ExperienceItem({ item, index }: ExperienceItemProps) {
  const nodeOnLeft = index % 2 === 0;

  return (
    <li
      className={cn(
        "relative flex items-center gap-3 md:gap-8",
        !nodeOnLeft && "md:flex-row-reverse",
      )}
    >
      {/* Path node — outer edge on desktop, left rail on mobile */}
      <div className="flex w-11 shrink-0 justify-center md:w-14">
        <div data-exp-node className="relative size-3.5">
          <span className="absolute inset-0 rounded-full border-2 border-white/40 bg-transparent" />
        </div>
      </div>

      {/* Logo tile — desktop only, always between node and text */}
      <div
        className="hidden size-28 shrink-0 items-center justify-center rounded-xl p-5 md:flex lg:size-32"
        style={{ backgroundColor: item.logoBackground }}
      >
        <Image
          src={item.logo}
          alt={`${item.company} logo`}
          width={96}
          height={96}
          className="h-auto w-full object-contain"
        />
      </div>

      <article className="max-w-xl flex-1">
        <header className="flex items-center gap-3">
          {/* Compact logo, mobile only */}
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-lg p-1.5 md:hidden"
            style={{ backgroundColor: item.logoBackground }}
          >
            <Image
              src={item.logo}
              alt=""
              width={36}
              height={36}
              className="h-auto w-full object-contain"
            />
          </div>
          <div>
            <AnimatedHeading
              as="h3"
              className="font-secondary text-lg font-semibold tracking-tight md:text-2xl"
            >
              {item.company}
            </AnimatedHeading>
            <p className="text-sm font-medium text-primary md:text-base">
              {item.role}
            </p>
          </div>
        </header>

        <p className="mt-3 text-xs tracking-[0.18em] text-muted-foreground uppercase">
          {item.duration}
        </p>

        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground md:text-[0.95rem]">
          {item.description.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <ul className="mt-5 flex flex-wrap gap-2">
          {item.tech.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
            >
              {tech}
            </li>
          ))}
        </ul>
      </article>
    </li>
  );
}
