"use client";

import { skillCategories } from "@/data/skills.data";
import { AnimatedSectionHeader } from "@/components/typography/AnimatedSectionHeader";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { skillIconMap } from "./skillIcons";

gsap.registerPlugin(ScrollTrigger);

/** Scroll distance (px) the page advances per skill row while the section
 * is pinned — tuned so the whole list reveals over a comfortable, not
 * sluggish, amount of scrolling regardless of how many rows exist. */
const PX_PER_ROW = 70;

const listMask: CSSProperties = {
  maskImage:
    "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
  WebkitMaskImage:
    "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
};

/**
 * Tech stack grouped by category (languages, frameworks, animation,
 * state, styling, data, automation, tools). No cards, no wrapping pill
 * grid — just a plain list stacked bottom by bottom. The section pins in
 * place (same ScrollTrigger recipe as ProjectsGallery) while scrolling
 * drives the list past a fixed reading line, sweeping each row's border
 * and text from muted to white as it passes through.
 */
export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    if (!section || !viewport) return;

    const rows = viewport.querySelectorAll<HTMLElement>("[data-skill-row]");
    if (rows.length === 0) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      gsap.set(rows, { color: "#ffffff", borderColor: "rgba(255,255,255,0.7)" });
      return;
    }

    let trigger: ScrollTrigger | null = null;
    let scrollTween: gsap.core.Tween | null = null;
    let onRefresh: (() => void) | null = null;

    const getMaxScroll = () =>
      Math.max(0, viewport.scrollHeight - viewport.clientHeight);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      scrollTween = gsap.to(viewport, {
        scrollTop: getMaxScroll(),
        ease: "none",
        duration: rows.length,
      });
      tl.add(scrollTween, 0);

      rows.forEach((row, index) => {
        tl.to(
          row,
          {
            color: "#ffffff",
            borderColor: "rgba(255,255,255,0.85)",
            duration: 1,
            ease: "none",
          },
          index,
        );
      });

      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${rows.length * PX_PER_ROW}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tl,
      });

      // Same fixup as ScrollLetterReveal/ProjectsGallery: the preloader's
      // brief page-wide scale skews first measurements (here, both the
      // pin distance and the viewport's scrollHeight), and the global
      // refresh it fires afterward doesn't reliably re-measure everything
      // — so recompute and nudge this instance directly on every refresh.
      onRefresh = () => {
        if (scrollTween) {
          scrollTween.vars.scrollTop = getMaxScroll();
          scrollTween.invalidate();
        }
        trigger?.refresh();
      };
      ScrollTrigger.addEventListener("refresh", onRefresh);
    }, section);

    return () => {
      if (onRefresh) ScrollTrigger.removeEventListener("refresh", onRefresh);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-label="Technical Expertise and skills"
      className="relative h-screen w-full overflow-hidden"
    >
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center gap-8 px-6 md:grid md:grid-cols-[minmax(0,300px)_1fr] md:items-center md:gap-16 md:px-10">
        <div>
          <AnimatedSectionHeader className="w-full font-secondary text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Technical Expertise
          </AnimatedSectionHeader>
          <p className="mt-4 block max-w-xs text-base leading-relaxed text-muted-foreground md:text-lg">
            Languages, frameworks, and tools I reach for to design, build,
            and ship polished front-end products.
          </p>
        </div>

        <div className="relative">
          {/* <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          /> */}

          <div
            ref={viewportRef}
            style={listMask}
            className="relative h-[48vh] overflow-hidden md:h-[64vh] py-4 md:py-10"
          >
            {skillCategories.map((category) => (
              <div key={category.title} className="pt-6">
                <p className="mt-7 text-xs font-semibold tracking-[0.25em] text-primary/70 uppercase first:mt-0 md:text-sm">
                  {category.title}
                </p>

                <ul>
                  {category.skills.map((skill) => {
                    const Icon = skill.icon
                      ? skillIconMap[skill.icon]
                      : undefined;

                    return (
                      <li
                        key={skill.name}
                        data-skill-row
                        className="flex items-center gap-3 border-b border-white/10 py-2.5 text-muted-foreground md:py-3"
                      >
                        {Icon ? (
                          <Icon
                            className="size-4 shrink-0 md:size-5"
                            aria-hidden
                          />
                        ) : (
                          <span
                            className="flex size-4 shrink-0 items-center justify-center rounded-full bg-white/10 text-[9px] font-semibold md:size-5"
                            aria-hidden
                          >
                            {skill.name.charAt(0)}
                          </span>
                        )}
                        <span className="font-secondary text-lg font-semibold tracking-tight uppercase md:text-2xl">
                          {skill.name}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
