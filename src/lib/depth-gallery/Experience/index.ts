import * as THREE from "three";
import type { PerspectiveCamera, Scene } from "three";
import { Gallery } from "@/lib/depth-gallery/Experience/Gallery";
import { Background } from "@/lib/depth-gallery/Experience/Background";
import { Label } from "@/lib/depth-gallery/Experience/Label";
import { TrailController } from "@/lib/depth-gallery/Experience/TrailController";
import type { PlaneBlendData } from "@/lib/depth-gallery/types";
import type { Scroll } from "@/lib/depth-gallery/Experience/Scroll";

export class Experience {
  readonly rootElement: HTMLElement;
  isInitialized = false;
  isDisposed = false;
  frameDarkPlaneCount = 0;
  isFrameTextDark: boolean | null = null;

  readonly gallery: Gallery;
  readonly label: Label;
  readonly background: Background;
  readonly trailController: TrailController;

  constructor(rootElement: HTMLElement = document.body) {
    this.rootElement = rootElement;
    this.gallery = new Gallery();
    this.label = new Label(this.gallery, this.rootElement);
    this.background = new Background();
    this.trailController = new TrailController({
      gallery: this.gallery,
    });
  }

  async init(scene: Scene, camera: PerspectiveCamera): Promise<void> {
    if (this.isInitialized) return;

    await this.gallery.init(scene);
    this.label.init();
    this.background.init();
    this.trailController.init(scene, camera);

    const initialPlaneBlendData = this.gallery.getPlaneBlendData(
      camera.position.z,
    );
    this.updateFrameTextTone(initialPlaneBlendData);

    this.isInitialized = true;
  }

  updateFrameTextTone(planeBlendData: PlaneBlendData | null): void {
    if (!planeBlendData) return;

    const nearestPlaneIndex =
      planeBlendData.blend >= 0.5
        ? planeBlendData.nextPlaneIndex
        : planeBlendData.currentPlaneIndex;
    const shouldUseDarkText = nearestPlaneIndex < this.frameDarkPlaneCount;

    if (this.isFrameTextDark === shouldUseDarkText) return;

    this.isFrameTextDark = shouldUseDarkText;
    this.rootElement.classList.toggle("frame-text-dark", shouldUseDarkText);
  }

  update(
    time: number,
    camera: PerspectiveCamera | null = null,
    scroll: Scroll | null = null,
  ): void {
    this.trailController.update(camera, scroll, time);

    this.gallery.update(camera, scroll);
    this.label.update(camera);

    if (camera) {
      const planeBlendData = this.gallery.getPlaneBlendData(camera.position.z);
      this.updateFrameTextTone(planeBlendData);

      const moodBlendData = this.gallery.getMoodBlendData(camera.position.z);
      if (moodBlendData) {
        this.background.setMoodBlend(moodBlendData);
      }

      const depthProgress = this.gallery.getDepthProgress(camera.position.z);
      const velocityMax = scroll?.velocityMax ?? 1;
      const velocityIntensity = THREE.MathUtils.clamp(
        Math.abs(scroll?.velocity ?? 0) / Math.max(velocityMax, 0.0001),
        0,
        1,
      );
      const blend = planeBlendData?.blend ?? 0;
      const distanceFromBlendCenter = Math.abs(blend - 0.5) * 2;
      const transitionStability = THREE.MathUtils.smoothstep(
        distanceFromBlendCenter,
        0.35,
        1,
      );
      const stabilizedVelocityIntensity =
        velocityIntensity * transitionStability;

      this.background.setMotionResponse({
        depthProgress,
        velocityIntensity: stabilizedVelocityIntensity,
      });
    }

    this.background.update(time);
  }

  dispose(): void {
    if (this.isDisposed) return;

    this.trailController.dispose();
    this.gallery.dispose();
    this.label.dispose();
    this.background.dispose();
    this.isDisposed = true;
  }
}
