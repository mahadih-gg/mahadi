"use client";

import { easePower2In, easePower3Out } from "@/lib/motion-easing";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const isFirstRevealRef = useRef(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setRevealed(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setRevealed(true);
    }, revealDelay * 1000);

    return () => window.clearTimeout(timer);
  }, [reduceMotion, revealDelay]);

  useEffect(() => {
    if (items.length <= 1 || reduceMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      isFirstRevealRef.current = false;
      setActiveIndex((current) => (current + 1) % items.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [items.length, interval, reduceMotion]);

  const enterTransition = reduceMotion
    ? { duration: 0 }
    : {
        duration: isFirstRevealRef.current ? 1 : 0.6,
        ease: easePower3Out,
      };

  const exitTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: easePower2In };

  return (
    <div
      className={cn(
        "absolute right-6 bottom-8 z-15 flex max-w-xs flex-col gap-5 md:right-12 md:bottom-12 md:max-w-md md:gap-6 lg:max-w-lg",
        className,
      )}
    >
      <ul aria-label="Professional highlights" aria-live="polite">
        <AnimatePresence mode="wait">
          {revealed && (
            <motion.li
              key={activeIndex}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24, transition: exitTransition }}
              transition={enterTransition}
              className="flex min-h-18 gap-3 leading-relaxed text-muted-foreground text-xs md:min-h-22 md:text-base"
            >
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                aria-hidden
              />
              <span>{items[activeIndex]}</span>
            </motion.li>
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
}
