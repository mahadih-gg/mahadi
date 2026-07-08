"use client";

import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import type { ElementType } from "react";

gsap.registerPlugin(ScrollTrigger);

interface ScrollLetterRevealProps {
  children: string;
  className?: string;
  /** Tag the text renders as. Defaults to a paragraph. */
  as?: ElementType;
  /** Color letters sit at before they scroll into focus. */
  fromColor?: string;
  /** Color letters settle on once fully revealed. */
  toColor?: string;
  /** Accent flashed through mid-reveal — the "glow" the sweep leaves behind. */
  glowColor?: string;
  /** Viewport position where the scrub range begins. */
  start?: string;
  /** Viewport position where the scrub range ends. */
  end?: string;
}

/**
 * Splits text into word groups (keeping whitespace as plain text nodes) so
 * every visible character can be animated individually without ever
 * breaking a word across a line wrap.
 */
function splitIntoWords(text: string) {
  return text.split(/(\s+)/);
}

/**
 * Scroll-scrubbed reveal: characters lift out of a blurred, tilted-back
 * resting state, flash through an accent color as they cross the reading
 * line, then settle flat and fully lit. Distinct from a flat color fade —
 * the combination of a 3D tilt, blur-to-focus, and a color "glow" passing
 * through gives the sweep some depth and a sense of motion, while staying
 * driven 1:1 by scroll position (no autoplay, nothing to wait on).
 */
export function ScrollLetterReveal({
  children,
  className,
  as = "p",
  fromColor = "#6b7280",
  toColor = "currentColor",
  glowColor = "#58a6ff",
  start = "top 85%",
  end = "top 30%",
}: ScrollLetterRevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const words = useMemo(() => splitIntoWords(children), [children]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = container.querySelectorAll<HTMLSpanElement>("[data-char]");
    if (chars.length === 0) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      gsap.set(chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        color: toColor,
      });
      return;
    }

    let onRefresh: (() => void) | null = null;

    const ctx = gsap.context(() => {
      gsap.set(chars, {
        opacity: 0.16,
        y: 18,
        rotateX: 65,
        filter: "blur(6px)",
        color: fromColor,
      });

      const tween = gsap.to(chars, {
        ease: "none",
        stagger: 0.015,
        scrollTrigger: {
          trigger: container,
          start,
          end,
          scrub: 0.6,
        },
        keyframes: {
          "0%": {
            opacity: 0.16,
            y: 18,
            rotateX: 65,
            filter: "blur(6px)",
            color: fromColor,
          },
          "55%": {
            opacity: 1,
            y: -3,
            rotateX: 0,
            filter: "blur(0px)",
            color: glowColor,
            ease: "power2.out",
          },
          "100%": {
            y: 0,
            color: toColor,
            ease: "power1.inOut",
          },
        },
      } as gsap.TweenVars);

      // The page's preloader briefly scales the whole app down (see
      // Preloader.tsx) while this mounts, so the trigger's very first
      // measurement is taken at the wrong scale. GSAP's own global
      // `ScrollTrigger.refresh()` (fired once the preloader restores real
      // scale) doesn't reliably re-measure triggers built on percentage
      // keyframe tweens like this one — refreshing this specific instance
      // directly, once any refresh pass completes, does.
      const trigger = tween.scrollTrigger;
      if (trigger) {
        onRefresh = () => trigger.refresh();
        ScrollTrigger.addEventListener("refresh", onRefresh);
      }
    }, container);

    return () => {
      if (onRefresh) ScrollTrigger.removeEventListener("refresh", onRefresh);
      ctx.revert();
    };
  }, [children, fromColor, toColor, glowColor, start, end]);

  const Tag = as;

  return (
    <Tag ref={containerRef} className={cn(className)}>
      {words.map((word, wordIndex) =>
        /^\s+$/.test(word) ? (
          word
        ) : (
          <span
            key={wordIndex}
            className="inline-block whitespace-nowrap"
            style={{ perspective: "500px" }}
          >
            {word.split("").map((char, charIndex) => (
              <span
                key={charIndex}
                data-char
                className="inline-block will-change-[transform,filter,color]"
              >
                {char}
              </span>
            ))}
          </span>
        ),
      )}
    </Tag>
  );
}
