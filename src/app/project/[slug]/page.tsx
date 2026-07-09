import { AnimatedHeading } from "@/components/typography/AnimatedHeading";
import { getAllProjectSlugs, getProjectBySlug } from "@/data/projects.data";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: `${project.titleLines.join(" ")} | Mahadi Hasan`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-dvh bg-background px-4 py-24 md:px-[58px] md:py-32">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          ← Back to home
        </Link>

        <header className="mt-8">
          <AnimatedHeading
            as="h1"
            className="font-secondary text-4xl font-semibold leading-tight text-foreground md:text-6xl"
          >
            {project.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </AnimatedHeading>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {project.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <a
              href={project.visitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline-offset-4 hover:underline"
              style={{ color: project.accent }}
            >
              Visit site →
            </a>
          </div>
        </header>

        <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-2xl border border-border">
          <Image
            src={project.heroImage}
            alt={project.titleLines.join(" ")}
            fill
            className="object-cover"
            priority
          />
        </div>

        <section className="mt-12">
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {project.heroDescription}
          </p>
        </section>

        {project.sections.map((section) => (
          <section key={section.title} className="mt-16">
            <AnimatedHeading
              as="h2"
              className="font-secondary text-2xl text-foreground md:text-3xl"
            >
              {section.title}
            </AnimatedHeading>

            <div className="mt-6 space-y-4">
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-base leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {section.features && section.features.length > 0 && (
              <ul className="mt-8 grid gap-4 md:grid-cols-3">
                {section.features.map((feature) => (
                  <li
                    key={feature.title}
                    className="rounded-xl border border-border bg-secondary p-5"
                  >
                    <AnimatedHeading
                      as="h3"
                      className="font-medium text-foreground"
                    >
                      {feature.title}
                    </AnimatedHeading>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {section.showcase && project.showcaseImages.length > 0 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {project.showcaseImages.map((src) => (
                  <div
                    key={src}
                    className="relative aspect-video overflow-hidden rounded-xl border border-border"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
