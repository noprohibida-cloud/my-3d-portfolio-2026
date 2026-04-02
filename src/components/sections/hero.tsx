import { cn } from "@/lib/utils";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePreloader } from "../preloader";
import { BlurIn } from "../reveal-animations";
import ScrollDownIcon from "../scroll-down-icon";
import { config } from "@/data/config";
import ScrambleText from "../scramble-text";

const HeroSection = () => {
  const { isLoading } = usePreloader();

  return (
    <section
      id="hero"
      className={cn("relative w-full h-[100dvh]")}
      style={{
        position: "relative",
        zIndex: 2,
        isolation: "isolate",
      }}
    >
      {/* Clifford — absolu dans le hero, z-index 0, derrière le texte z-[2] */}
      <iframe
        src="/clifford.html"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
          pointerEvents: "none",
          zIndex: 0,
          display: "block",
        }}
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="grid md:grid-cols-2">
        <div className={cn(
          "h-[calc(100dvh-3rem)] md:h-[calc(100dvh-4rem)] z-[2]",
          "col-span-1",
          "flex flex-col justify-start md:justify-center items-center md:items-start",
          "pt-28 sm:pb-16 md:p-20 lg:p-24 xl:p-28"
        )}>
          {!isLoading && (
            <div className="flex flex-col">
              <div>
                <BlurIn delay={0.7}>
                  <p className={cn(
                    "md:self-start mt-4 font-thin text-md text-slate-500 dark:text-zinc-400",
                    "cursor-default font-display sm:text-xl md:text-xl whitespace-nowrap bg-clip-text"
                  )}>
                    Hi, I am<br className="md:hidden" />
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
                      texts={["designer interactif", "technical artist", "développeur créatif", "directeur artistique"]}
                      interval={5200}
                      morphOutDuration={560}
                      morphInDuration={800}
                      staggerDelay={42}
                      floatIntensity={0.55}
                    />
                  </h2>
                </BlurIn>
              </div>
            </div>
          )}
        </div>
        <div className="grid col-span-1" />
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <ScrollDownIcon />
      </div>
    </section>
  );
};

export default HeroSection;