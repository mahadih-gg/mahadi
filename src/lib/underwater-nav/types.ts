export interface UnderwaterNavigationInstance {
  deInit(): void;
  app?: {
    destroy(removeView?: boolean, options?: object): void;
  };
}
