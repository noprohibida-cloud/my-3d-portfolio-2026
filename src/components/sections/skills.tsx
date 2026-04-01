// src/components/sections/skills.tsx
import SectionWrapper from "../ui/section-wrapper";
import { SectionHeader } from "./section-header";

const SkillsSection = () => {
  return (
    <SectionWrapper
      id="skills"
      // avant : w-full h-[100dvh] md:h-[150dvh] pointer-events-none
      className="w-full min-h-[80dvh] md:min-h-[90dvh] pointer-events-none"
    >
      <SectionHeader
        id="skills"
        title="PRÉSENTATION"
        desc="PRESS SPACE TO SCROLL DOWN"
      />
    </SectionWrapper>
  );
};

export default SkillsSection;