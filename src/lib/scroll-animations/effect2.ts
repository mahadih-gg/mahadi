import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initEffect2(title: HTMLElement) {
  const chars = title.querySelectorAll<HTMLElement>(".char");

  gsap.fromTo(
    chars,
    {
      willChange: "opacity, transform",
      opacity: 0,
      yPercent: 20,
      scaleY: 2.5,
      scaleX: 0.9,
      transformOrigin: "10% 0%",
    },
    {
      ease: "back.inOut(2)",
      opacity: 1,
      yPercent: 0,
      scaleY: 1,
      scaleX: 1,
      stagger: 0.03,
      scrollTrigger: {
        trigger: title,
        start: "center bottom+=50%",
        end: "bottom top+=40%",
        scrub: true,
      },
    },
  );
}
