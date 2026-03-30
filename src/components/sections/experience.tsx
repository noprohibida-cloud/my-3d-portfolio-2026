"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { EXPERIENCE } from "@/data/constants";

// ─── Signal icon ───────────────────────────────────────────────────────────────
const SignalIcon = ({ active }: { active: boolean }) => (
  <svg width="36" height="14" viewBox="0 0 36 14" fill="none"
    style={{ opacity: active ? 1 : 0, transition: "opacity 0.4s ease", flexShrink: 0 }}>
    <polyline
      points="0,7 4,7 6,1 8,13 10,7 16,7 18,2 20,12 22,7 28,7 32,4 36,7"
      stroke="#F0C427" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round"
    />
  </svg>
);

// ─── Highlight helper ──────────────────────────────────────────────────────────
function HighlightedText({ text, highlights }: { text: string; highlights: string[] }) {
  if (!highlights.length) return <>{text}</>;
  const escaped = highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex   = new RegExp(`(${escaped})`, "g");
  return (
    <>
      {text.split(regex).map((part, i) =>
        highlights.includes(part) ? (
          <span key={i} style={{ color: "rgba(255,255,255,0.92)", fontWeight: 600 }}>{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// ─── Skill width — déterministe basé sur le nom (60–100%) ─────────────────────
function skillWidth(skill: string): number {
  const hash = skill.split("").reduce((a, c) => a + c.charCodeAt(0) * 17 + 7, 0);
  return 60 + (hash % 41); // 60–100%
}

// ─── EQ Skills — barres horizontales animées style analyseur TD ───────────────
// Inspiré du topSkillsGraph pattern (nextjs-character-gsap-shaders/src/config/skills.ts)
// Chaque compétence = ligne label + barre horizontale qui se remplit au scroll
function SpectrumSkills({ skills, active }: { skills: string[]; active: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  // Déclenche l'animation dès que la section devient active
  React.useEffect(() => {
    if (active && !revealed) {
      const t = setTimeout(() => setRevealed(true), 80);
      return () => clearTimeout(t);
    }
  }, [active, revealed]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>

      {/* Header row */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: "20px",
      }}>
        <div style={{
          fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.22em",
          color: "rgba(255,255,255,0.2)", textTransform: "uppercase",
        }}>
          CHOP — Compétences mobilisées
        </div>
        <div style={{
          fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.12)",
        }}>
          {skills.length} canaux
        </div>
      </div>

      {/* Barres */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {skills.map((skill, i) => {
          const w   = skillWidth(skill);
          const isH = hovered === i;
          const delay = i * 55; // stagger ms

          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "default" }}
            >
              {/* Label + valeur */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "5px",
              }}>
                <span style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: isH ? "#F0C427" : "rgba(255,255,255,0.55)",
                  transition: "color 0.2s ease",
                }}>
                  {skill}
                </span>
                <span style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  color: isH ? "rgba(240,196,39,0.7)" : "rgba(255,255,255,0.18)",
                  transition: "color 0.2s ease",
                  letterSpacing: "0.08em",
                }}>
                  {w}
                </span>
              </div>

              {/* Rail de fond */}
              <div style={{
                position: "relative",
                width: "100%",
                height: "3px",
                background: "rgba(255,255,255,0.05)",
                overflow: "hidden",
              }}>
                {/* Barre de remplissage — transition CSS déclenchée par revealed */}
                <div style={{
                  position: "absolute",
                  left: 0, top: 0, bottom: 0,
                  width: revealed ? `${w}%` : "0%",
                  background: isH
                    ? "#F0C427"
                    : `rgba(107, 117, 199, ${0.45 + (w / 100) * 0.45})`,
                  transition: `width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms, background 0.2s ease`,
                }} />

                {/* Point lumineux à l'extrémité */}
                {revealed && (
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: `${w}%`,
                    transform: "translate(-50%, -50%)",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: isH ? "#F0C427" : "rgba(107,117,199,0.9)",
                    boxShadow: isH
                      ? "0 0 8px #F0C427"
                      : "0 0 6px rgba(107,117,199,0.6)",
                    transition: `background 0.2s ease, box-shadow 0.2s ease, left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
                  }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────
const ExperienceSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const entryRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      entryRefs.current.forEach((el, i) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end:   "bottom 45%",
          onEnter:     () => setActiveIdx(i),
          onEnterBack: () => setActiveIdx(i),
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{ position: "relative", zIndex: 10, width: "100%", background: "#05060f" }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 6vw" }}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={{
          paddingTop: "clamp(80px,12vh,140px)",
          paddingBottom: "clamp(40px,6vh,80px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
          <h2 style={{
            fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 700, color: "#fff",
            letterSpacing: "-0.04em", lineHeight: 1,
          }}>
            EXPÉRIENCES
          </h2>
        </div>

        {/* ── Two-column layout ───────────────────────────────────────────── */}
        <div style={{
          display: "grid", gridTemplateColumns: "22% 1fr",
          gap: "0 5vw", paddingTop: "clamp(60px,8vh,100px)",
        }}>

          {/* ── Left — sticky panel ─────────────────────────────────────── */}
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
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "10px 0", position: "relative" }}>
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

          {/* ── Right — entries ─────────────────────────────────────────── */}
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
                {/* ── Cinematic image banner ─────────────────────────── */}
                {/* Image pleine largeur, titre qui chevauche le bas */}
                <div style={{
                  position: "relative",
                  width: "100%",
                  marginBottom: "clamp(28px,4vh,48px)",
                }}>
                  {/* Image container — aspect paysage cinématique */}
                  <div style={{
                    position: "relative",
                    width: "100%",
                    height: "clamp(220px, 38vh, 480px)",
                    overflow: "hidden",
                  }}>
                    <Image
                      src={exp.image}
                      alt={exp.company}
                      fill
                      sizes="(max-width: 1400px) 70vw, 900px"
                      style={{ objectFit: "cover", objectPosition: "center 30%" }}
                      priority={i === 0}
                    />
                    {/* Gradient fort en bas pour que le titre soit lisible */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to bottom, rgba(5,6,15,0.08) 0%, rgba(5,6,15,0.0) 40%, rgba(5,6,15,0.7) 78%, rgba(5,6,15,1) 100%)",
                    }} />
                    {/* Grain overlay */}
                    <div style={{
                      position: "absolute", inset: 0,
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
                      backgroundSize: "200px 200px",
                      opacity: 0.8,
                      mixBlendMode: "overlay",
                    }} />
                    {/* Index dans le coin supérieur gauche de l'image */}
                    <div style={{
                      position: "absolute", top: "18px", left: "20px",
                      fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.25em",
                      color: activeIdx === i ? "#F0C427" : "rgba(255,255,255,0.35)",
                      transition: "color 0.35s ease",
                    }}>
                      {String(i + 1).padStart(2, "0")} ——
                    </div>
                    {/* Période dans le coin supérieur droit */}
                    <div style={{
                      position: "absolute", top: "18px", right: "20px",
                      fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.15em",
                      color: activeIdx === i ? "rgba(240,196,39,0.7)" : "rgba(255,255,255,0.3)",
                      transition: "color 0.35s ease",
                    }}>
                      {exp.period}
                    </div>
                  </div>

                  {/* Titre qui émerge du bas de l'image */}
                  <div style={{
                    position: "relative",
                    marginTop: "-clamp(24px,4vh,48px)", // chevauchement négatif sur l'image
                    paddingTop: "clamp(24px,4vh,48px)", // compense le margin négatif
                    background: "linear-gradient(to bottom, transparent, #05060f 35%)",
                  }}>
                    <h3 style={{
                      fontSize: "clamp(1.15rem, 1.8vw, 2rem)",
                      fontWeight: 700, color: "#fff",
                      letterSpacing: "-0.02em", lineHeight: 1.0,
                      marginBottom: "clamp(10px,1.5vh,16px)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {exp.title}
                    </h3>

                    {/* Metadata */}
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

                {/* ── Séparateur avec ligne active ──────────────────────── */}
                <div style={{
                  height: "1px", width: "100%",
                  background: activeIdx === i
                    ? "linear-gradient(to right, #F0C427 0%, rgba(107,117,199,0.3) 40%, rgba(255,255,255,0.04) 100%)"
                    : "rgba(255,255,255,0.06)",
                  transition: "background 0.6s ease",
                  marginBottom: "clamp(24px,3.5vh,40px)",
                }} />

                {/* ── Deux paragraphes de texte ──────────────────────────── */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0 clamp(24px,3vw,48px)",
                  marginBottom: "clamp(32px,5vh,56px)",
                }}>
                  {exp.description.map((para, j) => (
                    <p key={j} style={{
                      fontSize: "clamp(12px,1.2vw,14px)",
                      color: "rgba(255,255,255,0.42)",
                      lineHeight: 1.85,
                      textAlign: "justify",
                      hyphens: "auto",
                    }}>
                      <HighlightedText text={para} highlights={exp.highlights} />
                    </p>
                  ))}
                </div>

                {/* ── CHOP Spectrum ──────────────────────────────────────── */}
                <SpectrumSkills skills={exp.skills} active={activeIdx === i} />

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;