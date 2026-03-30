"use client";

import SmoothScroll from "@/components/smooth-scroll";
import AnimatedBackground from "@/components/animated-background";
import HeroSection from "@/components/sections/hero";
import SkillsSection from "@/components/sections/skills";
import ExperienceSection from "@/components/sections/experience";
import ProjectsSection from "@/components/sections/projects-3d-gallery";
import ContactSection from "@/components/sections/contact";

export default function Home() {
  return (
    <SmoothScroll>
      <AnimatedBackground />
      <HeroSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </SmoothScroll>
  );
}