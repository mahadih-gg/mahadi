"use client";

import Preloader from "@/components/Preloader";
import { InteractiveCursorProvider } from "@/context/interactive-cursor-context";
import { PreloaderProvider, usePreloader } from "@/context/preloader-context";
import type { ReactNode } from "react";

function AppContent({ children }: { children: ReactNode }) {
  const { mainContentRef } = usePreloader();

  return (
    <>
      <Preloader />
      <div ref={mainContentRef}>
        {children}
      </div>
    </>
  );
}

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <PreloaderProvider>
      <InteractiveCursorProvider>
        <AppContent>{children}</AppContent>
      </InteractiveCursorProvider>
    </PreloaderProvider>
  );
}
