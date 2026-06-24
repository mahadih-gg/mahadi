"use client";

import { InteractiveCursorProvider } from "@/context/interactive-cursor-context";
import type { ReactNode } from "react";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <InteractiveCursorProvider>
        {/* <InteractiveCursor /> */}
        {children}
      </InteractiveCursorProvider>
    </>
  );
}
