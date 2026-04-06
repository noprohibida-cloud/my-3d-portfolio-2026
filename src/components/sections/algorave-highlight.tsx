"use client";

import React, { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  BG:     "#000000",
  BLUE_A: "#00a3ff",
  WHITE:  "#ffffff",
} as const;

// ─── Waveform canvas ─────────────────────────────────────────────────────────
const WaveformCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let t = 0;
    const BAR_COUNT = 80;
    const GAP = 2;

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      const barW = (W - (BAR_COUNT - 1) * GAP) / BAR_COUNT;

      for (let i = 0; i < BAR_COUNT; i++) {
        const norm = i / BAR_COUNT;
        const amp =
          0.35 * Math.sin(norm * Math.PI * 6  + t * 1.1) +
          0.25 * Math.sin(norm * Math.PI * 12 + t * 2.3) +
          0.15 * Math.sin(norm * Math.PI * 3  + t * 0.7) +
          0.10 * Math.sin(norm * Math.PI * 20 + t * 3.1) +
          0.10 * Math.sin(i * 0.44 + t * 1.8);

        const envelope   = Math.sin(norm * Math.PI) * 0.7 + 0.3;
        const heightFrac = Math.abs(amp) * envelope;
        const barH = Math.max(2, heightFrac * H * 0.88);
        const x = i * (barW + GAP);
        const y = (H - barH) / 2;

        const alpha = 0.08 + heightFrac * 0.28;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(x, y, barW, barH);

        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.2})`;
        ctx.fillRect(x, H / 2, barW, barH * 0.15);
      }

      t += 0.022;
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      "absolute",
        inset:         0,
        width:         "100%",
        height:        "100%",
        pointerEvents: "none",
        zIndex:        0,
      }}
    />
  );
};

// ─── Composant principal ─────────────────────────────────────────────────────
const AlgoraveHighlight: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  // ── Glitch hover titre ──
  useEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;
    const original    = "ALGORAVE";
    const glitchChars = "▓▒░█╬╪╩╦╣╠║╗4L60R4V3";
    let raf: number;
    let frame = 0;

    function glitch() {
      if (!isHovering.current || !titleEl) return;
      frame++;
      if (frame % 3 === 0) {
        titleEl.textContent = original
          .split("")
          .map((ch) =>
            Math.random() < 0.18
              ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
              : ch
          )
          .join("");
      }
      raf = requestAnimationFrame(glitch);
    }

    const onEnter = () => { isHovering.current = true; glitch(); };
    const onLeave = () => {
      isHovering.current = false;
      cancelAnimationFrame(raf);
      titleEl.textContent = original;
    };
    titleEl.addEventListener("mouseenter", onEnter);
    titleEl.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      titleEl.removeEventListener("mouseenter", onEnter);
      titleEl.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // ── GSAP reveals ──
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {

      if (titleRef.current) {
        gsap.set(titleRef.current, { clipPath: "inset(0 0 102% 0)" });
        gsap.to(titleRef.current, {
          clipPath: "inset(0 0 0% 0)",
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (taglineRef.current) {
        gsap.from(taglineRef.current, {
          opacity: 0, x: -20, duration: 0.8, ease: "power3.out", delay: 0.15,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (contentRef.current) {
        gsap.from(contentRef.current, {
          opacity: 0, y: 20, duration: 0.85, ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 86%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (videoRef.current) {
        gsap.from(videoRef.current, {
          opacity: 0, y: 32, duration: 1.0, ease: "power3.out",
          scrollTrigger: {
            trigger: videoRef.current,
            start: "top 84%",
            toggleActions: "play none none reverse",
          },
        });
      }

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── Style partagé pour les blocs frosted ──
  const frostedStyle: React.CSSProperties = {
    background:           "rgba(0,0,0,0.58)",
    backdropFilter:       "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border:               "1px solid rgba(255,255,255,0.07)",
    borderRadius:         "4px",
    padding:              "clamp(20px,3vw,36px)",
  };

  return (
    <section
      id="algorave"
      ref={sectionRef}
      style={{
        position:   "relative",
        width:      "100%",
        background: C.BG,
        zIndex:     10,
        overflow:   "hidden",
      }}
    >
      {/* Waveform animée en fond */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <WaveformCanvas />
      </div>

      {/* Fondus haut et bas */}
      <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(to bottom, #000000, transparent)", pointerEvents: "none", zIndex: 2 }} />
      <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(to top, #000000, transparent)", pointerEvents: "none", zIndex: 2 }} />

      {/* ── Contenu ── */}
      <div
        style={{
          position: "relative",
          zIndex:   3,
          maxWidth: "1400px",
          margin:   "0 auto",
          padding:  "clamp(64px,10vh,120px) 6vw clamp(72px,11vh,130px)",
        }}
      >
        {/* Tagline */}
        <div
          ref={taglineRef}
          style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "clamp(16px,2.5vh,28px)" }}
        >
          <div style={{ width: "28px", height: "1px", background: C.BLUE_A, opacity: 0.7, flexShrink: 0 }} />
          <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.28em", color: C.BLUE_A, textTransform: "uppercase", opacity: 0.85 }}>
            PROJECT HIGHLIGHT / COLLECTIF HTMEL
          </span>
        </div>

        {/* Titre */}
        <h2
          ref={titleRef}
          style={{
            margin:        0,
            fontFamily:    "monospace",
            fontSize:      "clamp(3.8rem,9vw,8.5rem)",
            fontWeight:    700,
            color:         C.WHITE,
            letterSpacing: "-0.02em",
            lineHeight:    0.92,
            cursor:        "crosshair",
            userSelect:    "none",
            marginBottom:  "clamp(32px,5vh,56px)",
            borderBottom:  `2px solid ${C.BLUE_A}`,
            paddingBottom: "clamp(12px,1.8vh,20px)",
            display:       "inline-block",
          }}
        >
          ALGORAVE
        </h2>

        {/* Corps : 2 colonnes frosted */}
        <div
          ref={contentRef}
          style={{
            display:             "grid",
            gridTemplateColumns: "52fr 48fr",
            gap:                 "clamp(16px,2.5vw,32px)",
            alignItems:          "stretch",
            marginBottom:        "clamp(48px,7vh,80px)",
          }}
        >
          {/* Colonne gauche */}
          <div style={{ ...frostedStyle, display: "flex", flexDirection: "column", gap: "clamp(20px,3vh,28px)" }}>
            <p style={{
              margin:        0,
              fontFamily:    "var(--font-space), sans-serif",
              fontSize:      "clamp(14px,1.1vw,16px)",
              color:         "rgba(255,255,255,0.72)",
              lineHeight:    1.85,
              letterSpacing: "0.005em",
            }}>
              Performance de live coding et VJing public, portée par notre collectif
              étudiant <strong style={{ color: C.WHITE, fontWeight: 500 }}>HTMEL</strong>.
              Un spectacle algorithmique et musical généré en temps réel — code projeté,
              son synthétisé, image produite à la volée, devant audience.
            </p>

            <a
              href="https://www.blockmedpro.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "12px",
                width:          "fit-content",
                padding:        "12px 20px",
                border:         `1px solid ${C.BLUE_A}44`,
                borderRadius:   "2px",
                fontFamily:     "monospace",
                fontSize:       "10px",
                letterSpacing:  "0.22em",
                color:          C.BLUE_A,
                textDecoration: "none",
                textTransform:  "uppercase",
                transition:     "border-color 0.3s, background 0.3s, color 0.3s",
                background:     "transparent",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = C.BLUE_A;
                el.style.background  = `${C.BLUE_A}14`;
                el.style.color       = C.WHITE;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = `${C.BLUE_A}44`;
                el.style.background  = "transparent";
                el.style.color       = C.BLUE_A;
              }}
            >
              <span>VOIR LE PROJET</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Colonne droite : stats */}
          <div style={{ ...frostedStyle, display: "flex", flexDirection: "column", gap: "clamp(12px,2vh,20px)" }}>
            {[
              { label: "TYPE",      value: "Performance publique" },
              { label: "COLLECTIF", value: "HTMEL"                },
              { label: "OUTILS",    value: "TidalCycles / Hydra"  },
              { label: "FORMAT",    value: "Live — temps réel"    },
            ].map(({ label, value }, i, arr) => (
              <div
                key={label}
                style={{
                  paddingBottom: i < arr.length - 1 ? "clamp(12px,1.8vh,18px)" : 0,
                  borderBottom:  i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <div style={{ fontFamily: "monospace", fontSize: "7.5px", letterSpacing: "0.24em", color: `${C.BLUE_A}66`, textTransform: "uppercase", marginBottom: "4px" }}>
                  {label}
                </div>
                <div style={{ fontFamily: "var(--font-space), sans-serif", fontSize: "clamp(12px,0.95vw,14px)", color: "rgba(255,255,255,0.70)", letterSpacing: "0.02em" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bloc vidéo ── */}
        <div ref={videoRef}>
          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "clamp(16px,2.5vh,24px)" }}>
            <div style={{ width: "28px", height: "1px", background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
            <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.28em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase" }}>
              PERFORMANCE — EXTRAIT
            </span>
          </div>

          {/* Player vidéo */}
          <div
            style={{
              position:     "relative",
              width:        "100%",
              aspectRatio:  "16 / 9",
              background:   "#080810",
              border:       "1px solid rgba(255,255,255,0.08)",
              borderRadius: "4px",
              overflow:     "hidden",
            }}
          >
            {/*
              ── INSTRUCTIONS ──────────────────────────────────────────────
              Option A — Fichier local :
                Dépose ta vidéo dans /public/assets/videos/algorave.mp4
                et remplace src ci-dessous par "/assets/videos/algorave.mp4"

              Option B — Vimeo (recommandé pour la qualité) :
                Remplace le <video> entier par :
                <iframe
                  src="https://player.vimeo.com/video/TON_ID?autoplay=0&loop=1&color=00a3ff&byline=0&portrait=0"
                  style={{ width:"100%", height:"100%", border:0 }}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />

              Option C — YouTube :
                <iframe
                  src="https://www.youtube.com/embed/TON_ID?controls=1&modestbranding=1"
                  style={{ width:"100%", height:"100%", border:0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  allowFullScreen
                />
              ─────────────────────────────────────────────────────────────
            */}
            <video
              controls
              loop
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              src="/assets/videos/algorave.mp4"
            >
              Ton navigateur ne supporte pas la lecture vidéo.
            </video>

            {/* Overlay scanlines discret */}
            <div
              aria-hidden="true"
              style={{
                position:        "absolute",
                inset:           0,
                pointerEvents:   "none",
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
                zIndex:          1,
              }}
            />
          </div>

          {/* Légende */}
          <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.20em", color: "rgba(255,255,255,0.16)", textTransform: "uppercase" }}>
              HTMEL — ALGORAVE LIVE
            </span>
            <span style={{ fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.20em", color: "rgba(255,255,255,0.10)", textTransform: "uppercase" }}>
              MONTPELLIER, 2024
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AlgoraveHighlight;