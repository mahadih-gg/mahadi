"use client";

import { initEffect2 } from "@/lib/scroll-animations/effect2";
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

export function AnimatedSectionHeader({
  as: Tag = "h2",
  className = "",
  children,
}: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      void splitElement(el, "chars").then(() => {
        initEffect2(el);
      });
    },
    { scope: ref },
  );

  return createElement(
    Tag,
    {
      ref,
      "data-splitting": true,
      "data-effect2": true,
      className: cn("font-secondary", className),
    },
    children,
  );
}
