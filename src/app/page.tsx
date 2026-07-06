import Hero from "@/components/Hero";
import Experience from "@/components/experience/Experience";
import ExperiencePageLine from "@/components/experience/ExperiencePageLine";

export default function Home() {
  return (
    <main className="relative bg-background">
      <ExperiencePageLine />
      <div className="relative z-10">
        <Hero />
        <Experience />
      </div>
    </main>
  );
}
