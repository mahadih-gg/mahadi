"use client";

import { useEffect, useRef } from "react";
import type { UnderwaterNavigationInstance } from "@/lib/underwater-nav/types";

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

export default function UnderwaterNav() {
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!navRef.current || !toggleRef.current) return;
    const navEl = navRef.current;
    const toggleEl = toggleRef.current;

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

        navInstance = await initUnderwaterNavigation(navEl, toggleEl);
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
  }, []);

  return (
    <div className="underwater-nav-frame">
      <label
        className="underwater-nav-open nav-toggle"
        htmlFor="main-nav-toggle"
        tabIndex={0}
        aria-label="Open menu"
      >
        <svg aria-hidden width={28} height={20} viewBox="0 0 28 20">
          <rect x="0" y="2" width="28" height="2" fill="currentColor" />
          <rect x="0" y="10" width="24" height="2" fill="currentColor" />
          <rect x="0" y="18" width="28" height="2" fill="currentColor" />
        </svg>
      </label>

      <input
        ref={toggleRef}
        type="checkbox"
        id="main-nav-toggle"
        className="underwater-nav-toggle-input"
      />

      <nav ref={navRef} className="main-nav" aria-label="Main navigation">
        <ul className="main-nav__fallback">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
        <label
          className="main-nav__close nav-toggle"
          htmlFor="main-nav-toggle"
          tabIndex={0}
          aria-label="Close menu"
        >
          <svg aria-hidden width={24} height={22} viewBox="0 0 24 22">
            <path
              fill="currentColor"
              d="M11 9.586L20.192.393l1.415 1.415L12.414 11l9.193 9.192-1.415 1.415L11 12.414l-9.192 9.193-1.415-1.415L9.586 11 .393 1.808 1.808.393 11 9.586z"
            />
          </svg>
        </label>
      </nav>
    </div>
  );
}
