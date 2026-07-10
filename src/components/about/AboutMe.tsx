import { AnimatedSectionHeader } from "@/components/typography/AnimatedSectionHeader";
import { aboutBio, aboutHighlights } from "@/data/about.data";

export default function AboutMe() {
  return (
    <section
      id="about"
      aria-label="About me"
      className="relative py-24 md:py-32"
    >
      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10">
        {/* Anchor for the Experience section's SVG line — it sweeps in from
            here, at the top-right of About, down through the highlight dots
            (see experienceAnimation.ts's measureLeadIn). */}
        <span
          aria-hidden
          data-line-start
          className="pointer-events-none absolute top-0 right-[12%] size-px md:right-[20%]"
        />
        <AnimatedSectionHeader className="w-full font-secondary text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          About Me
        </AnimatedSectionHeader>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {aboutBio}
        </p>

        <ul className="relative z-50 mt-12 grid gap-3 md:mt-8 md:gap-5">
          {aboutHighlights.map((highlight) => (
            <li
              key={highlight}
              className="flex gap-4 rounded-xl border border-white/10 bg-white/3 backdrop-blur-lg backdrop-saturate-150 px-4 py-2 md:px-4 md:py-2"
            >
              {/* Bead on the lead-in curve — foreground by default; grows via
                  absolute size when touched (see playDotGlowIn). */}
              <span
                className="relative mt-2 size-1.5 shrink-0"
                aria-hidden
                data-line-dot-wrap
              >
                <span
                  data-line-dot-shuttle
                  className="pointer-events-none absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/35 opacity-0"
                />
                <span
                  data-line-dot-shuttle
                  className="pointer-events-none absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-0 blur-[1px]"
                />
                <span
                  data-line-dot-glow
                  className="pointer-events-none absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 opacity-0 blur-md"
                />
                <span
                  data-line-dot-glow
                  className="pointer-events-none absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 opacity-0 blur-sm"
                />
                <span
                  data-line-dot
                  className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground data-active:bg-primary"
                />
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {highlight}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
