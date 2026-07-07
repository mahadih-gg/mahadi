import Hero from "@/components/Hero";
import Experience from "@/components/experience/Experience";
import ExperiencePageLine from "@/components/experience/ExperiencePageLine";
import ProjectsGallery from "@/components/gallery/ProjectsGallery";

export default function Home() {
  return (
    <main className="relative bg-background">
      <ExperiencePageLine />
      <div className="relative z-10">
        <Hero />
        <ProjectsGallery />
        <Experience />
      </div>
    </main>
  );
}
