export type { UnderwaterNavigationInstance } from "./types";

export function bindNavToggle(navToggle: HTMLInputElement): void;

export function initUnderwaterNavigation(
  navElement: HTMLElement,
  navToggle: HTMLInputElement,
): Promise<import("./types").UnderwaterNavigationInstance>;
