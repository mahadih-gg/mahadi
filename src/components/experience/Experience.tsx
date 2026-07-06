import ExperienceItem from "@/components/experience/ExperienceItem";
import { experienceData } from "@/data/experienceData";

/**
 * Scroll-driven career timeline content. The SVG path lives in
 * ExperiencePageLine (full-page z-0 layer); this section only provides the
 * track markup and node anchors for experienceAnimation.ts.
 */
export default function Experience() {
  return (
    <section
      id="experience"
      aria-label="Work experience"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <h2 className="font-secondary text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          Experience
        </h2>
        <p className="mt-4 max-w-md text-base text-muted-foreground md:text-lg">
          A thread through every team I have built with.
        </p>
      </div>

      <div
        data-exp-track
        className="relative mx-auto mt-20 w-full max-w-6xl px-6 md:mt-28 md:px-10"
      >
        <ol className="relative z-10 flex list-none flex-col gap-20 md:gap-48">
          {experienceData.map((item, index) => (
            <ExperienceItem key={item.company} item={item} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}
