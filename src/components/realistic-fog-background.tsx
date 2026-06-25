"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type RealisticFogBackgroundProps = {
  className?: string;
};

const FOG_SCALE = 0.3;
const BASE = { r: 13, g: 17, b: 23 };

function fbm(x: number, y: number, t: number): number {
  const n1 =
    Math.sin(x * 0.004 + t * 0.35) * Math.cos(y * 0.003 - t * 0.28);
  const n2 =
    Math.sin(x * 0.009 - t * 0.22 + 2.1) * Math.sin(y * 0.006 + t * 0.18);
  const n3 = Math.cos(x * 0.0025 + y * 0.0035 + t * 0.12);
  const n4 = Math.sin(x * 0.015 + y * 0.012 - t * 0.08) * 0.35;
  return (n1 + n2 * 0.65 + n3 * 0.45 + n4) * 0.5 + 0.5;
}

export function RealisticFogBackground({ className }: RealisticFogBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d", { alpha: true });
    if (!offCtx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let animationId = 0;
    let time = 0;
    let sw = 0;
    let sh = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sw = Math.max(1, Math.floor(rect.width * FOG_SCALE));
      sh = Math.max(1, Math.floor(rect.height * FOG_SCALE));
      offscreen.width = sw;
      offscreen.height = sh;
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();

      const imageData = offCtx.createImageData(sw, sh);
      const data = imageData.data;

      for (let y = 0; y < sh; y++) {
        const v = y / sh;
        const bottomHeavier = 0.88 + (1 - v) * 0.18;

        for (let x = 0; x < sw; x++) {
          const n = fbm(x, y, time);
          const wisp = fbm(x * 1.6 + 40, y * 1.4 - 20, time * 0.7);
          const density = bottomHeavier * (0.52 + n * 0.32 + wisp * 0.16);
          const mist = 0.55 + n * 0.35;

          const idx = (y * sw + x) * 4;
          data[idx] = BASE.r + mist * 38;
          data[idx + 1] = BASE.g + mist * 42;
          data[idx + 2] = BASE.b + mist * 48;
          data[idx + 3] = Math.min(255, density * 255 * 0.96);
        }
      }

      offCtx.putImageData(imageData, 0, 0);

      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(offscreen, 0, 0, rect.width, rect.height);

      if (!reducedMotion) {
        time += 0.014;
        animationId = requestAnimationFrame(draw);
      }
    };

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
      aria-hidden
    />
  );
}
