import AboutMe from "@/components/about/AboutMe";
import Experience from "@/components/experience/Experience";
import ExperiencePageLine from "@/components/experience/ExperiencePageLine";
import Footer from "@/components/Footer";
import ProjectsGallery from "@/components/gallery/ProjectsGallery";
import Hero from "@/components/Hero";
import ContactSection from "@/components/sections/ContactSection";
import SkillsSection from "@/components/skills/SkillsSection";
import { AnimatedFooterText } from "@/components/typography/AnimatedFooterText";

export default function Home() {
  return (
    <main id="top" className="relative bg-background">
      <ExperiencePageLine />
      {/* No z-index here on purpose: a stacking context would trap the About
          cards' z-50 below the SVG line overlay (z-40). Leaving this wrapper
          context-free lets per-section z-index compete directly with the
          line — About cards (z-50) sit above it, the Experience timeline
          (z-10) stays under it. Hero and the gallery isolate their own
          internal layers so nothing leaks out. */}
      <div className="relative">
        <Hero />
        <AboutMe />
        <Experience />
        <ProjectsGallery />
        <SkillsSection />
        <ContactSection />
        <AnimatedFooterText>
          {`Great products begin where collaboration meets ownership.`}
        </AnimatedFooterText>
        <Footer />
      </div>
    </main>
  );
}
