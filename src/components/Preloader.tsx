"use client";

import PreloaderLogo from "@/components/svg/PreloaderLogo";
import { usePreloader } from "@/context/preloader-context";
import {
  easeExpoInOut,
  easePower2InOut,
  easePower2Out,
  easePower3InOut,
} from "@/lib/motion-easing";
import { useAnimate, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [visible, setVisible] = useState(true);
  const { setIsComplete, mainContentRef } = usePreloader();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setIsComplete(true);
      setVisible(false);
      return;
    }

    let cancelled = false;

    async function runSequence() {
      const overlay = scope.current;
      const mainContent = mainContentRef.current;

      if (!overlay) {
        return;
      }

      if (mainContent) {
        mainContent.style.transformOrigin = "center top";
        await animate(mainContent, { scale: 0.96 }, { duration: 0 });
      }

      await Promise.all([
        animate(
          ".preloader-stroke",
          { pathLength: 1 },
          { duration: 1.2, ease: easePower3InOut },
        ),
        animate(
          ".preloader-fill",
          { opacity: 1 },
          { duration: 0.4, ease: easePower2Out, delay: 1.05 },
        ),
        animate(
          ".preloader-logo",
          { scale: [1, 1.06, 1] },
          { duration: 0.7, ease: easePower2InOut, delay: 1.25 },
        ),
      ]);

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (cancelled) {
        return;
      }

      setIsComplete(true);

      const exitAnimations = [
        animate(overlay, { y: "100%" }, { duration: 1, ease: easeExpoInOut }),
      ];

      if (mainContent) {
        exitAnimations.push(
          animate(
            mainContent,
            { scale: 1 },
            { duration: 1, ease: easeExpoInOut },
          ),
        );
      }

      await Promise.all(exitAnimations);

      if (cancelled) {
        return;
      }

      if (mainContent) {
        mainContent.style.transform = "";
        mainContent.style.transformOrigin = "";
      }

      setVisible(false);
    }

    runSequence();

    return () => {
      cancelled = true;
    };
  }, [animate, mainContentRef, reduceMotion, scope, setIsComplete]);

  if (!visible) {
    return null;
  }

  return (
    <div
      ref={scope}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
      role="status"
      aria-live="polite"
      aria-label="Loading site"
    >
      <div className="preloader-logo">
        <PreloaderLogo />
      </div>
    </div>
  );
}
