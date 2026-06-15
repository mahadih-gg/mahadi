"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type InteractiveCursorContextValue = {
  /** True while the experience depth-gallery section is intersecting the viewport */
  isExperienceInView: boolean;
  /** When true, the trail cursor should not run or render */
  isCursorDisabled: boolean;
  setExperienceInView: (inView: boolean) => void;
};

const InteractiveCursorContext =
  createContext<InteractiveCursorContextValue | null>(null);

export function InteractiveCursorProvider({ children }: { children: ReactNode }) {
  const [isExperienceInView, setIsExperienceInView] = useState(false);

  const setExperienceInView = useCallback((inView: boolean) => {
    setIsExperienceInView(inView);
  }, []);

  const value = useMemo(
    () => ({
      isExperienceInView,
      isCursorDisabled: isExperienceInView,
      setExperienceInView,
    }),
    [isExperienceInView, setExperienceInView],
  );

  return (
    <InteractiveCursorContext.Provider value={value}>
      {children}
    </InteractiveCursorContext.Provider>
  );
}

export function useInteractiveCursor(): InteractiveCursorContextValue {
  const context = useContext(InteractiveCursorContext);
  if (!context) {
    throw new Error(
      "useInteractiveCursor must be used within InteractiveCursorProvider",
    );
  }
  return context;
}
