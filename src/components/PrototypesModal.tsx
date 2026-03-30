"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ─── Data ──────────────────────────────────────────────────────────────────────

const PHOTOS = [
  { src: "/assets/projects-screenshots/prototypes/insitu-01.jpg", caption: "Vue d'ensemble — nef du Musée du Saut du Tarn" },
  { src: "/assets/projects-screenshots/prototypes/insitu-02.jpg", caption: "Dispositifs d'exposition — vitrines modulaires bois" },
  { src: "/assets/projects-screenshots/prototypes/insitu-03.jpg", caption: "Espace L'Invisible — ballon captif et archives photo" },
  { src: "/assets/projects-screenshots/prototypes/insitu-04.jpg", caption: "Module interactif — écran d'introduction" },
  { src: "/assets/projects-screenshots/prototypes/insitu-05.jpg", caption: "Table d'archives vitrées et mur de photographies" },
  { src: "/assets/projects-screenshots/prototypes/insitu-06.jpg", caption: "La Fabrique de l'instrumentation scientifique" },
  { src: "/assets/projects-screenshots/prototypes/insitu-07.jpg", caption: "Exposition originale — Musée des Arts et Métiers, Paris" },
];

const ROLES = [
  { label: "Graphisme",          color: "#6B75C7" },
  { label: "Scénographie",       color: "#F0C427" },
  { label: "Montage vidéo",      color: "#F0698A" },
  { label: "Rédaction cartels",  color: "#4A8B5C" },
];

const PALETTE = ["#2D3069","#6B75C7","#F0C427","#F0698A","#4A8B5C","#CC7054"];

const AFFICHES = [
  { src: "/assets/projects-screenshots/prototypes/affiche-bleue.jpg",  label: "Version bleue" },
  { src: "/assets/projects-screenshots/prototypes/affiche-jaune.jpg", label: "Version jaune" },
];

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 52 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = (delay = 0) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: delay } },
});

// ─── HoverImageCard ────────────────────────────────────────────────────────────

