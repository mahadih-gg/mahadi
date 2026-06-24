"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";


import { cn } from "@/lib/utils";

export const HERO_HIGHLIGHTS = [
  "4+ years of front-end development experience. Focusing on Front-end architecture, codebase structuring, and front-end scalability for long-term maintainability.",
  "Deep understanding of fundamental design principles and React core concepts, ensuring efficient and scalable application development.",
  "Proficiency in React JS, Next JS, JavaScript, Tailwind CSS, SASS, responsive and adaptive design with best practices. And expertise in implementing modern, advanced animations.",
  "Proficient in Agile/Scrum, actively involved in sprint planning, daily stand-ups, and retrospective meetings to align projects with business objectives and timelines.",
] as const;


type HeroHighlightsProps = {
  items?: readonly string[];
  interval?: number;
  revealDelay?: number;
  className?: string;
};

export function HeroHighlights({
  items = HERO_HIGHLIGHTS,
  interval = 6000,
  revealDelay = 1.65,
  className,
}: HeroHighlightsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const itemRef = useRef<HTMLLIElement>(null);
  const indexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const el = itemRef.current;
    const linkItems =
      linksRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [];
    if (!el) return;

    if (reducedMotion) {
      gsap.set(el, { opacity: 1, x: 0, y: 0 });
      if (linkItems.length) {
        gsap.set(linkItems, { opacity: 1, y: 0 });
      }
      return;
    }

    gsap.set(el, { opacity: 0, y: 24, x: 0 });
    if (linkItems.length) {
      gsap.set(linkItems, { opacity: 0, y: 16 });
    }

    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      delay: revealDelay,
    });

    if (linkItems.length) {
      gsap.to(linkItems, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: revealDelay - 0.15,
      });
    }
  }, [revealDelay]);

  useEffect(() => {
    if (items.length <= 1) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const animateToNext = () => {
      const el = itemRef.current;
      if (!el || isAnimatingRef.current) return;

      const nextIndex = (indexRef.current + 1) % items.length;

      if (reducedMotion) {
        indexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        return;
      }

      isAnimatingRef.current = true;

      gsap.to(el, {
        opacity: 0,
        y: -24,
        x: 0,
        duration: 0.45,
        ease: "power2.in",
        onComplete: () => {
          indexRef.current = nextIndex;
          setActiveIndex(nextIndex);

          gsap.fromTo(
            el,
            { opacity: 0, y: 24, x: 0 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              onComplete: () => {
                isAnimatingRef.current = false;
              },
            },
          );
        },
      });
    };

    const timer = window.setInterval(animateToNext, interval);

    return () => {
      window.clearInterval(timer);
      gsap.killTweensOf(itemRef.current);
      isAnimatingRef.current = false;
    };
  }, [items, interval]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute right-6 bottom-8 z-15 flex max-w-xs flex-col gap-5 md:right-12 md:bottom-12 md:max-w-md md:gap-6 lg:max-w-lg",
        className,
      )}
    >

      {/* <ul aria-label="Professional highlights" aria-live="polite">
        <li
          ref={itemRef}
          className="flex min-h-18 gap-3 leading-relaxed text-muted-foreground opacity-0 text-xs md:min-h-22 md:text-base"
        >
          <span
            className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
            aria-hidden
          />
          <span>{items[activeIndex]}</span>
        </li>
      </ul> */}


    </div>
  );
}
