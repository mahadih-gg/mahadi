"use client";

import { initEffect27 } from "@/lib/scroll-animations/effect27";
import { splitElement } from "@/lib/scroll-animations/splitting";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  children: string;
  className?: string;
};

/**
 * Codrops Effect 27 — pinned section, words fly in from deep Z with random
 * offsets/rotations. Identity sits below the statement in the lower area.
 */
export function AnimatedFooterText({ children, className = "" }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const title = titleRef.current;
      if (!title) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReduced) return;

      let cancelled = false;
      let tween: gsap.core.Tween | undefined;
      let identityTween: gsap.core.Tween | undefined;

      void splitElement(title, "words").then(() => {
        if (cancelled || !title.isConnected) return;
        tween = initEffect27(title);

        const identity = identityRef.current;
        if (identity) {
          identityTween = gsap.fromTo(
            identity,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: title,
                start: "center center",
                end: "+=300%",
                scrub: true,
              },
            },
          );
        }

        ScrollTrigger.refresh();
      });

      return () => {
        cancelled = true;
        tween?.scrollTrigger?.kill();
        tween?.kill();
        identityTween?.scrollTrigger?.kill();
        identityTween?.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <div
      ref={sectionRef}
      className={cn("content content--effect27", className)}
      aria-label="Closing statement"
    >
      <h2
        ref={titleRef}
        className="content__title"
        data-splitting
        data-effect27
      >
        <span className="font-upper font-19 font-medium fx27-text">
          {children}
        </span>
      </h2>

      <div
        ref={identityRef}
        className="content__identity flex flex-col items-center leading-tight"
      >
        <span className="font-secondary text-lg font-semibold tracking-tight text-foreground md:text-xl">
          Mahadi Hasan
        </span>
        <span className="mt-1 text-xs tracking-[0.18em] text-muted-foreground uppercase">
          Front-end engineer
        </span>
      </div>
    </div>
  );
}
