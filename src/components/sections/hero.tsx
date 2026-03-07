"use client";
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
import SectionWrapper from "../ui/section-wrapper";
import ScrambleText from "../scramble-text";

var ROLES = [
  "technical artist",
  "designer interactif",
  "développeur créatif",
  "directeur artistique",
  "artiste procédural",
];

function HeroSection() {
  var preloader = usePreloader();
  var isLoading = preloader.isLoading;

  return (
    <SectionWrapper id="hero" className={cn("relative w-full h-[100dvh]")}>
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
                  <p
                    className={cn(
                      "md:self-start mt-4 font-thin text-md text-slate-500 dark:text-zinc-400",
                      "cursor-default font-display sm:text-xl md:text-xl whitespace-nowrap bg-clip-text"
                    )}
                  >
                    Hi, I am
                    <br className="md:hidden" />
                  </p>
                </BlurIn>

                <BlurIn delay={1}>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <h1
                        className={cn(
                          "-ml-[4px] leading-none font-thin text-transparent text-slate-800 text-left mt-1",
                          "font-thin text-7xl md:text-7xl lg:text-8xl xl:text-9xl",
                          "cursor-default text-edge-outline font-display"
                        )}
                      >
                        {config.author.split(" ")[0]}
                        <span className="md:hidden"> </span>
                        <br className="hidden md:block" />
                        {config.author.split(" ")[1]}
                      </h1>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="dark:bg-white dark:text-black"
                    >
                      theres something waiting for you in devtools
                    </TooltipContent>
                  </Tooltip>
                </BlurIn>
                <BlurIn delay={1.2}>
                  <h2
                    className={cn(
                      "md:self-start mt-2",
                      "cursor-default font-display",
                      "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
                      "text-slate-600 dark:text-zinc-300 font-thin tracking-tight"
                    )}
                  >
                    <ScrambleText
                      texts={ROLES}
                      interval={3400}
                      morphOutDuration={500}
                      morphInDuration={700}
                      staggerDelay={35}
                      letterSpacing="0.06em"
                      floatIntensity={1}
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
    </SectionWrapper>
  );
}

export default HeroSection;