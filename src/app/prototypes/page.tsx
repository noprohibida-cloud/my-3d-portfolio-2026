"use client";

import React, {
  useCallback, useEffect, useLayoutEffect, useRef, useState,
} from "react";
import Image from "next/image";
import {
  motion, useInView, useScroll, useSpring, AnimatePresence,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import localFont from "next/font/local";

gsap.registerPlugin(ScrollTrigger);

const hibana   = localFont({ src: "./Hibana-SubMedium.otf",  display: "swap" });
const vercetti = localFont({ src: "./Vercetti-Regular.woff", display: "swap" });
const TITLE = hibana.style.fontFamily;
const BODY  = vercetti.style.fontFamily;

// ─── Data ────────────────────────────────────────────────────────────────────────
const PHOTOS = [
  { src: "/assets/projects-screenshots/prototypes/insitu-01.jpg", caption: "Vue d\u2019ensemble \u2014 nef du Mus\u00e9e du Saut du Tarn",        num: "001" },
  { src: "/assets/projects-screenshots/prototypes/insitu-02.jpg", caption: "Dispositifs d\u2019exposition \u2014 vitrines modulaires bois",        num: "002" },
  { src: "/assets/projects-screenshots/prototypes/insitu-03.jpg", caption: "Espace L\u2019Invisible \u2014 ballon captif et archives photo",       num: "003" },
  { src: "/assets/projects-screenshots/prototypes/insitu-04.jpg", caption: "Module interactif \u2014 \u00e9cran d\u2019introduction",               num: "004" },
  { src: "/assets/projects-screenshots/prototypes/insitu-05.jpg", caption: "Table d\u2019archives vitr\u00e9es et mur de photographies",           num: "005" },
  { src: "/assets/projects-screenshots/prototypes/insitu-06.jpg", caption: "La Fabrique de l\u2019instrumentation scientifique",                   num: "006" },
  { src: "/assets/projects-screenshots/prototypes/insitu-07.jpg", caption: "Exposition originale \u2014 Mus\u00e9e des Arts et M\u00e9tiers, Paris", num: "007" },
];
const ROLES = [
  { label: "DIRECTION GRAPHIQUE",    color: "#6B75C7" },
  { label: "SC\u00c9NOGRAPHIE",      color: "#F0C427" },
  { label: "MONTAGE VID\u00c9O",     color: "#F0698A" },
  { label: "RECHERCHE SCIENTIFIQUE", color: "#4A8B5C" },
];
const LABS = [
  { acronym: "LIRMM",                       full: "Laboratoire d\u2019Informatique, de Robotique et de Micro-\u00e9lectronique de Montpellier", field: "ROBOTIQUE \u2014 INFORMATIQUE",       color: "#6B75C7" },
  { acronym: "IFREMER",                     full: "Institut Fran\u00e7ais de Recherche pour l\u2019Exploitation de la Mer",                    field: "OC\u00c9ANOGRAPHIE \u2014 BIOLOGIE MARINE", color: "#1A6B8A" },
  { acronym: "ISAE-SUPAERO",                full: "Institut Sup\u00e9rieur de l\u2019A\u00e9ronautique et de l\u2019Espace",                  field: "A\u00c9RONAUTIQUE \u2014 ESPACE",        color: "#2C5FA8" },
  { acronym: "OP\u00c9RATION CANOP\u00c9E", full: "Programme de sciences participatives et recherche en biodiversit\u00e9 foresti\u00e8re",    field: "\u00c9COLOGIE \u2014 BIODIVERSIT\u00c9", color: "#3D7A4A" },
  { acronym: "CNRS",                        full: "Centre National de la Recherche Scientifique",                                              field: "SCIENCES FONDAMENTALES",              color: "#1B3E6F" },
];
const MARQUEE_ITEMS = [
  { label: "LIRMM",                               color: "#6B75C7" },
  { label: "Universit\u00e9 de Montpellier",       color: "#4A8B5C" },
  { label: "PATSTEC",                             color: "rgba(255,255,255,0.7)" },
  { label: "Mus\u00e9e des Arts \u0026 M\u00e9tiers", color: "#F0C427" },
  { label: "CNRS",                                color: "#1B3E6F" },
  { label: "IFREMER",                             color: "#1A6B8A" },
  { label: "Universit\u00e9 de Toulouse",          color: "#CC7054" },
  { label: "ISAE-SUPAERO",                        color: "#2C5FA8" },
  { label: "CNAM",                                color: "#F0698A" },
  { label: "R\u00e9gion Occitanie",               color: "#4A8B5C" },
];

const E   = [0.22, 1, 0.36, 1] as const;
const rUp = { hidden: { opacity: 0, y: 38, filter: "blur(5px)" }, visible: { opacity: 1, y: 0, filter: "blur(0)", transition: { duration: 0.85, ease: E } } };
const rL  = { hidden: { opacity: 0, x: -26 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: E } } };
const sg  = (d = 0) => ({ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: d } } });

// ─── ScrollProgress ───────────────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return React.createElement(motion.div, {
    style: { position: "fixed" as const, top: 0, left: 0, right: 0, height: "1px", backgroundColor: "#F0C427", transformOrigin: "0%", scaleX, zIndex: 100, pointerEvents: "none" as const },
  });
}

