import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initEffect27(title: HTMLElement, pinTarget?: HTMLElement) {
  const words = [...title.querySelectorAll<HTMLElement>(".word")];

  words.forEach((word) => gsap.set(word.parentElement, { perspective: 1000 }));

  gsap.fromTo(
    words,
    {
      willChange: "opacity, transform",
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
      stagger: { each: 0.006, from: "random" },
      scrollTrigger: {
        trigger: title,
        start: "center center",
        end: "+=300%",
        scrub: true,
        pin: pinTarget ?? title.parentElement,
      },
    },
  );
}
