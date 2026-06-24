import Hero from "@/components/Hero";
import ExperienceSection from "@/components/experience-section";

export default function Home() {
  return (
    <main>
      <Hero />
      <ExperienceSection />
      <div className="bg-background min-h-screen">
        <h1 className="text-4xl font-bold">Mahadi Hasan</h1>
      </div>
    </main>
  );
}
