"use client";

import type { ReactNode } from "react";
import { InteractiveCursorProvider } from "@/context/interactive-cursor-context";
import InteractiveCursor from "@/components/interactive-cursor";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <InteractiveCursorProvider>
      <InteractiveCursor />
      {children}
    </InteractiveCursorProvider>
  );
}