function HoverImageCard(props: {
  src: string; alt: string; label?: string; aspect?: string;
  sizes?: string; onClick?: () => void; fullWidthLabel?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return React.createElement(
    "button",
    {
      onClick: props.onClick,
      onMouseEnter: function() { setHov(true); },
      onMouseLeave: function() { setHov(false); },
      style: {
        display: "block", width: "100%", padding: 0,
        border: "0.5px solid rgba(255,255,255,0.07)",
        borderRadius: "0.875rem", overflow: "hidden",
        backgroundColor: "#0f1020",
        cursor: props.onClick ? "zoom-in" : "default",
        position: "relative" as const,
        textAlign: "left" as const,
      },
    },
    React.createElement(
      "div",
      { style: { position: "relative" as const, aspectRatio: props.aspect || "16/9", overflow: "hidden" } },
      React.createElement(Image, {
        src: props.src, alt: props.alt, fill: true,
        sizes: props.sizes || "50vw",
        style: {
          objectFit: "cover" as const,
          transform: hov ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.75s cubic-bezier(0.22,1,0.36,1)",
        },
      }),
      React.createElement("div", {
        style: {
          position: "absolute" as const, inset: 0,
          backgroundColor: "rgba(0,0,0,0.15)",
          opacity: hov ? 0 : 1,
          transition: "opacity 0.45s ease",
          pointerEvents: "none" as const,
        },
      })
    ),
    props.label && React.createElement(
      "div",
      { style: { padding: "0.45rem 0.875rem", borderTop: "0.5px solid rgba(255,255,255,0.06)" } },
      React.createElement("span", {
        style: { fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.07em" },
      }, props.label)
    )
  );
}

// ─── PhotoStripCard ────────────────────────────────────────────────────────────

function PhotoStripCard(props: {
  src: string; caption: string; index: number; total: number; onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return React.createElement(
    "button",
    {
      onClick: props.onClick,
      onMouseEnter: function() { setHov(true); },
      onMouseLeave: function() { setHov(false); },
      style: {
        flexShrink: 0, width: "290px", height: "370px",
        position: "relative" as const,
        borderRadius: "0.875rem", overflow: "hidden",
        scrollSnapAlign: "start", border: "none",
        padding: 0, cursor: "zoom-in",
        backgroundColor: "#0f1020",
      },
    },
    React.createElement(Image, {
      src: props.src, alt: props.caption,
      fill: true, sizes: "290px",
      style: {
        objectFit: "cover" as const,
        transform: hov ? "scale(1.08)" : "scale(1)",
        transition: "transform 0.75s cubic-bezier(0.22,1,0.36,1)",
      },
    }),
    React.createElement(
      "div",
      {
        style: {
          position: "absolute" as const, inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)",
          display: "flex", flexDirection: "column" as const,
          justifyContent: "flex-end", padding: "1rem",
          opacity: hov ? 1 : 0.7,
          transition: "opacity 0.35s ease",
        },
      },
      React.createElement("span", {
        style: { fontSize: "9px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", marginBottom: "5px" },
      }, String(props.index + 1).padStart(2, "0") + " — " + String(props.total).padStart(2, "0")),
      React.createElement("p", {
        style: { fontSize: "11px", color: "rgba(255,255,255,0.85)", lineHeight: 1.45, margin: 0 },
      }, props.caption)
    )
  );
}

// ─── SectionHead ───────────────────────────────────────────────────────────────

function SectionHead(props: { num: string; color: string; label: string; title: string; desc: string }) {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      motion.div,
      {
        variants: fadeUp,
        style: { display: "flex", alignItems: "center", gap: "0.75rem", paddingTop: "2.75rem", marginBottom: "1rem" },
      },
      React.createElement("span", { style: { color: props.color, fontSize: "11px", letterSpacing: "0.22em", fontWeight: 500 } }, props.num),
      React.createElement("div", { style: { height: "1px", width: "28px", backgroundColor: props.color + "50" } }),
      React.createElement("span", { style: { color: "rgba(255,255,255,0.28)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" as const } }, props.label)
    ),
    React.createElement(
      motion.h2,
      {
        variants: fadeUp,
        style: {
          fontFamily: "var(--font-display,'Archivo Black',sans-serif)",
          fontSize: "clamp(1.6rem,4.5vw,2.5rem)",
          color: "white", lineHeight: 1.05,
          marginBottom: "0.75rem",
        },
      },
      props.title
    ),
    React.createElement(
      motion.p,
      {
        variants: fadeUp,
        style: { color: "rgba(255,255,255,0.38)", lineHeight: 1.75, maxWidth: "44rem", marginBottom: "2rem", fontSize: "14px" },
      },
      props.desc
    )
  );
}

// ─── BigNum (giant background section number) ──────────────────────────────────

function BigNum(props: { n: string; color: string }) {
  return React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute" as const, top: "0.5rem", right: "-0.5rem",
      fontFamily: "var(--font-display,'Archivo Black',sans-serif)",
      fontSize: "clamp(9rem,22vw,16rem)", lineHeight: 1,
      color: props.color + "05", letterSpacing: "-0.06em",
      pointerEvents: "none" as const, userSelect: "none" as const,
      zIndex: 0,
    },
  }, props.n);
}

// ─── Main component ────────────────────────────────────────────────────────────

type Props = { open: boolean; onClose: () => void };

