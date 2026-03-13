"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { PROJECTS, SimpleProject } from "@/data/projects";
import PrototypesModal from "@/components/PrototypesModal";

const tiltOptions = {
  max: 4,
  speed: 400,
  glare: true,
  "max-glare": 0.15,
  gyroscope: false,
};

function ProjectCard(props: {
  project: SimpleProject;
  isDesktop: boolean;
  onModalOpen: () => void;
}) {
  const { project, onModalOpen } = props;
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(function () {
    if (!cardRef.current) return;
    import("vanilla-tilt").then(function ({ default: VanillaTilt }: any) {
      VanillaTilt.init(cardRef.current, tiltOptions);
    });
  }, []);

  const imageSrc = project.imageSrc
    ? project.imageSrc
    : "/assets/projects-screenshots/" +
      project.imageKey +
      "." +
      (project.imageKey === "jiniz" ? "jpg" : "png");

  const inner = React.createElement(
    "div",
    {
      ref: cardRef,
      className: cn(
        "relative flex flex-col justify-end overflow-hidden rounded-3xl snap-start flex-shrink-0",
        "h-[20rem] sm:h-[22rem] md:h-[26rem]",
        "shadow-lg transition-transform duration-300 hover:-translate-y-2",
        "[transform-style:preserve-3d] [transform:perspective(1000px)]"
      ),
      style: {
        width: "min(90vw, 38rem)",
        minWidth: "260px",
        WebkitMaskImage: "-webkit-radial-gradient(white, black)",
      },
    },
    React.createElement(Image, {
      src: imageSrc,
      alt: project.name,
      fill: true,
      sizes: "(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 38rem",
      className: "object-cover object-center transition-transform duration-700 group-hover:scale-105",
      priority: false,
    }),
    React.createElement("div", {
      className: "absolute inset-0",
      style: {
        background:
          "linear-gradient(to bottom, transparent 30%, " +
          project.gradient[0] +
          "cc 70%, " +
          project.gradient[0] +
          " 100%)",
      },
    }),
    React.createElement("div", {
      className: "absolute inset-0",
      style: {
        background:
          "linear-gradient(to bottom, " +
          project.gradient[1] +
          "44 0%, transparent 40%)",
      },
    }),
    React.createElement(
      "div",
      {
        className: "relative z-10 p-6",
        style: { transform: "translateZ(2rem)" },
      },
      project.hasModal
        ? React.createElement(
            "div",
            {
              className:
                "inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full text-[10px] font-medium border",
              style: {
                borderColor: "#6B75C755",
                color: "#9ba5e8",
                backgroundColor: "#6B75C718",
              },
            },
            React.createElement(
              "svg",
              { width: "8", height: "8", viewBox: "0 0 8 8", fill: "currentColor" },
              React.createElement("circle", { cx: "4", cy: "4", r: "3" })
            ),
            "Voir le projet"
          )
        : null,
      React.createElement(
        "h1",
        { className: "text-xl font-medium sm:text-2xl text-white leading-tight mb-1" },
        project.name
      ),
      React.createElement(
        "h2",
        { className: "text-sm font-normal tracking-wide text-white/60" },
        project.description
      )
    )
  );

  if (project.hasModal) {
    return React.createElement(
      "button",
      {
        onClick: onModalOpen,
        className: "group appearance-none bg-transparent border-0 p-0 cursor-pointer",
        "aria-label": "Ouvrir le projet " + project.name,
      },
      inner
    );
  }

  return React.createElement(
    "a",
    {
      href: project.url,
      target: "_blank",
      rel: "noreferrer",
      className: "group",
    },
    inner
  );
}

function ProjectsSection() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(function () {
    const media = window.matchMedia("(min-width: 768px)");
    function handler(e: MediaQueryListEvent | MediaQueryList) {
      setIsDesktop(e instanceof MediaQueryListEvent ? e.matches : media.matches);
    }
    handler(media);
    media.addEventListener("change", handler);
    return function () { media.removeEventListener("change", handler); };
  }, []);

  useLayoutEffect(function () {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(function () {
      function setup() {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;
        const distance = track.scrollWidth - section.clientWidth;
        ScrollTrigger.getById("projects-horizontal")?.kill();
        gsap.set(track, { x: 0 });
        if (distance <= 0) return;
        gsap.to(track, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            id: "projects-horizontal",
            trigger: section,
            start: "top 30%",
            end: function () { return "+=" + (distance + window.innerHeight); },
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }
      setup();
      ScrollTrigger.addEventListener("refreshInit", setup);
      return function () {
        ScrollTrigger.removeEventListener("refreshInit", setup);
        ScrollTrigger.getById("projects-horizontal")?.kill();
      };
    }, sectionRef);
    return function () { ctx.revert(); };
  }, []);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "section",
      {
        id: "projects",
        className: "relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24",
      },
      React.createElement(SectionHeader, {
        id: "projects",
        title: "Projects",
        desc: "Quick hits from my build list.",
      }),
      React.createElement(
        "div",
        {
          ref: sectionRef,
          className:
            "mt-10 overflow-x-hidden w-screen max-w-none -mx-[calc(50vw-50%)]",
        },
        React.createElement(
          "div",
          {
            ref: trackRef,
            className:
              "flex gap-6 overflow-visible pb-6 snap-x snap-mandatory w-max px-[calc(50vw-50%+2rem)]",
          },
          PROJECTS.map(function (project) {
            return React.createElement(ProjectCard, {
              key: project.name,
              project: project,
              isDesktop: isDesktop,
              onModalOpen: function () { setModalOpen(true); },
            });
          })
        )
      )
    ),
    React.createElement(PrototypesModal, {
      open: modalOpen,
      onClose: function () { setModalOpen(false); },
    })
  );
}

export default ProjectsSection;