"use client";

import EasterEggs from "@/components/easter-eggs";
import ElasticCursor from "@/components/ui/ElasticCursor";

// GlobalBackground supprimé — le canvas Clifford est dans HeroSection directement
export default function AppOverlays() {
  return (
    <>
      <EasterEggs />
      <ElasticCursor />
    </>
  );
}