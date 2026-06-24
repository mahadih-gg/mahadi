import * as THREE from "three";
import type { PerspectiveCamera } from "three";
import type { Gallery } from "@/lib/depth-gallery/Experience/Gallery";

export type ScrollDriveMode = "wheel" | "scroll";

/** Viewport heights per gallery plane for ScrollTrigger track length */
const SCROLL_TRACK_VH_PER_PLANE = 0.85;

export class Scroll {
  scrollTarget = 0;
  scrollCurrent = 0;
  scrollSmoothing = 0.08;
  scrollToWorldFactor = 0.01;
  wheelScrollSpeed = 1;
  touchScrollSpeed = 1.8;
  previousScrollCurrent = 0;
  invertScroll = false;
  rawVelocity = 0;
  velocity = 0;
  velocityDamping = 0.12;
  velocityMax = 1.5;
  velocityStopThreshold = 0.0001;
  useScrollBounds = true;
  firstPlaneViewOffset = 5;
  lastPlaneViewOffset = 5;
  minCameraZ = -Infinity;
  maxCameraZ = Infinity;
  cameraStartZ: number;
  private touchY = 0;
  private isActive = false;
  private isInitialized = false;
  private driveMode: ScrollDriveMode = "wheel";
  private normalizedProgress = 0;
  private eventsBound = false;

  private readonly onWheel: (event: WheelEvent) => void;
  private readonly onTouchStart: (event: TouchEvent) => void;
  private readonly onTouchMove: (event: TouchEvent) => void;

  constructor(
    private readonly camera: PerspectiveCamera,
    private readonly gallery: Gallery,
  ) {
    this.cameraStartZ = this.camera.position.z;
    this.onWheel = (event) => {
      if (this.driveMode !== "wheel" || !this.isActive) return;
      event.preventDefault()
      const normalizedWheelDelta = this.normalizeWheelDelta(event) * this.wheelScrollSpeed
      this.addScrollInput(normalizedWheelDelta)
    }
    this.onTouchStart = (event) => {
      this.touchY = event.touches[0]?.clientY ?? 0
    }
    this.onTouchMove = (event) => {
      if (this.driveMode !== "wheel" || !this.isActive) return;
      event.preventDefault()
      const currentTouchY = event.touches[0]?.clientY ?? this.touchY
      const deltaY = this.touchY - currentTouchY
      this.addScrollInput(deltaY * this.touchScrollSpeed)
      this.touchY = currentTouchY
    }
  }

  setDriveMode(mode: ScrollDriveMode): void {
    if (this.driveMode === mode) return;
    this.driveMode = mode;

    if (mode === "scroll") {
      this.unbindEvents();
      return;
    }

    this.bindEvents();
  }

  getDriveMode(): ScrollDriveMode {
    return this.driveMode;
  }

  setActive(isActive: boolean): void {
    this.isActive = isActive;
  }

  setNormalizedProgress(progress: number): void {
    this.normalizedProgress = THREE.MathUtils.clamp(progress, 0, 1);
    const minimumScroll = this.getMinimumScroll();
    const maximumScroll = this.getMaximumScroll();
    const target = THREE.MathUtils.lerp(
      minimumScroll,
      maximumScroll,
      this.normalizedProgress,
    );

    this.scrollTarget = target;

    if (this.driveMode === "scroll") {
      this.scrollCurrent = target;
    }
  }

  getNormalizedProgress(): number {
    return this.normalizedProgress;
  }

  isComplete(): boolean {
    return this.normalizedProgress >= 1 - 0.0001;
  }

  getScrollDistancePx(): number {
    const planeCount = Math.max(this.gallery.planes.length, 1);
    return planeCount * window.innerHeight * SCROLL_TRACK_VH_PER_PLANE;
  }

  private getMinimumScroll(): number {
    return this.scrollFromCameraZ(this.maxCameraZ);
  }

