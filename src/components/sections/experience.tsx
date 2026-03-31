"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { EXPERIENCE } from "@/data/constants";

// ─── Types ────────────────────────────────────────────────────────────────────
export type SkillCategory = "outil" | "technique" | "contexte";
export type SkillTag = { label: string; category: SkillCategory };

const CAT_RGB: Record<SkillCategory, [number, number, number]> = {
  technique: [0.95, 0.95, 0.95],
  outil:     [0.941, 0.769, 0.153],
  contexte:  [0.533, 0.565, 0.800],
};
const CAT_HEX: Record<SkillCategory, string> = {
  technique: "rgba(242,242,242,0.85)",
  outil:     "#F0C427",
  contexte:  "#8891CC",
};

// ─── GLSL ─────────────────────────────────────────────────────────────────────
const VERT = `
precision mediump float;
attribute vec3  aPos;
attribute vec3  aTarget;
attribute float aDelay;
attribute vec3  aColor;
attribute float aSize;
uniform float   uProgress;
uniform float   uTime;
uniform float   uAspect;
varying vec3    vColor;
varying float   vAlpha;

vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute4(vec4 x){return mod289v4(((x*34.)+1.)*x);}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  vec4 i=floor(v.xyzx+dot(v,C.yyy));
  vec3 x0=v-i.xyz+dot(i.xyz,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy),i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx,x2=x0-i2+C.yyy,x3=x0-.5;
  i=mod289v3(i);
  vec4 p=permute4(permute4(permute4(
    i.z+vec4(0.,i1.z,i2.z,1.))
    +i.y+vec4(0.,i1.y,i2.y,1.))
    +i.x+vec4(0.,i1.x,i2.x,1.));
  vec3 ns=.142857142857*C.yyy-C.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z),y_=floor(j-7.*x_);
  vec4 xv=x_*ns.x+ns.yyyy,yv=y_*ns.x+ns.yyyy,h=1.-abs(xv)-abs(yv);
  vec4 b0=vec4(xv.xy,yv.xy),b1=vec4(xv.zw,yv.zw);
  vec4 s0=floor(b0)*2.+1.,s1=floor(b1)*2.+1.,sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy,a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x),p1=vec3(a0.zw,h.y),p2=vec3(a1.xy,h.z),p3=vec3(a1.zw,h.w);
  vec4 norm=1.79284291400159-.85373472095314*vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m*=m;return 105.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

void main(){
  // Chaos animé dans l'espace NDC [-1,1]
  float t=uTime*.18;
  vec3 n3=vec3(
    snoise(aPos*1.2+vec3(t,0.,0.)),
    snoise(aPos*1.2+vec3(0.,t,.4)),
    snoise(aPos*1.2+vec3(.3,0.,t))
  )*0.35;
  vec3 chaos=aPos+n3;

  float raw=clamp((uProgress-aDelay*.45)/(1.-aDelay*.45+.001),0.,1.);
  float ease=raw<.5?4.*raw*raw*raw:1.-pow(-2.*raw+2.,3.)*.5;

  vec3 pos=mix(chaos,aTarget,ease);

  // Coordonnées NDC directes (pas de matrice)
  // On corrige l'aspect pour que X[-1,1] et Y[-1,1] soient bien proportionnels
  gl_Position=vec4(pos.x, pos.y*uAspect, 0., 1.);

  // Taille fixe en pixels (pas de division par z en ortho)
  float ps=mix(aSize*3.5, aSize*1.2, ease);
  gl_PointSize=clamp(ps, 1., 64.);

  vec3 cc=vec3(.18+aSize*.07,.20+aSize*.06,.50+aSize*.20);
  vColor=mix(cc,aColor,ease);
  vAlpha=mix(.18,.90,ease);
}`;

const FRAG = `
precision mediump float;
varying vec3  vColor;
varying float vAlpha;
void main(){
  vec2 uv=gl_PointCoord-.5;
  float d=length(uv);
  float c=1.-smoothstep(0.,.45,d);
  float h=max(0.,.06/(d+.006)-.09);
  float a=clamp(c*.92+h*.45,0.,1.)*vAlpha;
  if(a<.004)discard;
  gl_FragColor=vec4(vColor,a);
}`;

