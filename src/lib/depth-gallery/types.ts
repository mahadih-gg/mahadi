import type * as THREE from "three";
import type { GalleryPlaneLabel } from "@/lib/depth-gallery/data/galleryData";

export type MoodColors = {
  background: string;
  blob1: string;
  blob2: string;
};

export type MoodBlendData = {
  currentMood: MoodColors;
  nextMood: MoodColors;
  blend: number;
};

export type PlaneBlendData = {
  currentPlaneIndex: number;
  nextPlaneIndex: number;
  blend: number;
};

export type PlaneUserData = {
  basePosition: { x: number; y?: number };
  baseColor: string;
  accentColor: string;
  backgroundColor: string;
  blob1Color: string;
  blob2Color: string;
  label: GalleryPlaneLabel;
  texture: THREE.Texture | null;
  aspectRatio: number;
};

export type DepthRange = {
  nearestZ: number;
  deepestZ: number;
};
