"use client";

import { initEffect27 } from "@/lib/scroll-animations/effect27";
import { splitElement } from "@/lib/scroll-animations/splitting";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  children: string;
  className?: string;
};

export function AnimatedFooterText({ children, className = "" }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const title = titleRef.current;
      const section = sectionRef.current;
      if (!title || !section) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReduced) return;

      void splitElement(title, "words").then(() => {
        initEffect27(title, section);
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Closing statement"
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-24"
    >
      <h2
        ref={titleRef}
        data-splitting
        data-effect27
        className={`whitespace-pre-line text-center font-secondary text-[clamp(1.5rem,6vw,4.5rem)] font-semibold uppercase leading-[0.9] tracking-tight text-foreground ${className}`}
      >
        <span>{children}</span>
      </h2>
    </section>
  );
}
