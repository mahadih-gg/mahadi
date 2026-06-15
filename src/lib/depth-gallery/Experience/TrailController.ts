import * as THREE from "three";
import type { PerspectiveCamera, Scene } from "three";
import { Trail } from "@/lib/depth-gallery/Experience/Trail";
import { TrailHeadParticles } from "@/lib/depth-gallery/Experience/TrailHeadParticles";
import type { Gallery } from "@/lib/depth-gallery/Experience/Gallery";
import type { Scroll } from "@/lib/depth-gallery/Experience/Scroll";

const FULL_CIRCLE_RADIANS = Math.PI * 2 // 360 degrees in radians.

type TrailControllerOptions = {
  gallery: Gallery;
};

type TrailConfiguration = {
  isEnabled: boolean;
  pathSettings: {
    startXPosition: number;
    startYPosition: number;
    horizontalWidth: number;
    horizontalCycles: number;
    verticalAmplitude: number;
    verticalCycles: number;
    distanceAheadOfCamera: number;
    baseDepthOffset: number;
    depthSpan: number;
    progressDepthOffset: number;
  };
  responsiveSettings: {
    mobileBreakpoint: number;
    mobileWidthScale: number;
    mobileStartXOffset: number;
  };
  pointSettings: {
    minimumPointCount: number;
    maximumPointCount: number;
    reverseLengthScale: number;
    initialSeedPointCount: number;
    initialSeedStepZ: number;
    trimPerFrameForward: number;
    trimPerFrameReverse: number;
  };
  opacitySettings: {
    baseOpacity: number;
    idleOpacityAtStart: number;
    idleProgressThreshold: number;
    startVisibilityBias: number;
    edgeFadeStart: number;
    edgeFadeEnd: number;
    opacitySmoothing: number;
  };
  visualSettings: {
    trailColor: string;
    glowColor: string;
    glowIntensity: number;
    curveTension: number;
    pointSmoothing: number;
  };
  specialEffectsSettings: {
    showHeadParticles: boolean;
  };
  directionChangeEpsilon: number;
};

export class TrailController {
  readonly trail: Trail;
  readonly trailHeadParticles: TrailHeadParticles;
  readonly gallery: Gallery;
  private readonly trailHeadPosition: THREE.Vector3;
  private readonly timer: THREE.Timer;
  private readonly configuration: TrailConfiguration;
  private readonly runtimeState: {
    hasSeededInitialPoints: boolean;
    hasUserMovedFromStart: boolean;
    previousProgress: number | null;
    previousDirection: number;
    currentOpacity: number;
  };

  constructor({ gallery }: TrailControllerOptions) {
    this.trail = new Trail();
    this.trailHeadParticles = new TrailHeadParticles();
    this.gallery = gallery;
    this.trailHeadPosition = new THREE.Vector3();
    this.timer = new THREE.Timer();

    this.configuration = {
      isEnabled: true,
      pathSettings: {
        startXPosition: -0.96, // Base X where the path starts
        startYPosition: -1.05, // Base Y where the path starts
        horizontalWidth: 3, // How wide the path goes left/right
        horizontalCycles: 1.85, // Number of horizontal waves
        verticalAmplitude: 0.78, // How much the path moves up/down
        verticalCycles: 2.1, // Number of vertical waves
        distanceAheadOfCamera: 1.65, // Base forward offset from camera
        baseDepthOffset: 4.78, // Base depth subtraction
        depthSpan: 6.52, // Extra depth across full progress
        progressDepthOffset: -0.1, // Bias so trail appears earlier at start
      },
      responsiveSettings: {
        mobileBreakpoint: 768, // Mobile viewport limit in pixels.
        mobileWidthScale: 0.35, // Horizontal width multiplier on mobile.
        mobileStartXOffset: 0.35, // Extra X offset applied on mobile.
      },
      pointSettings: {
        minimumPointCount: 14, // Trail length near start
        maximumPointCount: 220, // Trail length near end
        reverseLengthScale: 0.55, // Shrink length while reversing
        initialSeedPointCount: 10, // Number of startup seed points
        initialSeedStepZ: 0.12, // Z spacing between startup points
        trimPerFrameForward: 4, // Max old points removed per frame (forward)
        trimPerFrameReverse: 32, // Max old points removed per frame (reverse)
      },
      opacitySettings: {
        baseOpacity: 0.51, // Max material opacity
        idleOpacityAtStart: 0.55, // Opacity when user has not moved yet
        idleProgressThreshold: 0.01, // Progress considered as "at start"
        startVisibilityBias: 0.1, // Boost visibility near start
        edgeFadeStart: 0.04, // Edge fade lower bound
        edgeFadeEnd: 0.2, // Edge fade upper bound
        opacitySmoothing: 0.12, // Opacity lerp speed
      },
      visualSettings: {
        trailColor: '#f6f9ff', // Main trail color
        glowColor: '#ffffff', // Emissive color
        glowIntensity: 1.35, // Emissive intensity
        curveTension: 0.67, // Curviness of the generated spline
        pointSmoothing: 0.53, // Smoothing when adding new points
      },
      specialEffectsSettings: {
        showHeadParticles: true, // Quick toggle for the experimental sparkle effect.
      },
      directionChangeEpsilon: 0.0005, // Ignore tiny direction noise
    }

    this.runtimeState = {
      hasSeededInitialPoints: false, // Avoid seeding twice
      hasUserMovedFromStart: false, // Becomes true after first real scroll
      previousProgress: null, // Last frame progress
      previousDirection: 0, // Last non-zero direction (-1 or 1)
      currentOpacity: this.configuration.opacitySettings.baseOpacity, // Smoothed opacity value
    }

    this.applyVisualSettings()
  }

