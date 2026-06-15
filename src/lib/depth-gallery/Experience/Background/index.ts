import * as THREE from "three";
import type { ShaderMaterial, WebGLRenderer } from "three";
import {
  backgroundVertexShader as vertexShader,
  backgroundFragmentShader as fragmentShader,
} from "@/lib/depth-gallery/shaders";
import type { MoodBlendData, MoodColors } from "@/lib/depth-gallery/types";

type MotionResponse = {
  depthProgress?: number;
  velocityIntensity?: number;
};

export class Background {
  isInitialized = false;

  private scene: THREE.Scene | null = null;
  private camera: THREE.OrthographicCamera | null = null;
  private material: ShaderMaterial | null = null;
  private mesh: THREE.Mesh | null = null;

  private readonly backgroundColor = new THREE.Color("#FBE8CD");
  private readonly blob1Color = new THREE.Color("#FFD56D");
  private readonly blob2Color = new THREE.Color("#5D816A");
  private readonly nextBackgroundColor = new THREE.Color();
  private readonly nextBlob1Color = new THREE.Color();
  private readonly nextBlob2Color = new THREE.Color();

  baseBlobRadius = 0.65;
  secondaryBlobRadiusRatio = 0.78;
  baseBlobStrength = 0.9;

  private readonly depthToRadiusAmount = 0.08;
  private readonly velocityToStrengthAmount = 0.1;
  private readonly motionSmoothing = 0.1;
  private motionDepthProgress = 0;
  private motionVelocityIntensity = 0;
  private smoothedDepthProgress = 0;
  private smoothedVelocityIntensity = 0;

  private blobRadius = this.baseBlobRadius;
  private blobStrength = this.baseBlobStrength;
  noiseStrength = 0.04;

  init(): void {
    if (this.isInitialized) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uBackgroundColor: { value: this.backgroundColor },
        uBlob1Color: { value: this.blob1Color },
        uBlob2Color: { value: this.blob2Color },
        uNoiseStrength: { value: this.noiseStrength },
        uBlobRadius: { value: this.blobRadius },
        uBlobRadiusSecondary: {
          value: this.blobRadius * this.secondaryBlobRadiusRatio,
        },
        uBlobStrength: { value: this.blobStrength },
        uTime: { value: 0 },
        uVelocityIntensity: { value: 0 },
      },
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);
    this.applyMotionToBlob();

    this.isInitialized = true;
  }

  setMoodColors({ background, blob1, blob2 }: Partial<MoodColors> = {}): void {
    if (background) this.backgroundColor.set(background);
    if (blob1) this.blob1Color.set(blob1);
    if (blob2) this.blob2Color.set(blob2);
    this.updateUniformColors();
  }

  setMoodBlend({ currentMood, nextMood, blend }: Partial<MoodBlendData> = {}): void {
    if (!currentMood) return;

    const safeBlend = THREE.MathUtils.clamp(blend ?? 0, 0, 1);
    if (!nextMood || safeBlend <= 0) {
      this.setMoodColors(currentMood);
      return;
    }

    this.backgroundColor
      .set(currentMood.background)
      .lerp(this.nextBackgroundColor.set(nextMood.background), safeBlend);
    this.blob1Color
      .set(currentMood.blob1)
      .lerp(this.nextBlob1Color.set(nextMood.blob1), safeBlend);
    this.blob2Color
      .set(currentMood.blob2)
      .lerp(this.nextBlob2Color.set(nextMood.blob2), safeBlend);

    this.updateUniformColors();
  }

  private updateUniformColors(): void {
    if (!this.material) return;

    this.material.uniforms.uBackgroundColor!.value.copy(this.backgroundColor);
    this.material.uniforms.uBlob1Color!.value.copy(this.blob1Color);
    this.material.uniforms.uBlob2Color!.value.copy(this.blob2Color);
    this.material.uniforms.uNoiseStrength!.value = this.noiseStrength;
  }

  private updateBlobUniforms(): void {
    if (!this.material) return;

    this.material.uniforms.uBlobRadius!.value = this.blobRadius;
    this.material.uniforms.uBlobRadiusSecondary!.value =
      this.blobRadius * this.secondaryBlobRadiusRatio;
    this.material.uniforms.uBlobStrength!.value = this.blobStrength;
  }

  setMotionResponse({ depthProgress, velocityIntensity }: MotionResponse = {}): void {
    if (Number.isFinite(depthProgress)) {
      this.motionDepthProgress = THREE.MathUtils.clamp(depthProgress!, 0, 1);
    }
    if (Number.isFinite(velocityIntensity)) {
      this.motionVelocityIntensity = THREE.MathUtils.clamp(
        velocityIntensity!,
        0,
        1,
      );
    }
  }

  private applyMotionToBlob(): void {
    const nextBlobRadius =
      this.baseBlobRadius + this.smoothedDepthProgress * this.depthToRadiusAmount;
    const nextBlobStrength =
      this.baseBlobStrength +
      this.smoothedVelocityIntensity * this.velocityToStrengthAmount;

    this.blobRadius = THREE.MathUtils.clamp(nextBlobRadius, 0.05, 1);
    this.blobStrength = THREE.MathUtils.clamp(nextBlobStrength, 0, 1);

    this.updateBlobUniforms();
  }

  update(time = 0): void {
    this.smoothedDepthProgress = THREE.MathUtils.lerp(
      this.smoothedDepthProgress,
      this.motionDepthProgress,
      this.motionSmoothing,
    );
    this.smoothedVelocityIntensity = THREE.MathUtils.lerp(
      this.smoothedVelocityIntensity,
      this.motionVelocityIntensity,
      this.motionSmoothing,
    );

    if (this.material) {
      this.material.uniforms.uTime!.value = time;
      this.material.uniforms.uVelocityIntensity!.value =
        this.smoothedVelocityIntensity;
    }

    this.applyMotionToBlob();
  }

  render(renderer: WebGLRenderer): void {
    if (!this.isInitialized || !this.scene || !this.camera) return;
    renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    if (!this.isInitialized || !this.mesh || !this.material || !this.scene)
      return;

    this.mesh.geometry.dispose();
    this.material.dispose();
    this.scene.clear();

    this.scene = null;
    this.camera = null;
    this.mesh = null;
    this.material = null;
    this.isInitialized = false;
  }
}
