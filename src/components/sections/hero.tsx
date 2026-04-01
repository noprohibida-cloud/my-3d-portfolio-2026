import { cn } from "@/lib/utils";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePreloader } from "../preloader";
import { BlurIn } from "../reveal-animations";
import ScrollDownIcon from "../scroll-down-icon";
import { config } from "@/data/config";
import ScrambleText from "../scramble-text";
import CliffordCanvas from "../CliffordCanvas";

// SectionWrapper retiré ici — il wrappait les enfants dans un motion.div
// avec opacity:0 au chargement, ce qui cachait le canvas Clifford.
// On reconstruit la section manuellement sans l'animation de fade.

const HeroSection = () => {
  const { isLoading } = usePreloader();

  return (
    <section id="hero" className={cn("relative w-full h-[100dvh]")}>

      {/* Canvas Clifford — HORS du motion.div, toujours visible */}
      <CliffordCanvas />

      {/* Contenu textuel — fade-in géré par BlurIn individuellement */}
      <div className="grid md:grid-cols-2">
        <div
          className={cn(
            "h-[calc(100dvh-3rem)] md:h-[calc(100dvh-4rem)] z-[2]",
            "col-span-1",
            "flex flex-col justify-start md:justify-center items-center md:items-start",
            "pt-28 sm:pb-16 md:p-20 lg:p-24 xl:p-28"
          )}
        >
          {!isLoading && (
            <div className="flex flex-col">
              <div>
                <BlurIn delay={0.7}>
                  <p className={cn(
                    "md:self-start mt-4 font-thin text-md text-slate-500 dark:text-zinc-400",
                    "cursor-default font-display sm:text-xl md:text-xl whitespace-nowrap bg-clip-text"
                  )}>
                    Hi, I am
                    <br className="md:hidden" />
                  </p>
                </BlurIn>

                <BlurIn delay={1}>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <h1 className={cn(
                        "-ml-[4px] leading-none font-thin text-transparent text-slate-800 text-left mt-1",
                        "font-thin text-7xl md:text-7xl lg:text-8xl xl:text-9xl",
                        "cursor-default text-edge-outline font-display"
                      )}>
                        {config.author.split(" ")[0]}
                        <span className="md:hidden"> </span>
                        <br className="hidden md:block" />
                        {config.author.split(" ")[1]}
                      </h1>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="dark:bg-white dark:text-black">
                      theres something waiting for you in devtools
                    </TooltipContent>
                  </Tooltip>
                </BlurIn>

                <BlurIn delay={1.2}>
                  <h2 className={cn(
                    "md:self-start mt-3 font-thin text-slate-500 dark:text-zinc-400",
                    "cursor-default font-display whitespace-nowrap bg-clip-text",
                    "text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                  )}>
                    <ScrambleText
                      texts={[
                        "designer interactif",
                        "technical artist",
                        "développeur créatif",
                        "directeur artistique",
                      ]}
                      interval={5200}
                      morphOutDuration={560}
                      morphInDuration={800}
                      staggerDelay={42}
                      floatIntensity={0.55}
                      className=""
                    />
                  </h2>
                </BlurIn>
              </div>
            </div>
          )}
        </div>
        <div className="grid col-span-1"></div>
      </div>

      <div className="absolute bottom-10 left-[50%] translate-x-[-50%]">
        <ScrollDownIcon />
      </div>
    </section>
  );
};

export default HeroSection;