  applyVisualSettings(): void {
    const { visualSettings, opacitySettings } = this.configuration
    this.trail.material.color.set(visualSettings.trailColor)
    this.trail.material.emissive.set(visualSettings.glowColor)
    this.trail.material.emissiveIntensity = visualSettings.glowIntensity
    this.trail.material.opacity = opacitySettings.baseOpacity
    this.trail.material.needsUpdate = true
    this.trail.curveTension = visualSettings.curveTension
    this.trail.pointSmoothing = visualSettings.pointSmoothing
    this.trailHeadParticles.particles.forEach((particle) => {
      particle.mesh.material.color.set(visualSettings.trailColor)
    })
  }

  init(scene: Scene, camera: PerspectiveCamera): void {
    scene.add(this.trail.object)
    scene.add(this.trailHeadParticles.object)
    this.seedInitialPoints(camera)
  }

  dispose(): void {
    this.trail.dispose()
    this.trailHeadParticles.dispose()
    this.runtimeState.hasSeededInitialPoints = false
    this.runtimeState.hasUserMovedFromStart = false
    this.runtimeState.previousProgress = null
    this.runtimeState.previousDirection = 0
  }

  update(
    camera: PerspectiveCamera | null = null,
    scroll: Scroll | null = null,
    time: number | null = null,
  ): void {
    if (!camera) return
    if (time !== null && Number.isFinite(time)) {
      this.timer.update(time);
    } else {
      this.timer.update();
    }
    const deltaSeconds = this.timer.getDelta()

    this.trail.object.visible = this.configuration.isEnabled
    const shouldShowHeadParticles =
      this.configuration.isEnabled && this.configuration.specialEffectsSettings.showHeadParticles
    this.trailHeadParticles.setEnabled(shouldShowHeadParticles)
    if (!this.configuration.isEnabled) return

    const currentProgress = this.getProgress(camera, scroll) // Normalized 0..1 progress.
    if (currentProgress > this.configuration.opacitySettings.idleProgressThreshold) {
      this.runtimeState.hasUserMovedFromStart = true
    }

    const currentDirection = this.getDirection(currentProgress) // -1, 0, or 1.
    const hasDirectionReversed =
      currentDirection !== 0 &&
      this.runtimeState.previousDirection !== 0 &&
      currentDirection !== this.runtimeState.previousDirection

    this.updateLength(currentProgress, currentDirection || this.runtimeState.previousDirection)
    const trailHeadPosition = this.computeHeadPosition(camera.position.z, currentProgress)
    this.updateOpacity(currentProgress)

    if (hasDirectionReversed) {
      this.trail.reset()
      const restartLeadPosition = trailHeadPosition.clone() // Small lead point after reset.
      restartLeadPosition.z += currentDirection * this.configuration.pointSettings.initialSeedStepZ
      this.trail.addPoint(restartLeadPosition)
    }

    this.trail.addPoint(trailHeadPosition)

    if (currentDirection !== 0) {
      this.runtimeState.previousDirection = currentDirection
    }
    this.runtimeState.previousProgress = currentProgress

    this.trailHeadParticles.update(
      deltaSeconds,
      trailHeadPosition,
      this.runtimeState.currentOpacity,
      true
    )
  }

  getProgress(camera: PerspectiveCamera, scroll: Scroll | null): number {
    const scrollRange = (scroll?.maxCameraZ ?? 0) - (scroll?.minCameraZ ?? 0) // Scroll camera range.

    if (Number.isFinite(scrollRange) && scrollRange > 0) {
      return THREE.MathUtils.clamp(
        ((scroll?.maxCameraZ ?? camera.position.z) - camera.position.z) / scrollRange,
        0,
        1
      )
    }

    const blend = this.gallery.getPlaneBlendData(camera.position.z) // Fallback blended progress.
    if (blend) {
      const lastIndex = Math.max(this.gallery.planes.length - 1, 1) // Safe divisor.
      return THREE.MathUtils.clamp((blend.currentPlaneIndex + blend.blend) / lastIndex, 0, 1)
    }

    return this.gallery.getDepthProgress(camera.position.z) // Final fallback.
  }