// ─── HeroBanner ───────────────────────────────────────────────────────────────────
function HeroBanner() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const tl = gsap.timeline({ delay: 0.05 });
    tl.to(overlayRef.current, { yPercent: -101, duration: 1.15, ease: "expo.inOut" });
    tl.fromTo(imgRef.current, { scale: 1.06 }, { scale: 1, duration: 1.8, ease: "power2.out" }, 0);
    tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: "power3.out" }, 0.75);
  }, []);

  return React.createElement("div", { style: { position: "relative" as const } },
    React.createElement("div", {
      style: { position: "relative" as const, width: "100%", overflow: "hidden", backgroundColor: "#07080d", aspectRatio: "1440/340" },
    },
      React.createElement("div", { ref: imgRef, style: { position: "absolute" as const, inset: "-5%", transformOrigin: "center center" } },
        React.createElement(Image, { src: "/assets/projects-screenshots/prototypes/header.png", alt: "Prototypes", fill: true, priority: true, quality: 100, sizes: "100vw", style: { objectFit: "cover" as const } })
      ),
      React.createElement("div", { style: { position: "absolute" as const, inset: 0, backgroundColor: "#2D3069", opacity: 0.16, mixBlendMode: "color" as const, pointerEvents: "none" as const, zIndex: 2 } }),
      React.createElement("div", { style: { position: "absolute" as const, top: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to bottom,#07080d,transparent)", pointerEvents: "none" as const, zIndex: 3 } }),
      React.createElement("div", { style: { position: "absolute" as const, bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top,#07080d,transparent)", pointerEvents: "none" as const, zIndex: 3 } }),
      React.createElement("div", { ref: overlayRef, style: { position: "absolute" as const, inset: 0, backgroundColor: "#07080d", zIndex: 10, transformOrigin: "top" } })
    ),
    React.createElement("div", { ref: lineRef, style: { height: "1px", backgroundColor: "#F0C427", opacity: 0.45, transformOrigin: "left", transform: "scaleX(0)" } })
  );
}

// ─── Marquee — tous les items remplis (plus d'alternance stroke) ──────────────────
const MARQUEE_SPEED = 0.7;

function Ticker(_: { direction?: string }) {
  const trackRef  = useRef<HTMLDivElement>(null);
  const posRef    = useRef(0);
  const speedRef  = useRef(MARQUEE_SPEED);
  const targetRef = useRef(MARQUEE_SPEED);
  const rafRef    = useRef(0);

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    function tick() {
      if (!el) return;
      const s = speedRef.current, t = targetRef.current;
      speedRef.current = s + (t - s) * (t < s ? 0.055 : 0.038);
      const half = el.scrollWidth / 2;
      posRef.current -= speedRef.current;
      if (posRef.current <= -half) posRef.current += half;
      el.style.transform = `translateX(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return React.createElement("div", {
    style: {
      overflow: "hidden",
      borderTop: "0.5px solid rgba(255,255,255,0.05)",
      borderBottom: "0.5px solid rgba(255,255,255,0.05)",
      paddingTop: "0.85rem", paddingBottom: "0.85rem",
      // Espace augmenté autour de la bande
      marginTop: "3.5rem", marginBottom: "3.5rem",
      backgroundColor: "#07080d",
      cursor: "default",
    },
    onMouseEnter: () => { targetRef.current = 0; },
    onMouseLeave: () => { targetRef.current = MARQUEE_SPEED; },
  },
    React.createElement("div", {
      ref: trackRef,
      style: { display: "flex", alignItems: "baseline", width: "max-content", willChange: "transform", gap: 0 },
    },
      ...items.map((item, i) => {
        const isLast = i === items.length - 1;
        return React.createElement(React.Fragment, { key: i },
          // Tous les items en texte plein — couleur propre à chaque lab
          React.createElement("span", {
            style: {
              fontFamily: TITLE,
              fontSize: "clamp(0.85rem, 1.3vw, 1.1rem)",
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              whiteSpace: "nowrap" as const,
              color: item.color,
              paddingLeft: "2rem",
              paddingRight: "0.2rem",
              userSelect: "none" as const,
            },
          }, item.label),
          !isLast && React.createElement("span", {
            style: { fontFamily: TITLE, fontSize: "0.55rem", color: "rgba(255,255,255,0.12)", userSelect: "none" as const, paddingLeft: "0.2rem" },
          }, "\u2014")
        );
      })
    )
  );
}

// ─── ChromaCard WebGL ─────────────────────────────────────────────────────────────
const CV = `
attribute vec2 p;
varying vec2 uv;
void main(){
  uv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const CF = `
precision highp float;
uniform sampler2D uT;
uniform vec2  uM;
uniform float uS;
varying vec2  uv;
void main(){
  vec2 delta = uv - uM;
  float dist = length(delta);
  vec2 dir = normalize(delta + 1e-5);
  float R = 0.11;
  float t = exp(-pow(dist - R, 2.0) / 0.0025) * uS;
  float amount = t * 0.004;
  vec4 cr  = texture2D(uT, clamp(uv + dir * amount, 0.001, 0.999));
  vec4 cga = texture2D(uT, uv);
  vec4 cb  = texture2D(uT, clamp(uv - dir * amount, 0.001, 0.999));
  gl_FragColor = vec4(cr.r, cga.g, cb.b, 1.0);
}`;

function mkShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src); gl.compileShader(s); return s;
}

function ChromaCard({ src, alt, sizes, onClick }: {
  src: string; alt: string; sizes?: string; onClick: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cvRef   = useRef<HTMLCanvasElement>(null);
  const rafRef  = useRef(0);
  const uRef    = useRef<Record<string, WebGLUniformLocation | null>>({});
  const glRef   = useRef<WebGLRenderingContext | null>(null);
  const ready   = useRef(false);
  const cur     = useRef({ mx:.5, my:.5, tmx:.5, tmy:.5, str:0, tstr:0 });

  useLayoutEffect(() => {
    const cv = cvRef.current, wrap = wrapRef.current;
    if (!cv || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      cv.width  = Math.round(width  * dpr);
      cv.height = Math.round(height * dpr);
      glRef.current?.viewport(0, 0, cv.width, cv.height);
    });
    ro.observe(wrap);
    const gl = cv.getContext("webgl", { antialias: true, alpha: false });
    if (!gl) { ro.disconnect(); return; }
    glRef.current = gl;
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mkShader(gl, gl.VERTEX_SHADER, CV));
    gl.attachShader(prog, mkShader(gl, gl.FRAGMENT_SHADER, CF));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const aP = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(aP);
    gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);
    uRef.current = { uT: gl.getUniformLocation(prog, "uT"), uM: gl.getUniformLocation(prog, "uM"), uS: gl.getUniformLocation(prog, "uS") };
    const img = new window.Image();
    img.onload = () => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      ready.current = true;
    };
    img.src = src;
    function loop() {
      const c = cur.current;
      c.mx += (c.tmx - c.mx) * 0.13; c.my += (c.tmy - c.my) * 0.13; c.str += (c.tstr - c.str) * 0.08;
      if (ready.current && cv.width > 0) {
        gl.viewport(0, 0, cv.width, cv.height);
        gl.uniform1i(uRef.current.uT, 0);
        gl.uniform2f(uRef.current.uM, c.mx, c.my);
        gl.uniform1f(uRef.current.uS, c.str);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    loop();
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [src]);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    cur.current.tmx = (e.clientX - r.left) / r.width;
    cur.current.tmy = 1 - (e.clientY - r.top) / r.height;
  }, []);

  return React.createElement("div", { ref: wrapRef },
    React.createElement("div", {
      style: { position: "relative" as const, aspectRatio: "2/3", overflow: "hidden", borderRadius: "2px", backgroundColor: "#07080d", cursor: "crosshair" },
      onMouseMove: onMove,
      onMouseEnter: () => { cur.current.tstr = 1; },
      onMouseLeave: () => { cur.current.tstr = 0; },
      onClick,
    },
      React.createElement(Image, { src, alt, fill: true, sizes: sizes || "50vw", priority: true, quality: 100, style: { objectFit: "cover" as const } }),
      React.createElement("canvas", { ref: cvRef, width: 1, height: 1, style: { position: "absolute" as const, inset: 0, width: "100%", height: "100%", display: "block" } })
    )
  );
}

// ─── Composants utilitaires ───────────────────────────────────────────────────────
function SectionMark({ n, color, label }: { n: string; color: string; label: string }) {
  return React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" } },
    React.createElement("span", { style: { fontFamily: TITLE, fontSize: "10px", color, letterSpacing: "0.3em" } }, n),
    React.createElement("div",  { style: { height: "0.5px", width: "40px", backgroundColor: color + "50" } }),
    React.createElement("span", { style: { fontFamily: TITLE, fontSize: "8px", letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.22)" } }, label)
  );
}
function SectionTitle({ line1, line2 }: { line1: string; line2?: string }) {
  return React.createElement(motion.div, { variants: rUp, style: { fontFamily: TITLE, fontSize: "clamp(2.2rem,5vw,3.8rem)", lineHeight: 1.0, letterSpacing: "0.02em", marginBottom: "1.75rem", color: "rgba(255,255,255,0.92)" } },
    line1, line2 && React.createElement(React.Fragment, null, React.createElement("br"), React.createElement("span", { style: { color: "transparent", WebkitTextStroke: "0.6px rgba(255,255,255,0.32)" } }, line2))
  );
}
function WordReveal({ text, style, delay = 0 }: { text: string; style?: React.CSSProperties; delay?: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const seen = useInView(ref, { once: true, margin: "-50px" });
  return React.createElement("p", { ref, style },
    ...text.split(" ").map((w, i) => React.createElement(motion.span, { key: i, initial: { opacity: 0, y: 12, filter: "blur(3px)" }, animate: seen ? { opacity: 1, y: 0, filter: "blur(0)" } : {}, transition: { duration: 0.5, ease: E, delay: delay + i * 0.03 }, style: { display: "inline-block", marginRight: "0.28em" } }, w))
  );
}
function Hi({ children, color = "#F0C427" }: { children: string; color?: string }) {
  const [hov, setHov] = useState(false);
  return React.createElement("span", { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false), style: { position: "relative" as const, display: "inline", fontWeight: 500, color: hov ? color : "rgba(255,255,255,0.85)", transition: "color 0.3s", cursor: "default" } },
    children,
    React.createElement(motion.span, { initial: { scaleX: 0 }, whileInView: { scaleX: 1 }, viewport: { once: true }, transition: { duration: 0.6, ease: E, delay: 0.2 }, style: { position: "absolute" as const, left: 0, bottom: 0, height: "0.5px", width: "100%", backgroundColor: color, transformOrigin: "left", display: "block" } })
  );
}
function ZoomImg({ src, alt, aspect = "16/9", sizes = "50vw", onClick }: { src: string; alt: string; aspect?: string; sizes?: string; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return React.createElement("div", { style: { position: "relative" as const, aspectRatio: aspect, overflow: "hidden", borderRadius: "2px", backgroundColor: "#0c0d14" } },
    React.createElement(Image, { src, alt, fill: true, sizes, quality: 100, style: { objectFit: "cover" as const, transform: h ? "scale(1.05)" : "scale(1.01)", transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)", cursor: onClick ? "zoom-in" : "default" } }),
    onClick ? React.createElement("button", { onClick, onMouseEnter: () => setH(true), onMouseLeave: () => setH(false), style: { position: "absolute" as const, inset: 0, background: "none", border: "none", cursor: "zoom-in" } })
             : React.createElement("div",   { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false), style: { position: "absolute" as const, inset: 0 } })
  );
}

// ─── LabCard — layout liste éditorial ────────────────────────────────────────────
// Chaque lab = une ligne horizontale : index · acronyme · nom complet · domaine
// Hover : fond coloré subtil + ligne colorée à gauche + acronyme qui s'illumine
function LabCard({ acronym, full, field, color, index }: {
  acronym: string; full: string; field: string; color: string; index: number;
}) {
  const [hov, setHov] = useState(false);
  const num = String(index + 1).padStart(2, "0");

  return React.createElement(motion.div, {
    variants: rUp,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      display: "grid",
      gridTemplateColumns: "2.5rem 1fr 2fr 1fr",
      alignItems: "center",
      gap: "2rem",
      padding: "1.5rem 0",
      borderBottom: "0.5px solid rgba(255,255,255,0.06)",
      borderLeft: `2px solid ${hov ? color : "transparent"}`,
      paddingLeft: hov ? "1.5rem" : "0",
      backgroundColor: hov ? color + "07" : "transparent",
      transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
      cursor: "default",
    },
  },
    // Index
    React.createElement("span", {
      style: { fontFamily: TITLE, fontSize: "9px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)" },
    }, num),

    // Acronyme — grand, coloré
    React.createElement("div", {
      style: {
        fontFamily: TITLE,
        fontSize: "clamp(0.9rem, 1.4vw, 1.15rem)",
        letterSpacing: "0.06em",
        color: hov ? color : "rgba(255,255,255,0.9)",
        transition: "color 0.35s",
        whiteSpace: "nowrap" as const,
      },
    }, acronym),

    // Nom complet
    React.createElement("div", {
      style: { fontFamily: BODY, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 },
    }, full),

    // Domaine — tag coloré à droite
    React.createElement("div", {
      style: { display: "flex", justifyContent: "flex-end" },
    },
      React.createElement("span", {
        style: {
          fontFamily: TITLE,
          fontSize: "8px",
          letterSpacing: "0.16em",
          textTransform: "uppercase" as const,
          color: hov ? color : color + "88",
          border: `0.5px solid ${hov ? color + "55" : color + "22"}`,
          padding: "3px 10px",
          borderRadius: "0px",
          transition: "all 0.35s",
          whiteSpace: "nowrap" as const,
        },
      }, field)
    )
  );
}

// ─── HorizontalPhotoStrip — scroll vertical → défilement horizontal ──────────────
// Inspiré de nextjs-r3f-fluid-shaders/[id].page.jsx :
//   ScrollTrigger.create({ pin: true, scrub: true })
// Le conteneur est épinglé, le scroll vertical anime translateX de la strip.
function HorizontalPhotoStrip({ onZoom }: { onZoom: (src: string) => void }) {
  const pinRef   = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const pin   = pinRef.current;
    const strip = stripRef.current;
    if (!pin || !strip) return;

    const ctx = gsap.context(() => {
      const totalScroll = strip.scrollWidth - window.innerWidth;
      gsap.to(strip, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          pin: true,
          scrub: 1.2,             // légère inertie, pattern [id].page.jsx scrub:true
          start: "top top",
          end: () => `+=${totalScroll}`,
          invalidateOnRefresh: true,
        },
      });
    }, pin);

    return () => { ctx.kill(); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return React.createElement("div", { ref: pinRef, style: { willChange: "transform" } },
    React.createElement("div", { ref: stripRef, style: { display: "flex", alignItems: "center", gap: "1.25rem", paddingLeft: "2.5rem", paddingRight: "2.5rem", height: "100vh" } },
      // Première cellule : titre de section
      React.createElement("div", { style: { flexShrink: 0, width: "280px" } },
        React.createElement("div", { style: { fontFamily: TITLE, fontSize: "8px", letterSpacing: "0.28em", textTransform: "uppercase" as const, color: "#F0C427", marginBottom: "0.75rem" } }, "02 \u2014 In situ"),
        React.createElement("div", { style: { fontFamily: TITLE, fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1.0, color: "white", marginBottom: "0.75rem" } }, "IN SITU"),
        React.createElement("div", { style: { fontFamily: TITLE, fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1.0, color: "transparent", WebkitTextStroke: "0.6px rgba(255,255,255,0.32)", marginBottom: "1.5rem" } }, "\u2014 LA NEF"),
        React.createElement("p", { style: { fontFamily: BODY, fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, maxWidth: "240px" } }, "Montage de l\u2019exposition dans la nef industrielle du Mus\u00e9e du Saut du Tarn."),
        React.createElement("p", { style: { fontFamily: BODY, fontSize: "11px", color: "rgba(255,255,255,0.28)", marginTop: "1.5rem", letterSpacing: "0.1em" } }, "\u2193 Scroll")
      ),
      // Photos
      ...PHOTOS.map((photo) =>
        React.createElement("div", { key: photo.src, style: { flexShrink: 0, height: "62vh", aspectRatio: "4/3" } },
          React.createElement("div", { style: { position: "relative" as const, width: "100%", height: "100%", borderRadius: "2px", overflow: "hidden", backgroundColor: "#0c0d14", cursor: "zoom-in" }, onClick: () => onZoom(photo.src) },
            React.createElement(Image, { src: photo.src, alt: photo.caption, fill: true, sizes: "600px", quality: 100, style: { objectFit: "cover" as const } }),
            React.createElement("div", { style: { position: "absolute" as const, inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 50%)", pointerEvents: "none" as const } }),
            React.createElement("div", { style: { position: "absolute" as const, bottom: "1rem", left: "1.25rem", right: "1.25rem", pointerEvents: "none" as const } },
              React.createElement("span", { style: { fontFamily: TITLE, fontSize: "8px", color: "#F0C42775", letterSpacing: "0.22em", display: "block", marginBottom: "3px" } }, photo.num),
              React.createElement("p", { style: { fontFamily: BODY, fontSize: "11px", color: "rgba(255,255,255,0.75)", lineHeight: 1.45, margin: 0 } }, photo.caption)
            )
          )
        )
      )
    )
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────────
export default function PrototypesPage() {
  const [lb, setLb] = useState<string | null>(null);

  useEffect(() => {
    if (!lb) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setLb(null); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [lb]);

  return React.createElement(React.Fragment, null,
    React.createElement(ScrollProgress),
    // SideNav supprimée

    React.createElement("div", { style: { backgroundColor: "#07080d", color: "white", minHeight: "100vh", fontFamily: BODY, overflowX: "hidden" } },

      React.createElement(HeroBanner),

      // ── TITRE ─────────────────────────────────────────────────────────────────
      React.createElement("div", { style: { maxWidth: "1280px", margin: "0 auto", padding: "0 2.5rem" } },
        React.createElement("div", { style: { paddingTop: "2.25rem", paddingBottom: "2.75rem", borderBottom: "0.5px solid rgba(255,255,255,0.05)" } },
          React.createElement(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, delay: 0.15, ease: E }, style: { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" } },
            React.createElement("span", { style: { fontFamily: TITLE, fontSize: "8px", color: "#F0C427", letterSpacing: "0.3em", textTransform: "uppercase" as const } }, "Exposition"),
            React.createElement("div",  { style: { height: "0.5px", width: "26px", backgroundColor: "#F0C42750" } }),
            React.createElement("span", { style: { fontFamily: BODY, fontSize: "8px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em" } }, "2023\u20142024 \u2014 Mus\u00e9e du Saut du Tarn")
          ),
          React.createElement(motion.div, {
            initial: "hidden", animate: "visible",
            variants: { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.22 } } },
            style: { fontFamily: TITLE, fontSize: "clamp(3.5rem,9.5vw,8rem)", lineHeight: 0.92, letterSpacing: "0.03em", margin: "0 0 0.1em" },
          },
            ...["PROTO\u2014", "\u2014TYPES"].map((word, i) =>
              React.createElement("div", { key: word, style: { overflow: "hidden", paddingBottom: "0.12em" } },
                React.createElement(motion.span, {
                  variants: { hidden: { y: "105%", opacity: 0 }, visible: { y: "0%", opacity: 1, transition: { duration: 0.85, ease: E } } },
                  style: { display: "block", color: i === 0 ? "white" : "transparent", WebkitTextStroke: i === 0 ? "0" : "0.6px rgba(255,255,255,0.38)" },
                }, word)
              )
            )
          ),
          React.createElement(motion.div, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.82, ease: E }, style: { display: "flex", alignItems: "center", flexWrap: "wrap" as const, gap: "0.875rem", marginTop: "1.5rem" } },
            React.createElement("p", { style: { fontFamily: BODY, fontSize: "14px", color: "rgba(255,255,255,0.45)", margin: 0 } }, "DE L\u2019EXP\u00c9RIMENTATION \u00c0 L\u2019INNOVATION"),
            ...ROLES.map(r => React.createElement("span", { key: r.label, style: { fontFamily: TITLE, fontSize: "9px", letterSpacing: "0.1em", color: r.color, backgroundColor: "transparent", border: "0.5px solid " + r.color + "55", padding: "3px 11px", borderRadius: "0" } }, r.label))
          )
        )
      ),


      // ── INTRO ─────────────────────────────────────────────────────────────────
      React.createElement("div", { id: "intro", style: { maxWidth: "1280px", margin: "0 auto", padding: "0 2.5rem" } },
        React.createElement("section", { style: { paddingTop: "5rem", paddingBottom: "5rem", display: "grid", gridTemplateColumns: "190px 1fr", gap: "5.5rem", alignItems: "start" } },
          React.createElement(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: sg(0.1), style: { position: "sticky" as const, top: "5rem" } },
            ...[{ label: "Lieu", value: "MUS\u00c9E DU SAUT DU TARN \u2014 SAINT-JU\u00c9RY 81160" }, { label: "P\u00e9riode", value: "2023\u20142024" }].map(x =>
              React.createElement(motion.div, { key: x.label, variants: rL, style: { marginBottom: "1.5rem" } },
                React.createElement("div", { style: { fontFamily: TITLE, fontSize: "11px", textTransform: "uppercase" as const, letterSpacing: "0.15em", color: "rgba(255,255,255,0.22)", marginBottom: "5px" } }, x.label),
                React.createElement("div", { style: { fontFamily: BODY, fontSize: "13px", color: "rgba(255,255,255,0.72)", lineHeight: 1.65, whiteSpace: "pre-line" as const } }, x.value)
              )
            ),
            React.createElement(motion.div, { variants: rL },
              React.createElement("div", { style: { fontFamily: TITLE, fontSize: "11px", textTransform: "uppercase" as const, letterSpacing: "0.15em", color: "rgba(255,255,255,0.22)", marginBottom: "0.75rem" } }, "Missions"),
              React.createElement("div", { style: { display: "flex", flexDirection: "column" as const, gap: "0.4rem" } },
                ...ROLES.map(r => React.createElement("div", { key: r.label, style: { display: "flex", alignItems: "center", gap: "0.5rem" } },
                  React.createElement("span", { style: { fontFamily: TITLE, fontSize: "10px", color: r.color, flexShrink: 0, letterSpacing: 0 } }, "\u2014"),
                  React.createElement("span", { style: { fontFamily: TITLE, fontSize: "11px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)" } }, r.label)
                ))
              )
            )
          ),
          React.createElement(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-50px" }, variants: sg() },
            React.createElement(motion.p, { variants: rUp, style: { fontFamily: BODY, fontSize: "clamp(1rem,1.8vw,1.2rem)", color: "rgba(255,255,255,0.72)", lineHeight: 1.9, marginBottom: "1.5rem" } },
              "Exposition itin\u00e9rante imagin\u00e9e et mise en place par l\u2019",
              React.createElement(Hi, { color: "#6B75C7" }, "Universit\u00e9 de Montpellier"),
              " et l\u2019", React.createElement(Hi, { color: "#6B75C7" }, "Universit\u00e9 de Toulouse"),
              ", en collaboration avec le ", React.createElement(Hi, { color: "#F0698A" }, "CNAM"),
              " et la ", React.createElement(Hi, { color: "#4A8B5C" }, "R\u00e9gion Occitanie"),
              " dans le cadre de la mission nationale de sauvegarde et promotion du patrimoine scientifique PATSTEC, \u00e0 l\u2019initiative du ", React.createElement(Hi, { color: "#F0C427" }, "Mus\u00e9e des Arts et M\u00e9tiers"), "."
            ),
            React.createElement(motion.blockquote, { variants: rUp, style: { margin: "2.5rem 0", paddingLeft: "1.625rem", borderLeft: "1px solid #F0C427", fontFamily: TITLE, fontSize: "clamp(1.05rem,2vw,1.4rem)", letterSpacing: "0.02em", color: "rgba(255,255,255,0.88)", lineHeight: 1.5 } },
              "Un projet en partenariat avec plus d\u2019une trentaine de laboratoires d\u2019innovation scientifique, technologique et m\u00e9dicale."
            ),
            React.createElement(motion.div, { variants: rUp },
              React.createElement(WordReveal, { text: "Le fruit de cette collaboration a permis l\u2019exposition au public de plus de 30 prototypes emprunt\u00e9s aux laboratoires et institutions partenaires, lesquels soulignant les prouesses et les talents du territoire occitan en mati\u00e8re d\u2019innovation scientifique.", style: { fontFamily: BODY, fontSize: "15px", color: "rgba(255,255,255,0.62)", lineHeight: 1.9, margin: 0 } })
            )
          )
        )
      ),

      // ── PARTENAIRES ───────────────────────────────────────────────────────────
      React.createElement("div", { id: "partenaires", style: { backgroundColor: "#000000", borderTop: "0.5px solid rgba(255,255,255,0.04)", borderBottom: "0.5px solid rgba(255,255,255,0.04)", padding: "5rem 0" } },
        React.createElement("div", { style: { maxWidth: "1280px", margin: "0 auto", padding: "0 2.5rem" } },
          React.createElement(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true }, variants: sg() },
            React.createElement(motion.div, { variants: rL }, React.createElement(SectionMark, { n: "\u2014", color: "#F0C427", label: "Laboratoires et institutions partenaires" })),
            // Header de la liste
            React.createElement(motion.div, { variants: rUp, style: { display: "grid", gridTemplateColumns: "2.5rem 1fr 2fr 1fr", gap: "2rem", paddingBottom: "0.75rem", borderBottom: "0.5px solid rgba(255,255,255,0.1)", marginBottom: "0.25rem" } },
              React.createElement("span", { style: { fontFamily: TITLE, fontSize: "8px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)" } }, "#"),
              React.createElement("span", { style: { fontFamily: TITLE, fontSize: "8px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" as const } }, "Acronyme"),
              React.createElement("span", { style: { fontFamily: TITLE, fontSize: "8px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" as const } }, "Institution"),
              React.createElement("span", { style: { fontFamily: TITLE, fontSize: "8px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" as const, textAlign: "right" as const } }, "Domaine"),
            ),
            // Lignes
            React.createElement(motion.div, { variants: sg(0.05) },
              ...LABS.map((l, i) => React.createElement(LabCard, { key: l.acronym, ...l, index: i }))
            )
          )
        )
      ),

      React.createElement(Ticker, { direction: "right" }),

      // ── MISSIONS ─────────────────────────────────────────────────────────────
      React.createElement("div", { id: "missions", style: { maxWidth: "1280px", margin: "0 auto", padding: "0 2.5rem" } },
        React.createElement("section", { style: { paddingTop: "2.5rem", paddingBottom: "5rem" } },
          React.createElement(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-80px" }, variants: sg() },
            React.createElement(motion.div, { variants: rL }, React.createElement(SectionMark, { n: "\u2014", color: "#6B75C7", label: "Mon r\u00f4le" })),
            React.createElement(SectionTitle, { line1: "Mes missions :" }),
            React.createElement(motion.div, { variants: rUp, style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" } },
              React.createElement("div", null,
                React.createElement(WordReveal, { text: "Dans le cadre de ma collaboration avec l'Universit\u00e9 de Montpellier, sous l'autorit\u00e9 de la Direction de la Culture Scientifique et du Patrimoine Historique de l'Universit\u00e9, j'ai particip\u00e9 \u00e0 la conception et au montage de l'exposition Prototypes pendant l'ann\u00e9e 2023.", style: { fontFamily: BODY, fontSize: "15px", color: "rgba(255,255,255,0.68)", lineHeight: 1.85, margin: "0 0 1.25rem" } }),
                React.createElement(WordReveal, { delay: 0.3, text: "En coordination directe avec les laboratoires et les institutions partenaires, j'ai pu assurer le transfert des objets emprunt\u00e9s, depuis leurs collections publiques et priv\u00e9es jusqu'au premier itin\u00e9raire de l'exposition, le Mus\u00e9e du Saut du Tarn.", style: { fontFamily: BODY, fontSize: "15px", color: "rgba(255,255,255,0.55)", lineHeight: 1.85, margin: 0 } })
              ),
              React.createElement("div", { style: { display: "flex", flexDirection: "column" as const, gap: "1rem" } },
                ...[
                  { role: "Direction graphique",   desc: "CHARTE VISUELLE \u2014 AFFICHES \u2014 COMMUNICATION \u2014 D\u00c9CLINAISONS PRINTS ET CARTELS D\u2019EXPOSITION", color: "#6B75C7" },
                  { role: "Sc\u00e9nographie",     desc: "CONCEPTION DU PARCOURS VISITEUR \u2014 MONTAGE ET BRICOLAGE IN SITU DES MODULES EN BOIS",           color: "#F0C427" },
                  { role: "Montage vid\u00e9o",     desc: "CAPSULES VID\u00c9O DE PR\u00c9SENTATION DES PROTOTYPES \u2014 DIFFUSION SUR LES BORNES MULTIM\u00c9DIA INTERACTIVES", color: "#F0698A" },
                  { role: "R\u00e9daction cartels", desc: "TEXTES DE M\u00c9DIATION SCIENTIFIQUE EN COORDINATION AVEC LES LABORATOIRES PARTENAIRES",             color: "#4A8B5C" },
                ].map(m => React.createElement(motion.div, { key: m.role, variants: rUp, style: { padding: "1.125rem 1.5rem", borderLeft: "1px solid " + m.color + "55", backgroundColor: m.color + "05" } },
                  React.createElement("div", { style: { fontFamily: TITLE, fontSize: "13px", letterSpacing: "0.1em", color: m.color, marginBottom: "0.2rem" } }, m.role.toUpperCase()),
                  React.createElement("div", { style: { fontFamily: BODY, fontSize: "13px", color: "rgba(255,255,255,0.62)", lineHeight: 1.7 } }, m.desc)
                ))
              )
            )
          )
        )
      ),

      // ── 01 CONCEPTION ─────────────────────────────────────────────────────────
      React.createElement("div", { id: "conception", style: { maxWidth: "1280px", margin: "0 auto", padding: "0 2.5rem" } },
        React.createElement("section", { style: { paddingTop: "2.5rem", paddingBottom: "6rem", borderTop: "0.5px solid rgba(255,255,255,0.04)" } },
          React.createElement(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-80px" }, variants: sg() },
            React.createElement(motion.div, { variants: rL }, React.createElement(SectionMark, { n: "01", color: "#6B75C7", label: "Visuels de l\u2019exposition" })),
            React.createElement(SectionTitle, { line1: "PROTOTYPES", line2: "en images :" }),

            // Affiches ChromaCard
            React.createElement(motion.div, { variants: rUp, style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" } },
              React.createElement(ChromaCard, { src: "/assets/projects-screenshots/prototypes/affiche-jaune.png", alt: "Affiche jaune", sizes: "50vw", onClick: () => setLb("/assets/projects-screenshots/prototypes/affiche-jaune.png") }),
              React.createElement(ChromaCard, { src: "/assets/projects-screenshots/prototypes/affiche-bleue.png", alt: "Affiche bleue",  sizes: "50vw", onClick: () => setLb("/assets/projects-screenshots/prototypes/affiche-bleue.png") })
            ),

            // Bannière
            React.createElement(motion.div, { variants: rUp, style: { marginBottom: "2rem" } },
              React.createElement("div", { style: { position: "relative" as const, width: "100%", borderRadius: "2px", overflow: "hidden", backgroundColor: "#0c0d14", cursor: "zoom-in" }, onClick: () => setLb("/assets/projects-screenshots/prototypes/header-jaune.png") },
                React.createElement(Image, { src: "/assets/projects-screenshots/prototypes/header-jaune.png", alt: "Banni\u00e8re", width: 1440, height: 340, quality: 100, sizes: "100vw", style: { width: "100%", height: "auto", display: "block" } })
              )
            ),

            // Mockups
            React.createElement(motion.div, { variants: rUp, style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "5rem" } },
              React.createElement("div", null,
                React.createElement(ZoomImg, { src: "/assets/projects-screenshots/prototypes/proto-01.png", alt: "Slide", aspect: "16/9", sizes: "28vw", onClick: () => setLb("/assets/projects-screenshots/prototypes/proto-01.png") })
              ),
              React.createElement("div", null,
                React.createElement(ZoomImg, { src: "/assets/projects-screenshots/prototypes/proto-02.png", alt: "D\u00e9pliant", aspect: "16/9", sizes: "28vw", onClick: () => setLb("/assets/projects-screenshots/prototypes/proto-02.png") })
              )
            ),

            // Remplacement du bloc SHERPA par proto-03
            React.createElement(motion.div, { variants: rUp },
              React.createElement(ZoomImg, { src: "/assets/projects-screenshots/prototypes/proto-03.png", alt: "Maquettes cartels", aspect: "16/7", sizes: "80vw", onClick: () => setLb("/assets/projects-screenshots/prototypes/proto-03.png") })
            )
          )
        )
      ),

      // ── 02 IN SITU — HorizontalPhotoStrip ─────────────────────────────────────
      React.createElement("div", { id: "insitu" },
        React.createElement(HorizontalPhotoStrip, { onZoom: setLb })
      )
    ),

    // ── LIGHTBOX ──────────────────────────────────────────────────────────────
    React.createElement(AnimatePresence, null,
      lb && React.createElement(motion.div, { key: "lb", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.18 }, onClick: () => setLb(null), style: { position: "fixed" as const, inset: 0, zIndex: 9999, backgroundColor: "rgba(0,0,0,0.97)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", cursor: "zoom-out" } },
        React.createElement(motion.div, { initial: { scale: 0.88, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.92, opacity: 0 }, transition: { type: "spring", stiffness: 280, damping: 26 }, onClick: (e: React.MouseEvent) => e.stopPropagation(), style: { position: "relative" as const } },
          React.createElement(Image, { src: lb, alt: "Agrandissement", width: 1800, height: 1200, quality: 100, style: { maxWidth: "93vw", maxHeight: "91vh", width: "auto", height: "auto", objectFit: "contain" as const, borderRadius: "2px" } }),
          React.createElement("button", { onClick: () => setLb(null), style: { position: "absolute" as const, top: "0.5rem", right: "0.5rem", width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.75)", border: "0.5px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" } },
            React.createElement("svg", { width: "8", height: "8", viewBox: "0 0 8 8", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" },
              React.createElement("line", { x1: "1", y1: "1", x2: "7", y2: "7" }),
              React.createElement("line", { x1: "7", y1: "1", x2: "1", y2: "7" })
            )
          )
        )
      )
    )
  );
}