export default function PrototypesModal(props: Props) {
  const open = props.open;
  const onClose = props.onClose;
  const [lb, setLb] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState(0);

  // ESC key
  useEffect(function() {
    if (!open) return;
    function handler(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (lb) setLb(null); else onClose();
    }
    window.addEventListener("keydown", handler);
    return function() { window.removeEventListener("keydown", handler); };
  }, [open, lb, onClose]);

  // Body scroll lock
  useEffect(function() {
    document.body.style.overflow = open ? "hidden" : "";
    return function() { document.body.style.overflow = ""; };
  }, [open]);

  // Reset on open
  useEffect(function() {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      setParallax(0);
    }
  }, [open]);

  // Hero parallax scroll listener
  useEffect(function() {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    function onScroll() { setParallax(el!.scrollTop * 0.25); }
    el.addEventListener("scroll", onScroll, { passive: true });
    return function() { el.removeEventListener("scroll", onScroll); };
  }, [open]);

  return React.createElement(
    React.Fragment,
    null,

    // ── Modal ──────────────────────────────────────────────────────────────────
    React.createElement(
      AnimatePresence,
      null,
      open && React.createElement(
        motion.div,
        {
          key: "proto-overlay",
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit:    { opacity: 0 },
          transition: { duration: 0.35 },
          onClick: onClose,
          style: {
            position: "fixed" as const, inset: 0, zIndex: 9998,
            backgroundColor: "rgba(0,0,0,0.88)",
            backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
          },
        },
        React.createElement(
          motion.div,
          {
            key: "proto-panel",
            initial: { y: "100%" },
            animate: { y: 0 },
            exit:    { y: "100%" },
            transition: { type: "spring", stiffness: 210, damping: 30 },
            onClick: function(e: React.MouseEvent) { e.stopPropagation(); },
            style: {
              position: "relative" as const,
              width: "100%", maxWidth: "76rem",
              height: "92vh",
              backgroundColor: "#07080e",
              borderRadius: "1.375rem 1.375rem 0 0",
              border: "0.5px solid rgba(255,255,255,0.09)",
              borderBottom: "none",
              display: "flex", flexDirection: "column" as const,
              overflow: "hidden",
            },
          },

          // ── Sticky header ──────────────────────────────────────────────────
          React.createElement(
            "div",
            {
              style: {
                position: "relative" as const, zIndex: 30, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.875rem 1.5rem",
                backgroundColor: "rgba(7,8,14,0.92)",
                backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                borderBottom: "0.5px solid rgba(255,255,255,0.06)",
              },
            },
            // Left
            React.createElement(
              "div",
              { style: { display: "flex", alignItems: "center", gap: "1rem" } },
              React.createElement("div", {
                style: { width: "40px", height: "3px", borderRadius: "999px", backgroundColor: "rgba(255,255,255,0.12)" },
              }),
              React.createElement(
                "div",
                { style: { display: "flex", alignItems: "center", gap: "0.625rem" } },
                React.createElement("span", { style: { fontSize: "10px", color: "#6B75C7", letterSpacing: "0.22em", textTransform: "uppercase" as const } }, "Exposition · 2023"),
                React.createElement("span", { style: { color: "rgba(255,255,255,0.15)", fontSize: "12px" } }, "/"),
                React.createElement("span", { style: { fontSize: "13px", fontWeight: 600, color: "white", letterSpacing: "-0.02em" } }, "PROTOTYPES"),
                React.createElement("span", { style: { fontSize: "12px", color: "#F0698A" } }, "— l'exemple occitan")
              )
            ),
            // Close
            React.createElement(
              "button",
              {
                onClick: onClose,
                style: {
                  width: "32px", height: "32px", borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.07)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.55)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0,
                },
              },
              React.createElement(
                "svg",
                { width: "11", height: "11", viewBox: "0 0 11 11", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" },
                React.createElement("line", { x1: "1", y1: "1", x2: "10", y2: "10" }),
                React.createElement("line", { x1: "10", y1: "1", x2: "1",  y2: "10" })
              )
            )
          ),

          // ── Scrollable content ─────────────────────────────────────────────
          React.createElement(
            "div",
            {
              ref: scrollRef,
              style: {
                flex: 1, overflowY: "auto" as const, overflowX: "hidden",
                scrollbarWidth: "thin" as const,
                scrollbarColor: "rgba(107,117,199,0.25) transparent",
              },
            },

            // ── HERO ──────────────────────────────────────────────────────────
            React.createElement(
              "div",
              { style: { position: "relative" as const, height: "60vh", overflow: "hidden" } },

              // Parallax image wrapper
              React.createElement(
                "div",
                {
                  style: {
                    position: "absolute" as const, inset: "-25% 0",
                    transform: "translateY(" + parallax + "px)",
                  },
                },
                React.createElement(Image, {
                  src: "/assets/projects-screenshots/prototypes/mdsdt.jpg",
                  alt: "Musée du Saut du Tarn", fill: true,
                  sizes: "100vw", priority: true,
                  style: { objectFit: "cover" as const, objectPosition: "center 35%" },
                })
              ),

              // Gradient layers
              React.createElement("div", {
                style: {
                  position: "absolute" as const, inset: 0,
                  background: "linear-gradient(to bottom, rgba(7,8,14,0.35) 0%, transparent 28%, transparent 40%, #07080e 100%)",
                },
              }),
              React.createElement("div", {
                style: {
                  position: "absolute" as const, inset: 0,
                  background: "radial-gradient(ellipse 80% 60% at 85% 110%, rgba(240,196,39,0.07) 0%, transparent 65%)",
                },
              }),
              React.createElement("div", {
                style: {
                  position: "absolute" as const, inset: 0,
                  background: "radial-gradient(ellipse 60% 50% at 10% 0%, rgba(107,117,199,0.06) 0%, transparent 65%)",
                },
              }),

              // Film grain overlay (SVG data URI)
              React.createElement("div", {
                style: {
                  position: "absolute" as const, inset: 0, pointerEvents: "none" as const,
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.05'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "repeat", backgroundSize: "256px",
                  opacity: 0.8, mixBlendMode: "overlay" as const,
                },
              }),

              // Hero text content
              React.createElement(
                "div",
                {
                  style: {
                    position: "absolute" as const, inset: 0,
                    display: "flex", flexDirection: "column" as const,
                    alignItems: "center", justifyContent: "center",
                    textAlign: "center" as const, padding: "2rem",
                    paddingTop: "5rem",
                  },
                },

                // Animated title — letter by letter 3D flip
                React.createElement(
                  motion.div,
                  {
                    initial: "hidden",
                    animate: open ? "visible" : "hidden",
                    variants: { hidden: {}, visible: { transition: { staggerChildren: 0.055, delayChildren: 0.45 } } },
                    style: {
                      display: "flex", justifyContent: "center", flexWrap: "wrap" as const,
                      fontFamily: "var(--font-display,'Archivo Black',sans-serif)",
                      fontSize: "clamp(3.4rem,12vw,8rem)",
                      lineHeight: 0.85, letterSpacing: "-0.03em",
                      color: "white", perspective: "700px",
                    },
                  },
                  ..."PROTOTYPES".split("").map(function(char, i) {
                    return React.createElement(
                      motion.span,
                      {
                        key: i,
                        variants: {
                          hidden:  { opacity: 0, y: 70, rotateX: -90, filter: "blur(14px)" },
                          visible: { opacity: 1, y: 0,  rotateX: 0,   filter: "blur(0px)",
                            transition: { type: "spring", stiffness: 155, damping: 17 } },
                        },
                        style: { display: "inline-block", transformOrigin: "50% 100%" },
                      },
                      char
                    );
                  })
                ),

                // Subtitle
                React.createElement(
                  motion.p,
                  {
                    initial: { opacity: 0, y: 18 },
                    animate: open ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
                    transition: { delay: 1.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                    style: { color: "#F0698A", letterSpacing: "0.14em", marginTop: "1rem", fontSize: "0.9rem", fontWeight: 500 },
                  },
                  "L'exemple occitan"
                ),

                // Role tags
                React.createElement(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 14 },
                    animate: open ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
                    transition: { delay: 1.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                    style: { display: "flex", flexWrap: "wrap" as const, gap: "0.5rem", justifyContent: "center", marginTop: "1.375rem" },
                  },
                  ...ROLES.map(function(r) {
                    return React.createElement("span", {
                      key: r.label,
                      style: {
                        color: r.color, backgroundColor: r.color + "18",
                        border: "0.5px solid " + r.color + "55",
                        padding: "4px 14px", borderRadius: "999px",
                        fontSize: "11px", fontWeight: 500,
                        backdropFilter: "blur(8px)",
                      },
                    }, r.label);
                  })
                ),

                // Date + lieu
                React.createElement(
                  motion.p,
                  {
                    initial: { opacity: 0 },
                    animate: open ? { opacity: 1 } : { opacity: 0 },
                    transition: { delay: 1.55, duration: 0.6 },
                    style: { color: "rgba(255,255,255,0.22)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase" as const, marginTop: "1.1rem" },
                  },
                  "17 Avr. – 17 Sept. 2023 · Musée du Saut du Tarn, Saint-Juéry"
                )
              )
            ),

            // ── INTRO ──────────────────────────────────────────────────────────
            React.createElement(
              "div",
              { style: { padding: "3rem 2.5rem 2.5rem" } },
              React.createElement(
                motion.div,
                {
                  initial: "hidden", whileInView: "visible",
                  viewport: { once: true, margin: "-60px" },
                  variants: stagger(),
                },
                React.createElement(motion.p, {
                  variants: fadeUp,
                  style: { color: "rgba(255,255,255,0.52)", lineHeight: 1.82, maxWidth: "50rem", marginBottom: "1.1rem", fontSize: "15px" },
                }, "Exposition itinérante conçue par l'Université de Montpellier et l'Université de Toulouse, avec le CNAM et la région Occitanie. Adaptée pour valoriser la recherche scientifique en Occitanie après sa création au Musée des Arts et Métiers à Paris (2020)."),

                React.createElement(motion.p, {
                  variants: fadeUp,
                  style: { color: "rgba(255,255,255,0.52)", lineHeight: 1.82, maxWidth: "50rem", marginBottom: "2.75rem", fontSize: "15px" },
                }, "Une trentaine de prototypes scientifiques témoignent des coulisses de la recherche « en train de se faire » à travers 5 thématiques. J'ai rejoint le projet pour la conception graphique, la scénographie, le montage vidéo et la rédaction de cartels."),

                React.createElement(
                  motion.div,
                  { variants: fadeUp, style: { display: "flex", flexWrap: "wrap" as const, gap: "2rem" } },
                  ...[
                    { label: "Lieu",        value: "Musée du Saut du Tarn" },
                    { label: "Durée",       value: "5 mois" },
                    { label: "Partenaires", value: "UM · UT · CNAM · PATSTEC" },
                  ].map(function(x) {
                    return React.createElement("div", { key: x.label },
                      React.createElement("div", {
                        style: { fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: "0.15em", color: "rgba(255,255,255,0.2)", marginBottom: "5px" },
                      }, x.label),
                      React.createElement("div", {
                        style: { fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500 },
                      }, x.value)
                    );
                  })
                )
              )
            ),

            // ── SECTION 01 — IDENTITÉ GRAPHIQUE ───────────────────────────────
            React.createElement(
              "div",
              {
                style: {
                  position: "relative" as const,
                  padding: "0 2.5rem 4rem",
                  borderTop: "0.5px solid rgba(255,255,255,0.05)",
                  overflow: "hidden",
                },
              },
              React.createElement(BigNum, { n: "01", color: "#6B75C7" }),
              React.createElement(
                motion.div,
                {
                  initial: "hidden", whileInView: "visible",
                  viewport: { once: true, margin: "-80px" },
                  variants: stagger(),
                  style: { position: "relative" as const, zIndex: 1 },
                },
                React.createElement(SectionHead, {
                  num: "01", color: "#6B75C7", label: "Identité graphique",
                  title: "Création de la charte visuelle",
                  desc: "Deux déclinaisons d'affiche (fond bleu / fond jaune), bannière web et système typographique cohérent avec les institutions partenaires.",
                }),

                // Affiches — grande mise en valeur
                React.createElement(
                  motion.div,
                  { variants: fadeUp, style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" } },
                  ...AFFICHES.map(function(x) {
                    return React.createElement(HoverImageCard, {
                      key: x.src, src: x.src, alt: x.label, label: x.label,
                      aspect: "2/3", sizes: "30vw",
                      onClick: function() { setLb(x.src); },
                    });
                  })
                ),

                // Header web — pleine largeur
                React.createElement(
                  motion.div,
                  { variants: fadeUp, style: { marginBottom: "2rem" } },
                  React.createElement(HoverImageCard, {
                    src: "/assets/projects-screenshots/prototypes/header-jaune.jpg",
                    alt: "Bannière web", label: "Bannière web — communication en ligne",
                    aspect: "21/5", sizes: "90vw",
                    onClick: function() { setLb("/assets/projects-screenshots/prototypes/header-jaune.jpg"); },
                  })
                ),

                // Palette
                React.createElement(
                  motion.div,
                  { variants: fadeUp, style: { marginBottom: "2.5rem" } },
                  React.createElement("p", {
                    style: { fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: "0.18em", color: "rgba(255,255,255,0.2)", marginBottom: "1rem" },
                  }, "Palette chromatique"),
                  React.createElement(
                    "div",
                    { style: { display: "flex", gap: "0.875rem", flexWrap: "wrap" as const } },
                    ...PALETTE.map(function(hex) {
                      return React.createElement("div", {
                        key: hex, style: { display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "6px" },
                      },
                        React.createElement("div", {
                          style: { width: "44px", height: "44px", borderRadius: "9px", backgroundColor: hex, border: "0.5px solid rgba(255,255,255,0.08)" },
                        }),
                        React.createElement("span", { style: { fontSize: "9px", color: "rgba(255,255,255,0.22)" } }, hex)
                      );
                    })
                  )
                ),

                // Mockups 01 + 02
                React.createElement(
                  motion.div,
                  { variants: fadeUp, style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" } },
                  React.createElement(HoverImageCard, {
                    src: "/assets/projects-screenshots/prototypes/proto-01.png", alt: "Slide d'animation",
                    label: "Slide d'animation", aspect: "16/10", sizes: "32vw",
                    onClick: function() { setLb("/assets/projects-screenshots/prototypes/proto-01.png"); },
                  }),
                  React.createElement(HoverImageCard, {
                    src: "/assets/projects-screenshots/prototypes/proto-02.png", alt: "Dépliant",
                    label: "Dépliant recto/verso", aspect: "16/10", sizes: "32vw",
                    onClick: function() { setLb("/assets/projects-screenshots/prototypes/proto-02.png"); },
                  })
                )
              )
            ),

            // ── SECTION 02 — SCÉNOGRAPHIE ─────────────────────────────────────
            React.createElement(
              "div",
              {
                style: {
                  position: "relative" as const,
                  paddingBottom: "4rem",
                  borderTop: "0.5px solid rgba(255,255,255,0.05)",
                  overflow: "hidden",
                },
              },
              React.createElement(BigNum, { n: "02", color: "#F0C427" }),
              React.createElement(
                motion.div,
                {
                  initial: "hidden", whileInView: "visible",
                  viewport: { once: true, margin: "-80px" },
                  variants: stagger(),
                  style: { position: "relative" as const, zIndex: 1, paddingLeft: "2.5rem", paddingRight: "2.5rem" },
                },
                React.createElement(SectionHead, {
                  num: "02", color: "#F0C427", label: "Scénographie & montage",
                  title: "Installation in situ",
                  desc: "Montage de l'exposition dans la nef industrielle du Musée du Saut du Tarn — structures modulaires bois, vitrines et signalétique sur 5 thématiques.",
                })
              ),

              // Horizontal photo strip (hors du padding)
              React.createElement(
                motion.div,
                {
                  initial: { opacity: 0, x: 50 },
                  whileInView: { opacity: 1, x: 0 },
                  viewport: { once: true, margin: "-60px" },
                  transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
                },
                React.createElement(
                  "div",
                  {
                    style: {
                      display: "flex", gap: "0.875rem",
                      overflowX: "auto" as const,
                      paddingLeft: "2.5rem", paddingRight: "2.5rem",
                      paddingBottom: "1.25rem",
                      scrollSnapType: "x mandatory",
                      WebkitOverflowScrolling: "touch",
                      scrollbarWidth: "thin" as const,
                      scrollbarColor: "rgba(240,196,39,0.2) transparent",
                      cursor: "grab",
                    },
                  },
                  ...PHOTOS.map(function(photo, i) {
                    return React.createElement(PhotoStripCard, {
                      key: photo.src, src: photo.src, caption: photo.caption,
                      index: i, total: PHOTOS.length,
                      onClick: function() { setLb(photo.src); },
                    });
                  })
                )
              )
            ),

            // ── SECTION 03 — RÉDACTION DE CARTELS ─────────────────────────────
            React.createElement(
              "div",
              {
                style: {
                  position: "relative" as const,
                  padding: "0 2.5rem 5rem",
                  borderTop: "0.5px solid rgba(255,255,255,0.05)",
                  overflow: "hidden",
                },
              },
              React.createElement(BigNum, { n: "03", color: "#F0698A" }),
              React.createElement(
                motion.div,
                {
                  initial: "hidden", whileInView: "visible",
                  viewport: { once: true, margin: "-80px" },
                  variants: stagger(),
                  style: { position: "relative" as const, zIndex: 1 },
                },
                React.createElement(SectionHead, {
                  num: "03", color: "#F0698A", label: "Rédaction de cartels",
                  title: "Textes d'exposition",
                  desc: "Rédaction des cartels scientifiques — médiation entre rigueur académique et accessibilité au grand public, en coordination avec les équipes de recherche.",
                }),

                // Stats
                React.createElement(
                  motion.div,
                  {
                    variants: fadeUp,
                    style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" },
                  },
                  ...[
                    { n: "5",    label: "Thématiques" },
                    { n: "~30", label: "Cartels rédigés" },
                    { n: "A3",  label: "Format final" },
                  ].map(function(s) {
                    return React.createElement("div", {
                      key: s.label,
                      style: {
                        textAlign: "center" as const, padding: "1.375rem 0.5rem",
                        borderRadius: "0.875rem", backgroundColor: "#0f1020",
                        border: "0.5px solid rgba(255,255,255,0.07)",
                      },
                    },
                      React.createElement("div", {
                        style: {
                          fontFamily: "var(--font-display,'Archivo Black',sans-serif)",
                          fontSize: "2.1rem", color: "#F0698A",
                          lineHeight: 1, marginBottom: "7px",
                        },
                      }, s.n),
                      React.createElement("div", {
                        style: { fontSize: "10px", color: "rgba(255,255,255,0.26)", letterSpacing: "0.1em" },
                      }, s.label)
                    );
                  })
                ),

                // Excerpt card
                React.createElement(
                  motion.div,
                  {
                    variants: fadeUp,
                    style: {
                      borderRadius: "0.875rem", overflow: "hidden",
                      border: "0.5px solid rgba(255,255,255,0.08)",
                      marginBottom: "2rem",
                    },
                  },
                  React.createElement("div", {
                    style: { backgroundColor: "rgba(45,48,105,0.35)", padding: "0.875rem 1.25rem", borderBottom: "0.5px solid rgba(255,255,255,0.08)" },
                  },
                    React.createElement("div", {
                      style: { fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: "0.18em", color: "#6B75C7", marginBottom: "4px" },
                    }, "Extrait — Robot SHERPA"),
                    React.createElement("div", {
                      style: { fontSize: "11px", color: "rgba(255,255,255,0.65)" },
                    }, "LIRMM, Montpellier — 2006")
                  ),
                  React.createElement("div", {
                    style: { backgroundColor: "#0d0e1a", padding: "1.125rem 1.25rem" },
                  },
                    React.createElement("p", {
                      style: { fontSize: "13px", color: "rgba(255,255,255,0.36)", lineHeight: 1.82, margin: 0, fontStyle: "italic" },
                    }, "Le robot SHERPA a été conçu pour démontrer l'intérêt d'un robot marcheur destiné au transport d'objets. Il est dit bio-inspiré car créé à partir de caractéristiques propres aux êtres vivants, notamment en termes de déplacement…")
                  )
                ),

                // Mockups 03 + 04
                React.createElement(
                  motion.div,
                  { variants: fadeUp, style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" } },
                  React.createElement(HoverImageCard, {
                    src: "/assets/projects-screenshots/prototypes/proto-03.png", alt: "Maquettes cartels",
                    label: "Maquettes cartels — A3", aspect: "16/11", sizes: "32vw",
                    onClick: function() { setLb("/assets/projects-screenshots/prototypes/proto-03.png"); },
                  }),
                  React.createElement(HoverImageCard, {
                    src: "/assets/projects-screenshots/prototypes/proto-04.png", alt: "Livret",
                    label: "Livret et dépliant de l'exposition", aspect: "16/11", sizes: "32vw",
                    onClick: function() { setLb("/assets/projects-screenshots/prototypes/proto-04.png"); },
                  })
                ),

                // proto-05 full width
                React.createElement(
                  motion.div,
                  { variants: fadeUp },
                  React.createElement(HoverImageCard, {
                    src: "/assets/projects-screenshots/prototypes/proto-05.png", alt: "Signalétique",
                    label: "Système signalétique de l'exposition", aspect: "21/9", sizes: "90vw",
                    onClick: function() { setLb("/assets/projects-screenshots/prototypes/proto-05.png"); },
                  })
                )
              )
            )
          )
        )
      )
    ),

    // ── Lightbox ────────────────────────────────────────────────────────────────
    React.createElement(
      AnimatePresence,
      null,
      lb && React.createElement(
        motion.div,
        {
          key: "lb",
          initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 },
          transition: { duration: 0.22 },
          onClick: function() { setLb(null); },
          style: {
            position: "fixed" as const, inset: 0, zIndex: 10000,
            backgroundColor: "rgba(0,0,0,0.97)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "2rem", cursor: "zoom-out",
          },
        },
        React.createElement(
          motion.div,
          {
            initial: { scale: 0.86, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit:    { scale: 0.92, opacity: 0 },
            transition: { type: "spring", stiffness: 300, damping: 28 },
            onClick: function(e: React.MouseEvent) { e.stopPropagation(); },
            style: { position: "relative" as const },
          },
          React.createElement(Image, {
            src: lb, alt: "Vue agrandie", width: 1600, height: 1050,
            style: { maxWidth: "92vw", maxHeight: "90vh", width: "auto", height: "auto", objectFit: "contain" as const, borderRadius: "0.75rem" },
          }),
          React.createElement(
            "button",
            {
              onClick: function() { setLb(null); },
              style: {
                position: "absolute" as const, top: "0.75rem", right: "0.75rem",
                width: "30px", height: "30px", borderRadius: "50%",
                backgroundColor: "rgba(0,0,0,0.75)",
                border: "0.5px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.65)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              },
            },
            React.createElement(
              "svg",
              { width: "10", height: "10", viewBox: "0 0 10 10", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" },
              React.createElement("line", { x1: "1", y1: "1", x2: "9", y2: "9" }),
              React.createElement("line", { x1: "9", y1: "1", x2: "1", y2: "9" })
            )
          )
        )
      )
    )
  );
}