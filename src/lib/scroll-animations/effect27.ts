import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Codrops On-Scroll Typography Animations — Set 2, data-effect27.
 * Words fly in from random 3D depth while the parent section is pinned.
 */
export function initEffect27(title: HTMLElement) {
  const words = [...title.querySelectorAll<HTMLElement>(".word")];

  words.forEach((word) => gsap.set(word.parentNode, { perspective: 1000 }));

  return gsap.fromTo(
    words,
    {
      "will-change": "opacity, transform",
      z: () => gsap.utils.random(500, 950),
      opacity: 0,
      xPercent: () => gsap.utils.random(-100, 100),
      yPercent: () => gsap.utils.random(-10, 10),
      rotationX: () => gsap.utils.random(-90, 90),
    },
    {
      ease: "expo",
      opacity: 1,
      rotationX: 0,
      rotationY: 0,
      xPercent: 0,
      yPercent: 0,
      z: 0,
      scrollTrigger: {
        trigger: title,
        start: "center center",
        end: "+=300%",
        scrub: true,
        pin: title.parentNode as Element,
      },
      stagger: {
        each: 0.006,
        from: "random",
      },
    },
  );
}
