"use client";

import type { UnderwaterNavigationInstance } from "@/lib/underwater-nav/types";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";



const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;

function loadScript(src: string): Promise<void> {

  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

export default function UnderwaterNav({ isScrolled }: { isScrolled: boolean }) {

  const navRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openMenu = useCallback(() => {
    setIsOpen(true);
    window.dispatchEvent(new CustomEvent("navOpen"));
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("navClose"));
  }, []);

  useEffect(() => {
    if (!mounted || !navRef.current) return;
    const navEl = navRef.current;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) return;

    let navInstance: UnderwaterNavigationInstance | null = null;

    let cancelled = false;

    async function setup() {

      try {
        await loadScript("/vendor/pixi.min.js");
        if (cancelled) return;

        const { initUnderwaterNavigation } = await import(
          "@/lib/underwater-nav/runtime"
        );

        if (cancelled) return;

        navInstance = await initUnderwaterNavigation(navEl);
      } catch {
        // Fallback links remain usable without WebGL
      }

    }

    setup();

    return () => {

      cancelled = true;
      navInstance?.deInit();
      if (navInstance?.app) {
        navInstance.app.destroy(true, {
          children: true,
          texture: true,
          baseTexture: true,
        });
      }
    };
  }, [mounted]);

  const navOverlay = (
    <nav
      ref={navRef}
      id="main-nav"
      aria-label="Main navigation"
      aria-hidden={!isOpen}
      className={cn(
        "fixed inset-0 z-[10001] flex h-dvh w-screen items-center justify-center bg-background transition-opacity duration-300",
        isOpen
          ? "pointer-events-auto opacity-100 [&_*]:pointer-events-auto"
          : "pointer-events-none opacity-0 [&_*]:pointer-events-none",
      )}
    >
      <ul className="m-0 list-none p-0 text-center min-[40.063em]:sr-only">
        {NAV_LINKS.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              onClick={closeMenu}
              className="font-secondary text-[clamp(1.75rem,5vw,3.5rem)] text-primary no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="nav-toggle fixed top-8 left-1/2 z-[10003] -translate-x-1/2 cursor-pointer border-none bg-transparent p-0 text-primary"
        aria-label="Close menu"
        onClick={closeMenu}
      >
        <svg aria-hidden width={24} height={22} viewBox="0 0 24 22">
          <path
            fill="currentColor"
            d="M11 9.586L20.192.393l1.415 1.415L12.414 11l9.193 9.192-1.415 1.415L11 12.414l-9.192 9.193-1.415-1.415L9.586 11 .393 1.808 1.808.393 11 9.586z"
          />
        </svg>
      </button>
    </nav>
  );

  return (

    <>
      <button
        type="button"
        className={cn("nav-toggle absolute left-1/2 -translate-x-1/2 z-[1] inline-flex cursor-pointer border-none bg-transparent p-0 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary transition-all duration-500 size-12 rounded-full flex items-center justify-center", isScrolled && "bg-background/70 backdrop-blur-md")}
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls="main-nav"
        onClick={openMenu}
      >
        <span className="flex h-5 w-7 flex-col justify-between" aria-hidden>
          <span className="h-0.5 w-full bg-foreground group-hover:bg-primary group-hover:translate-x-2 transition-all duration-500" />
          <span className="mx-auto h-0.5 w-5 bg-foreground group-hover:bg-primary group-hover:w-full group-hover:translate-x-1 transition-all duration-500" />
          <span className="h-0.5 w-full bg-foreground group-hover:bg-primary transition-all duration-500" />
        </span>
      </button>

      {mounted ? createPortal(navOverlay, document.body) : null}
    </>
  );
}