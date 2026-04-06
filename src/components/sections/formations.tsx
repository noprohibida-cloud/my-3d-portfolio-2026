"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { FORMATIONS } from "@/data/constants";

// ─── Types ─────────────────────────────────────────────────────────────────
export type FormationStatus = "terminé" | "en cours" | "pont";

export interface FormationPublication {
  label: string;
  url:   string;
  title: string;
}

export interface Formation {
  id:          number;
  index:       string;
  period:      string;
  shortPeriod: string;
  status:      FormationStatus;
  institution: string;
  location:    string;
  degree:      string;
  mention?:    string;
  description: string[];
  annotation?: string;
  publication?: FormationPublication;
}

const BG = "#05060f";
const YELLOW = "#F0C427";

// ─── Icône lien externe ────────────────────────────────────────────────────
const ExternalLinkIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
    style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 5, flexShrink: 0 }}
  >
    <path d="M1 9L9 1M9 1H3M9 1V7"
      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Section ───────────────────────────────────────────────────────────────
const FormationsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const entryRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Formations réelles (pas les ponts) — pour la nav sticky
  const allFormations = FORMATIONS as readonly Formation[];
  const realFormations = allFormations.filter((f) => f.status !== "pont");

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    // Titre : clipPath reveal
    if (titleRef.current) {
      gsap.set(titleRef.current, { clipPath: "inset(0 101% 0 0)" });
      gsap.to(titleRef.current, {
        clipPath:  "inset(0 0% 0 0)",
        duration:  1.1,
        ease:      "power3.out",
        scrollTrigger: {
          trigger:       titleRef.current,
          start:         "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    }

    // ScrollTrigger par entrée réelle pour activeIdx
    const triggers = entryRefs.current.map((el, i) => {
      if (!el) return null;
      return ScrollTrigger.create({
        trigger:     el,
        start:       "top 55%",
        end:         "bottom 45%",
        onEnter:     () => setActiveIdx(i),
        onEnterBack: () => setActiveIdx(i),
      });
    });

    return () => triggers.forEach((t) => t?.kill());
  }, []);

  return (
    <section
      id="formations"
      ref={sectionRef}
      style={{ position: "relative", zIndex: 10, width: "100%", background: BG }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 6vw" }}>

        {/* ── Header ── */}
        <div style={{
          paddingTop:    "clamp(80px,12vh,140px)",
          paddingBottom: "clamp(40px,6vh,80px)",
          borderBottom:  "1px solid rgb(255, 255, 255)",
          overflow:      "hidden",
        }}>
          <h2
            ref={titleRef}
            style={{
              margin:        0,
              fontSize:      "clamp(2.5rem,6vw,5rem)",
              fontWeight:    700,
              color:         "#fff",
              letterSpacing: "-0.04em",
              lineHeight:    1,
              whiteSpace:    "nowrap",
            }}
          >
            FORMATIONS
          </h2>
        </div>

        {/* ── Deux colonnes — même grid qu'Expériences ── */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "22% 1fr",
          gap:                 "0 5vw",
          paddingTop:          "clamp(60px,8vh,100px)",
        }}>

          {/* ── Colonne gauche sticky ── */}
          <div style={{ position: "relative" }}>
            <div style={{
              position:      "sticky",
              top:           "30vh",
              display:       "flex",
              flexDirection: "column",
            }}>
              {/* Numéro courant */}
              <div style={{
                fontFamily:    "monospace",
                fontSize:      "clamp(4rem,8vw,7rem)",
                fontWeight:    700,
                color:         "#fff",
                lineHeight:    1,
                letterSpacing: "-0.06em",
              }}>
                {String(activeIdx + 1).padStart(2, "0")}
              </div>

              {/* Nav formations */}
              <div style={{ position: "relative" }}>
                {/* Rail vertical */}
                <div style={{
                  position:   "absolute",
                  left:       "5px",
                  top:        "10px",
                  bottom:     "10px",
                  width:      "1px",
                  background: "rgba(255,255,255,0.1)",
                }} />

                {realFormations.map((f, i) => (
                  <div key={f.id} style={{
                    display:    "flex",
                    alignItems: "center",
                    gap:        "14px",
                    padding:    "10px 0",
                    position:   "relative",
                  }}>
                    {/* Dot */}
                    <div style={{
                      width:        "11px",
                      height:       "11px",
                      borderRadius: "50%",
                      border:       `1px solid ${activeIdx === i ? YELLOW : "rgba(255,255,255,0.2)"}`,
                      background:   activeIdx === i ? YELLOW : "transparent",
                      flexShrink:   0,
                      transition:   "all 0.35s ease",
                      zIndex:       1,
                    }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{
                        fontFamily:    "var(--font-space), sans-serif",
                        fontSize:      "10px",
                        letterSpacing: "0.12em",
                        color:         activeIdx === i ? YELLOW : "rgba(255,255,255,0.25)",
                        transition:    "color 0.35s ease",
                      }}>
                        {f.shortPeriod}
                      </span>
                      <span style={{
                        fontSize:     "11px",
                        fontFamily:   "var(--font-space), sans-serif",
                        lineHeight:   1.2,
                        maxWidth:     "120px",
                        whiteSpace:   "nowrap",
                        overflow:     "hidden",
                        textOverflow: "ellipsis",
                        color:        activeIdx === i ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
                        transition:   "color 0.35s ease",
                      }}>
                        {f.degree}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Colonne droite — entrées ── */}
          <div style={{
            display:       "flex",
            flexDirection: "column",
            paddingBottom: "clamp(80px,12vh,140px)",
            minWidth:      0,
          }}>
            {realFormations.map((f, i) => (
              <div
                key={f.id}
                ref={(el) => { entryRefs.current[i] = el; }}
                style={{
                  display:       "flex",
                  flexDirection: "column",
                  paddingTop:    i === 0 ? 0 : "clamp(35px,1vh,100px)",
                  paddingBottom: "clamp(40px,1vh,100px)",
                  borderTop:     i === 0 ? "none" : "1px solid rgb(255, 255, 255)",
                  minWidth:      0,
                }}
              >
                {/* ── En-tête de l'entrée ── */}
                <div style={{ marginBottom: "clamp(18px,2.5vh,28px)" }}>

                  {/* Index + période sur une ligne */}
                  <div style={{
                    display:       "flex",
                    alignItems:    "baseline",
                    gap:           "14px",
                    marginBottom:  "clamp(8px,1vh,12px)",
                  }}>
                    <span style={{
                      fontFamily:    "var(--font-space), sans-serif",
                      fontSize:      "15px",
                      letterSpacing: "0.14em",
                      color:         "#ffffff",
                      opacity:       1,
                    }}>
                      {f.period}
                    </span>
                    {f.location && (
                      <>
                        <span style={{ color: "#ffffff", opacity: 1, fontSize: "17px" }}>┆ ⋆ ┆</span>
                        <span style={{
                          fontFamily:    "var(--font-space), sans-serif",
                          fontSize:      "15px",
                          letterSpacing: "0.08em",
                          color:         "#F0C427",
                          opacity:       1,
                        }}>
                          {f.location}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Diplôme */}
                  <h3 style={{
                    margin:        0,
                    fontFamily:    "var(--font-space), sans-serif",
                    fontSize:      "clamp(1.3rem,2vw,1.7rem)",
                    fontWeight:    650,
                    color:         "#ffffff",
                    letterSpacing: "-0.01em",
                    marginLeft:    "-0.035em",
                    lineHeight:    1.08,
                    marginBottom:  "clamp(6px,0.7vh,10px)",
                    whiteSpace:    "nowrap",
                    overflow:      "hidden",
                    textOverflow:  "ellipsis",
                  }}>
                    {f.degree}
                  </h3>

                  {/* Mention */}
                  {f.mention && (
                    <div style={{
                      fontFamily:    "var(--font-space), sans-serif",
                      fontSize:      "10.5px",
                      letterSpacing: "0.16em",
                      color:         "#ffffff",
                      opacity:       1,
                      textTransform: "uppercase",
                      marginBottom:  "clamp(6px,0.7vh,10px)",
                    }}>
                      {f.mention}
                    </div>
                  )}

                  {/* Institution */}
                  <div style={{
                    fontFamily:    "var(--font-space), sans-serif",
                    fontSize:      "13px",
                    color:         "#ffffff",
                    opacity:       0.38,
                    letterSpacing: "0.04em",
                  }}>
                    {f.institution}
                  </div>
                </div>

                {/* Séparateur jaune actif */}
                <div style={{
                  height:       "1px",
                  width:        "100%",
                  background:   activeIdx === i
                    ? `linear-gradient(to right, ${YELLOW} 0%, rgba(240,196,39,0.18) 50%, rgba(255,255,255,0.02) 100%)`
                    : "rgba(255,255,255,0.06)",
                  transition:   "background 0.6s ease",
                  marginBottom: "clamp(20px,2.8vh,32px)",
                }} />

                {/* Descriptions */}
                {f.description?.length > 0 && (
                  <div style={{
                    display:             "grid",
                    gridTemplateColumns: f.description.length > 1 ? "1fr 1fr" : "1fr",
                    gap:                 "0 clamp(24px,3vw,48px)",
                    marginBottom:        f.annotation || f.publication ? "clamp(20px,2.8vh,32px)" : 0,
                  }}>
                    {f.description.map((para, j) => (
                      <p key={j} style={{
                        margin:             0,
                        fontFamily:         "var(--font-space), sans-serif",
                        fontSize:           "clamp(13px,1.1vw,15.5px)",
                        color:              "#ffffff",
                        opacity:            0.60,
                        lineHeight:         1.92,
                        textAlign:          "justify",
                        hyphens:            "auto",
                        hyphenateCharacter: "'‐'",
                        overflowWrap:       "break-word",
                        wordBreak:          "break-word",
                        letterSpacing:      "0.005em",
                        fontKerning:        "normal",
                        fontOpticalSizing:  "auto",
                        whiteSpace: "pre-line",
                      }}>
                        {para}
                      </p>
                    ))}
                  </div>
                )}
                {/* Lien publication DUMAS */}
                {f.publication && (
                  <a
                    href={f.publication.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "space-between",
                      gap:            "10px",
                      marginTop:      f.annotation ? 0 : f.description?.length ? "clamp(16px,2vh,24px)" : 0,
                      paddingBottom:  "10px",
                      borderBottom:   `1px solid rgba(240,196,39,0.22)`,
                      textDecoration: "none",
                      cursor:         "pointer",
                      transition:     "border-color 0.25s",
                      color:          "inherit",
                      alignSelf:      "flex-start",
                      width:          "100%",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = `rgba(240,196,39,0.55)`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = `rgba(240,196,39,0.22)`;
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      <span style={{
                        fontFamily:    "var(--font-space), sans-serif",
                        fontSize:      "15px",
                        fontWeight:    650,
                        color:         YELLOW,
                        opacity:       1,
                        textTransform: "uppercase",
                      }}>
                        {f.publication.label}
                      </span>
                      <span style={{
                        fontFamily:    "var(--font-space), sans-serif",
                        fontSize:      "15px",
                        color:         "#ffffff",
                        opacity:       1,
                      }}>
                        {f.publication.title}
                      </span>
                    </div>
                    <ExternalLinkIcon />
                  </a>
                )}

              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FormationsSection;