  computeHeadPosition(cameraZ: number, progress: number): THREE.Vector3 {
    const clampedProgress = THREE.MathUtils.clamp(progress, 0, 1) // Keep values stable.
    const { pathSettings, responsiveSettings } = this.configuration // Local shortcut.
    const horizontalCycles = Math.max(pathSettings.horizontalCycles, 0.0001) // Avoid zero cycles.
    const verticalCycles = Math.max(pathSettings.verticalCycles, 0.0001) // Avoid zero cycles.
    const isMobileViewport =
      typeof window !== 'undefined' && window.innerWidth <= responsiveSettings.mobileBreakpoint
    const responsiveStartXPosition =
      pathSettings.startXPosition + (isMobileViewport ? responsiveSettings.mobileStartXOffset : 0)
    const responsiveHorizontalWidth =
      pathSettings.horizontalWidth * (isMobileViewport ? responsiveSettings.mobileWidthScale : 1)

    const xPosition =
      responsiveStartXPosition +
      Math.sin(clampedProgress * FULL_CIRCLE_RADIANS * horizontalCycles) * responsiveHorizontalWidth

    const yPosition =
      pathSettings.startYPosition +
      Math.sin(clampedProgress * FULL_CIRCLE_RADIANS * verticalCycles) *
        pathSettings.verticalAmplitude

    const depthProgress =
      pathSettings.progressDepthOffset + clampedProgress * (1 - pathSettings.progressDepthOffset)

    const zPosition =
      cameraZ +
      pathSettings.distanceAheadOfCamera -
      (pathSettings.baseDepthOffset + depthProgress * pathSettings.depthSpan)

    this.trailHeadPosition.set(xPosition, yPosition, zPosition)
    return this.trailHeadPosition
  }

  seedInitialPoints(camera: PerspectiveCamera): void {
    if (this.runtimeState.hasSeededInitialPoints || !camera) return

    const startPosition = this.computeHeadPosition(camera.position.z, 0).clone() // Seed anchor point.

    for (
      let index = this.configuration.pointSettings.initialSeedPointCount;
      index >= 0;
      index -= 1
    ) {
      const seedPosition = startPosition.clone() // One startup seed point.
      seedPosition.z -= index * this.configuration.pointSettings.initialSeedStepZ
      this.trail.addPoint(seedPosition)
    }

    this.runtimeState.hasSeededInitialPoints = true
  }

  getDirection(progress: number): number {
    if (this.runtimeState.previousProgress === null) return 0

    const progressDelta = progress - this.runtimeState.previousProgress // Progress movement this frame.
    if (Math.abs(progressDelta) <= this.configuration.directionChangeEpsilon) return 0

    return Math.sign(progressDelta)
  }

  updateLength(progress: number, direction: number): void {
    const { pointSettings } = this.configuration // Local shortcut.
    const lengthProgress = direction < 0 ? progress * pointSettings.reverseLengthScale : progress

    this.trail.maxPoints = Math.round(
      THREE.MathUtils.lerp(
        pointSettings.minimumPointCount,
        pointSettings.maximumPointCount,
        THREE.MathUtils.clamp(lengthProgress, 0, 1)
      )
    )

    this.trail.maxTrimPerFrame =
      direction < 0 ? pointSettings.trimPerFrameReverse : pointSettings.trimPerFrameForward
  }

  updateOpacity(progress: number): void {
    const { opacitySettings } = this.configuration // Local shortcut.

    const startDistance = THREE.MathUtils.clamp(
      progress + opacitySettings.startVisibilityBias,
      0,
      1
    ) // Distance from start edge.

    const endDistance = 1 - progress // Distance from end edge.
    const closestEdgeDistance = Math.min(startDistance, endDistance) // Nearest edge distance.

    const edgeVisibility = THREE.MathUtils.smoothstep(
      closestEdgeDistance,
      opacitySettings.edgeFadeStart,
      opacitySettings.edgeFadeEnd
    )

    const startupVisibility =
      !this.runtimeState.hasUserMovedFromStart && progress <= opacitySettings.idleProgressThreshold
        ? opacitySettings.idleOpacityAtStart
        : 0

    const visibility = Math.max(edgeVisibility, startupVisibility) // Keep strongest visibility.
    const targetOpacity = opacitySettings.baseOpacity * visibility

    this.runtimeState.currentOpacity = THREE.MathUtils.lerp(
      this.runtimeState.currentOpacity,
      targetOpacity,
      opacitySettings.opacitySmoothing
    )

    this.trail.material.opacity = this.runtimeState.currentOpacity
  }
}

