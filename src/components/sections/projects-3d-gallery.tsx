"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { PROJECTS } from "@/data/projects";

// ─── Shaders ───────────────────────────────────────────────────────────────────

const vert = /* glsl */ `
  uniform vec2 uOffset;
  varying vec2 vUv;
  #define PI 3.14159265358979

  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.y += sin(uv.x * PI) * uOffset.y * 120.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const frag = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float     uProgress;
  uniform float     uAlpha;
  uniform vec3      uC1;
  uniform vec3      uC2;
  uniform float     uHasTex;
  varying vec2      vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    float softEdge = 0.04;
    float grain    = hash(vUv * 480.0) * softEdge;
    float edge     = uProgress * (1.0 + softEdge) - softEdge;
    float reveal   = smoothstep(edge, edge + softEdge, vUv.x + grain);
    if (reveal < 0.01) discard;

    vec4 col;
    if (uHasTex > 0.5) {
      col = texture2D(uTexture, vUv);
    } else {
      vec3 grad = mix(uC1, uC2, vUv.y);
      float n   = fract(sin(dot(vUv * 8.0, vec2(12.9898, 78.233))) * 43758.5453) * 0.06;
      col       = vec4(grad + n, 1.0);
    }

    vec2  vc   = vUv - 0.5;
    float vign = 1.0 - dot(vc, vc) * 0.65;
    col.rgb   *= vign;

    gl_FragColor = vec4(col.rgb, col.a * uAlpha * reveal);
  }
`;

// ─── Couleurs extraites des gradients existants ────────────────────────────────

