"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

type PreloaderContextValue = {
  isComplete: boolean;
  setIsComplete: (value: boolean) => void;
  mainContentRef: RefObject<HTMLDivElement | null>;
};

const PreloaderContext = createContext<PreloaderContextValue | null>(null);

export function PreloaderProvider({ children }: { children: ReactNode }) {
  const [isComplete, setIsComplete] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  return (
    <PreloaderContext.Provider
      value={{ isComplete, setIsComplete, mainContentRef }}
    >
      {children}
    </PreloaderContext.Provider>
  );
}

export function usePreloader() {
  const context = useContext(PreloaderContext);

  if (!context) {
    throw new Error("usePreloader must be used within PreloaderProvider");
  }

  return context;
}
