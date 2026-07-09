"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type ContactTilesBackgroundProps = {
  className?: string;
};

const TILE_SIZE = 40;
const TILE_SIZE_LG = 48;
const LG_BREAKPOINT = 1024;

function getTileSize(width: number): number {
  return width >= LG_BREAKPOINT ? TILE_SIZE_LG : TILE_SIZE;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rotateTile(tile: HTMLDivElement, random = true) {
  const direction = random ? (Math.random() < 0.5 ? 1 : -1) : 1;
  const currentRotation = Number.parseInt(
    tile.getAttribute("data-rotation") ?? "0",
    10,
  );
  const newRotation = currentRotation + 90 * direction;
  tile.style.transform = `rotate(${newRotation}deg)`;
  tile.setAttribute("data-rotation", String(newRotation));
}

export function ContactTilesBackground({
  className,
}: ContactTilesBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    const grid = gridRef.current;
    if (!root || !grid) return;

    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const clearIntervals = () => {
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];
    };

    const startIntervals = () => {
      if (reducedMotionRef.current) return;

      clearIntervals();
      grid.querySelectorAll<HTMLDivElement>(".contact-tile").forEach((tile) => {
        const intervalId = setInterval(
          () => rotateTile(tile),
          getRandomInt(1000, 42000),
        );
        intervalsRef.current.push(intervalId);
      });
    };

    const buildGrid = () => {
      const { width, height } = root.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;

      const tileSize = getTileSize(width);
      const cols = Math.floor(width / (tileSize * 0.5)) + 2;
      const rows = Math.floor(height / (tileSize * 0.8)) + 2;

      grid.style.setProperty("--tile-size", `${tileSize}px`);
      grid.replaceChildren();

      for (let row = 0; row < rows; row++) {
        const rowEl = document.createElement("div");
        rowEl.className = "contact-tiles-row";

        for (let col = 0; col < cols; col++) {
          const tile = document.createElement("div");
          tile.className = "contact-tile";
          tile.setAttribute("data-x", String(col));
          tile.setAttribute("data-y", String(row));

          if ((col % 2 === 0 && row % 2 === 0) || (col % 2 === 1 && row % 2 === 1)) {
            tile.style.rotate = "90deg";
            tile.setAttribute("data-rotation", "90");
          } else {
            tile.setAttribute("data-rotation", "0");
          }

          if (!reducedMotionRef.current) {
            tile.addEventListener("mouseenter", () => rotateTile(tile));
          }

          rowEl.appendChild(tile);
        }

        grid.appendChild(rowEl);
      }

      startIntervals();
    };

    const handleMouseEnter = () => clearIntervals();
    const handleMouseLeave = () => startIntervals();

    buildGrid();

    const resizeObserver = new ResizeObserver(() => {
      clearIntervals();
      buildGrid();
    });

    resizeObserver.observe(root);
    root.addEventListener("mouseenter", handleMouseEnter);
    root.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearIntervals();
      resizeObserver.disconnect();
      root.removeEventListener("mouseenter", handleMouseEnter);
      root.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        "contact-tiles pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      <div
        ref={gridRef}
        className="contact-tiles-grid absolute inset-0 flex flex-col items-center justify-center"
      />
    </div>
  );
}