function hexToVec3(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

// ─── Composant ─────────────────────────────────────────────────────────────────

const ProjectsSection: React.FC = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const anchorRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef      = useRef<number>(0);
  const [activeIdx, setActiveIdx] = useState(0);

  // ── WebGL ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene  = new THREE.Scene();
    const DIST   = 800;
    const getFov = () => 2 * Math.atan(window.innerHeight / 2 / DIST) * (180 / Math.PI);
    const camera = new THREE.PerspectiveCamera(getFov(), window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = DIST;

    const texLoader = new THREE.TextureLoader();
    const planes: THREE.Mesh[] = [];
    const scroll = { last: 0, velocity: 0 };

    PROJECTS.forEach((proj) => {
      const c1 = hexToVec3(proj.gradient[0]);
      const c2 = hexToVec3(proj.gradient[1]);
      const hasTex = !!proj.imageSrc;

      const mat = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
          uTexture:  { value: new THREE.Texture() },
          uOffset:   { value: new THREE.Vector2(0, 0) },
          uProgress: { value: 0 },
          uAlpha:    { value: 1 },
          uC1:       { value: c1 },
          uC2:       { value: c2 },
          uHasTex:   { value: hasTex ? 1 : 0 },
        },
        transparent: true,
        side: THREE.DoubleSide,
      });

      if (hasTex && proj.imageSrc) {
        texLoader.load(proj.imageSrc, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          mat.uniforms.uTexture.value = tex;
        });
      }

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 32, 32), mat);
      scene.add(mesh);
      planes.push(mesh);
    });

    function syncPlanes() {
      planes.forEach((plane, i) => {
        const el = anchorRefs.current[i];
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.width < 2) return;

        const g   = plane.geometry as THREE.PlaneGeometry;
        const pw  = (g.parameters as any).width;
        const ph  = (g.parameters as any).height;
        if (Math.abs(pw - r.width) > 2 || Math.abs(ph - r.height) > 2) {
          plane.geometry.dispose();
          plane.geometry = new THREE.PlaneGeometry(r.width, r.height, 32, 32);
        }

        const camW = 2 * Math.tan((camera.fov * Math.PI / 180) / 2) * DIST;
        const camH = camW / camera.aspect;

        plane.scale.x    = camW * (r.width  / window.innerWidth);
        plane.scale.y    = camH * (r.height / window.innerHeight);
        plane.position.x = -camW / 2 + plane.scale.x / 2 + (r.left   / window.innerWidth)  * camW;
        plane.position.y =  camH / 2 - plane.scale.y / 2 - (r.top    / window.innerHeight) * camH;

        (plane.material as THREE.ShaderMaterial).uniforms.uOffset.value.set(
          0, -scroll.velocity * 0.0006
        );
      });
    }

    function tick() {
      rafRef.current    = requestAnimationFrame(tick);
      scroll.velocity   = window.scrollY - scroll.last;
      scroll.last       = window.scrollY;
      syncPlanes();
      renderer.render(scene, camera);
    }
    tick();

    function onResize() {
      camera.fov    = getFov();
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);
    (canvas as any)._planes = planes;

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      planes.forEach((p) => {
        p.geometry.dispose();
        (p.material as THREE.ShaderMaterial).dispose();
      });
      renderer.dispose();
    };
  }, []);

  // ── ScrollTrigger ──────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tryInit = (): (() => void) => {
      const planes: THREE.Mesh[] | undefined = (canvas as any)._planes;
      if (!planes?.length) {
        const t = setTimeout(tryInit, 80);
        return () => clearTimeout(t);
      }

      const triggers: ScrollTrigger[] = [];

      anchorRefs.current.forEach((el, i) => {
        if (!el || !planes[i]) return;
        const mat = planes[i].material as THREE.ShaderMaterial;

        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            end:   "top 15%",
            scrub: 0.9,
            onUpdate: (self) => { mat.uniforms.uProgress.value = self.progress; },
          })
        );

        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            end:   "bottom 45%",
            onEnter:     () => setActiveIdx(i),
            onEnterBack: () => setActiveIdx(i),
          })
        );
      });

      return () => triggers.forEach((t) => t.kill());
    };

    const cleanup = tryInit();
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      cleanup?.();
    };
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  const proj = PROJECTS[activeIdx];

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{ position: "relative", background: "#05060f", width: "100%" }}
    >
      {/* Canvas WebGL — fixed, pointer-events none */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100vw", height: "100dvh",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 6vw",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Header */}
        <div
          style={{
            paddingTop: "clamp(80px, 12vh, 140px)",
            paddingBottom: "clamp(60px, 8vh, 100px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            Projects
          </h2>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.25)",
              fontFamily: "monospace",
              letterSpacing: "0.15em",
            }}
          >
            {String(PROJECTS.length).padStart(2, "0")} travaux sélectionnés
          </span>
        </div>

        {/* Two columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 8vw",
            paddingTop: "clamp(60px, 8vh, 100px)",
            paddingBottom: "clamp(80px, 12vh, 160px)",
          }}
        >
          {/* Left — anchor divs (WebGL planes sync here) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(80px, 14vh, 160px)",
            }}
          >
            {PROJECTS.map((p, i) => (
              <div key={i} style={{ position: "relative" }}>
                <div
                  style={{
                    fontSize: "10px",
                    fontFamily: "monospace",
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: "0.2em",
                    marginBottom: "14px",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Anchor — le plane WebGL se cale exactement dessus */}
                <div
                  ref={(el) => { anchorRefs.current[i] = el; }}
                  style={{
                    width: "100%",
                    aspectRatio: "4/3",
                    borderRadius: "2px",
                    background: "transparent",
                  }}
                />

                <div
                  style={{
                    marginTop: "16px",
                    fontSize: "10px",
                    fontFamily: "monospace",
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {p.description}
                </div>
              </div>
            ))}
          </div>

          {/* Right — sticky title */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "sticky", top: "35vh" }}>
              {PROJECTS.map((p, i) => (
                <div
                  key={i}
                  style={{
                    position: i === 0 ? "relative" : "absolute",
                    top: 0, left: 0,
                    opacity: activeIdx === i ? 1 : 0,
                    transform: activeIdx === i ? "translateY(0px)" : "translateY(14px)",
                    transition: "opacity 0.45s ease, transform 0.45s ease",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontFamily: "monospace",
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "0.15em",
                      marginBottom: "20px",
                    }}
                  >
                    — {i + 1 < 10 ? "0" : ""}{i + 1}
                  </div>

                  <h3
                    style={{
                      fontSize: "clamp(2.8rem, 5.5vw, 5.2rem)",
                      fontWeight: 700,
                      color: "#fff",
                      letterSpacing: "-0.04em",
                      lineHeight: 1.0,
                      marginBottom: "24px",
                    }}
                  >
                    {p.name}
                  </h3>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.35)",
                      lineHeight: 1.7,
                      maxWidth: "280px",
                    }}
                  >
                    {p.description}
                  </p>

                  {/* Lien */}
                  {p.url && (
                    <a
                      href={p.url}
                      target={p.internal ? "_self" : "_blank"}
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "32px",
                        fontSize: "11px",
                        fontFamily: "monospace",
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "0.15em",
                        textDecoration: "none",
                        borderBottom: "1px solid rgba(255,255,255,0.15)",
                        paddingBottom: "4px",
                        pointerEvents: "auto",
                        transition: "color 0.2s, border-color 0.2s",
                      }}
                    >
                      {p.internal ? "VOIR LE PROJET →" : "VISITER →"}
                    </a>
                  )}

                  <div
                    style={{
                      marginTop: "36px",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                    }}
                  >
                    <div style={{ width: "28px", height: "1px", background: "rgba(255,255,255,0.18)" }} />
                    <span
                      style={{
                        fontSize: "10px",
                        fontFamily: "monospace",
                        color: "rgba(255,255,255,0.18)",
                        letterSpacing: "0.2em",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;