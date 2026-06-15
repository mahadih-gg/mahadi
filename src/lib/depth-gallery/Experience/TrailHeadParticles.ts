import * as THREE from "three";
import type { Mesh, MeshBasicMaterial } from "three";

type TrailParticle = {
  mesh: Mesh<THREE.SphereGeometry, MeshBasicMaterial>;
  velocity: THREE.Vector3;
  lifeRemaining: number;
  totalLife: number;
};

export class TrailHeadParticles {
  private readonly group = new THREE.Group();
  isEnabled = true;
  maxParticles = 18;
  spawnPerSecond = 20;
  spawnRadius = 0.52;
  speedMin = 0.05;
  speedMax = 0.22;
  lifeMin = 0.25;
  lifeMax = 0.6;
  sizeMin = 0.007;
  sizeMax = 0.02;
  dragPerFrame = 0.94;
  private spawnAccumulator = 0;
  private nextSpawnIndex = 0;
  private readonly sharedGeometry = new THREE.SphereGeometry(1, 5, 4);
  readonly particles: TrailParticle[] = [];

  constructor() {
    this.group.renderOrder = 1300;

    for (let index = 0; index < this.maxParticles; index += 1) {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#f6f9ff'),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: false,
      })

      const mesh = new THREE.Mesh(this.sharedGeometry, material)
      mesh.visible = false
      this.group.add(mesh)

      this.particles.push({
        mesh,
        velocity: new THREE.Vector3(), // Current movement vector
        lifeRemaining: 0, // Remaining life in seconds
        totalLife: 0, // Initial life used for fade ratio
      })
    }
  }

  get object(): THREE.Group {
    return this.group;
  }

  setEnabled(isEnabled: boolean): void {
    if (this.isEnabled && !isEnabled) {
      this.clear()
    }

    this.isEnabled = Boolean(isEnabled)
    this.group.visible = this.isEnabled
  }

  update(
    deltaSeconds: number,
    headPosition: THREE.Vector3,
    opacity = 1,
    shouldSpawn = true,
  ): void {
    const safeDelta = Math.min(Math.max(deltaSeconds || 0, 0), 0.1) // Clamp unstable frame delta

    if (this.isEnabled && shouldSpawn && safeDelta > 0) {
      this.spawnAccumulator += safeDelta * this.spawnPerSecond
      const spawnCount = Math.floor(this.spawnAccumulator)
      this.spawnAccumulator -= spawnCount

      for (let index = 0; index < spawnCount; index += 1) {
        this.spawnParticle(headPosition)
      }
    } else {
      this.spawnAccumulator = 0
    }

    const clampedOpacity = THREE.MathUtils.clamp(opacity, 0, 1)
    const drag = Math.pow(this.dragPerFrame, safeDelta * 60)

    this.particles.forEach((particle) => {
      if (particle.lifeRemaining <= 0) return

      particle.lifeRemaining -= safeDelta
      if (particle.lifeRemaining <= 0) {
        particle.lifeRemaining = 0
        particle.mesh.visible = false
        particle.mesh.material.opacity = 0
        return
      }

      particle.velocity.multiplyScalar(drag)
      particle.mesh.position.addScaledVector(particle.velocity, safeDelta)

      const lifeRatio = particle.lifeRemaining / particle.totalLife // 1 at birth, 0 at death
      particle.mesh.material.opacity = lifeRatio * clampedOpacity * 0.75
    })
  }

  spawnParticle(headPosition: THREE.Vector3): void {
    const particle = this.particles[this.nextSpawnIndex]
    this.nextSpawnIndex = (this.nextSpawnIndex + 1) % this.particles.length

    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * this.spawnRadius

    particle.mesh.position.set(
      headPosition.x + Math.cos(angle) * radius,
      headPosition.y + (Math.random() - 0.5) * this.spawnRadius * 0.6,
      headPosition.z + Math.sin(angle) * radius
    )

    const size = THREE.MathUtils.lerp(this.sizeMin, this.sizeMax, Math.random())
    particle.mesh.scale.setScalar(size)
    particle.mesh.visible = true

    const speed = THREE.MathUtils.lerp(this.speedMin, this.speedMax, Math.random())
    particle.velocity.set(
      (Math.random() - 0.5) * speed,
      (Math.random() - 0.5) * speed * 0.6,
      (Math.random() - 0.5) * speed
    )

    particle.totalLife = THREE.MathUtils.lerp(this.lifeMin, this.lifeMax, Math.random())
    particle.lifeRemaining = particle.totalLife
    particle.mesh.material.opacity = 0.4
  }

  dispose(): void {
    this.clear()
    this.particles.forEach((particle) => {
      particle.mesh.material.dispose()
    })
    this.sharedGeometry.dispose()
    this.group.clear()
    this.particles.length = 0;
  }

  clear(): void {
    this.spawnAccumulator = 0
    this.particles.forEach((particle) => {
      particle.lifeRemaining = 0
      particle.totalLife = 0
      particle.mesh.visible = false
      particle.mesh.material.opacity = 0
    })
  }
}