// ─── WebGL helpers ────────────────────────────────────────────────────────────
function mkShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    throw new Error("Shader: " + gl.getShaderInfoLog(s));
  return s;
}
function mkProg(gl: WebGLRenderingContext, v: string, f: string): WebGLProgram {
  const p = gl.createProgram()!;
  gl.attachShader(p, mkShader(gl, gl.VERTEX_SHADER, v));
  gl.attachShader(p, mkShader(gl, gl.FRAGMENT_SHADER, f));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    throw new Error("Link: " + gl.getProgramInfoLog(p));
  return p;
}
function mkBuf(gl: WebGLRenderingContext, data: Float32Array, dyn = false): WebGLBuffer {
  const b = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, data, dyn ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
  return b;
}
function setAttr(gl: WebGLRenderingContext, prog: WebGLProgram, name: string, buf: WebGLBuffer, sz: number) {
  const loc = gl.getAttribLocation(prog, name);
  if (loc < 0) return;
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, sz, gl.FLOAT, false, 0, 0);
}

// ─── Rasterisation texte → positions NDC [-1,1] ───────────────────────────────
function rasteriseSkills(
  skills: SkillTag[],
  N: number,
  W: number,   // pixels CSS du canvas
  H: number
): { positions: Float32Array; colors: Float32Array } {

  // Canvas 2D pour dessiner le texte
  const oc  = new OffscreenCanvas(W, H);
  const ctx = oc.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);

  const fs = Math.max(20, Math.min(Math.floor(W / 9), 44));
  const lh = fs * 1.85;
  ctx.font         = `500 ${fs}px "Helvetica Neue",Helvetica,Arial,sans-serif`;
  ctx.textBaseline = "top";

  // Grouper par catégorie
  const groups: { cat: SkillCategory; labels: string[] }[] = [
    { cat: "technique", labels: skills.filter(s => s.category === "technique").map(s => s.label) },
    { cat: "outil",     labels: skills.filter(s => s.category === "outil").map(s => s.label) },
    { cat: "contexte",  labels: skills.filter(s => s.category === "contexte").map(s => s.label) },
  ].filter(g => g.labels.length > 0);

  const lines: { text: string; cat: SkillCategory }[] = [];
  for (const { cat, labels } of groups) {
    let cur = "";
    for (let k = 0; k < labels.length; k++) {
      const word = k === 0 ? labels[k] : "  ·  " + labels[k];
      const test = cur + word;
      if (ctx.measureText(test).width > W * 0.88 && cur) {
        lines.push({ text: cur.trim(), cat });
        cur = labels[k];
      } else cur = test;
    }
    if (cur.trim()) lines.push({ text: cur.trim(), cat });
  }

  const totalH = lines.length * lh;
  const startY = Math.max(4, (H - totalH) * 0.5);

  lines.forEach(({ text }, li) => {
    ctx.fillStyle = "#fff";
    const tw = ctx.measureText(text).width;
    ctx.fillText(text, (W - tw) * 0.5, startY + li * lh);
  });

  // Collecter pixels allumés
  const img = ctx.getImageData(0, 0, W, H);
  const lit: { px: number; py: number; li: number }[] = [];
  for (let py = 0; py < H; py++) {
    for (let px = 0; px < W; px++) {
      if (img.data[(py * W + px) * 4] > 40) {
        const li = Math.max(0, Math.min(
          Math.floor((py - startY) / lh),
          lines.length - 1
        ));
        lit.push({ px, py, li });
      }
    }
  }

  const positions = new Float32Array(N * 3);
  const colors    = new Float32Array(N * 3);

  for (let i = 0; i < N; i++) {
    const p = lit.length > 0
      ? lit[Math.floor(Math.random() * lit.length)]
      : { px: W / 2, py: H / 2, li: 0 };

    // Pixel → NDC [-1, 1]
    // x : gauche = -1, droite = +1
    // y : haut = +1, bas = -1  (inversé)
    const nx = ((p.px + (Math.random() - .5) * .5) / W) * 2 - 1;
    const ny = -(((p.py + (Math.random() - .5) * .5) / H) * 2 - 1);

    positions[i * 3]     = nx;
    positions[i * 3 + 1] = ny;
    positions[i * 3 + 2] = 0;

    const cat = lines[p.li]?.cat ?? "technique";
    const [r, g, b] = CAT_RGB[cat];
    colors[i * 3] = r; colors[i * 3 + 1] = g; colors[i * 3 + 2] = b;
  }

  return { positions, colors };
}

