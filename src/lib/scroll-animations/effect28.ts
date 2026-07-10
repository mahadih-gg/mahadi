import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function centerFactor(position: number, total: number) {
  const half = Math.ceil(total / 2);
  return position < half
    ? position
    : half - Math.abs(Math.floor(total / 2) - position) - 1;
}

export function initEffect28(title: HTMLElement) {
  const words = [...title.querySelectorAll<HTMLElement>(".word")];

  words.forEach((word) => {
    const chars = word.querySelectorAll<HTMLElement>(".char");
    const charsTotal = chars.length;

    gsap.fromTo(
      chars,
      {
        willChange: "transform, filter",
        transformOrigin: "50% 100%",
        scale: (position) =>
          gsap.utils.mapRange(
            0,
            Math.ceil(charsTotal / 2),
            0.5,
            2.1,
            centerFactor(position, charsTotal),
          ),
        y: (position) =>
          gsap.utils.mapRange(
            0,
            Math.ceil(charsTotal / 2),
            0,
            60,
            centerFactor(position, charsTotal),
          ),
        rotation: (position) => {
          const factor = centerFactor(position, charsTotal);
          return position < charsTotal / 2
            ? gsap.utils.mapRange(0, Math.ceil(charsTotal / 2), -4, 0, factor)
            : gsap.utils.mapRange(0, Math.ceil(charsTotal / 2), 0, 4, factor);
        },
        filter: "blur(12px) opacity(0)",
      },
      {
        ease: "power2.inOut",
        y: 0,
        rotation: 0,
        scale: 1,
        filter: "blur(0px) opacity(1)",
        stagger: { amount: 0.15, from: "center" },
        scrollTrigger: {
          trigger: word,
          start: "top bottom+=40%",
          end: "top 60%",
          scrub: true,
        },
      },
    );
  });
}
