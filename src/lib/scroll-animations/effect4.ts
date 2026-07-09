import { gsap } from "gsap";

export function initEffect4(
  title: HTMLElement,
  options?: { delay?: number },
) {
  const words = title.querySelectorAll<HTMLElement>(".word");
  const tl = gsap.timeline({ delay: options?.delay ?? 0 });

  words.forEach((word, wordIndex) => {
    const chars = word.querySelectorAll<HTMLElement>(".char");

    tl.fromTo(
      chars,
      {
        willChange: "opacity, transform",
        x: (position, _, arr) => 150 * (position - arr.length / 2),
      },
      {
        ease: "power1.inOut",
        x: 0,
        duration: 1.2,
        stagger: { grid: "auto", from: "center" },
      },
      wordIndex * 0.15,
    );
  });
}
