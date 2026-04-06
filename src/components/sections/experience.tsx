"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { EXPERIENCE } from "@/data/constants";

// ─── Types ────────────────────────────────────────────────────────────────────
export type SkillCategory = "outil" | "technique" | "contexte";
export type SkillTag = { label: string; category: SkillCategory };

// Séparateurs non uniformes
const SEPS = ["—", "·", "—", "—", "·", "—", "·", "—", "·", "—"];

// ─── SkillsRevealBlock ────────────────────────────────────────────────────────
// Une ligne compacte. Reveal opacity+y au scroll. textOverflow ellipsis.
function SkillsRevealBlock({ skills }: { skills: SkillTag[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 5 });

    const st = ScrollTrigger.create({
      trigger:     el,
      start:       "top 88%",
      onEnter:     () => gsap.to(el, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }),
      onLeaveBack: () => gsap.to(el, { opacity: 0, y: 5, duration: 0.25, ease: "power2.in" }),
    });

    return () => st.kill();
  }, []);

  const text = skills.map((s, i) =>
    i < skills.length - 1 ? `${s.label}${"\u2002"}${SEPS[i % SEPS.length]}\u2002` : s.label
  ).join("");

  return (
    <div
      ref={ref}
      style={{
        borderTop:  "1px solid rgb(255, 255, 255)",
        paddingTop: "clamp(10px, 1.2vh, 4px)",
        width:      "100%",
        minWidth:   0,
      }}
    >
      <p style={{
        fontFamily:    "var(--font-hibana), sans-serof",
        fontSize:      "clamp(9.5px, 0.82vw, 11px)",
        color:         "rgb(255, 255, 255)",
        lineHeight:    1,
        margin:        0,
        whiteSpace:    "nowrap",
        overflow:      "hidden",
        textOverflow:  "ellipsis",
      }}>
        {text}
      </p>
    </div>
  );
}

// ─── HighlightedText ──────────────────────────────────────────────────────────
type HighlightSpec  = { text: string; color?: string };
type HighlightInput = string | HighlightSpec | null | undefined;

