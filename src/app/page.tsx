"use client";

import React from "react";
import SmoothScroll from "@/components/smooth-scroll";
import AnimatedBackground from "@/components/animated-background";
import SkillsSection from "@/components/sections/skills";
import ExperienceSection from "@/components/sections/experience";
import FormationsSection from "@/components/sections/formations";
import ProjectsSection from "@/components/sections/projects-3d-gallery";
import ContactSection from "@/components/sections/contact";
import HeroSection from "@/components/sections/hero";
import Script from "next/script";
import { config } from "@/data/config";

export default function MainPage() {
  return (
    <SmoothScroll>
      <Script
        id="ld-json-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: config.title,
            url: config.site,
            description: config.description.long,
            inLanguage: "en",
            author: { "@type": "Person", name: config.author, url: config.site },
            publisher: { "@type": "Person", name: config.author },
          }),
        }}
      />
      <AnimatedBackground />

      {/* Hero hors du main — transparent, laisse voir le vt220 */}
      <HeroSection />

      {/* main opaque #05060f — couvre le vt220 dès le premier scroll */}
      <main style={{ marginTop: "100dvh" }}>
        <SkillsSection />
        <ExperienceSection />
        <FormationsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </SmoothScroll>
  );
}