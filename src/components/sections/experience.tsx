"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { EXPERIENCE } from "@/data/constants";

// ─── Types ────────────────────────────────────────────────────────────────────
export type SkillCategory = "outil" | "technique" | "contexte";
export type SkillTag = { label: string; category: SkillCategory };

// Couleurs par catégorie — seule différence visuelle entre les lignes
const CAT_COLOR: Record<SkillCategory, string> = {
  technique: "#ffffff",
  outil:     "#f3d35e",
  contexte:  "#ed954b",
};

// ─── SkillsRevealBlock ────────────────────────────────────────────────────────
// Toutes les lignes ont la même taille/poids — seule la couleur change.
// Animation : chaque ligne se révèle via clipPath gauche→droite au scroll.
// FIX stabilité : on utilise un gsap.timeline avec ScrollTrigger scrub=false
// et toggleActions "play reverse play reverse" pour que ça fonctionne
// dans les deux sens sans reset brutal.
function SkillsRevealBlock({ skills }: { skills: SkillTag[] }) {
  const blockRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const ordered: SkillTag[] = [
    ...skills.filter(s => s.category === "technique"),
    ...skills.filter(s => s.category === "outil"),
    ...skills.filter(s => s.category === "contexte"),
  ];

  useLayoutEffect(() => {
    const block = blockRef.current;
    if (!block) return;

    const lines = lineRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!lines.length) return;

    // État initial : toutes les lignes clipées
    gsap.set(lines, { clipPath: "inset(0 101% 0 0)" });

    // Un seul ScrollTrigger par bloc — timeline avec stagger
    // toggleActions : play (↓) / reverse (↑) dans les deux directions
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: block,
        start:         "top 72%",
        end:           "top 30%",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(lines, {
      clipPath: "inset(0 0% 0 0)",
      duration: 0.7,
      stagger:  0.07,
      ease:     "power3.out",
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll()
        .filter(st => st.vars.trigger === block)
        .forEach(st => st.kill());
    };
  }, [ordered.length]);

  return (
    <div ref={blockRef} style={{ width: "100%" }}>

      {/* En-tête */}
      <div style={{
        display:        "flex",
        justifyContent: "space-between",
        alignItems:     "baseline",
        marginBottom:   "clamp(14px,2vh,24px)",
        paddingBottom:  "clamp(8px,1vh,12px)",
        borderBottom:   "1px solid rgba(255,255,255,0.10)",
      }}>
        <span style={{
          fontFamily:    "monospace",
          fontSize:      "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color:         "rgba(255,255,255,0.18)",
        }}>
          Compétences mobilisées
        </span>
        <div style={{ display: "flex", gap: "14px" }}>
          {(["technique", "outil", "contexte"] as SkillCategory[])
            .filter(cat => skills.some(s => s.category === cat))
            .map(cat => (
              <span key={cat} style={{
                display:       "inline-flex",
                alignItems:    "center",
                gap:           "5px",
                fontFamily:    "monospace",
                fontSize:      "8px",
                letterSpacing: "0.12em",
                color:         CAT_COLOR[cat],
                textTransform: "uppercase",
                opacity:       0.65,
              }}>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: CAT_COLOR[cat] }} />
                {cat}
              </span>
            ))
          }
        </div>
      </div>

      {/* Lignes */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {ordered.map((skill, i) => (
          // wrapper overflow:hidden — masque le clip qui dépasse
          <div key={`${skill.label}-${i}`} style={{ overflow: "hidden" }}>
            <div
              ref={el => { lineRefs.current[i] = el; }}
              style={{
                display:       "flex",
                alignItems:    "center",
                gap:           "clamp(12px,1.4vw,20px)",
                paddingTop:    "clamp(11px,1.5vh,18px)",
                paddingBottom: "clamp(11px,1.5vh,18px)",
                borderBottom:  "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Index */}
              <span style={{
                fontFamily:    "monospace",
                fontSize:      "9px",
                letterSpacing: "0.18em",
                color:         CAT_COLOR[skill.category],
                opacity:       0.40,
                flexShrink:    0,
                lineHeight:    1,
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Label — taille et poids identiques pour toutes les catégories */}
              <span style={{
                fontFamily:    "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize:      "clamp(1.25rem, 2.4vw, 2.6rem)",
                fontWeight:    500,
                letterSpacing: "-0.02em",
                color:         CAT_COLOR[skill.category],
                lineHeight:    1,
                whiteSpace:    "nowrap",
              }}>
                {skill.label}
              </span>

              {/* Ligne de remplissage */}
              <span style={{
                flex:       1,
                height:     "1px",
                background: `linear-gradient(to right, ${CAT_COLOR[skill.category]}25, transparent)`,
                flexShrink: 0,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SignalIcon ───────────────────────────────────────────────────────────────
const SignalIcon = ({ active }: { active: boolean }) => (
  <svg width="36" height="14" viewBox="0 0 36 14" fill="none"
    style={{ opacity: active ? 1 : 0, transition: "opacity 0.4s ease", flexShrink: 0 }}>
    <polyline points="0,7 4,7 6,1 8,13 10,7 16,7 18,2 20,12 22,7 28,7 32,4 36,7"
      stroke="#F0C427" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

// ─── HighlightedText ──────────────────────────────────────────────────────────
function HighlightedText({ text, highlights }: { text: string; highlights: string[] }) {
  if (!highlights.length) return <>{text}</>;
  const esc   = highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(`(${esc})`, "g");
  return (
    <>
      {text.split(regex).map((part, i) =>
        highlights.includes(part)
          ? <span key={i} style={{ color: "rgba(255,255,255,0.92)", fontWeight: 600 }}>{part}</span>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
const ExperienceSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const entryRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    const triggers = entryRefs.current.map((el, i) => {
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end:   "bottom 45%",
        onEnter:     () => setActiveIdx(i),
        onEnterBack: () => setActiveIdx(i),
      });
    });

    return () => triggers.forEach(t => t?.kill());
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{ position: "relative", zIndex: 10, width: "100%", background: "#05060f" }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 6vw" }}>

        {/* Header */}
        <div style={{
          paddingTop:    "clamp(80px,12vh,140px)",
          paddingBottom: "clamp(40px,6vh,80px)",
          borderBottom:  "1px solid rgba(255,255,255,0.07)",
        }}>
          <h2 style={{
            fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 700,
            color: "#fff", letterSpacing: "-0.04em", lineHeight: 1,
          }}>EXPÉRIENCES</h2>
        </div>

        {/* Deux colonnes */}
        <div style={{
          display: "grid", gridTemplateColumns: "22% 1fr",
          gap: "0 5vw", paddingTop: "clamp(60px,8vh,100px)",
        }}>

          {/* Left sticky */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "sticky", top: "30vh", display: "flex", flexDirection: "column" }}>
              <div style={{
                fontFamily: "monospace", fontSize: "clamp(4rem,8vw,7rem)",
                fontWeight: 700, color: "#fff", lineHeight: 1, letterSpacing: "-0.06em",
              }}>
                {String(activeIdx + 1).padStart(2, "0")}
              </div>
              <div style={{
                fontFamily: "monospace", fontSize: "11px",
                color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em",
                marginBottom: "clamp(28px,4vh,48px)",
              }}>
                — {String(EXPERIENCE.length).padStart(2, "0")}
              </div>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute", left: "5px", top: "10px", bottom: "10px",
                  width: "1px", background: "rgba(255,255,255,0.1)",
                }} />
                {EXPERIENCE.map((exp, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "10px 0", position: "relative",
                  }}>
                    <div style={{
                      width: "11px", height: "11px", borderRadius: "50%",
                      border: `1px solid ${activeIdx === i ? "#F0C427" : "rgba(255,255,255,0.2)"}`,
                      background: activeIdx === i ? "#F0C427" : "transparent",
                      flexShrink: 0, transition: "all 0.35s ease", zIndex: 1,
                    }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{
                        fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.12em",
                        color: activeIdx === i ? "#F0C427" : "rgba(255,255,255,0.25)",
                        transition: "color 0.35s ease",
                      }}>{exp.shortYear}</span>
                      <span style={{
                        fontSize: "11px", lineHeight: 1.2, maxWidth: "110px",
                        color: activeIdx === i ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
                        transition: "color 0.35s ease",
                      }}>{exp.company.split("—")[0].trim()}</span>
                    </div>
                    <SignalIcon active={activeIdx === i} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — entries */}
          <div style={{ display: "flex", flexDirection: "column", paddingBottom: "clamp(80px,12vh,140px)" }}>
            {EXPERIENCE.map((exp, i) => (
              <div
                key={i}
                ref={(el) => { entryRefs.current[i] = el; }}
                style={{
                  display: "flex", flexDirection: "column",
                  paddingTop:    i === 0 ? 0 : "clamp(80px,10vh,120px)",
                  paddingBottom: "clamp(60px,8vh,100px)",
                  borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", width: "100%", marginBottom: "clamp(28px,4vh,48px)" }}>
                  <div style={{
                    position: "relative", width: "100%",
                    height: "clamp(220px,38vh,480px)", overflow: "hidden",
                  }}>
                    <Image src={exp.image} alt={exp.company} fill
                      sizes="(max-width:1400px) 70vw, 900px"
                      style={{ objectFit: "cover", objectPosition: "center 30%" }}
                      priority={i === 0}
                    />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to bottom,rgba(5,6,15,.08) 0%,rgba(5,6,15,0) 40%,rgba(5,6,15,.7) 78%,rgba(5,6,15,1) 100%)",
                    }} />
                    <div style={{
                      position: "absolute", top: "18px", left: "20px",
                      fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.25em",
                      color: activeIdx === i ? "#F0C427" : "rgba(255,255,255,0.35)",
                      transition: "color 0.35s ease",
                    }}>{String(i + 1).padStart(2, "0")} ——</div>
                    <div style={{
                      position: "absolute", top: "18px", right: "20px",
                      fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.15em",
                      color: activeIdx === i ? "rgba(240,196,39,.7)" : "rgba(255,255,255,0.3)",
                      transition: "color 0.35s ease",
                    }}>{exp.period}</div>
                  </div>
                  <div style={{
                    position: "relative",
                    marginTop: "-clamp(24px,4vh,48px)",
                    paddingTop: "clamp(24px,4vh,48px)",
                    background: "linear-gradient(to bottom,transparent,#05060f 35%)",
                  }}>
                    <h3 style={{
                      fontSize: "clamp(1.15rem,1.8vw,2rem)", fontWeight: 700, color: "#fff",
                      letterSpacing: "-0.02em", lineHeight: 1.0,
                      marginBottom: "clamp(10px,1.5vh,16px)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{exp.title}</h3>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap",
                      fontFamily: "monospace", fontSize: "11px",
                      color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em",
                    }}>
                      <span style={{ color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{exp.company}</span>
                      <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Séparateur */}
                <div style={{
                  height: "1px", width: "100%",
                  background: activeIdx === i
                    ? "linear-gradient(to right,#F0C427 0%,rgba(107,117,199,.3) 40%,rgba(255,255,255,.04) 100%)"
                    : "rgba(255,255,255,0.06)",
                  transition: "background 0.6s ease",
                  marginBottom: "clamp(24px,3.5vh,40px)",
                }} />

                {/* Description */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  gap: "0 clamp(24px,3vw,48px)",
                  marginBottom: "clamp(48px,6vh,72px)",
                }}>
                  {exp.description.map((para, j) => (
                    <p key={j} style={{
                      fontFamily: "var(--font-satoshi), 'Helvetica Neue', sans-serif",
                      fontSize: "clamp(12px,1.2vw,14px)", color: "rgba(255,255,255,0.42)",
                      lineHeight: 1.85, textAlign: "justify", hyphens: "auto",
                    }}>
                      <HighlightedText text={para} highlights={exp.highlights} />
                    </p>
                  ))}
                </div>

                {/* Révélation typographique */}
                <SkillsRevealBlock skills={exp.skills as SkillTag[]} />

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;