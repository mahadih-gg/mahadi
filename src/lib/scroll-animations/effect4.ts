import { gsap } from "gsap";

type SpreadFn = (
  position: number,
  target: HTMLElement,
  targets: HTMLElement[],
) => number;

function resolveSpread(
  spread: number | SpreadFn | undefined,
): SpreadFn {
  const value = spread ?? 150;
  return typeof value === "function"
    ? value
    : (position, _, arr) => value * (position - arr.length / 2);
}

/** Apply the spread "from" state without animating (call while element is hidden). */
export function setEffect4FromState(
  title: HTMLElement,
  options?: { spread?: number | SpreadFn },
) {
  const getSpread = resolveSpread(options?.spread);
  const chars = title.querySelectorAll<HTMLElement>(".char");

  gsap.set(chars, {
    willChange: "opacity, transform",
    x: getSpread,
  });
}

export function initEffect4(
  title: HTMLElement,
  options?: {
    delay?: number;
    spread?: number | SpreadFn;
    /** Animate to x:0 from positions already set via setEffect4FromState. */
    fromCurrent?: boolean;
    immediateRender?: boolean;
  },
) {
  const getSpread = resolveSpread(options?.spread);
  const words = title.querySelectorAll<HTMLElement>(".word");
  const tl = gsap.timeline({ delay: options?.delay ?? 0 });

  words.forEach((word, wordIndex) => {
    const chars = word.querySelectorAll<HTMLElement>(".char");

    if (options?.fromCurrent) {
      tl.to(
        chars,
        {
          ease: "power1.inOut",
          x: 0,
          duration: 1.2,
          stagger: { grid: "auto", from: "center" },
        },
        wordIndex * 0.15,
      );
      return;
    }

    tl.fromTo(
      chars,
      {
        willChange: "opacity, transform",
        x: getSpread,
      },
      {
        ease: "power1.inOut",
        x: 0,
        duration: 1.2,
        stagger: { grid: "auto", from: "center" },
        immediateRender: options?.immediateRender ?? true,
      },
      wordIndex * 0.15,
    );
  });
}