// ─── Composant canvas WebGL par poste ─────────────────────────────────────────
function SkillCanvas({ skills, scrollTriggerEl }: {
  skills: SkillTag[];
  scrollTriggerEl: HTMLDivElement | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof OffscreenCanvas === "undefined") return;
    if (!scrollTriggerEl) return;

    // ── Attendre que le canvas ait une taille réelle ──────────────────
    let initialized = false;

    const init = (W: number, H: number) => {
      if (initialized) return;
      initialized = true;

      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);

      const gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        premultipliedAlpha: false,
      }) as WebGLRenderingContext | null;

      if (!gl) { console.warn("[SkillCanvas] WebGL indisponible"); return; }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      // Compiler shaders
      let prog: WebGLProgram;
      try {
        prog = mkProg(gl, VERT, FRAG);
      } catch (e) {
        console.error("[SkillCanvas] shader:", e);
        return;
      }

      const N      = 5000;
      const aspect = H / W; // pour corriger la déformation en ortho

      // Positions chaos : NDC plein écran, dispersées
      const chaosArr  = new Float32Array(N * 3);
      const targetArr = new Float32Array(N * 3);
      const delayArr  = new Float32Array(N);
      const sizeArr   = new Float32Array(N);
      const colorArr  = new Float32Array(N * 3);

      for (let i = 0; i < N; i++) {
        // Sphère aléatoire en NDC
        const r   = 0.3 + Math.random() * 0.7;
        const phi = Math.acos(2 * Math.random() - 1);
        const th  = Math.random() * Math.PI * 2;
        chaosArr[i*3]   = r * Math.sin(phi) * Math.cos(th);
        chaosArr[i*3+1] = r * Math.sin(phi) * Math.sin(th) * aspect;
        chaosArr[i*3+2] = 0;

        // Cible = chaos par défaut (évite flash)
        targetArr[i*3]   = chaosArr[i*3];
        targetArr[i*3+1] = chaosArr[i*3+1];
        targetArr[i*3+2] = 0;

        delayArr[i] = Math.random() * 0.5;
        sizeArr[i]  = 0.6 + Math.random() * 1.4;
        colorArr[i*3]   = 0.18 + Math.random() * 0.22;
        colorArr[i*3+1] = 0.20 + Math.random() * 0.18;
        colorArr[i*3+2] = 0.52 + Math.random() * 0.28;
      }

      const bufChaos  = mkBuf(gl, chaosArr);
      const bufTarget = mkBuf(gl, targetArr, true);
      const bufColor  = mkBuf(gl, colorArr,  true);
      const bufDelay  = mkBuf(gl, delayArr);
      const bufSize   = mkBuf(gl, sizeArr);

      // Rasteriser le texte
      const tgt = rasteriseSkills(skills, N, Math.round(W), Math.round(H));
      // Corriger Y pour le ratio
      for (let i = 0; i < N; i++) {
        tgt.positions[i * 3 + 1] *= aspect;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, bufTarget);
      gl.bufferData(gl.ARRAY_BUFFER, tgt.positions, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufColor);
      gl.bufferData(gl.ARRAY_BUFFER, tgt.colors, gl.DYNAMIC_DRAW);

      gl.useProgram(prog);

      const uProgress = gl.getUniformLocation(prog, "uProgress")!;
      const uTime     = gl.getUniformLocation(prog, "uTime")!;
      const uAspect   = gl.getUniformLocation(prog, "uAspect")!;

      gl.uniform1f(uProgress, 0);
      gl.uniform1f(uTime,     0);
      gl.uniform1f(uAspect,   1.0); // déjà corrigé dans les positions

      let progress = 0;

      // ScrollTrigger
      const st = ScrollTrigger.create({
        trigger: scrollTriggerEl,
        start:   "top 70%",
        end:     "bottom 30%",
        scrub:   1.2,
        onUpdate:    (s) => { progress = s.progress; },
        onLeave:     ()  => { progress = 1; },
        onLeaveBack: ()  => { progress = 0; },
      });

      // Boucle de rendu
      let prevT = 0;
      const tick = (t: number) => {
        rafRef.current = requestAnimationFrame(tick);
        if (t - prevT < 13) return;
        prevT = t;

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(prog);
        gl.uniform1f(uTime,     t * 0.001);
        gl.uniform1f(uProgress, progress);

        setAttr(gl, prog, "aPos",    bufChaos,  3);
        setAttr(gl, prog, "aTarget", bufTarget, 3);
        setAttr(gl, prog, "aColor",  bufColor,  3);
        setAttr(gl, prog, "aDelay",  bufDelay,  1);
        setAttr(gl, prog, "aSize",   bufSize,   1);

        gl.drawArrays(gl.POINTS, 0, N);
      };
      rafRef.current = requestAnimationFrame(tick);

      // Cleanup
      const cleanup = () => {
        cancelAnimationFrame(rafRef.current);
        st.kill();
        gl.deleteProgram(prog);
        [bufChaos, bufTarget, bufColor, bufDelay, bufSize]
          .forEach(b => gl.deleteBuffer(b));
      };

      // Stocker le cleanup dans le canvas pour le useEffect return
      (canvas as any)._cleanup = cleanup;
    };

    // ResizeObserver pour récupérer les vraies dimensions après mount
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        init(width, height);
        ro.disconnect(); // on n'a besoin que de la première mesure
      }
    });
    ro.observe(canvas);

    return () => {
      ro.disconnect();
      if ((canvas as any)._cleanup) (canvas as any)._cleanup();
    };
  }, [scrollTriggerEl]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%", position: "absolute", inset: 0 }}
    />
  );
}

