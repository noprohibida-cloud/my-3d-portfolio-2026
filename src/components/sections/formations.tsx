"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { FORMATIONS } from "@/data/constants";

// ─── Types exportés ───────────────────────────────────────────────────────────
export type FormationStatus = "terminé" | "en cours" | "pont";

export interface FormationPublication {
  label: string;
  url: string;
  title: string;
}

export interface Formation {
  id: number;
  index: string;
  period: string;
  shortPeriod: string;
  status: FormationStatus;
  institution: string;
  location: string;
  degree: string;
  mention?: string;
  description: string[];
  annotation?: string;
  publication?: FormationPublication;
}

// ─── Couleurs par statut ──────────────────────────────────────────────────────
const STATUS_COLOR: Record<FormationStatus, string> = {
  "terminé":  "rgba(255,255,255,0.18)",
  "en cours": "#F0C427",
  "pont":     "#6B75C7",
};

const STATUS_LABEL: Record<FormationStatus, string> = {
  "terminé":  "TERMINÉ",
  "en cours": "EN COURS",
  "pont":     "TRANSITION",
};

// ─── ExternalLinkIcon ─────────────────────────────────────────────────────────
const ExternalLinkIcon = () => (
  <svg
    width="10" height="10" viewBox="0 0 10 10" fill="none"
    style={{ display: "inline-block", verticalAlign: "middle", marginLeft: "5px", flexShrink: 0 }}
  >
    <path
      d="M1 9L9 1M9 1H3M9 1V7"
      stroke="currentColor" strokeWidth="1.2"
      strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

// ─── FormationEntry ───────────────────────────────────────────────────────────
// Chaque entrée reçoit ses refs directement (pattern portfolio existant)
interface EntryProps {
  formation: Formation;
  isLast: boolean;
  setEntryRef:   (el: HTMLDivElement | null) => void;
  setNodeRef:    (el: HTMLDivElement | null) => void;
  setContentRef: (el: HTMLDivElement | null) => void;
}

function FormationEntry({ formation, isLast, setEntryRef, setNodeRef, setContentRef }: EntryProps) {
  const isPont     = formation.status === "pont";
  const isEnCours  = formation.status === "en cours";
  const isTerminé  = formation.status === "terminé";
  const nodeColor  = STATUS_COLOR[formation.status];

  return (
    <div
      ref={setEntryRef}
      style={{
        display:             "grid",
        gridTemplateColumns: "1fr 48px 1fr",
        position:            "relative",
        paddingBottom:       isLast ? 0 : isPont ? "clamp(32px,4vh,52px)" : "clamp(56px,8vh,100px)",
        opacity:             isPont ? 0.6 : 1,
      }}
    >
      {/* ── Col gauche : méta ─────────────────────────────────────────── */}
      <div style={{
        paddingRight:  "clamp(20px,3vw,48px)",
        paddingTop:    "2px",
        textAlign:     "right",
        display:       "flex",
        flexDirection: "column",
        alignItems:    "flex-end",
        gap:           "5px",
      }}>
        {!isPont && (
          <>
            <span style={{
              fontFamily:    "monospace",
              fontSize:      "9px",
              letterSpacing: "0.22em",
              color:         nodeColor,
              textTransform: "uppercase",
            }}>
              {STATUS_LABEL[formation.status]}
            </span>
            <span style={{
              fontFamily:    "monospace",
              fontSize:      "11px",
              letterSpacing: "0.12em",
              color:         "rgba(255,255,255,0.28)",
            }}>
              {formation.period}
            </span>
            <span style={{
              fontFamily:    "monospace",
              fontSize:      "9px",
              letterSpacing: "0.20em",
              color:         "rgba(255,255,255,0.13)",
              textTransform: "uppercase",
            }}>
              {formation.location}
            </span>
          </>
        )}
      </div>

      {/* ── Col centrale : nœud ───────────────────────────────────────── */}
      <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        <div
          ref={setNodeRef}
          style={{
            position:     "absolute",
            top:          isPont ? "50%" : "4px",
            left:         "50%",
            transform:    "translate(-50%, 0) scale(0)",
            width:        isEnCours ? "13px" : isPont ? "6px" : "9px",
            height:       isEnCours ? "13px" : isPont ? "6px" : "9px",
            borderRadius: "50%",
            background:   isPont ? "transparent" : nodeColor,
            border:       `1px solid ${nodeColor}`,
            boxShadow:    isEnCours ? `0 0 14px 4px #F0C42740` : "none",
            opacity:      0,
            zIndex:       2,
          }}
        />
      </div>

      {/* ── Col droite : contenu ──────────────────────────────────────── */}
      <div
        ref={setContentRef}
        style={{
          paddingLeft: "clamp(20px,3vw,48px)",
          opacity:     0,
          transform:   "translateY(20px)",
        }}
      >
        {isPont ? (
          /* Pont narratif — une seule ligne annotation */
          <div style={{
            paddingTop:    "clamp(16px,2vh,26px)",
            display:       "flex",
            alignItems:    "center",
            gap:           "8px",
          }}>
            <span style={{
              fontFamily:    "monospace",
              fontSize:      "9px",
              letterSpacing: "0.30em",
              color:         "#6B75C7",
              textTransform: "uppercase",
            }}>
              ↳ {formation.annotation}
            </span>
          </div>
        ) : (
          <>
            {/* Index mono */}
            <div style={{
              fontFamily:    "monospace",
              fontSize:      "9px",
              letterSpacing: "0.22em",
              color:         isEnCours ? "rgba(240,196,39,0.40)" : "rgba(255,255,255,0.10)",
              marginBottom:  "clamp(10px,1.4vh,16px)",
            }}>
              {formation.index} ——
            </div>

            {/* Diplôme — grand titre */}
            <h3 style={{
              fontFamily:    "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize:      "clamp(1.05rem,2vw,2rem)",
              fontWeight:    700,
              color:         isEnCours ? "#ffffff" : "rgba(255,255,255,0.80)",
              letterSpacing: "-0.03em",
              lineHeight:    1.05,
              marginBottom:  "clamp(5px,0.7vh,9px)",
            }}>
              {formation.degree}
            </h3>

            {/* Parcours / mention */}
            {formation.mention && (
              <div style={{
                fontFamily:    "monospace",
                fontSize:      "9px",
                letterSpacing: "0.18em",
                color:         isEnCours ? "#F0C427" : "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
                marginBottom:  "clamp(8px,1.2vh,14px)",
              }}>
                {formation.mention}
              </div>
            )}

            {/* Institution */}
            <div style={{
              fontFamily:    "var(--font-space), sans-serif",
              fontSize:      "13px",
              color:         "rgba(255,255,255,0.38)",
              marginBottom:  "clamp(12px,1.8vh,22px)",
              letterSpacing: "0.04em",
            }}>
              {formation.institution}
            </div>

            {/* Séparateur actif/inactif */}
            <div style={{
              height:       "1px",
              width:        "100%",
              background:   isEnCours
                ? "linear-gradient(to right, #F0C427 0%, rgba(107,117,199,.22) 50%, rgba(255,255,255,.03) 100%)"
                : "rgba(255,255,255,0.06)",
              marginBottom: "clamp(12px,1.8vh,22px)",
            }} />

            {/* Description */}
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(7px,1vh,12px)", marginBottom: "clamp(12px,1.8vh,22px)" }}>
              {formation.description.map((para, j) => (
                <p key={j} style={{
                  fontFamily:    "var(--font-space), sans-serif",
                  fontSize:      "clamp(12px,1.0vw,13.5px)",
                  color:         "rgba(255,255,255,0.50)",
                  lineHeight:    1.88,
                  textAlign:     "justify",
                  hyphens:       "auto",
                  letterSpacing: "0.005em",
                }}>
                  {para}
                </p>
              ))}
            </div>

            {/* Badge annotation (ex: MISE À NIVEAU) */}
            {formation.annotation && (
              <div style={{
                display:       "inline-flex",
                alignItems:    "center",
                gap:           "7px",
                padding:       "5px 10px",
                border:        "1px solid rgba(107,117,199,0.22)",
                borderRadius:  "2px",
                marginBottom:  formation.publication ? "clamp(10px,1.4vh,18px)" : 0,
              }}>
                <span style={{
                  fontFamily:    "monospace",
                  fontSize:      "8px",
                  letterSpacing: "0.25em",
                  color:         "#6B75C7",
                  textTransform: "uppercase",
                }}>
                  {formation.annotation}
                </span>
              </div>
            )}

            {/* Publication DUMAS */}
            {formation.publication && (
              <a
                href={formation.publication.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display:        "inline-flex",
                  alignItems:     "center",
                  gap:            "12px",
                  marginTop:      formation.annotation ? "clamp(10px,1.4vh,18px)" : 0,
                  padding:        "10px 14px",
                  border:         "1px solid rgba(240,196,39,0.16)",
                  borderRadius:   "2px",
                  background:     "rgba(240,196,39,0.04)",
                  textDecoration: "none",
                  cursor:         "pointer",
                  transition:     "border-color 0.3s ease, background 0.3s ease",
                  color:          "inherit",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = "rgba(240,196,39,0.50)";
                  el.style.background  = "rgba(240,196,39,0.08)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = "rgba(240,196,39,0.16)";
                  el.style.background  = "rgba(240,196,39,0.04)";
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <span style={{
                    fontFamily:    "monospace",
                    fontSize:      "8px",
                    letterSpacing: "0.28em",
                    color:         "#F0C427",
                    textTransform: "uppercase",
                    opacity:       0.65,
                  }}>
                    {formation.publication.label}
                  </span>
                  <span style={{
                    fontFamily:    "var(--font-space), sans-serif",
                    fontSize:      "12px",
                    color:         "rgba(255,255,255,0.60)",
                    letterSpacing: "0.02em",
                  }}>
                    {formation.publication.title}
                  </span>
                </div>
                <ExternalLinkIcon />
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Section principale ───────────────────────────────────────────────────────
const FormationsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);

  const entryRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const nodeRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {

      // ── 1. Titre : clipPath reveal (même pattern que SkillsRevealBlock) ──
      if (titleRef.current) {
        gsap.set(titleRef.current, { clipPath: "inset(0 101% 0 0)" });
        gsap.to(titleRef.current, {
          clipPath:  "inset(0 0% 0 0)",
          duration:  1.1,
          ease:      "power3.out",
          scrollTrigger: {
            trigger:      titleRef.current,
            start:        "top 82%",
            toggleActions:"play none none reverse",
          },
        });
      }

      // ── 2. Ligne filaire : scaleY scrub (pattern career-timeline, GsapScroll.ts MCP) ──
      // On scrub de 0→1 sur toute la hauteur de la section, comme maxHeight du portfolio de ref
      if (lineRef.current) {
        gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top center" });
        gsap.to(lineRef.current, {
          scaleY: 1,
          ease:   "none",
          scrollTrigger: {
            trigger:          sectionRef.current,
            start:            "top 60%",
            end:              "bottom 80%",
            scrub:            1.4,
            invalidateOnRefresh: true,
          },
        });
      }

      // ── 3. Nœuds et contenus par entrée ──
      FORMATIONS.forEach((_, i) => {
        const node    = nodeRefs.current[i];
        const content = contentRefs.current[i];
        const entry   = entryRefs.current[i];
        if (!entry) return;

        const trigger = {
          trigger:      entry,
          start:        "top 72%",
          toggleActions:"play none none reverse",
        } as const;

        // Nœud : scale 0→1 avec back.out (pop) — opacity 0→1
        if (node) {
          gsap.set(node, { scale: 0, opacity: 0 });
          gsap.to(node, {
            scale:    1,
            opacity:  1,
            duration: 0.55,
            ease:     "back.out(2.2)",
            scrollTrigger: trigger,
          });
        }

        // Contenu : translateY + opacity, légère avance
        if (content) {
          gsap.to(content, {
            opacity:  1,
            y:        0,
            duration: 0.75,
            ease:     "power3.out",
            delay:    0.10,
            scrollTrigger: { ...trigger, start: "top 70%" },
          });
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="formations"
      ref={sectionRef}
      style={{ position: "relative", zIndex: 10, width: "100%", background: "#05060f" }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 6vw" }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{
          paddingTop:    "clamp(80px,12vh,140px)",
          paddingBottom: "clamp(40px,6vh,80px)",
          borderBottom:  "1px solid rgba(255,255,255,0.07)",
          overflow:      "hidden",
        }}>
          <h2
            ref={titleRef}
            style={{
              fontSize:      "clamp(2.5rem,6vw,5rem)",
              fontWeight:    700,
              color:         "#fff",
              letterSpacing: "-0.04em",
              lineHeight:    1,
            }}
          >
            FORMATIONS
          </h2>
        </div>

        {/* ── Corps : timeline filaire ────────────────────────────────────── */}
        <div style={{
          position:      "relative",
          paddingTop:    "clamp(60px,8vh,100px)",
          paddingBottom: "clamp(80px,12vh,140px)",
        }}>

          {/* Rail statique */}
          <div style={{
            position:   "absolute",
            left:       "calc(50% - 0.5px)",
            top:        0,
            bottom:     0,
            width:      "1px",
            background: "rgba(255,255,255,0.06)",
            zIndex:     0,
          }} />

          {/* Ligne animée scrub (ref GsapScroll.ts career-timeline) */}
          <div
            ref={lineRef}
            style={{
              position:        "absolute",
              left:            "calc(50% - 0.5px)",
              top:             0,
              bottom:          0,
              width:           "1px",
              background:      "linear-gradient(to bottom, #F0C427 0%, #6B75C7 65%, rgba(107,117,199,0.10) 100%)",
              zIndex:          1,
              transformOrigin: "top center",
            }}
          />

          {/* Entrées */}
          <div style={{ position: "relative", zIndex: 2 }}>
            {FORMATIONS.map((formation, i) => (
              <FormationEntry
                key={formation.id}
                formation={formation}
                isLast={i === FORMATIONS.length - 1}
                setEntryRef={  el => { entryRefs.current[i]   = el; }}
                setNodeRef={   el => { nodeRefs.current[i]    = el; }}
                setContentRef={ el => { contentRefs.current[i] = el; }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormationsSection;
