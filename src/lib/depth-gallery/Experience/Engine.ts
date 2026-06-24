import * as THREE from "three";
import type { WebGLRenderer } from "three";
import { Experience } from "@/lib/depth-gallery/Experience/index";
import { Scroll, type ScrollDriveMode } from "@/lib/depth-gallery/Experience/Scroll";

export class Engine {
  private readonly canvas: HTMLCanvasElement;
  private readonly rootElement: HTMLElement;
  readonly experience: Experience;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly scroll: Scroll;
  readonly renderer: WebGLRenderer;

  isInitialized = false;
  isRunning = false;
  private animationFrameRequestId: number | null = null;
  private preloadedTextures = new Map<string, THREE.Texture>();

  private readonly onResize: () => void;
  private readonly animate: () => void;

  constructor(
    canvas: HTMLCanvasElement,
    experience: Experience,
    rootElement: HTMLElement = document.body,
  ) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Engine requires a valid canvas element");
    }

    this.canvas = canvas;
    this.rootElement = rootElement;
    this.experience = experience;
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 0, 6);

    this.scroll = new Scroll(this.camera, this.experience.gallery);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.autoClear = false;

    this.onResize = () => {
      this.resize();
    };

    this.animate = this.update.bind(this);
  }

  async init(): Promise<void> {
    if (this.isInitialized) return;

    this.rootElement.classList.add("loading");

    try {
      this.preloadedTextures = await this.preloadTextures();
      this.experience.gallery.setPreloadedTextures(this.preloadedTextures);

      await this.experience.init(this.scene, this.camera);
      this.scroll.init();

      this.resize();
      window.addEventListener("resize", this.onResize);
      this.scroll.bindEvents();

      this.isInitialized = true;
      this.start();
    } finally {
      this.rootElement.classList.remove("loading");
    }
  }

  start(): void {
    if (!this.isInitialized || this.isRunning) return;
    this.isRunning = true;
    this.update();
  }

  resize(): void {
    const width = this.canvas.clientWidth || window.innerWidth || 1;
    const height = this.canvas.clientHeight || window.innerHeight || 1;
    if (width <= 0 || height <= 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.experience.gallery.updatePlaneScale();
    this.experience.gallery.layoutPlanes();
    this.experience.label.resize(width, height);
  }

  private async preloadTextures(): Promise<Map<string, THREE.Texture>> {
    const textureSources = this.experience.gallery.getTextureSources();
    if (!textureSources.length) return new Map();

    const textureLoader = new THREE.TextureLoader();
    const loadedTextures = new Map<string, THREE.Texture>();

    await Promise.all(
      textureSources.map(async (textureSource) => {
        try {
          const texture = await textureLoader.loadAsync(textureSource);
          texture.colorSpace = THREE.SRGBColorSpace;
          loadedTextures.set(textureSource, texture);
        } catch (error) {
          console.warn(`Texture failed to load: ${textureSource}`, error);
        }
      }),
    );

    return loadedTextures;
  }

  private update(): void {
    if (!this.isRunning) return;

    this.animationFrameRequestId = requestAnimationFrame(this.animate);

    const time = performance.now();

    this.scroll.update();
    this.experience.update(time, this.camera, this.scroll);

    this.renderer.clear(true, true, true);
    this.experience.background.render(this.renderer);
    this.renderer.clearDepth();
    this.renderer.render(this.scene, this.camera);
    this.experience.label.render();
  }

  setScrollActive(isActive: boolean): void {
    this.scroll.setActive(isActive);
  }

  setScrollDriveMode(mode: ScrollDriveMode): void {
    this.scroll.setDriveMode(mode);
  }

  setScrollProgress(progress: number): void {
    this.scroll.setNormalizedProgress(progress);
  }

  getScrollTrackDistancePx(): number {
    return this.scroll.getScrollDistancePx();
  }

  isScrollComplete(): boolean {
    return this.scroll.isComplete();
  }

  getRestingBackgroundColor(): string {
    return this.getPlaneBackgroundColor("last");
  }

  getInitialBackgroundColor(): string {
    return this.getPlaneBackgroundColor("first");
  }

  primeAtStart(): void {
    this.setScrollProgress(0);
    this.scroll.update();

    const moodBlend = this.experience.gallery.getMoodBlendData(
      this.camera.position.z,
    );
    if (moodBlend) {
      this.experience.background.setMoodBlend(moodBlend);
    }

    this.experience.update(performance.now(), this.camera, this.scroll);
  }

  private getPlaneBackgroundColor(which: "first" | "last"): string {
    const planes = this.experience.gallery.planes;
    if (!planes.length) return "#002253";

    const plane =
      which === "first" ? planes[0] : planes[planes.length - 1];
    return String(plane?.userData.backgroundColor ?? "#002253");
  }

  dispose(): void {
    this.isRunning = false;

    if (this.animationFrameRequestId !== null) {
      cancelAnimationFrame(this.animationFrameRequestId);
      this.animationFrameRequestId = null;
    }

    window.removeEventListener("resize", this.onResize);
    this.scroll.dispose();

    this.preloadedTextures.forEach((texture) => {
      texture.dispose();
    });
    this.preloadedTextures.clear();
    this.experience.dispose();
  }
}
