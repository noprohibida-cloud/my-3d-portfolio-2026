"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const C = {
  BG:     "#05060f",
  YELLOW: "#F0C427",
  VIOLET: "#6B75C7",
  WHITE:  "#ffffff",
} as const;

const BIO_BODY =
  "Formé en lettres modernes avant de bifurquer vers le design numérique, " +
  "je construis des dispositifs qui interrogent la frontière entre l'outil et le geste. " +
  "Scénographie, installations immersives, live coding : autant de façons d'habiter " +
  "le flux numérique plutôt que de le subir. " +
  "Technical artist de formation hybride, je travaille à la jonction du code, du son " +
  "et de l'image temps réel — là où l'algorithme devient matière sensible, " +
  "et où la performance déborde l'écran.";

const WhoAmISection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const indexRef   = useRef<HTMLSpanElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const bodyRef    = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {

      if (titleRef.current) {
        gsap.set(titleRef.current, { clipPath: "inset(0 102% 0 0)" });
        gsap.to(titleRef.current, {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.2, ease: "power4.out",
          scrollTrigger: {
            trigger: titleRef.current, start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (indexRef.current) {
        gsap.from(indexRef.current, {
          opacity: 0, y: 8, duration: 0.7, delay: 0.3, ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current, start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (lineRef.current) {
        gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(lineRef.current, {
          scaleX: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: {
            trigger: lineRef.current, start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (bodyRef.current) {
        gsap.from(bodyRef.current, {
          opacity: 0, y: 20, duration: 1.0, ease: "power3.out",
          scrollTrigger: {
            trigger: bodyRef.current, start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="qui-suis-je"
      ref={sectionRef}
      style={{
        position:   "relative",
        width:      "100%",
        minHeight:  "100dvh",
        background: C.BG,
        zIndex:     10,
        overflow:   "hidden",
      }}
    >
      {/* ── Shader plein fond — même pattern que le hero ── */}
      <iframe
        src="/mandelbox.html"
        aria-hidden="true"
        tabIndex={-1}
        style={{
          position:      "absolute",
          inset:         0,
          width:         "100%",
          height:        "100%",
          border:        "none",
          pointerEvents: "none",
          zIndex:        0,
        }}
      />

      {/* Fondu haut — raccord avec la section précédente */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "140px",
        background: `linear-gradient(to bottom, ${C.BG}, transparent)`,
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* Fondu bas — raccord avec la section suivante */}
      <div aria-hidden="true" style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "140px",
        background: `linear-gradient(to top, ${C.BG}, transparent)`,
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* ── Contenu ── */}
      <div
        style={{
          position:       "relative",
          zIndex:         2,
          maxWidth:       "1400px",
          margin:         "0 auto",
          padding:        "0 6vw",
          minHeight:      "100dvh",
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "center",
        }}
      >
        {/* Bloc principal avec flou élégant */}
        <div
          style={{
            // Frosted glass — lisibilité sur le shader
            background:           "rgba(5, 6, 15, 0.52)",
            backdropFilter:       "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border:               "1px solid rgba(255,255,255,0.06)",
            borderRadius:         "4px",
            padding:              "clamp(36px,6vw,72px)",
            maxWidth:             "720px",
          }}
        >
          {/* Index + Titre */}
          <div
            style={{
              overflow:      "hidden",
              display:       "flex",
              alignItems:    "flex-end",
              gap:           "clamp(16px,2vw,32px)",
              marginBottom:  "clamp(32px,5vh,56px)",
              paddingBottom: "clamp(24px,4vh,40px)",
              borderBottom:  "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span
              ref={indexRef}
              style={{
                fontFamily:    "monospace",
                fontSize:      "10px",
                letterSpacing: "0.24em",
                color:         `${C.YELLOW}55`,
                paddingBottom: "8px",
                flexShrink:    0,
              }}
            >
              00
            </span>
            <h2
              ref={titleRef}
              style={{
                margin:        0,
                fontSize:      "55px",
                fontWeight:    200,
                color:         C.WHITE,
                lineHeight:    0.95,
                fontFamily:    "var(--font-cat), sans-serif",
              }}
            >
              QUI SUIS-JE ?
            </h2>
          </div>

          {/* Ligne + Bio */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(24px,3.5vh,40px)" }}>

            <div
              ref={lineRef}
              style={{
                height:     "1px",
                width:      "100%",
                background: `linear-gradient(to right, ${C.VIOLET}88 0%, rgba(255,255,255,0.04) 100%)`,
              }}
            />

            <p
              ref={bodyRef}
              style={{
                margin:        0,
                fontFamily:    "var(--font-space), sans-serif",
                fontSize:      "clamp(15px,1.2vw,18px)",
                color:         "rgba(255,255,255,0.78)",
                lineHeight:    2.0,
                letterSpacing: "0.008em",
              }}
            >
              {BIO_BODY}
            </p>

          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoAmISection;