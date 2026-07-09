"use client";

import { initEffect28 } from "@/lib/scroll-animations/effect28";
import { splitElement } from "@/lib/scroll-animations/splitting";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createElement, useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = {
  as?: HeadingTag;
  className?: string;
  children: ReactNode;
};

export function AnimatedHeading({
  as: Tag = "h2",
  className = "",
  children,
}: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReduced) return;

      void splitElement(el, "chars").then(() => {
        initEffect28(el);
      });
    },
    { scope: ref },
  );

  return createElement(
    Tag,
    {
      ref,
      "data-splitting": true,
      "data-effect28": true,
      className: cn("font-secondary", className),
    },
    children,
  );
}
