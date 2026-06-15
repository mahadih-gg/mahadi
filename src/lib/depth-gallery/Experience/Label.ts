import type { PerspectiveCamera } from "three";
import type { Gallery } from "@/lib/depth-gallery/Experience/Gallery";
import type { GalleryPlaneLabel } from "@/lib/depth-gallery/data/galleryData";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(
  text: string,
  terms: string[],
  accentColor: string,
): string {
  if (!terms.length) return escapeHtml(text);

  const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
  let result = escapeHtml(text);

  for (const term of sortedTerms) {
    if (!term.trim()) continue;
    const regex = new RegExp(`(${escapeRegExp(term)})`, "gi");
    result = result.replace(
      regex,
      `<span class="plane-label-highlight" style="--highlight-color: ${accentColor}">$1</span>`,
    );
  }

  return result;
}

export class Label {
  private overlayElement: HTMLElement | null = null;
  private leftIndexElement: HTMLElement | null = null;
  private companyElement: HTMLElement | null = null;
  private roleElement: HTMLElement | null = null;
  private periodElement: HTMLElement | null = null;
  private responsibilitiesElement: HTMLElement | null = null;
  private activePlaneIndex = -1;

  constructor(
    private readonly gallery: Gallery,
    private readonly mountElement: HTMLElement,
  ) {}

  private createElement() {
    const element = document.createElement("section");
    element.className = "plane-label-overlay";
    element.innerHTML = `
      <div class="plane-label-overlay__left">
        <p class="plane-label-overlay__index"></p>
        <h3 class="plane-label-card__company"></h3>
        <p class="plane-label-card__role"></p>
        <p class="plane-label-card__period"></p>
      </div>
      <article class="plane-label-card plane-label-overlay__right">
        <p class="plane-label-card__heading">Responsibilities</p>
        <ul class="plane-label-card__responsibilities"></ul>
      </article>
    `;

    return {
      element,
      leftIndexElement: element.querySelector<HTMLElement>(
        ".plane-label-overlay__index",
      ),
      companyElement: element.querySelector<HTMLElement>(
        ".plane-label-card__company",
      ),
      roleElement: element.querySelector<HTMLElement>(".plane-label-card__role"),
      periodElement: element.querySelector<HTMLElement>(
        ".plane-label-card__period",
      ),
      responsibilitiesElement: element.querySelector<HTMLElement>(
        ".plane-label-card__responsibilities",
      ),
    };
  }

  init(): void {
    if (this.overlayElement) return;

    const {
      element,
      leftIndexElement,
      companyElement,
      roleElement,
      periodElement,
      responsibilitiesElement,
    } = this.createElement();

    this.overlayElement = element;
    this.leftIndexElement = leftIndexElement;
    this.companyElement = companyElement;
    this.roleElement = roleElement;
    this.periodElement = periodElement;
    this.responsibilitiesElement = responsibilitiesElement;
    this.overlayElement.style.opacity = "0";

    this.mountElement.append(this.overlayElement);
  }

  private getTargetPlaneIndex(cameraZ: number): number {
    const blendData = this.gallery.getPlaneBlendData(cameraZ);
    if (!blendData) return -1;
    return blendData.blend >= 0.5
      ? blendData.nextPlaneIndex
      : blendData.currentPlaneIndex;
  }

  private applyPlaneContent(planeIndex: number): void {
    const plane = this.gallery.planes[planeIndex];
    if (!plane || this.activePlaneIndex === planeIndex) return;

    const labelData = (plane.userData.label ?? {}) as GalleryPlaneLabel;
    const accentColor = String(plane.userData.accentColor ?? "#ffffff");

    if (this.leftIndexElement) {
      this.leftIndexElement.textContent = String(planeIndex + 1).padStart(2, "0");
    }
    if (this.companyElement) {
      this.companyElement.textContent = labelData.company || "";
    }
    if (this.roleElement) {
      this.roleElement.textContent = labelData.role || "";
    }
    if (this.periodElement) {
      this.periodElement.textContent = labelData.period || "";
    }
    if (this.responsibilitiesElement) {
      const terms = labelData.highlightTerms ?? [];
      this.responsibilitiesElement.innerHTML = (labelData.responsibilities ?? [])
        .map(
          (item) =>
            `<li>${highlightText(item, terms, accentColor)}</li>`,
        )
        .join("");
    }
    if (this.overlayElement) {
      this.overlayElement.style.color = labelData.color || "";
      this.overlayElement.style.setProperty("--label-accent", accentColor);
    }

    this.activePlaneIndex = planeIndex;
  }

  resize(_width: number, _height: number): void {}

  update(camera: PerspectiveCamera | null = null): void {
    if (!camera || !this.overlayElement) return;

    const targetPlaneIndex = this.getTargetPlaneIndex(camera.position.z);
    if (targetPlaneIndex < 0) {
      this.overlayElement.style.opacity = "0";
      return;
    }

    this.applyPlaneContent(targetPlaneIndex);
    this.overlayElement.style.opacity = "1";
  }

  render(): void {}

  dispose(): void {
    this.overlayElement?.remove();
    this.overlayElement = null;
    this.leftIndexElement = null;
    this.companyElement = null;
    this.roleElement = null;
    this.periodElement = null;
    this.responsibilitiesElement = null;
    this.activePlaneIndex = -1;
  }
}
