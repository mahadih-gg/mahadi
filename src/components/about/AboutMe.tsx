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
            here, at the top-right of About, down to the first timeline node
            (see experienceAnimation.ts's measureLeadIn). */}
        <span
          aria-hidden
          data-line-start
          className="pointer-events-none absolute top-0 right-[12%] size-px md:right-[20%]"
        />
        <h2 className="font-secondary text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          About Me
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {aboutBio}
        </p>

        <ul className="relative z-50 mt-12 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
          {aboutHighlights.map((highlight) => (
            <li
              key={highlight}
              className="flex gap-4 rounded-xl border border-white/10 bg-white/3 backdrop-blur-lg backdrop-saturate-150 p-5 md:p-6"
            >
              <span
                className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                aria-hidden
              />
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