// ─── Helpers DOM ──────────────────────────────────────────────────────────────
const SignalIcon = ({ active }: { active: boolean }) => (
  <svg width="36" height="14" viewBox="0 0 36 14" fill="none"
    style={{ opacity: active ? 1 : 0, transition: "opacity 0.4s ease", flexShrink: 0 }}>
    <polyline points="0,7 4,7 6,1 8,13 10,7 16,7 18,2 20,12 22,7 28,7 32,4 36,7"
      stroke="#F0C427" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

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

function CatLegend({ skills }: { skills: SkillTag[] }) {
  const cats = [...new Set(skills.map(s => s.category))] as SkillCategory[];
  const LABELS: Record<SkillCategory, string> = {
    technique: "Technique", outil: "Outil", contexte: "Contexte",
  };
  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.14)", textTransform: "uppercase" }}>couleurs</span>
      {cats.map(cat => (
        <span key={cat} style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.14em", color: CAT_HEX[cat], textTransform: "uppercase" }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: CAT_HEX[cat] }} />
          {LABELS[cat]}
        </span>
      ))}
    </div>
  );
}

// ─── Wrapper pour passer la ref stable au SkillCanvas ─────────────────────────
function SkillZone({ skills, index }: { skills: SkillTag[]; index: number }) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const [el, setEl] = useState<HTMLDivElement | null>(null);

  // Transmettre la ref au SkillCanvas une fois que le div est monté
  useEffect(() => {
    if (zoneRef.current) setEl(zoneRef.current);
  }, []);

  return (
    <div
      ref={zoneRef}
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(280px, 50vh, 480px)",
        background: "#07080d",
        borderRadius: "2px",
        overflow: "hidden",
      }}
    >
      {el && (
        <SkillCanvas skills={skills} scrollTriggerEl={el} />
      )}
      <div style={{
        position: "absolute", bottom: "16px", left: "50%",
        transform: "translateX(-50%)",
        fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.20em",
        color: "rgba(255,255,255,0.08)", textTransform: "uppercase",
        pointerEvents: "none", whiteSpace: "nowrap",
      }}>scroll ↓</div>
    </div>
  );
}

