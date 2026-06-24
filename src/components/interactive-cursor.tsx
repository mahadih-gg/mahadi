"use client";

import { useInteractiveCursor } from "@/context/interactive-cursor-context";
import { useEffect, useRef } from "react";

const PARAMS = {
  pointsNumber: 30,
  widthFactor: 0.3,
  spring: 0.8,
  friction: 0.3,
} as const;

export default function InteractiveCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isCursorDisabled } = useInteractiveCursor();

  useEffect(() => {
    if (isCursorDisabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let mouseMoved = false;
    let rafId = 0;

    const pointer = {
      x: 0.5 * window.innerWidth,
      y: 0.5 * window.innerHeight,
    };

    const trail = Array.from({ length: PARAMS.pointsNumber }, () => ({
      x: pointer.x,
      y: pointer.y,
      dx: 0,
      dy: 0,
    }));

    const updateMousePosition = (x: number, y: number) => {
      pointer.x = x;
      pointer.y = y;
    };

    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const syncTrailToPointer = () => {
      for (const p of trail) {
        p.x = pointer.x;
        p.y = pointer.y;
        p.dx = 0;
        p.dy = 0;
      }
    };

    const markPointerActive = () => {
      if (mouseMoved) return;
      mouseMoved = true;
      syncTrailToPointer();
    };

    const onClick = (e: MouseEvent) => {
      updateMousePosition(e.clientX, e.clientY);
      markPointerActive();
    };

    const onMouseMove = (e: MouseEvent) => {
      updateMousePosition(e.clientX, e.clientY);
      markPointerActive();
    };
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.targetTouches[0];
      if (!touch) return;
      updateMousePosition(touch.clientX, touch.clientY);
      markPointerActive();
    };

    const update = () => {
      if (!mouseMoved) {
        rafId = requestAnimationFrame(update);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = getComputedStyle(document.body).color;
      ctx.lineCap = "round";

      trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? 0.4 * PARAMS.spring : PARAMS.spring;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= PARAMS.friction;
        p.dy *= PARAMS.friction;
        p.x += p.dx;
        p.y += p.dy;
      });

      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);

      for (let i = 1; i < trail.length - 1; i++) {
        const xc = 0.5 * (trail[i].x + trail[i + 1].x);
        const yc = 0.5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = PARAMS.widthFactor * (PARAMS.pointsNumber - i);
        ctx.stroke();
      }
      ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
      ctx.stroke();

      rafId = requestAnimationFrame(update);
    };

    setupCanvas();
    rafId = requestAnimationFrame(update);

    window.addEventListener("resize", setupCanvas);
    window.addEventListener("click", onClick);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    document.body.classList.add("interactive-cursor-active");

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", setupCanvas);
      window.removeEventListener("click", onClick);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      document.body.classList.remove("interactive-cursor-active");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [isCursorDisabled]);

  return (
    <canvas
      ref={canvasRef}
      className="interactive-cursor-canvas"
      aria-hidden
      hidden={isCursorDisabled}
    />
  );
}