  private getMaximumScroll(): number {
    return this.scrollFromCameraZ(this.minCameraZ);
  }

  init(): void {
    if (this.isInitialized) return;

    this.updateCameraBounds()
    this.cameraStartZ = this.maxCameraZ
    this.camera.position.z = this.cameraStartZ
    this.scrollTarget = 0
    this.scrollCurrent = 0
    this.previousScrollCurrent = this.scrollCurrent
    this.rawVelocity = 0
    this.velocity = 0

    this.isInitialized = true
  }

  bindEvents(): void {
    if (this.eventsBound || this.driveMode === "scroll") return;

    window.addEventListener('wheel', this.onWheel, { passive: false })
    window.addEventListener('touchstart', this.onTouchStart, { passive: true })
    window.addEventListener('touchmove', this.onTouchMove, { passive: false })
    this.eventsBound = true;
  }

  unbindEvents(): void {
    if (!this.eventsBound) return;

    window.removeEventListener('wheel', this.onWheel)
    window.removeEventListener('touchstart', this.onTouchStart)
    window.removeEventListener('touchmove', this.onTouchMove)
    this.eventsBound = false;
  }

  updateCameraBounds(): void {
    const depthRange = this.gallery.getDepthRange()
    this.maxCameraZ = depthRange.nearestZ + this.firstPlaneViewOffset
    this.minCameraZ = depthRange.deepestZ + this.lastPlaneViewOffset

    if (this.minCameraZ > this.maxCameraZ) {
      this.minCameraZ = this.maxCameraZ
    }
  }

  cameraZFromScroll(scrollAmount: number): number {
    return this.cameraStartZ - scrollAmount * this.scrollToWorldFactor
  }

  scrollFromCameraZ(cameraZ: number): number {
    if (this.scrollToWorldFactor === 0) return 0
    return (this.cameraStartZ - cameraZ) / this.scrollToWorldFactor
  }

  normalizeWheelDelta(event: WheelEvent): number {
    if (event.deltaMode === 1) return event.deltaY * 16
    if (event.deltaMode === 2) return event.deltaY * window.innerHeight
    return event.deltaY
  }

  addScrollInput(deltaY: number): void {
    const scrollDirection = this.invertScroll ? -1 : 1
    this.scrollTarget += deltaY * scrollDirection
  }

  updateVelocity(): void {
    this.rawVelocity = this.scrollCurrent - this.previousScrollCurrent
    this.velocity = THREE.MathUtils.lerp(this.velocity, this.rawVelocity, this.velocityDamping)
    this.velocity = THREE.MathUtils.clamp(this.velocity, -this.velocityMax, this.velocityMax)

    if (Math.abs(this.velocity) < this.velocityStopThreshold) {
      this.velocity = 0
    }

    this.previousScrollCurrent = this.scrollCurrent
  }

  update(): void {
    this.updateCameraBounds()

    if (this.driveMode === "wheel") {
      this.scrollCurrent = THREE.MathUtils.lerp(
        this.scrollCurrent,
        this.scrollTarget,
        this.scrollSmoothing
      )
    }

    if (this.useScrollBounds) {
      const minimumScroll = this.scrollFromCameraZ(this.maxCameraZ)
      const maximumScroll = this.scrollFromCameraZ(this.minCameraZ)

      this.scrollTarget = THREE.MathUtils.clamp(this.scrollTarget, minimumScroll, maximumScroll)
      this.scrollCurrent = THREE.MathUtils.clamp(this.scrollCurrent, minimumScroll, maximumScroll)
    }

    this.updateVelocity()

    const nextCameraZ = this.cameraZFromScroll(this.scrollCurrent)
    if (this.useScrollBounds) {
      this.camera.position.z = THREE.MathUtils.clamp(nextCameraZ, this.minCameraZ, this.maxCameraZ)
      return
    }

    this.camera.position.z = nextCameraZ
  }

  dispose(): void {
    this.unbindEvents();
  }
}
