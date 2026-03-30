"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { EXPERIENCE, FORMATION, TOOLS } from "@/data/constants";

const SignalIcon = ({ active }: { active: boolean }) => (
  <svg width="36" height="14" viewBox="0 0 36 14" fill="none"
    style={{ opacity: active ? 1 : 0, transition: "opacity 0.4s ease", flexShrink: 0 }}>
    <polyline
      points="0,7 4,7 6,1 8,13 10,7 16,7 18,2 20,12 22,7 28,7 32,4 36,7"
      stroke="#F0C427" strokeWidth="1.2"
      strokeLinejoin="round" strokeLinecap="round"
    />
  </svg>
);

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

  const toolCategories = Object.entries(TOOLS);

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{
        position: "relative",
        // z-index explicite pour passer AU-DESSUS du canvas fixed des projets (z-index:1)
        zIndex: 10,
        width: "100%",
        background: "#05060f",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 6vw" }}>

        {/* Header */}
        <div style={{
          paddingTop: "clamp(80px,12vh,140px)",
          paddingBottom: "clamp(40px,6vh,80px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
        }}>
          <h2 style={{
            fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 700, color: "#fff",
            letterSpacing: "-0.04em", lineHeight: 1,
          }}>
            EXPÉRIENCES
          </h2>
          <span style={{
            fontSize: "11px", color: "rgba(255,255,255,0.25)",
            fontFamily: "monospace", letterSpacing: "0.15em",
          }}>
            {String(EXPERIENCE.length).padStart(2, "0")}
          </span>
        </div>

        {/* Two columns */}
        <div style={{
          display: "grid", gridTemplateColumns: "28% 1fr",
          gap: "0 6vw", paddingTop: "clamp(60px,8vh,100px)",
        }}>

          {/* Left — sticky panel */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "sticky", top: "30vh",
              display: "flex", flexDirection: "column", gap: 0,
            }}>
              {/* Big counter */}
              <div style={{
                fontFamily: "monospace",
                fontSize: "clamp(5rem,10vw,9rem)",
                fontWeight: 700, color: "#fff",
                lineHeight: 1, letterSpacing: "-0.06em",
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

              {/* Timeline */}
              <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
                <div style={{
                  position: "absolute", left: "5px", top: "10px", bottom: "10px",
                  width: "1px", background: "rgba(255,255,255,0.1)",
                }} />
                {EXPERIENCE.map((exp, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "16px",
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
                        fontSize: "11px", lineHeight: 1.2, maxWidth: "100px",
                        color: activeIdx === i ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
                        transition: "color 0.35s ease",
                      }}>{exp.company}</span>
                    </div>
                    <SignalIcon active={activeIdx === i} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — scrollable entries */}
          <div style={{ display: "flex", flexDirection: "column", paddingBottom: "clamp(60px,10vh,120px)" }}>
            {EXPERIENCE.map((exp, i) => (
              <div
                key={i}
                ref={(el) => { entryRefs.current[i] = el; }}
                style={{
                  minHeight: "85vh", display: "flex", flexDirection: "column",
                  justifyContent: "center",
                  paddingTop:    i === 0 ? 0 : "clamp(40px,6vh,80px)",
                  paddingBottom: "clamp(40px,6vh,80px)",
                  borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Index + line */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "clamp(20px,3vh,36px)" }}>
                  <span style={{
                    fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.2em",
                    flexShrink: 0, transition: "color 0.35s ease",
                    color: activeIdx === i ? "#F0C427" : "rgba(255,255,255,0.2)",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{
                    flex: 1, height: "1px", transition: "background 0.5s ease",
                    background: activeIdx === i
                      ? "linear-gradient(to right, #F0C427, rgba(255,255,255,0.04))"
                      : "rgba(255,255,255,0.06)",
                  }} />
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: "clamp(2rem,4.5vw,4.2rem)", fontWeight: 700, color: "#fff",
                  letterSpacing: "-0.04em", lineHeight: 1.0,
                  marginBottom: "clamp(16px,2.5vh,28px)",
                }}>
                  {exp.title}
                </h3>

                {/* Metadata */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap",
                  fontFamily: "monospace", fontSize: "11px",
                  color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em",
                  marginBottom: "clamp(20px,3vh,36px)",
                }}>
                  <span>{exp.company}</span>
                  <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                  <span>{exp.location}</span>
                  <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                  <span style={{
                    transition: "color 0.35s",
                    color: activeIdx === i ? "rgba(240,196,39,0.6)" : "rgba(255,255,255,0.25)",
                  }}>{exp.period}</span>
                </div>

                {/* Description */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "560px" }}>
                  {exp.description.map((line, j) => (
                    <p key={j} style={{
                      fontSize: "clamp(13px,1.4vw,15px)", color: "rgba(255,255,255,0.45)",
                      lineHeight: 1.75, display: "flex", gap: "12px",
                    }}>
                      <span style={{
                        color: "rgba(255,255,255,0.12)", flexShrink: 0,
                        fontFamily: "monospace", fontSize: "10px", marginTop: "4px",
                      }}>→</span>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formation */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          paddingTop: "clamp(40px,6vh,80px)", paddingBottom: "clamp(40px,6vh,80px)",
          display: "grid", gridTemplateColumns: "28% 1fr", gap: "0 6vw", alignItems: "start",
        }}>
          <div>
            <span style={{
              fontFamily: "monospace", fontSize: "10px",
              color: "rgba(255,255,255,0.25)", letterSpacing: "0.18em", textTransform: "uppercase",
            }}>Formation</span>
          </div>
          <div>
            <div style={{
              fontSize: "clamp(1.2rem,2.5vw,1.8rem)", fontWeight: 600, color: "#fff",
              letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "12px",
            }}>{FORMATION.degree}</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "8px" }}>
              {FORMATION.parcours}
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em" }}>
              {FORMATION.school} · {FORMATION.period}
            </div>
          </div>
        </div>

        {/* Tools */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          paddingTop: "clamp(40px,6vh,80px)", paddingBottom: "clamp(80px,12vh,140px)",
          display: "grid", gridTemplateColumns: "28% 1fr", gap: "0 6vw", alignItems: "start",
        }}>
          <div>
            <span style={{
              fontFamily: "monospace", fontSize: "10px",
              color: "rgba(255,255,255,0.25)", letterSpacing: "0.18em", textTransform: "uppercase",
            }}>Outils & logiciels</span>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4,1fr)",
            gap: "clamp(24px,3vw,48px) clamp(16px,2vw,32px)",
          }}>
            {toolCategories.map(([category, tools]) => (
              <div key={category}>
                <div style={{
                  fontFamily: "monospace", fontSize: "9px",
                  color: "rgba(255,255,255,0.2)", letterSpacing: "0.2em", textTransform: "uppercase",
                  marginBottom: "14px", paddingBottom: "8px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}>{category}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {tools.map((tool) => (
                    <div key={tool} style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      fontFamily: "monospace", fontSize: "11px",
                      color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em",
                    }}>
                      <span style={{
                        display: "inline-block", width: "3px", height: "3px",
                        borderRadius: "50%", background: "rgba(255,255,255,0.2)", flexShrink: 0,
                      }} />
                      {tool}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;