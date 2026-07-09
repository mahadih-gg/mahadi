"use client";

import { initEffect4 } from "@/lib/scroll-animations/effect4";
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

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      void Promise.all(
        headings.map((heading) => splitElement(heading, "chars")),
      ).then(() => {
        if (wrapperRef.current) {
          gsap.set(wrapperRef.current, { opacity: 1 });
        }

        headings.forEach((heading, index) => {
          initEffect4(heading, { delay: delay + index * 0.1 });
        });
      });
    },
    { scope: wrapperRef, dependencies: [ready, delay] },
  );

  return (
    <div
      ref={wrapperRef}
      className={`flex flex-wrap items-baseline justify-center gap-x-[1em] md:contents ${ready ? "" : "opacity-0"} ${className}`}
    >
      <h1
        ref={primaryRef}
        data-splitting
        data-effect4
        className={headingClass}
      >
        {primary}
      </h1>
      <h2
        ref={secondaryRef}
        data-splitting
        data-effect4
        className={`${headingClass} md:text-right`}
      >
        {secondary}
      </h2>
    </div>
  );
}