function HighlightedText({ text, highlights }: { text: string; highlights?: HighlightInput[] }) {
  const normalized: HighlightSpec[] = (highlights ?? [])
    .filter(Boolean)
    .map((h) => typeof h === "string" ? { text: h } : { text: h!.text, color: h!.color })
    .filter((h) => !!h.text);

  if (!normalized.length) return <>{text}</>;

  const esc   = normalized.map((h) => h.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(`(${esc})`, "g");

  return (
    <>
      {text.split(regex).map((part, i) => {
        const spec = normalized.find((h) => h.text === part);
        return spec
          ? <span key={i} style={{ color: spec.color ?? "rgba(255,255,255,0.92)", fontWeight: 600 }}>{part}</span>
          : <span key={i}>{part}</span>;
      })}
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
      id="experience"
      ref={sectionRef}
      style={{ position: "relative", zIndex: 10, width: "100%", background: "#05060f" }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 6vw" }}>

        {/* Header */}
        <div style={{
          paddingTop:    "clamp(60px,8vh,100px)",
          paddingBottom: "clamp(28px,4vh,48px)",
          borderBottom:  "1px solid rgb(255, 255, 255)",
        }}>
          <h2 style={{
            fontSize:      "clamp(2.5rem,6vw,5rem)",
            fontWeight:    700,
            color:         "#fff",
            letterSpacing: "-0.04em",
            lineHeight:    1,
            margin:        0,
          }}>EXPÉRIENCES</h2>
        </div>

        {/* Deux colonnes */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "22% 1fr",
          gap:                 "0 5vw",
          paddingTop:          "clamp(40px,5vh,72px)",
        }}>

          {/* Left sticky */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "sticky", top: "30vh", display: "flex", flexDirection: "column" }}>
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
              <div style={{ position: "relative" }}>
                <div style={{
                  position:   "absolute",
                  left:       "5px",
                  top:        "10px",
                  bottom:     "10px",
                  width:      "1px",
                  background: "rgba(255,255,255,0.1)",
                }} />
                {EXPERIENCE.map((exp, i) => (
                  <div key={i} style={{
                    display:    "flex",
                    alignItems: "center",
                    gap:        "14px",
                    padding:    "10px 0",
                    position:   "relative",
                  }}>
                    <div style={{
                      width:        "11px",
                      height:       "11px",
                      borderRadius: "50%",
                      border:       `1px solid ${activeIdx === i ? "#F0C427" : "rgba(255,255,255,0.2)"}`,
                      background:   activeIdx === i ? "#F0C427" : "transparent",
                      flexShrink:   0,
                      transition:   "all 0.35s ease",
                      zIndex:       1,
                    }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{
                        fontFamily:    "var(--font-space), sans-serif",
                        fontSize:      "10px",
                        letterSpacing: "0.12em",
                        color:         activeIdx === i ? "#F0C427" : "rgba(255,255,255,0.25)",
                        transition:    "color 0.35s ease",
                      }}>{exp.shortYear}</span>
                      <span style={{
                        fontSize:     "11px",
                        fontFamily:   "var(--font-space), sans-serif",
                        lineHeight:   1.2,
                        maxWidth:     "110px",
                        whiteSpace:   "nowrap",
                        overflow:     "hidden",
                        textOverflow: "ellipsis",
                        color:        activeIdx === i ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
                        transition:   "color 0.35s ease",
                      }}>{exp.company.split("—")[0].trim()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — entries */}
          <div style={{
            display:       "flex",
            flexDirection: "column",
            paddingBottom: "clamp(60px,8vh,100px)",
            minWidth:      0,
          }}>
            {EXPERIENCE.map((exp, i) => (
              <div
                key={i}
                ref={(el) => { entryRefs.current[i] = el; }}
                style={{
                  display:       "flex",
                  flexDirection: "column",
                  paddingTop:    i === 0 ? 0 : "clamp(48px,6vh,80px)",
                  paddingBottom: "clamp(10px,1vh,40px)",
                  borderTop:     i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)",
                  minWidth:      0,
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", width: "100%", marginBottom: "clamp(20px,3vh,36px)" }}>
                  <div style={{
                    position: "relative",
                    width:    "100%",
                    height:   "clamp(200px,32vh,420px)",
                    overflow: "hidden",
                  }}>
                    <Image
                      src={exp.image}
                      alt={exp.company}
                      fill
                      sizes="(max-width:1400px) 70vw, 900px"
                      quality={100}
                      style={{ objectFit: "cover", objectPosition: "center 30%" }}
                      priority={i === 0}
                    />
                    <div style={{
                      position:   "absolute",
                      inset:      0,
                      background: "linear-gradient(to bottom,rgba(5,6,15,.08) 0%,rgba(5,6,15,0) 40%,rgba(5,6,15,.7) 78%,rgba(5,6,15,1) 100%)",
                    }} />
                    <div style={{
                      position:      "absolute",
                      top:           "20px",
                      left:          "20px",
                      fontFamily:    "var(--font-space), sans-serif",
                      fontSize:      "20px",
                      letterSpacing: "0.25em",
                      color:         activeIdx === i ? "#F0C427" : "rgba(255,255,255,0.35)",
                      transition:    "color 0.35s ease",
                    }}>{String(i + 1).padStart(2, "0")} ——</div>
                    <div style={{
                      position:      "absolute",
                      top:           "10px",
                      right:         "10px",
                      fontFamily:    "var(--font-space), sans-serif",
                      fontSize:      "10px",
                      letterSpacing: "0.15em",
                      color:         activeIdx === i ? "rgba(240,196,39,.7)" : "rgba(255,255,255,0.3)",
                      transition:    "color 0.35s ease",
                    }}>{exp.period}</div>
                  </div>
                  <div style={{
                    position:   "relative",
                    marginTop:  "-clamp(24px,4vh,48px)",
                    paddingTop: "clamp(10px,4vh,48px)",
                    background: "linear-gradient(to bottom,transparent,#05060f 35%)",
                  }}>
                    <h3 style={{
                      fontSize:      "clamp(1.15rem,1.8vw,2rem)",
                      fontWeight:    700,
                      color:         "#fff",
                      letterSpacing: "-0.02em",
                      lineHeight:    1.5,
                      marginBottom:  "clamp(8px,1vh,12px)",
                      whiteSpace:    "pre-line",
                      overflow:      "hidden",
                      textOverflow:  "ellipsis",
                    }}>{exp.title}</h3>
                    <div style={{
                      display:       "flex",
                      alignItems:    "center",
                      gap:           "8px",
                      flexWrap:      "wrap",
                      fontFamily:    "var(--font-space), sans-serif",
                      fontSize:      "15px",
                      color:         "#f3d35e",
                      letterSpacing: "0.1em",
                    }}>
                      <span style={{ color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{exp.company}</span>
                      <span style={{ color: "#ffffff" }}>·</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Séparateur — jaune pur quand actif, sinon blanc très discret */}
                <div style={{
                  height:       "1px",
                  width:        "100%",
                  background:   activeIdx === i
                    ? "linear-gradient(to right, #F0C427 0%, rgba(240,196,39,0.18) 55%, rgba(255,255,255,0.02) 100%)"
                    : "rgba(255,255,255,0.06)",
                  transition:   "background 0.6s ease",
                  marginBottom: "clamp(18px,2.5vh,32px)",
                }} />

                {/* Description */}
                <div style={{
                  display:             "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap:                 "0 clamp(24px,3vw,48px)",
                  marginBottom:        "clamp(24px,3vh,40px)",
                }}>
                  {exp.description.map((para, j) => (
                    <p key={j} style={{
                      fontFamily:         "var(--font-space), sans-serif",
                      fontSize:           "clamp(13px, 1.1vw, 16px)",
                      color:              "rgba(255,255,255,0.62)",
                      lineHeight:         1.95,
                      textAlign:          "justify",
                      hyphens:            "auto",
                      hyphenateCharacter: "'‐'",
                      overflowWrap:       "break-word",
                      wordBreak:          "break-word",
                      letterSpacing:      "0.005em",
                      fontKerning:        "normal",
                      fontOpticalSizing:  "auto",
                      margin:             0,
                    }}>
                      <HighlightedText text={para} highlights={exp.highlights} />
                    </p>
                  ))}
                </div>

                {/* Skills — ligne compacte collée sous la description */}
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