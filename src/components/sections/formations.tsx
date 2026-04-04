"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { FORMATIONS } from "@/data/constants";

// ─── Palette ───────────────────────────────────────────────────────────────────
const YELLOW = "#F0C427";
const PURPLE = "#6B75C7";
const BG     = "#05060f";

// ─── Types ─────────────────────────────────────────────────────────────────────
type FormationStatus = "terminé" | "en cours" | "pont";
interface Formation {
  id:          number;
  index:       string;
  period:      string;
  shortPeriod: string;
  status:      FormationStatus;
  institution: string;
  location:    string;
  degree:      string;
  mention?:    string;
  description?: readonly string[];
  annotation?:  string;
  publication?: { label: string; url: string; title: string };
}

// ─── Icône lien externe ────────────────────────────────────────────────────────
const ExtIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none"
    style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 6, flexShrink: 0 }}
  >
    <path d="M1 10L10 1M10 1H4M10 1V7"
      stroke="currentColor" strokeWidth="1.2"
      strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

// ─── FormationCard — chaque formation = une carte lisible ─────────────────────
function FormationCard({
  formation,
  index,
  cardRef,
}: {
  formation: Formation;
  index:     number;
  cardRef:   (el: HTMLDivElement | null) => void;
}) {
  const [hov, setHov] = useState(false);
  const isActive = formation.status === "en cours";
  const accent   = isActive ? YELLOW : PURPLE;

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:    "relative",
        padding:     "clamp(32px,5vh,64px) 0",
        borderTop:   `1px solid ${hov ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)"}`,
        transition:  "border-color 0.4s ease",
        cursor:      "default",
      }}
    >
      {/* Ligne colorée qui s'étend au hover */}
      <div style={{
        position:        "absolute",
        top:             0,
        left:            0,
        height:          "1px",
        width:           hov ? "100%" : "0%",
        background:      `linear-gradient(to right, ${accent}, transparent)`,
        transition:      "width 0.65s cubic-bezier(0.22,1,0.36,1)",
      }} />

      {/* ── Ligne 1 : index + statut + période ──────────────────────────── */}
      <div style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        marginBottom:   "clamp(14px,2vh,24px)",
      }}>
        {/* Index + statut */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{
            fontFamily:    "monospace",
            fontSize:      "11px",
            letterSpacing: "0.22em",
            color:         "rgba(255,255,255,0.25)",
          }}>
            {String(index + 1).padStart(2, "0")}
          </span>

          <div style={{
            display:      "flex",
            alignItems:   "center",
            gap:          "6px",
            padding:      "3px 10px",
            border:       `1px solid ${isActive ? YELLOW + "44" : "rgba(255,255,255,0.10)"}`,
            borderRadius: "1px",
          }}>
            {isActive && (
              <span style={{
                display:      "block",
                width:        "5px",
                height:       "5px",
                borderRadius: "50%",
                background:   YELLOW,
                animation:    "frmDot 2s ease-in-out infinite",
                flexShrink:   0,
              }} />
            )}
            <span style={{
              fontFamily:    "monospace",
              fontSize:      "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color:         isActive ? YELLOW : "rgba(255,255,255,0.30)",
            }}>
              {isActive ? "En cours" : "Terminé"}
            </span>
          </div>
        </div>

        {/* Période + lieu */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{
            fontFamily:    "monospace",
            fontSize:      "12px",
            letterSpacing: "0.10em",
            color:         "rgba(255,255,255,0.45)",
          }}>
            {formation.period}
          </span>
          {formation.location && (
            <span style={{
              fontFamily:    "monospace",
              fontSize:      "10px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color:         "rgba(255,255,255,0.20)",
            }}>
              {formation.location}
            </span>
          )}
        </div>
      </div>

      {/* ── Ligne 2 : diplôme (grand) ───────────────────────────────────── */}
      <h3 style={{
        margin:        0,
        fontSize:      "clamp(1.6rem,2.8vw,3rem)",
        fontWeight:    700,
        color:         isActive ? "#ffffff" : "rgba(255,255,255,0.88)",
        letterSpacing: "-0.03em",
        lineHeight:    1.0,
        marginBottom:  formation.mention ? "clamp(8px,1vh,14px)" : "clamp(16px,2vh,28px)",
      }}>
        {formation.degree}
      </h3>

      {/* ── Ligne 3 : mention ───────────────────────────────────────────── */}
      {formation.mention && (
        <div style={{
          fontFamily:    "monospace",
          fontSize:      "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color:         isActive ? YELLOW + "bb" : "rgba(255,255,255,0.28)",
          marginBottom:  "clamp(16px,2vh,28px)",
        }}>
          {formation.mention}
        </div>
      )}

      {/* ── Ligne 4 : institution ───────────────────────────────────────── */}
      <div style={{
        fontFamily:    "var(--font-space), sans-serif",
        fontSize:      "clamp(14px,1.1vw,17px)",
        color:         "rgba(255,255,255,0.45)",
        letterSpacing: "0.02em",
        marginBottom:  formation.description?.length ? "clamp(20px,3vh,36px)" : 0,
      }}>
        {formation.institution}
      </div>

      {/* ── Corps : descriptions ────────────────────────────────────────── */}
      {formation.description && formation.description.length > 0 && (
        <div style={{
          display:             "grid",
          gridTemplateColumns: formation.description.length > 1 ? "1fr 1fr" : "2fr 1fr",
          gap:                 "0 clamp(32px,4vw,64px)",
          marginBottom:        formation.annotation || formation.publication ? "clamp(20px,3vh,36px)" : 0,
        }}>
          {formation.description.map((para, j) => (
            <p key={j} style={{
              margin:        0,
              fontFamily:    "var(--font-space), sans-serif",
              fontSize:      "clamp(14px,1.05vw,16px)",
              color:         "rgba(255,255,255,0.62)",
              lineHeight:    1.85,
              textAlign:     "justify",
              hyphens:       "auto",
              letterSpacing: "0.005em",
            }}>
              {para}
            </p>
          ))}
        </div>
      )}

      {/* ── Footer : annotation + publication ──────────────────────────── */}
      {(formation.annotation || formation.publication) && (
        <div style={{
          display:    "flex",
          alignItems: "center",
          gap:        "24px",
          flexWrap:   "wrap",
          marginTop:  formation.description?.length ? 0 : "clamp(16px,2vh,28px)",
        }}>

          {formation.annotation && (
            <span style={{
              fontFamily:    "monospace",
              fontSize:      "9px",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color:         PURPLE + "77",
            }}>
              — {formation.annotation}
            </span>
          )}

          {formation.publication && (
            <PublicationLink pub={formation.publication} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Pont — séparateur discret entre étapes ────────────────────────────────────
function Pont({ annotation }: { annotation?: string }) {
  return (
    <div style={{
      display:    "flex",
      alignItems: "center",
      gap:        "16px",
      padding:    "clamp(8px,1vh,12px) 0",
    }}>
      <div style={{ width: "100%", height: "1px", background: `linear-gradient(to right, ${PURPLE}22, transparent)` }} />
      {annotation && (
        <span style={{
          fontFamily:    "monospace",
          fontSize:      "7px",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color:         PURPLE + "44",
          whiteSpace:    "nowrap",
          flexShrink:    0,
        }}>
          {annotation}
        </span>
      )}
      <div style={{ width: "100%", height: "1px", background: `linear-gradient(to left, ${PURPLE}22, transparent)` }} />
    </div>
  );
}

// ─── PublicationLink ────────────────────────────────────────────────────────────
function PublicationLink({ pub }: { pub: { label: string; url: string; title: string } }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={pub.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        gap:            "6px",
        paddingBottom:  "2px",
        borderBottom:   `1px solid ${hov ? YELLOW + "99" : "rgba(255,255,255,0.18)"}`,
        textDecoration: "none",
        color:          hov ? YELLOW : "rgba(255,255,255,0.60)",
        fontFamily:     "var(--font-space), sans-serif",
        fontSize:       "clamp(13px,1vw,15px)",
        letterSpacing:  "0.01em",
        transition:     "color 0.25s ease, border-color 0.25s ease",
      }}
    >
      {pub.title}
      <ExtIcon />
    </a>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────
const FormationsSection: React.FC = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const titleRef    = useRef<HTMLHeadingElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);

  const formations = FORMATIONS as readonly Formation[];
  const real       = formations.filter(f => f.status !== "pont");
  const realCount  = real.length;
  const current    = real.find(f => f.status === "en cours");

  let cardIndex = 0; // compteur pour les cartes (hors ponts)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {

      // ── Titre clip reveal ────────────────────────────────────────────────
      if (titleRef.current) {
        gsap.set(titleRef.current, { clipPath: "inset(0 101% 0 0)" });
        gsap.to(titleRef.current, {
          clipPath:      "inset(0 0% 0 0)",
          duration:      1.1,
          ease:          "power3.out",
          scrollTrigger: {
            trigger:       titleRef.current,
            start:         "top 82%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // ── Barre de progression scrubée ─────────────────────────────────────
      if (progressRef.current && sectionRef.current) {
        gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(progressRef.current, {
          scaleX:        1,
          ease:          "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start:   "top 55%",
            end:     "bottom 85%",
            scrub:   1.0,
          },
        });
      }

      // ── Cartes : fade + slide ────────────────────────────────────────────
      cardRefs.current.forEach((el) => {
        if (!el) return;
        gsap.set(el, { opacity: 0, y: 28 });
        gsap.to(el, {
          opacity:       1,
          y:             0,
          duration:      0.85,
          ease:          "power3.out",
          scrollTrigger: {
            trigger:       el,
            start:         "top 84%",
            toggleActions: "play none none reverse",
          },
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @keyframes frmDot {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.6); }
        }
      `}</style>

      <section
        id="formations"
        ref={sectionRef}
        style={{ position: "relative", zIndex: 10, width: "100%", background: BG }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 6vw" }}>

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div style={{
            paddingTop:    "clamp(80px,12vh,140px)",
            paddingBottom: "clamp(48px,7vh,96px)",
          }}>

            {/* Étiquette */}
            <div style={{
              display:      "flex",
              alignItems:   "center",
              gap:          "12px",
              marginBottom: "clamp(20px,2.8vh,36px)",
            }}>
              <div style={{ width: "24px", height: "1px", background: YELLOW + "88" }} />
              <span style={{
                fontFamily:    "monospace",
                fontSize:      "9px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color:         YELLOW,
              }}>
                Parcours
              </span>
            </div>

            {/* Titre */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px" }}>
              <h2
                ref={titleRef}
                style={{
                  margin:        0,
                  fontSize:      "clamp(3rem,7vw,6.5rem)",
                  fontWeight:    700,
                  color:         "#fff",
                  letterSpacing: "-0.04em",
                  lineHeight:    0.95,
                }}
              >
                FORMA-<br />TIONS
              </h2>

              {/* Bloc résumé — formation en cours */}
              {current && (
                <div style={{
                  display:       "flex",
                  flexDirection: "column",
                  alignItems:    "flex-end",
                  gap:           "6px",
                  paddingBottom: "8px",
                  maxWidth:      "300px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      display:      "block",
                      width:        "6px",
                      height:       "6px",
                      borderRadius: "50%",
                      background:   YELLOW,
                      animation:    "frmDot 2s ease-in-out infinite",
                      flexShrink:   0,
                    }} />
                    <span style={{
                      fontFamily:    "monospace",
                      fontSize:      "8px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color:         YELLOW,
                    }}>
                      En cours
                    </span>
                  </div>
                  <span style={{
                    fontFamily:    "var(--font-space), sans-serif",
                    fontSize:      "13px",
                    color:         "rgba(255,255,255,0.50)",
                    textAlign:     "right",
                    lineHeight:    1.4,
                  }}>
                    {current.degree}
                  </span>
                </div>
              )}
            </div>

            {/* Barre de progression scrubée */}
            <div style={{
              position:   "relative",
              marginTop:  "clamp(28px,4vh,48px)",
              height:     "1px",
              background: "rgba(255,255,255,0.06)",
              overflow:   "hidden",
            }}>
              <div
                ref={progressRef}
                style={{
                  position:   "absolute",
                  inset:      0,
                  background: `linear-gradient(to right, ${YELLOW}, ${PURPLE}88, transparent)`,
                }}
              />
            </div>

            {/* Compteur */}
            <div style={{
              display:        "flex",
              justifyContent: "flex-end",
              marginTop:      "10px",
            }}>
              <span style={{
                fontFamily:    "monospace",
                fontSize:      "9px",
                letterSpacing: "0.22em",
                color:         "rgba(255,255,255,0.18)",
              }}>
                {String(realCount).padStart(2, "0")} étapes
              </span>
            </div>
          </div>

          {/* ── Corps ──────────────────────────────────────────────────────── */}
          <div style={{ paddingBottom: "clamp(80px,12vh,140px)" }}>
            {formations.map((f, i) => {
              if (f.status === "pont") {
                return (
                  <div
                    key={f.id}
                    ref={el => { cardRefs.current[i] = el; }}
                  >
                    <Pont annotation={f.annotation} />
                  </div>
                );
              }

              const ci = cardIndex++;
              return (
                <FormationCard
                  key={f.id}
                  formation={f}
                  index={ci}
                  cardRef={el => { cardRefs.current[i] = el; }}
                />
              );
            })}
          </div>

        </div>
      </section>
    </>
  );
};

export default FormationsSection;