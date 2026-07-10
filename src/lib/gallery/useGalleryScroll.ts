"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useLayoutEffect, useRef, useState } from "react";
import { frameStateFor, headingStateFor } from "./frameStates";
import {
  getCameraOffsetForProject,
  getOverviewStageScale,
  getProjectFrameBox,
} from "./layout";

gsap.registerPlugin(ScrollTrigger);

/** How far into a scroll segment (0-1) the camera must travel before the
 * focused project's text panel switches — keeps the image arriving first. */
const TEXT_SWITCH_POINT = 0.68;

type Viewport = { width: number; height: number };

type UseGalleryScrollOptions = {
  sectionRef: RefObject<HTMLElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  frameRefs: RefObject<(HTMLDivElement | null)[]>;
  /** Pinned section heading, kept outside the stage so the camera pan
   * never translates it — only its depth (opacity/blur/scale) animates. */
  headingRef?: RefObject<HTMLDivElement | null>;
  projectCount: number;
  viewport: Viewport;
  enabled: boolean;
};

export type GalleryScrollState = {
  /** -1 means the overview (whole-gallery) state, no project focused yet. */
  activeIndex: number;
};

export function useGalleryScroll({
  sectionRef,
  stageRef,
  frameRefs,
  headingRef,
  projectCount,
  viewport,
  enabled,
}: UseGalleryScrollOptions): GalleryScrollState {
  const [activeIndex, setActiveIndex] = useState(-1);
  const activeIndexRef = useRef(-1);

  useLayoutEffect(() => {
    if (!enabled) return;

    const section = sectionRef.current;
    const stage = stageRef.current;
    const frames = frameRefs.current;

    if (!section || !stage || !frames || projectCount === 0) return;
    if (viewport.width === 0 || viewport.height === 0) return;

    const overviewScale = getOverviewStageScale(
      viewport.width,
      viewport.height,
      projectCount,
    );

    const ctx = gsap.context(() => {
      gsap.set(stage, { x: 0, y: 0, scale: overviewScale });
      frames.forEach((frame, index) => {
        if (!frame) return;
        const box = getProjectFrameBox(index, viewport.width, viewport.height);
        gsap.set(frame, {
          ...frameStateFor("overview"),
          rotation: box.rotate,
        });
      });

      const heading = headingRef?.current ?? null;
      if (heading) {
        gsap.set(heading, headingStateFor("default"));
      }

      const tl = gsap.timeline({ paused: true });

      for (let i = 0; i < projectCount; i++) {
        const segmentStart = i;
        const camera = getCameraOffsetForProject(
          i,
          viewport.width,
          viewport.height,
        );

        tl.to(
          stage,
          { x: camera.x, y: camera.y, scale: 1, duration: 1, ease: "power2.inOut" },
          segmentStart,
        );

        if (heading) {
          tl.to(
            heading,
            { ...headingStateFor("blurred"), duration: 1, ease: "power2.inOut" },
            segmentStart,
          );
        }

        for (let j = 0; j < projectCount; j++) {
          const frame = frames[j];
          if (!frame) continue;

          const state =
            j === i ? "active" : Math.abs(j - i) === 1 ? "near" : "far";
          const box = getProjectFrameBox(j, viewport.width, viewport.height);

          tl.to(
            frame,
            {
              ...frameStateFor(state),
              rotation: j === i ? 0 : box.rotate,
              duration: 1,
              ease: "power2.inOut",
            },
            segmentStart,
          );
        }
      }

      // Closing segment: after the last project, glide the camera back out
      // to the exact overview framing the section opened with — so scrolling
      // all the way through bookends back to "first view" before handing off
      // to the next section, and scrolling back up from below returns here.
      const closingSegmentStart = projectCount;
      tl.to(
        stage,
        {
          x: 0,
          y: 0,
          scale: overviewScale,
          duration: 1,
          ease: "power2.inOut",
        },
        closingSegmentStart,
      );
      if (heading) {
        tl.to(
          heading,
          { ...headingStateFor("default"), duration: 1, ease: "power2.inOut" },
          closingSegmentStart,
        );
      }
      frames.forEach((frame, index) => {
        if (!frame) return;
        const box = getProjectFrameBox(index, viewport.width, viewport.height);
        tl.to(
          frame,
          {
            ...frameStateFor("overview"),
            rotation: box.rotate,
            duration: 1,
            ease: "power2.inOut",
          },
          closingSegmentStart,
        );
      });

      const totalSegments = projectCount + 1;

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${totalSegments * window.innerHeight}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tl,
        onUpdate: (self) => {
          const raw = self.progress * totalSegments;
          let index = Math.floor(raw + (1 - TEXT_SWITCH_POINT)) - 1;
          index =
            index >= projectCount
              ? -1
              : Math.max(-1, Math.min(projectCount - 1, index));

          if (index !== activeIndexRef.current) {
            activeIndexRef.current = index;
            setActiveIndex(index);
          }
        },
      });

      return () => {
        trigger.kill();
      };
    }, section);

    return () => {
      activeIndexRef.current = -1;
      setActiveIndex(-1);
      ctx.revert();
    };
  }, [
    enabled,
    sectionRef,
    stageRef,
    frameRefs,
    projectCount,
    viewport.width,
    viewport.height,
  ]);

  return { activeIndex };
}
