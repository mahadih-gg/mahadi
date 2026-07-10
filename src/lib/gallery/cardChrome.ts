/** Shared chrome + layout id for gallery card ↔ details overlay transitions. */
export const galleryCardChromeClassName =
  "gallery-frame relative w-full overflow-hidden bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-2 shadow-[0_45px_100px_-24px_rgba(0,0,0,0.7)] rounded-2xl md:rounded-3xl md:p-3";

export function galleryCardLayoutId(slug: string): string {
  return `gallery-card-${slug}`;
}