// ─── Section principale ────────────────────────────────────────────────────────
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
        start: "top 55%", end: "bottom 45%",
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
        <div style={{ paddingTop: "clamp(80px,12vh,140px)", paddingBottom: "clamp(40px,6vh,80px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 style={{ fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
            EXPÉRIENCES
          </h2>
        </div>

        {/* Deux colonnes */}
        <div style={{ display: "grid", gridTemplateColumns: "22% 1fr", gap: "0 5vw", paddingTop: "clamp(60px,8vh,100px)" }}>

          {/* Left sticky */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "sticky", top: "30vh", display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: "monospace", fontSize: "clamp(4rem,8vw,7rem)", fontWeight: 700, color: "#fff", lineHeight: 1, letterSpacing: "-0.06em" }}>
                {String(activeIdx + 1).padStart(2, "0")}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", marginBottom: "clamp(28px,4vh,48px)" }}>
                — {String(EXPERIENCE.length).padStart(2, "0")}
              </div>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "5px", top: "10px", bottom: "10px", width: "1px", background: "rgba(255,255,255,0.1)" }} />
                {EXPERIENCE.map((exp, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "10px 0", position: "relative" }}>
                    <div style={{
                      width: "11px", height: "11px", borderRadius: "50%",
                      border: `1px solid ${activeIdx === i ? "#F0C427" : "rgba(255,255,255,0.2)"}`,
                      background: activeIdx === i ? "#F0C427" : "transparent",
                      flexShrink: 0, transition: "all 0.35s ease", zIndex: 1,
                    }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.12em", color: activeIdx === i ? "#F0C427" : "rgba(255,255,255,0.25)", transition: "color 0.35s ease" }}>
                        {exp.shortYear}
                      </span>
                      <span style={{ fontSize: "11px", lineHeight: 1.2, maxWidth: "110px", color: activeIdx === i ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)", transition: "color 0.35s ease" }}>
                        {exp.company.split("—")[0].trim()}
                      </span>
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
                  paddingBottom: "clamp(20px,3vh,40px)",
                  borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", width: "100%", marginBottom: "clamp(28px,4vh,48px)" }}>
                  <div style={{ position: "relative", width: "100%", height: "clamp(220px,38vh,480px)", overflow: "hidden" }}>
                    <Image src={exp.image} alt={exp.company} fill
                      sizes="(max-width:1400px) 70vw, 900px"
                      style={{ objectFit: "cover", objectPosition: "center 30%" }}
                      priority={i === 0}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(5,6,15,.08) 0%,rgba(5,6,15,0) 40%,rgba(5,6,15,.7) 78%,rgba(5,6,15,1) 100%)" }} />
                    <div style={{ position: "absolute", top: "18px", left: "20px", fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.25em", color: activeIdx === i ? "#F0C427" : "rgba(255,255,255,0.35)", transition: "color 0.35s ease" }}>
                      {String(i + 1).padStart(2, "0")} ——
                    </div>
                    <div style={{ position: "absolute", top: "18px", right: "20px", fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.15em", color: activeIdx === i ? "rgba(240,196,39,.7)" : "rgba(255,255,255,0.3)", transition: "color 0.35s ease" }}>
                      {exp.period}
                    </div>
                  </div>
                  <div style={{ position: "relative", marginTop: "-clamp(24px,4vh,48px)", paddingTop: "clamp(24px,4vh,48px)", background: "linear-gradient(to bottom,transparent,#05060f 35%)" }}>
                    <h3 style={{ fontSize: "clamp(1.15rem,1.8vw,2rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.0, marginBottom: "clamp(10px,1.5vh,16px)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {exp.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", fontFamily: "monospace", fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>
                      <span style={{ color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{exp.company}</span>
                      <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Séparateur */}
                <div style={{ height: "1px", width: "100%", background: activeIdx === i ? "linear-gradient(to right,#F0C427 0%,rgba(107,117,199,.3) 40%,rgba(255,255,255,.04) 100%)" : "rgba(255,255,255,0.06)", transition: "background 0.6s ease", marginBottom: "clamp(24px,3.5vh,40px)" }} />

                {/* Description */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 clamp(24px,3vw,48px)", marginBottom: "clamp(40px,5vh,56px)" }}>
                  {exp.description.map((para, j) => (
                    <p key={j} style={{ fontSize: "clamp(12px,1.2vw,14px)", color: "rgba(255,255,255,0.42)", lineHeight: 1.85, textAlign: "justify", hyphens: "auto" }}>
                      <HighlightedText text={para} highlights={exp.highlights} />
                    </p>
                  ))}
                </div>

                {/* Header compétences */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "clamp(10px,1.5vh,16px)", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: "clamp(12px,1.5vh,20px)" }}>
                  <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)" }}>
                    Compétences — {(exp.skills as SkillTag[]).length}
                  </span>
                  <CatLegend skills={exp.skills as SkillTag[]} />
                </div>

                {/* Canvas particles inline */}
                <SkillZone skills={exp.skills as SkillTag[]} index={i} />

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;