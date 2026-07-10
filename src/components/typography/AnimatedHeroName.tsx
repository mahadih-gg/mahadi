"use client";

import {
  initEffect4,
  setEffect4FromState,
} from "@/lib/scroll-animations/effect4";
import { splitElement } from "@/lib/scroll-animations/splitting";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(useGSAP);

type Props = {
  primary: ReactNode;
  secondary: ReactNode;
  className?: string;
  /** When true, plays the converge animation once (e.g. after preloader). */
  ready?: boolean;
  delay?: number;
};

const headingClass =
  "font-secondary text-[clamp(4.5rem,8vw,9rem)] leading-[0.95] font-bold tracking-tight text-foreground";

function heroSpread(
  position: number,
  _: HTMLElement,
  arr: HTMLElement[],
) {
  const word = arr[0]?.closest(".word") as HTMLElement | null;
  const wordWidth = word?.offsetWidth ?? 0;
  const maxOffset = wordWidth * 0.12;
  const half = Math.max(arr.length / 2, 1);

  return maxOffset * ((position - arr.length / 2) / half);
}

export function AnimatedHeroName({
  primary,
  secondary,
  className = "",
  ready = true,
  delay = 0.2,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLHeadingElement>(null);
  const secondaryRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!ready) return;

      const headings = [primaryRef.current, secondaryRef.current].filter(
        Boolean,
      ) as HTMLElement[];

      if (headings.length === 0) return;

      const reveal = () => {
        gsap.set(
          [wrapperRef.current, primaryRef.current, secondaryRef.current].filter(
            Boolean,
          ),
          { opacity: 1 },
        );
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        void Promise.all(
          headings.map((heading) => splitElement(heading, "chars")),
        ).then(reveal);
        return;
      }

      void Promise.all(
        headings.map((heading) => splitElement(heading, "chars")),
      ).then(() => {
        headings.forEach((heading) => {
          setEffect4FromState(heading, { spread: heroSpread });
        });

        reveal();

        headings.forEach((heading, index) => {
          initEffect4(heading, {
            delay: delay + index * 0.1,
            fromCurrent: true,
          });
        });
      });
    },
    { scope: wrapperRef, dependencies: [ready, delay] },
  );

  return (
    <div
      ref={wrapperRef}
      className={`flex flex-wrap items-baseline justify-center gap-x-[1em] opacity-0 md:contents ${className}`}
    >
      <h1
        ref={primaryRef}
        data-splitting
        data-effect4
        className={`${headingClass} opacity-0`}
      >
        {primary}
      </h1>
      <h2
        ref={secondaryRef}
        data-splitting
        data-effect4
        className={`${headingClass} opacity-0 md:text-right`}
      >
        {secondary}
      </h2>
    </div>
  );
}
